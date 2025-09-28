from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class PropertyUpdateNotificationRequest(BaseModel):
    recipient_email: EmailStr
    property_name: str
    update_details: str


@router.post("/property-update", status_code=status.HTTP_200_OK)
async def send_property_update_notification_email(
    request: PropertyUpdateNotificationRequest,
):
    # Placeholder for sending property update notification email
    print(
        f"Sending property update notification to {request.recipient_email} for property {request.property_name}"
    )
    return {"message": "Property update notification email sent successfully"}
