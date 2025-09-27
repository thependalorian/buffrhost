"""
Pydantic schemas for financial settings and billing operations.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID


class PropertyFinancialSettingsCreate(BaseModel):
    """Schema for creating property financial settings."""
    property_id: int
    default_currency: str = Field(default="NAD", max_length=3)
    tax_rate: Decimal = Field(default=15.00, ge=0, le=100)
    service_charge_rate: Decimal = Field(default=0.00, ge=0, le=100)
    gratuity_rate: Decimal = Field(default=0.00, ge=0, le=100)
    payment_terms_days: int = Field(default=30, ge=1, le=365)
    buffr_commission_rate: Decimal = Field(default=5.00, ge=0, le=50)
    
    # Property's Bank Account Information
    property_bank_name: Optional[str] = Field(None, max_length=255)
    property_bank_branch: Optional[str] = Field(None, max_length=255)
    property_bank_address: Optional[str] = None
    property_bank_phone: Optional[str] = Field(None, max_length=20)
    property_account_name: Optional[str] = Field(None, max_length=255)
    property_account_number: Optional[str] = Field(None, max_length=50)
    property_branch_code: Optional[str] = Field(None, max_length=20)
    property_swift_code: Optional[str] = Field(None, max_length=20)
    property_business_id: Optional[str] = Field(None, max_length=100)


class PropertyFinancialSettingsUpdate(BaseModel):
    """Schema for updating property financial settings."""
    default_currency: Optional[str] = Field(None, max_length=3)
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    service_charge_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    gratuity_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    payment_terms_days: Optional[int] = Field(None, ge=1, le=365)
    buffr_commission_rate: Optional[Decimal] = Field(None, ge=0, le=50)
    
    # Property's Bank Account Information
    property_bank_name: Optional[str] = Field(None, max_length=255)
    property_bank_branch: Optional[str] = Field(None, max_length=255)
    property_bank_address: Optional[str] = None
    property_bank_phone: Optional[str] = Field(None, max_length=20)
    property_account_name: Optional[str] = Field(None, max_length=255)
    property_account_number: Optional[str] = Field(None, max_length=50)
    property_branch_code: Optional[str] = Field(None, max_length=20)
    property_swift_code: Optional[str] = Field(None, max_length=20)
    property_business_id: Optional[str] = Field(None, max_length=100)


class PropertyFinancialSettingsResponse(BaseModel):
    """Schema for property financial settings response."""
    settings_id: UUID
    property_id: int
    
    # Buffr's Bank Account Information
    buffr_bank_name: str
    buffr_bank_branch: str
    buffr_bank_address: str
    buffr_bank_phone: str
    buffr_account_name: str
    buffr_account_number: str
    buffr_branch_code: str
    buffr_swift_code: str
    buffr_business_id: str
    
    # Property's Bank Account Information
    property_bank_name: Optional[str] = None
    property_bank_branch: Optional[str] = None
    property_bank_address: Optional[str] = None
    property_bank_phone: Optional[str] = None
    property_account_name: Optional[str] = None
    property_account_number: Optional[str] = None
    property_branch_code: Optional[str] = None
    property_swift_code: Optional[str] = None
    property_business_id: Optional[str] = None
    
    # Financial Settings
    default_currency: str
    tax_rate: Decimal
    service_charge_rate: Decimal
    gratuity_rate: Decimal
    payment_terms_days: int
    buffr_commission_rate: Decimal
    
    # /Settings
    invoice_prefix: str
    quotation_prefix: str
    receipt_prefix: str
    next_invoice_number: int
    next_quotation_number: int
    next_receipt_number: int
    
    # Status
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ServiceRateCreate(BaseModel):
    """Schema for creating service rates."""
    property_id: int
    service_name: str = Field(..., max_length=255)
    service_type: str = Field(..., max_length=100)
    service_category: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    
    # Pricing
    base_rate: Decimal = Field(..., gt=0)
    currency: str = Field(default="NAD", max_length=3)
    rate_type: str = Field(default="fixed", max_length=50)
    
    # Rate Validity
    valid_from: datetime
    valid_until: Optional[datetime] = None
    is_seasonal: bool = Field(default=False)
    season_name: Optional[str] = Field(None, max_length=100)
    
    # Conditions
    minimum_duration: Optional[int] = None
    maximum_duration: Optional[int] = None
    minimum_quantity: int = Field(default=1, ge=1)
    maximum_quantity: Optional[int] = None
    
    # Discounts
    early_booking_discount_rate: Decimal = Field(default=0.00, ge=0, le=100)
    early_booking_days: int = Field(default=0, ge=0)
    bulk_discount_rate: Decimal = Field(default=0.00, ge=0, le=100)
    bulk_discount_quantity: int = Field(default=0, ge=0)
    
    # Additional Charges
    setup_fee: Decimal = Field(default=0.00, ge=0)
    cleaning_fee: Decimal = Field(default=0.00, ge=0)
    service_charge: Decimal = Field(default=0.00, ge=0)
    gratuity_included: bool = Field(default=False)
    
    # Availability
    max_capacity: Optional[int] = None
    advance_booking_required: bool = Field(default=False)
    advance_booking_days: int = Field(default=0, ge=0)


class ServiceRateUpdate(BaseModel):
    """Schema for updating service rates."""
    service_name: Optional[str] = Field(None, max_length=255)
    service_type: Optional[str] = Field(None, max_length=100)
    service_category: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    
    # Pricing
    base_rate: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = Field(None, max_length=3)
    rate_type: Optional[str] = Field(None, max_length=50)
    
    # Rate Validity
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_seasonal: Optional[bool] = None
    season_name: Optional[str] = Field(None, max_length=100)
    
    # Conditions
    minimum_duration: Optional[int] = None
    maximum_duration: Optional[int] = None
    minimum_quantity: Optional[int] = Field(None, ge=1)
    maximum_quantity: Optional[int] = None
    
    # Discounts
    early_booking_discount_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    early_booking_days: Optional[int] = Field(None, ge=0)
    bulk_discount_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    bulk_discount_quantity: Optional[int] = Field(None, ge=0)
    
    # Additional Charges
    setup_fee: Optional[Decimal] = Field(None, ge=0)
    cleaning_fee: Optional[Decimal] = Field(None, ge=0)
    service_charge: Optional[Decimal] = Field(None, ge=0)
    gratuity_included: Optional[bool] = None
    
    # Availability
    is_available: Optional[bool] = None
    max_capacity: Optional[int] = None
    advance_booking_required: Optional[bool] = None
    advance_booking_days: Optional[int] = Field(None, ge=0)


class ServiceRateResponse(BaseModel):
    """Schema for service rate response."""
    rate_id: UUID
    property_id: int
    service_name: str
    service_type: str
    service_category: Optional[str] = None
    description: Optional[str] = None
    
    # Pricing
    base_rate: Decimal
    currency: str
    rate_type: str
    
    # Rate Validity
    valid_from: datetime
    valid_until: Optional[datetime] = None
    is_seasonal: bool
    season_name: Optional[str] = None
    
    # Conditions
    minimum_duration: Optional[int] = None
    maximum_duration: Optional[int] = None
    minimum_quantity: int
    maximum_quantity: Optional[int] = None
    
    # Discounts
    early_booking_discount_rate: Decimal
    early_booking_days: int
    bulk_discount_rate: Decimal
    bulk_discount_quantity: int
    
    # Additional Charges
    setup_fee: Decimal
    cleaning_fee: Decimal
    service_charge: Decimal
    gratuity_included: bool
    
    # Availability
    is_available: bool
    max_capacity: Optional[int] = None
    advance_booking_required: bool
    advance_booking_days: int
    
    # Status
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Create(BaseModel):
    """Schema for creating quotations."""
    corporate_booking_id: UUID
    quotation_date: date
    valid_until: date
    subtotal: Decimal = Field(..., gt=0)
    tax_rate: Decimal = Field(default=15.00, ge=0, le=100)
    discount_rate: Decimal = Field(default=0.00, ge=0, le=100)
    terms_and_conditions: Optional[str] = None
    notes: Optional[str] = None
    prepared_by: Optional[str] = Field(None, max_length=255)
    sent_to_email: Optional[str] = Field(None, max_length=255)
    
    # Items
    items: List[Dict[str, Any]] = Field(..., min_items=1)


class Update(BaseModel):
    """Schema for updating quotations."""
    quotation_date: Optional[date] = None
    valid_until: Optional[date] = None
    status: Optional[str] = Field(None, pattern="^(draft|sent|accepted|rejected|expired)$")
    subtotal: Optional[Decimal] = Field(None, gt=0)
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    discount_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    terms_and_conditions: Optional[str] = None
    notes: Optional[str] = None
    prepared_by: Optional[str] = Field(None, max_length=255)
    sent_to_email: Optional[str] = Field(None, max_length=255)


class Response(BaseModel):
    """Schema for quotation response."""
    quotation_id: UUID
    corporate_booking_id: UUID
    quotation_number: str
    quotation_date: date
    valid_until: date
    status: str
    subtotal: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    discount_rate: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    terms_and_conditions: Optional[str] = None
    notes: Optional[str] = None
    prepared_by: Optional[str] = None
    sent_to_email: Optional[str] = None
    sent_at: Optional[datetime] = None
    accepted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class Create(BaseModel):
    """Schema for creating invoices."""
    corporate_booking_id: UUID
    quotation_id: Optional[UUID] = None
    invoice_date: date
    due_date: date
    subtotal: Decimal = Field(..., gt=0)
    tax_rate: Decimal = Field(default=15.00, ge=0, le=100)
    discount_rate: Decimal = Field(default=0.00, ge=0, le=100)
    payment_terms: int = Field(default=30, ge=1, le=365)
    notes: Optional[str] = None
    
    # Items
    items: List[Dict[str, Any]] = Field(..., min_items=1)


class Update(BaseModel):
    """Schema for updating invoices."""
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    status: Optional[str] = Field(None, pattern="^(draft|sent|paid|overdue|cancelled)$")
    subtotal: Optional[Decimal] = Field(None, gt=0)
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    discount_rate: Optional[Decimal] = Field(None, ge=0, le=100)
    payment_terms: Optional[int] = Field(None, ge=1, le=365)
    payment_method: Optional[str] = Field(None, max_length=50)
    payment_reference: Optional[str] = Field(None, max_length=255)
    notes: Optional[str] = None


class Response(BaseModel):
    """Schema for invoice response."""
    invoice_id: UUID
    corporate_booking_id: UUID
    quotation_id: Optional[UUID] = None
    invoice_number: str
    invoice_date: date
    due_date: date
    status: str
    subtotal: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    discount_rate: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    paid_amount: Decimal
    balance_amount: Decimal
    payment_terms: int
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    paid_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ReceiptCreate(BaseModel):
    """Schema for creating receipts."""
    property_id: int
    order_id: Optional[UUID] = None
    payment_transaction_id: Optional[UUID] = None
    receipt_type: str = Field(default="payment", pattern="^(payment|refund|adjustment)$")
    
    # Customer Information
    customer_name: Optional[str] = Field(None, max_length=255)
    customer_email: Optional[str] = Field(None, max_length=255)
    customer_phone: Optional[str] = Field(None, max_length=20)
    
    # Payment Information
    payment_method: Optional[str] = Field(None, max_length=50)
    payment_reference: Optional[str] = Field(None, max_length=255)
    amount_paid: Decimal = Field(..., gt=0)
    currency: str = Field(default="NAD", max_length=3)
    
    # Breakdown
    subtotal: Decimal = Field(..., gt=0)
    tax_amount: Decimal = Field(default=0.00, ge=0)
    service_charge: Decimal = Field(default=0.00, ge=0)
    gratuity: Decimal = Field(default=0.00, ge=0)
    discount_amount: Decimal = Field(default=0.00, ge=0)
    
    # Notes
    notes: Optional[str] = None
    
    # Items
    items: List[Dict[str, Any]] = Field(..., min_items=1)


class ReceiptResponse(BaseModel):
    """Schema for receipt response."""
    receipt_id: UUID
    property_id: int
    order_id: Optional[UUID] = None
    payment_transaction_id: Optional[UUID] = None
    receipt_number: str
    receipt_date: datetime
    receipt_type: str
    
    # Customer Information
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    
    # Payment Information
    payment_method: Optional[str] = None
    payment_reference: Optional[str] = None
    amount_paid: Decimal
    currency: str
    
    # Breakdown
    subtotal: Decimal
    tax_amount: Decimal
    service_charge: Decimal
    gratuity: Decimal
    discount_amount: Decimal
    total_amount: Decimal
    
    # Buffr Commission
    buffr_commission_rate: Decimal
    buffr_commission_amount: Decimal
    property_revenue: Decimal
    
    # Status
    is_issued: bool
    issued_at: datetime
    sent_to_customer: bool
    sent_at: Optional[datetime] = None
    
    # Notes
    notes: Optional[str] = None
    internal_notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class FinancialTransactionResponse(BaseModel):
    """Schema for financial transaction response."""
    transaction_id: UUID
    property_id: int
    order_id: Optional[UUID] = None
    payment_transaction_id: Optional[UUID] = None
    receipt_id: Optional[UUID] = None
    
    # Transaction Information
    transaction_type: str
    transaction_date: datetime
    reference_number: Optional[str] = None
    
    # Amounts
    gross_amount: Decimal
    buffr_commission_amount: Decimal
    property_revenue_amount: Decimal
    currency: str
    
    # Status
    status: str
    processed_at: Optional[datetime] = None
    settled_at: Optional[datetime] = None
    
    # Bank Transfer Information
    bank_transfer_reference: Optional[str] = None
    bank_transfer_date: Optional[datetime] = None
    bank_transfer_status: Optional[str] = None
    
    # Notes
    notes: Optional[str] = None
    
    # Timestamps
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class BillingSummary(BaseModel):
    """Schema for billing summary."""
    property_id: int
    period_start: date
    period_end: date
    
    # Revenue Summary
    total_revenue: Decimal
    total_transactions: int
    average_transaction_value: Decimal
    
    # Commission Summary
    total_buffr_commission: Decimal
    total_property_revenue: Decimal
    commission_rate: Decimal
    
    # Transaction Breakdown
    transactions_by_type: Dict[str, int]
    transactions_by_status: Dict[str, int]
    
    # Outstanding
    outstanding_invoices: int
    outstanding_amount: Decimal
    overdue_invoices: int
    overdue_amount: Decimal


class RateCalculationRequest(BaseModel):
    """Schema for rate calculation request."""
    service_type: str
    service_name: str
    quantity: int = Field(..., ge=1)
    duration: Optional[int] = None  # hours or days
    booking_date: Optional[date] = None
    is_early_booking: bool = Field(default=False)
    is_bulk_booking: bool = Field(default=False)
    customer_type: str = Field(default="regular")  # regular, corporate, vip


class RateCalculationResponse(BaseModel):
    """Schema for rate calculation response."""
    service_name: str
    base_rate: Decimal
    quantity: int
    duration: Optional[int] = None
    
    # Calculations
    subtotal: Decimal
    early_booking_discount: Decimal
    bulk_discount: Decimal
    setup_fee: Decimal
    cleaning_fee: Decimal
    service_charge: Decimal
    gratuity: Decimal
    tax_amount: Decimal
    total_amount: Decimal
    
    # Breakdown
    breakdown: Dict[str, Decimal]
    applied_discounts: List[str]
    additional_charges: List[str]
