"""
Hotel Configuration Service
Handles hotel type configuration and service selection during onboarding
"""

from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update, delete
from models.hotel_configuration import HotelConfiguration, HotelService, HotelType
from schemas.hotel_configuration import (
    HotelConfigurationCreate,
    HotelConfigurationUpdate,
    HotelConfigurationResponse,
    HotelTypeResponse,
    HotelServiceResponse
)


class HotelTypeEnum(str, Enum):
    BOUTIQUE_HOTEL = "boutique_hotel"
    VACATION_RENTAL = "vacation_rental"
    RESORT_LODGE = "resort_lodge"
    GUEST_HOUSE = "guest_house"
    HOTEL_CHAIN = "hotel_chain"
    SPECIALTY_ACCOMMODATION = "specialty_accommodation"


class HotelServiceEnum(str, Enum):
    ROOM_MANAGEMENT = "room_management"
    FNB_OPERATIONS = "fnb_operations"
    SPA_WELLNESS = "spa_wellness"
    ACTIVITY_CENTER = "activity_center"
    CONFERENCE_FACILITIES = "conference_facilities"
    FITNESS_CENTER = "fitness_center"
    TRANSPORT_SERVICES = "transport_services"
    RETAIL_GIFT_SHOP = "retail_gift_shop"


class HotelConfigurationService:
    """Service for managing hotel configurations and service selections"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_hotel_types(self) -> List[HotelTypeResponse]:
        """Get all available hotel types"""
        result = await self.db.execute(select(HotelType))
        hotel_types = result.scalars().all()
        
        return [
            HotelTypeResponse(
                id=ht.id,
                name=ht.name,
                description=ht.description,
                icon=ht.icon,
                common_services=ht.common_services,
                is_active=ht.is_active
            )
            for ht in hotel_types
        ]
    
    async def get_hotel_services(self) -> List[HotelServiceResponse]:
        """Get all available hotel services"""
        result = await self.db.execute(select(HotelService))
        services = result.scalars().all()
        
        return [
            HotelServiceResponse(
                id=hs.id,
                name=hs.name,
                description=hs.description,
                category=hs.category,
                icon=hs.icon,
                is_active=hs.is_active
            )
            for hs in services
        ]
    
    async def create_hotel_configuration(
        self, 
        property_id: int,
        hotel_type: HotelTypeEnum,
        selected_services: List[HotelServiceEnum],
        configuration_data: Dict[str, Any]
    ) -> HotelConfigurationResponse:
        """Create a new hotel configuration for a property"""
        
        # Create the hotel configuration
        hotel_config = HotelConfiguration(
            property_id=property_id,
            hotel_type=hotel_type.value,
            selected_services=[service.value for service in selected_services],
            configuration_data=configuration_data,
            is_active=True
        )
        
        self.db.add(hotel_config)
        await self.db.commit()
        await self.db.refresh(hotel_config)
        
        return HotelConfigurationResponse(
            id=hotel_config.id,
            property_id=hotel_config.property_id,
            hotel_type=hotel_config.hotel_type,
            selected_services=hotel_config.selected_services,
            configuration_data=hotel_config.configuration_data,
            is_active=hotel_config.is_active,
            created_at=hotel_config.created_at,
            updated_at=hotel_config.updated_at
        )
    
    async def get_hotel_configuration(
        self, 
        property_id: int
    ) -> Optional[HotelConfigurationResponse]:
        """Get hotel configuration for a property"""
        
        result = await self.db.execute(
            select(HotelConfiguration).where(
                HotelConfiguration.property_id == property_id,
                HotelConfiguration.is_active == True
            )
        )
        config = result.scalar_one_or_none()
        
        if not config:
            return None
        
        return HotelConfigurationResponse(
            id=config.id,
            property_id=config.property_id,
            hotel_type=config.hotel_type,
            selected_services=config.selected_services,
            configuration_data=config.configuration_data,
            is_active=config.is_active,
            created_at=config.created_at,
            updated_at=config.updated_at
        )
    
    async def update_hotel_configuration(
        self,
        property_id: int,
        hotel_type: Optional[HotelTypeEnum] = None,
        selected_services: Optional[List[HotelServiceEnum]] = None,
        configuration_data: Optional[Dict[str, Any]] = None
    ) -> Optional[HotelConfigurationResponse]:
        """Update hotel configuration for a property"""
        
        # Get existing configuration
        result = await self.db.execute(
            select(HotelConfiguration).where(
                HotelConfiguration.property_id == property_id,
                HotelConfiguration.is_active == True
            )
        )
        config = result.scalar_one_or_none()
        
        if not config:
            return None
        
        # Update fields
        if hotel_type:
            config.hotel_type = hotel_type.value
        if selected_services:
            config.selected_services = [service.value for service in selected_services]
        if configuration_data:
            config.configuration_data = configuration_data
        
        await self.db.commit()
        await self.db.refresh(config)
        
        return HotelConfigurationResponse(
            id=config.id,
            property_id=config.property_id,
            hotel_type=config.hotel_type,
            selected_services=config.selected_services,
            configuration_data=config.configuration_data,
            is_active=config.is_active,
            created_at=config.created_at,
            updated_at=config.updated_at
        )
    
    async def get_recommended_services(
        self, 
        hotel_type: HotelTypeEnum
    ) -> List[HotelServiceResponse]:
        """Get recommended services for a specific hotel type"""
        
        # Get hotel type configuration
        result = await self.db.execute(
            select(HotelType).where(HotelType.name == hotel_type.value)
        )
        hotel_type_config = result.scalar_one_or_none()
        
        if not hotel_type_config:
            return []
        
        # Get recommended services based on common services
        recommended_service_names = hotel_type_config.common_services
        
        result = await self.db.execute(
            select(HotelService).where(
                HotelService.name.in_(recommended_service_names),
                HotelService.is_active == True
            )
        )
        services = result.scalars().all()
        
        return [
            HotelServiceResponse(
                id=hs.id,
                name=hs.name,
                description=hs.description,
                category=hs.category,
                icon=hs.icon,
                is_active=hs.is_active
            )
            for hs in services
        ]
    
    async def initialize_default_data(self):
        """Initialize default hotel types and services"""
        
        # Check if data already exists
        result = await self.db.execute(select(HotelType))
        existing_types = result.scalars().all()
        
        if existing_types:
            return  # Data already exists
        
        # Create default hotel types
        hotel_types = [
            HotelType(
                name="boutique_hotel",
                description="Luxury properties with personalized service",
                icon="Sparkles",
                common_services=["spa_wellness", "fnb_operations", "room_management"],
                is_active=True
            ),
            HotelType(
                name="vacation_rental",
                description="Airbnb, holiday homes, and short-term rentals",
                icon="Home",
                common_services=["room_management", "activity_center"],
                is_active=True
            ),
            HotelType(
                name="resort_lodge",
                description="Large properties with multiple amenities",
                icon="Building2",
                common_services=["room_management", "fnb_operations", "spa_wellness", "activity_center", "conference_facilities"],
                is_active=True
            ),
            HotelType(
                name="guest_house",
                description="Smaller properties with intimate service",
                icon="Bed",
                common_services=["room_management", "activity_center"],
                is_active=True
            ),
            HotelType(
                name="hotel_chain",
                description="Multi-location hotel groups",
                icon="Users2",
                common_services=["room_management", "fnb_operations", "conference_facilities"],
                is_active=True
            ),
            HotelType(
                name="specialty_accommodation",
                description="Camping, glamping, and unique stays",
                icon="Star",
                common_services=["activity_center", "transport_services"],
                is_active=True
            )
        ]
        
        for hotel_type in hotel_types:
            self.db.add(hotel_type)
        
        # Create default hotel services
        hotel_services = [
            HotelService(
                name="room_management",
                description="Check-in/out, housekeeping, maintenance, and room service",
                category="Accommodation",
                icon="Bed",
                is_active=True
            ),
            HotelService(
                name="fnb_operations",
                description="Restaurants, bars, room service, and banquet management",
                category="Food & Beverage",
                icon="Utensils",
                is_active=True
            ),
            HotelService(
                name="spa_wellness",
                description="Treatment bookings, therapist scheduling, and product sales",
                category="Wellness",
                icon="Sparkles",
                is_active=True
            ),
            HotelService(
                name="activity_center",
                description="Tours, excursions, equipment rental, and experience booking",
                category="Experiences",
                icon="Car",
                is_active=True
            ),
            HotelService(
                name="conference_facilities",
                description="Meeting rooms, event spaces, catering, and AV equipment",
                category="Business",
                icon="Users2",
                is_active=True
            ),
            HotelService(
                name="fitness_center",
                description="Gym access, personal training, and class scheduling",
                category="Wellness",
                icon="Dumbbell",
                is_active=True
            ),
            HotelService(
                name="transport_services",
                description="Airport shuttle, car rental, and local transportation",
                category="Transport",
                icon="Car",
                is_active=True
            ),
            HotelService(
                name="retail_gift_shop",
                description="Souvenirs, essentials, and local products",
                category="Retail",
                icon="Wine",
                is_active=True
            )
        ]
        
        for service in hotel_services:
            self.db.add(service)
        
        await self.db.commit()
