"""
Hospitality Property Model
SQLAlchemy model for hospitality property management
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Float, Time, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from database import Base

class HospitalityProperty(Base):
    """Hospitality property model"""
    
    __tablename__ = "hospitality_properties"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Tenant relationship
    tenant_id = Column(String, ForeignKey("tenant_profiles.id"), nullable=False)
    
    # Basic information
    property_name = Column(String, nullable=False)
    property_type = Column(String, nullable=False)  # hotel, resort, etc.
    description = Column(Text, nullable=True)
    
    # Contact information
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    website = Column(String, nullable=True)
    
    # Property details
    star_rating = Column(Integer, nullable=True)
    total_rooms = Column(Integer, nullable=True)
    check_in_time = Column(Time, nullable=True)
    check_out_time = Column(Time, nullable=True)
    
    # Address information (stored as JSON)
    address = Column(JSON, nullable=True)
    
    # Amenities and policies (stored as JSON arrays/objects)
    amenities = Column(JSON, nullable=True)
    policies = Column(JSON, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    tenant = relationship("TenantProfile", back_populates="properties")
    rooms = relationship("Room", back_populates="property")
    room_types = relationship("RoomType", back_populates="property")
    
    def __repr__(self):
        return f"<HospitalityProperty(id='{self.id}', name='{self.property_name}', type='{self.property_type}')>"
    
    def to_dict(self):
        """Convert property to dictionary"""
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "property_name": self.property_name,
            "property_type": self.property_type,
            "description": self.description,
            "contact_email": self.contact_email,
            "contact_phone": self.contact_phone,
            "website": self.website,
            "star_rating": self.star_rating,
            "total_rooms": self.total_rooms,
            "check_in_time": self.check_in_time.isoformat() if self.check_in_time else None,
            "check_out_time": self.check_out_time.isoformat() if self.check_out_time else None,
            "address": self.address,
            "amenities": self.amenities or [],
            "policies": self.policies or {},
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class RoomType(Base):
    """Room type model"""
    
    __tablename__ = "room_types"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property relationship
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    
    # Room type information
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False)
    max_occupancy = Column(Integer, nullable=False)
    room_size = Column(Float, nullable=True)  # in square feet/meters
    bed_type = Column(String, nullable=True)
    amenities = Column(JSON, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="room_types")
    rooms = relationship("Room", back_populates="room_type")
    
    def __repr__(self):
        return f"<RoomType(id='{self.id}', name='{self.name}', property_id='{self.property_id}')>"

class Room(Base):
    """Room model"""
    
    __tablename__ = "rooms"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property and room type relationships
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    room_type_id = Column(String, ForeignKey("room_types.id"), nullable=False)
    
    # Room information
    room_number = Column(String, nullable=False)
    floor = Column(Integer, nullable=True)
    status = Column(String, default="available", nullable=False)  # available, occupied, out_of_order, maintenance
    
    # Booking information
    check_in = Column(DateTime, nullable=True)
    check_out = Column(DateTime, nullable=True)
    guest_name = Column(String, nullable=True)
    guest_contact = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="rooms")
    room_type = relationship("RoomType", back_populates="rooms")
    
    def __repr__(self):
        return f"<Room(id='{self.id}', number='{self.room_number}', property_id='{self.property_id}')>"
    
    def is_available(self, check_in: datetime, check_out: datetime) -> bool:
        """Check if room is available for given dates"""
        if self.status != "available":
            return False
        
        # Check for overlapping bookings
        if self.check_in and self.check_out:
            if not (check_out <= self.check_in or check_in >= self.check_out):
                return False
        
        return True

class PropertyAmenity(Base):
    """Property amenity model"""
    
    __tablename__ = "property_amenities"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property relationship
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    
    # Amenity information
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)  # recreation, dining, business, etc.
    description = Column(Text, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    operating_hours = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty")
    
    def __repr__(self):
        return f"<PropertyAmenity(id='{self.id}', name='{self.name}', property_id='{self.property_id}')>"

class PropertyPolicy(Base):
    """Property policy model"""
    
    __tablename__ = "property_policies"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property relationship
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    
    # Policy information
    policy_type = Column(String, nullable=False)  # cancellation, pet, smoking, etc.
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty")
    
    def __repr__(self):
        return f"<PropertyPolicy(id='{self.id}', type='{self.policy_type}', property_id='{self.property_id}')>"

class PropertyImage(Base):
    """Property image model"""
    
    __tablename__ = "property_images"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property relationship
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    
    # Image information
    image_url = Column(String, nullable=False)
    image_type = Column(String, nullable=False)  # main, gallery, room, amenity, etc.
    caption = Column(String, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty")
    
    def __repr__(self):
        return f"<PropertyImage(id='{self.id}', type='{self.image_type}', property_id='{self.property_id}')>"

class PropertyReview(Base):
    """Property review model"""
    
    __tablename__ = "property_reviews"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property relationship
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    
    # Review information
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String, nullable=True)
    review_text = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    is_approved = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    property = relationship("HospitalityProperty")
    
    def __repr__(self):
        return f"<PropertyReview(id='{self.id}', rating={self.rating}, property_id='{self.property_id}')>"