"""
RealPay Integration Service for Namibia
Handles EnDO and Payouts integration with RealPay API
"""

import httpx
import hmac
import hashlib
import json
from typing import Dict, Any, Optional, List
from decimal import Decimal
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

class RealPayConfig:
    """RealPay configuration for Namibia"""
    
    # Test credentials
    TEST_MERCHANT_ID = "9BA5008C-08EE-4286-A349-54AF91A621B0"
    TEST_APPLICATION_ID = "4196B0B8-DB88-42E5-A06D-294A5E4DED87"
    TEST_JWT_SECRET = "yglTxLCSMm7PEsfaMszAKf2LSRvM2qVW3D"
    
    # URLs
    TEST_BASE_URL = "https://staging-apiv3.realpay.co.za"
    PROD_BASE_URL = "https://apiv3.realpay.co.za"
    
    # Pricing (Namibian Dollars)
    MONTHLY_ENDO_FEE = Decimal("770.00")
    MONTHLY_PAYOUTS_FEE = Decimal("150.00")
    USER_FEE = Decimal("87.50")
    ACTIVATION_FEE = Decimal("3064.50")
    TRAINING_FEE = Decimal("1054.50")
    
    # Transaction fees (sliding scale)
    TRANSACTION_FEES = {
        "0-500": Decimal("9.88"),
        "501-1000": Decimal("9.12"),
        "1001-1500": Decimal("8.79"),
        "1501-2000": Decimal("8.57"),
        "2000+": Decimal("8.35")
    }
    
    # SMS fees
    SMS_FEE = Decimal("1.05")

class RealPayTransactionRequest(BaseModel):
    """RealPay transaction request model"""
    merchant_uid: str
    application_uid: str
    amount: Decimal
    merchant_reference: str
    currency_code: str = "NAD"
    description: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    callback_url: Optional[str] = None

class RealPayTransactionResponse(BaseModel):
    """RealPay transaction response model"""
    transaction_id: str
    status: str
    status_code: int
    status_message: str
    amount: Decimal
    currency_code: str
    merchant_reference: str
    transaction_fee: Decimal
    net_amount: Decimal
    created_at: datetime
    updated_at: datetime

class RealPayMandateRequest(BaseModel):
    """RealPay mandate request model"""
    merchant_uid: str
    application_uid: str
    customer_name: str
    customer_id_number: str
    customer_phone: str
    customer_email: str
    bank_code: str
    account_number: str
    account_type: str = "savings"  # savings or current
    mandate_reference: str
    amount: Decimal
    frequency: str = "monthly"  # monthly, weekly, daily
    start_date: datetime
    end_date: Optional[datetime] = None

class RealPayMandateResponse(BaseModel):
    """RealPay mandate response model"""
    mandate_id: str
    status: str
    status_code: int
    status_message: str
    mandate_reference: str
    customer_name: str
    amount: Decimal
    frequency: str
    created_at: datetime
    next_debit_date: Optional[datetime] = None

class RealPayService:
    """RealPay integration service for Namibia"""
    
    def __init__(self, merchant_id: str, application_id: str, jwt_secret: str, 
                 is_production: bool = False):
        self.merchant_id = merchant_id
        self.application_id = application_id
        self.jwt_secret = jwt_secret
        self.base_url = RealPayConfig.PROD_BASE_URL if is_production else RealPayConfig.TEST_BASE_URL
        self.client = httpx.AsyncClient(timeout=30.0)
    
    def _generate_jwt_token(self, payload: Dict[str, Any]) -> str:
        """Generate JWT token for RealPay API"""
        import jwt
        
        # Add required fields
        payload.update({
            "iss": "Buffr Host",
            "cuid": self.merchant_id,
            "auid": self.application_id,
            "iat": datetime.utcnow().timestamp(),
            "exp": (datetime.utcnow() + timedelta(hours=1)).timestamp()
        })
        
        return jwt.encode(payload, self.jwt_secret, algorithm="HS256")
    
    def _generate_hmac(self, data: str) -> str:
        """Generate HMAC for callback verification"""
        return hmac.new(
            self.jwt_secret.encode(),
            data.encode(),
            hashlib.md5
        ).hexdigest()
    
    async def initiate_transaction(self, request: RealPayTransactionRequest) -> RealPayTransactionResponse:
        """Initiate a transaction with RealPay EnDO"""
        try:
            # Generate JWT token
            token_payload = {
                "amount": str(request.amount),
                "mref": request.merchant_reference,
                "currency": request.currency_code
            }
            token = self._generate_jwt_token(token_payload)
            
            # Prepare request data
            request_data = {
                "merchantUid": request.merchant_uid,
                "applicationUid": request.application_uid,
                "amount": float(request.amount),
                "merchantReference": request.merchant_reference,
                "currencyCode": request.currency_code,
                "description": request.description or f"Payment for {request.merchant_reference}",
                "customerName": request.customer_name,
                "customerEmail": request.customer_email,
                "customerPhone": request.customer_phone,
                "callbackUrl": request.callback_url,
                "token": token
            }
            
            # Make API call
            response = await self.client.post(
                f"{self.base_url}/products/payments/v1/endo/initiate",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return RealPayTransactionResponse(
                    transaction_id=data.get("transactionId", ""),
                    status=data.get("status", "pending"),
                    status_code=data.get("statusCode", 200),
                    status_message=data.get("statusMessage", "Transaction initiated"),
                    amount=Decimal(str(data.get("amount", 0))),
                    currency_code=data.get("currencyCode", "NAD"),
                    merchant_reference=data.get("merchantReference", ""),
                    transaction_fee=self._calculate_transaction_fee(request.amount),
                    net_amount=Decimal(str(data.get("amount", 0))) - self._calculate_transaction_fee(request.amount),
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )
            else:
                raise Exception(f"RealPay API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"RealPay transaction initiation failed: {str(e)}")
            raise
    
    async def create_mandate(self, request: RealPayMandateRequest) -> RealPayMandateResponse:
        """Create a debit order mandate"""
        try:
            # Generate JWT token
            token_payload = {
                "amount": str(request.amount),
                "mref": request.mandate_reference,
                "customerId": request.customer_id_number
            }
            token = self._generate_jwt_token(token_payload)
            
            # Prepare request data
            request_data = {
                "merchantUid": request.merchant_uid,
                "applicationUid": request.application_uid,
                "customerName": request.customer_name,
                "customerIdNumber": request.customer_id_number,
                "customerPhone": request.customer_phone,
                "customerEmail": request.customer_email,
                "bankCode": request.bank_code,
                "accountNumber": request.account_number,
                "accountType": request.account_type,
                "mandateReference": request.mandate_reference,
                "amount": float(request.amount),
                "frequency": request.frequency,
                "startDate": request.start_date.isoformat(),
                "endDate": request.end_date.isoformat() if request.end_date else None,
                "token": token
            }
            
            # Make API call
            response = await self.client.post(
                f"{self.base_url}/products/mandates/v1/create",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return RealPayMandateResponse(
                    mandate_id=data.get("mandateId", ""),
                    status=data.get("status", "pending"),
                    status_code=data.get("statusCode", 200),
                    status_message=data.get("statusMessage", "Mandate created"),
                    mandate_reference=data.get("mandateReference", ""),
                    customer_name=data.get("customerName", ""),
                    amount=Decimal(str(data.get("amount", 0))),
                    frequency=data.get("frequency", "monthly"),
                    created_at=datetime.utcnow(),
                    next_debit_date=datetime.fromisoformat(data.get("nextDebitDate")) if data.get("nextDebitDate") else None
                )
            else:
                raise Exception(f"RealPay mandate creation failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"RealPay mandate creation failed: {str(e)}")
            raise
    
    async def process_payout(self, amount: Decimal, beneficiary_account: str, 
                           beneficiary_name: str, reference: str) -> Dict[str, Any]:
        """Process a payout to a beneficiary account"""
        try:
            # Generate JWT token
            token_payload = {
                "amount": str(amount),
                "reference": reference,
                "beneficiary": beneficiary_name
            }
            token = self._generate_jwt_token(token_payload)
            
            # Prepare request data
            request_data = {
                "merchantUid": self.merchant_id,
                "applicationUid": self.application_id,
                "amount": float(amount),
                "beneficiaryAccount": beneficiary_account,
                "beneficiaryName": beneficiary_name,
                "reference": reference,
                "token": token
            }
            
            # Make API call
            response = await self.client.post(
                f"{self.base_url}/products/payouts/v1/process",
                json=request_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"RealPay payout failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            logger.error(f"RealPay payout failed: {str(e)}")
            raise
    
    def _calculate_transaction_fee(self, amount: Decimal) -> Decimal:
        """Calculate transaction fee based on sliding scale"""
        amount_float = float(amount)
        
        if amount_float <= 500:
            return RealPayConfig.TRANSACTION_FEES["0-500"]
        elif amount_float <= 1000:
            return RealPayConfig.TRANSACTION_FEES["501-1000"]
        elif amount_float <= 1500:
            return RealPayConfig.TRANSACTION_FEES["1001-1500"]
        elif amount_float <= 2000:
            return RealPayConfig.TRANSACTION_FEES["1501-2000"]
        else:
            return RealPayConfig.TRANSACTION_FEES["2000+"]
    
    async def get_transaction_status(self, transaction_id: str) -> Dict[str, Any]:
        """Get transaction status"""
        try:
            response = await self.client.get(
                f"{self.base_url}/products/payments/v1/status/{transaction_id}",
                headers={"Authorization": f"Bearer {self._generate_jwt_token({})}"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Failed to get transaction status: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Failed to get transaction status: {str(e)}")
            raise
    
    async def verify_callback(self, data: str, hmac_header: str) -> bool:
        """Verify RealPay callback authenticity"""
        expected_hmac = self._generate_hmac(data)
        return hmac.compare_digest(expected_hmac, hmac_header)
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Factory function
def create_realpay_service(is_production: bool = False) -> RealPayService:
    """Create RealPay service instance"""
    if is_production:
        # Production credentials should be loaded from environment
        merchant_id = "PROD_MERCHANT_ID"  # Load from env
        application_id = "PROD_APPLICATION_ID"  # Load from env
        jwt_secret = "PROD_JWT_SECRET"  # Load from env
    else:
        merchant_id = RealPayConfig.TEST_MERCHANT_ID
        application_id = RealPayConfig.TEST_APPLICATION_ID
        jwt_secret = RealPayConfig.TEST_JWT_SECRET
    
    return RealPayService(merchant_id, application_id, jwt_secret, is_production)
