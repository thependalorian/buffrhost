"""
Pydantic schemas for order-related API operations.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from uuid import UUID


class OrderItemOptionCreate(BaseModel):
    """Schema for creating order item option."""
    option_value_id: int


class OrderItemCreate(BaseModel):
    """Schema for creating order item."""
    menu_item_id: int
    quantity: int = Field(..., ge=1)
    special_instructions: Optional[str] = Field(None, max_length=500)
    selected_options: List[OrderItemOptionCreate] = Field(default_factory=list)


class OrderCreate(BaseModel):
    """Schema for creating a new order."""
    customer_id: Optional[UUID] = None
    order_items: List[OrderItemCreate] = Field(..., min_items=1)
    payment_method: Optional[str] = Field(None, max_length=50)
    special_instructions: Optional[str] = Field(None, max_length=1000)


class OrderUpdate(BaseModel):
    """Schema for updating order."""
    status: Optional[str] = Field(None, pattern="^(pending|in_progress|completed|cancelled)$")
    payment_method: Optional[str] = Field(None, max_length=50)
    payment_status: Optional[str] = Field(None, pattern="^(unpaid|pending|paid|failed|refunded)$")
    special_instructions: Optional[str] = Field(None, max_length=1000)


class OrderItemOptionResponse(BaseModel):
    """Schema for order item option responses."""
    order_item_id: int
    option_value_id: int
    option_value: Optional[dict] = None

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    """Schema for order item API responses."""
    order_item_id: int
    order_id: UUID
    menu_item_id: int
    quantity: int
    price_at_order: Decimal
    special_instructions: Optional[str] = None
    selected_options: List[OrderItemOptionResponse] = []
    menu_item: Optional[dict] = None

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """Schema for order API responses."""
    order_id: UUID
    order_number: int
    customer_id: Optional[UUID] = None
    restaurant_id: int
    status: str
    order_date: datetime
    total: Decimal
    payment_method: Optional[str] = None
    payment_status: str = "unpaid"
    special_instructions: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    order_items: List[OrderItemResponse] = []
    customer: Optional[dict] = None

    class Config:
        from_attributes = True


class OrderSummary(BaseModel):
    """Simplified order schema for lists."""
    order_id: UUID
    order_number: int
    customer_name: Optional[str] = None
    status: str
    total: Decimal
    order_date: datetime
    item_count: int

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""
    status: str = Field(..., pattern="^(pending|in_progress|completed|cancelled)$")
    notes: Optional[str] = Field(None, max_length=500)


class OrderSearch(BaseModel):
    """Schema for order search parameters."""
    status: Optional[str] = Field(None, pattern="^(pending|in_progress|completed|cancelled)$")
    customer_id: Optional[UUID] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_total: Optional[Decimal] = None
    max_total: Optional[Decimal] = None


class OrderAnalytics(BaseModel):
    """Schema for order analytics data."""
    total_orders: int
    total_revenue: Decimal
    average_order_value: Decimal
    orders_by_status: dict
    orders_by_hour: dict
    top_items: List[dict]
    customer_breakdown: dict

    class Config:
        from_attributes = True


class OrderItemAnalytics(BaseModel):
    """Schema for order item analytics."""
    menu_item_id: int
    menu_item_name: str
    quantity_sold: int
    revenue: Decimal
    average_price: Decimal
    popularity_rank: int

    class Config:
        from_attributes = True


class PaymentIntent(BaseModel):
    """Schema for payment intent creation."""
    order_id: UUID
    amount: Decimal
    currency: str = Field(default="nad", max_length=3)
    payment_method: str = Field(..., max_length=50)


class PaymentConfirmation(BaseModel):
    """Schema for payment confirmation."""
    payment_intent_id: str
    order_id: UUID
    status: str
    amount_paid: Decimal
    payment_method: str
    transaction_id: Optional[str] = None
