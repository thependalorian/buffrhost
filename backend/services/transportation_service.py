"""
Transportation service for Buffr Host platform.
"""
from datetime import date, datetime
from typing import List, Optional

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.services import ServiceBooking, TransportationService
from models.vehicle import Vehicle
from schemas.transportation import \
    TransportationBooking as TransportationBookingSchema
from schemas.transportation import TransportationBookingCreate
from schemas.transportation import \
    TransportationService as TransportationServiceSchema
from schemas.transportation import \
    TransportationVehicle as TransportationVehicleSchema


class TransportationServiceClass:
    """Service for transportation management."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_transportation_services(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[TransportationServiceSchema]:
        """Get transportation services for a property."""
        query = (
            select(TransportationService)
            .where(TransportationService.property_id == property_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        services = result.scalars().all()
        return services

    async def get_transportation_bookings(
        self,
        property_id: int,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TransportationBookingSchema]:
        """Get transportation bookings for a property."""
        query = select(ServiceBooking).where(
            ServiceBooking.property_id == property_id,
            ServiceBooking.service_type == "transportation",
        )

        if start_date:
            query = query.where(ServiceBooking.booking_date >= start_date)
        if end_date:
            query = query.where(ServiceBooking.booking_date <= end_date)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        bookings = result.scalars().all()
        return bookings

    async def get_vehicles(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[TransportationVehicleSchema]:
        """Get vehicles for a property."""
        query = (
            select(Vehicle)
            .where(Vehicle.property_id == property_id)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        vehicles = result.scalars().all()
        return vehicles

    async def create_transportation_booking(
        self, property_id: int, booking_data: TransportationBookingCreate
    ) -> ServiceBooking:
        """Create a new transportation booking."""
        service_query = select(TransportationService).where(
            and_(
                TransportationService.service_id == booking_data.service_id,
                TransportationService.property_id == property_id,
            )
        )
        service_result = await self.db.execute(service_query)
        service = service_result.scalar_one_or_none()

        if not service:
            raise ValueError("Transportation service not found")

        total_price = service.base_price

        booking = ServiceBooking(
            property_id=property_id,
            customer_id=booking_data.customer_id,
            service_id=booking_data.service_id,
            service_type="transportation",
            booking_date=booking_data.pickup_time.date(),
            start_time=booking_data.pickup_time.time(),
            end_time=booking_data.pickup_time.time(),  # Placeholder
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
        """Update transportation booking status."""
        query = select(ServiceBooking).where(
            and_(
                ServiceBooking.booking_id == booking_id,
                ServiceBooking.property_id == property_id,
                ServiceBooking.service_type == "transportation",
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
