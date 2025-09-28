from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class BookingCancellationNotificationRequest(BaseModel):
    recipient_email: EmailStr
    guest_name: str
    booking_id: str
    cancellation_reason: str


@router.post("/booking-cancellation", status_code=status.HTTP_200_OK)
async def send_booking_cancellation_notification_email(
    request: BookingCancellationNotificationRequest,
):
    # Placeholder for sending booking cancellation notification email
    print(
        f"Sending booking cancellation notification to {request.recipient_email} for booking {request.booking_id}"
    )
    return {"message": "Booking cancellation notification email sent successfully"}
