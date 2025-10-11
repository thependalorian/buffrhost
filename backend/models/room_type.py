"""
Room Type Model
Database model for room types and configurations
"""

from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import uuid

Base = declarative_base()

class RoomType(Base):
    """Room type model for different room configurations"""
    __tablename__ = "room_types"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    max_occupancy = Column(Integer, nullable=False, default=2)
    room_size = Column(Float)  # in square meters
    bed_type = Column(String(50))  # single, double, queen, king, etc.
    amenities = Column(Text)  # JSON string of amenities
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="room_types")
    rooms = relationship("Room", back_populates="room_type")
    
    def __repr__(self):
        return f"<RoomType(id='{self.id}', name='{self.name}', property_id='{self.property_id}')>"