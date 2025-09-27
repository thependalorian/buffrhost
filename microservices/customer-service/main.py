"""
Buffr Host Customer Service - Microservice
Handles customer relationship management, profiles, and preferences for Buffr Host platform
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
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_customers")
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
SERVICE_NAME = "customer-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8005))

# Enums
class CustomerType(str, Enum):
    INDIVIDUAL = "individual"
    BUSINESS = "business"
    CORPORATE = "corporate"

class CustomerStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    VIP = "vip"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class CommunicationPreference(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PHONE = "phone"
    PUSH = "push"
    NONE = "none"

# Database Models
class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=True, index=True)  # Link to auth service
    
    # Personal Information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True, index=True)
    phone = Column(String, nullable=True, index=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    
    # Address Information
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    country = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    
    # Customer Information
    customer_type = Column(String, default=CustomerType.INDIVIDUAL)
    status = Column(String, default=CustomerStatus.ACTIVE)
    customer_since = Column(DateTime, default=datetime.utcnow)
    last_visit = Column(DateTime, nullable=True)
    
    # Business Information (for business/corporate customers)
    company_name = Column(String, nullable=True)
    job_title = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    
    # Preferences and Settings
    preferences = Column(JSON, default=dict)
    communication_preferences = Column(JSON, default=dict)
    dietary_restrictions = Column(JSON, default=list)
    allergies = Column(JSON, default=list)
    
    # Loyalty Information
    loyalty_points = Column(Integer, default=0)
    loyalty_tier = Column(String, default="bronze")
    total_spent = Column(Float, default=0.0)
    visit_count = Column(Integer, default=0)
    
    # Notes and Tags
    notes = Column(Text, nullable=True)
    tags = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CustomerInteraction(Base):
    __tablename__ = "customer_interactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    interaction_type = Column(String, nullable=False)  # visit, call, email, complaint, feedback
    interaction_date = Column(DateTime, default=datetime.utcnow)
    
    # Interaction Details
    subject = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    outcome = Column(String, nullable=True)
    satisfaction_rating = Column(Integer, nullable=True)  # 1-5 stars
    
    # Staff Information
    staff_id = Column(String, nullable=True)
    staff_name = Column(String, nullable=True)
    
    # Follow-up Information
    follow_up_required = Column(Boolean, default=False)
    follow_up_date = Column(DateTime, nullable=True)
    follow_up_notes = Column(Text, nullable=True)
    
    # Additional Data
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class CustomerSegment(Base):
    __tablename__ = "customer_segments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Segment Criteria
    criteria = Column(JSON, nullable=False)  # Spending, frequency, demographics, etc.
    
    # Segment Information
    customer_count = Column(Integer, default=0)
    average_spending = Column(Float, default=0.0)
    average_frequency = Column(Float, default=0.0)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CustomerSegmentMember(Base):
    __tablename__ = "customer_segment_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    segment_id = Column(String, ForeignKey("customer_segments.id"), nullable=False, index=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False, index=True)
    added_at = Column(DateTime, default=datetime.utcnow)

class CustomerPreference(Base):
    __tablename__ = "customer_preferences"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False, index=True)
    preference_type = Column(String, nullable=False)  # dietary, seating, service, etc.
    preference_value = Column(String, nullable=False)
    preference_details = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class CustomerCreate(BaseModel):
    property_id: str
    user_id: Optional[str] = None
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Gender] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    customer_type: CustomerType = CustomerType.INDIVIDUAL
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    industry: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = {}
    communication_preferences: Optional[Dict[str, Any]] = {}
    dietary_restrictions: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    notes: Optional[str] = None
    tags: Optional[List[str]] = []

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[Gender] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    customer_type: Optional[CustomerType] = None
    status: Optional[CustomerStatus] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    industry: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None
    communication_preferences: Optional[Dict[str, Any]] = None
    dietary_restrictions: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None

class CustomerInteractionCreate(BaseModel):
    customer_id: str
    property_id: str
    interaction_type: str
    subject: Optional[str] = None
    description: Optional[str] = None
    outcome: Optional[str] = None
    satisfaction_rating: Optional[int] = None
    staff_id: Optional[str] = None
    staff_name: Optional[str] = None
    follow_up_required: bool = False
    follow_up_date: Optional[datetime] = None
    follow_up_notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}

class CustomerSegmentCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    criteria: Dict[str, Any]

class CustomerResponse(BaseModel):
    id: str
    property_id: str
    user_id: Optional[str]
    first_name: str
    last_name: str
    email: Optional[str]
    phone: Optional[str]
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    customer_type: str
    status: str
    customer_since: datetime
    last_visit: Optional[datetime]
    company_name: Optional[str]
    job_title: Optional[str]
    industry: Optional[str]
    preferences: Dict[str, Any]
    communication_preferences: Dict[str, Any]
    dietary_restrictions: List[str]
    allergies: List[str]
    loyalty_points: int
    loyalty_tier: str
    total_spent: float
    visit_count: int
    notes: Optional[str]
    tags: List[str]
    created_at: datetime
    updated_at: datetime

class CustomerMetrics(BaseModel):
    total_customers: int
    active_customers: int
    new_customers_this_month: int
    customers_by_type: Dict[str, int]
    customers_by_status: Dict[str, int]
    average_spending: float
    total_loyalty_points: int
    top_customers: List[Dict[str, Any]]
    customer_segments: int
    interactions_today: int

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
        logger.info("✅ Redis connected for customer service")
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
    description="Customer relationship management microservice",
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
        "description": "Customer relationship management",
        "endpoints": {
            "health": "/health",
            "customers": "/api/customers",
            "interactions": "/api/customers/interactions",
            "segments": "/api/customers/segments",
            "preferences": "/api/customers/preferences",
            "metrics": "/api/customers/metrics"
        }
    }

@app.get("/api/customers", response_model=List[CustomerResponse])
async def get_customers(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    customer_type: Optional[CustomerType] = None,
    status: Optional[CustomerStatus] = None,
    loyalty_tier: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customers with filtering and search"""
    query = db.query(Customer)
    
    if property_id:
        query = query.filter(Customer.property_id == property_id)
    if customer_type:
        query = query.filter(Customer.customer_type == customer_type)
    if status:
        query = query.filter(Customer.status == status)
    if loyalty_tier:
        query = query.filter(Customer.loyalty_tier == loyalty_tier)
    if search:
        query = query.filter(
            (Customer.first_name.ilike(f"%{search}%")) |
            (Customer.last_name.ilike(f"%{search}%")) |
            (Customer.email.ilike(f"%{search}%")) |
            (Customer.phone.ilike(f"%{search}%")) |
            (Customer.company_name.ilike(f"%{search}%"))
        )
    
    customers = query.order_by(Customer.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        CustomerResponse(
            id=customer.id,
            property_id=customer.property_id,
            user_id=customer.user_id,
            first_name=customer.first_name,
            last_name=customer.last_name,
            email=customer.email,
            phone=customer.phone,
            date_of_birth=customer.date_of_birth,
            gender=customer.gender,
            address=customer.address,
            city=customer.city,
            state=customer.state,
            country=customer.country,
            postal_code=customer.postal_code,
            customer_type=customer.customer_type,
            status=customer.status,
            customer_since=customer.customer_since,
            last_visit=customer.last_visit,
            company_name=customer.company_name,
            job_title=customer.job_title,
            industry=customer.industry,
            preferences=customer.preferences,
            communication_preferences=customer.communication_preferences,
            dietary_restrictions=customer.dietary_restrictions,
            allergies=customer.allergies,
            loyalty_points=customer.loyalty_points,
            loyalty_tier=customer.loyalty_tier,
            total_spent=customer.total_spent,
            visit_count=customer.visit_count,
            notes=customer.notes,
            tags=customer.tags,
            created_at=customer.created_at,
            updated_at=customer.updated_at
        )
        for customer in customers
    ]

@app.post("/api/customers", response_model=CustomerResponse)
async def create_customer(
    customer_data: CustomerCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new customer"""
    # Check if email already exists for this property
    if customer_data.email:
        existing_customer = db.query(Customer).filter(
            Customer.email == customer_data.email,
            Customer.property_id == customer_data.property_id
        ).first()
        if existing_customer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already exists for this property"
            )
    
    new_customer = Customer(
        property_id=customer_data.property_id,
        user_id=customer_data.user_id,
        first_name=customer_data.first_name,
        last_name=customer_data.last_name,
        email=customer_data.email,
        phone=customer_data.phone,
        date_of_birth=customer_data.date_of_birth,
        gender=customer_data.gender,
        address=customer_data.address,
        city=customer_data.city,
        state=customer_data.state,
        country=customer_data.country,
        postal_code=customer_data.postal_code,
        customer_type=customer_data.customer_type,
        company_name=customer_data.company_name,
        job_title=customer_data.job_title,
        industry=customer_data.industry,
        preferences=customer_data.preferences,
        communication_preferences=customer_data.communication_preferences,
        dietary_restrictions=customer_data.dietary_restrictions,
        allergies=customer_data.allergies,
        notes=customer_data.notes,
        tags=customer_data.tags
    )
    
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    
    logger.info(f"✅ Customer created: {new_customer.first_name} {new_customer.last_name}")
    
    return CustomerResponse(
        id=new_customer.id,
        property_id=new_customer.property_id,
        user_id=new_customer.user_id,
        first_name=new_customer.first_name,
        last_name=new_customer.last_name,
        email=new_customer.email,
        phone=new_customer.phone,
        date_of_birth=new_customer.date_of_birth,
        gender=new_customer.gender,
        address=new_customer.address,
        city=new_customer.city,
        state=new_customer.state,
        country=new_customer.country,
        postal_code=new_customer.postal_code,
        customer_type=new_customer.customer_type,
        status=new_customer.status,
        customer_since=new_customer.customer_since,
        last_visit=new_customer.last_visit,
        company_name=new_customer.company_name,
        job_title=new_customer.job_title,
        industry=new_customer.industry,
        preferences=new_customer.preferences,
        communication_preferences=new_customer.communication_preferences,
        dietary_restrictions=new_customer.dietary_restrictions,
        allergies=new_customer.allergies,
        loyalty_points=new_customer.loyalty_points,
        loyalty_tier=new_customer.loyalty_tier,
        total_spent=new_customer.total_spent,
        visit_count=new_customer.visit_count,
        notes=new_customer.notes,
        tags=new_customer.tags,
        created_at=new_customer.created_at,
        updated_at=new_customer.updated_at
    )

@app.get("/api/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific customer by ID"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    return CustomerResponse(
        id=customer.id,
        property_id=customer.property_id,
        user_id=customer.user_id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        email=customer.email,
        phone=customer.phone,
        date_of_birth=customer.date_of_birth,
        gender=customer.gender,
        address=customer.address,
        city=customer.city,
        state=customer.state,
        country=customer.country,
        postal_code=customer.postal_code,
        customer_type=customer.customer_type,
        status=customer.status,
        customer_since=customer.customer_since,
        last_visit=customer.last_visit,
        company_name=customer.company_name,
        job_title=customer.job_title,
        industry=customer.industry,
        preferences=customer.preferences,
        communication_preferences=customer.communication_preferences,
        dietary_restrictions=customer.dietary_restrictions,
        allergies=customer.allergies,
        loyalty_points=customer.loyalty_points,
        loyalty_tier=customer.loyalty_tier,
        total_spent=customer.total_spent,
        visit_count=customer.visit_count,
        notes=customer.notes,
        tags=customer.tags,
        created_at=customer.created_at,
        updated_at=customer.updated_at
    )

@app.put("/api/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: str,
    customer_data: CustomerUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a customer"""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found"
        )
    
    # Update fields
    if customer_data.first_name is not None:
        customer.first_name = customer_data.first_name
    if customer_data.last_name is not None:
        customer.last_name = customer_data.last_name
    if customer_data.email is not None:
        customer.email = customer_data.email
    if customer_data.phone is not None:
        customer.phone = customer_data.phone
    if customer_data.date_of_birth is not None:
        customer.date_of_birth = customer_data.date_of_birth
    if customer_data.gender is not None:
        customer.gender = customer_data.gender
    if customer_data.address is not None:
        customer.address = customer_data.address
    if customer_data.city is not None:
        customer.city = customer_data.city
    if customer_data.state is not None:
        customer.state = customer_data.state
    if customer_data.country is not None:
        customer.country = customer_data.country
    if customer_data.postal_code is not None:
        customer.postal_code = customer_data.postal_code
    if customer_data.customer_type is not None:
        customer.customer_type = customer_data.customer_type
    if customer_data.status is not None:
        customer.status = customer_data.status
    if customer_data.company_name is not None:
        customer.company_name = customer_data.company_name
    if customer_data.job_title is not None:
        customer.job_title = customer_data.job_title
    if customer_data.industry is not None:
        customer.industry = customer_data.industry
    if customer_data.preferences is not None:
        customer.preferences = customer_data.preferences
    if customer_data.communication_preferences is not None:
        customer.communication_preferences = customer_data.communication_preferences
    if customer_data.dietary_restrictions is not None:
        customer.dietary_restrictions = customer_data.dietary_restrictions
    if customer_data.allergies is not None:
        customer.allergies = customer_data.allergies
    if customer_data.notes is not None:
        customer.notes = customer_data.notes
    if customer_data.tags is not None:
        customer.tags = customer_data.tags
    
    customer.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(customer)
    
    logger.info(f"✅ Customer updated: {customer.first_name} {customer.last_name}")
    
    return CustomerResponse(
        id=customer.id,
        property_id=customer.property_id,
        user_id=customer.user_id,
        first_name=customer.first_name,
        last_name=customer.last_name,
        email=customer.email,
        phone=customer.phone,
        date_of_birth=customer.date_of_birth,
        gender=customer.gender,
        address=customer.address,
        city=customer.city,
        state=customer.state,
        country=customer.country,
        postal_code=customer.postal_code,
        customer_type=customer.customer_type,
        status=customer.status,
        customer_since=customer.customer_since,
        last_visit=customer.last_visit,
        company_name=customer.company_name,
        job_title=customer.job_title,
        industry=customer.industry,
        preferences=customer.preferences,
        communication_preferences=customer.communication_preferences,
        dietary_restrictions=customer.dietary_restrictions,
        allergies=customer.allergies,
        loyalty_points=customer.loyalty_points,
        loyalty_tier=customer.loyalty_tier,
        total_spent=customer.total_spent,
        visit_count=customer.visit_count,
        notes=customer.notes,
        tags=customer.tags,
        created_at=customer.created_at,
        updated_at=customer.updated_at
    )

@app.post("/api/customers/interactions")
async def create_customer_interaction(
    interaction_data: CustomerInteractionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a customer interaction"""
    new_interaction = CustomerInteraction(
        customer_id=interaction_data.customer_id,
        property_id=interaction_data.property_id,
        interaction_type=interaction_data.interaction_type,
        subject=interaction_data.subject,
        description=interaction_data.description,
        outcome=interaction_data.outcome,
        satisfaction_rating=interaction_data.satisfaction_rating,
        staff_id=interaction_data.staff_id,
        staff_name=interaction_data.staff_name,
        follow_up_required=interaction_data.follow_up_required,
        follow_up_date=interaction_data.follow_up_date,
        follow_up_notes=interaction_data.follow_up_notes,
        metadata=interaction_data.metadata
    )
    
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    
    logger.info(f"✅ Customer interaction created: {new_interaction.interaction_type}")
    
    return {
        "message": "Customer interaction created successfully",
        "interaction_id": new_interaction.id,
        "customer_id": new_interaction.customer_id
    }

@app.get("/api/customers/metrics", response_model=CustomerMetrics)
async def get_customer_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get customer metrics"""
    query = db.query(Customer)
    if property_id:
        query = query.filter(Customer.property_id == property_id)
    
    # Get basic counts
    total_customers = query.count()
    active_customers = query.filter(Customer.status == CustomerStatus.ACTIVE).count()
    
    # Get new customers this month
    this_month = datetime.utcnow().replace(day=1)
    new_customers_this_month = query.filter(Customer.created_at >= this_month).count()
    
    # Get customers by type
    customers_by_type = {}
    for customer_type in CustomerType:
        count = query.filter(Customer.customer_type == customer_type).count()
        customers_by_type[customer_type] = count
    
    # Get customers by status
    customers_by_status = {}
    for status in CustomerStatus:
        count = query.filter(Customer.status == status).count()
        customers_by_status[status] = count
    
    # Get average spending
    customers = query.filter(Customer.total_spent > 0).all()
    average_spending = 0.0
    if customers:
        average_spending = sum(customer.total_spent for customer in customers) / len(customers)
    
    # Get total loyalty points
    total_loyalty_points = sum(customer.loyalty_points for customer in query.all())
    
    # Get top customers
    top_customers = query.order_by(Customer.total_spent.desc()).limit(10).all()
    top_customers_data = [
        {
            "id": customer.id,
            "name": f"{customer.first_name} {customer.last_name}",
            "total_spent": customer.total_spent,
            "visit_count": customer.visit_count,
            "loyalty_tier": customer.loyalty_tier
        }
        for customer in top_customers
    ]
    
    # Get customer segments count
    segment_query = db.query(CustomerSegment)
    if property_id:
        segment_query = segment_query.filter(CustomerSegment.property_id == property_id)
    customer_segments = segment_query.count()
    
    # Get interactions today
    today = datetime.utcnow().date()
    interactions_today = db.query(CustomerInteraction).filter(
        db.func.date(CustomerInteraction.interaction_date) == today
    ).count()
    
    return CustomerMetrics(
        total_customers=total_customers,
        active_customers=active_customers,
        new_customers_this_month=new_customers_this_month,
        customers_by_type=customers_by_type,
        customers_by_status=customers_by_status,
        average_spending=average_spending,
        total_loyalty_points=total_loyalty_points,
        top_customers=top_customers_data,
        customer_segments=customer_segments,
        interactions_today=interactions_today
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )