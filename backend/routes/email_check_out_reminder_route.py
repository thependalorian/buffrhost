from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class CheckOutReminderRequest(BaseModel):
    recipient_email: EmailStr
    guest_name: str
    booking_id: str
    check_out_date: str
    property_name: str


@router.post("/check-out-reminder", status_code=status.HTTP_200_OK)
async def send_check_out_reminder_email(request: CheckOutReminderRequest):
    # Placeholder for sending check-out reminder email
    print(
        f"Sending check-out reminder to {request.recipient_email} for booking {request.booking_id}"
    )
    return {"message": "Check-out reminder email sent successfully"}
