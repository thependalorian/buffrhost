"""
Calendar routes for The Shandi Hospitality Ecosystem Management Platform.
Provides API endpoints for calendar and booking management.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from datetime import date, time
from decimal import Decimal
from uuid import UUID

from database import get_db
from models.user import BuffrHostUser
from routes.auth import get_current_user, require_property_access, require_permission
from auth.rbac import Permission
from services.calendar_service import CalendarService

router = APIRouter()

# --- Room Availability & Reservations ---

@router.get("/properties/{property_id}/calendar/rooms/availability")
async def get_room_availability(
    property_id: int,
    check_in_date: date = Query(..., description="Check-in date (YYYY-MM-DD)"),
    check_out_date: date = Query(..., description="Check-out date (YYYY-MM-DD)"),
    room_type_id: Optional[int] = Query(None, description="Filter by room type ID"),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get available rooms for a given date range and optional room type."""
    service = CalendarService(db)
    available_rooms = await service.check_room_availability(property_id, room_type_id, check_in_date, check_out_date)
    return {"success": True, "available_rooms": available_rooms}

@router.post("/properties/{property_id}/calendar/rooms/reservations")
async def create_room_reservation(
    property_id: int,
    reservation_data: Dict[str, Any],
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Create a new room reservation."""
    service = CalendarService(db)
    try:
        reservation = await service.create_room_reservation(
            property_id=property_id,
            customer_id=UUID(reservation_data["customer_id"]),
            room_id=reservation_data["room_id"],
            room_type_id=reservation_data["room_type_id"],
            check_in_date=date.fromisoformat(reservation_data["check_in_date"]),
            check_out_date=date.fromisoformat(reservation_data["check_out_date"]),
            number_of_guests=reservation_data["number_of_guests"],
            adults=reservation_data["adults"],
            children=reservation_data.get("children", 0),
            base_rate=Decimal(str(reservation_data["base_rate"])),
            total_amount=Decimal(str(reservation_data["total_amount"])),
            payment_status=reservation_data.get("payment_status", 'pending'),
            special_requests=reservation_data.get("special_requests")
        )
        return {"success": True, "message": "Reservation created successfully", "reservation_id": str(reservation.reservation_id)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/properties/{property_id}/calendar/rooms/reservations/{reservation_id}/status")
async def update_room_reservation_status(
    property_id: int,
    reservation_id: UUID,
    new_status: str = Query(..., description="New status for the reservation"),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Update the status of a room reservation."""
    service = CalendarService(db)
    reservation = await service.update_room_reservation_status(reservation_id, new_status)
    if not reservation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")
    return {"success": True, "message": "Reservation status updated", "reservation_id": str(reservation.reservation_id), "new_status": reservation.reservation_status}

# --- Service Availability & Bookings ---

@router.get("/properties/{property_id}/calendar/services/availability")
async def get_service_availability(
    property_id: int,
    service_type: str = Query(..., description="Type of service (e.g., spa, conference)"),
    booking_date: date = Query(..., description="Booking date (YYYY-MM-DD)"),
    start_time: time = Query(..., description="Start time (HH:MM)"),
    end_time: time = Query(..., description="End time (HH:MM)"),
    service_id: Optional[int] = Query(None, description="Filter by specific service instance ID"),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Check availability for a specific service (spa, conference, etc.)."""
    service = CalendarService(db)
    available_services = await service.check_service_availability(property_id, service_type, service_id, booking_date, start_time, end_time)
    return {"success": True, "available_services": available_services}

@router.post("/properties/{property_id}/calendar/services/bookings")
async def create_service_booking(
    property_id: int,
    booking_data: Dict[str, Any],
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Create a new service booking."""
    service = CalendarService(db)
    try:
        booking = await service.create_service_booking(
            property_id=property_id,
            customer_id=UUID(booking_data["customer_id"]),
            service_type=booking_data["service_type"],
            service_id=booking_data["service_id"],
            booking_date=date.fromisoformat(booking_data["booking_date"]),
            start_time=time.fromisoformat(booking_data["start_time"]),
            end_time=time.fromisoformat(booking_data["end_time"]),
            total_price=Decimal(str(booking_data["total_price"])),
            special_requests=booking_data.get("special_requests")
        )
        return {"success": True, "message": "Service booking created successfully", "booking_id": str(booking.booking_id)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/properties/{property_id}/calendar/services/bookings/{booking_id}/status")
async def update_service_booking_status(
    property_id: int,
    booking_id: UUID,
    new_status: str = Query(..., description="New status for the service booking"),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Update the status of a service booking."""
    service = CalendarService(db)
    booking = await service.update_service_booking_status(booking_id, new_status)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service booking not found")
    return {"success": True, "message": "Service booking status updated", "booking_id": str(booking.booking_id), "new_status": booking.status}

# --- Combined Schedule View ---

@router.get("/properties/{property_id}/calendar/schedule")
async def get_combined_schedule(
    property_id: int,
    target_date: date = Query(..., description="Target date for the schedule (YYYY-MM-DD)"),
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """Get a combined daily schedule of room reservations and service bookings."""
    service = CalendarService(db)
    schedule = await service.get_daily_schedule(property_id, target_date)
    return {"success": True, "schedule": schedule}
