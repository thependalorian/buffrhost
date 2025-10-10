"""
Buffr Host Payment Service
Comprehensive payment processing, gateway integration, and transaction management for Buffr Host platform
"""

import os
import uuid
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager
from enum import Enum

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
import jwt
import httpx
from supabase import create_client, Client
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
supabase_client: Optional[Client] = None
security = HTTPBearer()

# JWT Configuration
JWT_ACCESS_SECRET = os.getenv("JWT_ACCESS_SECRET", "buffr-host-access-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

# Payment Gateway Configuration
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"

class PaymentMethod(str, Enum):
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    DIGITAL_WALLET = "digital_wallet"
    CASH = "cash"
    STRIPE = "stripe"
    PAYPAL = "paypal"

class TransactionType(str, Enum):
    PAYMENT = "payment"
    REFUND = "refund"
    CHARGEBACK = "chargeback"
    DISPUTE = "dispute"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Payment Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import PaymentserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = PaymentserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Payment Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Payment Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Payment Service Service...")# Create FastAPI app
app = FastAPI(
    title="Buffr Host Payment Service",
    description="Payment processing, gateway integration, and transaction management for Buffr Host platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Pydantic Models
class PaymentRequest(BaseModel):
    order_id: str
    amount: float = Field(..., gt=0)
    currency: str = Field(default="USD", regex="^[A-Z]{3}$")
    payment_method: PaymentMethod
    customer_id: str
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    # Card payment details (for direct card processing)
    card_number: Optional[str] = None
    card_exp_month: Optional[int] = Field(None, ge=1, le=12)
    card_exp_year: Optional[int] = Field(None, ge=2024)
    card_cvv: Optional[str] = None
    cardholder_name: Optional[str] = None
    
    # Digital wallet details
    wallet_type: Optional[str] = None  # apple_pay, google_pay, etc.
    wallet_token: Optional[str] = None

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    amount: float
    currency: str
    payment_method: PaymentMethod
    status: PaymentStatus
    gateway_transaction_id: Optional[str]
    gateway_response: Optional[Dict[str, Any]]
    failure_reason: Optional[str]
    created_at: str
    updated_at: str

class RefundRequest(BaseModel):
    payment_id: str
    amount: Optional[float] = None  # None for full refund
    reason: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class RefundResponse(BaseModel):
    id: str
    payment_id: str
    amount: float
    status: PaymentStatus
    gateway_refund_id: Optional[str]
    gateway_response: Optional[Dict[str, Any]]
    failure_reason: Optional[str]
    created_at: str

class WebhookEvent(BaseModel):
    event_type: str
    gateway: str
    transaction_id: str
    data: Dict[str, Any]
    signature: Optional[str] = None

# Utility Functions
def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_ACCESS_SECRET, algorithms=[JWT_ALGORITHM])
        
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def generate_transaction_id() -> str:
    """Generate unique transaction ID"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"TXN-{timestamp}-{random_suffix}"

def validate_card_number(card_number: str) -> bool:
    """Validate credit card number using Luhn algorithm"""
    def luhn_check(card_num):
        def digits_of(n):
            return [int(d) for d in str(n)]
        digits = digits_of(card_num)
        odd_digits = digits[-1::-2]
        even_digits = digits[-2::-2]
        checksum = sum(odd_digits)
        for d in even_digits:
            checksum += sum(digits_of(d*2))
        return checksum % 10 == 0
    
    # Remove spaces and dashes
    card_number = card_number.replace(" ", "").replace("-", "")
    
    # Check if it's numeric and has valid length
    if not card_number.isdigit() or len(card_number) < 13 or len(card_number) > 19:
        return False
    
    return luhn_check(int(card_number))

# Payment Gateway Integrations
class StripeGateway:
    """Stripe payment gateway integration"""
    
    def __init__(self):
        self.secret_key = STRIPE_SECRET_KEY
        self.base_url = "https://api.stripe.com/v1"
    
    async def create_payment_intent(self, amount: float, currency: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create Stripe payment intent"""
        if not self.secret_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Stripe not configured"
            )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/payment_intents",
                data={
                    "amount": int(amount * 100),  # Convert to cents
                    "currency": currency.lower(),
                    "metadata": metadata
                },
                auth=(self.secret_key, "")
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Stripe error: {response.text}"
                )
            
            return response.json()
    
    async def confirm_payment_intent(self, payment_intent_id: str) -> Dict[str, Any]:
        """Confirm Stripe payment intent"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/payment_intents/{payment_intent_id}/confirm",
                auth=(self.secret_key, "")
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Stripe confirmation error: {response.text}"
                )
            
            return response.json()
    
    async def create_refund(self, payment_intent_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """Create Stripe refund"""
        data = {"payment_intent": payment_intent_id}
        if amount:
            data["amount"] = int(amount * 100)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/refunds",
                data=data,
                auth=(self.secret_key, "")
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Stripe refund error: {response.text}"
                )
            
            return response.json()

class PayPalGateway:
    """PayPal payment gateway integration"""
    
    def __init__(self):
        self.client_id = PAYPAL_CLIENT_ID
        self.client_secret = PAYPAL_CLIENT_SECRET
        self.mode = PAYPAL_MODE
        self.base_url = "https://api-m.sandbox.paypal.com" if self.mode == "sandbox" else "https://api-m.paypal.com"
        self.access_token = None
    
    async def get_access_token(self) -> str:
        """Get PayPal access token"""
        if not self.client_id or not self.client_secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="PayPal not configured"
            )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                data={"grant_type": "client_credentials"},
                auth=(self.client_id, self.client_secret)
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"PayPal auth error: {response.text}"
                )
            
            token_data = response.json()
            self.access_token = token_data["access_token"]
            return self.access_token
    
    async def create_order(self, amount: float, currency: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Create PayPal order"""
        if not self.access_token:
            await self.get_access_token()
        
        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency,
                    "value": str(amount)
                },
                "custom_id": metadata.get("order_id", ""),
                "description": metadata.get("description", "")
            }]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders",
                json=order_data,
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code != 201:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"PayPal order creation error: {response.text}"
                )
            
            return response.json()
    
    async def capture_order(self, order_id: str) -> Dict[str, Any]:
        """Capture PayPal order"""
        if not self.access_token:
            await self.get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers={"Authorization": f"Bearer {self.access_token}"}
            )
            
            if response.status_code != 201:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"PayPal capture error: {response.text}"
                )
            
            return response.json()

# Initialize payment gateways
stripe_gateway = StripeGateway()
paypal_gateway = PayPalGateway()

# Authentication Dependencies
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    # Get user from database
    result = supabase_client.table("users").select("*").eq("id", payload["sub"]).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    user = result.data[0]
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    return user

async def require_role(required_role: str):
    """Require specific role for endpoint access"""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user["role"]
        
        # Role hierarchy: admin > manager > staff > customer
        role_hierarchy = {"admin": 4, "manager": 3, "staff": 2, "customer": 1}
        
        if role_hierarchy.get(user_role, 0) < role_hierarchy.get(required_role, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {required_role}"
            )
        
        return current_user
    
    return role_checker

# API Endpoints
@app.post("/payments", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new payment"""
    try:
        # Validate order exists
        order_result = supabase_client.table("orders").select("*").eq("id", payment_data.order_id).execute()
        
        if not order_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order not found"
            )
        
        order = order_result.data[0]
        
        # Validate payment amount matches order total
        if abs(payment_data.amount - order["total_amount"]) > 0.01:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment amount does not match order total"
            )
        
        # Validate card details if provided
        if payment_data.payment_method == PaymentMethod.CARD:
            if not all([payment_data.card_number, payment_data.card_exp_month, 
                       payment_data.card_exp_year, payment_data.card_cvv]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Card details are required for card payments"
                )
            
            if not validate_card_number(payment_data.card_number):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid card number"
                )
        
        # Create payment record
        payment_id = str(uuid.uuid4())
        transaction_id = generate_transaction_id()
        
        payment_record = {
            "id": payment_id,
            "order_id": payment_data.order_id,
            "transaction_id": transaction_id,
            "amount": payment_data.amount,
            "currency": payment_data.currency,
            "payment_method": payment_data.payment_method.value,
            "status": PaymentStatus.PENDING.value,
            "customer_id": payment_data.customer_id,
            "description": payment_data.description,
            "metadata": payment_data.metadata or {},
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Process payment based on method
        gateway_response = None
        gateway_transaction_id = None
        payment_status = PaymentStatus.PENDING
        
        try:
            if payment_data.payment_method == PaymentMethod.STRIPE:
                # Process with Stripe
                intent_data = await stripe_gateway.create_payment_intent(
                    payment_data.amount,
                    payment_data.currency,
                    {"order_id": payment_data.order_id, "payment_id": payment_id}
                )
                
                gateway_response = intent_data
                gateway_transaction_id = intent_data["id"]
                payment_status = PaymentStatus.PROCESSING
                
            elif payment_data.payment_method == PaymentMethod.PAYPAL:
                # Process with PayPal
                order_data = await paypal_gateway.create_order(
                    payment_data.amount,
                    payment_data.currency,
                    {"order_id": payment_data.order_id, "payment_id": payment_id}
                )
                
                gateway_response = order_data
                gateway_transaction_id = order_data["id"]
                payment_status = PaymentStatus.PROCESSING
                
            elif payment_data.payment_method == PaymentMethod.CARD:
                # Direct card processing (simplified - in production, use tokenization)
                # For demo purposes, we'll simulate success
                gateway_response = {"status": "succeeded", "id": f"card_{transaction_id}"}
                gateway_transaction_id = f"card_{transaction_id}"
                payment_status = PaymentStatus.COMPLETED
                
            elif payment_data.payment_method == PaymentMethod.CASH:
                # Cash payment - mark as pending for manual confirmation
                gateway_response = {"status": "pending", "id": f"cash_{transaction_id}"}
                gateway_transaction_id = f"cash_{transaction_id}"
                payment_status = PaymentStatus.PENDING
                
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Unsupported payment method"
                )
        
        except Exception as e:
            logger.error(f"Payment processing error: {e}")
            gateway_response = {"error": str(e)}
            payment_status = PaymentStatus.FAILED
        
        # Update payment record with gateway response
        payment_record.update({
            "status": payment_status.value,
            "gateway_transaction_id": gateway_transaction_id,
            "gateway_response": gateway_response,
            "failure_reason": gateway_response.get("error") if payment_status == PaymentStatus.FAILED else None
        })
        
        # Save payment to database
        result = supabase_client.table("payments").insert(payment_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create payment"
            )
        
        # Update order payment status
        supabase_client.table("orders").update({
            "payment_status": payment_status.value,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", payment_data.order_id).execute()
        
        return PaymentResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create payment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create payment"
        )

@app.get("/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(
    payment_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get payment by ID"""
    try:
        result = supabase_client.table("payments").select("*").eq("id", payment_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        payment = result.data[0]
        
        # Check if user has access to this payment
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and payment["customer_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this payment"
            )
        
        return PaymentResponse(**payment)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get payment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get payment"
        )

@app.post("/payments/{payment_id}/confirm")
async def confirm_payment(
    payment_id: str,
    gateway_data: Optional[Dict[str, Any]] = None,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Confirm a payment (for manual confirmation or gateway callbacks)"""
    try:
        # Get payment
        payment_result = supabase_client.table("payments").select("*").eq("id", payment_id).execute()
        
        if not payment_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        payment = payment_result.data[0]
        
        if payment["status"] != PaymentStatus.PROCESSING.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment is not in processing status"
            )
        
        # Confirm payment with gateway
        gateway_response = None
        payment_status = PaymentStatus.COMPLETED
        
        try:
            if payment["payment_method"] == PaymentMethod.STRIPE.value:
                gateway_response = await stripe_gateway.confirm_payment_intent(payment["gateway_transaction_id"])
                payment_status = PaymentStatus.COMPLETED if gateway_response["status"] == "succeeded" else PaymentStatus.FAILED
                
            elif payment["payment_method"] == PaymentMethod.PAYPAL.value:
                gateway_response = await paypal_gateway.capture_order(payment["gateway_transaction_id"])
                payment_status = PaymentStatus.COMPLETED if gateway_response["status"] == "COMPLETED" else PaymentStatus.FAILED
                
            else:
                # Manual confirmation for cash payments
                gateway_response = {"status": "confirmed", "confirmed_by": current_user["id"]}
                payment_status = PaymentStatus.COMPLETED
        
        except Exception as e:
            logger.error(f"Payment confirmation error: {e}")
            gateway_response = {"error": str(e)}
            payment_status = PaymentStatus.FAILED
        
        # Update payment
        update_data = {
            "status": payment_status.value,
            "gateway_response": gateway_response,
            "failure_reason": gateway_response.get("error") if payment_status == PaymentStatus.FAILED else None,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("payments").update(update_data).eq("id", payment_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to confirm payment"
            )
        
        # Update order payment status
        supabase_client.table("orders").update({
            "payment_status": payment_status.value,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", payment["order_id"]).execute()
        
        return PaymentResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Confirm payment error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to confirm payment"
        )

@app.post("/payments/{payment_id}/refund", response_model=RefundResponse)
async def create_refund(
    payment_id: str,
    refund_data: RefundRequest,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Create a refund for a payment"""
    try:
        # Get payment
        payment_result = supabase_client.table("payments").select("*").eq("id", payment_id).execute()
        
        if not payment_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found"
            )
        
        payment = payment_result.data[0]
        
        if payment["status"] != PaymentStatus.COMPLETED.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Can only refund completed payments"
            )
        
        # Calculate refund amount
        refund_amount = refund_data.amount or payment["amount"]
        
        if refund_amount > payment["amount"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Refund amount cannot exceed payment amount"
            )
        
        # Check existing refunds
        existing_refunds = supabase_client.table("refunds").select("amount").eq("payment_id", payment_id).eq("status", PaymentStatus.COMPLETED.value).execute()
        
        total_refunded = sum(refund["amount"] for refund in existing_refunds.data)
        
        if total_refunded + refund_amount > payment["amount"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Total refund amount cannot exceed payment amount"
            )
        
        # Create refund record
        refund_id = str(uuid.uuid4())
        refund_record = {
            "id": refund_id,
            "payment_id": payment_id,
            "amount": refund_amount,
            "status": PaymentStatus.PENDING.value,
            "reason": refund_data.reason,
            "metadata": refund_data.metadata or {},
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Process refund with gateway
        gateway_response = None
        gateway_refund_id = None
        refund_status = PaymentStatus.PENDING
        
        try:
            if payment["payment_method"] == PaymentMethod.STRIPE.value:
                gateway_response = await stripe_gateway.create_refund(
                    payment["gateway_transaction_id"],
                    refund_amount
                )
                gateway_refund_id = gateway_response["id"]
                refund_status = PaymentStatus.COMPLETED if gateway_response["status"] == "succeeded" else PaymentStatus.FAILED
                
            elif payment["payment_method"] == PaymentMethod.PAYPAL.value:
                # PayPal refund implementation would go here
                gateway_response = {"status": "completed", "id": f"paypal_refund_{refund_id}"}
                gateway_refund_id = f"paypal_refund_{refund_id}"
                refund_status = PaymentStatus.COMPLETED
                
            else:
                # Manual refund for cash payments
                gateway_response = {"status": "manual", "id": f"manual_refund_{refund_id}"}
                gateway_refund_id = f"manual_refund_{refund_id}"
                refund_status = PaymentStatus.COMPLETED
        
        except Exception as e:
            logger.error(f"Refund processing error: {e}")
            gateway_response = {"error": str(e)}
            refund_status = PaymentStatus.FAILED
        
        # Update refund record
        refund_record.update({
            "status": refund_status.value,
            "gateway_refund_id": gateway_refund_id,
            "gateway_response": gateway_response,
            "failure_reason": gateway_response.get("error") if refund_status == PaymentStatus.FAILED else None
        })
        
        # Save refund to database
        result = supabase_client.table("refunds").insert(refund_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create refund"
            )
        
        # Update payment status if fully refunded
        if total_refunded + refund_amount >= payment["amount"]:
            supabase_client.table("payments").update({
                "status": PaymentStatus.REFUNDED.value,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", payment_id).execute()
        else:
            supabase_client.table("payments").update({
                "status": PaymentStatus.PARTIALLY_REFUNDED.value,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", payment_id).execute()
        
        return RefundResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create refund error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create refund"
        )

@app.get("/payments", response_model=List[PaymentResponse])
async def list_payments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[PaymentStatus] = None,
    payment_method: Optional[PaymentMethod] = None,
    customer_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """List payments with filters"""
    try:
        query = supabase_client.table("payments").select("*")
        
        # Apply filters
        if status:
            query = query.eq("status", status.value)
        if payment_method:
            query = query.eq("payment_method", payment_method.value)
        if customer_id:
            query = query.eq("customer_id", customer_id)
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        payments = [PaymentResponse(**payment) for payment in result.data]
        return payments
        
    except Exception as e:
        logger.error(f"List payments error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list payments"
        )

@app.get("/payments/analytics/summary")
async def get_payment_analytics(
    property_id: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Get payment analytics summary"""
    try:
        # Get payments with order data
        query = supabase_client.table("payments").select("*, orders!inner(*)")
        
        if property_id:
            query = query.eq("orders.property_id", property_id)
        
        if date_from:
            query = query.gte("created_at", date_from.isoformat())
        
        if date_to:
            query = query.lte("created_at", date_to.isoformat())
        
        result = query.execute()
        payments = result.data
        
        # Calculate analytics
        total_payments = len(payments)
        total_amount = sum(payment["amount"] for payment in payments)
        successful_payments = len([p for p in payments if p["status"] == PaymentStatus.COMPLETED.value])
        failed_payments = len([p for p in payments if p["status"] == PaymentStatus.FAILED.value])
        
        # Payment method breakdown
        method_counts = {}
        for payment in payments:
            method = payment["payment_method"]
            method_counts[method] = method_counts.get(method, 0) + 1
        
        # Status breakdown
        status_counts = {}
        for payment in payments:
            status = payment["status"]
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_payments": total_payments,
            "total_amount": round(total_amount, 2),
            "successful_payments": successful_payments,
            "failed_payments": failed_payments,
            "success_rate": round(successful_payments / total_payments * 100, 2) if total_payments > 0 else 0,
            "payment_method_breakdown": method_counts,
            "status_breakdown": status_counts,
            "period": {
                "from": date_from.isoformat() if date_from else None,
                "to": date_to.isoformat() if date_to else None
            }
        }
        
    except Exception as e:
        logger.error(f"Get payment analytics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get payment analytics"
        )

@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        body = await request.body()
        signature = request.headers.get("stripe-signature")
        
        # Verify webhook signature (simplified - in production, use proper verification)
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing signature"
            )
        
        # Parse webhook data
        import json
        event_data = json.loads(body)
        
        # Process webhook event
        event_type = event_data.get("type")
        event_data_obj = event_data.get("data", {}).get("object", {})
        
        if event_type == "payment_intent.succeeded":
            # Update payment status
            gateway_transaction_id = event_data_obj.get("id")
            
            supabase_client.table("payments").update({
                "status": PaymentStatus.COMPLETED.value,
                "gateway_response": event_data_obj,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("gateway_transaction_id", gateway_transaction_id).execute()
            
        elif event_type == "payment_intent.payment_failed":
            # Update payment status
            gateway_transaction_id = event_data_obj.get("id")
            
            supabase_client.table("payments").update({
                "status": PaymentStatus.FAILED.value,
                "gateway_response": event_data_obj,
                "failure_reason": event_data_obj.get("last_payment_error", {}).get("message"),
                "updated_at": datetime.utcnow().isoformat()
            }).eq("gateway_transaction_id", gateway_transaction_id).execute()
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"Stripe webhook error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "payment-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8014,
        reload=True,
        log_level="info"
    )