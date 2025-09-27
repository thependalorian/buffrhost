"""
Waitlist API Routes

This module provides API endpoints for managing the waitlist signup,
including SendGrid email integration for automated responses.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import logging
import os
from datetime import datetime
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

logger = logging.getLogger(__name__)

router = APIRouter()

class WaitlistRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    businessName: Optional[str] = None
    businessType: Optional[str] = None
    location: Optional[str] = None
    currentSystem: Optional[str] = None
    message: Optional[str] = None

class WaitlistResponse(BaseModel):
    success: bool
    message: str
    waitlist_position: Optional[int] = None

class WaitlistService:
    """Service for managing waitlist signups and SendGrid integration"""
    
    def __init__(self):
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@mail.buffr.ai")
        self.waitlist_count = 0  # In production, this would be from database
        
    async def add_to_waitlist(self, request: WaitlistRequest) -> WaitlistResponse:
        """Add user to waitlist and send confirmation email"""
        try:
            # In production, save to database
            self.waitlist_count += 1
            
            # Send confirmation email via SendGrid
            await self._send_waitlist_confirmation(request)
            
            return WaitlistResponse(
                success=True,
                message="Successfully added to waitlist! Check your email for confirmation.",
                waitlist_position=self.waitlist_count
            )
            
        except Exception as e:
            logger.error(f"Error adding to waitlist: {e}")
            raise HTTPException(
                status_code=500,
                detail="Failed to add to waitlist. Please try again."
            )
    
    async def _send_waitlist_confirmation(self, request: WaitlistRequest):
        """Send waitlist confirmation email via SendGrid"""
        if not self.sendgrid_api_key:
            logger.warning("SendGrid API key not configured, skipping email")
            return
            
        try:
            sg = sendgrid.SendGridAPIClient(api_key=self.sendgrid_api_key)
            
            # Create email content
            subject = "Welcome to the Buffr Host Waitlist! 🎉"
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Buffr Host Waitlist</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to the Buffr Host Waitlist!</h1>
                    <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">You're among the first to experience the future of hospitality</p>
                </div>
                
                <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #333; margin-top: 0;">Hi {request.firstName}! 👋</h2>
                    <p>Thank you for joining our exclusive waitlist for Buffr Host - the revolutionary hospitality management platform.</p>
                    
                    <h3 style="color: #667eea;">What happens next?</h3>
                    <ul style="padding-left: 20px;">
                        <li><strong>Exclusive Updates:</strong> Get insider information about our launch timeline</li>
                        <li><strong>Early Access:</strong> Be among the first to try new features</li>
                        <li><strong>Priority Support:</strong> Get dedicated assistance when we go live</li>
                        <li><strong>Special Pricing:</strong> Exclusive launch offers and discounts</li>
                    </ul>
                </div>
                
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="color: #1976d2; margin-top: 0;">Your Waitlist Details</h3>
                    <p><strong>Name:</strong> {request.firstName} {request.lastName}</p>
                    <p><strong>Email:</strong> {request.email}</p>
                    <p><strong>Business:</strong> {request.businessName or 'Not specified'}</p>
                    <p><strong>Position:</strong> #{self.waitlist_count} in line</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://host.buffr.ai/guest/etuna" 
                       style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Explore Our Live Demo
                    </a>
                </div>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
                    <p>Questions? Reply to this email or contact us at <a href="mailto:support@buffrhost.com">support@buffrhost.com</a></p>
                    <p>Follow us for updates: <a href="https://twitter.com/buffrhost">@buffrhost</a></p>
                </div>
            </body>
            </html>
            """
            
            text_content = f"""
            Welcome to the Buffr Host Waitlist!
            
            Hi {request.firstName},
            
            Thank you for joining our exclusive waitlist for Buffr Host - the revolutionary hospitality management platform.
            
            What happens next?
            • Exclusive Updates: Get insider information about our launch timeline
            • Early Access: Be among the first to try new features  
            • Priority Support: Get dedicated assistance when we go live
            • Special Pricing: Exclusive launch offers and discounts
            
            Your Waitlist Details:
            Name: {request.firstName} {request.lastName}
            Email: {request.email}
            Business: {request.businessName or 'Not specified'}
            Position: #{self.waitlist_count} in line
            
            Explore our live demo: https://host.buffr.ai/guest/etuna
            
            Questions? Reply to this email or contact us at support@host.buffr.ai
            Follow us for updates: @buffrhost
            """
            
            # Create email
            from_email = Email(self.from_email)
            to_email = To(request.email)
            subject = subject
            html_content = Content("text/html", html_content)
            text_content = Content("text/plain", text_content)
            
            mail = Mail(
                from_email=from_email,
                to_emails=to_email,
                subject=subject,
                plain_text_content=text_content,
                html_content=html_content
            )
            
            # Send email
            response = sg.send(mail)
            logger.info(f"Waitlist confirmation email sent to {request.email}, status: {response.status_code}")
            
        except Exception as e:
            logger.error(f"Failed to send waitlist confirmation email: {e}")
            # Don't raise exception - waitlist signup should still succeed

# Initialize service
waitlist_service = WaitlistService()

@router.post("/", response_model=WaitlistResponse)
async def join_waitlist(request: WaitlistRequest):
    """Join the Buffr Host waitlist"""
    try:
        response = await waitlist_service.add_to_waitlist(request)
        return response
        
    except Exception as e:
        logger.error(f"Error in waitlist signup: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to join waitlist. Please try again."
        )

@router.get("/stats")
async def get_waitlist_stats():
    """Get waitlist statistics (for admin use)"""
    return {
        "total_signups": waitlist_service.waitlist_count,
        "status": "active",
        "launch_timeline": "Q2 2024"
    }
