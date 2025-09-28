from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class Base(BaseModel):
    user_id: UUID
    account_name: str
    bank_name: str
    account_number: str
    routing_number: Optional[str] = None
    currency: Optional[str] = "NAD"
    is_primary: Optional[bool] = False


class Create(Base):
    pass


class Update(BaseModel):
    account_name: Optional[str] = None
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    routing_number: Optional[str] = None
    currency: Optional[str] = None
    is_primary: Optional[bool] = None


class Response(Base):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    account_id: UUID
    type: str
    amount: float
    currency: Optional[str] = "NAD"
    description: Optional[str] = None
    status: Optional[str] = "pending"
    transaction_date: Optional[datetime] = None
    metadata_: Optional[dict] = None


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    type: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    transaction_date: Optional[datetime] = None
    metadata_: Optional[dict] = None


class TransactionResponse(TransactionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PaymentGatewayBase(BaseModel):
    name: str
    api_key: Optional[str] = None
    secret_key: Optional[str] = None
    is_active: Optional[bool] = True
    config: Optional[dict] = None


class PaymentGatewayCreate(PaymentGatewayBase):
    pass


class PaymentGatewayUpdate(BaseModel):
    name: Optional[str] = None
    api_key: Optional[str] = None
    secret_key: Optional[str] = None
    is_active: Optional[bool] = None
    config: Optional[dict] = None


class PaymentGatewayResponse(PaymentGatewayBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DisbursementBase(BaseModel):
    transaction_id: Optional[UUID] = None
    source_account_id: UUID
    destination_account_details: dict
    amount: float
    currency: Optional[str] = "NAD"
    status: Optional[str] = "pending"
    disbursement_date: Optional[datetime] = None
    notes: Optional[str] = None


class DisbursementCreate(DisbursementBase):
    pass


class DisbursementUpdate(BaseModel):
    transaction_id: Optional[UUID] = None
    source_account_id: Optional[UUID] = None
    destination_account_details: Optional[dict] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    status: Optional[str] = None
    disbursement_date: Optional[datetime] = None
    notes: Optional[str] = None


class DisbursementResponse(DisbursementBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
