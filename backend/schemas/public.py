from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RoomStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    MAINTENANCE = "maintenance"
    CLEANING = "cleaning"

class RoomSearchRequest(BaseModel):
    property_id: str
    check_in: datetime
    check_out: datetime
    guests: int = 2
    rooms: int = 1
    
    @validator('check_out')
    def check_out_after_check_in(cls, v, values):
        if 'check_in' in values and v <= values['check_in']:
            raise ValueError('Check-out date must be after check-in date')
        return v

class RoomAvailabilityResponse(BaseModel):
    room_id: str
    room_number: str
    room_type: str
    description: str
    max_occupancy: int
    base_price: float
    amenities: List[str]
    images: List[str]
    available: bool
    total_price: float

class GuestBookingCreate(BaseModel):
    property_id: str
    room_id: str
    check_in: datetime
    check_out: datetime
    guest_info: Dict[str, Any]
    payment_method: str
    special_requests: Optional[str] = None
    
    @validator('guest_info')
    def validate_guest_info(cls, v):
        required_fields = ['first_name', 'last_name', 'email', 'phone']
        for field in required_fields:
            if field not in v:
                raise ValueError(f'Missing required guest field: {field}')
        return v

class MenuResponse(BaseModel):
    restaurant_id: str
    restaurant_name: str
    categories: List[Dict[str, Any]]
    items: List[Dict[str, Any]]
    service_hours: Dict[str, str]

class CheckinRequest(BaseModel):
    confirmation_number: str
    guest_email: str
    identification_data: Optional[Dict[str, Any]] = None

class PropertyAvailabilityResponse(BaseModel):
    property_id: str
    date: str
    total_rooms: int
    booked_rooms: int
    available_rooms: int
    occupancy_rate: float

class BookingConfirmationResponse(BaseModel):
    success: bool
    booking_id: str
    confirmation_number: str
    message: str
    check_in: datetime
    check_out: datetime
    room_number: str
    total_amount: float