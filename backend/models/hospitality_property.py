"""
Hospitality Property model for Buffr Host platform.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Time
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class HospitalityProperty(Base):
    __tablename__ = "hospitality_property"
    
    property_id = Column(Integer, primary_key=True, index=True)
    property_name = Column(String(255), nullable=False, index=True)
    property_type = Column(String(50), nullable=False, default='restaurant', index=True)
    logo_url = Column(String(500))
    address = Column(Text, nullable=False)
    phone = Column(String(20))
    email = Column(String(255))
    website = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    timezone = Column(String(50), default="UTC")
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    total_rooms = Column(Integer)
    cuisine_type = Column(String(100))
    spa_type = Column(String(100))
    max_capacity = Column(Integer)
    services_offered = Column(ARRAY(String))
    amenities = Column(ARRAY(String))

    users = relationship("BuffrHostUser", back_populates="property")
    menu_categories = relationship("MenuCategory", back_populates="property")
    menu_items = relationship("Menu", back_populates="property")
    modifiers = relationship("Modifiers", back_populates="property")
    inventory_items = relationship("InventoryItem", back_populates="property")
    orders = relationship("Order", back_populates="property")
    room_types = relationship("RoomType", back_populates="property")
    rooms = relationship("Room", back_populates="property")
    
    # Staff Management Relationships
    staff_departments = relationship("StaffDepartment", back_populates="property", cascade="all, delete-orphan")
    staff_positions = relationship("StaffPosition", back_populates="property", cascade="all, delete-orphan")
    staff_profiles = relationship("StaffProfile", back_populates="property", cascade="all, delete-orphan")
    staff_schedules = relationship("StaffSchedule", back_populates="property", cascade="all, delete-orphan")
    staff_attendance = relationship("StaffAttendance", back_populates="property", cascade="all, delete-orphan")
    staff_tasks = relationship("StaffTask", back_populates="property", cascade="all, delete-orphan")
    staff_performance = relationship("StaffPerformance", back_populates="property", cascade="all, delete-orphan")
    staff_communications = relationship("StaffCommunication", back_populates="property", cascade="all, delete-orphan")
    staff_leave_requests = relationship("StaffLeaveRequest", back_populates="property", cascade="all, delete-orphan")
    
    # Voice Capabilities Relationships
    voice_models = relationship("VoiceModel", back_populates="property", cascade="all, delete-orphan")
    voice_interactions = relationship("VoiceInteraction", back_populates="property", cascade="all, delete-orphan")
    audio_files = relationship("AudioFile", back_populates="property", cascade="all, delete-orphan")
    
    # Document Processing Relationships
    document_processing_logs = relationship("DocumentProcessingLog", back_populates="property", cascade="all, delete-orphan")
    web_crawl_logs = relationship("WebCrawlLog", back_populates="property", cascade="all, delete-orphan")
    knowledge_vectors = relationship("KnowledgeVector", back_populates="property", cascade="all, delete-orphan")