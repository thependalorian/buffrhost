"""
Pydantic schemas for document processing models.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class SitePageBase(BaseModel):
    """Base schema for site page."""
    url: str
    chunk_number: int
    title: str
    summary: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class SitePageCreate(SitePageBase):
    """Schema for creating a site page."""
    pass


class SitePageResponse(SitePageBase):
    """Schema for site page response."""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentProcessingLogBase(BaseModel):
    """Base schema for document processing log."""
    filename: str
    file_type: str = Field(..., max_length=50)
    file_size: Optional[int] = None
    processing_method: str = Field(..., max_length=50)  # 'llama_parse', 'standard', 'enhanced'
    status: str = Field(default='processing', max_length=20)  # 'processing', 'completed', 'failed'
    chunks_created: int = Field(default=0)
    processing_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DocumentProcessingLogCreate(DocumentProcessingLogBase):
    """Schema for creating a document processing log."""
    pass


class DocumentProcessingLogUpdate(BaseModel):
    """Schema for updating a document processing log."""
    status: Optional[str] = Field(None, max_length=20)
    chunks_created: Optional[int] = None
    processing_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class DocumentProcessingLogResponse(DocumentProcessingLogBase):
    """Schema for document processing log response."""
    id: int
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class WebCrawlLogBase(BaseModel):
    """Base schema for web crawl log."""
    crawl_type: str = Field(..., max_length=50)  # 'website', 'sitemap'
    urls: List[str]
    sitemap_url: Optional[str] = None
    status: str = Field(default='processing', max_length=20)  # 'processing', 'completed', 'failed'
    pages_crawled: int = Field(default=0)
    chunks_created: int = Field(default=0)
    processing_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class WebCrawlLogCreate(WebCrawlLogBase):
    """Schema for creating a web crawl log."""
    pass


class WebCrawlLogUpdate(BaseModel):
    """Schema for updating a web crawl log."""
    status: Optional[str] = Field(None, max_length=20)
    pages_crawled: Optional[int] = None
    chunks_created: Optional[int] = None
    processing_time_ms: Optional[int] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class WebCrawlLogResponse(WebCrawlLogBase):
    """Schema for web crawl log response."""
    id: int
    property_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class KnowledgeVectorBase(BaseModel):
    """Base schema for knowledge vector."""
    knowledge_id: Optional[str] = Field(None, max_length=255)
    chunk_id: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class KnowledgeVectorCreate(KnowledgeVectorBase):
    """Schema for creating a knowledge vector."""
    pass


class KnowledgeVectorResponse(KnowledgeVectorBase):
    """Schema for knowledge vector response."""
    id: int
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentProcessingStats(BaseModel):
    """Schema for document processing statistics."""
    total_documents: int
    completed_documents: int
    failed_documents: int
    processing_documents: int
    total_chunks: int
    average_processing_time_ms: Optional[float] = None


class WebCrawlStats(BaseModel):
    """Schema for web crawl statistics."""
    total_crawls: int
    completed_crawls: int
    failed_crawls: int
    processing_crawls: int
    total_pages: int
    total_chunks: int
    average_processing_time_ms: Optional[float] = None
