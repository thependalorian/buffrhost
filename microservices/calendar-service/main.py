"""
Buffr Host Calendar Service - Microservice
Handles scheduling, bookings, events, and resource management for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_calendar")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service configuration
SERVICE_NAME = "calendar-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8010))

# Enums
class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"

class BookingType(str, Enum):
    RESERVATION = "reservation"
    APPOINTMENT = "appointment"
    EVENT = "event"
    MEETING = "meeting"
    SERVICE = "service"

class ResourceType(str, Enum):
    TABLE = "table"
    ROOM = "room"
    EQUIPMENT = "equipment"
    VEHICLE = "vehicle"
    FACILITY = "facility"

class EventType(str, Enum):
    PRIVATE = "private"
    PUBLIC = "public"
    CORPORATE = "corporate"
    SOCIAL = "social"
    SPECIAL = "special"

# Database Models
class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Resource Information
    resource_type = Column(String, nullable=False)
    capacity = Column(Integer, default=1)
    location = Column(String, nullable=True)
    
    # Availability
    is_available = Column(Boolean, default=True)
    booking_advance_days = Column(Integer, default=30)
    minimum_booking_duration = Column(Integer, default=60)  # minutes
    maximum_booking_duration = Column(Integer, default=480)  # minutes
    
    # Pricing
    base_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Features and Amenities
    features = Column(JSON, default=list)
    amenities = Column(JSON, default=list)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    resource_id = Column(String, ForeignKey("resources.id"), nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Booking Information
    booking_reference = Column(String, unique=True, nullable=False, index=True)
    booking_type = Column(String, nullable=False)
    status = Column(String, default=BookingStatus.PENDING)
    
    # Timing Information
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=False)
    
    # Customer Information
    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    
    # Booking Details
    party_size = Column(Integer, default=1)
    special_requests = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Pricing
    base_price = Column(Numeric(10, 2), nullable=True)
    additional_charges = Column(Numeric(10, 2), default=0.0)
    total_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Staff Information
    assigned_staff = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    
    # Confirmation Information
    confirmation_sent = Column(Boolean, default=False)
    reminder_sent = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Event Information
    event_type = Column(String, nullable=False)
    status = Column(String, default="active")
    
    # Timing Information
    start_date = Column(DateTime, nullable=False, index=True)
    end_date = Column(DateTime, nullable=False, index=True)
    duration_hours = Column(Numeric(5, 2), nullable=True)
    
    # Event Details
    capacity = Column(Integer, nullable=True)
    current_attendees = Column(Integer, default=0)
    location = Column(String, nullable=True)
    
    # Pricing
    ticket_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Event Features
    features = Column(JSON, default=list)
    requirements = Column(JSON, default=list)
    
    # Organizer Information
    organizer_name = Column(String, nullable=True)
    organizer_email = Column(String, nullable=True)
    organizer_phone = Column(String, nullable=True)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class EventBooking(Base):
    __tablename__ = "event_bookings"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, ForeignKey("events.id"), nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Booking Information
    booking_reference = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, default=BookingStatus.PENDING)
    
    # Customer Information
    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    
    # Booking Details
    ticket_quantity = Column(Integer, default=1)
    total_price = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Special Requirements
    special_requests = Column(Text, nullable=True)
    dietary_requirements = Column(JSON, default=list)
    
    # Timestamps
    booked_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    resource_id = Column(String, ForeignKey("resources.id"), nullable=True, index=True)
    staff_id = Column(String, nullable=True, index=True)
    
    # Schedule Information
    schedule_type = Column(String, nullable=False)  # resource, staff, general
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Timing Information
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    # Recurrence
    is_recurring = Column(Boolean, default=False)
    recurrence_pattern = Column(JSON, default=dict)  # daily, weekly, monthly, etc.
    
    # Status
    status = Column(String, default="active")
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Availability(Base):
    __tablename__ = "availability"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    resource_id = Column(String, ForeignKey("resources.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Availability Information
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(String, nullable=False)  # HH:MM format
    end_time = Column(String, nullable=False)  # HH:MM format
    
    # Status
    is_available = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class ResourceCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    resource_type: ResourceType
    capacity: int = 1
    location: Optional[str] = None
    booking_advance_days: int = 30
    minimum_booking_duration: int = 60
    maximum_booking_duration: int = 480
    base_price: Optional[float] = None
    currency: str = "NAD"
    features: Optional[List[str]] = []
    amenities: Optional[List[str]] = []
    settings: Optional[Dict[str, Any]] = {}

class BookingCreate(BaseModel):
    property_id: str
    resource_id: str
    customer_id: Optional[str] = None
    booking_type: BookingType
    start_time: datetime
    end_time: datetime
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    party_size: int = 1
    special_requests: Optional[str] = None
    notes: Optional[str] = None
    base_price: Optional[float] = None
    additional_charges: float = 0.0
    currency: str = "NAD"
    assigned_staff: Optional[str] = None

class EventCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    event_type: EventType
    start_date: datetime
    end_date: datetime
    capacity: Optional[int] = None
    location: Optional[str] = None
    ticket_price: Optional[float] = None
    currency: str = "NAD"
    features: Optional[List[str]] = []
    requirements: Optional[List[str]] = []
    organizer_name: Optional[str] = None
    organizer_email: Optional[str] = None
    organizer_phone: Optional[str] = None
    settings: Optional[Dict[str, Any]] = {}

class EventBookingCreate(BaseModel):
    event_id: str
    customer_id: Optional[str] = None
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    ticket_quantity: int = 1
    special_requests: Optional[str] = None
    dietary_requirements: Optional[List[str]] = []

class BookingResponse(BaseModel):
    id: str
    property_id: str
    resource_id: str
    customer_id: Optional[str]
    booking_reference: str
    booking_type: str
    status: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int
    customer_name: Optional[str]
    customer_email: Optional[str]
    customer_phone: Optional[str]
    party_size: int
    special_requests: Optional[str]
    notes: Optional[str]
    base_price: Optional[float]
    additional_charges: float
    total_price: Optional[float]
    currency: str
    assigned_staff: Optional[str]
    created_by: Optional[str]
    confirmation_sent: bool
    reminder_sent: bool
    created_at: datetime
    updated_at: datetime

class CalendarMetrics(BaseModel):
    total_resources: int
    available_resources: int
    total_bookings: int
    bookings_today: int
    bookings_this_week: int
    bookings_this_month: int
    bookings_by_status: Dict[str, int]
    bookings_by_type: Dict[str, int]
    total_events: int
    upcoming_events: int
    total_event_bookings: int
    average_booking_duration: float
    occupancy_rate: float

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for calendar service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email"), "role": payload.get("role")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Utility functions
def generate_booking_reference() -> str:
    """Generate unique booking reference"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"BK-{timestamp}-{random_suffix}"

def calculate_duration_minutes(start_time: datetime, end_time: datetime) -> int:
    """Calculate duration in minutes between two datetime objects"""
    duration = end_time - start_time
    return int(duration.total_seconds() / 60)

def check_resource_availability(resource_id: str, start_time: datetime, end_time: datetime, db: Session, exclude_booking_id: Optional[str] = None) -> bool:
    """Check if resource is available for the given time slot"""
    # Check for overlapping bookings
    query = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
        Booking.start_time < end_time,
        Booking.end_time > start_time
    )
    
    if exclude_booking_id:
        query = query.filter(Booking.id != exclude_booking_id)
    
    conflicting_bookings = query.count()
    return conflicting_bookings == 0

def check_event_capacity(event_id: str, additional_tickets: int, db: Session) -> bool:
    """Check if event has capacity for additional tickets"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event or not event.capacity:
        return True  # No capacity limit
    
    current_bookings = db.query(EventBooking).filter(
        EventBooking.event_id == event_id,
        EventBooking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING])
    ).count()
    
    return (current_bookings + additional_tickets) <= event.capacity

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="Scheduling, bookings, and resource management microservice",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "Scheduling, bookings, and resource management",
        "endpoints": {
            "health": "/health",
            "resources": "/api/calendar/resources",
            "bookings": "/api/calendar/bookings",
            "events": "/api/calendar/events",
            "schedules": "/api/calendar/schedules",
            "availability": "/api/calendar/availability",
            "metrics": "/api/calendar/metrics"
        }
    }

@app.post("/api/calendar/bookings", response_model=BookingResponse)
async def create_booking(
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new booking"""
    # Check resource availability
    if not check_resource_availability(
        booking_data.resource_id,
        booking_data.start_time,
        booking_data.end_time,
        db
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resource is not available for the selected time slot"
        )
    
    # Generate booking reference
    booking_reference = generate_booking_reference()
    
    # Calculate duration
    duration_minutes = calculate_duration_minutes(booking_data.start_time, booking_data.end_time)
    
    # Calculate total price
    total_price = None
    if booking_data.base_price:
        total_price = booking_data.base_price + booking_data.additional_charges
    
    # Create booking
    new_booking = Booking(
        property_id=booking_data.property_id,
        resource_id=booking_data.resource_id,
        customer_id=booking_data.customer_id,
        booking_reference=booking_reference,
        booking_type=booking_data.booking_type,
        start_time=booking_data.start_time,
        end_time=booking_data.end_time,
        duration_minutes=duration_minutes,
        customer_name=booking_data.customer_name,
        customer_email=booking_data.customer_email,
        customer_phone=booking_data.customer_phone,
        party_size=booking_data.party_size,
        special_requests=booking_data.special_requests,
        notes=booking_data.notes,
        base_price=booking_data.base_price,
        additional_charges=booking_data.additional_charges,
        total_price=total_price,
        currency=booking_data.currency,
        assigned_staff=booking_data.assigned_staff,
        created_by=current_user["user_id"]
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    logger.info(f"✅ Booking created: {booking_reference}")
    
    return BookingResponse(
        id=new_booking.id,
        property_id=new_booking.property_id,
        resource_id=new_booking.resource_id,
        customer_id=new_booking.customer_id,
        booking_reference=new_booking.booking_reference,
        booking_type=new_booking.booking_type,
        status=new_booking.status,
        start_time=new_booking.start_time,
        end_time=new_booking.end_time,
        duration_minutes=new_booking.duration_minutes,
        customer_name=new_booking.customer_name,
        customer_email=new_booking.customer_email,
        customer_phone=new_booking.customer_phone,
        party_size=new_booking.party_size,
        special_requests=new_booking.special_requests,
        notes=new_booking.notes,
        base_price=float(new_booking.base_price) if new_booking.base_price else None,
        additional_charges=float(new_booking.additional_charges),
        total_price=float(new_booking.total_price) if new_booking.total_price else None,
        currency=new_booking.currency,
        assigned_staff=new_booking.assigned_staff,
        created_by=new_booking.created_by,
        confirmation_sent=new_booking.confirmation_sent,
        reminder_sent=new_booking.reminder_sent,
        created_at=new_booking.created_at,
        updated_at=new_booking.updated_at
    )

@app.get("/api/calendar/bookings", response_model=List[BookingResponse])
async def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    resource_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[BookingStatus] = None,
    booking_type: Optional[BookingType] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get bookings with filtering and search"""
    query = db.query(Booking)
    
    if property_id:
        query = query.filter(Booking.property_id == property_id)
    if resource_id:
        query = query.filter(Booking.resource_id == resource_id)
    if customer_id:
        query = query.filter(Booking.customer_id == customer_id)
    if status:
        query = query.filter(Booking.status == status)
    if booking_type:
        query = query.filter(Booking.booking_type == booking_type)
    if date_from:
        query = query.filter(Booking.start_time >= date_from)
    if date_to:
        query = query.filter(Booking.start_time <= date_to)
    if search:
        query = query.filter(
            (Booking.booking_reference.ilike(f"%{search}%")) |
            (Booking.customer_name.ilike(f"%{search}%")) |
            (Booking.customer_email.ilike(f"%{search}%"))
        )
    
    bookings = query.order_by(Booking.start_time.desc()).offset(skip).limit(limit).all()
    
    return [
        BookingResponse(
            id=booking.id,
            property_id=booking.property_id,
            resource_id=booking.resource_id,
            customer_id=booking.customer_id,
            booking_reference=booking.booking_reference,
            booking_type=booking.booking_type,
            status=booking.status,
            start_time=booking.start_time,
            end_time=booking.end_time,
            duration_minutes=booking.duration_minutes,
            customer_name=booking.customer_name,
            customer_email=booking.customer_email,
            customer_phone=booking.customer_phone,
            party_size=booking.party_size,
            special_requests=booking.special_requests,
            notes=booking.notes,
            base_price=float(booking.base_price) if booking.base_price else None,
            additional_charges=float(booking.additional_charges),
            total_price=float(booking.total_price) if booking.total_price else None,
            currency=booking.currency,
            assigned_staff=booking.assigned_staff,
            created_by=booking.created_by,
            confirmation_sent=booking.confirmation_sent,
            reminder_sent=booking.reminder_sent,
            created_at=booking.created_at,
            updated_at=booking.updated_at
        )
        for booking in bookings
    ]

@app.get("/api/calendar/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific booking by ID"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return BookingResponse(
        id=booking.id,
        property_id=booking.property_id,
        resource_id=booking.resource_id,
        customer_id=booking.customer_id,
        booking_reference=booking.booking_reference,
        booking_type=booking.booking_type,
        status=booking.status,
        start_time=booking.start_time,
        end_time=booking.end_time,
        duration_minutes=booking.duration_minutes,
        customer_name=booking.customer_name,
        customer_email=booking.customer_email,
        customer_phone=booking.customer_phone,
        party_size=booking.party_size,
        special_requests=booking.special_requests,
        notes=booking.notes,
        base_price=float(booking.base_price) if booking.base_price else None,
        additional_charges=float(booking.additional_charges),
        total_price=float(booking.total_price) if booking.total_price else None,
        currency=booking.currency,
        assigned_staff=booking.assigned_staff,
        created_by=booking.created_by,
        confirmation_sent=booking.confirmation_sent,
        reminder_sent=booking.reminder_sent,
        created_at=booking.created_at,
        updated_at=booking.updated_at
    )

@app.post("/api/calendar/events")
async def create_event(
    event_data: EventCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new event"""
    # Calculate duration
    duration_hours = (event_data.end_date - event_data.start_date).total_seconds() / 3600
    
    # Create event
    new_event = Event(
        property_id=event_data.property_id,
        name=event_data.name,
        description=event_data.description,
        event_type=event_data.event_type,
        start_date=event_data.start_date,
        end_date=event_data.end_date,
        duration_hours=duration_hours,
        capacity=event_data.capacity,
        location=event_data.location,
        ticket_price=event_data.ticket_price,
        currency=event_data.currency,
        features=event_data.features,
        requirements=event_data.requirements,
        organizer_name=event_data.organizer_name,
        organizer_email=event_data.organizer_email,
        organizer_phone=event_data.organizer_phone,
        settings=event_data.settings
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    logger.info(f"✅ Event created: {new_event.name}")
    
    return {
        "message": "Event created successfully",
        "event_id": new_event.id,
        "name": new_event.name,
        "start_date": new_event.start_date,
        "end_date": new_event.end_date
    }

@app.post("/api/calendar/events/bookings")
async def book_event(
    booking_data: EventBookingCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Book tickets for an event"""
    # Check event capacity
    if not check_event_capacity(booking_data.event_id, booking_data.ticket_quantity, db):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event does not have enough capacity for the requested tickets"
        )
    
    # Get event details
    event = db.query(Event).filter(Event.id == booking_data.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Generate booking reference
    booking_reference = generate_booking_reference()
    
    # Calculate total price
    total_price = None
    if event.ticket_price:
        total_price = float(event.ticket_price) * booking_data.ticket_quantity
    
    # Create event booking
    new_booking = EventBooking(
        event_id=booking_data.event_id,
        customer_id=booking_data.customer_id,
        booking_reference=booking_reference,
        customer_name=booking_data.customer_name,
        customer_email=booking_data.customer_email,
        customer_phone=booking_data.customer_phone,
        ticket_quantity=booking_data.ticket_quantity,
        total_price=total_price,
        currency=event.currency,
        special_requests=booking_data.special_requests,
        dietary_requirements=booking_data.dietary_requirements
    )
    
    db.add(new_booking)
    
    # Update event attendee count
    event.current_attendees += booking_data.ticket_quantity
    
    db.commit()
    db.refresh(new_booking)
    
    logger.info(f"✅ Event booking created: {booking_reference}")
    
    return {
        "message": "Event booking created successfully",
        "booking_id": new_booking.id,
        "booking_reference": booking_reference,
        "event_name": event.name,
        "ticket_quantity": booking_data.ticket_quantity,
        "total_price": total_price
    }

@app.get("/api/calendar/metrics", response_model=CalendarMetrics)
async def get_calendar_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get calendar metrics"""
    # Get resource counts
    resource_query = db.query(Resource)
    if property_id:
        resource_query = resource_query.filter(Resource.property_id == property_id)
    
    total_resources = resource_query.count()
    available_resources = resource_query.filter(Resource.is_available == True).count()
    
    # Get booking counts
    booking_query = db.query(Booking)
    if property_id:
        booking_query = booking_query.filter(Booking.property_id == property_id)
    
    total_bookings = booking_query.count()
    
    # Get bookings by time period
    today = datetime.utcnow().date()
    this_week = today - timedelta(days=today.weekday())
    this_month = today.replace(day=1)
    
    bookings_today = booking_query.filter(db.func.date(Booking.start_time) == today).count()
    bookings_this_week = booking_query.filter(Booking.start_time >= this_week).count()
    bookings_this_month = booking_query.filter(Booking.start_time >= this_month).count()
    
    # Get bookings by status
    bookings_by_status = {}
    for status in BookingStatus:
        count = booking_query.filter(Booking.status == status).count()
        bookings_by_status[status] = count
    
    # Get bookings by type
    bookings_by_type = {}
    for booking_type in BookingType:
        count = booking_query.filter(Booking.booking_type == booking_type).count()
        bookings_by_type[booking_type] = count
    
    # Get event counts
    event_query = db.query(Event)
    if property_id:
        event_query = event_query.filter(Event.property_id == property_id)
    
    total_events = event_query.count()
    upcoming_events = event_query.filter(Event.start_date > datetime.utcnow()).count()
    
    # Get event booking counts
    event_booking_query = db.query(EventBooking)
    if property_id:
        event_booking_query = event_booking_query.join(Event).filter(Event.property_id == property_id)
    
    total_event_bookings = event_booking_query.count()
    
    # Calculate average booking duration
    bookings_with_duration = booking_query.filter(Booking.duration_minutes.isnot(None)).all()
    average_booking_duration = 0.0
    if bookings_with_duration:
        average_booking_duration = sum(booking.duration_minutes for booking in bookings_with_duration) / len(bookings_with_duration)
    
    # Calculate occupancy rate
    total_booking_hours = sum(booking.duration_minutes for booking in bookings_with_duration) / 60
    total_resource_hours = total_resources * 24 * 30  # Assuming 30 days
    occupancy_rate = 0.0
    if total_resource_hours > 0:
        occupancy_rate = (total_booking_hours / total_resource_hours) * 100
    
    return CalendarMetrics(
        total_resources=total_resources,
        available_resources=available_resources,
        total_bookings=total_bookings,
        bookings_today=bookings_today,
        bookings_this_week=bookings_this_week,
        bookings_this_month=bookings_this_month,
        bookings_by_status=bookings_by_status,
        bookings_by_type=bookings_by_type,
        total_events=total_events,
        upcoming_events=upcoming_events,
        total_event_bookings=total_event_bookings,
        average_booking_duration=average_booking_duration,
        occupancy_rate=occupancy_rate
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )