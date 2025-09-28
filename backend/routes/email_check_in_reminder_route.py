from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class CheckInReminderRequest(BaseModel):
    recipient_email: EmailStr
    guest_name: str
    booking_id: str
    check_in_date: str
    property_name: str


@router.post("/check-in-reminder", status_code=status.HTTP_200_OK)
async def send_check_in_reminder_email(request: CheckInReminderRequest):
    # Placeholder for sending check-in reminder email
    print(
        f"Sending check-in reminder to {request.recipient_email} for booking {request.booking_id}"
    )
    return {"message": "Check-in reminder email sent successfully"}
