"""
Document processing and web crawling models.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, BigInteger
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class SitePage(Base):
    """Documentation chunks for enhanced document processing."""
    __tablename__ = "site_pages"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    chunk_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    processing_metadata = Column(JSONB, default={})
    embedding = Column(String)  # Vector embedding as string for now
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Unique constraint
    __table_args__ = (
        {'extend_existing': True}
    )


class DocumentProcessingLog(Base):
    """Document processing metadata tracking."""
    __tablename__ = "document_processing_log"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size = Column(BigInteger)
    processing_method = Column(String(50), nullable=False)  # 'llama_parse', 'standard', 'enhanced'
    status = Column(String(20), nullable=False, default='processing')  # 'processing', 'completed', 'failed'
    chunks_created = Column(Integer, default=0)
    processing_time_ms = Column(Integer)
    error_message = Column(Text)
    processing_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="document_processing_logs")


class WebCrawlLog(Base):
    """Web crawling metadata tracking."""
    __tablename__ = "web_crawl_log"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    crawl_type = Column(String(50), nullable=False)  # 'website', 'sitemap'
    urls = Column(ARRAY(String), nullable=False)
    sitemap_url = Column(String)
    status = Column(String(20), nullable=False, default='processing')  # 'processing', 'completed', 'failed'
    pages_crawled = Column(Integer, default=0)
    chunks_created = Column(Integer, default=0)
    processing_time_ms = Column(Integer)
    error_message = Column(Text)
    processing_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="web_crawl_logs")


class KnowledgeVector(Base):
    """Knowledge base embeddings storage."""
    __tablename__ = "knowledge_vectors"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id", ondelete="CASCADE"), nullable=False)
    knowledge_id = Column(String(255), ForeignKey("knowledgebase.knowledge_id", ondelete="CASCADE"))
    chunk_id = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(String, nullable=False)  # Vector embedding as string
    processing_metadata = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty", back_populates="knowledge_vectors")
