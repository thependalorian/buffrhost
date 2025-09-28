from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class BookingBase(BaseModel):
    user_id: UUID
    resource_id: UUID
    resource_type: str
    start_time: datetime
    end_time: datetime
    status: Optional[str] = "pending"
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    resource_id: Optional[UUID] = None
    resource_type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class BookingResponse(BookingBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ScheduleBase(BaseModel):
    employee_id: UUID
    shift_date: date
    start_time: datetime
    end_time: datetime
    role: Optional[str] = None
    notes: Optional[str] = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    employee_id: Optional[UUID] = None
    shift_date: Optional[date] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    role: Optional[str] = None
    notes: Optional[str] = None


class ScheduleResponse(ScheduleBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ResourceBase(BaseModel):
    name: str
    resource_type: str
    capacity: Optional[int] = None
    is_available: Optional[bool] = True
    location: Optional[str] = None
    properties: Optional[dict] = None


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    resource_type: Optional[str] = None
    capacity: Optional[int] = None
    is_available: Optional[bool] = None
    location: Optional[str] = None
    properties: Optional[dict] = None


class ResourceResponse(ResourceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    event_type: Optional[str] = None
    created_by: Optional[UUID] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    event_type: Optional[str] = None


class EventResponse(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
