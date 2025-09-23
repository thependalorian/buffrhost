"""
Pydantic schemas for Transportation services.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date, time

class TransportationServiceBase(BaseModel):
    service_name: str
    service_type: str
    description: Optional[str] = None
    base_price: float
    duration_minutes: Optional[int] = None
    capacity: Optional[int] = None
    is_available: bool = True

class TransportationServiceCreate(TransportationServiceBase):
    pass

class TransportationService(TransportationServiceBase):
    service_id: int
    property_id: int

    class Config:
        orm_mode = True

class TransportationBookingBase(BaseModel):
    service_id: int
    pickup_location: str
    destination: str
    pickup_time: datetime
    estimated_duration: int

class TransportationBookingCreate(TransportationBookingBase):
    pass

class TransportationBooking(TransportationBookingBase):
    booking_id: int
    property_id: int
    status: str
    vehicle_license: str

    class Config:
        orm_mode = True

class TransportationVehicle(BaseModel):
    vehicle_id: int
    license_plate: str
    vehicle_type: str
    make: str
    model: str
    year: int
    capacity: int
    driver_name: str
    is_available: bool
    last_maintenance: date

class TransportationRoute(BaseModel):
    route_id: int
    name: str
    origin: str
    destination: str
    distance_km: float
    estimated_duration: int
    frequency: str
    operating_hours: str
    price: float
