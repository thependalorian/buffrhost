"""
CMS Models for Buffr Host Hospitality Ecosystem Management Platform
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, ENUM
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class ContentType(enum.Enum):
    IMAGE = "image"
    MENU_ITEM = "menu_item"
    ROOM = "room"
    FACILITY = "facility"
    SERVICE = "service"
    EVENT = "event"
    PROMOTION = "promotion"
    DOCUMENT = "document"
    VIDEO = "video"
    AUDIO = "audio"

class ContentStatus(enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    SCHEDULED = "scheduled"

class CMSContent(Base):
    __tablename__ = 'cms_content'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    content_type = Column(ENUM(ContentType, name="content_type_enum", create_type=False), nullable=False)
    status = Column(ENUM(ContentStatus, name="content_status_enum", create_type=False), default=ContentStatus.DRAFT)
    content_metadata = Column(JSONB)
    tags = Column(JSONB)
    categories = Column(JSONB)
    file_path = Column(String(500))
    file_size = Column(Integer)
    mime_type = Column(String(100))
    alt_text = Column(String(255))
    slug = Column(String(255), unique=True)
    meta_title = Column(String(255))
    meta_description = Column(Text)
    social_image = Column(String(500))
    property_id = Column(Integer, ForeignKey('hospitality_property.property_id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime)

    property = relationship("HospitalityProperty")

class ContentVersion(Base):
    __tablename__ = 'cms_content_version'
    
    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('cms_content.id'), nullable=False)
    version_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    content_data = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(String(255), ForeignKey('buffr_host_user.owner_id'))
    
    content = relationship("CMSContent")
    creator = relationship("BuffrHostUser")

class ContentTemplate(Base):
    __tablename__ = 'cms_content_template'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    template_type = Column(ENUM(ContentType, name="template_type_enum", create_type=False), nullable=False)
    template_data = Column(JSONB)
    is_default = Column(Boolean, default=False)
    property_id = Column(Integer, ForeignKey('hospitality_property.property_id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    property = relationship("HospitalityProperty")

class MediaLibrary(Base):
    __tablename__ = 'cms_media_library'
    
    id = Column(Integer, primary_key=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    alt_text = Column(String(255))
    caption = Column(Text)
    tags = Column(JSONB)
    property_id = Column(Integer, ForeignKey('hospitality_property.property_id'))
    uploaded_by = Column(String(255), ForeignKey('buffr_host_user.owner_id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)
    
    property = relationship("HospitalityProperty")
    uploader = relationship("BuffrHostUser")

class ContentCollection(Base):
    __tablename__ = 'cms_content_collection'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    collection_type = Column(String(50), nullable=False)
    property_id = Column(Integer, ForeignKey('hospitality_property.property_id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    property = relationship("HospitalityProperty")
    contents = relationship("CollectionContent", back_populates="collection")

class CollectionContent(Base):
    __tablename__ = 'cms_collection_content'
    
    id = Column(Integer, primary_key=True)
    collection_id = Column(Integer, ForeignKey('cms_content_collection.id'), nullable=False)
    content_id = Column(Integer, ForeignKey('cms_content.id'), nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    collection = relationship("ContentCollection", back_populates="contents")
    content = relationship("CMSContent")

class ContentWorkflow(Base):
    __tablename__ = 'cms_content_workflow'
    
    id = Column(Integer, primary_key=True)
    content_id = Column(Integer, ForeignKey('cms_content.id'), nullable=False)
    status = Column(ENUM(ContentStatus, name="workflow_status_enum", create_type=False), nullable=False)
    assigned_to = Column(String(255), ForeignKey('buffr_host_user.owner_id'))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    content = relationship("CMSContent")
    assignee = relationship("BuffrHostUser")