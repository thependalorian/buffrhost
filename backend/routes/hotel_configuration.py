"""
Hotel Configuration API Routes
FastAPI routes for hotel type configuration and service selection
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.hotel_configuration_service import HotelConfigurationService, HotelTypeEnum, HotelServiceEnum
from schemas.hotel_configuration import (
    HotelTypeResponse,
    HotelServiceResponse,
    HotelConfigurationCreate,
    HotelConfigurationUpdate,
    HotelConfigurationResponse,
    BusinessConfigurationResponse
)
from auth.dependencies import get_current_user
from auth.permissions import require_permission
from models.user import User

router = APIRouter(prefix="/api/v1/hotel-configuration", tags=["hotel-configuration"])


@router.get("/hotel-types", response_model=List[HotelTypeResponse])
async def get_hotel_types(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all available hotel types"""
    service = HotelConfigurationService(db)
    return await service.get_hotel_types()


@router.get("/hotel-services", response_model=List[HotelServiceResponse])
async def get_hotel_services(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all available hotel services"""
    service = HotelConfigurationService(db)
    return await service.get_hotel_services()


@router.get("/hotel-types/{hotel_type}/recommended-services", response_model=List[HotelServiceResponse])
async def get_recommended_services(
    hotel_type: HotelTypeEnum,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get recommended services for a specific hotel type"""
    service = HotelConfigurationService(db)
    return await service.get_recommended_services(hotel_type)


@router.post("/configurations", response_model=HotelConfigurationResponse)
@require_permission("hotel_configuration:write")
async def create_hotel_configuration(
    config_data: HotelConfigurationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new hotel configuration for a property"""
    service = HotelConfigurationService(db)
    
    # Validate hotel type
    try:
        hotel_type_enum = HotelTypeEnum(config_data.hotel_type)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid hotel type: {config_data.hotel_type}"
        )
    
    # Validate selected services
    try:
        selected_services = [HotelServiceEnum(service) for service in config_data.selected_services]
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid service: {str(e)}"
        )
    
    return await service.create_hotel_configuration(
        property_id=config_data.property_id,
        hotel_type=hotel_type_enum,
        selected_services=selected_services,
        configuration_data=config_data.configuration_data
    )


@router.get("/configurations/{property_id}", response_model=Optional[HotelConfigurationResponse])
@require_permission("hotel_configuration:read")
async def get_hotel_configuration(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get hotel configuration for a property"""
    service = HotelConfigurationService(db)
    return await service.get_hotel_configuration(property_id)


@router.put("/configurations/{property_id}", response_model=Optional[HotelConfigurationResponse])
@require_permission("hotel_configuration:write")
async def update_hotel_configuration(
    property_id: int,
    config_data: HotelConfigurationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update hotel configuration for a property"""
    service = HotelConfigurationService(db)
    
    # Validate hotel type if provided
    hotel_type_enum = None
    if config_data.hotel_type:
        try:
            hotel_type_enum = HotelTypeEnum(config_data.hotel_type)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid hotel type: {config_data.hotel_type}"
            )
    
    # Validate selected services if provided
    selected_services = None
    if config_data.selected_services:
        try:
            selected_services = [HotelServiceEnum(service) for service in config_data.selected_services]
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid service: {str(e)}"
            )
    
    return await service.update_hotel_configuration(
        property_id=property_id,
        hotel_type=hotel_type_enum,
        selected_services=selected_services,
        configuration_data=config_data.configuration_data
    )


@router.get("/business-configuration/{property_id}", response_model=BusinessConfigurationResponse)
@require_permission("hotel_configuration:read")
async def get_business_configuration(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get complete business configuration for a property"""
    service = HotelConfigurationService(db)
    
    # Get hotel configuration
    hotel_config = await service.get_hotel_configuration(property_id)
    
    # Determine business type
    business_type = "primary"
    if hotel_config:
        business_type = "hotel"
    
    return BusinessConfigurationResponse(
        property_id=property_id,
        hotel_configuration=hotel_config,
        restaurant_configuration=None,  # TODO: Implement restaurant configuration
        business_type=business_type
    )


@router.post("/initialize-default-data")
@require_permission("hotel_configuration:write")
async def initialize_default_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Initialize default hotel types and services (admin only)"""
    # TODO: Add admin role check
    service = HotelConfigurationService(db)
    await service.initialize_default_data()
    return {"message": "Default data initialized successfully"}
