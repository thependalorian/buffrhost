"""
Buffr Host Restaurant Service - Microservice
Handles restaurant management for Buffr Host hospitality platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_restaurants")
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
SERVICE_NAME = "restaurant-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8015))

# Enums
class RestaurantStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"

class RestaurantType(str, Enum):
    FINE_DINING = "fine_dining"
    CASUAL_DINING = "casual_dining"
    FAST_FOOD = "fast_food"
    CAFE = "cafe"
    BAR = "bar"
    BUFFET = "buffet"

# Database Models
class Restaurant(Base):
    __tablename__ = "restaurants"
    
    restaurant_id = Column(Integer, primary_key=True, index=True)
    restaurant_name = Column(String(255), nullable=False, index=True)
    logo_url = Column(String(500), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    status = Column(String(20), default=RestaurantStatus.ACTIVE, nullable=False)
    restaurant_type = Column(String(20), nullable=True)
    timezone = Column(String(50), nullable=True)
    capacity = Column(Integer, nullable=True)
    opening_hours = Column(JSON, nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=True)
    created_by = Column(String(255), nullable=True)
    updated_by = Column(String(255), nullable=True)

# Pydantic Models
class RestaurantBase(BaseModel):
    restaurant_name: str
    logo_url: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    is_active: bool = True
    status: RestaurantStatus = RestaurantStatus.ACTIVE
    restaurant_type: Optional[RestaurantType] = None
    timezone: Optional[str] = None
    capacity: Optional[int] = None
    opening_hours: Optional[Dict[str, Any]] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    restaurant_name: Optional[str] = None
    logo_url: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    status: Optional[RestaurantStatus] = None
    restaurant_type: Optional[RestaurantType] = None
    timezone: Optional[str] = None
    capacity: Optional[int] = None
    opening_hours: Optional[Dict[str, Any]] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class RestaurantResponse(RestaurantBase):
    restaurant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    class Config:
        from_attributes = True

class RestaurantSummary(BaseModel):
    restaurant_id: int
    restaurant_name: str
    is_active: bool
    status: RestaurantStatus
    restaurant_type: Optional[RestaurantType] = None
    created_at: datetime

    class Config:
        from_attributes = True

class HealthResponse(BaseModel):
    service: str
    status: str
    version: str
    timestamp: datetime
    database: str
    redis: str

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client
    redis_client = redis.from_url(REDIS_URL)
    logger.info(f"{SERVICE_NAME} starting up...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"{SERVICE_NAME} shutting down...")

# FastAPI app
app = FastAPI(
    title="Buffr Host Restaurant Service",
    description="Restaurant management microservice for Buffr Host platform",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for service monitoring"""
    try:
        # Test database connection
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    try:
        # Test Redis connection
        if redis_client:
            await redis_client.ping()
            redis_status = "connected"
        else:
            redis_status = "not_initialized"
    except Exception as e:
        redis_status = f"error: {str(e)}"
    
    return HealthResponse(
        service=SERVICE_NAME,
        status="healthy",
        version=SERVICE_VERSION,
        timestamp=datetime.utcnow(),
        database=db_status,
        redis=redis_status
    )

# Restaurant CRUD endpoints
@app.get("/api/v1/restaurants", response_model=List[RestaurantSummary])
async def get_restaurants(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_active: Optional[bool] = None,
    status: Optional[RestaurantStatus] = None,
    restaurant_type: Optional[RestaurantType] = None,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get all restaurants with optional filtering"""
    query = db.query(Restaurant)
    
    if is_active is not None:
        query = query.filter(Restaurant.is_active == is_active)
    if status is not None:
        query = query.filter(Restaurant.status == status)
    if restaurant_type is not None:
        query = query.filter(Restaurant.restaurant_type == restaurant_type)
    
    restaurants = query.offset(skip).limit(limit).all()
    return restaurants

@app.get("/api/v1/restaurants/{restaurant_id}", response_model=RestaurantResponse)
async def get_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get a specific restaurant by ID"""
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@app.post("/api/v1/restaurants", response_model=RestaurantResponse, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    restaurant: RestaurantCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Create a new restaurant"""
    db_restaurant = Restaurant(
        **restaurant.dict(),
        created_by=current_user,
        updated_by=current_user
    )
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant

@app.put("/api/v1/restaurants/{restaurant_id}", response_model=RestaurantResponse)
async def update_restaurant(
    restaurant_id: int,
    restaurant_update: RestaurantUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Update a restaurant"""
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    update_data = restaurant_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(restaurant, field, value)
    
    restaurant.updated_by = current_user
    restaurant.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(restaurant)
    return restaurant

@app.delete("/api/v1/restaurants/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant(
    restaurant_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Delete a restaurant"""
    restaurant = db.query(Restaurant).filter(Restaurant.restaurant_id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    db.delete(restaurant)
    db.commit()
    return None

@app.get("/api/v1/restaurants/search", response_model=List[RestaurantSummary])
async def search_restaurants(
    query: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Search restaurants by name, address, or description"""
    restaurants = db.query(Restaurant).filter(
        Restaurant.restaurant_name.ilike(f"%{query}%") |
        Restaurant.address.ilike(f"%{query}%") |
        Restaurant.description.ilike(f"%{query}%")
    ).offset(skip).limit(limit).all()
    
    return restaurants

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=SERVICE_PORT)
