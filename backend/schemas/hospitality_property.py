"""
Hospitality Property Schemas
Pydantic models for property-related API requests and responses
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, time
from enum import Enum

class PropertyType(str, Enum):
    """Property type options"""
    HOTEL = "hotel"
    RESORT = "resort"
    VACATION_RENTAL = "vacation_rental"
    HOSTEL = "hostel"
    BOUTIQUE_HOTEL = "boutique_hotel"
    BED_AND_BREAKFAST = "bed_and_breakfast"
    APARTMENT_HOTEL = "apartment_hotel"
    MOTEL = "motel"
    INN = "inn"

class StarRating(int, Enum):
    """Star rating options"""
    ONE_STAR = 1
    TWO_STAR = 2
    THREE_STAR = 3
    FOUR_STAR = 4
    FIVE_STAR = 5

# Address schema
class Address(BaseModel):
    """Address information"""
    street: str
    city: str
    state: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
    @validator('latitude')
    def validate_latitude(cls, v):
        if v is not None and (v < -90 or v > 90):
            raise ValueError('Latitude must be between -90 and 90')
        return v
    
    @validator('longitude')
    def validate_longitude(cls, v):
        if v is not None and (v < -180 or v > 180):
            raise ValueError('Longitude must be between -180 and 180')
        return v

# Base property schema
class PropertyBase(BaseModel):
    """Base property schema with common fields"""
    property_name: str
    property_type: PropertyType
    description: Optional[str] = None
    address: Address
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    star_rating: Optional[StarRating] = None
    total_rooms: Optional[int] = None
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    amenities: Optional[List[str]] = None
    policies: Optional[Dict[str, Any]] = None
    is_active: bool = True

# Property creation schema
class PropertyCreate(PropertyBase):
    """Schema for creating a new property"""
    pass

# Property update schema
class PropertyUpdate(BaseModel):
    """Schema for updating property information"""
    property_name: Optional[str] = None
    property_type: Optional[PropertyType] = None
    description: Optional[str] = None
    address: Optional[Address] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    website: Optional[str] = None
    star_rating: Optional[StarRating] = None
    total_rooms: Optional[int] = None
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    amenities: Optional[List[str]] = None
    policies: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

# Property response schema
class PropertyResponse(PropertyBase):
    """Schema for property response data"""
    id: str
    tenant_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Property search schema
class PropertySearch(BaseModel):
    """Schema for property search"""
    query: Optional[str] = None
    property_type: Optional[PropertyType] = None
    star_rating: Optional[StarRating] = None
    city: Optional[str] = None
    country: Optional[str] = None
    amenities: Optional[List[str]] = None
    min_rooms: Optional[int] = None
    max_rooms: Optional[int] = None
    is_active: Optional[bool] = None
    limit: int = 20
    offset: int = 0

# Property filter schema
class PropertyFilter(BaseModel):
    """Schema for filtering properties"""
    tenant_id: Optional[str] = None
    property_type: Optional[PropertyType] = None
    star_rating: Optional[StarRating] = None
    is_active: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    has_amenities: Optional[List[str]] = None

# Property statistics schema
class PropertyStats(BaseModel):
    """Schema for property statistics"""
    property_id: str
    property_name: str
    total_rooms: int
    occupied_rooms: int
    available_rooms: int
    out_of_order_rooms: int
    occupancy_rate: float
    room_type_distribution: Dict[str, int]
    recent_bookings: int
    star_rating: Optional[int]
    is_active: bool

# Property availability schema
class PropertyAvailability(BaseModel):
    """Schema for property availability"""
    property_id: str
    property_name: str
    date_range: Dict[str, str]
    availability: Dict[str, Dict[str, Any]]

# Property revenue schema
class PropertyRevenue(BaseModel):
    """Schema for property revenue"""
    property_id: str
    property_name: str
    date_range: Dict[str, str]
    total_revenue: float
    room_revenue: float
    other_revenue: float
    average_daily_rate: float
    revenue_per_available_room: float

# Property analytics schema
class PropertyAnalytics(BaseModel):
    """Schema for property analytics"""
    property_id: str
    property_name: str
    period: Dict[str, Any]
    stats: PropertyStats
    availability: PropertyAvailability
    revenue: PropertyRevenue
    generated_at: str

# Property amenities schema
class PropertyAmenities(BaseModel):
    """Schema for property amenities"""
    property_id: str
    amenities: List[str]

# Property policies schema
class PropertyPolicies(BaseModel):
    """Schema for property policies"""
    property_id: str
    policies: Dict[str, Any]

# Property location schema
class PropertyLocation(BaseModel):
    """Schema for property location search"""
    city: str
    country: str
    radius: Optional[float] = None  # in kilometers
    latitude: Optional[float] = None
    longitude: Optional[float] = None

# Property comparison schema
class PropertyComparison(BaseModel):
    """Schema for property comparison"""
    property_ids: List[str]
    metrics: List[str] = ["occupancy_rate", "average_daily_rate", "revenue_per_available_room"]

# Property ranking schema
class PropertyRanking(BaseModel):
    """Schema for property ranking"""
    property_id: str
    property_name: str
    rank: int
    score: float
    metrics: Dict[str, float]

# Property performance schema
class PropertyPerformance(BaseModel):
    """Schema for property performance metrics"""
    property_id: str
    property_name: str
    period: str
    occupancy_rate: float
    average_daily_rate: float
    revenue_per_available_room: float
    total_revenue: float
    guest_satisfaction: Optional[float] = None
    market_share: Optional[float] = None

# Property forecast schema
class PropertyForecast(BaseModel):
    """Schema for property forecasting"""
    property_id: str
    property_name: str
    forecast_period: str
    predicted_occupancy: List[float]
    predicted_adr: List[float]
    predicted_revenue: List[float]
    confidence_level: float
    generated_at: datetime

# Property maintenance schema
class PropertyMaintenance(BaseModel):
    """Schema for property maintenance"""
    property_id: str
    maintenance_type: str
    description: str
    scheduled_date: datetime
    estimated_duration: int  # in hours
    assigned_to: Optional[str] = None
    status: str = "scheduled"
    priority: str = "medium"

# Property inspection schema
class PropertyInspection(BaseModel):
    """Schema for property inspection"""
    property_id: str
    inspection_date: datetime
    inspector: str
    score: float
    notes: Optional[str] = None
    issues: List[str] = []
    recommendations: List[str] = []

# Property compliance schema
class PropertyCompliance(BaseModel):
    """Schema for property compliance"""
    property_id: str
    compliance_type: str
    status: str
    last_check: datetime
    next_check: datetime
    requirements: List[str] = []
    violations: List[str] = []

# API response schemas
class PropertySummary(BaseModel):
    """Schema for property summary (minimal property info)"""
    id: str
    name: str
    property_type: str
    status: str
    location: str
    rating: Optional[float] = None
    price_range: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class PropertyListResponse(BaseModel):
    """Schema for property list response"""
    properties: List[PropertyResponse]
    total: int
    page: int
    size: int
    pages: int

class PropertyCreateResponse(BaseModel):
    """Schema for property creation response"""
    property: PropertyResponse
    message: str

class PropertyUpdateResponse(BaseModel):
    """Schema for property update response"""
    property: PropertyResponse
    message: str

class PropertyDeleteResponse(BaseModel):
    """Schema for property deletion response"""
    message: str
    deleted_at: datetime

class PropertyStatsResponse(BaseModel):
    """Schema for property stats response"""
    stats: PropertyStats
    generated_at: datetime

class PropertyAvailabilityResponse(BaseModel):
    """Schema for property availability response"""
    availability: PropertyAvailability
    generated_at: datetime

class PropertyRevenueResponse(BaseModel):
    """Schema for property revenue response"""
    revenue: PropertyRevenue
    generated_at: datetime

class PropertyAnalyticsResponse(BaseModel):
    """Schema for property analytics response"""
    analytics: PropertyAnalytics
    generated_at: datetime

# Error schemas
class PropertyError(BaseModel):
    """Schema for property-related errors"""
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class PropertyErrorResponse(BaseModel):
    """Schema for property error response"""
    success: bool = False
    error: PropertyError
    validation_errors: Optional[List[Dict[str, Any]]] = None

# Bulk operations schema
class BulkPropertyOperation(BaseModel):
    """Schema for bulk property operations"""
    property_ids: List[str]
    operation: str  # activate, deactivate, delete, update_amenities
    data: Optional[Dict[str, Any]] = None

# Property import schema
class PropertyImport(BaseModel):
    """Schema for importing properties"""
    properties: List[PropertyCreate]
    validate_addresses: bool = True
    create_rooms: bool = False

# Property export schema
class PropertyExport(BaseModel):
    """Schema for exporting properties"""
    format: str = "csv"  # csv, json, xlsx
    fields: List[str] = ["id", "property_name", "property_type", "address", "is_active"]
    filters: Optional[PropertyFilter] = None

# Property audit schema
class PropertyAudit(BaseModel):
    """Schema for property audit trail"""
    id: str
    property_id: str
    action: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    changed_by: str
    changed_at: datetime
    ip_address: Optional[str] = None