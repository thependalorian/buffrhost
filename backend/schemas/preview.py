"""
Pydantic schemas for preview functionality in Buffr Host.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class PreviewType(str, Enum):
    """Types of content that can be previewed."""

    MENU = "menu"
    PROPERTY = "property"
    CMS = "cms"
    IMAGE = "image"
    ROOM = "room"
    SERVICE = "service"
    EVENT = "event"


class PreviewStatus(str, Enum):
    """Status of preview content."""

    DRAFT = "draft"
    PUBLISHED = "published"
    EXPIRED = "expired"
    ARCHIVED = "archived"


class PreviewRequest(BaseModel):
    """Request model for generating a preview."""

    property_id: int = Field(..., description="ID of the property")
    content_type: PreviewType = Field(..., description="Type of content to preview")
    content_data: Dict[str, Any] = Field(..., description="Content data to preview")
    preview_type: str = Field(
        default="visitor", description="Type of preview (visitor, admin, etc.)"
    )
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class PreviewResponse(BaseModel):
    """Response model for preview generation."""

    preview_id: str = Field(..., description="Unique preview identifier")
    preview_url: str = Field(..., description="URL to access the preview")
    expires_at: str = Field(..., description="Preview expiration timestamp")
    status: PreviewStatus = Field(..., description="Current preview status")
    message: str = Field(..., description="Response message")


class DraftContent(BaseModel):
    """Model for draft content."""

    id: str = Field(..., description="Draft content ID")
    user_id: int = Field(..., description="User who created the draft")
    property_id: int = Field(..., description="Property ID")
    content_type: PreviewType = Field(..., description="Type of content")
    content_data: Dict[str, Any] = Field(..., description="Content data")
    status: PreviewStatus = Field(..., description="Draft status")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: Optional[str] = Field(None, description="Last update timestamp")
    expires_at: str = Field(..., description="Expiration timestamp")
    metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata"
    )


class MenuPreviewData(BaseModel):
    """Schema for menu preview data."""

    restaurant_name: str = Field(..., description="Restaurant name")
    restaurant_description: Optional[str] = Field(
        None, description="Restaurant description"
    )
    logo: Optional[str] = Field(None, description="Restaurant logo URL")
    categories: List[Dict[str, Any]] = Field(..., description="Menu categories")
    currency: str = Field(default="USD", description="Currency code")
    show_prices: bool = Field(default=True, description="Whether to show prices")
    show_allergens: bool = Field(
        default=True, description="Whether to show allergen information"
    )
    show_calories: bool = Field(
        default=False, description="Whether to show calorie information"
    )
    theme: str = Field(default="light", description="Menu theme")


class PropertyPreviewData(BaseModel):
    """Schema for property preview data."""

    name: str = Field(..., description="Property name")
    description: str = Field(..., description="Property description")
    address: str = Field(..., description="Property address")
    phone: Optional[str] = Field(None, description="Contact phone")
    email: Optional[str] = Field(None, description="Contact email")
    website: Optional[str] = Field(None, description="Property website")
    hero_image: Optional[str] = Field(None, description="Hero image URL")
    logo: Optional[str] = Field(None, description="Property logo URL")
    rating: Optional[float] = Field(None, description="Property rating")
    amenities: List[str] = Field(default_factory=list, description="Property amenities")
    services: List[Dict[str, Any]] = Field(
        default_factory=list, description="Property services"
    )
    rooms: Optional[List[Dict[str, Any]]] = Field(None, description="Available rooms")
    gallery: Optional[List[str]] = Field(None, description="Image gallery URLs")
    policies: Optional[List[Dict[str, Any]]] = Field(
        None, description="Property policies"
    )
    theme: str = Field(default="modern", description="Property theme")


class CMSPreviewData(BaseModel):
    """Schema for CMS content preview data."""

    title: str = Field(..., description="Content title")
    content: str = Field(..., description="Content body")
    excerpt: Optional[str] = Field(None, description="Content excerpt")
    featured_image: Optional[str] = Field(None, description="Featured image URL")
    tags: List[str] = Field(default_factory=list, description="Content tags")
    categories: List[str] = Field(
        default_factory=list, description="Content categories"
    )
    meta_title: Optional[str] = Field(None, description="SEO meta title")
    meta_description: Optional[str] = Field(None, description="SEO meta description")
    author: Optional[str] = Field(None, description="Content author")
    published_at: Optional[str] = Field(None, description="Publication timestamp")


class ImagePreviewData(BaseModel):
    """Schema for image preview data."""

    url: str = Field(..., description="Image URL")
    alt: str = Field(..., description="Image alt text")
    caption: Optional[str] = Field(None, description="Image caption")
    title: Optional[str] = Field(None, description="Image title")
    width: Optional[int] = Field(None, description="Image width")
    height: Optional[int] = Field(None, description="Image height")
    format: Optional[str] = Field(None, description="Image format")


class PreviewAnalytics(BaseModel):
    """Schema for preview analytics."""

    views: int = Field(..., description="Total views")
    unique_views: int = Field(..., description="Unique views")
    avg_view_duration: str = Field(..., description="Average view duration")
    device_breakdown: Dict[str, int] = Field(..., description="Views by device type")
    last_viewed: str = Field(..., description="Last view timestamp")
    conversion_rate: Optional[float] = Field(None, description="Conversion rate")


class QRCodeRequest(BaseModel):
    """Request model for QR code generation."""

    preview_id: str = Field(..., description="Preview ID")
    size: int = Field(default=200, description="QR code size in pixels")
    format: str = Field(default="png", description="QR code format")


class QRCodeResponse(BaseModel):
    """Response model for QR code generation."""

    qr_code_url: str = Field(..., description="QR code image URL")
    preview_url: str = Field(..., description="Preview URL")
    size: int = Field(..., description="QR code size")
    format: str = Field(..., description="QR code format")


class PreviewUpdate(BaseModel):
    """Model for updating preview content."""

    content_data: Optional[Dict[str, Any]] = Field(
        None, description="Updated content data"
    )
    metadata: Optional[Dict[str, Any]] = Field(None, description="Updated metadata")
    status: Optional[PreviewStatus] = Field(None, description="Updated status")


class PreviewListResponse(BaseModel):
    """Response model for listing previews."""

    previews: List[DraftContent] = Field(..., description="List of previews")
    total: int = Field(..., description="Total number of previews")
    page: int = Field(..., description="Current page number")
    per_page: int = Field(..., description="Items per page")
    has_next: bool = Field(..., description="Whether there are more pages")
    has_prev: bool = Field(..., description="Whether there are previous pages")
