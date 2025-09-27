"""
Conference service routes for The Shandi Hospitality Ecosystem Management Platform
Provides API endpoints for conference facility management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import date

from database import get_db
from models.user import User
from routes.auth import get_current_user, require_property_access, require_permission
from auth.rbac import Permission
from services.conference_service import ConferenceService
from schemas.conference import ConferenceRoom, ConferenceBooking, ConferenceBookingCreate, ConferenceAmenity, ConferencePackage

router = APIRouter()

@router.get("/{property_id}/conference/rooms", response_model=List[ConferenceRoom])
async def get_conference_rooms(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get available conference rooms for a property"""
    conference_service = ConferenceService(db)
    return await conference_service.get_conference_rooms(property_id=property_id)

@router.get("/{property_id}/conference/bookings", response_model=List[ConferenceBooking])
async def get_conference_bookings(
    property_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get conference room bookings for a property"""
    conference_service = ConferenceService(db)
    return await conference_service.get_conference_bookings(property_id=property_id, start_date=start_date, end_date=end_date)

@router.post("/{property_id}/conference/bookings", response_model=ConferenceBooking)
async def create_conference_booking(
    property_id: int,
    booking_data: ConferenceBookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new conference room booking"""
    conference_service = ConferenceService(db)
    try:
        return await conference_service.create_conference_booking(property_id=property_id, booking_data=booking_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{property_id}/conference/amenities", response_model=List[ConferenceAmenity])
async def get_conference_amenities(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get available conference amenities for a property"""
    # This is a placeholder implementation. The service for amenities is not yet created.
    return []

@router.get("/{property_id}/conference/packages", response_model=List[ConferencePackage])
async def get_conference_packages(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get conference packages for a property"""
    # This is a placeholder implementation. The service for packages is not yet created.
    return []
