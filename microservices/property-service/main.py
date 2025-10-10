"""
Buffr Host Property Service
Comprehensive hospitality property management for Buffr Host platform
"""

import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager
from enum import Enum

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator, EmailStr
import jwt
from supabase import create_client, Client
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
supabase_client: Optional[Client] = None
security = HTTPBearer()

# JWT Configuration
JWT_ACCESS_SECRET = os.getenv("JWT_ACCESS_SECRET", "buffr-host-access-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

class PropertyType(str, Enum):
    RESTAURANT = "restaurant"
    HOTEL = "hotel"
    SPA = "spa"
    CONFERENCE_CENTER = "conference_center"
    RESORT = "resort"
    BOUTIQUE_HOTEL = "boutique_hotel"
    BED_BREAKFAST = "bed_breakfast"
    VACATION_RENTAL = "vacation_rental"

class PropertyStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    SUSPENDED = "suspended"

class RoomType(str, Enum):
    STANDARD = "standard"
    DELUXE = "deluxe"
    SUITE = "suite"
    PRESIDENTIAL = "presidential"
    FAMILY = "family"
    BUSINESS = "business"

class AmenityType(str, Enum):
    WIFI = "wifi"
    PARKING = "parking"
    POOL = "pool"
    GYM = "gym"
    SPA_SERVICES = "spa_services"
    RESTAURANT = "restaurant"
    ROOM_SERVICE = "room_service"
    CONCIERGE = "concierge"
    BUSINESS_CENTER = "business_center"
    CONFERENCE_ROOMS = "conference_rooms"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Property Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import PropertyServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = PropertyServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Property Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Property Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Property Service...")

# Create FastAPI app
app = FastAPI(
    title="Buffr Host Property Service",
    description="Hospitality property management for Buffr Host platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Pydantic Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class ContactInfo(BaseModel):
    phone: str = Field(..., regex=r'^\+?[1-9]\d{1,14}$')
    email: EmailStr
    website: Optional[str] = None
    fax: Optional[str] = None

class BusinessHours(BaseModel):
    monday: Optional[str] = None  # Format: "09:00-17:00"
    tuesday: Optional[str] = None
    wednesday: Optional[str] = None
    thursday: Optional[str] = None
    friday: Optional[str] = None
    saturday: Optional[str] = None
    sunday: Optional[str] = None

class Amenity(BaseModel):
    type: AmenityType
    name: str
    description: Optional[str] = None
    is_available: bool = True
    additional_cost: Optional[float] = None

class Room(BaseModel):
    room_number: str
    room_type: RoomType
    capacity: int = Field(..., gt=0)
    base_price: float = Field(..., gt=0)
    amenities: List[str] = []
    is_available: bool = True
    description: Optional[str] = None
    images: List[str] = []

class CreatePropertyRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    property_type: PropertyType
    description: Optional[str] = None
    address: Address
    contact_info: ContactInfo
    business_hours: BusinessHours
    amenities: List[Amenity] = []
    rooms: List[Room] = []
    owner_id: str
    manager_id: Optional[str] = None
    status: PropertyStatus = PropertyStatus.ACTIVE
    capacity: Optional[int] = None
    star_rating: Optional[int] = Field(None, ge=1, le=5)
    images: List[str] = []
    policies: Optional[Dict[str, Any]] = None
    features: Optional[Dict[str, Any]] = None

class PropertyResponse(BaseModel):
    id: str
    name: str
    property_type: PropertyType
    description: Optional[str]
    address: Address
    contact_info: ContactInfo
    business_hours: BusinessHours
    amenities: List[Amenity]
    rooms: List[Room]
    owner_id: str
    manager_id: Optional[str]
    status: PropertyStatus
    capacity: Optional[int]
    star_rating: Optional[int]
    images: List[str]
    policies: Optional[Dict[str, Any]]
    features: Optional[Dict[str, Any]]
    created_at: str
    updated_at: str

class UpdatePropertyRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    address: Optional[Address] = None
    contact_info: Optional[ContactInfo] = None
    business_hours: Optional[BusinessHours] = None
    amenities: Optional[List[Amenity]] = None
    rooms: Optional[List[Room]] = None
    manager_id: Optional[str] = None
    status: Optional[PropertyStatus] = None
    capacity: Optional[int] = None
    star_rating: Optional[int] = Field(None, ge=1, le=5)
    images: Optional[List[str]] = None
    policies: Optional[Dict[str, Any]] = None
    features: Optional[Dict[str, Any]] = None

class PropertyFilter(BaseModel):
    property_type: Optional[PropertyType] = None
    status: Optional[PropertyStatus] = None
    owner_id: Optional[str] = None
    manager_id: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    star_rating: Optional[int] = None
    amenities: Optional[List[AmenityType]] = None

# Utility Functions
def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_ACCESS_SECRET, algorithms=[JWT_ALGORITHM])
        
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def generate_property_code() -> str:
    """Generate unique property code"""
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4())[:6].upper()
    return f"PROP-{timestamp}-{random_suffix}"

# Authentication Dependencies
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    # Get user from database
    result = supabase_client.table("users").select("*").eq("id", payload["sub"]).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    user = result.data[0]
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    return user

async def require_role(required_role: str):
    """Require specific role for endpoint access"""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user["role"]
        
        # Role hierarchy: admin > manager > staff > customer
        role_hierarchy = {"admin": 4, "manager": 3, "staff": 2, "customer": 1}
        
        if role_hierarchy.get(user_role, 0) < role_hierarchy.get(required_role, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {required_role}"
            )
        
        return current_user
    
    return role_checker

# API Endpoints
@app.post("/properties", response_model=PropertyResponse)
async def create_property(
    property_data: CreatePropertyRequest,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Create a new property"""
    try:
        # Validate owner exists
        owner_result = supabase_client.table("users").select("id").eq("id", property_data.owner_id).execute()
        if not owner_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner not found"
            )
        
        # Validate manager exists if provided
        if property_data.manager_id:
            manager_result = supabase_client.table("users").select("id").eq("id", property_data.manager_id).execute()
            if not manager_result.data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Manager not found"
                )
        
        # Generate property code
        property_code = generate_property_code()
        
        # Create property record
        property_id = str(uuid.uuid4())
        property_record = {
            "id": property_id,
            "property_code": property_code,
            "name": property_data.name,
            "property_type": property_data.property_type.value,
            "description": property_data.description,
            "address": property_data.address.dict(),
            "contact_info": property_data.contact_info.dict(),
            "business_hours": property_data.business_hours.dict(),
            "amenities": [amenity.dict() for amenity in property_data.amenities],
            "rooms": [room.dict() for room in property_data.rooms],
            "owner_id": property_data.owner_id,
            "manager_id": property_data.manager_id,
            "status": property_data.status.value,
            "capacity": property_data.capacity,
            "star_rating": property_data.star_rating,
            "images": property_data.images,
            "policies": property_data.policies or {},
            "features": property_data.features or {},
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("properties").insert(property_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create property"
            )
        
        return PropertyResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create property error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create property"
        )

@app.get("/properties/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get property by ID"""
    try:
        result = supabase_client.table("properties").select("*").eq("id", property_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        property_data = result.data[0]
        
        # Check if user has access to this property
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and property_data["owner_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this property"
            )
        
        return PropertyResponse(**property_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get property error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property"
        )

@app.get("/properties", response_model=List[PropertyResponse])
async def list_properties(
    skip: int = 0,
    limit: int = 100,
    property_type: Optional[PropertyType] = None,
    status: Optional[PropertyStatus] = None,
    owner_id: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """List properties with filters"""
    try:
        query = supabase_client.table("properties").select("*")
        
        # Apply filters
        if property_type:
            query = query.eq("property_type", property_type.value)
        if status:
            query = query.eq("status", status.value)
        if owner_id:
            query = query.eq("owner_id", owner_id)
        if city:
            query = query.contains("address", {"city": city})
        if state:
            query = query.contains("address", {"state": state})
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        properties = [PropertyResponse(**property) for property in result.data]
        return properties
        
    except Exception as e:
        logger.error(f"List properties error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list properties"
        )

@app.put("/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    property_update: UpdatePropertyRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update property"""
    try:
        # Get current property
        property_result = supabase_client.table("properties").select("*").eq("id", property_id).execute()
        
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        property_data = property_result.data[0]
        
        # Check if user has access to update this property
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and property_data["owner_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to update this property"
            )
        
        # Validate manager exists if provided
        if property_update.manager_id:
            manager_result = supabase_client.table("users").select("id").eq("id", property_update.manager_id).execute()
            if not manager_result.data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Manager not found"
                )
        
        # Prepare update data
        update_data = {k: v for k, v in property_update.dict().items() if v is not None}
        
        # Convert nested objects to dict
        if "address" in update_data:
            update_data["address"] = update_data["address"].dict()
        if "contact_info" in update_data:
            update_data["contact_info"] = update_data["contact_info"].dict()
        if "business_hours" in update_data:
            update_data["business_hours"] = update_data["business_hours"].dict()
        if "amenities" in update_data:
            update_data["amenities"] = [amenity.dict() for amenity in update_data["amenities"]]
        if "rooms" in update_data:
            update_data["rooms"] = [room.dict() for room in update_data["rooms"]]
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update property
        result = supabase_client.table("properties").update(update_data).eq("id", property_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update property"
            )
        
        return PropertyResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update property error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update property"
        )

@app.delete("/properties/{property_id}")
async def delete_property(
    property_id: str,
    current_user: Dict[str, Any] = Depends(require_role("admin"))
):
    """Delete property (admin only)"""
    try:
        # Check if property exists
        property_result = supabase_client.table("properties").select("id").eq("id", property_id).execute()
        
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        # Delete property
        result = supabase_client.table("properties").delete().eq("id", property_id).execute()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete property"
            )
        
        return {"message": "Property deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete property error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete property"
        )

@app.get("/properties/{property_id}/rooms", response_model=List[Room])
async def get_property_rooms(
    property_id: str,
    room_type: Optional[RoomType] = None,
    available_only: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get rooms for a property"""
    try:
        # Get property
        property_result = supabase_client.table("properties").select("rooms").eq("id", property_id).execute()
        
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        rooms_data = property_result.data[0]["rooms"]
        
        # Filter rooms
        filtered_rooms = rooms_data
        
        if room_type:
            filtered_rooms = [room for room in filtered_rooms if room["room_type"] == room_type.value]
        
        if available_only:
            filtered_rooms = [room for room in filtered_rooms if room["is_available"]]
        
        rooms = [Room(**room) for room in filtered_rooms]
        return rooms
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get property rooms error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property rooms"
        )

@app.put("/properties/{property_id}/rooms/{room_number}")
async def update_room(
    property_id: str,
    room_number: str,
    room_update: Room,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Update room information"""
    try:
        # Get property
        property_result = supabase_client.table("properties").select("rooms").eq("id", property_id).execute()
        
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        rooms_data = property_result.data[0]["rooms"]
        
        # Find room to update
        room_index = None
        for i, room in enumerate(rooms_data):
            if room["room_number"] == room_number:
                room_index = i
                break
        
        if room_index is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Room not found"
            )
        
        # Update room
        rooms_data[room_index] = room_update.dict()
        
        # Update property
        result = supabase_client.table("properties").update({
            "rooms": rooms_data,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", property_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update room"
            )
        
        return {"message": "Room updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update room error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update room"
        )

@app.get("/properties/{property_id}/amenities", response_model=List[Amenity])
async def get_property_amenities(
    property_id: str,
    amenity_type: Optional[AmenityType] = None,
    available_only: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get amenities for a property"""
    try:
        # Get property
        property_result = supabase_client.table("properties").select("amenities").eq("id", property_id).execute()
        
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        amenities_data = property_result.data[0]["amenities"]
        
        # Filter amenities
        filtered_amenities = amenities_data
        
        if amenity_type:
            filtered_amenities = [amenity for amenity in filtered_amenities if amenity["type"] == amenity_type.value]
        
        if available_only:
            filtered_amenities = [amenity for amenity in filtered_amenities if amenity["is_available"]]
        
        amenities = [Amenity(**amenity) for amenity in filtered_amenities]
        return amenities
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get property amenities error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property amenities"
        )

@app.get("/properties/analytics/summary")
async def get_property_analytics(
    owner_id: Optional[str] = None,
    property_type: Optional[PropertyType] = None,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Get property analytics summary"""
    try:
        query = supabase_client.table("properties").select("*")
        
        if owner_id:
            query = query.eq("owner_id", owner_id)
        
        if property_type:
            query = query.eq("property_type", property_type.value)
        
        result = query.execute()
        properties = result.data
        
        # Calculate analytics
        total_properties = len(properties)
        active_properties = len([p for p in properties if p["status"] == PropertyStatus.ACTIVE.value])
        
        # Property type breakdown
        type_counts = {}
        for property_data in properties:
            prop_type = property_data["property_type"]
            type_counts[prop_type] = type_counts.get(prop_type, 0) + 1
        
        # Status breakdown
        status_counts = {}
        for property_data in properties:
            status = property_data["status"]
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Star rating breakdown
        rating_counts = {}
        for property_data in properties:
            rating = property_data.get("star_rating")
            if rating:
                rating_counts[rating] = rating_counts.get(rating, 0) + 1
        
        # Total capacity
        total_capacity = sum(p.get("capacity", 0) for p in properties if p.get("capacity"))
        
        return {
            "total_properties": total_properties,
            "active_properties": active_properties,
            "inactive_properties": total_properties - active_properties,
            "property_type_breakdown": type_counts,
            "status_breakdown": status_counts,
            "star_rating_breakdown": rating_counts,
            "total_capacity": total_capacity,
            "average_capacity": round(total_capacity / total_properties, 2) if total_properties > 0 else 0
        }
        
    except Exception as e:
        logger.error(f"Get property analytics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property analytics"
        )

@app.get("/properties/search")
async def search_properties(
    query: str,
    property_type: Optional[PropertyType] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    amenities: Optional[List[AmenityType]] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Search properties"""
    try:
        # Build search query
        search_query = supabase_client.table("properties").select("*")
        
        # Text search in name and description
        if query:
            search_query = search_query.or_(f"name.ilike.%{query}%,description.ilike.%{query}%")
        
        # Apply filters
        if property_type:
            search_query = search_query.eq("property_type", property_type.value)
        
        if city:
            search_query = search_query.contains("address", {"city": city})
        
        if state:
            search_query = search_query.contains("address", {"state": state})
        
        # Only show active properties for public search
        search_query = search_query.eq("status", PropertyStatus.ACTIVE.value)
        
        # Apply pagination
        result = search_query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        properties = [PropertyResponse(**property) for property in result.data]
        
        # Filter by amenities if specified
        if amenities:
            filtered_properties = []
            for property_data in properties:
                property_amenities = [amenity.type for amenity in property_data.amenities]
                if all(amenity in property_amenities for amenity in amenities):
                    filtered_properties.append(property_data)
            properties = filtered_properties
        
        return {
            "properties": properties,
            "total": len(properties),
            "query": query,
            "filters": {
                "property_type": property_type,
                "city": city,
                "state": state,
                "amenities": amenities
            }
        }
        
    except Exception as e:
        logger.error(f"Search properties error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to search properties"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "property-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8002,
        reload=True,
        log_level="info"
    )