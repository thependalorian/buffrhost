"""
Transportation service models for Buffr Host platform.
"""
from sqlalchemy import (Boolean, Column, DateTime, Float, ForeignKey, Integer,
                        String, Text)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class TransportationService(Base):
    __tablename__ = "transportation_services"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(
        Integer, ForeignKey("hospitality_properties.id"), nullable=False
    )
    name = Column(String(255), nullable=False)
    description = Column(Text)
    service_type = Column(
        String(100), nullable=False
    )  # airport_shuttle, taxi, bus, etc.
    capacity = Column(Integer, default=1)
    price_per_person = Column(Float, nullable=False)
    currency = Column(String(3), default="NAD")
    is_available = Column(Boolean, default=True)
    contact_info = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    property = relationship(
        "HospitalityProperty", back_populates="transportation_services"
    )
