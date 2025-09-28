"""
Service-related models for Buffr Host (Spa, Conference, etc.).
"""
from sqlalchemy import (Boolean, Column, Date, DateTime, ForeignKey, Integer,
                        Numeric, String, Text, Time)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class SpaService(Base):
    __tablename__ = "spaservice"
    spa_service_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    name = Column(String(255), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer, nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    category = Column(String(100))
    is_available = Column(Boolean, default=True)
    max_capacity = Column(Integer, default=1)
    requires_booking = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ConferenceRoom(Base):
    __tablename__ = "conferenceroom"
    room_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    room_name = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)
    base_price_per_hour = Column(Numeric(10, 2), nullable=False)
    amenities = Column(Text, server_default="{}")
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class TransportationService(Base):
    __tablename__ = "transportationservice"
    service_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    service_name = Column(String(255), nullable=False)
    service_type = Column(String(100), nullable=False)
    description = Column(Text)
    base_price = Column(Numeric(10, 2), nullable=False)
    duration_minutes = Column(Integer)
    capacity = Column(Integer, default=1)
    is_available = Column(Boolean, default=True)
    requires_booking = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class RecreationService(Base):
    __tablename__ = "recreationservice"
    recreation_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    service_name = Column(String(255), nullable=False)
    service_type = Column(String(100), nullable=False)
    description = Column(Text)
    base_price = Column(Numeric(10, 2), nullable=False)
    duration_minutes = Column(Integer)
    capacity = Column(Integer, default=1)
    equipment_included = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    requires_booking = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class SpecializedService(Base):
    __tablename__ = "specializedservice"
    service_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    service_name = Column(String(255), nullable=False)
    service_type = Column(String(100), nullable=False)
    description = Column(Text)
    base_price = Column(Numeric(10, 2), nullable=False)
    duration_minutes = Column(Integer)
    is_available = Column(Boolean, default=True)
    requires_booking = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ServiceBooking(Base):
    __tablename__ = "servicebooking"
    booking_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    property_id = Column(
        Integer, ForeignKey("hospitality_property.property_id"), nullable=False
    )
    service_type = Column(String(50), nullable=False)
    service_id = Column(Integer, nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(String(50), default="confirmed")
    total_price = Column(Numeric(10, 2), nullable=False)
    special_requests = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
