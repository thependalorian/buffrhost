"""
Pydantic schemas for menu-related API operations.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class MenuCategoryBase(BaseModel):
    """Base menu category schema."""
    name: str = Field(..., min_length=1, max_length=255)
    display_order: int = Field(..., ge=0)


class MenuCategoryCreate(MenuCategoryBase):
    """Schema for creating a new menu category."""
    pass


class MenuCategoryUpdate(BaseModel):
    """Schema for updating menu category."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    display_order: Optional[int] = Field(None, ge=0)


class MenuCategoryResponse(MenuCategoryBase):
    """Schema for menu category API responses."""
    category_id: int
    restaurant_id: int

    class Config:
        from_attributes = True


class MenuMediaBase(BaseModel):
    """Base menu media schema."""
    url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(None, max_length=255)
    display_order: int = Field(default=1, ge=0)


class MenuMediaCreate(MenuMediaBase):
    """Schema for creating menu media."""
    pass


class MenuMediaResponse(MenuMediaBase):
    """Schema for menu media API responses."""
    media_id: int
    menu_item_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MenuItemBase(BaseModel):
    """Base menu item schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    base_price: Decimal = Field(..., gt=0, decimal_places=2)
    preparation_time: Optional[int] = Field(None, ge=0)
    calories: Optional[int] = Field(None, ge=0)
    dietary_tags: Optional[str] = Field(None, max_length=255)
    for_type: str = Field(default="all", pattern="^(dine-in|takeout|delivery|all)$")
    is_popular: bool = Field(default=False)


class MenuItemCreate(MenuItemBase):
    """Schema for creating a new menu item."""
    category_id: int


class MenuItemUpdate(BaseModel):
    """Schema for updating menu item."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    base_price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    preparation_time: Optional[int] = Field(None, ge=0)
    calories: Optional[int] = Field(None, ge=0)
    dietary_tags: Optional[str] = Field(None, max_length=255)
    for_type: Optional[str] = Field(None, pattern="^(dine-in|takeout|delivery|all)$")
    is_popular: Optional[bool] = None
    is_available: Optional[bool] = None


class MenuItemResponse(MenuItemBase):
    """Schema for menu item API responses."""
    menu_item_id: int
    restaurant_id: int
    category_id: int
    is_available: bool
    is_all: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    media: List[MenuMediaResponse] = []

    class Config:
        from_attributes = True


class MenuItemSummary(BaseModel):
    """Simplified menu item schema for lists."""
    menu_item_id: int
    name: str
    base_price: Decimal
    is_available: bool
    category_id: int

    class Config:
        from_attributes = True


class MenuItemWithModifiers(MenuItemResponse):
    """Menu item with modifier information."""
    modifiers: List[dict] = []  # Will be populated with modifier data
