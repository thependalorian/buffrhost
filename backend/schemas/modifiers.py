"""
Pydantic schemas for modifier-related API operations.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel, Field


class ModifierBase(BaseModel):
    """Base modifier schema."""

    name: str = Field(..., min_length=1, max_length=255)
    is_multiple: bool = Field(default=False)
    min_selections: int = Field(default=0, ge=0)
    max_selections: int = Field(default=1, ge=1)


class ModifierCreate(ModifierBase):
    """Schema for creating a new modifier."""

    pass


class ModifierUpdate(BaseModel):
    """Schema for updating modifier."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    is_multiple: Optional[bool] = None
    min_selections: Optional[int] = Field(None, ge=0)
    max_selections: Optional[int] = Field(None, ge=1)


class ModifierResponse(ModifierBase):
    """Schema for modifier API responses."""

    modifiers_id: int
    restaurant_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class OptionValueBase(BaseModel):
    """Base option value schema."""

    value: str = Field(..., min_length=1, max_length=255)
    additional_price: Decimal = Field(default=Decimal("0.00"), decimal_places=2)
    is_available: bool = Field(default=True)


class OptionValueCreate(OptionValueBase):
    """Schema for creating a new option value."""

    pass


class OptionValueUpdate(BaseModel):
    """Schema for updating option value."""

    value: Optional[str] = Field(None, min_length=1, max_length=255)
    additional_price: Optional[Decimal] = Field(None, decimal_places=2)
    is_available: Optional[bool] = None


class OptionValueResponse(OptionValueBase):
    """Schema for option value API responses."""

    option_value_id: int
    modifiers_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ModifierWithOptions(ModifierResponse):
    """Modifier with option values."""

    option_values: List[OptionValueResponse] = []


class MenuModifierAssociation(BaseModel):
    """Schema for menu-modifier associations."""

    modifiers_id: int
    menu_item_id: int
    is_required: bool = Field(default=False)


class MenuModifierCreate(MenuModifierAssociation):
    """Schema for creating menu-modifier association."""

    pass


class MenuModifierResponse(MenuModifierAssociation):
    """Schema for menu-modifier association responses."""

    modifier: Optional[ModifierResponse] = None
    option_values: List[OptionValueResponse] = []

    class Config:
        from_attributes = True
