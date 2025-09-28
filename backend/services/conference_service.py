"""
Conference service for Buffr Host platform.
"""
from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.services import ConferenceRoom, ServiceBooking
from schemas.conference import ConferenceBooking as ConferenceBookingSchema
from schemas.conference import ConferenceBookingCreate
from schemas.conference import ConferenceRoom as ConferenceRoomSchema


class ConferenceService:
    """Service for conference room management."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_conference_rooms(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[ConferenceRoomSchema]:
        """Get conference rooms for a property."""
        query = (
            select(ConferenceRoom)
            .where(ConferenceRoom.property_id == property_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        rooms = result.scalars().all()
        return rooms

    async def get_conference_bookings(
        self,
        property_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ConferenceBookingSchema]:
        """Get conference bookings for a property."""
        query = select(ServiceBooking).where(
            ServiceBooking.property_id == property_id,
            ServiceBooking.service_type == "conference",
        )

        if start_date:
            query = query.where(ServiceBooking.booking_date >= start_date)
        if end_date:
            query = query.where(ServiceBooking.booking_date <= end_date)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        bookings = result.scalars().all()
        return bookings

    async def create_conference_booking(
        self, property_id: int, booking_data: ConferenceBookingCreate
    ) -> ServiceBooking:
        """Create a new conference booking."""
        room_query = select(ConferenceRoom).where(
            and_(
                ConferenceRoom.room_id == booking_data.room_id,
                ConferenceRoom.property_id == property_id,
            )
        )
        room_result = await self.db.execute(room_query)
        room = room_result.scalar_one_or_none()

        if not room:
            raise ValueError("Conference room not found")

        hours = (booking_data.end_time - booking_data.start_time).total_seconds() / 3600
        total_price = room.base_price_per_hour * hours

        booking = ServiceBooking(
            property_id=property_id,
            customer_id=booking_data.customer_id,
            service_id=booking_data.room_id,
            service_type="conference",
            booking_date=booking_data.start_time.date(),
            start_time=booking_data.start_time.time(),
            end_time=booking_data.end_time.time(),
            total_price=total_price,
            special_requests=booking_data.special_requests,
            status="confirmed",
        )

        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)

        return booking

    async def update_booking_status(
        self, booking_id: int, property_id: int, status: str
    ) -> Optional[ServiceBooking]:
        """Update conference booking status."""
        query = select(ServiceBooking).where(
            and_(
                ServiceBooking.booking_id == booking_id,
                ServiceBooking.property_id == property_id,
                ServiceBooking.service_type == "conference",
            )
        )

        result = await self.db.execute(query)
        booking = result.scalar_one_or_none()

        if not booking:
            return None

        booking.status = status
        await self.db.commit()
        await self.db.refresh(booking)

        return booking
