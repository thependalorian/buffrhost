"""
Booking Schemas
Pydantic models for booking-related API requests and responses
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class BookingStatus(str, Enum):
    """Booking status options"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"

class PaymentStatus(str, Enum):
    """Payment status options"""
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    REFUNDED = "refunded"
    FAILED = "failed"

# Base booking schema
class BookingBase(BaseModel):
    """Base booking schema with common fields"""
    property_id: str
    room_id: str
    guest_name: str
    guest_email: str
    guest_phone: Optional[str] = None
    check_in: datetime
    check_out: datetime
    adults: int = 1
    children: int = 0
    room_rate: float
    special_requests: Optional[str] = None
    
    @validator('adults')
    def validate_adults(cls, v):
        if v < 1:
            raise ValueError('At least 1 adult is required')
        return v
    
    @validator('children')
    def validate_children(cls, v):
        if v < 0:
            raise ValueError('Children count cannot be negative')
        return v
    
    @validator('room_rate')
    def validate_room_rate(cls, v):
        if v <= 0:
            raise ValueError('Room rate must be positive')
        return v
    
    @validator('check_out')
    def validate_check_out(cls, v, values):
        if 'check_in' in values and v <= values['check_in']:
            raise ValueError('Check-out must be after check-in')
        return v

# Booking creation schema
class BookingCreate(BookingBase):
    """Schema for creating a new booking"""
    status: Optional[BookingStatus] = BookingStatus.CONFIRMED
    payment_status: Optional[PaymentStatus] = PaymentStatus.PENDING

# Booking update schema
class BookingUpdate(BaseModel):
    """Schema for updating booking information"""
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    adults: Optional[int] = None
    children: Optional[int] = None
    room_rate: Optional[float] = None
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    special_requests: Optional[str] = None
    
    @validator('adults')
    def validate_adults(cls, v):
        if v is not None and v < 1:
            raise ValueError('At least 1 adult is required')
        return v
    
    @validator('children')
    def validate_children(cls, v):
        if v is not None and v < 0:
            raise ValueError('Children count cannot be negative')
        return v
    
    @validator('room_rate')
    def validate_room_rate(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Room rate must be positive')
        return v

# Booking response schema
class BookingResponse(BookingBase):
    """Schema for booking response data"""
    id: str
    status: BookingStatus
    payment_status: PaymentStatus
    total_amount: float
    created_at: datetime
    updated_at: datetime
    checked_in_at: Optional[datetime] = None
    checked_out_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

# Booking search schema
class BookingSearch(BaseModel):
    """Schema for booking search"""
    property_id: Optional[str] = None
    guest_email: Optional[str] = None
    status: Optional[BookingStatus] = None
    check_in_after: Optional[datetime] = None
    check_in_before: Optional[datetime] = None
    check_out_after: Optional[datetime] = None
    check_out_before: Optional[datetime] = None
    limit: int = 20
    offset: int = 0

# Booking filter schema
class BookingFilter(BaseModel):
    """Schema for filtering bookings"""
    property_id: Optional[str] = None
    room_id: Optional[str] = None
    guest_email: Optional[str] = None
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    check_in_after: Optional[datetime] = None
    check_in_before: Optional[datetime] = None

# Room availability search schema
class AvailabilitySearch(BaseModel):
    """Schema for room availability search"""
    property_id: str
    check_in: datetime
    check_out: datetime
    adults: int = 1
    children: int = 0
    room_type_id: Optional[str] = None
    
    @validator('adults')
    def validate_adults(cls, v):
        if v < 1:
            raise ValueError('At least 1 adult is required')
        return v
    
    @validator('children')
    def validate_children(cls, v):
        if v < 0:
            raise ValueError('Children count cannot be negative')
        return v
    
    @validator('check_out')
    def validate_check_out(cls, v, values):
        if 'check_in' in values and v <= values['check_in']:
            raise ValueError('Check-out must be after check-in')
        return v

# Available room schema
class AvailableRoom(BaseModel):
    """Schema for available room information"""
    room_type_id: str
    room_type_name: str
    description: Optional[str] = None
    base_price: float
    total_price: float
    max_occupancy: int
    room_size: Optional[float] = None
    bed_type: Optional[str] = None
    amenities: List[str] = []
    available_count: int
    length_of_stay: int

# Booking statistics schema
class BookingStats(BaseModel):
    """Schema for booking statistics"""
    property_id: str
    period_days: int
    total_bookings: int
    status_breakdown: Dict[str, int]
    total_revenue: float
    average_booking_value: float
    cancellation_rate: float
    generated_at: str

# Booking cancellation schema
class BookingCancellation(BaseModel):
    """Schema for booking cancellation"""
    booking_id: str
    reason: Optional[str] = None
    refund_amount: Optional[float] = None

# Booking check-in schema
class BookingCheckIn(BaseModel):
    """Schema for booking check-in"""
    booking_id: str
    actual_check_in: Optional[datetime] = None
    notes: Optional[str] = None

# Booking check-out schema
class BookingCheckOut(BaseModel):
    """Schema for booking check-out"""
    booking_id: str
    actual_check_out: Optional[datetime] = None
    notes: Optional[str] = None
    additional_charges: Optional[float] = None

# Booking modification schema
class BookingModification(BaseModel):
    """Schema for booking modifications"""
    booking_id: str
    new_check_in: Optional[datetime] = None
    new_check_out: Optional[datetime] = None
    new_room_id: Optional[str] = None
    reason: Optional[str] = None
    additional_charges: Optional[float] = None

# Guest information schema
class GuestInfo(BaseModel):
    """Schema for guest information"""
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    preferences: Optional[Dict[str, Any]] = None
    loyalty_tier: Optional[str] = None

# Booking confirmation schema
class BookingConfirmation(BaseModel):
    """Schema for booking confirmation"""
    booking: BookingResponse
    confirmation_number: str
    check_in_instructions: Optional[str] = None
    property_contact: Optional[Dict[str, str]] = None
    cancellation_policy: Optional[str] = None

# Booking invoice schema
class BookingInvoice(BaseModel):
    """Schema for booking invoice"""
    booking_id: str
    invoice_number: str
    items: List[Dict[str, Any]]
    subtotal: float
    taxes: float
    total: float
    due_date: datetime
    payment_instructions: Optional[str] = None

# Booking payment schema
class BookingPayment(BaseModel):
    """Schema for booking payment"""
    booking_id: str
    amount: float
    payment_method: str
    payment_reference: Optional[str] = None
    notes: Optional[str] = None

# Booking refund schema
class BookingRefund(BaseModel):
    """Schema for booking refund"""
    booking_id: str
    amount: float
    reason: str
    refund_method: str
    refund_reference: Optional[str] = None

# API response schemas
class BookingListResponse(BaseModel):
    """Schema for booking list response"""
    bookings: List[BookingResponse]
    total: int
    page: int
    size: int
    pages: int

class BookingCreateResponse(BaseModel):
    """Schema for booking creation response"""
    booking: BookingResponse
    confirmation_number: str
    message: str

class BookingUpdateResponse(BaseModel):
    """Schema for booking update response"""
    booking: BookingResponse
    message: str

class BookingCancelResponse(BaseModel):
    """Schema for booking cancellation response"""
    booking: BookingResponse
    refund_amount: Optional[float] = None
    message: str

class AvailabilityResponse(BaseModel):
    """Schema for availability response"""
    property_id: str
    date_range: Dict[str, str]
    available_rooms: List[AvailableRoom]
    generated_at: datetime

class BookingStatsResponse(BaseModel):
    """Schema for booking stats response"""
    stats: BookingStats
    generated_at: datetime

# Error schemas
class BookingError(BaseModel):
    """Schema for booking-related errors"""
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class BookingErrorResponse(BaseModel):
    """Schema for booking error response"""
    success: bool = False
    error: BookingError
    validation_errors: Optional[List[Dict[str, Any]]] = None

# Bulk operations schema
class BulkBookingOperation(BaseModel):
    """Schema for bulk booking operations"""
    booking_ids: List[str]
    operation: str  # cancel, check_in, check_out, modify
    data: Optional[Dict[str, Any]] = None

# Booking import schema
class BookingImport(BaseModel):
    """Schema for importing bookings"""
    bookings: List[BookingCreate]
    validate_availability: bool = True
    send_confirmation: bool = True

# Booking export schema
class BookingExport(BaseModel):
    """Schema for exporting bookings"""
    format: str = "csv"  # csv, json, xlsx
    fields: List[str] = ["id", "guest_name", "guest_email", "check_in", "check_out", "status"]
    filters: Optional[BookingFilter] = None

# Booking audit schema
class BookingAudit(BaseModel):
    """Schema for booking audit trail"""
    id: str
    booking_id: str
    action: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    changed_by: str
    changed_at: datetime
    ip_address: Optional[str] = None