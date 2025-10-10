"""
Buffr Host Hospitality Service
Manages hospitality properties, rooms, and core hospitality operations.
"""
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, Numeric
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/buffrhost_hospitality")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Database Models
class HospitalityProperty(Base):
    __tablename__ = "hospitality_properties"
    
    property_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String, nullable=False)
    property_name = Column(String, nullable=False)
    property_type = Column(String, default="restaurant")
    description = Column(Text)
    address = Column(Text, nullable=False)
    phone = Column(String)
    email = Column(String)
    website = Column(String)
    is_active = Column(Boolean, default=True)
    timezone = Column(String, default="UTC")
    services_offered = Column(JSON)  # Array of services
    amenities = Column(JSON)  # Array of amenities
    metadata = Column(JSON)  # Additional property data
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RoomType(Base):
    __tablename__ = "room_types"
    
    room_type_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    type_name = Column(String, nullable=False)
    description = Column(Text)
    base_price_per_night = Column(Numeric(10, 2), nullable=False)
    max_occupancy = Column(Integer, nullable=False)
    bed_type = Column(String)
    room_size_sqft = Column(Integer)
    amenities = Column(JSON)  # Array of amenities
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Room(Base):
    __tablename__ = "rooms"
    
    room_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    room_type_id = Column(Integer, nullable=False)
    room_number = Column(String, nullable=False)
    floor_number = Column(Integer)
    room_status = Column(String, default="available")
    is_smoking = Column(Boolean, default=False)
    is_accessible = Column(Boolean, default=False)
    view_type = Column(String)
    last_cleaned = Column(DateTime)
    last_maintenance = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RoomAmenity(Base):
    __tablename__ = "room_amenities"
    
    amenity_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    amenity_name = Column(String, nullable=False)
    amenity_category = Column(String)
    description = Column(Text)
    is_chargeable = Column(Boolean, default=False)
    additional_cost = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class PropertyCreate(BaseModel):
    property_name: str
    property_type: str = "restaurant"
    description: Optional[str] = None
    address: str
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    timezone: str = "UTC"
    services_offered: Optional[List[str]] = []
    amenities: Optional[List[str]] = []

class PropertyUpdate(BaseModel):
    property_name: Optional[str] = None
    property_type: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    timezone: Optional[str] = None
    services_offered: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    is_active: Optional[bool] = None

class PropertyResponse(BaseModel):
    property_id: int
    owner_id: str
    property_name: str
    property_type: str
    description: Optional[str]
    address: str
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    is_active: bool
    timezone: str
    services_offered: List[str]
    amenities: List[str]
    created_at: datetime
    updated_at: Optional[datetime]

class RoomTypeCreate(BaseModel):
    type_name: str
    description: Optional[str] = None
    base_price_per_night: float
    max_occupancy: int
    bed_type: Optional[str] = None
    room_size_sqft: Optional[int] = None
    amenities: Optional[List[str]] = []

class RoomTypeResponse(BaseModel):
    room_type_id: int
    property_id: int
    type_name: str
    description: Optional[str]
    base_price_per_night: float
    max_occupancy: int
    bed_type: Optional[str]
    room_size_sqft: Optional[int]
    amenities: List[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

class RoomCreate(BaseModel):
    room_type_id: int
    room_number: str
    floor_number: Optional[int] = None
    is_smoking: bool = False
    is_accessible: bool = False
    view_type: Optional[str] = None

class RoomResponse(BaseModel):
    room_id: int
    property_id: int
    room_type_id: int
    room_number: str
    floor_number: Optional[int]
    room_status: str
    is_smoking: bool
    is_accessible: bool
    view_type: Optional[str]
    last_cleaned: Optional[datetime]
    last_maintenance: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]

# Utility functions
async def get_db():
    """Get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Create FastAPI application
app = FastAPI(
    title="Buffr Host Hospitality Service",
    description="Hospitality property and room management service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
@app.on_event("startup")
async def startup_event():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "service": "hospitality-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Property management endpoints
@app.post("/properties", response_model=PropertyResponse)
async def create_property(property_data: PropertyCreate, db: AsyncSession = Depends(get_db)):
    """Create a new hospitality property."""
    import uuid
    
    property_obj = HospitalityProperty(
        owner_id=str(uuid.uuid4()),  # In real implementation, get from auth
        property_name=property_data.property_name,
        property_type=property_data.property_type,
        description=property_data.description,
        address=property_data.address,
        phone=property_data.phone,
        email=property_data.email,
        website=property_data.website,
        timezone=property_data.timezone,
        services_offered=property_data.services_offered or [],
        amenities=property_data.amenities or []
    )
    
    db.add(property_obj)
    await db.commit()
    await db.refresh(property_obj)
    
    return PropertyResponse(
        property_id=property_obj.property_id,
        owner_id=property_obj.owner_id,
        property_name=property_obj.property_name,
        property_type=property_obj.property_type,
        description=property_obj.description,
        address=property_obj.address,
        phone=property_obj.phone,
        email=property_obj.email,
        website=property_obj.website,
        is_active=property_obj.is_active,
        timezone=property_obj.timezone,
        services_offered=property_obj.services_offered or [],
        amenities=property_obj.amenities or [],
        created_at=property_obj.created_at,
        updated_at=property_obj.updated_at
    )

@app.get("/properties", response_model=List[PropertyResponse])
async def get_properties(
    skip: int = 0,
    limit: int = 100,
    property_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get all hospitality properties."""
    from sqlalchemy import select
    
    query = select(HospitalityProperty)
    
    if property_type:
        query = query.where(HospitalityProperty.property_type == property_type)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    properties = result.scalars().all()
    
    return [
        PropertyResponse(
            property_id=p.property_id,
            owner_id=p.owner_id,
            property_name=p.property_name,
            property_type=p.property_type,
            description=p.description,
            address=p.address,
            phone=p.phone,
            email=p.email,
            website=p.website,
            is_active=p.is_active,
            timezone=p.timezone,
            services_offered=p.services_offered or [],
            amenities=p.amenities or [],
            created_at=p.created_at,
            updated_at=p.updated_at
        )
        for p in properties
    ]

@app.get("/properties/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific hospitality property."""
    from sqlalchemy import select
    
    result = await db.execute(select(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return PropertyResponse(
        property_id=property_obj.property_id,
        owner_id=property_obj.owner_id,
        property_name=property_obj.property_name,
        property_type=property_obj.property_type,
        description=property_obj.description,
        address=property_obj.address,
        phone=property_obj.phone,
        email=property_obj.email,
        website=property_obj.website,
        is_active=property_obj.is_active,
        timezone=property_obj.timezone,
        services_offered=property_obj.services_offered or [],
        amenities=property_obj.amenities or [],
        created_at=property_obj.created_at,
        updated_at=property_obj.updated_at
    )

@app.put("/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a hospitality property."""
    from sqlalchemy import select
    
    result = await db.execute(select(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Update fields
    update_data = property_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property_obj, field, value)
    
    property_obj.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(property_obj)
    
    return PropertyResponse(
        property_id=property_obj.property_id,
        owner_id=property_obj.owner_id,
        property_name=property_obj.property_name,
        property_type=property_obj.property_type,
        description=property_obj.description,
        address=property_obj.address,
        phone=property_obj.phone,
        email=property_obj.email,
        website=property_obj.website,
        is_active=property_obj.is_active,
        timezone=property_obj.timezone,
        services_offered=property_obj.services_offered or [],
        amenities=property_obj.amenities or [],
        created_at=property_obj.created_at,
        updated_at=property_obj.updated_at
    )

@app.delete("/properties/{property_id}")
async def delete_property(property_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a hospitality property."""
    from sqlalchemy import select, delete
    
    result = await db.execute(select(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    await db.execute(delete(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    await db.commit()
    
    return {"message": "Property deleted successfully"}

# Room type management endpoints
@app.post("/properties/{property_id}/room-types", response_model=RoomTypeResponse)
async def create_room_type(
    property_id: int,
    room_type_data: RoomTypeCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new room type for a property."""
    from sqlalchemy import select
    
    # Verify property exists
    result = await db.execute(select(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    room_type = RoomType(
        property_id=property_id,
        type_name=room_type_data.type_name,
        description=room_type_data.description,
        base_price_per_night=room_type_data.base_price_per_night,
        max_occupancy=room_type_data.max_occupancy,
        bed_type=room_type_data.bed_type,
        room_size_sqft=room_type_data.room_size_sqft,
        amenities=room_type_data.amenities or []
    )
    
    db.add(room_type)
    await db.commit()
    await db.refresh(room_type)
    
    return RoomTypeResponse(
        room_type_id=room_type.room_type_id,
        property_id=room_type.property_id,
        type_name=room_type.type_name,
        description=room_type.description,
        base_price_per_night=float(room_type.base_price_per_night),
        max_occupancy=room_type.max_occupancy,
        bed_type=room_type.bed_type,
        room_size_sqft=room_type.room_size_sqft,
        amenities=room_type.amenities or [],
        is_active=room_type.is_active,
        created_at=room_type.created_at,
        updated_at=room_type.updated_at
    )

@app.get("/properties/{property_id}/room-types", response_model=List[RoomTypeResponse])
async def get_room_types(property_id: int, db: AsyncSession = Depends(get_db)):
    """Get all room types for a property."""
    from sqlalchemy import select
    
    result = await db.execute(select(RoomType).where(RoomType.property_id == property_id))
    room_types = result.scalars().all()
    
    return [
        RoomTypeResponse(
            room_type_id=rt.room_type_id,
            property_id=rt.property_id,
            type_name=rt.type_name,
            description=rt.description,
            base_price_per_night=float(rt.base_price_per_night),
            max_occupancy=rt.max_occupancy,
            bed_type=rt.bed_type,
            room_size_sqft=rt.room_size_sqft,
            amenities=rt.amenities or [],
            is_active=rt.is_active,
            created_at=rt.created_at,
            updated_at=rt.updated_at
        )
        for rt in room_types
    ]

# Room management endpoints
@app.post("/properties/{property_id}/rooms", response_model=RoomResponse)
async def create_room(
    property_id: int,
    room_data: RoomCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new room for a property."""
    from sqlalchemy import select
    
    # Verify property exists
    result = await db.execute(select(HospitalityProperty).where(HospitalityProperty.property_id == property_id))
    property_obj = result.scalar_one_or_none()
    
    if not property_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Verify room type exists
    result = await db.execute(select(RoomType).where(RoomType.room_type_id == room_data.room_type_id))
    room_type = result.scalar_one_or_none()
    
    if not room_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Room type not found"
        )
    
    room = Room(
        property_id=property_id,
        room_type_id=room_data.room_type_id,
        room_number=room_data.room_number,
        floor_number=room_data.floor_number,
        is_smoking=room_data.is_smoking,
        is_accessible=room_data.is_accessible,
        view_type=room_data.view_type
    )
    
    db.add(room)
    await db.commit()
    await db.refresh(room)
    
    return RoomResponse(
        room_id=room.room_id,
        property_id=room.property_id,
        room_type_id=room.room_type_id,
        room_number=room.room_number,
        floor_number=room.floor_number,
        room_status=room.room_status,
        is_smoking=room.is_smoking,
        is_accessible=room.is_accessible,
        view_type=room.view_type,
        last_cleaned=room.last_cleaned,
        last_maintenance=room.last_maintenance,
        created_at=room.created_at,
        updated_at=room.updated_at
    )

@app.get("/properties/{property_id}/rooms", response_model=List[RoomResponse])
async def get_rooms(property_id: int, db: AsyncSession = Depends(get_db)):
    """Get all rooms for a property."""
    from sqlalchemy import select
    
    result = await db.execute(select(Room).where(Room.property_id == property_id))
    rooms = result.scalars().all()
    
    return [
        RoomResponse(
            room_id=r.room_id,
            property_id=r.property_id,
            room_type_id=r.room_type_id,
            room_number=r.room_number,
            floor_number=r.floor_number,
            room_status=r.room_status,
            is_smoking=r.is_smoking,
            is_accessible=r.is_accessible,
            view_type=r.view_type,
            last_cleaned=r.last_cleaned,
            last_maintenance=r.last_maintenance,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        for r in rooms
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=os.getenv("ENVIRONMENT") == "development"
    )
