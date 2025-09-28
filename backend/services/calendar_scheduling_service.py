from typing import List, Optional
from uuid import UUID

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from models.calendar_scheduling import Booking, Event, Resource, Schedule
from schemas.calendar_scheduling import (BookingCreate, BookingUpdate,
                                         EventCreate, EventUpdate,
                                         ResourceCreate, ResourceUpdate,
                                         ScheduleCreate, ScheduleUpdate)


class CalendarSchedulingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # Booking Operations
    async def create_booking(self, booking_data: BookingCreate) -> Booking:
        booking = Booking(**booking_data.model_dump())
        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)
        return booking

    async def get_booking(self, booking_id: UUID) -> Optional[Booking]:
        result = await self.db.execute(select(Booking).where(Booking.id == booking_id))
        return result.scalar_one_or_none()

    async def get_bookings(self, skip: int = 0, limit: int = 100) -> List[Booking]:
        result = await self.db.execute(select(Booking).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_booking(
        self, booking_id: UUID, booking_data: BookingUpdate
    ) -> Optional[Booking]:
        booking = await self.get_booking(booking_id)
        if booking:
            update_data = booking_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(booking, key, value)
            await self.db.commit()
            await self.db.refresh(booking)
        return booking

    async def delete_booking(self, booking_id: UUID) -> bool:
        booking = await self.get_booking(booking_id)
        if booking:
            await self.db.delete(booking)
            await self.db.commit()
            return True
        return False

    # Schedule Operations
    async def create_schedule(self, schedule_data: ScheduleCreate) -> Schedule:
        schedule = Schedule(**schedule_data.model_dump())
        self.db.add(schedule)
        await self.db.commit()
        await self.db.refresh(schedule)
        return schedule

    async def get_schedule(self, schedule_id: UUID) -> Optional[Schedule]:
        result = await self.db.execute(
            select(Schedule).where(Schedule.id == schedule_id)
        )
        return result.scalar_one_or_none()

    async def get_schedules(self, skip: int = 0, limit: int = 100) -> List[Schedule]:
        result = await self.db.execute(select(Schedule).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_schedule(
        self, schedule_id: UUID, schedule_data: ScheduleUpdate
    ) -> Optional[Schedule]:
        schedule = await self.get_schedule(schedule_id)
        if schedule:
            update_data = schedule_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(schedule, key, value)
            await self.db.commit()
            await self.db.refresh(schedule)
        return schedule

    async def delete_schedule(self, schedule_id: UUID) -> bool:
        schedule = await self.get_schedule(schedule_id)
        if schedule:
            await self.db.delete(schedule)
            await self.db.commit()
            return True
        return False

    # Resource Operations
    async def create_resource(self, resource_data: ResourceCreate) -> Resource:
        resource = Resource(**resource_data.model_dump())
        self.db.add(resource)
        await self.db.commit()
        await self.db.refresh(resource)
        return resource

    async def get_resource(self, resource_id: UUID) -> Optional[Resource]:
        result = await self.db.execute(
            select(Resource).where(Resource.id == resource_id)
        )
        return result.scalar_one_or_none()

    async def get_resources(self, skip: int = 0, limit: int = 100) -> List[Resource]:
        result = await self.db.execute(select(Resource).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_resource(
        self, resource_id: UUID, resource_data: ResourceUpdate
    ) -> Optional[Resource]:
        resource = await self.get_resource(resource_id)
        if resource:
            update_data = resource_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(resource, key, value)
            await self.db.commit()
            await self.db.refresh(resource)
        return resource

    async def delete_resource(self, resource_id: UUID) -> bool:
        resource = await self.get_resource(resource_id)
        if resource:
            await self.db.delete(resource)
            await self.db.commit()
            return True
        return False

    # Event Operations
    async def create_event(self, event_data: EventCreate) -> Event:
        event = Event(**event_data.model_dump())
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        return event

    async def get_event(self, event_id: UUID) -> Optional[Event]:
        result = await self.db.execute(select(Event).where(Event.id == event_id))
        return result.scalar_one_or_none()

    async def get_events(self, skip: int = 0, limit: int = 100) -> List[Event]:
        result = await self.db.execute(select(Event).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def update_event(
        self, event_id: UUID, event_data: EventUpdate
    ) -> Optional[Event]:
        event = await self.get_event(event_id)
        if event:
            update_data = event_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(event, key, value)
            await self.db.commit()
            await self.db.refresh(event)
        return event

    async def delete_event(self, event_id: UUID) -> bool:
        event = await self.get_event(event_id)
        if event:
            await self.db.delete(event)
            await self.db.commit()
            return True
        return False
