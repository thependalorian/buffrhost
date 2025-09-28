"""
Buffr Host Agent API Routes

This module provides API endpoints for the Buffr Host AI agent with:
- LangGraph workflow orchestration
- Arcade AI tool integration
- Memory management
- Real-time streaming responses
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import (APIRouter, Depends, HTTPException, WebSocket,
                     WebSocketDisconnect, status)
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ai.buffr_host_agent_with_memory import BuffrHostAgent, get_buffr_agent
from auth.dependencies import get_current_user
from auth.permissions import HospitalityPermissions, require_permission

logger = logging.getLogger(__name__)

router = APIRouter()


# Pydantic models for request/response
class GuestMessageRequest(BaseModel):
    """Request model for guest messages."""

    message: str = Field(..., description="Guest's message")
    user_id: str = Field(..., description="User identifier")
    property_id: int = Field(default=1, description="Property ID for context")


class GuestMessageResponse(BaseModel):
    """Response model for guest messages."""

    response: str = Field(..., description="AI agent's response")
    user_id: str = Field(..., description="User identifier")
    property_id: int = Field(..., description="Property ID")
    timestamp: str = Field(..., description="Response timestamp")
    success: bool = Field(..., description="Success status")
    tools_used: List[str] = Field(
        default_factory=list, description="Tools used in response"
    )


class BookingConfirmationRequest(BaseModel):
    """Request model for booking confirmations."""

    customer_name: str = Field(..., description="Customer name")
    customer_email: str = Field(..., description="Customer email address")
    service_type: str = Field(..., description="Type of service booked")
    property_name: str = Field(..., description="Property name")
    booking_id: str = Field(..., description="Unique booking identifier")
    booking_date: str = Field(..., description="Booking date")
    booking_time: str = Field(..., description="Booking time")
    duration: Optional[str] = Field(None, description="Service duration")
    special_requests: Optional[str] = Field(None, description="Special requests")


class CalendarEventRequest(BaseModel):
    """Request model for calendar events."""

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


class MemoryRequest(BaseModel):
    """Request model for storing memories."""

    user_id: str = Field(..., description="User identifier")
    content: str = Field(..., description="Memory content")


class MemoryResponse(BaseModel):
    """Response model for memories."""

    memories: List[Dict[str, Any]] = Field(..., description="List of memories")
    count: int = Field(..., description="Number of memories")


@router.get("/status", response_model=Dict[str, Any])
async def get_agent_status(
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Get the current status of the Buffr Host agent."""
    try:
        status_info = await agent.health_check()
        return {
            "success": True,
            "status": status_info,
            "message": "Agent status retrieved successfully",
        }
    except Exception as e:
        logger.error(f"Failed to get agent status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve agent status",
        )


@router.get("/tools", response_model=List[Dict[str, Any]])
async def get_available_tools(
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Get list of available tools for the agent."""
    try:
        tools = agent.get_available_tools()
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


@router.post("/chat", response_model=GuestMessageResponse)
async def process_guest_message(
    request: GuestMessageRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Process a guest message through the AI agent."""
    try:
        result = await agent.process_guest_message(
            message=request.message,
            user_id=request.user_id,
            property_id=request.property_id,
        )

        return GuestMessageResponse(**result)

    except Exception as e:
        logger.error(f"Failed to process guest message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process guest message",
        )


@router.post("/chat/stream")
async def process_guest_message_stream(
    request: GuestMessageRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Process a guest message with streaming response."""

    async def generate_stream():
        try:
            # Create a queue to collect streaming content
            content_queue = asyncio.Queue()

            def stream_writer(content):
                content_queue.put_nowait(content)

            # Process message with streaming
            result = await agent.process_guest_message(
                message=request.message,
                user_id=request.user_id,
                property_id=request.property_id,
                stream_writer=stream_writer,
            )

            # Stream the response
            while not content_queue.empty():
                content = await content_queue.get()
                yield f"data: {json.dumps({'content': content})}\n\n"

            # Send final result
            yield f"data: {json.dumps({'result': result})}\n\n"
            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@router.websocket("/chat/ws")
async def websocket_chat(
    websocket: WebSocket,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """WebSocket endpoint for real-time chat with the agent."""
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Process message
            result = await agent.process_guest_message(
                message=message_data.get("message", ""),
                user_id=message_data.get("user_id", "anonymous"),
                property_id=message_data.get("property_id", 1),
            )

            # Send response back to client
            await websocket.send_text(json.dumps(result))

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()


@router.post("/booking/confirmation", response_model=Dict[str, Any])
async def send_booking_confirmation(
    request: BookingConfirmationRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Send booking confirmation using Arcade AI tools."""
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

        result = await agent.send_booking_confirmation(
            user_id=current_user.get("id"), booking_data=booking_data
        )

        return {
            "success": True,
            "result": result,
            "message": "Booking confirmation sent successfully",
        }

    except Exception as e:
        logger.error(f"Failed to send booking confirmation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send booking confirmation",
        )


@router.post("/calendar/event", response_model=Dict[str, Any])
async def create_calendar_event(
    request: CalendarEventRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Create calendar event using Arcade AI tools."""
    try:
        event_data = {
            "service_type": request.service_type,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "property_name": request.property_name,
            "start_time": request.start_time,
            "end_time": request.end_time,
            "timezone": request.timezone,
            "notes": request.notes,
        }

        result = await agent.create_calendar_event(
            user_id=current_user.get("id"), event_data=event_data
        )

        return {
            "success": True,
            "result": result,
            "message": "Calendar event created successfully",
        }

    except Exception as e:
        logger.error(f"Failed to create calendar event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create calendar event",
        )


@router.post("/notifications/staff", response_model=Dict[str, Any])
async def send_staff_notification(
    request: StaffNotificationRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Send staff notification using Arcade AI tools."""
    try:
        notification_data = {
            "staff_member": request.staff_member,
            "message": request.message,
            "channel": request.channel,
        }

        result = await agent.send_staff_notification(
            user_id=current_user.get("id"), notification_data=notification_data
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


@router.get("/memories/{user_id}", response_model=MemoryResponse)
async def get_conversation_memories(
    user_id: str,
    query: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Get conversation memories for a user."""
    try:
        memories = await agent.get_conversation_memories(
            user_id=user_id, query=query or ""
        )

        return MemoryResponse(memories=memories, count=len(memories))

    except Exception as e:
        logger.error(f"Failed to get conversation memories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation memories",
        )


@router.post("/memories", response_model=Dict[str, Any])
async def store_memory(
    request: MemoryRequest,
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Store a memory for a user."""
    try:
        success = await agent.store_memory(
            user_id=request.user_id, content=request.content
        )

        return {
            "success": success,
            "message": "Memory stored successfully"
            if success
            else "Failed to store memory",
        }

    except Exception as e:
        logger.error(f"Failed to store memory: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store memory",
        )


@router.get("/demo")
async def demo_agent(
    current_user: dict = Depends(get_current_user),
    agent: BuffrHostAgent = Depends(get_buffr_agent),
):
    """Demo endpoint to showcase agent capabilities."""
    try:
        # Example guest message
        demo_message = "Hi, I'd like to book a spa appointment for tomorrow afternoon. Also, remember that I prefer the deep tissue massage."

        # Process the message
        result = await agent.process_guest_message(
            message=demo_message, user_id="demo@example.com", property_id=1
        )

        # Store a memory
        memory_stored = await agent.store_memory(
            user_id="demo@example.com",
            content="Demo guest prefers deep tissue massage for spa appointments",
        )

        # Get available tools
        tools = agent.get_available_tools()

        return {
            "success": True,
            "demo": {
                "message": demo_message,
                "response": result["response"],
                "memory_stored": memory_stored,
                "available_tools": tools,
                "timestamp": datetime.utcnow().isoformat(),
            },
            "message": "Demo completed successfully",
        }

    except Exception as e:
        logger.error(f"Demo failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Demo failed"
        )
