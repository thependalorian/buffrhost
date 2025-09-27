"""
Pydantic schemas for hospitality property API operations.
Uses standardized types from the unified database schema.
"""
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# Enums matching the database schema
class PropertyStatusEnum(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    SUSPENDED = "suspended"
    PENDING_APPROVAL = "pending_approval"


class PropertyBase(BaseModel):
    """Base hospitality property schema."""

    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    tagline: Optional[str] = Field(None, max_length=255)
    property_type: str = Field(..., max_length=100)
    status: PropertyStatusEnum = PropertyStatusEnum.ACTIVE

    # Contact Information
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    website: Optional[str] = None
    fax: Optional[str] = Field(None, max_length=50)

    # Address Information
    address: Dict[str, Any] = Field(..., description="Address information as JSON")

    # Business Information
    established_year: Optional[int] = None
    capacity: Optional[int] = None
    employee_count: Optional[int] = None
    certifications: List[str] = []
    awards: List[str] = []
    vision_statement: Optional[str] = None

    # Media
    hero_image: Optional[str] = None
    logo: Optional[str] = None
    gallery: List[str] = []

    # Policies
    check_in_time: Optional[str] = None  # Time as string
    check_out_time: Optional[str] = None  # Time as string
    cancellation_policy: Optional[str] = None
    pet_policy: bool = False
    smoking_policy: bool = False

    # Operating Hours
    operating_hours: Optional[Dict[str, Any]] = None

    # Metadata
    property_metadata: Dict[str, Any] = {}


class PropertyCreate(PropertyBase):
    """Schema for creating a hospitality property."""

    owner_id: UUID


class PropertyUpdate(BaseModel):
    """Schema for updating hospitality property information."""

    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    tagline: Optional[str] = Field(None, max_length=255)
    property_type: Optional[str] = Field(None, max_length=100)
    status: Optional[PropertyStatusEnum] = None

    # Contact Information
    phone: Optional[str] = Field(None, max_length=50)
    email: Optional[str] = Field(None, max_length=255)
    website: Optional[str] = None
    fax: Optional[str] = Field(None, max_length=50)

    # Address Information
    address: Optional[Dict[str, Any]] = None

    # Business Information
    established_year: Optional[int] = None
    capacity: Optional[int] = None
    employee_count: Optional[int] = None
    certifications: Optional[List[str]] = None
    awards: Optional[List[str]] = None
    vision_statement: Optional[str] = None

    # Media
    hero_image: Optional[str] = None
    logo: Optional[str] = None
    gallery: Optional[List[str]] = None

    # Policies
    check_in_time: Optional[str] = None
    check_out_time: Optional[str] = None
    cancellation_policy: Optional[str] = None
    pet_policy: Optional[bool] = None
    smoking_policy: Optional[bool] = None

    # Operating Hours
    operating_hours: Optional[Dict[str, Any]] = None

    # Metadata
    property_metadata: Optional[Dict[str, Any]] = None


class PropertyResponse(PropertyBase):
    """Schema for hospitality property API responses."""

    property_id: int
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PropertySummary(BaseModel):
    """Simplified property schema for lists."""

    property_id: int
    name: str
    property_type: str
    status: PropertyStatusEnum
    location: Optional[str] = None  # Extracted from address
    created_at: datetime

    class Config:
        from_attributes = True


class PropertySearch(BaseModel):
    """Schema for property search parameters."""

    property_type: Optional[str] = None
    status: Optional[PropertyStatusEnum] = None
    location: Optional[str] = None
    amenities: Optional[List[str]] = None
    min_capacity: Optional[int] = None
    max_capacity: Optional[int] = None
    established_after: Optional[int] = None
    has_spa: Optional[bool] = None
    pet_friendly: Optional[bool] = None
