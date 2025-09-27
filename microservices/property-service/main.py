"""
Buffr Host Property Service - Microservice
Handles hospitality properties management for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_properties")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service configuration
SERVICE_NAME = "property-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8002))

# Enums
class PropertyType(str, Enum):
    RESTAURANT = "restaurant"
    HOTEL = "hotel"
    SPA = "spa"
    CONFERENCE = "conference"
    RESORT = "resort"
    CAFE = "cafe"
    BAR = "bar"
    CLUB = "club"

class PropertyStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    SUSPENDED = "suspended"

class PropertyTier(str, Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"
    LUXURY = "luxury"

class ServiceCategory(str, Enum):
    DINING = "dining"
    ACCOMMODATION = "accommodation"
    WELLNESS = "wellness"
    BUSINESS = "business"
    ENTERTAINMENT = "entertainment"
    TRANSPORTATION = "transportation"
    RECREATION = "recreation"

# Database Models
class Property(Base):
    __tablename__ = "properties"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    property_type = Column(String, nullable=False, index=True)
    status = Column(String, default=PropertyStatus.ACTIVE)
    tier = Column(String, default=PropertyTier.STANDARD)
    
    # Location Information
    address = Column(Text, nullable=False)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False)
    country = Column(String, nullable=False, index=True)
    postal_code = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact Information
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Business Information
    owner_id = Column(String, nullable=False, index=True)
    manager_id = Column(String, nullable=True, index=True)
    license_number = Column(String, nullable=True)
    tax_id = Column(String, nullable=True)
    
    # Operational Information
    capacity = Column(Integer, default=0)
    operating_hours = Column(JSON, default=dict)
    amenities = Column(JSON, default=list)
    services = Column(JSON, default=list)
    
    # Financial Information
    currency = Column(String, default="NAD")
    pricing_tier = Column(String, default="standard")
    commission_rate = Column(Float, default=0.0)
    
    # Settings and Configuration
    settings = Column(JSON, default=dict)
    preferences = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PropertyService(Base):
    __tablename__ = "property_services"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    service_name = Column(String, nullable=False)
    service_category = Column(String, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    pricing = Column(JSON, default=dict)
    availability = Column(JSON, default=dict)
    requirements = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PropertyAmenity(Base):
    __tablename__ = "property_amenities"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    amenity_name = Column(String, nullable=False)
    amenity_type = Column(String, nullable=False)
    description = Column(Text)
    is_available = Column(Boolean, default=True)
    additional_info = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class PropertyImage(Base):
    __tablename__ = "property_images"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    image_type = Column(String, nullable=False)  # main, gallery, logo, etc.
    alt_text = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PropertyReview(Base):
    __tablename__ = "property_reviews"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, ForeignKey("properties.id"), nullable=False, index=True)
    customer_id = Column(String, nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String, nullable=True)
    review_text = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    response_text = Column(Text, nullable=True)
    response_by = Column(String, nullable=True)
    response_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class PropertyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    property_type: PropertyType
    tier: PropertyTier = PropertyTier.STANDARD
    address: str
    city: str
    state: str
    country: str
    postal_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    owner_id: str
    manager_id: Optional[str] = None
    license_number: Optional[str] = None
    tax_id: Optional[str] = None
    capacity: int = 0
    operating_hours: Optional[Dict[str, Any]] = {}
    amenities: Optional[List[str]] = []
    services: Optional[List[str]] = []
    currency: str = "NAD"
    pricing_tier: str = "standard"
    commission_rate: float = 0.0
    settings: Optional[Dict[str, Any]] = {}
    preferences: Optional[Dict[str, Any]] = {}

class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[PropertyStatus] = None
    tier: Optional[PropertyTier] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    manager_id: Optional[str] = None
    license_number: Optional[str] = None
    tax_id: Optional[str] = None
    capacity: Optional[int] = None
    operating_hours: Optional[Dict[str, Any]] = None
    amenities: Optional[List[str]] = None
    services: Optional[List[str]] = None
    currency: Optional[str] = None
    pricing_tier: Optional[str] = None
    commission_rate: Optional[float] = None
    settings: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None

class PropertyServiceCreate(BaseModel):
    property_id: str
    service_name: str
    service_category: ServiceCategory
    description: Optional[str] = None
    pricing: Optional[Dict[str, Any]] = {}
    availability: Optional[Dict[str, Any]] = {}
    requirements: Optional[List[str]] = []

class PropertyResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    property_type: str
    status: str
    tier: str
    address: str
    city: str
    state: str
    country: str
    postal_code: str
    latitude: Optional[float]
    longitude: Optional[float]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    owner_id: str
    manager_id: Optional[str]
    license_number: Optional[str]
    tax_id: Optional[str]
    capacity: int
    operating_hours: Dict[str, Any]
    amenities: List[str]
    services: List[str]
    currency: str
    pricing_tier: str
    commission_rate: float
    settings: Dict[str, Any]
    preferences: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class PropertyMetrics(BaseModel):
    total_properties: int
    active_properties: int
    properties_by_type: Dict[str, int]
    properties_by_tier: Dict[str, int]
    properties_by_country: Dict[str, int]
    average_rating: float
    total_reviews: int

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for property service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email"), "role": payload.get("role")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="Hospitality properties management microservice",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "Hospitality properties management",
        "endpoints": {
            "health": "/health",
            "properties": "/api/properties",
            "services": "/api/properties/services",
            "amenities": "/api/properties/amenities",
            "reviews": "/api/properties/reviews",
            "metrics": "/api/properties/metrics"
        }
    }

@app.get("/api/properties", response_model=List[PropertyResponse])
async def get_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_type: Optional[PropertyType] = None,
    status: Optional[PropertyStatus] = None,
    tier: Optional[PropertyTier] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
    owner_id: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get properties with filtering and search"""
    query = db.query(Property)
    
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if status:
        query = query.filter(Property.status == status)
    if tier:
        query = query.filter(Property.tier == tier)
    if country:
        query = query.filter(Property.country == country)
    if city:
        query = query.filter(Property.city == city)
    if owner_id:
        query = query.filter(Property.owner_id == owner_id)
    if search:
        query = query.filter(
            (Property.name.ilike(f"%{search}%")) |
            (Property.description.ilike(f"%{search}%")) |
            (Property.address.ilike(f"%{search}%"))
        )
    
    properties = query.order_by(Property.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        PropertyResponse(
            id=property.id,
            name=property.name,
            description=property.description,
            property_type=property.property_type,
            status=property.status,
            tier=property.tier,
            address=property.address,
            city=property.city,
            state=property.state,
            country=property.country,
            postal_code=property.postal_code,
            latitude=property.latitude,
            longitude=property.longitude,
            phone=property.phone,
            email=property.email,
            website=property.website,
            owner_id=property.owner_id,
            manager_id=property.manager_id,
            license_number=property.license_number,
            tax_id=property.tax_id,
            capacity=property.capacity,
            operating_hours=property.operating_hours,
            amenities=property.amenities,
            services=property.services,
            currency=property.currency,
            pricing_tier=property.pricing_tier,
            commission_rate=property.commission_rate,
            settings=property.settings,
            preferences=property.preferences,
            created_at=property.created_at,
            updated_at=property.updated_at
        )
        for property in properties
    ]

@app.post("/api/properties", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new property"""
    new_property = Property(
        name=property_data.name,
        description=property_data.description,
        property_type=property_data.property_type,
        tier=property_data.tier,
        address=property_data.address,
        city=property_data.city,
        state=property_data.state,
        country=property_data.country,
        postal_code=property_data.postal_code,
        latitude=property_data.latitude,
        longitude=property_data.longitude,
        phone=property_data.phone,
        email=property_data.email,
        website=property_data.website,
        owner_id=property_data.owner_id,
        manager_id=property_data.manager_id,
        license_number=property_data.license_number,
        tax_id=property_data.tax_id,
        capacity=property_data.capacity,
        operating_hours=property_data.operating_hours,
        amenities=property_data.amenities,
        services=property_data.services,
        currency=property_data.currency,
        pricing_tier=property_data.pricing_tier,
        commission_rate=property_data.commission_rate,
        settings=property_data.settings,
        preferences=property_data.preferences
    )
    
    db.add(new_property)
    db.commit()
    db.refresh(new_property)
    
    logger.info(f"✅ Property created: {new_property.name}")
    
    return PropertyResponse(
        id=new_property.id,
        name=new_property.name,
        description=new_property.description,
        property_type=new_property.property_type,
        status=new_property.status,
        tier=new_property.tier,
        address=new_property.address,
        city=new_property.city,
        state=new_property.state,
        country=new_property.country,
        postal_code=new_property.postal_code,
        latitude=new_property.latitude,
        longitude=new_property.longitude,
        phone=new_property.phone,
        email=new_property.email,
        website=new_property.website,
        owner_id=new_property.owner_id,
        manager_id=new_property.manager_id,
        license_number=new_property.license_number,
        tax_id=new_property.tax_id,
        capacity=new_property.capacity,
        operating_hours=new_property.operating_hours,
        amenities=new_property.amenities,
        services=new_property.services,
        currency=new_property.currency,
        pricing_tier=new_property.pricing_tier,
        commission_rate=new_property.commission_rate,
        settings=new_property.settings,
        preferences=new_property.preferences,
        created_at=new_property.created_at,
        updated_at=new_property.updated_at
    )

@app.get("/api/properties/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific property by ID"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    return PropertyResponse(
        id=property.id,
        name=property.name,
        description=property.description,
        property_type=property.property_type,
        status=property.status,
        tier=property.tier,
        address=property.address,
        city=property.city,
        state=property.state,
        country=property.country,
        postal_code=property.postal_code,
        latitude=property.latitude,
        longitude=property.longitude,
        phone=property.phone,
        email=property.email,
        website=property.website,
        owner_id=property.owner_id,
        manager_id=property.manager_id,
        license_number=property.license_number,
        tax_id=property.tax_id,
        capacity=property.capacity,
        operating_hours=property.operating_hours,
        amenities=property.amenities,
        services=property.services,
        currency=property.currency,
        pricing_tier=property.pricing_tier,
        commission_rate=property.commission_rate,
        settings=property.settings,
        preferences=property.preferences,
        created_at=property.created_at,
        updated_at=property.updated_at
    )

@app.put("/api/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    property_data: PropertyUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a property"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Update fields
    if property_data.name is not None:
        property.name = property_data.name
    if property_data.description is not None:
        property.description = property_data.description
    if property_data.status is not None:
        property.status = property_data.status
    if property_data.tier is not None:
        property.tier = property_data.tier
    if property_data.address is not None:
        property.address = property_data.address
    if property_data.city is not None:
        property.city = property_data.city
    if property_data.state is not None:
        property.state = property_data.state
    if property_data.country is not None:
        property.country = property_data.country
    if property_data.postal_code is not None:
        property.postal_code = property_data.postal_code
    if property_data.latitude is not None:
        property.latitude = property_data.latitude
    if property_data.longitude is not None:
        property.longitude = property_data.longitude
    if property_data.phone is not None:
        property.phone = property_data.phone
    if property_data.email is not None:
        property.email = property_data.email
    if property_data.website is not None:
        property.website = property_data.website
    if property_data.manager_id is not None:
        property.manager_id = property_data.manager_id
    if property_data.license_number is not None:
        property.license_number = property_data.license_number
    if property_data.tax_id is not None:
        property.tax_id = property_data.tax_id
    if property_data.capacity is not None:
        property.capacity = property_data.capacity
    if property_data.operating_hours is not None:
        property.operating_hours = property_data.operating_hours
    if property_data.amenities is not None:
        property.amenities = property_data.amenities
    if property_data.services is not None:
        property.services = property_data.services
    if property_data.currency is not None:
        property.currency = property_data.currency
    if property_data.pricing_tier is not None:
        property.pricing_tier = property_data.pricing_tier
    if property_data.commission_rate is not None:
        property.commission_rate = property_data.commission_rate
    if property_data.settings is not None:
        property.settings = property_data.settings
    if property_data.preferences is not None:
        property.preferences = property_data.preferences
    
    property.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(property)
    
    logger.info(f"✅ Property updated: {property.name}")
    
    return PropertyResponse(
        id=property.id,
        name=property.name,
        description=property.description,
        property_type=property.property_type,
        status=property.status,
        tier=property.tier,
        address=property.address,
        city=property.city,
        state=property.state,
        country=property.country,
        postal_code=property.postal_code,
        latitude=property.latitude,
        longitude=property.longitude,
        phone=property.phone,
        email=property.email,
        website=property.website,
        owner_id=property.owner_id,
        manager_id=property.manager_id,
        license_number=property.license_number,
        tax_id=property.tax_id,
        capacity=property.capacity,
        operating_hours=property.operating_hours,
        amenities=property.amenities,
        services=property.services,
        currency=property.currency,
        pricing_tier=property.pricing_tier,
        commission_rate=property.commission_rate,
        settings=property.settings,
        preferences=property.preferences,
        created_at=property.created_at,
        updated_at=property.updated_at
    )

@app.delete("/api/properties/{property_id}")
async def delete_property(
    property_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a property"""
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found"
        )
    
    # Soft delete by setting status to inactive
    property.status = PropertyStatus.INACTIVE
    property.updated_at = datetime.utcnow()
    db.commit()
    
    logger.info(f"✅ Property deleted: {property.name}")
    
    return {"message": "Property deleted successfully"}

@app.get("/api/properties/metrics", response_model=PropertyMetrics)
async def get_property_metrics(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get property metrics"""
    # Get basic counts
    total_properties = db.query(Property).count()
    active_properties = db.query(Property).filter(Property.status == PropertyStatus.ACTIVE).count()
    
    # Get properties by type
    properties_by_type = {}
    for prop_type in PropertyType:
        count = db.query(Property).filter(Property.property_type == prop_type).count()
        properties_by_type[prop_type] = count
    
    # Get properties by tier
    properties_by_tier = {}
    for tier in PropertyTier:
        count = db.query(Property).filter(Property.tier == tier).count()
        properties_by_tier[tier] = count
    
    # Get properties by country
    properties_by_country = {}
    countries = db.query(Property.country).distinct().all()
    for country in countries:
        count = db.query(Property).filter(Property.country == country[0]).count()
        properties_by_country[country[0]] = count
    
    # Get average rating
    reviews = db.query(PropertyReview).all()
    average_rating = 0.0
    if reviews:
        average_rating = sum(review.rating for review in reviews) / len(reviews)
    
    return PropertyMetrics(
        total_properties=total_properties,
        active_properties=active_properties,
        properties_by_type=properties_by_type,
        properties_by_tier=properties_by_tier,
        properties_by_country=properties_by_country,
        average_rating=average_rating,
        total_reviews=len(reviews)
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )