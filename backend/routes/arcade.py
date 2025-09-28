"""
Arcade MCP Integration Routes for Buffr Host Platform

This module provides API endpoints for integrating Arcade's MCP tools
with the hospitality management platform.
"""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, Field

from auth.dependencies import get_current_user
from auth.permissions import HospitalityPermissions, require_permission
from services.arcade_service import ArcadeService, get_arcade_service

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()


# Pydantic models for request/response
class AuthorizationRequest(BaseModel):
    """Request model for starting authorization."""

    user_id: str = Field(..., description="Unique user identifier")
    provider: str = Field(
        ..., description="OAuth provider (google, microsoft, slack, etc.)"
    )
    scopes: List[str] = Field(..., description="List of OAuth scopes to request")


class AuthorizationResponse(BaseModel):
    """Response model for authorization."""

    status: str = Field(..., description="Authorization status")
    url: Optional[str] = Field(
        None, description="Authorization URL if status is pending"
    )
    user_id: str = Field(..., description="User identifier")
    provider: str = Field(..., description="OAuth provider")
    scopes: List[str] = Field(..., description="Requested scopes")
    created_at: str = Field(..., description="Creation timestamp")


class ToolExecutionRequest(BaseModel):
    """Request model for tool execution."""

    tool_name: str = Field(..., description="Name of the tool to execute")
    user_id: str = Field(..., description="User ID for authentication context")
    parameters: Dict[str, Any] = Field(..., description="Tool-specific parameters")


class ToolExecutionResponse(BaseModel):
    """Response model for tool execution."""

    tool_name: str = Field(..., description="Name of the executed tool")
    user_id: str = Field(..., description="User ID")
    status: str = Field(..., description="Execution status")
    result: Any = Field(..., description="Execution result")
    executed_at: str = Field(..., description="Execution timestamp")


class NotificationRequest(BaseModel):
    """Request model for hospitality notifications."""

    notification_type: str = Field(..., description="Type of notification")
    message: str = Field(..., description="Notification message")
    recipient_email: Optional[str] = Field(None, description="Recipient email address")


class BookingEventRequest(BaseModel):
    """Request model for booking calendar events."""

    service_type: str = Field(..., description="Type of service")
    customer_name: str = Field(..., description="Customer name")
    customer_email: Optional[str] = Field(None, description="Customer email")
    property_name: str = Field(..., description="Property name")
    start_time: str = Field(..., description="Start time (ISO format)")
    end_time: str = Field(..., description="End time (ISO format)")
    timezone: str = Field(default="UTC", description="Timezone")
    notes: Optional[str] = Field(None, description="Additional notes")


class StaffNotificationRequest(BaseModel):
    """Request model for staff notifications."""

    staff_member: str = Field(..., description="Staff member to notify")
    message: str = Field(..., description="Notification message")
    channel: Optional[str] = Field(None, description="Slack channel")


class BookingConfirmationRequest(BaseModel):
    """Request model for booking confirmation emails."""

    customer_name: str = Field(..., description="Customer name")
    customer_email: str = Field(..., description="Customer email address")
    service_type: str = Field(..., description="Type of service booked")
    property_name: str = Field(..., description="Property name")
    booking_id: str = Field(..., description="Unique booking identifier")
    booking_date: str = Field(..., description="Booking date")
    booking_time: str = Field(..., description="Booking time")
    duration: Optional[str] = Field(None, description="Service duration")
    special_requests: Optional[str] = Field(None, description="Special requests")


class StaffScheduleRequest(BaseModel):
    """Request model for staff schedule events."""

    staff_name: str = Field(..., description="Staff member name")
    staff_email: Optional[str] = Field(None, description="Staff email address")
    shift_type: str = Field(..., description="Type of shift")
    department: str = Field(..., description="Department")
    role: str = Field(..., description="Staff role")
    start_time: str = Field(..., description="Shift start time (ISO format)")
    end_time: str = Field(..., description="Shift end time (ISO format)")
    timezone: str = Field(default="UTC", description="Timezone")
    notes: Optional[str] = Field(None, description="Additional notes")


class KitchenOrderRequest(BaseModel):
    """Request model for kitchen order notifications."""

    order_id: str = Field(..., description="Order identifier")
    table_number: str = Field(..., description="Table number")
    items: List[Dict[str, Any]] = Field(..., description="Order items")
    special_instructions: Optional[str] = Field(
        None, description="Special cooking instructions"
    )


@router.get("/status", response_model=Dict[str, Any])
async def get_arcade_status(
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Get the current status of the Arcade service."""
    try:
        status_info = arcade_service.get_service_status()
        return {
            "success": True,
            "status": status_info,
            "message": "Arcade service status retrieved successfully",
        }
    except Exception as e:
        logger.error(f"Failed to get Arcade status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Arcade service status",
        )


@router.get("/tools", response_model=List[Dict[str, Any]])
async def get_available_tools(
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Get list of available Arcade tools."""
    try:
        tools = await arcade_service.get_available_tools()
        return {
            "success": True,
            "tools": tools,
            "count": len(tools),
            "message": "Available tools retrieved successfully",
        }
    except Exception as e:
        logger.error(f"Failed to get available tools: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve available tools",
        )


@router.post("/auth/start", response_model=AuthorizationResponse)
async def start_authorization(
    request: AuthorizationRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Start the authorization process for a user with a specific provider."""
    try:
        result = await arcade_service.start_authorization(
            user_id=request.user_id, provider=request.provider, scopes=request.scopes
        )
        return AuthorizationResponse(**result)
    except Exception as e:
        logger.error(f"Failed to start authorization: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start authorization process",
        )


@router.post("/auth/complete", response_model=Dict[str, Any])
async def complete_authorization(
    auth_response: Dict[str, Any],
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Complete the authorization process and get the token."""
    try:
        result = await arcade_service.wait_for_authorization_completion(auth_response)
        return {
            "success": True,
            "result": result,
            "message": "Authorization completed successfully",
        }
    except Exception as e:
        logger.error(f"Failed to complete authorization: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete authorization process",
        )


@router.post("/tools/execute", response_model=ToolExecutionResponse)
async def execute_tool(
    request: ToolExecutionRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Execute an Arcade tool with the given parameters."""
    try:
        result = await arcade_service.execute_tool(
            tool_name=request.tool_name,
            user_id=request.user_id,
            parameters=request.parameters,
        )
        return ToolExecutionResponse(**result)
    except Exception as e:
        logger.error(f"Failed to execute tool {request.tool_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute tool: {str(e)}",
        )


@router.post("/notifications/hospitality", response_model=Dict[str, Any])
async def send_hospitality_notification(
    request: NotificationRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Send hospitality-related notifications using Arcade tools."""
    try:
        result = await arcade_service.send_hospitality_notification(
            user_id=current_user.get("id"),
            notification_type=request.notification_type,
            message=request.message,
            recipient_email=request.recipient_email,
        )
        return {
            "success": True,
            "result": result,
            "message": "Hospitality notification sent successfully",
        }
    except Exception as e:
        logger.error(f"Failed to send hospitality notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send hospitality notification",
        )


@router.post("/calendar/booking", response_model=Dict[str, Any])
async def create_booking_calendar_event(
    request: BookingEventRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Create a calendar event for a booking using Arcade tools."""
    try:
        booking_details = {
            "service_type": request.service_type,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "property_name": request.property_name,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "timezone": request.timezone,
            "notes": request.notes,
        }

        result = await arcade_service.create_booking_calendar_event(
            user_id=current_user.get("id"), booking_details=booking_details
        )
        return {
            "success": True,
            "result": result,
            "message": "Booking calendar event created successfully",
        }
    except Exception as e:
        logger.error(f"Failed to create booking calendar event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create booking calendar event",
        )


@router.post("/notifications/staff", response_model=Dict[str, Any])
async def send_staff_notification(
    request: StaffNotificationRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Send staff notifications using Slack integration."""
    try:
        result = await arcade_service.send_staff_notification(
            user_id=current_user.get("id"),
            staff_member=request.staff_member,
            message=request.message,
            channel=request.channel,
        )
        return {
            "success": True,
            "result": result,
            "message": "Staff notification sent successfully",
        }
    except Exception as e:
        logger.error(f"Failed to send staff notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send staff notification",
        )


@router.post("/hospitality/booking-confirmation", response_model=Dict[str, Any])
async def send_booking_confirmation(
    request: BookingConfirmationRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Send booking confirmation email using Arcade Gmail integration."""
    try:
        booking_data = {
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "service_type": request.service_type,
            "property_name": request.property_name,
            "booking_id": request.booking_id,
            "booking_date": request.booking_date,
            "booking_time": request.booking_time,
            "duration": request.duration,
            "special_requests": request.special_requests,
        }

        result = await arcade_service.send_booking_confirmation(
            user_id=current_user.get("id"), booking_data=booking_data
        )
        return {
            "success": True,
            "result": result,
            "message": "Booking confirmation email sent successfully",
        }
    except Exception as e:
        logger.error(f"Failed to send booking confirmation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send booking confirmation email",
        )


@router.post("/hospitality/staff-schedule", response_model=Dict[str, Any])
async def create_staff_schedule_event(
    request: StaffScheduleRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Create staff schedule event using Arcade Calendar integration."""
    try:
        schedule_data = {
            "staff_name": request.staff_name,
            "staff_email": request.staff_email,
            "shift_type": request.shift_type,
            "department": request.department,
            "role": request.role,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "timezone": request.timezone,
            "notes": request.notes,
        }

        result = await arcade_service.create_staff_schedule_event(
            user_id=current_user.get("id"), schedule_data=schedule_data
        )
        return {
            "success": True,
            "result": result,
            "message": "Staff schedule event created successfully",
        }
    except Exception as e:
        logger.error(f"Failed to create staff schedule event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create staff schedule event",
        )


@router.post("/hospitality/kitchen-order", response_model=Dict[str, Any])
async def send_kitchen_order_notification(
    request: KitchenOrderRequest,
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Send kitchen order notification using Arcade Slack integration."""
    try:
        order_data = {
            "order_id": request.order_id,
            "table_number": request.table_number,
            "items": request.items,
            "special_instructions": request.special_instructions,
        }

        result = await arcade_service.send_kitchen_order_notification(
            user_id=current_user.get("id"), order_data=order_data
        )
        return {
            "success": True,
            "result": result,
            "message": "Kitchen order notification sent successfully",
        }
    except Exception as e:
        logger.error(f"Failed to send kitchen order notification: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send kitchen order notification",
        )


@router.get("/integrations/health")
async def health_check(
    current_user: dict = Depends(get_current_user),
    arcade_service: ArcadeService = Depends(get_arcade_service),
):
    """Health check endpoint for Arcade integrations."""
    try:
        status_info = arcade_service.get_service_status()
        return {
            "status": "healthy" if status_info["available"] else "unavailable",
            "arcade_service": status_info,
            "timestamp": "2024-01-01T00:00:00Z",
            "version": "1.0.0",
        }
    except Exception as e:
        logger.error(f"Arcade health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Arcade service unhealthy",
        )
