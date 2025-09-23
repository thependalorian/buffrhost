"""
Pydantic schemas for hospitality property-related API operations.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime, time


class HospitalityPropertyBase(BaseModel):
    """Base hospitality property schema with common fields."""
    property_name: str = Field(..., min_length=1, max_length=255)
    property_type: str = Field(..., min_length=1, max_length=50)
    logo_url: Optional[str] = Field(None, max_length=500)
    address: str = Field(..., min_length=1)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    website: Optional[str] = Field(None, max_length=500)
    is_active: bool = Field(default=True)
    timezone: str = Field(default="UTC", max_length=50)
    
    # Hotel-specific fields
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    total_rooms: Optional[int] = Field(None, ge=0)
    
    # Restaurant-specific fields
    cuisine_type: Optional[str] = Field(None, max_length=100)
    
    # Spa-specific fields
    spa_type: Optional[str] = Field(None, max_length=100)
    
    # Conference-specific fields
    max_capacity: Optional[int] = Field(None, ge=0)
    
    # Multi-service properties
    services_offered: Optional[List[str]] = None
    amenities: Optional[List[str]] = None


class HospitalityPropertyCreate(HospitalityPropertyBase):
    """Schema for creating a new hospitality property."""
    pass


class HospitalityPropertyUpdate(BaseModel):
    """Schema for updating hospitality property information."""
    property_name: Optional[str] = Field(None, min_length=1, max_length=255)
    property_type: Optional[str] = Field(None, min_length=1, max_length=50)
    logo_url: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, min_length=1)
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[EmailStr] = None
    website: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None
    timezone: Optional[str] = Field(None, max_length=50)
    
    # Hotel-specific fields
    check_in_time: Optional[time] = None
    check_out_time: Optional[time] = None
    total_rooms: Optional[int] = Field(None, ge=0)
    
    # Restaurant-specific fields
    cuisine_type: Optional[str] = Field(None, max_length=100)
    
    # Spa-specific fields
    spa_type: Optional[str] = Field(None, max_length=100)
    
    # Conference-specific fields
    max_capacity: Optional[int] = Field(None, ge=0)
    
    # Multi-service properties
    services_offered: Optional[List[str]] = None
    amenities: Optional[List[str]] = None


class HospitalityPropertyResponse(HospitalityPropertyBase):
    """Schema for hospitality property response."""
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HospitalityPropertySummary(BaseModel):
    """Schema for hospitality property summary (list view)."""
    property_id: int
    property_name: str
    property_type: str
    is_active: bool
    services_offered: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class HospitalityPropertyStats(BaseModel):
    """Schema for hospitality property statistics."""
    property_id: int
    property_name: str
    total_orders: int = 0
    total_revenue: float = 0.0
    active_customers: int = 0
    total_rooms: Optional[int] = None
    occupancy_rate: Optional[float] = None
    average_rating: Optional[float] = None
    last_updated: datetime

    class Config:
        from_attributes = True
