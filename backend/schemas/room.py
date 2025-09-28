"""
Room-related Pydantic schemas for Buffr Host platform.
"""
from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class RoomTypeEnum(str, Enum):
    STANDARD = "standard"
    DELUXE = "deluxe"
    SUITE = "suite"
    PREMIUM = "premium"


class RoomTypeResponse(BaseModel):
    id: int
    property_id: int
    name: str
    description: Optional[str] = None
    room_type: str
    max_occupancy: int
    bed_type: str
    amenities: List[str] = []
    price_per_night: float
    currency: str = "NAD"
    is_available: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RoomReservationCreate(BaseModel):
    room_type_id: int
    check_in_date: date
    check_out_date: date
    guest_count: int
    guest_name: str
    guest_email: str
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = None


class RoomReservationResponse(BaseModel):
    id: int
    room_type_id: int
    booking_reference: str
    check_in_date: date
    check_out_date: date
    guest_count: int
    guest_name: str
    guest_email: str
    guest_phone: Optional[str] = None
    special_requests: Optional[str] = None
    total_amount: float
    currency: str = "NAD"
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
