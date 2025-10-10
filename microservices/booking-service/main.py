"""
Buffr Host Booking Service
Manages room reservations, service bookings, and availability.
"""
import logging
import os
from datetime import datetime, date
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, Numeric, Date, Time
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/buffrhost_booking")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Database Models
class RoomReservation(Base):
    __tablename__ = "room_reservations"
    
    reservation_id = Column(String, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    customer_id = Column(String, nullable=False)
    room_id = Column(Integer, nullable=False)
    booking_reference = Column(String, unique=True, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, checked_in, checked_out, cancelled, no_show
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    adults = Column(Integer, nullable=False)
    children = Column(Integer, default=0)
    total_nights = Column(Integer, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="NAD")
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=False)
    special_requests = Column(Text)
    payment_status = Column(String, default="pending")  # pending, paid, refunded
    payment_method = Column(String)
    payment_reference = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = Column(DateTime)
    cancelled_at = Column(DateTime)

class ServiceBooking(Base):
    __tablename__ = "service_bookings"
    
    booking_id = Column(String, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    customer_id = Column(String, nullable=False)
    service_type = Column(String, nullable=False)  # spa, conference, transportation, recreation
    service_id = Column(Integer, nullable=False)
    booking_reference = Column(String, unique=True, nullable=False)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled, no_show
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default="NAD")
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    special_requests = Column(Text)
    payment_status = Column(String, default="pending")
    payment_method = Column(String)
    payment_reference = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = Column(DateTime)
    cancelled_at = Column(DateTime)

class RoomAvailability(Base):
    __tablename__ = "room_availability"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    room_id = Column(Integer, nullable=False)
    date = Column(Date, nullable=False)
    is_available = Column(Boolean, default=True)
    price_override = Column(Numeric(10, 2))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class RoomReservationCreate(BaseModel):
    room_id: int
    check_in_date: date
    check_out_date: date
    adults: int = Field(..., ge=1)
    children: int = Field(0, ge=0)
    guest_name: str
    guest_email: str
    guest_phone: str
    special_requests: Optional[str] = None

class RoomReservationResponse(BaseModel):
    reservation_id: str
    property_id: int
    customer_id: str
    room_id: int
    booking_reference: str
    status: str
    check_in_date: date
    check_out_date: date
    adults: int
    children: int
    total_nights: int
    total_amount: float
    currency: str
    guest_name: str
    guest_email: str
    guest_phone: str
    special_requests: Optional[str]
    payment_status: str
    payment_method: Optional[str]
    payment_reference: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    confirmed_at: Optional[datetime]
    cancelled_at: Optional[datetime]

class ServiceBookingCreate(BaseModel):
    service_type: str
    service_id: int
    booking_date: date
    start_time: str  # HH:MM format
    end_time: str    # HH:MM format
    customer_name: str
    customer_email: str
    customer_phone: str
    special_requests: Optional[str] = None

class ServiceBookingResponse(BaseModel):
    booking_id: str
    property_id: int
    customer_id: str
    service_type: str
    service_id: int
    booking_reference: str
    status: str
    booking_date: date
    start_time: str
    end_time: str
    duration_minutes: int
    total_amount: float
    currency: str
    customer_name: str
    customer_email: str
    customer_phone: str
    special_requests: Optional[str]
    payment_status: str
    payment_method: Optional[str]
    payment_reference: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    confirmed_at: Optional[datetime]
    cancelled_at: Optional[datetime]

class AvailabilityCheck(BaseModel):
    property_id: int
    room_type_id: Optional[int] = None
    check_in_date: date
    check_out_date: date
    adults: int = 1
    children: int = 0

class AvailabilityResponse(BaseModel):
    available_rooms: List[Dict]
    total_available: int
    price_range: Dict[str, float]

# Utility functions
async def get_db():
    """Get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def generate_booking_reference() -> str:
    """Generate a unique booking reference."""
    import uuid
    return f"BUF{str(uuid.uuid4())[:8].upper()}"

# Create FastAPI application
app = FastAPI(
    title="Buffr Host Booking Service",
    description="Room and service booking management service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
@app.on_event("startup")
async def startup_event():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "service": "booking-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Room reservation endpoints
@app.post("/properties/{property_id}/reservations", response_model=RoomReservationResponse)
async def create_room_reservation(
    property_id: int,
    reservation_data: RoomReservationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new room reservation."""
    import uuid
    from datetime import timedelta
    
    # Calculate total nights
    total_nights = (reservation_data.check_out_date - reservation_data.check_in_date).days
    
    if total_nights <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out date must be after check-in date"
        )
    
    # Generate booking reference
    booking_reference = generate_booking_reference()
    
    # Calculate total amount (simplified - in real implementation, get from room rates)
    base_rate = 500.0  # NAD per night
    total_amount = base_rate * total_nights
    
    reservation = RoomReservation(
        reservation_id=str(uuid.uuid4()),
        property_id=property_id,
        customer_id=str(uuid.uuid4()),  # In real implementation, get from auth
        room_id=reservation_data.room_id,
        booking_reference=booking_reference,
        check_in_date=reservation_data.check_in_date,
        check_out_date=reservation_data.check_out_date,
        adults=reservation_data.adults,
        children=reservation_data.children,
        total_nights=total_nights,
        total_amount=total_amount,
        guest_name=reservation_data.guest_name,
        guest_email=reservation_data.guest_email,
        guest_phone=reservation_data.guest_phone,
        special_requests=reservation_data.special_requests
    )
    
    db.add(reservation)
    await db.commit()
    await db.refresh(reservation)
    
    return RoomReservationResponse(
        reservation_id=reservation.reservation_id,
        property_id=reservation.property_id,
        customer_id=reservation.customer_id,
        room_id=reservation.room_id,
        booking_reference=reservation.booking_reference,
        status=reservation.status,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        adults=reservation.adults,
        children=reservation.children,
        total_nights=reservation.total_nights,
        total_amount=float(reservation.total_amount),
        currency=reservation.currency,
        guest_name=reservation.guest_name,
        guest_email=reservation.guest_email,
        guest_phone=reservation.guest_phone,
        special_requests=reservation.special_requests,
        payment_status=reservation.payment_status,
        payment_method=reservation.payment_method,
        payment_reference=reservation.payment_reference,
        created_at=reservation.created_at,
        updated_at=reservation.updated_at,
        confirmed_at=reservation.confirmed_at,
        cancelled_at=reservation.cancelled_at
    )

@app.get("/properties/{property_id}/reservations", response_model=List[RoomReservationResponse])
async def get_room_reservations(
    property_id: int,
    status: Optional[str] = None,
    check_in_date: Optional[date] = None,
    check_out_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get room reservations for a property."""
    from sqlalchemy import select
    
    query = select(RoomReservation).where(RoomReservation.property_id == property_id)
    
    if status:
        query = query.where(RoomReservation.status == status)
    
    if check_in_date:
        query = query.where(RoomReservation.check_in_date >= check_in_date)
    
    if check_out_date:
        query = query.where(RoomReservation.check_out_date <= check_out_date)
    
    result = await db.execute(query.order_by(RoomReservation.created_at.desc()))
    reservations = result.scalars().all()
    
    return [
        RoomReservationResponse(
            reservation_id=r.reservation_id,
            property_id=r.property_id,
            customer_id=r.customer_id,
            room_id=r.room_id,
            booking_reference=r.booking_reference,
            status=r.status,
            check_in_date=r.check_in_date,
            check_out_date=r.check_out_date,
            adults=r.adults,
            children=r.children,
            total_nights=r.total_nights,
            total_amount=float(r.total_amount),
            currency=r.currency,
            guest_name=r.guest_name,
            guest_email=r.guest_email,
            guest_phone=r.guest_phone,
            special_requests=r.special_requests,
            payment_status=r.payment_status,
            payment_method=r.payment_method,
            payment_reference=r.payment_reference,
            created_at=r.created_at,
            updated_at=r.updated_at,
            confirmed_at=r.confirmed_at,
            cancelled_at=r.cancelled_at
        )
        for r in reservations
    ]

@app.get("/reservations/{reservation_id}", response_model=RoomReservationResponse)
async def get_reservation(reservation_id: str, db: AsyncSession = Depends(get_db)):
    """Get a specific reservation."""
    from sqlalchemy import select
    
    result = await db.execute(
        select(RoomReservation).where(RoomReservation.reservation_id == reservation_id)
    )
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    return RoomReservationResponse(
        reservation_id=reservation.reservation_id,
        property_id=reservation.property_id,
        customer_id=reservation.customer_id,
        room_id=reservation.room_id,
        booking_reference=reservation.booking_reference,
        status=reservation.status,
        check_in_date=reservation.check_in_date,
        check_out_date=reservation.check_out_date,
        adults=reservation.adults,
        children=reservation.children,
        total_nights=reservation.total_nights,
        total_amount=float(reservation.total_amount),
        currency=reservation.currency,
        guest_name=reservation.guest_name,
        guest_email=reservation.guest_email,
        guest_phone=reservation.guest_phone,
        special_requests=reservation.special_requests,
        payment_status=reservation.payment_status,
        payment_method=reservation.payment_method,
        payment_reference=reservation.payment_reference,
        created_at=reservation.created_at,
        updated_at=reservation.updated_at,
        confirmed_at=reservation.confirmed_at,
        cancelled_at=reservation.cancelled_at
    )

@app.put("/reservations/{reservation_id}/confirm")
async def confirm_reservation(reservation_id: str, db: AsyncSession = Depends(get_db)):
    """Confirm a reservation."""
    from sqlalchemy import select
    
    result = await db.execute(
        select(RoomReservation).where(RoomReservation.reservation_id == reservation_id)
    )
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    if reservation.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation is not in pending status"
        )
    
    reservation.status = "confirmed"
    reservation.confirmed_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Reservation confirmed successfully"}

@app.put("/reservations/{reservation_id}/cancel")
async def cancel_reservation(reservation_id: str, db: AsyncSession = Depends(get_db)):
    """Cancel a reservation."""
    from sqlalchemy import select
    
    result = await db.execute(
        select(RoomReservation).where(RoomReservation.reservation_id == reservation_id)
    )
    reservation = result.scalar_one_or_none()
    
    if not reservation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reservation not found"
        )
    
    if reservation.status in ["cancelled", "completed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reservation cannot be cancelled"
        )
    
    reservation.status = "cancelled"
    reservation.cancelled_at = datetime.utcnow()
    await db.commit()
    
    return {"message": "Reservation cancelled successfully"}

# Service booking endpoints
@app.post("/properties/{property_id}/service-bookings", response_model=ServiceBookingResponse)
async def create_service_booking(
    property_id: int,
    booking_data: ServiceBookingCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new service booking."""
    import uuid
    from datetime import datetime as dt
    
    # Parse time strings
    start_time = dt.strptime(booking_data.start_time, "%H:%M").time()
    end_time = dt.strptime(booking_data.end_time, "%H:%M").time()
    
    # Calculate duration
    start_datetime = dt.combine(booking_data.booking_date, start_time)
    end_datetime = dt.combine(booking_data.booking_date, end_time)
    duration_minutes = int((end_datetime - start_datetime).total_seconds() / 60)
    
    if duration_minutes <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time must be after start time"
        )
    
    # Generate booking reference
    booking_reference = generate_booking_reference()
    
    # Calculate total amount (simplified)
    base_rate = 200.0  # NAD per hour
    total_amount = (duration_minutes / 60) * base_rate
    
    booking = ServiceBooking(
        booking_id=str(uuid.uuid4()),
        property_id=property_id,
        customer_id=str(uuid.uuid4()),  # In real implementation, get from auth
        service_type=booking_data.service_type,
        service_id=booking_data.service_id,
        booking_reference=booking_reference,
        booking_date=booking_data.booking_date,
        start_time=start_time,
        end_time=end_time,
        duration_minutes=duration_minutes,
        total_amount=total_amount,
        customer_name=booking_data.customer_name,
        customer_email=booking_data.customer_email,
        customer_phone=booking_data.customer_phone,
        special_requests=booking_data.special_requests
    )
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    return ServiceBookingResponse(
        booking_id=booking.booking_id,
        property_id=booking.property_id,
        customer_id=booking.customer_id,
        service_type=booking.service_type,
        service_id=booking.service_id,
        booking_reference=booking.booking_reference,
        status=booking.status,
        booking_date=booking.booking_date,
        start_time=booking.start_time.strftime("%H:%M"),
        end_time=booking.end_time.strftime("%H:%M"),
        duration_minutes=booking.duration_minutes,
        total_amount=float(booking.total_amount),
        currency=booking.currency,
        customer_name=booking.customer_name,
        customer_email=booking.customer_email,
        customer_phone=booking.customer_phone,
        special_requests=booking.special_requests,
        payment_status=booking.payment_status,
        payment_method=booking.payment_method,
        payment_reference=booking.payment_reference,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        confirmed_at=booking.confirmed_at,
        cancelled_at=booking.cancelled_at
    )

@app.get("/properties/{property_id}/service-bookings", response_model=List[ServiceBookingResponse])
async def get_service_bookings(
    property_id: int,
    service_type: Optional[str] = None,
    status: Optional[str] = None,
    booking_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get service bookings for a property."""
    from sqlalchemy import select
    
    query = select(ServiceBooking).where(ServiceBooking.property_id == property_id)
    
    if service_type:
        query = query.where(ServiceBooking.service_type == service_type)
    
    if status:
        query = query.where(ServiceBooking.status == status)
    
    if booking_date:
        query = query.where(ServiceBooking.booking_date == booking_date)
    
    result = await db.execute(query.order_by(ServiceBooking.created_at.desc()))
    bookings = result.scalars().all()
    
    return [
        ServiceBookingResponse(
            booking_id=b.booking_id,
            property_id=b.property_id,
            customer_id=b.customer_id,
            service_type=b.service_type,
            service_id=b.service_id,
            booking_reference=b.booking_reference,
            status=b.status,
            booking_date=b.booking_date,
            start_time=b.start_time.strftime("%H:%M"),
            end_time=b.end_time.strftime("%H:%M"),
            duration_minutes=b.duration_minutes,
            total_amount=float(b.total_amount),
            currency=b.currency,
            customer_name=b.customer_name,
            customer_email=b.customer_email,
            customer_phone=b.customer_phone,
            special_requests=b.special_requests,
            payment_status=b.payment_status,
            payment_method=b.payment_method,
            payment_reference=b.payment_reference,
            created_at=b.created_at,
            updated_at=b.updated_at,
            confirmed_at=b.confirmed_at,
            cancelled_at=b.cancelled_at
        )
        for b in bookings
    ]

# Availability check endpoint
@app.post("/availability/check", response_model=AvailabilityResponse)
async def check_availability(
    availability_data: AvailabilityCheck,
    db: AsyncSession = Depends(get_db)
):
    """Check room availability for given dates."""
    # This is a simplified implementation
    # In a real system, you would check against actual room availability and rates
    
    available_rooms = [
        {
            "room_id": 1,
            "room_number": "101",
            "room_type": "Standard",
            "price_per_night": 500.0,
            "amenities": ["WiFi", "TV", "Air Conditioning"]
        },
        {
            "room_id": 2,
            "room_number": "102",
            "room_type": "Deluxe",
            "price_per_night": 750.0,
            "amenities": ["WiFi", "TV", "Air Conditioning", "Mini Bar"]
        }
    ]
    
    prices = [room["price_per_night"] for room in available_rooms]
    
    return AvailabilityResponse(
        available_rooms=available_rooms,
        total_available=len(available_rooms),
        price_range={
            "min": min(prices),
            "max": max(prices)
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8004,
        reload=os.getenv("ENVIRONMENT") == "development"
    )
