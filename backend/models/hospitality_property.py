"""
Hospitality Property model for Buffr Host platform.
Uses standardized SQL types from the unified database schema.
"""
import enum

from sqlalchemy import Boolean, Column, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import Integer, String, Text, Time
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# Enums from the unified schema
class PropertyStatusEnum(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    SUSPENDED = "suspended"
    PENDING_APPROVAL = "pending_approval"


class HospitalityProperty(Base):
    __tablename__ = "hospitality_properties"

    property_id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    tagline = Column(String(255))
    property_type = Column(String(100), nullable=False, index=True)
    status = Column(
        SQLAlchemyEnum(PropertyStatusEnum), default=PropertyStatusEnum.ACTIVE
    )

    # Contact Information
    phone = Column(String(50))
    email = Column(String(255))
    website = Column(Text)
    fax = Column(String(50))

    # Address Information
    address = Column(JSONB, nullable=False)

    # Business Information
    established_year = Column(Integer)
    capacity = Column(Integer)
    employee_count = Column(Integer)
    certifications = Column(ARRAY(Text))
    awards = Column(ARRAY(Text))
    vision_statement = Column(Text)

    # Media
    hero_image = Column(Text)
    logo = Column(Text)
    gallery = Column(ARRAY(Text))

    # Policies
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    cancellation_policy = Column(Text)
    pet_policy = Column(Boolean, default=False)
    smoking_policy = Column(Boolean, default=False)

    # Operating Hours
    operating_hours = Column(JSONB)

    # Metadata
    property_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="property")
    menu_categories = relationship("MenuCategory", back_populates="property")
    menu_items = relationship("Menu", back_populates="property")
    modifiers = relationship("Modifiers", back_populates="property")
    inventory_items = relationship("InventoryItem", back_populates="property")
    orders = relationship("Order", back_populates="property")
    room_types = relationship("RoomType", back_populates="property")
    rooms = relationship("Room", back_populates="property")

    # Staff Management Relationships
    staff_departments = relationship(
        "StaffDepartment", back_populates="property", cascade="all, delete-orphan"
    )
    staff_positions = relationship(
        "StaffPosition", back_populates="property", cascade="all, delete-orphan"
    )
    staff_profiles = relationship(
        "StaffProfile", back_populates="property", cascade="all, delete-orphan"
    )
    staff_schedules = relationship(
        "StaffSchedule", back_populates="property", cascade="all, delete-orphan"
    )
    staff_attendance = relationship(
        "StaffAttendance", back_populates="property", cascade="all, delete-orphan"
    )
    staff_tasks = relationship(
        "StaffTask", back_populates="property", cascade="all, delete-orphan"
    )
    staff_performance = relationship(
        "StaffPerformance", back_populates="property", cascade="all, delete-orphan"
    )
    staff_communications = relationship(
        "StaffCommunication", back_populates="property", cascade="all, delete-orphan"
    )
    staff_leave_requests = relationship(
        "StaffLeaveRequest", back_populates="property", cascade="all, delete-orphan"
    )

    # Voice Capabilities Relationships
    voice_models = relationship(
        "VoiceModel", back_populates="property", cascade="all, delete-orphan"
    )
    voice_interactions = relationship(
        "VoiceInteraction", back_populates="property", cascade="all, delete-orphan"
    )
    audio_files = relationship(
        "AudioFile", back_populates="property", cascade="all, delete-orphan"
    )

    # Document Processing Relationships
    document_processing_logs = relationship(
        "DocumentProcessingLog", back_populates="property", cascade="all, delete-orphan"
    )
    web_crawl_logs = relationship(
        "WebCrawlLog", back_populates="property", cascade="all, delete-orphan"
    )
    knowledge_vectors = relationship(
        "KnowledgeVector", back_populates="property", cascade="all, delete-orphan"
    )
