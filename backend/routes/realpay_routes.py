"""
RealPay API Routes for Namibia Integration
Handles EnDO and Payouts integration with RealPay API
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any, List
from decimal import Decimal
from datetime import datetime

from ..database import get_db
from ..auth.dependencies import get_current_user
from ..models.user import User
from ..services.realpay_service import (
    RealPayService, 
    RealPayTransactionRequest, 
    RealPayTransactionResponse,
    RealPayMandateRequest,
    RealPayMandateResponse,
    create_realpay_service
)

router = APIRouter(prefix="/api/v1/realpay", tags=["realpay"])

# Dependency to get RealPay service
async def get_realpay_service() -> RealPayService:
    """Get RealPay service instance"""
    return create_realpay_service(is_production=False)  # Set to True in production

@router.post("/transactions/initiate")
async def initiate_transaction(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    realpay_service: RealPayService = Depends(get_realpay_service)
):
    """Initiate a RealPay EnDO transaction"""
    try:
        # Convert request to RealPay format
        realpay_request = RealPayTransactionRequest(
            merchant_uid=request.get("merchant_uid"),
            application_uid=request.get("application_uid"),
            amount=Decimal(str(request.get("amount", 0))),
            merchant_reference=request.get("merchant_reference"),
            currency_code=request.get("currency_code", "NAD"),
            description=request.get("description"),
            customer_name=request.get("customer_name"),
            customer_email=request.get("customer_email"),
            customer_phone=request.get("customer_phone"),
            callback_url=request.get("callback_url")
        )
        
        # Initiate transaction
        response = await realpay_service.initiate_transaction(realpay_request)
        
        return {
            "transaction_id": response.transaction_id,
            "status": response.status,
            "status_code": response.status_code,
            "status_message": response.status_message,
            "amount": str(response.amount),
            "currency_code": response.currency_code,
            "merchant_reference": response.merchant_reference,
            "transaction_fee": str(response.transaction_fee),
            "net_amount": str(response.net_amount),
            "created_at": response.created_at.isoformat(),
            "updated_at": response.updated_at.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to initiate transaction: {str(e)}"
        )

@router.post("/mandates/create")
async def create_mandate(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    realpay_service: RealPayService = Depends(get_realpay_service)
):
    """Create a RealPay debit order mandate"""
    try:
        # Convert request to RealPay format
        realpay_request = RealPayMandateRequest(
            merchant_uid=request.get("merchant_uid"),
            application_uid=request.get("application_uid"),
            customer_name=request.get("customer_name"),
            customer_id_number=request.get("customer_id_number"),
            customer_phone=request.get("customer_phone"),
            customer_email=request.get("customer_email"),
            bank_code=request.get("bank_code"),
            account_number=request.get("account_number"),
            account_type=request.get("account_type", "savings"),
            mandate_reference=request.get("mandate_reference"),
            amount=Decimal(str(request.get("amount", 0))),
            frequency=request.get("frequency", "monthly"),
            start_date=datetime.fromisoformat(request.get("start_date")),
            end_date=datetime.fromisoformat(request.get("end_date")) if request.get("end_date") else None
        )
        
        # Create mandate
        response = await realpay_service.create_mandate(realpay_request)
        
        return {
            "mandate_id": response.mandate_id,
            "status": response.status,
            "status_code": response.status_code,
            "status_message": response.status_message,
            "mandate_reference": response.mandate_reference,
            "customer_name": response.customer_name,
            "amount": str(response.amount),
            "frequency": response.frequency,
            "created_at": response.created_at.isoformat(),
            "next_debit_date": response.next_debit_date.isoformat() if response.next_debit_date else None
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create mandate: {str(e)}"
        )

@router.post("/payouts/process")
async def process_payout(
    request: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
    realpay_service: RealPayService = Depends(get_realpay_service)
):
    """Process a payout to a beneficiary account"""
    try:
        # Process payout
        response = await realpay_service.process_payout(
            amount=Decimal(str(request.get("amount", 0))),
            beneficiary_account=request.get("beneficiary_account"),
            beneficiary_name=request.get("beneficiary_name"),
            reference=request.get("reference")
        )
        
        return {
            "payout_id": response.get("payoutId", ""),
            "status": response.get("status", "pending"),
            "status_code": response.get("statusCode", 200),
            "status_message": response.get("statusMessage", "Payout processed"),
            "amount": str(request.get("amount", 0)),
            "beneficiary_account": request.get("beneficiary_account"),
            "beneficiary_name": request.get("beneficiary_name"),
            "reference": request.get("reference"),
            "created_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to process payout: {str(e)}"
        )

@router.get("/transactions/{transaction_id}/status")
async def get_transaction_status(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    realpay_service: RealPayService = Depends(get_realpay_service)
):
    """Get transaction status"""
    try:
        status_data = await realpay_service.get_transaction_status(transaction_id)
        return status_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get transaction status: {str(e)}"
        )

@router.post("/callbacks/verify")
async def verify_callback(
    callback_data: dict,
    realpay_service: RealPayService = Depends(get_realpay_service)
):
    """Verify RealPay callback authenticity"""
    try:
        # Verify HMAC signature
        is_valid = await realpay_service.verify_callback(
            data=callback_data.get("data", ""),
            hmac_header=callback_data.get("hmac_header", "")
        )
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid callback signature"
            )
        
        # Process callback based on type
        callback_type = callback_data.get("callback_type")
        if callback_type == "MANDATE":
            # Handle mandate callback
            return {"status": "success", "message": "Mandate callback processed"}
        elif callback_type == "INSTALMENT":
            # Handle instalment callback
            return {"status": "success", "message": "Instalment callback processed"}
        else:
            return {"status": "success", "message": "Callback processed"}
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to verify callback: {str(e)}"
        )

@router.get("/pricing")
async def get_pricing_info():
    """Get RealPay pricing information"""
    from ..services.realpay_service import RealPayConfig
    
    return {
        "monthly_fees": {
            "endo": str(RealPayConfig.MONTHLY_ENDO_FEE),
            "payouts": str(RealPayConfig.MONTHLY_PAYOUTS_FEE),
            "user_fee": str(RealPayConfig.USER_FEE)
        },
        "one_time_fees": {
            "activation": str(RealPayConfig.ACTIVATION_FEE),
            "training": str(RealPayConfig.TRAINING_FEE)
        },
        "transaction_fees": {k: str(v) for k, v in RealPayConfig.TRANSACTION_FEES.items()},
        "sms_fee": str(RealPayConfig.SMS_FEE)
    }

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "RealPay Integration",
        "timestamp": datetime.utcnow().isoformat()
    }
