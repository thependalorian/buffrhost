"""
Arcade MCP Integration Service for Buffr Host Platform

This service integrates Arcade's MCP tools to enable AI agents to perform
authenticated actions like sending emails, managing calendars, and interacting
with external APIs through secure tool calling.
"""

import logging
from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio
from contextlib import asynccontextmanager

try:
    from arcade_ai import Arcade
    from arcade_google import GoogleToolkit
except ImportError:
    Arcade = None
    GoogleToolkit = None
    logging.warning("Arcade SDK not installed. Arcade features will be disabled.")

from config import settings

logger = logging.getLogger(__name__)


class ArcadeService:
    """Service for integrating Arcade MCP tools with Buffr Host platform."""
    
    def __init__(self):
        """Initialize the Arcade service."""
        self.client = None
        self.is_available = Arcade is not None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the Arcade client if available."""
        if not self.is_available:
            logger.warning("Arcade SDK not available. Service will be disabled.")
            return
        
        try:
            self.client = Arcade()
            logger.info("Arcade service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Arcade client: {e}")
            self.is_available = False
    
    async def start_authorization(
        self, 
        user_id: str, 
        provider: str, 
        scopes: List[str]
    ) -> Dict[str, Any]:
        """
        Start the authorization process for a user with a specific provider.
        
        Args:
            user_id: Unique identifier for the user
            provider: OAuth provider (e.g., 'google', 'microsoft', 'slack')
            scopes: List of OAuth scopes to request
            
        Returns:
            Dict containing authorization response with URL and status
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            auth_response = self.client.auth.start(user_id, provider, scopes=scopes)
            
            return {
                "status": auth_response.status,
                "url": auth_response.url if hasattr(auth_response, 'url') else None,
                "user_id": user_id,
                "provider": provider,
                "scopes": scopes,
                "created_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Failed to start authorization: {e}")
            raise
    
    async def wait_for_authorization_completion(
        self, 
        auth_response: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Wait for authorization completion and return the token.
        
        Args:
            auth_response: Authorization response from start_authorization
            
        Returns:
            Dict containing completion status and token
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            # Convert dict back to auth response object if needed
            # This is a simplified implementation - adjust based on actual Arcade SDK
            completed_response = self.client.auth.wait_for_completion(auth_response)
            
            return {
                "status": completed_response.status,
                "token": getattr(completed_response.context, 'token', None) if hasattr(completed_response, 'context') else None,
                "completed_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Failed to wait for authorization completion: {e}")
            raise
    
    async def get_available_tools(self) -> List[Dict[str, Any]]:
        """
        Get list of available Arcade tools for hospitality management.
        
        Returns:
            List of available tools with their descriptions
        """
        if not self.is_available:
            return []
        
        # Hospitality-specific Arcade tools
        return [
            {
                "name": "gmail_send_booking_confirmation",
                "description": "Send booking confirmation emails to customers",
                "provider": "google",
                "scopes": ["https://www.googleapis.com/auth/gmail.send"],
                "hospitality_use": "Customer booking confirmations, reservation updates"
            },
            {
                "name": "calendar_create_booking_event",
                "description": "Create calendar events for room reservations, spa bookings, conference rooms",
                "provider": "google",
                "scopes": ["https://www.googleapis.com/auth/calendar"],
                "hospitality_use": "Room bookings, spa appointments, conference scheduling"
            },
            {
                "name": "slack_staff_notification",
                "description": "Send staff notifications for orders, bookings, and alerts",
                "provider": "slack",
                "scopes": ["chat:write", "channels:read"],
                "hospitality_use": "Kitchen orders, housekeeping alerts, maintenance requests"
            },
            {
                "name": "notion_create_guest_profile",
                "description": "Create guest profiles and notes in Notion",
                "provider": "notion",
                "scopes": ["write"],
                "hospitality_use": "Guest preferences, special requests, loyalty tracking"
            },
            {
                "name": "gmail_send_marketing_campaign",
                "description": "Send marketing emails to loyalty program members",
                "provider": "google",
                "scopes": ["https://www.googleapis.com/auth/gmail.send"],
                "hospitality_use": "Promotional campaigns, loyalty rewards, special offers"
            },
            {
                "name": "calendar_schedule_staff_shift",
                "description": "Schedule staff shifts and manage work schedules",
                "provider": "google",
                "scopes": ["https://www.googleapis.com/auth/calendar"],
                "hospitality_use": "Staff scheduling, shift management, availability tracking"
            }
        ]
    
    async def execute_tool(
        self, 
        tool_name: str, 
        user_id: str, 
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute an Arcade tool with the given parameters.
        
        Args:
            tool_name: Name of the tool to execute
            user_id: User ID for authentication context
            parameters: Tool-specific parameters
            
        Returns:
            Dict containing execution result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            # This would be implemented based on actual Arcade SDK tool execution
            # For now, return a placeholder response
            return {
                "tool_name": tool_name,
                "user_id": user_id,
                "parameters": parameters,
                "status": "executed",
                "result": f"Tool {tool_name} executed successfully",
                "executed_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Failed to execute tool {tool_name}: {e}")
            raise
    
    async def send_hospitality_notification(
        self, 
        user_id: str, 
        notification_type: str, 
        message: str,
        recipient_email: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send hospitality-related notifications using Arcade tools.
        
        Args:
            user_id: User ID for authentication
            notification_type: Type of notification (booking, order, etc.)
            message: Notification message
            recipient_email: Optional recipient email
            
        Returns:
            Dict containing notification result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            # Use Gmail tool to send notification
            parameters = {
                "to": recipient_email or "customer@example.com",
                "subject": f"Shandi {notification_type.title()} Notification",
                "body": message,
                "html": f"""
                <html>
                <body>
                    <h2>Buffr Host Notification</h2>
                    <p><strong>Type:</strong> {notification_type.title()}</p>
                    <p><strong>Message:</strong> {message}</p>
                    <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
                    <hr>
                    <p><em>This is an automated message from Buffr Host platform.</em></p>
                </body>
                </html>
                """
            }
            
            return await self.execute_tool("gmail_send", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to send hospitality notification: {e}")
            raise
    
    async def create_booking_calendar_event(
        self, 
        user_id: str, 
        booking_details: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create a calendar event for a booking using Arcade tools.
        
        Args:
            user_id: User ID for authentication
            booking_details: Booking information
            
        Returns:
            Dict containing calendar event creation result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            parameters = {
                "summary": f"Buffr Host Booking - {booking_details.get('service_type', 'Service')}",
                "description": f"""
                Booking Details:
                - Customer: {booking_details.get('customer_name', 'N/A')}
                - Service: {booking_details.get('service_type', 'N/A')}
                - Property: {booking_details.get('property_name', 'N/A')}
                - Notes: {booking_details.get('notes', 'None')}
                """,
                "start": {
                    "dateTime": booking_details.get('start_time'),
                    "timeZone": booking_details.get('timezone', 'UTC')
                },
                "end": {
                    "dateTime": booking_details.get('end_time'),
                    "timeZone": booking_details.get('timezone', 'UTC')
                },
                "attendees": [
                    {"email": booking_details.get('customer_email')}
                ] if booking_details.get('customer_email') else []
            }
            
            return await self.execute_tool("calendar_create_event", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to create booking calendar event: {e}")
            raise
    
    async def send_staff_notification(
        self, 
        user_id: str, 
        staff_member: str, 
        message: str,
        channel: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Send staff notifications using Slack integration.
        
        Args:
            user_id: User ID for authentication
            staff_member: Staff member to notify
            message: Notification message
            channel: Optional Slack channel
            
        Returns:
            Dict containing notification result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            parameters = {
                "channel": channel or "#staff-notifications",
                "text": f"@here Staff Notification for {staff_member}",
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*Staff Notification*\n*Member:* {staff_member}\n*Message:* {message}\n*Time:* {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC"
                        }
                    }
                ]
            }
            
            return await self.execute_tool("slack_send_message", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to send staff notification: {e}")
            raise
    
    async def send_booking_confirmation(
        self, 
        user_id: str, 
        booking_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send booking confirmation email using Arcade Gmail integration.
        
        Args:
            user_id: User ID for authentication
            booking_data: Booking information including customer details
            
        Returns:
            Dict containing email sending result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            customer_email = booking_data.get('customer_email')
            service_type = booking_data.get('service_type', 'Service')
            property_name = booking_data.get('property_name', 'Buffr Host')
            booking_id = booking_data.get('booking_id', 'N/A')
            
            email_subject = f"Buffr Host Booking Confirmation - {service_type} at {property_name}"
            email_body = f"""
            Dear {booking_data.get('customer_name', 'Valued Guest')},
            
            Your booking has been confirmed!
            
            Booking Details:
            - Booking ID: {booking_id}
            - Service: {service_type}
            - Property: {property_name}
            - Date: {booking_data.get('booking_date', 'N/A')}
            - Time: {booking_data.get('booking_time', 'N/A')}
            - Duration: {booking_data.get('duration', 'N/A')}
            
            Special Requests: {booking_data.get('special_requests', 'None')}
            
            We look forward to serving you!
            
            Best regards,
            The {property_name} Team
            
            ---
            This is an automated confirmation from Buffr Host platform.
            Visit us at: host.buffr.ai
            Contact: george@buffr.ai
            """
            
            parameters = {
                "to": customer_email,
                "subject": email_subject,
                "body": email_body,
                "html": f"""
                <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #2c3e50;">Booking Confirmation</h2>
                        <p>Dear <strong>{booking_data.get('customer_name', 'Valued Guest')}</strong>,</p>
                        <p>Your booking has been confirmed!</p>
                        
                        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <h3 style="color: #34495e; margin-top: 0;">Booking Details</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li><strong>Booking ID:</strong> {booking_id}</li>
                                <li><strong>Service:</strong> {service_type}</li>
                                <li><strong>Property:</strong> {property_name}</li>
                                <li><strong>Date:</strong> {booking_data.get('booking_date', 'N/A')}</li>
                                <li><strong>Time:</strong> {booking_data.get('booking_time', 'N/A')}</li>
                                <li><strong>Duration:</strong> {booking_data.get('duration', 'N/A')}</li>
                            </ul>
                        </div>
                        
                        <p><strong>Special Requests:</strong> {booking_data.get('special_requests', 'None')}</p>
                        
                        <p>We look forward to serving you!</p>
                        
                        <p>Best regards,<br>The {property_name} Team</p>
                        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #7f8c8d;">
                            This is an automated confirmation from Buffr Host platform.<br>
                            Visit us at: <a href="https://host.buffr.ai">host.buffr.ai</a><br>
                            Contact: <a href="mailto:george@buffr.ai">george@buffr.ai</a>
                        </p>
                    </div>
                </body>
                </html>
                """
            }
            
            return await self.execute_tool("gmail_send_booking_confirmation", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to send booking confirmation: {e}")
            raise
    
    async def create_staff_schedule_event(
        self, 
        user_id: str, 
        schedule_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Create staff schedule event using Arcade Calendar integration.
        
        Args:
            user_id: User ID for authentication
            schedule_data: Staff schedule information
            
        Returns:
            Dict containing calendar event creation result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            staff_name = schedule_data.get('staff_name', 'Staff Member')
            shift_type = schedule_data.get('shift_type', 'Regular Shift')
            department = schedule_data.get('department', 'General')
            
            parameters = {
                "summary": f"{staff_name} - {shift_type} ({department})",
                "description": f"""
                Staff Schedule Details:
                - Staff Member: {staff_name}
                - Shift Type: {shift_type}
                - Department: {department}
                - Role: {schedule_data.get('role', 'Staff')}
                - Notes: {schedule_data.get('notes', 'None')}
                
                Generated by Buffr Host Staff Management System
                """,
                "start": {
                    "dateTime": schedule_data.get('start_time'),
                    "timeZone": schedule_data.get('timezone', 'UTC')
                },
                "end": {
                    "dateTime": schedule_data.get('end_time'),
                    "timeZone": schedule_data.get('timezone', 'UTC')
                },
                "attendees": [
                    {"email": schedule_data.get('staff_email')}
                ] if schedule_data.get('staff_email') else [],
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "email", "minutes": 60},
                        {"method": "popup", "minutes": 30}
                    ]
                }
            }
            
            return await self.execute_tool("calendar_schedule_staff_shift", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to create staff schedule event: {e}")
            raise
    
    async def send_kitchen_order_notification(
        self, 
        user_id: str, 
        order_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Send kitchen order notification using Arcade Slack integration.
        
        Args:
            user_id: User ID for authentication
            order_data: Order information for kitchen staff
            
        Returns:
            Dict containing Slack notification result
        """
        if not self.is_available:
            raise RuntimeError("Arcade service is not available")
        
        try:
            order_id = order_data.get('order_id', 'N/A')
            table_number = order_data.get('table_number', 'N/A')
            items = order_data.get('items', [])
            special_instructions = order_data.get('special_instructions', 'None')
            
            items_text = "\n".join([f"• {item.get('name', 'Item')} x{item.get('quantity', 1)}" for item in items])
            
            parameters = {
                "channel": "#kitchen-orders",
                "text": f"🍽️ New Order #{order_id} - Table {table_number}",
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": f"🍽️ New Order #{order_id}"
                        }
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": f"*Table:* {table_number}"
                            },
                            {
                                "type": "mrkdwn",
                                "text": f"*Order Time:* {datetime.utcnow().strftime('%H:%M')}"
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*Items:*\n{items_text}"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": f"*Special Instructions:* {special_instructions}"
                        }
                    }
                ]
            }
            
            return await self.execute_tool("slack_staff_notification", user_id, parameters)
        except Exception as e:
            logger.error(f"Failed to send kitchen order notification: {e}")
            raise

    def get_service_status(self) -> Dict[str, Any]:
        """
        Get the current status of the Arcade service.
        
        Returns:
            Dict containing service status information
        """
        return {
            "available": self.is_available,
            "client_initialized": self.client is not None,
            "sdk_version": "arcade-ai>=0.1.0" if self.is_available else None,
            "hospitality_tools": len(self.get_available_tools()) if self.is_available else 0,
            "last_check": datetime.utcnow().isoformat()
        }


# Global instance
arcade_service = ArcadeService()


@asynccontextmanager
async def get_arcade_service():
    """Context manager for Arcade service."""
    try:
        yield arcade_service
    except Exception as e:
        logger.error(f"Arcade service error: {e}")
        raise
