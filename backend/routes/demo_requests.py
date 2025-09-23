"""
Demo request routes for Buffr Host.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import logging

from database import get_db
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)
router = APIRouter()

class DemoRequestCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    businessName: str
    businessType: str
    location: str
    currentSystem: Optional[str] = None
    message: Optional[str] = None

class DemoRequestResponse(BaseModel):
    id: str
    status: str
    message: str
    created_at: datetime

@router.post("/demo-requests", response_model=DemoRequestResponse)
async def create_demo_request(
    demo_request: DemoRequestCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new demo request.
    """
    try:
        # Initialize notification service
        notification_service = NotificationService()
        
        # Prepare email data
        email_data = {
            "first_name": demo_request.firstName,
            "last_name": demo_request.lastName,
            "business_name": demo_request.businessName,
            "business_type": demo_request.businessType,
            "location": demo_request.location,
            "phone": demo_request.phone,
            "current_system": demo_request.currentSystem,
            "message": demo_request.message,
            "request_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Send notification email to admin
        await notification_service.send_email(
            to_email="george@buffr.ai",  # Admin email
            subject=f"New Demo Request from {demo_request.businessName}",
            template="demo_request_admin",
            data=email_data
        )
        
        # Send confirmation email to customer
        await notification_service.send_email(
            to_email=demo_request.email,
            subject="Demo Request Received - Buffr Host",
            template="demo_request_confirmation",
            data=email_data
        )
        
        logger.info(f"Demo request received from {demo_request.email} for {demo_request.businessName}")
        
        return DemoRequestResponse(
            id=f"demo_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            status="received",
            message="Demo request submitted successfully. We'll contact you within 24 hours.",
            created_at=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Error processing demo request: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process demo request. Please try again."
        )
