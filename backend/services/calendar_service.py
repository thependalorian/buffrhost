"""
Calendar Service for The Shandi Hospitality Ecosystem Management Platform.
Handles availability checks, booking management, and scheduling for rooms and services.
"""

from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, or_, func
from datetime import datetime, date, time, timedelta
from decimal import Decimal
from sqlalchemy.dialects.postgresql import UUID

from database import Base
from models.room import Room, RoomReservation, RoomType
from models.services import SpaService, ConferenceRoom, TransportationService, RecreationService, SpecializedService, ServiceBooking
from models.customer import Customer
from models.hospitality_property import HospitalityProperty

class CalendarService:
    """Service class for calendar and booking operations."""

    def __init__(self, db: Session):
        self.db = db

    async def check_room_availability(
        self, property_id: int, room_type_id: Optional[int] = None, 
        check_in_date: date = date.today(), check_out_date: date = date.today() + timedelta(days=1)
    ) -> List[Dict[str, Any]]:
        """Check available rooms for a given date range and room type."""
        # Get all rooms for the property, optionally filtered by room type
        query = select(Room).where(Room.property_id == property_id)
        if room_type_id:
            query = query.where(Room.room_type_id == room_type_id)
        all_rooms = (await self.db.execute(query)).scalars().all()

        available_rooms = []
        for room in all_rooms:
            # Check for overlapping reservations
            overlapping_reservations_query = select(RoomReservation).where(
                and_(
                    RoomReservation.room_id == room.room_id,
                    RoomReservation.reservation_status.in_(['confirmed', 'checked_in']),
                    or_(
                        and_(RoomReservation.check_in_date < check_out_date, RoomReservation.check_out_date > check_in_date),
                        and_(RoomReservation.check_in_date >= check_in_date, RoomReservation.check_in_date < check_out_date),
                        and_(RoomReservation.check_out_date > check_in_date, RoomReservation.check_out_date <= check_out_date)
                    )
                )
            )
            overlapping_reservations = (await self.db.execute(overlapping_reservations_query)).scalars().all()

            if not overlapping_reservations:
                available_rooms.append({
                    "room_id": room.room_id,
                    "room_number": room.room_number,
                    "room_type_id": room.room_type_id,
                    "status": room.room_status
                })
        return available_rooms

    async def check_service_availability(
        self, property_id: int, service_type: str, service_id: Optional[int] = None,
        booking_date: date = date.today(), start_time: Optional[time] = None, end_time: Optional[time] = None
    ) -> List[Dict[str, Any]]:
        """Check availability for a specific service (spa, conference, etc.)."""
        # Get all instances of the service for the property
        service_model = self._get_service_model(service_type)
        if not service_model:
            return []

        query = select(service_model).where(service_model.property_id == property_id)
        if service_id:
            query = query.where(service_model.service_id == service_id)
        all_services = (await self.db.execute(query)).scalars().all()

        available_instances = []
        for service_instance in all_services:
            # Check for overlapping bookings for this service instance
            overlapping_bookings_query = select(ServiceBooking).where(
                and_(
                    ServiceBooking.service_type == service_type,
                    ServiceBooking.service_id == service_instance.service_id, # Assuming service_id is consistent
                    ServiceBooking.booking_date == booking_date,
                    ServiceBooking.status.in_(['confirmed']),
                    or_(
                        and_(ServiceBooking.start_time < end_time, ServiceBooking.end_time > start_time),
                        and_(ServiceBooking.start_time >= start_time, ServiceBooking.start_time < end_time),
                        and_(ServiceBooking.end_time > start_time, ServiceBooking.end_time <= end_time)
                    )
                )
            )
            overlapping_bookings = (await self.db.execute(overlapping_bookings_query)).scalars().all()

            if not overlapping_bookings:
                available_instances.append({
                    "service_id": service_instance.service_id,
                    "name": service_instance.name, # Assuming 'name' attribute exists
                    "status": "available"
                })
        return available_instances

    async def create_room_reservation(
        self, property_id: int, customer_id: UUID, room_id: int, room_type_id: int,
        check_in_date: date, check_out_date: date, number_of_guests: int, adults: int, children: int,
        base_rate: Decimal, total_amount: Decimal, payment_status: str = 'pending',
        special_requests: Optional[str] = None
    ) -> RoomReservation:
        """Create a new room reservation."""
        reservation = RoomReservation(
            customer_id=customer_id,
            property_id=property_id,
            room_id=room_id,
            room_type_id=room_type_id,
            check_in_date=check_in_date,
            check_out_date=check_out_date,
            number_of_guests=number_of_guests,
            adults=adults,
            children=children,
            total_nights=(check_out_date - check_in_date).days,
            base_rate=base_rate,
            total_amount=total_amount,
            payment_status=payment_status,
            special_requests=special_requests
        )
        self.db.add(reservation)
        await self.db.commit()
        await self.db.refresh(reservation)
        return reservation

    async def create_service_booking(
        self, property_id: int, customer_id: UUID, service_type: str, service_id: int,
        booking_date: date, start_time: time, end_time: time, total_price: Decimal,
        special_requests: Optional[str] = None
    ) -> ServiceBooking:
        """Create a new service booking."""
        booking = ServiceBooking(
            customer_id=customer_id,
            property_id=property_id,
            service_type=service_type,
            service_id=service_id,
            booking_date=booking_date,
            start_time=start_time,
            end_time=end_time,
            total_price=total_price,
            special_requests=special_requests
        )
        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)
        return booking

    async def get_daily_schedule(
        self, property_id: int, target_date: date = date.today()
    ) -> Dict[str, Any]:
        """Get a combined daily schedule of room reservations and service bookings."""
        room_reservations_query = select(RoomReservation).where(
            and_(
                RoomReservation.property_id == property_id,
                RoomReservation.check_in_date <= target_date,
                RoomReservation.check_out_date > target_date
            )
        )
        room_reservations = (await self.db.execute(room_reservations_query)).scalars().all()

        service_bookings_query = select(ServiceBooking).where(
            and_(
                ServiceBooking.property_id == property_id,
                ServiceBooking.booking_date == target_date
            )
        )
        service_bookings = (await self.db.execute(service_bookings_query)).scalars().all()

        schedule = {
            "date": target_date.isoformat(),
            "room_occupancy": len(room_reservations),
            "room_reservations": [{
                "reservation_id": str(r.reservation_id),
                "room_id": r.room_id,
                "check_in": r.check_in_date.isoformat(),
                "check_out": r.check_out_date.isoformat()
            } for r in room_reservations],
            "service_bookings": [{
                "booking_id": str(b.booking_id),
                "service_type": b.service_type,
                "service_id": b.service_id,
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat()
            } for b in service_bookings]
        }
        return schedule

    async def update_room_reservation_status(
        self, reservation_id: UUID, new_status: str
    ) -> Optional[RoomReservation]:
        """Update the status of a room reservation."""
        reservation = (await self.db.execute(select(RoomReservation).where(RoomReservation.reservation_id == reservation_id))).scalar_one_or_none()
        if reservation:
            reservation.reservation_status = new_status
            reservation.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(reservation)
        return reservation

    async def update_service_booking_status(
        self, booking_id: UUID, new_status: str
    ) -> Optional[ServiceBooking]:
        """Update the status of a service booking."""
        booking = (await self.db.execute(select(ServiceBooking).where(ServiceBooking.booking_id == booking_id))).scalar_one_or_none()
        if booking:
            booking.status = new_status
            booking.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(booking)
        return booking

    def _get_service_model(self, service_type: str) -> Optional[Base]:
        """Helper to get the SQLAlchemy model class based on service_type."""
        if service_type == 'spa':
            return SpaService
        elif service_type == 'conference':
            return ConferenceRoom
        elif service_type == 'transportation':
            return TransportationService
        elif service_type == 'recreation':
            return RecreationService
        elif service_type == 'specialized':
            return SpecializedService
        return None
