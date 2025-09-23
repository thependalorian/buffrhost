"""
Buffr Host Email Service

Email service for The Shandi (Buffr Host) hotel management system
Founder: George Nekwaya (george@buffr.ai +12065308433)
"""

import os
import httpx
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class EmailResponse(BaseModel):
    """Email response model"""
    message_id: Optional[str] = None
    status: str
    provider: str = "SendGrid"
    timestamp: str
    error: Optional[str] = None


class BuffrHostEmailService:
    """Email service for Buffr Host hotel management system"""
    
    def __init__(self):
        self.api_key = os.getenv("SENDGRID_API_KEY")
        if not self.api_key:
            raise ValueError("SENDGRID_API_KEY environment variable is required")
        self.base_url = "https://api.sendgrid.com/v3"
        self.from_email = "noreply@mail.buffr.ai"
        self.from_name = "Buffr Host"
        self.app_url = "https://host.buffr.ai"
        self.support_email = "support@host.buffr.ai"
        self.support_phone = "+12065308433"
        self.owner_name = "George Nekwaya"
        self.owner_email = "george@buffr.ai"
        self.owner_phone = "+12065308433"
    
    async def send_booking_confirmation(
        self,
        guest_email: str,
        guest_name: str,
        booking_id: str,
        check_in_date: str,
        check_out_date: str,
        room_type: str,
        total_amount: float,
        currency: str = "NAD",
        hotel_name: str = "Buffr Host"
    ) -> EmailResponse:
        """Send booking confirmation email"""
        
        subject = f"Booking Confirmed - {hotel_name} - {booking_id}"
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Booking Confirmation</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #2c3e50; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; }}
                .booking-details {{ background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }}
                .button {{ background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }}
                .footer {{ background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; }}
                .contact-info {{ background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Confirmed</h1>
                    <p>{hotel_name} - host.buffr.ai</p>
                </div>
                
                <div class="content">
                    <h2>Hello {guest_name},</h2>
                    
                    <p>Your booking has been confirmed! We're excited to welcome you to {hotel_name}.</p>
                    
                    <div class="booking-details">
                        <h3 style="margin-top: 0; color: #2c3e50;">Booking Details</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li><strong>Booking ID:</strong> {booking_id}</li>
                            <li><strong>Hotel:</strong> {hotel_name}</li>
                            <li><strong>Room Type:</strong> {room_type}</li>
                            <li><strong>Check-in:</strong> {check_in_date}</li>
                            <li><strong>Check-out:</strong> {check_out_date}</li>
                            <li><strong>Total Amount:</strong> {total_amount:.2f} {currency}</li>
                        </ul>
                    </div>
                    
                    <div class="contact-info">
                        <h4 style="margin-top: 0; color: #27ae60;">Contact Information</h4>
                        <p><strong>Hotel Manager:</strong> {self.owner_name}</p>
                        <p><strong>Email:</strong> <a href="mailto:{self.owner_email}">{self.owner_email}</a></p>
                        <p><strong>Phone:</strong> <a href="tel:{self.owner_phone}">{self.owner_phone}</a></p>
                        <p><strong>Support:</strong> <a href="mailto:{self.support_email}">{self.support_email}</a></p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{self.app_url}/bookings/{booking_id}" class="button">
                            View Booking Details
                        </a>
                    </div>
                    
                    <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h4 style="margin-top: 0; color: #155724;">Booking Confirmed</h4>
                        <ul>
                            <li>Your room is reserved for the specified dates</li>
                            <li>Check-in time is 3:00 PM</li>
                            <li>Check-out time is 11:00 AM</li>
                            <li>Contact us if you need to modify your booking</li>
                        </ul>
                    </div>
                    
                    <p style="color: #7f8c8d; font-size: 14px;">
                        <strong>Need help?</strong> Contact our team at 
                        <a href="mailto:{self.support_email}">{self.support_email}</a> 
                        or call <a href="tel:{self.support_phone}">{self.support_phone}</a>.
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>© 2024 {hotel_name}. All rights reserved.</strong></p>
                    <p>Powered by Buffr Host - <a href="https://host.buffr.ai" style="color: #3498db;">host.buffr.ai</a></p>
                    <p>This email was sent from noreply@mail.buffr.ai</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        text = f"""
        BOOKING CONFIRMATION
        ====================
        
        Hello {guest_name},
        
        Your booking has been confirmed! We're excited to welcome you to {hotel_name}.
        
        BOOKING DETAILS:
        ================
        Booking ID: {booking_id}
        Hotel: {hotel_name}
        Room Type: {room_type}
        Check-in: {check_in_date}
        Check-out: {check_out_date}
        Total Amount: {total_amount:.2f} {currency}
        
        CONTACT INFORMATION:
        ===================
        Hotel Manager: {self.owner_name}
        Email: {self.owner_email}
        Phone: {self.owner_phone}
        Support: {self.support_email}
        
        VIEW BOOKING:
        =============
        {self.app_url}/bookings/{booking_id}
        
        BOOKING CONFIRMED:
        ==================
        - Your room is reserved for the specified dates
        - Check-in time is 3:00 PM
        - Check-out time is 11:00 AM
        - Contact us if you need to modify your booking
        
        NEED HELP?
        ==========
        Contact our team at {self.support_email} or call {self.support_phone}.
        
        ---
        © 2024 {hotel_name}. All rights reserved.
        Powered by Buffr Host - host.buffr.ai
        This email was sent from noreply@mail.buffr.ai
        """
        
        return await self._send_email(
            to=guest_email,
            subject=subject,
            html=html,
            text=text
        )
    
    async def _send_email(
        self,
        to: str,
        subject: str,
        html: str,
        text: str
    ) -> EmailResponse:
        """Send email via SendGrid API"""
        
        email_data = {
            "personalizations": [
                {
                    "to": [{"email": to}],
                    "subject": subject
                }
            ],
            "from": {
                "email": self.from_email,
                "name": self.from_name
            },
            "reply_to": {
                "email": self.support_email,
                "name": "Buffr Host Support"
            },
            "content": [
                {
                    "type": "text/plain",
                    "value": text
                },
                {
                    "type": "text/html",
                    "value": html
                }
            ]
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/mail/send",
                    headers=headers,
                    json=email_data,
                    timeout=30.0
                )
                
                if response.status_code == 202:
                    return EmailResponse(
                        message_id=response.headers.get("X-Message-Id"),
                        status="sent",
                        provider="SendGrid",
                        timestamp=datetime.now().isoformat()
                    )
                else:
                    error_msg = response.text or "Unknown error"
                    return EmailResponse(
                        status="failed",
                        provider="SendGrid",
                        timestamp=datetime.now().isoformat(),
                        error=error_msg
                    )
                    
        except Exception as e:
            return EmailResponse(
                status="failed",
                provider="SendGrid",
                timestamp=datetime.now().isoformat(),
                error=str(e)
            )


# Global email service instance
email_service = BuffrHostEmailService()