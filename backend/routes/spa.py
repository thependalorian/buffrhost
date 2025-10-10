"""
Spa service routes for Buffr Host Hospitality Ecosystem Management Platform
Provides API endpoints for spa service management.
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
from schemas.spa import (SpaAppointment, SpaAppointmentCreate, SpaService,
                         SpaTherapist)
from services.spa_service import SpaServiceClass

router = APIRouter()


@router.get("/{property_id}/spa/services", response_model=List[SpaService])
async def get_spa_services(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get available spa services for a property"""
    spa_service = SpaServiceClass(db)
    return await spa_service.get_spa_services(property_id=property_id)


@router.get("/{property_id}/spa/appointments", response_model=List[SpaAppointment])
async def get_spa_appointments(
    property_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get spa appointments for a property"""
    spa_service = SpaServiceClass(db)
    return await spa_service.get_spa_appointments(
        property_id=property_id, start_date=start_date, end_date=end_date
    )


@router.post("/{property_id}/spa/appointments", response_model=SpaAppointment)
async def create_spa_appointment(
    property_id: int,
    appointment_data: SpaAppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new spa appointment"""
    spa_service = SpaServiceClass(db)
    try:
        return await spa_service.create_spa_appointment(
            property_id=property_id, appointment_data=appointment_data
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{property_id}/spa/therapists", response_model=List[SpaTherapist])
async def get_spa_therapists(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get available spa therapists for a property"""
    spa_service = SpaServiceClass(db)
    return await spa_service.get_spa_therapists(property_id=property_id)
