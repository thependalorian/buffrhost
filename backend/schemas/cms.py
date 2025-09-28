"""
CMS Pydantic Schemas for Buffr Host Hospitality Ecosystem Management Platform
Provides data validation and serialization for CMS operations.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, Field, validator


class ContentTypeEnum(str, Enum):
    """Content type enumeration"""

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


class ContentStatusEnum(str, Enum):
    """Content status enumeration"""

    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    SCHEDULED = "scheduled"


# Base Content Schemas
class ContentBase(BaseModel):
    """Base content schema"""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    content_type: ContentTypeEnum
    property_id: int = Field(..., gt=0)
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    alt_text: Optional[str] = Field(None, max_length=255)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    social_image: Optional[str] = None


class ContentCreate(ContentBase):
    """Schema for creating content"""

    pass


class ContentUpdate(BaseModel):
    """Schema for updating content"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    alt_text: Optional[str] = Field(None, max_length=255)
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    social_image: Optional[str] = None
    status: Optional[ContentStatusEnum] = None


class ContentResponse(ContentBase):
    """Schema for content response"""

    id: int
    slug: str
    status: ContentStatusEnum
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    is_deleted: bool = False

    class Config:
        from_attributes = True


# Media Schemas
class MediaBase(BaseModel):
    """Base media schema"""

    filename: str = Field(..., min_length=1, max_length=255)
    original_filename: Optional[str] = None
    property_id: int = Field(..., gt=0)
    alt_text: Optional[str] = Field(None, max_length=255)


class MediaCreate(MediaBase):
    """Schema for creating media"""

    file_path: str
    file_size: int = Field(..., gt=0)
    mime_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    quality: Optional[str] = None


class MediaResponse(MediaBase):
    """Schema for media response"""

    id: int
    file_path: str
    file_size: int
    mime_type: str
    width: Optional[int] = None
    height: Optional[int] = None
    duration: Optional[float] = None
    quality: Optional[str] = None
    is_processed: bool = False
    processing_status: Optional[str] = None
    uploaded_at: datetime
    processed_at: Optional[datetime] = None
    is_deleted: bool = False

    class Config:
        from_attributes = True


# Collection Schemas
class CollectionBase(BaseModel):
    """Base collection schema"""

    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    property_id: int = Field(..., gt=0)
    collection_type: str = Field(..., min_length=1, max_length=100)
    display_order: int = Field(0, ge=0)
    is_featured: bool = False


class CollectionCreate(CollectionBase):
    """Schema for creating collection"""

    pass


class CollectionUpdate(BaseModel):
    """Schema for updating collection"""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    collection_type: Optional[str] = Field(None, min_length=1, max_length=100)
    display_order: Optional[int] = Field(None, ge=0)
    is_featured: Optional[bool] = None


class CollectionResponse(CollectionBase):
    """Schema for collection response"""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CollectionWithContent(CollectionResponse):
    """Schema for collection with content"""

    content: List[ContentResponse] = []


# Template Schemas
class TemplateBase(BaseModel):
    """Base template schema"""

    name: str = Field(..., min_length=1, max_length=255)
    content_type: ContentTypeEnum
    description: Optional[str] = None
    template_schema: Dict[str, Any]
    default_metadata: Optional[Dict[str, Any]] = None
    required_fields: Optional[List[str]] = None


class TemplateCreate(TemplateBase):
    """Schema for creating template"""

    pass


class TemplateUpdate(BaseModel):
    """Schema for updating template"""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    template_schema: Optional[Dict[str, Any]] = None
    default_metadata: Optional[Dict[str, Any]] = None
    required_fields: Optional[List[str]] = None
    is_active: Optional[bool] = None
    is_default: Optional[bool] = None


class TemplateResponse(TemplateBase):
    """Schema for template response"""

    id: int
    is_active: bool = True
    is_default: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Workflow Schemas
class WorkflowBase(BaseModel):
    """Base workflow schema"""

    content_id: int = Field(..., gt=0)
    current_step: str = Field(..., min_length=1, max_length=100)
    assigned_to: Optional[int] = None
    comments: Optional[str] = None


class WorkflowCreate(WorkflowBase):
    """Schema for creating workflow"""

    pass


class WorkflowUpdate(BaseModel):
    """Schema for updating workflow"""

    current_step: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[str] = None
    assigned_to: Optional[int] = None
    approved_by: Optional[int] = None
    comments: Optional[str] = None
    feedback: Optional[str] = None


class WorkflowResponse(WorkflowBase):
    """Schema for workflow response"""

    id: int
    status: Optional[str] = None
    approved_by: Optional[int] = None
    approved_at: Optional[datetime] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Version Schemas
class VersionBase(BaseModel):
    """Base version schema"""

    content_id: int = Field(..., gt=0)
    version_number: int = Field(..., gt=0)
    title: Optional[str] = None
    description: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    created_by: Optional[int] = None
    change_summary: Optional[str] = None


class VersionCreate(VersionBase):
    """Schema for creating version"""

    pass


class VersionResponse(VersionBase):
    """Schema for version response"""

    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# Search and Filter Schemas
class ContentSearch(BaseModel):
    """Schema for content search"""

    query: str = Field(..., min_length=1)
    property_id: Optional[int] = None
    content_type: Optional[ContentTypeEnum] = None
    status: Optional[ContentStatusEnum] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None


class ContentFilter(BaseModel):
    """Schema for content filtering"""

    property_id: Optional[int] = None
    content_type: Optional[ContentTypeEnum] = None
    status: Optional[ContentStatusEnum] = None
    tags: Optional[List[str]] = None
    categories: Optional[List[str]] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    limit: int = Field(50, ge=1, le=100)
    offset: int = Field(0, ge=0)


# Statistics Schemas
class ContentStatistics(BaseModel):
    """Schema for content statistics"""

    total_content: int
    published_content: int
    draft_content: int
    archived_content: int
    content_by_type: Dict[str, int]
    content_by_status: Dict[str, int]
    recent_activity: List[Dict[str, Any]]


# API Response Schemas
class APIResponse(BaseModel):
    """Base API response schema"""

    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None


class PaginatedResponse(BaseModel):
    """Paginated response schema"""

    success: bool
    data: List[Any]
    total: int
    page: int
    per_page: int
    total_pages: int


# Bulk Operations Schemas
class BulkContentUpdate(BaseModel):
    """Schema for bulk content updates"""

    content_ids: List[int] = Field(..., min_items=1)
    update_data: ContentUpdate


class BulkContentDelete(BaseModel):
    """Schema for bulk content deletion"""

    content_ids: List[int] = Field(..., min_items=1)


class BulkContentMove(BaseModel):
    """Schema for bulk content move"""

    content_ids: List[int] = Field(..., min_items=1)
    target_collection_id: int


# Validation Methods
class ContentValidator:
    """Content validation utilities"""

    @staticmethod
    def validate_metadata(
        metadata: Dict[str, Any], content_type: ContentTypeEnum
    ) -> bool:
        """Validate metadata based on content type"""
        if not metadata:
            return True

        # Type-specific validation
        if content_type == ContentTypeEnum.IMAGE:
            required_fields = ["width", "height"]
            return all(field in metadata for field in required_fields)

        elif content_type == ContentTypeEnum.VIDEO:
            required_fields = ["duration", "resolution"]
            return all(field in metadata for field in required_fields)

        elif content_type == ContentTypeEnum.MENU_ITEM:
            required_fields = ["price", "category"]
            return all(field in metadata for field in required_fields)

        elif content_type == ContentTypeEnum.ROOM:
            required_fields = ["room_type", "capacity", "amenities"]
            return all(field in metadata for field in required_fields)

        return True

    @staticmethod
    def validate_tags(tags: List[str]) -> bool:
        """Validate tags format"""
        if not tags:
            return True

        # Check tag length and format
        for tag in tags:
            if not tag or len(tag.strip()) == 0:
                return False
            if len(tag) > 50:
                return False

        return True

    @staticmethod
    def validate_categories(categories: List[str]) -> bool:
        """Validate categories format"""
        if not categories:
            return True

        # Check category length and format
        for category in categories:
            if not category or len(category.strip()) == 0:
                return False
            if len(category) > 100:
                return False

        return True
