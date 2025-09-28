"""
Pydantic schemas for restaurant-related API operations.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class RestaurantBase(BaseModel):
    """Base restaurant schema with common fields."""

    restaurant_name: str = Field(..., min_length=1, max_length=255)
    logo_url: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    is_active: bool = Field(default=True)
    timezone: Optional[str] = Field(None, max_length=50)


class RestaurantCreate(RestaurantBase):
    """Schema for creating a new restaurant."""

    pass


class RestaurantUpdate(BaseModel):
    """Schema for updating restaurant information."""

    restaurant_name: Optional[str] = Field(None, min_length=1, max_length=255)
    logo_url: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)
    phone: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None
    timezone: Optional[str] = Field(None, max_length=50)


class RestaurantResponse(RestaurantBase):
    """Schema for restaurant API responses."""

    restaurant_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RestaurantSummary(BaseModel):
    """Simplified restaurant schema for lists and references."""

    restaurant_id: int
    restaurant_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
