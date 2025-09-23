"""
Buffr Host Email Routes

API routes for email functionality in The Shandi (Buffr Host)
Founder: George Nekwaya (george@buffr.ai +12065308433)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from ..services.email_service import email_service, EmailResponse

router = APIRouter(prefix="/api/email", tags=["email"])


class BookingConfirmationRequest(BaseModel):
    """Request model for booking confirmation email"""
    guest_email: EmailStr
    guest_name: str
    booking_id: str
    check_in_date: str
    check_out_date: str
    room_type: str
    total_amount: float
    currency: str = "NAD"
    hotel_name: str = "The Shandi"


class PaymentConfirmationRequest(BaseModel):
    """Request model for payment confirmation email"""
    guest_email: EmailStr
    guest_name: str
    booking_id: str
    amount: float
    currency: str = "NAD"
    payment_method: str = "Credit Card"


class LoyaltyRewardRequest(BaseModel):
    """Request model for loyalty reward email"""
    guest_email: EmailStr
    guest_name: str
    reward_type: str
    reward_value: str
    points_earned: int
    total_points: int


@router.post("/booking-confirmation", response_model=EmailResponse)
async def send_booking_confirmation(request: BookingConfirmationRequest):
    """Send booking confirmation email"""
    try:
        response = await email_service.send_booking_confirmation(
            guest_email=request.guest_email,
            guest_name=request.guest_name,
            booking_id=request.booking_id,
            check_in_date=request.check_in_date,
            check_out_date=request.check_out_date,
            room_type=request.room_type,
            total_amount=request.total_amount,
            currency=request.currency,
            hotel_name=request.hotel_name
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/payment-confirmation", response_model=EmailResponse)
async def send_payment_confirmation(request: PaymentConfirmationRequest):
    """Send payment confirmation email"""
    try:
        response = await email_service.send_payment_confirmation(
            guest_email=request.guest_email,
            guest_name=request.guest_name,
            booking_id=request.booking_id,
            amount=request.amount,
            currency=request.currency,
            payment_method=request.payment_method
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/loyalty-reward", response_model=EmailResponse)
async def send_loyalty_reward(request: LoyaltyRewardRequest):
    """Send loyalty reward email"""
    try:
        response = await email_service.send_loyalty_reward(
            guest_email=request.guest_email,
            guest_name=request.guest_name,
            reward_type=request.reward_type,
            reward_value=request.reward_value,
            points_earned=request.points_earned,
            total_points=request.total_points
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_email_status():
    """Get email service status"""
    return {
        "status": "healthy",
        "service": "Buffr Host Email Service",
        "provider": "SendGrid",
        "from_email": email_service.from_email,
        "app_url": email_service.app_url,
        "timestamp": datetime.now().isoformat()
    }
