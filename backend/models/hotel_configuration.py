"""
Hotel Configuration Models
Database models for hotel type configuration and service selection
"""

from sqlalchemy import Column, Integer, String, Text, JSON, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class HotelType(Base):
    """Hotel type definitions (Boutique, Resort, Vacation Rental, etc.)"""
    __tablename__ = "hotel_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)  # Lucide icon name
    common_services = Column(JSON, nullable=False, default=list)  # List of common service names
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class HotelService(Base):
    """Available hotel services (Room Management, F&B, Spa, etc.)"""
    __tablename__ = "hotel_services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # Accommodation, F&B, Wellness, etc.
    icon = Column(String(50), nullable=False)  # Lucide icon name
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class HotelConfiguration(Base):
    """Property-specific hotel configuration"""
    __tablename__ = "hotel_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_properties.id"), nullable=False, index=True)
    hotel_type = Column(String(100), nullable=False)  # References HotelType.name
    selected_services = Column(JSON, nullable=False, default=list)  # List of selected service names
    configuration_data = Column(JSON, nullable=True)  # Additional configuration settings
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to property
    property = relationship("HospitalityProperty", back_populates="hotel_configuration")


class RestaurantType(Base):
    """Restaurant type definitions (Standalone, Bar, Catering, Food Truck)"""
    __tablename__ = "restaurant_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=False)  # Lucide icon name
    common_features = Column(JSON, nullable=False, default=list)  # List of common features
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class RestaurantConfiguration(Base):
    """Property-specific restaurant configuration"""
    __tablename__ = "restaurant_configurations"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_properties.id"), nullable=False, index=True)
    restaurant_type = Column(String(100), nullable=False)  # References RestaurantType.name
    selected_features = Column(JSON, nullable=False, default=list)  # List of selected features
    configuration_data = Column(JSON, nullable=True)  # Additional configuration settings
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to property
    property = relationship("HospitalityProperty", back_populates="restaurant_configuration")
