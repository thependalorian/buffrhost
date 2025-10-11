"""
Hotel Configuration Schemas
Pydantic schemas for hotel type configuration and service selection
"""

from typing import List, Dict, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field


class HotelTypeResponse(BaseModel):
    """Hotel type response schema"""
    id: int
    name: str
    description: str
    icon: str
    common_services: List[str]
    is_active: bool
    
    class Config:
        from_attributes = True


class HotelServiceResponse(BaseModel):
    """Hotel service response schema"""
    id: int
    name: str
    description: str
    category: str
    icon: str
    is_active: bool
    
    class Config:
        from_attributes = True


class HotelConfigurationCreate(BaseModel):
    """Hotel configuration creation schema"""
    property_id: int
    hotel_type: str = Field(..., description="Hotel type name")
    selected_services: List[str] = Field(default_factory=list, description="List of selected service names")
    configuration_data: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional configuration settings")


class HotelConfigurationUpdate(BaseModel):
    """Hotel configuration update schema"""
    hotel_type: Optional[str] = Field(None, description="Hotel type name")
    selected_services: Optional[List[str]] = Field(None, description="List of selected service names")
    configuration_data: Optional[Dict[str, Any]] = Field(None, description="Additional configuration settings")


class HotelConfigurationResponse(BaseModel):
    """Hotel configuration response schema"""
    id: int
    property_id: int
    hotel_type: str
    selected_services: List[str]
    configuration_data: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class RestaurantTypeResponse(BaseModel):
    """Restaurant type response schema"""
    id: int
    name: str
    description: str
    icon: str
    common_features: List[str]
    is_active: bool
    
    class Config:
        from_attributes = True


class RestaurantConfigurationCreate(BaseModel):
    """Restaurant configuration creation schema"""
    property_id: int
    restaurant_type: str = Field(..., description="Restaurant type name")
    selected_features: List[str] = Field(default_factory=list, description="List of selected features")
    configuration_data: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional configuration settings")


class RestaurantConfigurationUpdate(BaseModel):
    """Restaurant configuration update schema"""
    restaurant_type: Optional[str] = Field(None, description="Restaurant type name")
    selected_features: Optional[List[str]] = Field(None, description="List of selected features")
    configuration_data: Optional[Dict[str, Any]] = Field(None, description="Additional configuration settings")


class RestaurantConfigurationResponse(BaseModel):
    """Restaurant configuration response schema"""
    id: int
    property_id: int
    restaurant_type: str
    selected_features: List[str]
    configuration_data: Optional[Dict[str, Any]]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class BusinessConfigurationResponse(BaseModel):
    """Combined business configuration response"""
    property_id: int
    hotel_configuration: Optional[HotelConfigurationResponse] = None
    restaurant_configuration: Optional[RestaurantConfigurationResponse] = None
    business_type: str = Field(..., description="primary, hotel, restaurant, or mixed")
    
    class Config:
        from_attributes = True
