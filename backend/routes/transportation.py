"""
Transportation service routes for Buffr Host Hospitality Ecosystem Management Platform
Provides API endpoints for transportation service management.
"""

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.rbac import Permission
from database import get_db
from models.user import User
from routes.auth import (get_current_user, require_permission,
                         require_property_access)
from schemas.transportation import (TransportationBooking,
                                    TransportationBookingCreate,
                                    TransportationRoute, TransportationService,
                                    TransportationVehicle)
from services.transportation_service import TransportationServiceClass

router = APIRouter()


@router.get(
    "/{property_id}/transportation/services", response_model=List[TransportationService]
)
async def get_transportation_services(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get available transportation services for a property"""
    transportation_service = TransportationServiceClass(db)
    return await transportation_service.get_transportation_services(
        property_id=property_id
    )


@router.get(
    "/{property_id}/transportation/bookings", response_model=List[TransportationBooking]
)
async def get_transportation_bookings(
    property_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get transportation bookings for a property"""
    transportation_service = TransportationServiceClass(db)
    return await transportation_service.get_transportation_bookings(
        property_id=property_id, start_date=start_date, end_date=end_date
    )


@router.post(
    "/{property_id}/transportation/bookings", response_model=TransportationBooking
)
async def create_transportation_booking(
    property_id: int,
    booking_data: TransportationBookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new transportation booking"""
    transportation_service = TransportationServiceClass(db)
    try:
        return await transportation_service.create_transportation_booking(
            property_id=property_id, booking_data=booking_data
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get(
    "/{property_id}/transportation/vehicles", response_model=List[TransportationVehicle]
)
async def get_transportation_vehicles(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get available transportation vehicles for a property"""
    transportation_service = TransportationServiceClass(db)
    return await transportation_service.get_vehicles(property_id=property_id)


@router.get(
    "/{property_id}/transportation/routes", response_model=List[TransportationRoute]
)
async def get_transportation_routes(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get available transportation routes for a property"""
    # This is a placeholder implementation. The service for routes is not yet created.
    return []
