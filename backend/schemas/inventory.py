"""
Pydantic schemas for inventory-related API operations.
"""
from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class UnitBase(BaseModel):
    """Base unit of measurement schema."""

    name: str = Field(..., min_length=1, max_length=100)
    abbreviation: str = Field(..., min_length=1, max_length=20)


class UnitCreate(UnitBase):
    """Schema for creating a new unit."""

    pass


class UnitResponse(UnitBase):
    """Schema for unit API responses."""

    unit_id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class InventoryItemBase(BaseModel):
    """Base inventory item schema."""

    name: str = Field(..., min_length=1, max_length=255)
    current_stock: Decimal = Field(default=Decimal("0.000"), decimal_places=3)
    reorder_level: Decimal = Field(default=Decimal("0.000"), decimal_places=3)
    cost_per_unit: Optional[Decimal] = Field(None, decimal_places=2)
    supplier_id: Optional[str] = Field(None, max_length=255)
    expiration_date: Optional[date] = None
    batch_number: Optional[str] = Field(None, max_length=100)


class InventoryItemCreate(InventoryItemBase):
    """Schema for creating a new inventory item."""

    unit_id: int


class InventoryItemUpdate(BaseModel):
    """Schema for updating inventory item."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    current_stock: Optional[Decimal] = Field(None, decimal_places=3)
    reorder_level: Optional[Decimal] = Field(None, decimal_places=3)
    cost_per_unit: Optional[Decimal] = Field(None, decimal_places=2)
    supplier_id: Optional[str] = Field(None, max_length=255)
    expiration_date: Optional[date] = None
    batch_number: Optional[str] = Field(None, max_length=100)
    unit_id: Optional[int] = None


class InventoryItemResponse(InventoryItemBase):
    """Schema for inventory item API responses."""

    inventory_id: int
    restaurant_id: int
    unit_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    unit: Optional[UnitResponse] = None
    is_low_stock: bool = False

    class Config:
        from_attributes = True


class InventoryItemSummary(BaseModel):
    """Simplified inventory item schema for lists."""

    inventory_id: int
    name: str
    current_stock: Decimal
    reorder_level: Decimal
    is_low_stock: bool
    unit: Optional[UnitResponse] = None

    class Config:
        from_attributes = True


class IngredientBase(BaseModel):
    """Base ingredient schema."""

    quantity: Decimal = Field(..., decimal_places=3)
    is_visible: bool = Field(default=True)
    display_order: int = Field(default=1, ge=0)


class IngredientCreate(IngredientBase):
    """Schema for creating a new ingredient."""

    menu_item_id: int
    inventory_id: int
    unit_id: int


class IngredientUpdate(BaseModel):
    """Schema for updating ingredient."""

    quantity: Optional[Decimal] = Field(None, decimal_places=3)
    is_visible: Optional[bool] = None
    display_order: Optional[int] = Field(None, ge=0)
    unit_id: Optional[int] = None


class IngredientResponse(IngredientBase):
    """Schema for ingredient API responses."""

    ingredient_id: int
    menu_item_id: int
    inventory_id: int
    unit_id: int
    created_at: datetime
    inventory_item: Optional[InventoryItemResponse] = None
    unit: Optional[UnitResponse] = None

    class Config:
        from_attributes = True


class MenuItemRawMaterialCreate(BaseModel):
    """Schema for creating menu item raw material association."""

    menu_item_id: int
    inventory_id: int


class MenuItemRawMaterialResponse(BaseModel):
    """Schema for menu item raw material association responses."""

    menu_item_id: int
    inventory_id: int
    inventory_item: Optional[InventoryItemResponse] = None

    class Config:
        from_attributes = True


class OptionValueIngredientCreate(BaseModel):
    """Schema for creating option value ingredient."""

    option_value_id: int
    inventory_id: int
    unit_id: int
    quantity: Decimal = Field(..., decimal_places=3)


class OptionValueIngredientResponse(BaseModel):
    """Schema for option value ingredient responses."""

    option_value_id: int
    inventory_id: int
    unit_id: int
    quantity: Decimal
    created_at: datetime
    inventory_item: Optional[InventoryItemResponse] = None
    unit: Optional[UnitResponse] = None

    class Config:
        from_attributes = True


class OptionValueIngredientMultiplierCreate(BaseModel):
    """Schema for creating option value ingredient multiplier."""

    option_value_id: int
    ingredient_id: int
    multiplier: Decimal = Field(..., decimal_places=3)


class OptionValueIngredientMultiplierResponse(BaseModel):
    """Schema for option value ingredient multiplier responses."""

    option_value_id: int
    ingredient_id: int
    multiplier: Decimal
    created_at: datetime
    ingredient: Optional[IngredientResponse] = None

    class Config:
        from_attributes = True


class StockUpdate(BaseModel):
    """Schema for updating inventory stock."""

    current_stock: Decimal = Field(..., decimal_places=3)
    expiration_date: Optional[date] = None
    batch_number: Optional[str] = Field(None, max_length=100)


class LowStockAlert(BaseModel):
    """Schema for low stock alerts."""

    inventory_id: int
    name: str
    current_stock: Decimal
    reorder_level: Decimal
    unit: Optional[UnitResponse] = None
    days_until_stockout: Optional[int] = None

    class Config:
        from_attributes = True
