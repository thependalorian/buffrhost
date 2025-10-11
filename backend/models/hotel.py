"""
Hotel-centric models for Buffr Host
Hotel is the umbrella term for all accommodation types
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON, ForeignKey, Enum, Float, ARRAY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from typing import Optional, List, Dict, Any
from datetime import datetime

Base = declarative_base()

class HotelType(PyEnum):
    """Hotel types - all accommodation types under hotel umbrella"""
    BOUTIQUE_HOTEL = "boutique_hotel"
    VACATION_RENTAL = "vacation_rental"
    RESORT_LODGE = "resort_lodge"
    GUEST_HOUSE = "guest_house"
    HOTEL_CHAIN = "hotel_chain"
    SPECIALTY_ACCOMMODATION = "specialty_accommodation"

class ServiceCategory(PyEnum):
    """Hotel service categories"""
    ACCOMMODATION = "accommodation"
    FOOD_BEVERAGE = "food_beverage"
    WELLNESS = "wellness"
    EXPERIENCES = "experiences"
    BUSINESS = "business"
    TRANSPORT = "transport"
    RETAIL = "retail"

class RestaurantType(PyEnum):
    """Restaurant types for standalone F&B businesses"""
    STANDALONE_RESTAURANT = "standalone_restaurant"
    BAR_LOUNGE = "bar_lounge"
    CATERING_SERVICE = "catering_service"
    FOOD_TRUCK = "food_truck"

class Hotel(Base):
    """Main hotel model - umbrella for all accommodation types"""
    __tablename__ = "hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    hotel_type = Column(Enum(HotelType), nullable=False)
    
    # Location
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Contact
    phone = Column(String(50))
    email = Column(String(255))
    website = Column(String(500))
    
    # Business details
    business_license = Column(String(100))
    tax_id = Column(String(100))
    currency = Column(String(3), default="USD")
    timezone = Column(String(50), default="UTC")
    
    # Configuration
    enabled_services = Column(ARRAY(String), default=[])  # List of enabled service modules
    settings = Column(JSON, default={})  # Hotel-specific settings
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    rooms = relationship("Room", back_populates="hotel", cascade="all, delete-orphan")
    services = relationship("HotelService", back_populates="hotel", cascade="all, delete-orphan")
    restaurants = relationship("Restaurant", back_populates="hotel", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="hotel", cascade="all, delete-orphan")

class Room(Base):
    """Room types and inventory"""
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    
    # Room details
    room_number = Column(String(20), nullable=False)
    room_type = Column(String(100), nullable=False)  # Standard, Deluxe, Suite, etc.
    description = Column(Text)
    
    # Capacity
    max_occupancy = Column(Integer, default=2)
    bed_type = Column(String(50))  # King, Queen, Twin, etc.
    room_size = Column(Float)  # Square meters/feet
    
    # Amenities
    amenities = Column(ARRAY(String), default=[])  # WiFi, AC, TV, etc.
    
    # Pricing
    base_rate = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    # Status
    is_active = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="rooms")
    bookings = relationship("Booking", back_populates="room")

class HotelService(Base):
    """Hotel services - spa, activities, etc."""
    __tablename__ = "hotel_services"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    
    # Service details
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(Enum(ServiceCategory), nullable=False)
    
    # Pricing
    base_price = Column(Float)
    currency = Column(String(3), default="USD")
    pricing_type = Column(String(50))  # Fixed, per_hour, per_person, etc.
    
    # Availability
    is_available = Column(Boolean, default=True)
    capacity = Column(Integer)  # Max bookings per slot
    duration_minutes = Column(Integer)  # Service duration
    
    # Settings
    requires_booking = Column(Boolean, default=True)
    advance_booking_hours = Column(Integer, default=24)
    cancellation_hours = Column(Integer, default=2)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="services")
    bookings = relationship("ServiceBooking", back_populates="service")

class Restaurant(Base):
    """Restaurant model - can be hotel restaurant or standalone"""
    __tablename__ = "restaurants"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=True)  # Null for standalone restaurants
    
    # Restaurant details
    name = Column(String(255), nullable=False)
    description = Column(Text)
    restaurant_type = Column(Enum(RestaurantType), nullable=False)
    
    # Location (for standalone restaurants)
    address = Column(String(500))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    
    # Contact
    phone = Column(String(50))
    email = Column(String(255))
    
    # Settings
    max_capacity = Column(Integer)
    table_count = Column(Integer)
    cuisine_type = Column(String(100))
    
    # Operating hours
    opening_hours = Column(JSON, default={})  # {"monday": {"open": "09:00", "close": "22:00"}}
    
    # Status
    is_active = Column(Boolean, default=True)
    is_standalone = Column(Boolean, default=False)  # True for standalone restaurants
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="restaurants")
    menu_items = relationship("MenuItem", back_populates="restaurant", cascade="all, delete-orphan")
    bookings = relationship("RestaurantBooking", back_populates="restaurant")

class MenuItem(Base):
    """Menu items for restaurants"""
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    
    # Item details
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))  # Appetizer, Main Course, Dessert, etc.
    
    # Pricing
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    # Availability
    is_available = Column(Boolean, default=True)
    is_vegetarian = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)
    is_gluten_free = Column(Boolean, default=False)
    
    # Allergens
    allergens = Column(ARRAY(String), default=[])
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="menu_items")

class Booking(Base):
    """Main booking model for hotels"""
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    hotel_id = Column(Integer, ForeignKey("hotels.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    
    # Guest details
    guest_name = Column(String(255), nullable=False)
    guest_email = Column(String(255), nullable=False)
    guest_phone = Column(String(50))
    
    # Booking details
    check_in = Column(DateTime(timezone=True), nullable=False)
    check_out = Column(DateTime(timezone=True), nullable=False)
    adults = Column(Integer, default=1)
    children = Column(Integer, default=0)
    
    # Pricing
    total_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    # Status
    status = Column(String(50), default="confirmed")  # confirmed, checked_in, checked_out, cancelled
    payment_status = Column(String(50), default="pending")  # pending, paid, refunded
    
    # Special requests
    special_requests = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hotel = relationship("Hotel", back_populates="bookings")
    room = relationship("Room", back_populates="bookings")

class ServiceBooking(Base):
    """Bookings for hotel services (spa, activities, etc.)"""
    __tablename__ = "service_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("hotel_services.id"), nullable=False)
    
    # Guest details
    guest_name = Column(String(255), nullable=False)
    guest_email = Column(String(255), nullable=False)
    guest_phone = Column(String(50))
    
    # Booking details
    booking_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer)
    participants = Column(Integer, default=1)
    
    # Pricing
    total_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    
    # Status
    status = Column(String(50), default="confirmed")
    payment_status = Column(String(50), default="pending")
    
    # Special requests
    special_requests = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    service = relationship("HotelService", back_populates="bookings")

class RestaurantBooking(Base):
    """Bookings for restaurant tables"""
    __tablename__ = "restaurant_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    
    # Guest details
    guest_name = Column(String(255), nullable=False)
    guest_email = Column(String(255), nullable=False)
    guest_phone = Column(String(50))
    
    # Booking details
    booking_date = Column(DateTime(timezone=True), nullable=False)
    party_size = Column(Integer, nullable=False)
    table_number = Column(String(20))
    
    # Pricing
    total_amount = Column(Float, default=0.0)
    currency = Column(String(3), default="USD")
    
    # Status
    status = Column(String(50), default="confirmed")
    payment_status = Column(String(50), default="pending")
    
    # Special requests
    special_requests = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="bookings")
