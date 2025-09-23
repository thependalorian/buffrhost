"""
Pydantic schemas for customer-related API operations.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class CustomerBase(BaseModel):
    """Base customer schema."""
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)


class CustomerCreate(CustomerBase):
    """Schema for creating a new customer."""
    pass


class CustomerUpdate(BaseModel):
    """Schema for updating customer information."""
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=20)
    first_name: Optional[str] = Field(None, max_length=255)
    last_name: Optional[str] = Field(None, max_length=255)


class CustomerResponse(CustomerBase):
    """Schema for customer API responses."""
    customer_id: str
    loyalty_points: int = Field(default=0, ge=0)
    created_at: datetime
    updated_at: Optional[datetime] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class CustomerSummary(BaseModel):
    """Simplified customer schema for lists."""
    customer_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    loyalty_points: int
    created_at: datetime

    class Config:
        from_attributes = True


class LoyaltyPointsUpdate(BaseModel):
    """Schema for updating loyalty points."""
    points: int = Field(..., description="Points to add (positive) or subtract (negative)")
    reason: Optional[str] = Field(None, max_length=255, description="Reason for point change")


class LoyaltyPointsResponse(BaseModel):
    """Schema for loyalty points response."""
    customer_id: str
    points_added: int
    new_balance: int
    reason: Optional[str] = None
    timestamp: datetime


class CustomerSearch(BaseModel):
    """Schema for customer search parameters."""
    search: Optional[str] = Field(None, description="Search by name or email")
    loyalty_points_min: Optional[int] = Field(None, ge=0, description="Minimum loyalty points")
    created_after: Optional[datetime] = Field(None, description="Customers created after this date")
    created_before: Optional[datetime] = Field(None, description="Customers created before this date")


class CustomerAnalytics(BaseModel):
    """Schema for customer analytics data."""
    customer_id: str
    total_orders: int
    total_spent: float
    average_order_value: float
    last_order_date: Optional[datetime]
    favorite_items: list
    order_frequency_days: Optional[float]
    loyalty_tier: str

    class Config:
        from_attributes = True
