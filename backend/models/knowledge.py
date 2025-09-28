"""
Knowledge base models for Buffr Host platform.
"""
from sqlalchemy import (JSON, Column, DateTime, ForeignKey, Integer, String,
                        Text)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.sql import func

from database import Base


class KnowledgeDocument(Base):
    __tablename__ = "knowledgedocument"
    document_id = Column(String, primary_key=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    document_type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    knowledge_metadata = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String)
    tags = Column(ARRAY(String))
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
