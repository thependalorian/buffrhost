"""
Pydantic schemas for Spa services.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, date, time

class SpaServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    duration_minutes: int
    price: float
    category: Optional[str] = None
    is_available: bool = True

class SpaServiceCreate(SpaServiceBase):
    pass

class SpaService(SpaServiceBase):
    service_id: int
    property_id: int

    class Config:
        orm_mode = True

class SpaTherapist(BaseModel):
    therapist_id: int
    name: str
    specialties: List[str]
    experience_years: int
    rating: float
    is_available: bool

class SpaAppointmentBase(BaseModel):
    customer_name: str
    service_id: int
    appointment_time: datetime
    duration: int
    therapist_id: int

class SpaAppointmentCreate(SpaAppointmentBase):
    pass

class SpaAppointment(SpaAppointmentBase):
    appointment_id: int
    property_id: int
    status: str

    class Config:
        orm_mode = True
