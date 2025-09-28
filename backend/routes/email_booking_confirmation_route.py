from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class BookingConfirmationRequest(BaseModel):
    recipient_email: EmailStr
    guest_name: str
    booking_id: str
    check_in_date: str
    check_out_date: str
    room_type: str
    total_price: float


@router.post("/booking-confirmation", status_code=status.HTTP_200_OK)
async def send_booking_confirmation_email(request: BookingConfirmationRequest):
    # Placeholder for sending booking confirmation email
    print(
        f"Sending booking confirmation to {request.recipient_email} for booking {request.booking_id}"
    )
    return {"message": "Booking confirmation email sent successfully"}
