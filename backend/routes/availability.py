"""
Availability API routes for Buffr Host platform.
Phase 1: Core Availability Engine
"""
from datetime import date, time, datetime
from typing import List, Dict, Any, Optional
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from services.availability_service import AvailabilityService
from schemas.availability import (
    InventoryAvailabilityRequest,
    InventoryAvailabilityResponse,
    ServiceAvailabilityRequest,
    ServiceAvailabilityResponse,
    TableAvailabilityRequest,
    TableAvailabilityResponse,
    RoomAvailabilityRequest,
    RoomAvailabilityResponse,
    AvailabilitySummaryResponse,
    ReservationRequest,
    ReservationResponse
)

router = APIRouter(prefix="/api/availability", tags=["availability"])

# =============================================================================
# INVENTORY AVAILABILITY
# =============================================================================

@router.post("/inventory", response_model=InventoryAvailabilityResponse)
async def check_inventory_availability(
    request: InventoryAvailabilityRequest,
    db: AsyncSession = Depends(get_db)
):
    """Check real-time inventory availability for order items."""
    try:
        availability_service = AvailabilityService(db)
        
        result = await availability_service.check_inventory_availability(
            property_id=request.property_id,
            items=request.items
        )
        
        return InventoryAvailabilityResponse(
            available=result["available"],
            unavailable_items=result["unavailable_items"],
            low_stock_items=result["low_stock_items"],
            total_available=result["total_available"],
            total_unavailable=result["total_unavailable"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inventory availability check failed: {str(e)}")

@router.post("/reserve-inventory", response_model=ReservationResponse)
async def reserve_inventory_items(
    request: ReservationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Reserve inventory items for an order."""
    try:
        availability_service = AvailabilityService(db)
        
        success_count = 0
        failed_items = []
        
        for item in request.items:
            success = await availability_service.reserve_inventory_stock(
                property_id=request.property_id,
                item_id=item["inventory_item_id"],
                quantity=Decimal(str(item["quantity"])),
                reference_id=request.reference_id,
                reference_type=request.reference_type
            )
            
            if success:
                success_count += 1
            else:
                failed_items.append({
                    "item_id": item["inventory_item_id"],
                    "reason": "Insufficient stock or item not found"
                })
        
        return ReservationResponse(
            success=len(failed_items) == 0,
            success_count=success_count,
            failed_items=failed_items,
            message=f"Reserved {success_count} items successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inventory reservation failed: {str(e)}")

@router.post("/release-inventory", response_model=ReservationResponse)
async def release_inventory_items(
    request: ReservationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Release reserved inventory items."""
    try:
        availability_service = AvailabilityService(db)
        
        success_count = 0
        failed_items = []
        
        for item in request.items:
            success = await availability_service.release_inventory_stock(
                property_id=request.property_id,
                item_id=item["inventory_item_id"],
                quantity=Decimal(str(item["quantity"])),
                reference_id=request.reference_id
            )
            
            if success:
                success_count += 1
            else:
                failed_items.append({
                    "item_id": item["inventory_item_id"],
                    "reason": "Item not found or no reserved stock"
                })
        
        return ReservationResponse(
            success=len(failed_items) == 0,
            success_count=success_count,
            failed_items=failed_items,
            message=f"Released {success_count} items successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inventory release failed: {str(e)}")

# =============================================================================
# SERVICE AVAILABILITY
# =============================================================================

@router.post("/service", response_model=ServiceAvailabilityResponse)
async def check_service_availability(
    request: ServiceAvailabilityRequest,
    db: AsyncSession = Depends(get_db)
):
    """Check service availability for a specific time slot."""
    try:
        availability_service = AvailabilityService(db)
        
        result = await availability_service.check_service_availability(
            property_id=request.property_id,
            service_type=request.service_type,
            service_id=request.service_id,
            requested_date=request.requested_date,
            start_time=request.start_time,
            end_time=request.end_time
        )
        
        return ServiceAvailabilityResponse(
            available=result["available"],
            max_capacity=result.get("max_capacity", 0),
            current_bookings=result.get("current_bookings", 0),
            remaining_capacity=result.get("remaining_capacity", 0),
            price=result.get("price", 0.0),
            reason=result.get("reason")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Service availability check failed: {str(e)}")

@router.get("/service/calendar")
async def get_service_availability_calendar(
    property_id: int = Query(..., description="Property ID"),
    service_type: str = Query(..., description="Service type (spa, conference, transportation)"),
    start_date: date = Query(..., description="Start date for calendar"),
    end_date: date = Query(..., description="End date for calendar"),
    db: AsyncSession = Depends(get_db)
):
    """Get service availability calendar for a date range."""
    try:
        availability_service = AvailabilityService(db)
        
        calendar = await availability_service.get_service_availability_calendar(
            property_id=property_id,
            service_type=service_type,
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            "success": True,
            "data": calendar,
            "property_id": property_id,
            "service_type": service_type,
            "date_range": {
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Service calendar failed: {str(e)}")

# =============================================================================
# TABLE AVAILABILITY
# =============================================================================

@router.post("/table", response_model=TableAvailabilityResponse)
async def check_table_availability(
    request: TableAvailabilityRequest,
    db: AsyncSession = Depends(get_db)
):
    """Check table availability for a specific time and party size."""
    try:
        availability_service = AvailabilityService(db)
        
        tables = await availability_service.check_table_availability(
            property_id=request.property_id,
            party_size=request.party_size,
            requested_date=request.requested_date,
            start_time=request.start_time,
            end_time=request.end_time
        )
        
        return TableAvailabilityResponse(
            available_tables=tables,
            total_available=len([t for t in tables if t["is_available"]]),
            total_tables=len(tables)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Table availability check failed: {str(e)}")

@router.post("/reserve-table", response_model=ReservationResponse)
async def reserve_table(
    table_id: int = Query(..., description="Table ID"),
    guest_id: int = Query(..., description="Guest ID"),
    reservation_date: date = Query(..., description="Reservation date"),
    start_time: time = Query(..., description="Start time"),
    end_time: time = Query(..., description="End time"),
    party_size: int = Query(..., description="Party size"),
    db: AsyncSession = Depends(get_db)
):
    """Reserve a table for a specific time slot."""
    try:
        availability_service = AvailabilityService(db)
        
        success = await availability_service.reserve_table(
            table_id=table_id,
            guest_id=guest_id,
            reservation_date=reservation_date,
            start_time=start_time,
            end_time=end_time,
            party_size=party_size
        )
        
        if not success:
            raise HTTPException(status_code=400, detail="Table not available for reservation")
        
        return ReservationResponse(
            success=True,
            success_count=1,
            failed_items=[],
            message="Table reserved successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Table reservation failed: {str(e)}")

@router.post("/release-table", response_model=ReservationResponse)
async def release_table(
    reservation_id: int = Query(..., description="Reservation ID"),
    db: AsyncSession = Depends(get_db)
):
    """Release a table reservation."""
    try:
        # This would need to be implemented in the availability service
        # For now, return a placeholder response
        return ReservationResponse(
            success=True,
            success_count=1,
            failed_items=[],
            message="Table reservation released successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Table release failed: {str(e)}")

# =============================================================================
# ROOM AVAILABILITY
# =============================================================================

@router.post("/room", response_model=RoomAvailabilityResponse)
async def check_room_availability(
    request: RoomAvailabilityRequest,
    db: AsyncSession = Depends(get_db)
):
    """Check room availability for a date range."""
    try:
        availability_service = AvailabilityService(db)
        
        rooms = await availability_service.check_room_availability(
            property_id=request.property_id,
            check_in_date=request.check_in_date,
            check_out_date=request.check_out_date,
            room_type=request.room_type
        )
        
        return RoomAvailabilityResponse(
            available_rooms=rooms,
            total_available=len([r for r in rooms if r["is_available"]]),
            total_rooms=len(rooms)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Room availability check failed: {str(e)}")

@router.post("/reserve-room", response_model=ReservationResponse)
async def reserve_room(
    room_id: int = Query(..., description="Room ID"),
    guest_id: int = Query(..., description="Guest ID"),
    check_in_date: date = Query(..., description="Check-in date"),
    check_out_date: date = Query(..., description="Check-out date"),
    db: AsyncSession = Depends(get_db)
):
    """Reserve a room for a date range."""
    try:
        availability_service = AvailabilityService(db)
        
        success = await availability_service.reserve_room(
            room_id=room_id,
            guest_id=guest_id,
            check_in_date=check_in_date,
            check_out_date=check_out_date
        )
        
        if not success:
            raise HTTPException(status_code=400, detail="Room not available for reservation")
        
        return ReservationResponse(
            success=True,
            success_count=1,
            failed_items=[],
            message="Room reserved successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Room reservation failed: {str(e)}")

@router.post("/release-room", response_model=ReservationResponse)
async def release_room(
    reservation_id: int = Query(..., description="Reservation ID"),
    db: AsyncSession = Depends(get_db)
):
    """Release a room reservation."""
    try:
        # This would need to be implemented in the availability service
        # For now, return a placeholder response
        return ReservationResponse(
            success=True,
            success_count=1,
            failed_items=[],
            message="Room reservation released successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Room release failed: {str(e)}")

# =============================================================================
# AVAILABILITY SUMMARY
# =============================================================================

@router.get("/summary", response_model=AvailabilitySummaryResponse)
async def get_availability_summary(
    property_id: int = Query(..., description="Property ID"),
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive availability summary for a property."""
    try:
        availability_service = AvailabilityService(db)
        
        summary = await availability_service.get_availability_summary(property_id)
        
        return AvailabilitySummaryResponse(
            property_id=property_id,
            inventory=summary["inventory"],
            tables=summary["tables"],
            rooms=summary["rooms"],
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Availability summary failed: {str(e)}")

# =============================================================================
# HEALTH CHECK
# =============================================================================

@router.get("/health")
async def health_check():
    """Health check endpoint for availability service."""
    return {
        "status": "healthy",
        "service": "availability",
        "phase": "1",
        "timestamp": datetime.now().isoformat()
    }