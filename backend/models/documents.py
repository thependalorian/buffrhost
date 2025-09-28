"""
Document Management models for Buffr Host.
"""
from sqlalchemy import (Boolean, Column, DateTime, ForeignKey, Integer, String,
                        Text)
from sqlalchemy.dialects.postgresql import ARRAY, INET, JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class DocumentManagement(Base):
    __tablename__ = "documentmanagement"
    document_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    document_type = Column(String(100), nullable=False)
    document_category = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    file_hash = Column(String(64))
    version = Column(String(20), default="1.0")
    is_template = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    access_level = Column(String(50), default="private")
    tags = Column(ARRAY(Text))
    document_metadata = Column(JSONB)
    uploaded_by = Column(String(255))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)


class DocumentAccessLog(Base):
    __tablename__ = "documentaccesslog"
    access_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    document_id = Column(
        UUID(as_uuid=True), ForeignKey("documentmanagement.document_id")
    )
    user_id = Column(String(255))
    access_type = Column(String(50), nullable=False)
    ip_address = Column(INET)
    user_agent = Column(Text)
    access_granted = Column(Boolean, default=True)
    access_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
