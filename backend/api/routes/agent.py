"""
FastAPI Routes for Buffr Host Agent
API endpoints for agent interactions, personality management, and health monitoring
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import json
import asyncio

from ...ai.agent.graph import create_buffr_graph
from ...ai.agent.agent import create_buffr_agent
from ...ai.agent.models import BookingRequest, RestaurantOrder, ServiceRequest


router = APIRouter(prefix="/api/agent", tags=["agent"])

# Global agent instances cache
_agent_instances: Dict[str, Any] = {}


class ChatRequest(BaseModel):
    """Request for agent chat"""
    message: str = Field(..., min_length=1, max_length=1000)
    tenant_id: str
    user_id: str
    property_id: int
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response from agent chat"""
    response: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    requires_human: bool
    intent: Optional[str]
    personality: Dict[str, Any]
    session_id: str
    timestamp: datetime


class BookingRequestAPI(BaseModel):
    """API request for booking"""
    booking_type: str = Field(..., regex="^(room|spa|restaurant|shuttle|tour|service)$")
    guest_name: str = Field(..., min_length=1, max_length=255)
    date: str = Field(..., regex="^\d{4}-\d{2}-\d{2}$")
    time: Optional[str] = Field(None, regex="^\d{2}:\d{2}$")
    service_name: Optional[str] = None
    special_requests: Optional[str] = None
    party_size: int = Field(default=1, ge=1, le=20)


class OrderRequestAPI(BaseModel):
    """API request for restaurant order"""
    items: List[Dict[str, Any]] = Field(..., min_items=1)
    table_number: Optional[int] = Field(None, ge=1, le=100)
    delivery_room: Optional[str] = None
    special_instructions: Optional[str] = None


class ServiceRequestAPI(BaseModel):
    """API request for service"""
    service_type: str = Field(..., regex="^(spa|shuttle|tour|rental|restaurant)$")
    service_name: str = Field(..., min_length=1, max_length=255)
    guest_name: str = Field(..., min_length=1, max_length=255)
    date: str = Field(..., regex="^\d{4}-\d{2}-\d{2}$")
    time: str = Field(..., regex="^\d{2}:\d{2}$")
    party_size: int = Field(default=1, ge=1, le=20)
    special_requests: Optional[str] = None


class PersonalityAnalytics(BaseModel):
    """Personality analytics response"""
    personality_summary: Dict[str, Any]
    analytics: Dict[str, Any]
    timestamp: datetime


class HealthStatus(BaseModel):
    """Agent health status"""
    status: str
    personality_loaded: bool
    property_context_loaded: bool
    memory_service_available: bool
    tools_available: List[str]
    last_interaction: Optional[datetime]
    uptime_seconds: float
    error_count: int
    success_rate: float


def get_agent_graph(tenant_id: str, property_id: int):
    """Get or create agent graph instance"""
    key = f"{tenant_id}_{property_id}"
    
    if key not in _agent_instances:
        # This would use actual neon_client in production
        from ...database import get_neon_client
        neon_client = get_neon_client()
        
        _agent_instances[key] = create_buffr_graph(neon_client, tenant_id, property_id)
    
    return _agent_instances[key]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chat endpoint with personality integration"""
    try:
        # Get agent graph
        graph = get_agent_graph(request.tenant_id, request.property_id)
        
        # Run workflow
        result = await graph.run(
            message=request.message,
            user_id=request.user_id,
            session_id=request.session_id
        )
        
        return ChatResponse(
            response=result["response"],
            confidence_score=result["confidence_score"],
            requires_human=result["requires_human"],
            intent=result["intent"],
            personality=result["personality"],
            session_id=result["session_id"],
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Streaming chat endpoint"""
    async def generate_stream():
        try:
            # Get agent graph
            graph = get_agent_graph(request.tenant_id, request.property_id)
            
            # Run workflow
            result = await graph.run(
                message=request.message,
                user_id=request.user_id,
                session_id=request.session_id
            )
            
            # Stream response
            response_text = result["response"]
            for i, char in enumerate(response_text):
                yield f"data: {json.dumps({'char': char, 'index': i})}\n\n"
                await asyncio.sleep(0.01)  # Small delay for streaming effect
            
            # Send final metadata
            yield f"data: {json.dumps({'complete': True, 'confidence': result['confidence_score']})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(),
        media_type="text/plain",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )


@router.post("/booking")
async def create_booking(request: BookingRequestAPI, tenant_id: str, property_id: int):
    """Create a booking through agent"""
    try:
        # Get agent graph
        graph = get_agent_graph(tenant_id, property_id)
        
        # Convert API request to model
        booking_request = BookingRequest(
            booking_type=request.booking_type,
            guest_name=request.guest_name,
            date=datetime.strptime(request.date, "%Y-%m-%d").date(),
            time=datetime.strptime(request.time, "%H:%M").time() if request.time else None,
            service_name=request.service_name,
            special_requests=request.special_requests,
            party_size=request.party_size
        )
        
        # Use agent tools to create booking
        agent = graph.agent
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        result = await agent.tools.create_booking(booking_request)
        
        if result.success:
            return {"success": True, "booking": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Booking error: {str(e)}")


@router.post("/order")
async def place_order(request: OrderRequestAPI, tenant_id: str, property_id: int):
    """Place restaurant order through agent"""
    try:
        # Get agent graph
        graph = get_agent_graph(tenant_id, property_id)
        
        # Convert API request to model
        from ...ai.agent.models import OrderItem
        order_items = [OrderItem(**item) for item in request.items]
        
        order = RestaurantOrder(
            items=order_items,
            table_number=request.table_number,
            delivery_room=request.delivery_room,
            special_instructions=request.special_instructions
        )
        
        # Use agent tools to place order
        agent = graph.agent
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        result = await agent.tools.place_restaurant_order(order)
        
        if result.success:
            return {"success": True, "order": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order error: {str(e)}")


@router.get("/personality/{property_id}")
async def get_personality(property_id: int, tenant_id: str):
    """Get current agent personality state"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        analytics = await graph.get_personality_analytics()
        
        return PersonalityAnalytics(
            personality_summary=analytics.get("personality_summary", {}),
            analytics=analytics.get("analytics", {}),
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Personality error: {str(e)}")


@router.get("/health/{property_id}")
async def get_health(property_id: int, tenant_id: str):
    """Get agent health status"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        health = await graph.get_health_status()
        
        return HealthStatus(
            status=health.get("status", "unknown"),
            personality_loaded=health.get("personality_loaded", False),
            property_context_loaded=health.get("property_context_loaded", False),
            memory_service_available=health.get("memory_service_available", False),
            tools_available=health.get("tools_available", []),
            last_interaction=health.get("last_interaction"),
            uptime_seconds=health.get("uptime_seconds", 0.0),
            error_count=health.get("error_count", 0),
            success_rate=health.get("success_rate", 0.0)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check error: {str(e)}")


@router.get("/services/{property_id}")
async def get_services(property_id: int, tenant_id: str, service_type: Optional[str] = None):
    """Get available services for property"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        agent = graph.agent
        
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        if service_type:
            result = await agent.tools.get_service_info(service_type)
        else:
            # Get all service types
            all_services = {}
            for service_type in ["spa", "shuttle", "tour", "rental", "restaurant"]:
                result = await agent.tools.get_service_info(service_type)
                if result.success:
                    all_services[service_type] = result.result
            
            return {"services": all_services}
        
        if result.success:
            return {"services": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Services error: {str(e)}")


@router.get("/menu/{property_id}")
async def get_menu(property_id: int, tenant_id: str, category: Optional[str] = None):
    """Get restaurant menu for property"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        agent = graph.agent
        
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        result = await agent.tools.get_menu_items(category)
        
        if result.success:
            return {"menu": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Menu error: {str(e)}")


@router.post("/calculate")
async def calculate_cost(
    items: List[Dict[str, Any]], 
    apply_taxes: bool = True, 
    apply_service_charge: bool = True,
    tenant_id: str = None,
    property_id: int = None
):
    """Calculate cost for items"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        agent = graph.agent
        
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        result = await agent.tools.calculate_cost(items, apply_taxes, apply_service_charge)
        
        if result.success:
            return {"calculation": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@router.post("/availability")
async def check_availability(
    service_type: str,
    date: str,
    time: Optional[str] = None,
    tenant_id: str = None,
    property_id: int = None
):
    """Check availability for service or room"""
    try:
        graph = get_agent_graph(tenant_id, property_id)
        agent = graph.agent
        
        if not agent:
            raise HTTPException(status_code=500, detail="Agent not initialized")
        
        date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        time_obj = datetime.strptime(time, "%H:%M").time() if time else None
        
        result = await agent.tools.check_availability(service_type, date_obj, time_obj)
        
        if result.success:
            return {"availability": result.result}
        else:
            raise HTTPException(status_code=400, detail=result.error_message)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Availability error: {str(e)}")


@router.delete("/cache/{property_id}")
async def clear_cache(property_id: int, tenant_id: str):
    """Clear agent cache for property"""
    try:
        key = f"{tenant_id}_{property_id}"
        if key in _agent_instances:
            graph = _agent_instances[key]
            if hasattr(graph, 'agent') and graph.agent:
                graph.agent.clear_cache()
        
        return {"message": "Cache cleared successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cache clear error: {str(e)}")
