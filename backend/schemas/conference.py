"""
Pydantic schemas for Conference services.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date, time

class ConferenceRoomBase(BaseModel):
    room_name: str
    capacity: int
    base_price_per_hour: float
    amenities: Optional[str] = None
    is_available: bool = True

class ConferenceRoomCreate(ConferenceRoomBase):
    pass

class ConferenceRoom(ConferenceRoomBase):
    room_id: int
    property_id: int

    class Config:
        orm_mode = True

class ConferenceBookingBase(BaseModel):
    room_id: int
    event_name: str
    organizer: str
    start_time: datetime
    end_time: datetime
    attendees: int

class ConferenceBookingCreate(ConferenceBookingBase):
    pass

class ConferenceBooking(ConferenceBookingBase):
    booking_id: int
    property_id: int
    status: str
    total_cost: float

    class Config:
        orm_mode = True

class ConferenceAmenity(BaseModel):
    amenity_id: int
    name: str
    description: Optional[str] = None
    category: str
    hourly_rate: float
    is_available: bool

class ConferencePackage(BaseModel):
    package_id: int
    name: str
    description: Optional[str] = None
    duration_hours: int
    includes: List[str]
    price: float
    max_attendees: int
