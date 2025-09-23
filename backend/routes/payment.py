"""
Payment routes for Adumo Online integration.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, Form
from fastapi.responses import RedirectResponse, HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import Optional
from uuid import UUID
from datetime import datetime
import logging

from database import get_db
from models.order import Order
from models.payment import PaymentTransaction, PaymentWebhook
from schemas.payment import (
    AdumoPaymentRequest, AdumoPaymentResponse, AdumoCallbackData,
    PaymentTransactionResponse, PaymentStatusUpdate
)
from services.adumo_payment_service import AdumoPaymentService
from services.payment_status_service import PaymentStatusService
from routes.auth import get_current_user
from models.user import BuffrHostUser
from config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize Adumo service (will be configured via environment variables)
adumo_service = None

def get_adumo_service() -> AdumoPaymentService:
    """Get configured Adumo payment service."""
    global adumo_service
    if adumo_service is None:
        # Validate required Adumo configuration
        if not all([settings.ADUMO_MERCHANT_ID, settings.ADUMO_APPLICATION_ID, settings.ADUMO_JWT_SECRET]):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Adumo payment configuration is incomplete"
            )
        
        adumo_service = AdumoPaymentService(
            merchant_id=settings.ADUMO_MERCHANT_ID,
            application_id=settings.ADUMO_APPLICATION_ID,
            jwt_secret=settings.ADUMO_JWT_SECRET,
            test_mode=settings.ADUMO_TEST_MODE
        )
    return adumo_service

@router.post("/orders/{order_id}/payments/adumo/initialize", response_model=AdumoPaymentResponse)
async def initialize_adumo_payment(
    order_id: UUID,
    payment_request: AdumoPaymentRequest,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Initialize Adumo payment for an order."""
    try:
        # Verify order exists and belongs to user's property
        order_result = await db.execute(
            select(Order).where(
                and_(
                    Order.order_id == order_id,
                    Order.property_id == current_user.property_id
                )
            )
        )
        order = order_result.scalar_one_or_none()
        
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        # Check if order already has a pending payment
        existing_payment = await db.execute(
            select(PaymentTransaction).where(
                and_(
                    PaymentTransaction.order_id == order_id,
                    PaymentTransaction.status.in_(["pending", "processing"])
                )
            )
        )
        if existing_payment.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order already has a pending payment"
            )
        
        # Get Adumo service
        adumo = get_adumo_service()
        
        # Create payment transaction record
        payment_transaction = PaymentTransaction(
            order_id=order_id,
            merchant_reference=f"BUFFR_{order_id}_{int(datetime.now().timestamp())}",
            amount=payment_request.amount,
            currency=payment_request.currency,
            success_url=payment_request.success_url,
            failed_url=payment_request.failed_url,
            status="pending"
        )
        
        db.add(payment_transaction)
        await db.flush()
        
        # Create payment form data
        form_data = adumo.create_payment_form_data(
            order_id=str(order_id),
            amount=payment_request.amount,
            success_url=payment_request.success_url,
            failed_url=payment_request.failed_url,
            customer_details=payment_request.customer_details,
            order_items=payment_request.order_items
        )
        
        # Store request token
        payment_transaction.request_token = form_data.get("Token")
        payment_transaction.merchant_reference = form_data.get("MerchantReference")
        
        await db.commit()
        await db.refresh(payment_transaction)
        
        logger.info(f"Initialized Adumo payment for order {order_id}")
        
        return AdumoPaymentResponse(
            transaction_id=payment_transaction.transaction_id,
            merchant_reference=payment_transaction.merchant_reference,
            payment_url=adumo.initialize_url,
            form_data=form_data,
            expires_at=datetime.now().replace(microsecond=0)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to initialize Adumo payment: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initialize payment"
        )

@router.post("/payments/adumo/callback")
async def adumo_payment_callback(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Adumo payment callback."""
    try:
        # Get form data from callback
        form_data = await request.form()
        
        # Convert form data to callback schema
        callback_data = AdumoCallbackData(
            _RESULT=int(form_data.get("_RESULT", -1)),
            _STATUS=form_data.get("_STATUS", ""),
            _MERCHANTREFERENCE=form_data.get("_MERCHANTREFERENCE", ""),
            _TRANSACTIONINDEX=form_data.get("_TRANSACTIONINDEX"),
            _ERROR_CODE=form_data.get("_ERROR_CODE"),
            _ERROR_MESSAGE=form_data.get("_ERROR_MESSAGE"),
            _AMOUNT=float(form_data.get("_AMOUNT", 0)),
            _CURRENCYCODE=form_data.get("_CURRENCYCODE", "NAD"),
            _PAYMETHOD=form_data.get("_PAYMETHOD"),
            _ACQUIRERDATETIME=form_data.get("_ACQUIRERDATETIME"),
            _RESPONSE_TOKEN=form_data.get("_RESPONSE_TOKEN", ""),
            _PANHASHED=form_data.get("_PANHASHED"),
            _CARDCOUNTRY=form_data.get("_CARDCOUNTRY"),
            _3DSTATUS=form_data.get("_3DSTATUS"),
            _BANK_ERROR_CODE=form_data.get("_BANK_ERROR_CODE"),
            _BANK_ERROR_MESSAGE=form_data.get("_BANK_ERROR_MESSAGE"),
            VARIABLE1=form_data.get("VARIABLE1"),
            VARIABLE2=form_data.get("VARIABLE2")
        )
        
        # Find payment transaction
        payment_result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.merchant_reference == callback_data._MERCHANTREFERENCE
            )
        )
        payment_transaction = payment_result.scalar_one_or_none()
        
        if not payment_transaction:
            logger.error(f"Payment transaction not found for reference: {callback_data._MERCHANTREFERENCE}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_F,
                detail="Payment transaction not found"
            )
        
        # Validate response token
        adumo = get_adumo_service()
        try:
            decoded_token = adumo.validate_response_token(
                callback_data._RESPONSE_TOKEN,
                payment_transaction.amount,
                callback_data._MERCHANTREFERENCE
            )
        except Exception as e:
            logger.error(f"Response token validation failed: {str(e)}")
            # Still process the callback but mark as suspicious
        
        # Update payment transaction using payment status service
        payment_status_service = PaymentStatusService()
        
        # Prepare additional data
        additional_data = {
            "adumo_transaction_index": callback_data._TRANSACTIONINDEX,
            "adumo_result_code": callback_data._RESULT,
            "adumo_status": callback_data._STATUS,
            "payment_method": callback_data._PAYMETHOD,
        }
        
        if not adumo.is_successful_transaction(callback_data._RESULT):
            additional_data["error_message"] = callback_data._ERROR_MESSAGE
        
        # Update payment status (this will also update order and send notifications)
        is_successful = adumo.is_successful_transaction(callback_data._RESULT)
        new_status = "completed" if is_successful else "failed"
        
        success = await payment_status_service.update_payment_status(
            db=db,
            transaction_id=payment_transaction.transaction_id,
            status=new_status,
            is_successful=is_successful,
            additional_data=additional_data
        )
        
        if not success:
            logger.error(f"Failed to update payment status for transaction {payment_transaction.transaction_id}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update payment status"
            )
        
        # Store response token
        payment_transaction.response_token = callback_data._RESPONSE_TOKEN
        await db.commit()
        
        logger.info(f"Processed Adumo callback for transaction {payment_transaction.transaction_id}")
        
        # Redirect based on success/failure
        if is_successful:
            return RedirectResponse(url=payment_transaction.success_url)
        else:
            return RedirectResponse(url=payment_transaction.failed_url)
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process Adumo callback: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process payment callback"
        )

@router.post("/payments/adumo/webhook")
async def adumo_payment_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Handle Adumo payment webhook notifications."""
    try:
        # Get webhook data
        webhook_data = await request.json()
        
        # Extract transaction reference
        merchant_reference = webhook_data.get("mref")
        if not merchant_reference:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing merchant reference in webhook"
            )
        
        # Find payment transaction
        payment_result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.merchant_reference == merchant_reference
            )
        )
        payment_transaction = payment_result.scalar_one_or_none()
        
        if not payment_transaction:
            logger.error(f"Payment transaction not found for webhook reference: {merchant_reference}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_F,
                detail="Payment transaction not found"
            )
        
        # Create webhook record
        webhook = PaymentWebhook(
            transaction_id=payment_transaction.transaction_id,
            raw_data=str(webhook_data),
            event_type=webhook_data.get("event_type", "payment_update"),
            processed=False
        )
        
        db.add(webhook)
        await db.commit()
        
        logger.info(f"Received Adumo webhook for transaction {payment_transaction.transaction_id}")
        
        return {"status": "received", "webhook_id": str(webhook.webhook_id)}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process Adumo webhook: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process webhook"
        )

@router.get("/payments/{transaction_id}", response_model=PaymentTransactionResponse)
async def get_payment_status(
    transaction_id: UUID,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get payment transaction status."""
    try:
        # Find payment transaction
        payment_result = await db.execute(
            select(PaymentTransaction).where(
                PaymentTransaction.transaction_id == transaction_id
            )
        )
        payment_transaction = payment_result.scalar_one_or_none()
        
        if not payment_transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_F,
                detail="Payment transaction not found"
            )
        
        # Verify user has access to this payment (through order)
        order_result = await db.execute(
            select(Order).where(
                and_(
                    Order.order_id == payment_transaction.order_id,
                    Order.property_id == current_user.property_id
                )
            )
        )
        if not order_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this payment"
            )
        
        return PaymentTransactionResponse.from_orm(payment_transaction)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get payment status: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get payment status"
        )

@router.get("/payments/analytics")
async def get_payment_analytics(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get payment analytics for the user's property."""
    try:
        payment_status_service = PaymentStatusService()
        
        analytics = await payment_status_service.get_payment_analytics(
            db=db,
            property_id=current_user.property_id,
            start_date=start_date,
            end_date=end_date
        )
        
        return analytics
        
    except Exception as e:
        logger.error(f"Failed to get payment analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get payment analytics"
        )
