"""
Pydantic schemas for Adumo payment operations.
"""
from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, validator


class AdumoPaymentRequest(BaseModel):
    """Schema for initiating Adumo payment."""

    order_id: UUID
    amount: Decimal = Field(..., gt=0, description="Payment amount")
    currency: str = Field(default="NAD", max_length=3)
    success_url: str = Field(..., description="URL to redirect on successful payment")
    failed_url: str = Field(..., description="URL to redirect on failed payment")
    customer_details: Optional[Dict[str, str]] = Field(
        None, description="Customer information"
    )
    order_items: Optional[List[Dict[str, Any]]] = Field(
        None, description="Order items details"
    )


class AdumoPaymentResponse(BaseModel):
    """Schema for Adumo payment response."""

    transaction_id: UUID
    merchant_reference: str
    payment_url: str
    form_data: Dict[str, Any]
    expires_at: datetime


class AdumoCallbackData(BaseModel):
    """Schema for Adumo payment callback data."""

    result: int = Field(..., alias="_RESULT", description="Transaction result code")
    status: str = Field(..., alias="_STATUS", description="Transaction status")
    merchant_reference: str = Field(
        ..., alias="_MERCHANTREFERENCE", description="Merchant reference"
    )
    transaction_index: Optional[str] = Field(
        None, alias="_TRANSACTIONINDEX", description="Adumo transaction index"
    )
    error_code: Optional[str] = Field(
        None, alias="_ERROR_CODE", description="Error code if failed"
    )
    error_message: Optional[str] = Field(
        None, alias="_ERROR_MESSAGE", description="Error message if failed"
    )
    amount: Decimal = Field(..., alias="_AMOUNT", description="Transaction amount")
    currency_code: str = Field(..., alias="_CURRENCYCODE", description="Currency code")
    pay_method: Optional[str] = Field(
        None, alias="_PAYMETHOD", description="Payment method used"
    )
    acquirer_datetime: Optional[str] = Field(
        None, alias="_ACQUIRERDATETIME", description="Acquirer date time"
    )
    response_token: str = Field(
        ..., alias="_RESPONSE_TOKEN", description="JWT response token"
    )

    # Optional fields
    pan_hashed: Optional[str] = Field(
        None, alias="_PANHASHED", description="Hashed card number"
    )
    card_country: Optional[str] = Field(
        None, alias="_CARDCOUNTRY", description="Card country"
    )
    three_d_status: Optional[str] = Field(
        None, alias="_3DSTATUS", description="3D Secure status"
    )
    bank_error_code: Optional[str] = Field(
        None, alias="_BANK_ERROR_CODE", description="Bank error code"
    )
    bank_error_message: Optional[str] = Field(
        None, alias="_BANK_ERROR_MESSAGE", description="Bank error message"
    )

    # Custom variables
    variable1: Optional[str] = Field(
        None, alias="VARIABLE1", description="Custom variable 1"
    )
    variable2: Optional[str] = Field(
        None, alias="VARIABLE2", description="Custom variable 2"
    )

    @validator("result")
    def validate_result_code(cls, v):
        """Validate result code is integer."""
        if not isinstance(v, int):
            raise ValueError("Result code must be an integer")
        return v


class PaymentTransactionResponse(BaseModel):
    """Schema for payment transaction response."""

    transaction_id: UUID
    order_id: UUID
    merchant_reference: str
    amount: Decimal
    currency: str
    status: str
    is_successful: bool
    payment_method: Optional[str] = None
    adumo_transaction_index: Optional[str] = None
    initiated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentWebhookRequest(BaseModel):
    """Schema for payment webhook request."""

    transaction_id: UUID
    event_type: str
    raw_data: Dict[str, Any]


class PaymentStatusUpdate(BaseModel):
    """Schema for updating payment status."""

    status: str = Field(
        ..., pattern="^(pending|processing|completed|failed|cancelled)$"
    )
    is_successful: Optional[bool] = None
    adumo_transaction_index: Optional[str] = None
    adumo_result_code: Optional[int] = None
    adumo_status: Optional[str] = None
    error_message: Optional[str] = None


class PaymentAnalytics(BaseModel):
    """Schema for payment analytics."""

    total_transactions: int
    successful_transactions: int
    failed_transactions: int
    total_amount: Decimal
    success_rate: float
    average_transaction_amount: Decimal
    transactions_by_status: Dict[str, int]
    transactions_by_payment_method: Dict[str, int]

    class Config:
        from_attributes = True
