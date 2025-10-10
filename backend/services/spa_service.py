"""
Spa service for Buffr Host platform.
"""
from datetime import date
from typing import List, Optional

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.services import ServiceBooking, SpaService
from models.staff import StaffPosition, StaffUser
from schemas.spa import SpaAppointment as SpaAppointmentSchema
from schemas.spa import SpaAppointmentCreate
from schemas.spa import SpaService as SpaServiceSchema
from schemas.spa import SpaTherapist as SpaTherapistSchema


class SpaServiceClass:
    """Service for spa management."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_spa_services(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[SpaServiceSchema]:
        """Get spa services for a property."""
        query = (
            select(SpaService)
            .where(SpaService.property_id == property_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        services = result.scalars().all()
        return services

    async def get_spa_appointments(
        self,
        property_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[SpaAppointmentSchema]:
        """Get spa appointments for a property."""
        query = select(ServiceBooking).where(
            ServiceBooking.property_id == property_id,
            ServiceBooking.service_type == "spa",
        )

        if start_date:
            query = query.where(ServiceBooking.booking_date >= start_date)
        if end_date:
            query = query.where(ServiceBooking.booking_date <= end_date)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        bookings = result.scalars().all()
        return bookings

    async def get_spa_therapists(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[SpaTherapistSchema]:
        """Get spa therapists for a property."""
        query = (
            select(StaffUser)
            .join(StaffPosition)
            .where(
                StaffUser.property_id == property_id,
                StaffPosition.department_id == 1,  # Assuming department 1 is Spa
            )
            .offset(skip)
            .limit(limit)
        )

        result = await self.db.execute(query)
        therapists = result.scalars().all()

        return [
            SpaTherapistSchema(
                therapist_id=therapist.staff_id,
                name=f"{therapist.user.first_name} {therapist.user.last_name}",
                specialties=therapist.skills,
                experience_years=5,  # Placeholder
                rating=4.5,  # Placeholder
                is_available=therapist.is_active,
            )
            for therapist in therapists
        ]

    async def create_spa_appointment(
        self, property_id: int, appointment_data: SpaAppointmentCreate
    ) -> ServiceBooking:
        """Create a new spa appointment."""
        service_query = select(SpaService).where(
            and_(
                SpaService.service_id == appointment_data.service_id,
                SpaService.property_id == property_id,
            )
        )
        service_result = await self.db.execute(service_query)
        service = service_result.scalar_one_or_none()

        if not service:
            raise ValueError("Spa service not found")

        booking = ServiceBooking(
            property_id=property_id,
            customer_id=appointment_data.customer_id,
            service_id=appointment_data.service_id,
            service_type="spa",
            booking_date=appointment_data.appointment_time.date(),
            start_time=appointment_data.appointment_time.time(),
            end_time=(
                appointment_data.appointment_time
                + timedelta(minutes=service.duration_minutes)
            ).time(),
            total_price=service.base_price,
            special_requests=appointment_data.notes,
            status="confirmed",
        )

        self.db.add(booking)
        await self.db.commit()
        await self.db.refresh(booking)

        return booking

    async def update_booking_status(
        self, booking_id: int, property_id: int, status: str
    ) -> Optional[ServiceBooking]:
        """Update spa booking status."""
        query = select(ServiceBooking).where(
            and_(
                ServiceBooking.booking_id == booking_id,
                ServiceBooking.property_id == property_id,
                ServiceBooking.service_type == "spa",
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
