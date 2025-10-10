from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class SubscriptionBase(BaseModel):
    user_id: UUID
    plan_name: str
    start_date: datetime
    end_date: Optional[datetime] = None
    status: Optional[str] = "active"
    price: float
    currency: Optional[str] = "NAD"
    billing_period: Optional[str] = None
    metadata_: Optional[dict] = None


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    plan_name: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    price: Optional[float] = None
    currency: Optional[str] = None
    billing_period: Optional[str] = None
    metadata_: Optional[dict] = None


class SubscriptionResponse(SubscriptionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ServiceFeeBase(BaseModel):
    name: str
    description: Optional[str] = None
    fee_type: Optional[str] = None
    value: float
    applies_to: Optional[str] = None
    is_active: Optional[bool] = True


class ServiceFeeCreate(ServiceFeeBase):
    pass


class ServiceFeeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    fee_type: Optional[str] = None
    value: Optional[float] = None
    applies_to: Optional[str] = None
    is_active: Optional[bool] = None


class ServiceFeeResponse(ServiceFeeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvoiceBase(BaseModel):
    user_id: UUID
    invoice_number: str
    issue_date: datetime
    due_date: Optional[datetime] = None
    total_amount: float
    currency: Optional[str] = "NAD"
    status: Optional[str] = "pending"
    items: Optional[List[dict]] = None
    payment_details: Optional[dict] = None


class InvoiceCreate(InvoiceBase):
    pass


class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    issue_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    items: Optional[List[dict]] = None
    payment_details: Optional[dict] = None


class InvoiceResponse(InvoiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CommissionStructureBase(BaseModel):
    name: str
    description: Optional[str] = None
    commission_type: str  # percentage or fixed
    commission_value: float
    applies_to: Optional[str] = None
    is_active: Optional[bool] = True


class CommissionStructureCreate(CommissionStructureBase):
    pass


class CommissionStructureUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    commission_type: Optional[str] = None
    commission_value: Optional[float] = None
    applies_to: Optional[str] = None
    is_active: Optional[bool] = None


class CommissionStructureResponse(CommissionStructureBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Generic Create and Update classes for backward compatibility
class Create(BaseModel):
    pass


class Update(BaseModel):
    pass


class Response(BaseModel):
    pass
