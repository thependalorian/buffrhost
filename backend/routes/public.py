from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from database import get_db
from schemas.public import (
    RoomSearchRequest, 
    RoomAvailabilityResponse,
    GuestBookingCreate,
    MenuResponse,
    CheckinRequest,
    PropertyAvailabilityResponse,
    BookingConfirmationResponse
)
from services.booking_service import BookingService
from services.menu_service import MenuService
from services.hospitality_property_service import HospitalityPropertyService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/public", tags=["public"])

@router.post("/rooms/search", response_model=List[RoomAvailabilityResponse])
async def search_rooms(
    request: RoomSearchRequest,
    db: Session = Depends(get_db)
):
    """Search for available rooms with real-time availability"""
    try:
        booking_service = BookingService(db)
        available_rooms = await booking_service.get_availability(
            property_id=request.property_id,
            check_in=request.check_in,
            check_out=request.check_out,
            guests=request.guests
        )
        return available_rooms
    except Exception as e:
        logger.error(f"Room search failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/menu/{restaurant_id}", response_model=MenuResponse)
async def get_restaurant_menu(
    restaurant_id: str,
    db: Session = Depends(get_db)
):
    """Get public menu for a restaurant with categories and items"""
    try:
        menu_service = MenuService(db)
        menu = await menu_service.get_public_menu(restaurant_id)
        if not menu:
            raise HTTPException(status_code=404, detail="Menu not found")
        return menu
    except Exception as e:
        logger.error(f"Menu fetch failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/bookings", response_model=BookingConfirmationResponse)
async def create_public_booking(
    booking_data: GuestBookingCreate,
    db: Session = Depends(get_db)
):
    """Create a booking from public guest interface"""
    try:
        booking_service = BookingService(db)
        
        # Validate availability
        is_available = await booking_service.check_room_availability(
            booking_data.room_id,
            booking_data.check_in,
            booking_data.check_out
        )
        
        if not is_available:
            raise HTTPException(status_code=400, detail="Room not available for selected dates")
        
        # Create booking
        booking = await booking_service.create_public_booking(booking_data)
        
        return BookingConfirmationResponse(
            success=True,
            booking_id=str(booking.id),
            confirmation_number=booking.confirmation_number,
            message="Booking created successfully",
            check_in=booking.check_in,
            check_out=booking.check_out,
            room_number=booking.room_number,
            total_amount=float(booking.total_amount)
        )
    except Exception as e:
        logger.error(f"Booking creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/properties/{property_id}/availability", response_model=List[PropertyAvailabilityResponse])
async def get_property_availability(
    property_id: str,
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(get_db)
):
    """Get property-wide availability calendar"""
    try:
        property_service = HospitalityPropertyService(db)
        availability = await property_service.get_availability_calendar(
            property_id, start_date, end_date
        )
        
        # Convert to response format
        response = []
        for date_str, data in availability.items():
            response.append(PropertyAvailabilityResponse(
                property_id=property_id,
                date=date_str,
                total_rooms=data['total_rooms'],
                booked_rooms=data['booked_rooms'],
                available_rooms=data['available_rooms'],
                occupancy_rate=data['occupancy_rate']
            ))
        
        return response
    except Exception as e:
        logger.error(f"Availability fetch failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/checkin/{confirmation_number}")
async def guest_checkin(
    confirmation_number: str,
    guest_data: CheckinRequest,
    db: Session = Depends(get_db)
):
    """Guest self check-in with confirmation number"""
    try:
        booking_service = BookingService(db)
        result = await booking_service.process_guest_checkin(
            confirmation_number, guest_data.dict()
        )
        return result
    except Exception as e:
        logger.error(f"Check-in failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/properties/{property_id}/info")
async def get_property_info(
    property_id: str,
    db: Session = Depends(get_db)
):
    """Get public property information"""
    try:
        property_service = HospitalityPropertyService(db)
        property_info = await property_service.get_property(property_id)
        
        if not property_info:
            raise HTTPException(status_code=404, detail="Property not found")
        
        return {
            "property_id": str(property_info.id),
            "name": property_info.name,
            "description": property_info.description,
            "address": property_info.address,
            "phone": property_info.phone,
            "email": property_info.email,
            "amenities": property_info.amenities,
            "images": property_info.images,
            "check_in_time": property_info.check_in_time,
            "check_out_time": property_info.check_out_time
        }
    except Exception as e:
        logger.error(f"Property info fetch failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/health")
async def public_health_check():
    """Public health check endpoint"""
    return {
        "status": "healthy",
        "service": "public-api",
        "timestamp": datetime.utcnow()
    }