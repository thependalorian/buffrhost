"""
Notification Service for Buffr Host.
Handles email, SMS, and internal notifications.
"""
import asyncio
import json
import logging
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any, Dict, List, Optional

import httpx

from config import settings

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for sending various types of notifications."""

    def __init__(self):
        """Initialize notification service."""
        self.email_enabled = settings.EMAIL_NOTIFICATIONS_ENABLED
        self.sms_enabled = settings.SMS_NOTIFICATIONS_ENABLED
        self.push_enabled = settings.PUSH_NOTIFICATIONS_ENABLED

        # Email configuration
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_from_email = settings.SMTP_FROM_EMAIL

        # Twilio configuration for SMS
        self.twilio_account_sid = settings.TWILIO_ACCOUNT_SID
        self.twilio_auth_token = settings.TWILIO_AUTH_TOKEN
        self.twilio_phone_number = settings.TWILIO_PHONE_NUMBER

    async def send_email(
        self, to_email: str, subject: str, template: str, data: Dict[str, Any]
    ) -> bool:
        """
        Send email notification.

        Args:
            to_email: Recipient email address
            subject: Email subject
            template: Email template name
            data: Template data

        Returns:
            True if email was sent successfully
        """
        try:
            if not self.email_enabled:
                logger.info(
                    f"Email notifications disabled, skipping email to {to_email}"
                )
                return True

            # Generate email content from template
            email_content = self._generate_email_content(template, data)

            # Create email message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.smtp_from_email
            msg["To"] = to_email

            # Add HTML content
            html_part = MIMEText(email_content["html"], "html")
            msg.attach(html_part)

            # Add plain text content
            text_part = MIMEText(email_content["text"], "plain")
            msg.attach(text_part)

            # Send email via SMTP
            if self.smtp_host and self.smtp_username and self.smtp_password:
                await self._send_smtp_email(msg)
            else:
                # Fallback to logging if SMTP not configured
                logger.info(
                    f"SMTP not configured, logging email to {to_email}: {subject}"
                )
                logger.debug(f"Email content: {email_content}")

            logger.info(f"Email sent to {to_email}: {subject}")
            return True

        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    async def send_sms(self, to_phone: str, message: str) -> bool:
        """
        Send SMS notification.

        Args:
            to_phone: Recipient phone number
            message: SMS message

        Returns:
            True if SMS was sent successfully
        """
        try:
            if not self.sms_enabled:
                logger.info(f"SMS notifications disabled, skipping SMS to {to_phone}")
                return True

            # Send SMS via Twilio
            if (
                self.twilio_account_sid
                and self.twilio_auth_token
                and self.twilio_phone_number
            ):
                await self._send_twilio_sms(to_phone, message)
            else:
                # Fallback to logging if Twilio not configured
                logger.info(
                    f"Twilio not configured, logging SMS to {to_phone}: {message}"
                )

            logger.info(f"SMS sent to {to_phone}: {message}")
            return True

        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {str(e)}")
            return False

    async def send_internal_notification(
        self, type: str, title: str, message: str, data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Send internal notification to staff/admin.

        Args:
            type: Notification type
            title: Notification title
            message: Notification message
            data: Additional notification data

        Returns:
            True if notification was sent successfully
        """
        try:
            # Store internal notification in database for admin dashboard
            await self._store_internal_notification(type, title, message, data)

            # Send webhook notification if configured
            webhook_url = getattr(settings, "INTERNAL_WEBHOOK_URL", None)
            if webhook_url:
                await self._send_webhook_notification(
                    webhook_url,
                    {
                        "type": type,
                        "title": title,
                        "message": message,
                        "data": data,
                        "timestamp": datetime.now().isoformat(),
                    },
                )

            logger.info(f"Internal notification sent: {type} - {title}")
            return True

        except Exception as e:
            logger.error(f"Failed to send internal notification: {str(e)}")
            return False

    async def send_push_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> bool:
        """
        Send push notification to mobile app.

        Args:
            user_id: Target user ID
            title: Notification title
            message: Notification message
            data: Additional notification data

        Returns:
            True if push notification was sent successfully
        """
        try:
            # Send push notification via Firebase Cloud Messaging
            firebase_server_key = getattr(settings, "FIREBASE_SERVER_KEY", None)
            if firebase_server_key and self.push_enabled:
                await self._send_firebase_push(user_id, title, message, data)
            else:
                # Fallback to logging if Firebase not configured
                logger.info(
                    f"Firebase not configured, logging push notification to user {user_id}: {title}"
                )
                logger.debug(f"Push message: {message}, data: {data}")

            logger.info(f"Push notification sent to user {user_id}: {title}")
            return True

        except Exception as e:
            logger.error(
                f"Failed to send push notification to user {user_id}: {str(e)}"
            )
            return False

    def _generate_email_content(
        self, template: str, data: Dict[str, Any]
    ) -> Dict[str, str]:
        """Generate email content from template and data."""
        # Email templates for different notification types
        templates = {
            "payment_success": {
                "html": f"""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #28a745;">Payment Successful!</h2>
                    <p>Dear {data.get('customer_name', 'Customer')},</p>
                    <p>Your payment has been processed successfully.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Details:</h3>
                        <p><strong>Order Number:</strong> #{data.get('order_number', 'N/A')}</p>
                        <p><strong>Amount:</strong> N${data.get('amount', 0):.2f}</p>
                        <p><strong>Payment Method:</strong> {data.get('payment_method', 'N/A')}</p>
                        <p><strong>Transaction ID:</strong> {data.get('transaction_id', 'N/A')}</p>
                    </div>
                    <p>Thank you for your business!</p>
                    <p>Best regards,<br>Buffr Host Team</p>
                </body>
                </html>
                """,
                "text": f"""
                Payment Successful!
                
                Dear {data.get('customer_name', 'Customer')},
                
                Your payment has been processed successfully.
                
                Order Details:
                - Order Number: #{data.get('order_number', 'N/A')}
                - Amount: N${data.get('amount', 0):.2f}
                - Payment Method: {data.get('payment_method', 'N/A')}
                - Transaction ID: {data.get('transaction_id', 'N/A')}
                
                Thank you for your business!
                
                Best regards,
                Buffr Host Team
                """,
            },
            "payment_failure": {
                "html": f"""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc3545;">Payment Failed</h2>
                    <p>Dear {data.get('customer_name', 'Customer')},</p>
                    <p>Unfortunately, your payment could not be processed.</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Details:</h3>
                        <p><strong>Order Number:</strong> #{data.get('order_number', 'N/A')}</p>
                        <p><strong>Amount:</strong> N${data.get('amount', 0):.2f}</p>
                    </div>
                    <p>Please try again or contact our support team for assistance.</p>
                    <p>Best regards,<br>Buffr Host Team</p>
                </body>
                </html>
                """,
                "text": f"""
                Payment Failed
                
                Dear {data.get('customer_name', 'Customer')},
                
                Unfortunately, your payment could not be processed.
                
                Order Details:
                - Order Number: #{data.get('order_number', 'N/A')}
                - Amount: N${data.get('amount', 0):.2f}
                
                Please try again or contact our support team for assistance.
                
                Best regards,
                Buffr Host Team
                """,
            },
        }

        return templates.get(
            template,
            {
                "html": f"<html><body><h2>{data.get('title', 'Notification')}</h2><p>{data.get('message', '')}</p></body></html>",
                "text": f"{data.get('title', 'Notification')}\n\n{data.get('message', '')}",
            },
        )

    async def _send_smtp_email(self, msg: MIMEMultipart) -> None:
        """Send email via SMTP."""

        def send_sync():
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                if self.smtp_port == 587:
                    server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)

        # Run SMTP in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, send_sync)

    async def _send_twilio_sms(self, to_phone: str, message: str) -> None:
        """Send SMS via Twilio API."""
        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"

        data = {"From": self.twilio_phone_number, "To": to_phone, "Body": message}

        auth = (self.twilio_account_sid, self.twilio_auth_token)

        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=data, auth=auth)
            response.raise_for_status()

    async def _store_internal_notification(
        self, type: str, title: str, message: str, data: Optional[Dict[str, Any]]
    ) -> None:
        """Store internal notification in database."""
        # TODO: Implement database storage for internal notifications
        # This would create a record in an internal_notifications table
        logger.debug(f"Storing internal notification: {type} - {title}")

    async def _send_webhook_notification(
        self, webhook_url: str, payload: Dict[str, Any]
    ) -> None:
        """Send webhook notification."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                webhook_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10.0,
            )
            response.raise_for_status()

    async def _send_firebase_push(
        self, user_id: str, title: str, message: str, data: Optional[Dict[str, Any]]
    ) -> None:
        """Send push notification via Firebase Cloud Messaging."""
        firebase_server_key = getattr(settings, "FIREBASE_SERVER_KEY", None)

        # TODO: Get FCM token for user_id from database
        fcm_token = await self._get_user_fcm_token(user_id)

        if not fcm_token:
            logger.warning(f"No FCM token found for user {user_id}")
            return

        url = "https://fcm.googleapis.com/fcm/send"

        headers = {
            "Authorization": f"key={firebase_server_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "to": fcm_token,
            "notification": {"title": title, "body": message, "sound": "default"},
            "data": data or {},
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()

    async def _get_user_fcm_token(self, user_id: str) -> Optional[str]:
        """Get FCM token for user from database."""
        # TODO: Implement database query to get user's FCM token
        # This would query a user_devices table
        logger.debug(f"Getting FCM token for user {user_id}")
        return None  # Placeholder
