"""
Hospitality property management routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database import get_db
from models.hospitality_property import HospitalityProperty
from models.user import BuffrHostUser
from schemas.hospitality_property import (
    HospitalityPropertyCreate, 
    HospitalityPropertyUpdate, 
    HospitalityPropertyResponse, 
    HospitalityPropertySummary,
    HospitalityPropertyStats
)
from services.hospitality_property_service import HospitalityPropertyService
from routes.auth import get_current_user, require_permission, require_property_access
from auth.rbac import Permission

router = APIRouter()


@router.get("/{property_id}", response_model=HospitalityPropertyResponse)
async def get_hospitality_property(
    property_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get hospitality property information."""
    service = HospitalityPropertyService(db)
    property = service.get_property(property_id)
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return HospitalityPropertyResponse.from_orm(property)


@router.put("/{property_id}", response_model=HospitalityPropertyResponse)
async def update_hospitality_property(
    property_id: int,
    property_update: HospitalityPropertyUpdate,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update hospitality property information."""
    service = HospitalityPropertyService(db)
    
    # Update property
    update_data = property_update.dict(exclude_unset=True)
    property = service.update_property(property_id, update_data)
    
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return HospitalityPropertyResponse.from_orm(property)


@router.get("/", response_model=List[HospitalityPropertySummary])
async def list_hospitality_properties(
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List hospitality properties accessible to the current user."""
    service = HospitalityPropertyService(db)
    
    # For now, return only the user's property
    # In a multi-tenant system, this would return all properties the user has access to
    property = service.get_property(current_user.property_id)
    
    if not property:
        return []
    
    return [HospitalityPropertySummary.from_orm(property)]


@router.get("/{property_id}/stats")
async def get_hospitality_property_stats(
    property_id: int,
    current_user: BuffrHostUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get hospitality property statistics and metrics."""
    service = HospitalityPropertyService(db)
    
    # Get statistics from service
    stats = service.get_property_statistics(property_id)
    return stats
