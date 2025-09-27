"""
Buffr Host Order Service - Microservice
Handles order processing, fulfillment, and order management for Buffr Host platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_orders")
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
SERVICE_NAME = "order-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8006))

# Enums
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class OrderType(str, Enum):
    DINE_IN = "dine_in"
    TAKEAWAY = "takeaway"
    DELIVERY = "delivery"
    PICKUP = "pickup"
    RESERVATION = "reservation"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIAL_REFUND = "partial_refund"

class OrderPriority(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"

# Database Models
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    order_number = Column(String, unique=True, nullable=False, index=True)
    
    # Order Information
    order_type = Column(String, nullable=False)
    status = Column(String, default=OrderStatus.PENDING)
    priority = Column(String, default=OrderPriority.NORMAL)
    
    # Timing Information
    order_date = Column(DateTime, default=datetime.utcnow)
    estimated_ready_time = Column(DateTime, nullable=True)
    actual_ready_time = Column(DateTime, nullable=True)
    delivery_time = Column(DateTime, nullable=True)
    
    # Customer Information
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    
    # Delivery Information
    delivery_address = Column(Text, nullable=True)
    delivery_instructions = Column(Text, nullable=True)
    delivery_fee = Column(Numeric(10, 2), default=0.0)
    
    # Financial Information
    subtotal = Column(Numeric(10, 2), default=0.0)
    tax_amount = Column(Numeric(10, 2), default=0.0)
    service_charge = Column(Numeric(10, 2), default=0.0)
    discount_amount = Column(Numeric(10, 2), default=0.0)
    total_amount = Column(Numeric(10, 2), default=0.0)
    currency = Column(String, default="NAD")
    
    # Payment Information
    payment_status = Column(String, default=PaymentStatus.PENDING)
    payment_method = Column(String, nullable=True)
    payment_reference = Column(String, nullable=True)
    
    # Staff Information
    assigned_staff = Column(String, nullable=True)
    kitchen_staff = Column(String, nullable=True)
    delivery_staff = Column(String, nullable=True)
    
    # Special Instructions
    special_instructions = Column(Text, nullable=True)
    dietary_requirements = Column(JSON, default=list)
    
    # Order Metadata
    metadata = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    menu_item_id = Column(String, nullable=False, index=True)
    menu_item_name = Column(String, nullable=False)
    
    # Item Information
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    # Modifiers and Options
    modifiers = Column(JSON, default=list)
    special_instructions = Column(Text, nullable=True)
    
    # Status
    status = Column(String, default="pending")  # pending, preparing, ready, served
    prepared_by = Column(String, nullable=True)
    prepared_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    status = Column(String, nullable=False)
    previous_status = Column(String, nullable=True)
    
    # Change Information
    changed_by = Column(String, nullable=True)
    change_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    changed_at = Column(DateTime, default=datetime.utcnow)

class OrderModifier(Base):
    __tablename__ = "order_modifiers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_item_id = Column(String, ForeignKey("order_items.id"), nullable=False, index=True)
    modifier_name = Column(String, nullable=False)
    modifier_option = Column(String, nullable=False)
    price_adjustment = Column(Numeric(10, 2), default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class OrderReview(Base):
    __tablename__ = "order_reviews"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Review Information
    rating = Column(Integer, nullable=False)  # 1-5 stars
    food_rating = Column(Integer, nullable=True)
    service_rating = Column(Integer, nullable=True)
    delivery_rating = Column(Integer, nullable=True)
    
    # Review Content
    title = Column(String, nullable=True)
    review_text = Column(Text, nullable=True)
    is_public = Column(Boolean, default=True)
    
    # Response
    response_text = Column(Text, nullable=True)
    response_by = Column(String, nullable=True)
    response_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class OrderItemCreate(BaseModel):
    menu_item_id: str
    menu_item_name: str
    quantity: int
    unit_price: float
    modifiers: Optional[List[Dict[str, Any]]] = []
    special_instructions: Optional[str] = None

class OrderCreate(BaseModel):
    property_id: str
    customer_id: Optional[str] = None
    order_type: OrderType
    priority: OrderPriority = OrderPriority.NORMAL
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_instructions: Optional[str] = None
    delivery_fee: float = 0.0
    special_instructions: Optional[str] = None
    dietary_requirements: Optional[List[str]] = []
    items: List[OrderItemCreate]
    metadata: Optional[Dict[str, Any]] = {}

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    priority: Optional[OrderPriority] = None
    estimated_ready_time: Optional[datetime] = None
    actual_ready_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    assigned_staff: Optional[str] = None
    kitchen_staff: Optional[str] = None
    delivery_staff: Optional[str] = None
    special_instructions: Optional[str] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class OrderItemUpdate(BaseModel):
    status: Optional[str] = None
    prepared_by: Optional[str] = None
    prepared_at: Optional[datetime] = None

class OrderResponse(BaseModel):
    id: str
    property_id: str
    customer_id: Optional[str]
    order_number: str
    order_type: str
    status: str
    priority: str
    order_date: datetime
    estimated_ready_time: Optional[datetime]
    actual_ready_time: Optional[datetime]
    delivery_time: Optional[datetime]
    customer_name: Optional[str]
    customer_phone: Optional[str]
    customer_email: Optional[str]
    delivery_address: Optional[str]
    delivery_instructions: Optional[str]
    delivery_fee: float
    subtotal: float
    tax_amount: float
    service_charge: float
    discount_amount: float
    total_amount: float
    currency: str
    payment_status: str
    payment_method: Optional[str]
    payment_reference: Optional[str]
    assigned_staff: Optional[str]
    kitchen_staff: Optional[str]
    delivery_staff: Optional[str]
    special_instructions: Optional[str]
    dietary_requirements: List[str]
    metadata: Dict[str, Any]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    menu_item_id: str
    menu_item_name: str
    quantity: int
    unit_price: float
    total_price: float
    modifiers: List[Dict[str, Any]]
    special_instructions: Optional[str]
    status: str
    prepared_by: Optional[str]
    prepared_at: Optional[datetime]
    created_at: datetime

class OrderMetrics(BaseModel):
    total_orders: int
    orders_today: int
    orders_this_week: int
    orders_this_month: int
    orders_by_status: Dict[str, int]
    orders_by_type: Dict[str, int]
    average_order_value: float
    total_revenue: float
    revenue_today: float
    revenue_this_week: float
    revenue_this_month: float
    average_preparation_time: float
    customer_satisfaction: float

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
        logger.info("✅ Redis connected for order service")
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
def generate_order_number() -> str:
    """Generate unique order number"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"ORD-{timestamp}-{random_suffix}"

def calculate_order_totals(items: List[OrderItemCreate], delivery_fee: float = 0.0, tax_rate: float = 0.15) -> Dict[str, float]:
    """Calculate order totals"""
    subtotal = sum(item.unit_price * item.quantity for item in items)
    tax_amount = subtotal * tax_rate
    service_charge = subtotal * 0.1  # 10% service charge
    total_amount = subtotal + tax_amount + service_charge + delivery_fee
    
    return {
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "service_charge": service_charge,
        "delivery_fee": delivery_fee,
        "total_amount": total_amount
    }

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
    description="Order processing and fulfillment microservice",
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
        "description": "Order processing and fulfillment",
        "endpoints": {
            "health": "/health",
            "orders": "/api/orders",
            "items": "/api/orders/items",
            "status": "/api/orders/status",
            "metrics": "/api/orders/metrics"
        }
    }

@app.get("/api/orders", response_model=List[OrderResponse])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    status: Optional[OrderStatus] = None,
    order_type: Optional[OrderType] = None,
    priority: Optional[OrderPriority] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get orders with filtering and search"""
    query = db.query(Order)
    
    if property_id:
        query = query.filter(Order.property_id == property_id)
    if customer_id:
        query = query.filter(Order.customer_id == customer_id)
    if status:
        query = query.filter(Order.status == status)
    if order_type:
        query = query.filter(Order.order_type == order_type)
    if priority:
        query = query.filter(Order.priority == priority)
    if date_from:
        query = query.filter(Order.order_date >= date_from)
    if date_to:
        query = query.filter(Order.order_date <= date_to)
    if search:
        query = query.filter(
            (Order.order_number.ilike(f"%{search}%")) |
            (Order.customer_name.ilike(f"%{search}%")) |
            (Order.customer_phone.ilike(f"%{search}%"))
        )
    
    orders = query.order_by(Order.order_date.desc()).offset(skip).limit(limit).all()
    
    return [
        OrderResponse(
            id=order.id,
            property_id=order.property_id,
            customer_id=order.customer_id,
            order_number=order.order_number,
            order_type=order.order_type,
            status=order.status,
            priority=order.priority,
            order_date=order.order_date,
            estimated_ready_time=order.estimated_ready_time,
            actual_ready_time=order.actual_ready_time,
            delivery_time=order.delivery_time,
            customer_name=order.customer_name,
            customer_phone=order.customer_phone,
            customer_email=order.customer_email,
            delivery_address=order.delivery_address,
            delivery_instructions=order.delivery_instructions,
            delivery_fee=float(order.delivery_fee),
            subtotal=float(order.subtotal),
            tax_amount=float(order.tax_amount),
            service_charge=float(order.service_charge),
            discount_amount=float(order.discount_amount),
            total_amount=float(order.total_amount),
            currency=order.currency,
            payment_status=order.payment_status,
            payment_method=order.payment_method,
            payment_reference=order.payment_reference,
            assigned_staff=order.assigned_staff,
            kitchen_staff=order.kitchen_staff,
            delivery_staff=order.delivery_staff,
            special_instructions=order.special_instructions,
            dietary_requirements=order.dietary_requirements,
            metadata=order.metadata,
            notes=order.notes,
            created_at=order.created_at,
            updated_at=order.updated_at
        )
        for order in orders
    ]

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    # Generate order number
    order_number = generate_order_number()
    
    # Calculate totals
    totals = calculate_order_totals(order_data.items, order_data.delivery_fee)
    
    # Create order
    new_order = Order(
        property_id=order_data.property_id,
        customer_id=order_data.customer_id,
        order_number=order_number,
        order_type=order_data.order_type,
        priority=order_data.priority,
        customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone,
        customer_email=order_data.customer_email,
        delivery_address=order_data.delivery_address,
        delivery_instructions=order_data.delivery_instructions,
        delivery_fee=order_data.delivery_fee,
        subtotal=totals["subtotal"],
        tax_amount=totals["tax_amount"],
        service_charge=totals["service_charge"],
        total_amount=totals["total_amount"],
        special_instructions=order_data.special_instructions,
        dietary_requirements=order_data.dietary_requirements,
        metadata=order_data.metadata
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Create order items
    for item_data in order_data.items:
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=item_data.menu_item_id,
            menu_item_name=item_data.menu_item_name,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            total_price=item_data.unit_price * item_data.quantity,
            modifiers=item_data.modifiers,
            special_instructions=item_data.special_instructions
        )
        db.add(order_item)
    
    # Create initial status history
    status_history = OrderStatusHistory(
        order_id=new_order.id,
        status=OrderStatus.PENDING,
        changed_by=current_user["user_id"],
        change_reason="Order created"
    )
    db.add(status_history)
    
    db.commit()
    
    logger.info(f"✅ Order created: {new_order.order_number}")
    
    return OrderResponse(
        id=new_order.id,
        property_id=new_order.property_id,
        customer_id=new_order.customer_id,
        order_number=new_order.order_number,
        order_type=new_order.order_type,
        status=new_order.status,
        priority=new_order.priority,
        order_date=new_order.order_date,
        estimated_ready_time=new_order.estimated_ready_time,
        actual_ready_time=new_order.actual_ready_time,
        delivery_time=new_order.delivery_time,
        customer_name=new_order.customer_name,
        customer_phone=new_order.customer_phone,
        customer_email=new_order.customer_email,
        delivery_address=new_order.delivery_address,
        delivery_instructions=new_order.delivery_instructions,
        delivery_fee=float(new_order.delivery_fee),
        subtotal=float(new_order.subtotal),
        tax_amount=float(new_order.tax_amount),
        service_charge=float(new_order.service_charge),
        discount_amount=float(new_order.discount_amount),
        total_amount=float(new_order.total_amount),
        currency=new_order.currency,
        payment_status=new_order.payment_status,
        payment_method=new_order.payment_method,
        payment_reference=new_order.payment_reference,
        assigned_staff=new_order.assigned_staff,
        kitchen_staff=new_order.kitchen_staff,
        delivery_staff=new_order.delivery_staff,
        special_instructions=new_order.special_instructions,
        dietary_requirements=new_order.dietary_requirements,
        metadata=new_order.metadata,
        notes=new_order.notes,
        created_at=new_order.created_at,
        updated_at=new_order.updated_at
    )

@app.get("/api/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order by ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return OrderResponse(
        id=order.id,
        property_id=order.property_id,
        customer_id=order.customer_id,
        order_number=order.order_number,
        order_type=order.order_type,
        status=order.status,
        priority=order.priority,
        order_date=order.order_date,
        estimated_ready_time=order.estimated_ready_time,
        actual_ready_time=order.actual_ready_time,
        delivery_time=order.delivery_time,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_email=order.customer_email,
        delivery_address=order.delivery_address,
        delivery_instructions=order.delivery_instructions,
        delivery_fee=float(order.delivery_fee),
        subtotal=float(order.subtotal),
        tax_amount=float(order.tax_amount),
        service_charge=float(order.service_charge),
        discount_amount=float(order.discount_amount),
        total_amount=float(order.total_amount),
        currency=order.currency,
        payment_status=order.payment_status,
        payment_method=order.payment_method,
        payment_reference=order.payment_reference,
        assigned_staff=order.assigned_staff,
        kitchen_staff=order.kitchen_staff,
        delivery_staff=order.delivery_staff,
        special_instructions=order.special_instructions,
        dietary_requirements=order.dietary_requirements,
        metadata=order.metadata,
        notes=order.notes,
        created_at=order.created_at,
        updated_at=order.updated_at
    )

@app.put("/api/orders/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: str,
    order_data: OrderUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an order"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Track status changes
    previous_status = order.status
    if order_data.status and order_data.status != previous_status:
        status_history = OrderStatusHistory(
            order_id=order.id,
            status=order_data.status,
            previous_status=previous_status,
            changed_by=current_user["user_id"],
            change_reason="Status updated"
        )
        db.add(status_history)
    
    # Update fields
    if order_data.status is not None:
        order.status = order_data.status
    if order_data.priority is not None:
        order.priority = order_data.priority
    if order_data.estimated_ready_time is not None:
        order.estimated_ready_time = order_data.estimated_ready_time
    if order_data.actual_ready_time is not None:
        order.actual_ready_time = order_data.actual_ready_time
    if order_data.delivery_time is not None:
        order.delivery_time = order_data.delivery_time
    if order_data.assigned_staff is not None:
        order.assigned_staff = order_data.assigned_staff
    if order_data.kitchen_staff is not None:
        order.kitchen_staff = order_data.kitchen_staff
    if order_data.delivery_staff is not None:
        order.delivery_staff = order_data.delivery_staff
    if order_data.special_instructions is not None:
        order.special_instructions = order_data.special_instructions
    if order_data.notes is not None:
        order.notes = order_data.notes
    if order_data.metadata is not None:
        order.metadata = order_data.metadata
    
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    
    logger.info(f"✅ Order updated: {order.order_number}")
    
    return OrderResponse(
        id=order.id,
        property_id=order.property_id,
        customer_id=order.customer_id,
        order_number=order.order_number,
        order_type=order.order_type,
        status=order.status,
        priority=order.priority,
        order_date=order.order_date,
        estimated_ready_time=order.estimated_ready_time,
        actual_ready_time=order.actual_ready_time,
        delivery_time=order.delivery_time,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        customer_email=order.customer_email,
        delivery_address=order.delivery_address,
        delivery_instructions=order.delivery_instructions,
        delivery_fee=float(order.delivery_fee),
        subtotal=float(order.subtotal),
        tax_amount=float(order.tax_amount),
        service_charge=float(order.service_charge),
        discount_amount=float(order.discount_amount),
        total_amount=float(order.total_amount),
        currency=order.currency,
        payment_status=order.payment_status,
        payment_method=order.payment_method,
        payment_reference=order.payment_reference,
        assigned_staff=order.assigned_staff,
        kitchen_staff=order.kitchen_staff,
        delivery_staff=order.delivery_staff,
        special_instructions=order.special_instructions,
        dietary_requirements=order.dietary_requirements,
        metadata=order.metadata,
        notes=order.notes,
        created_at=order.created_at,
        updated_at=order.updated_at
    )

@app.get("/api/orders/{order_id}/items", response_model=List[OrderItemResponse])
async def get_order_items(
    order_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order items"""
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    
    return [
        OrderItemResponse(
            id=item.id,
            order_id=item.order_id,
            menu_item_id=item.menu_item_id,
            menu_item_name=item.menu_item_name,
            quantity=item.quantity,
            unit_price=float(item.unit_price),
            total_price=float(item.total_price),
            modifiers=item.modifiers,
            special_instructions=item.special_instructions,
            status=item.status,
            prepared_by=item.prepared_by,
            prepared_at=item.prepared_at,
            created_at=item.created_at
        )
        for item in items
    ]

@app.get("/api/orders/metrics", response_model=OrderMetrics)
async def get_order_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order metrics"""
    query = db.query(Order)
    if property_id:
        query = query.filter(Order.property_id == property_id)
    
    # Get basic counts
    total_orders = query.count()
    
    # Get orders by time period
    today = datetime.utcnow().date()
    this_week = today - timedelta(days=today.weekday())
    this_month = today.replace(day=1)
    
    orders_today = query.filter(db.func.date(Order.order_date) == today).count()
    orders_this_week = query.filter(Order.order_date >= this_week).count()
    orders_this_month = query.filter(Order.order_date >= this_month).count()
    
    # Get orders by status
    orders_by_status = {}
    for status in OrderStatus:
        count = query.filter(Order.status == status).count()
        orders_by_status[status] = count
    
    # Get orders by type
    orders_by_type = {}
    for order_type in OrderType:
        count = query.filter(Order.order_type == order_type).count()
        orders_by_type[order_type] = count
    
    # Get financial metrics
    orders_with_revenue = query.filter(Order.total_amount > 0).all()
    average_order_value = 0.0
    total_revenue = 0.0
    
    if orders_with_revenue:
        total_revenue = sum(float(order.total_amount) for order in orders_with_revenue)
        average_order_value = total_revenue / len(orders_with_revenue)
    
    # Get revenue by time period
    revenue_today = sum(
        float(order.total_amount) for order in 
        query.filter(db.func.date(Order.order_date) == today).all()
    )
    
    revenue_this_week = sum(
        float(order.total_amount) for order in 
        query.filter(Order.order_date >= this_week).all()
    )
    
    revenue_this_month = sum(
        float(order.total_amount) for order in 
        query.filter(Order.order_date >= this_month).all()
    )
    
    # Get preparation time metrics
    completed_orders = query.filter(
        Order.status.in_([OrderStatus.COMPLETED, OrderStatus.DELIVERED]),
        Order.actual_ready_time.isnot(None)
    ).all()
    
    average_preparation_time = 0.0
    if completed_orders:
        prep_times = []
        for order in completed_orders:
            if order.actual_ready_time:
                prep_time = (order.actual_ready_time - order.order_date).total_seconds() / 60  # minutes
                prep_times.append(prep_time)
        
        if prep_times:
            average_preparation_time = sum(prep_times) / len(prep_times)
    
    # Get customer satisfaction
    reviews = db.query(OrderReview).all()
    customer_satisfaction = 0.0
    if reviews:
        customer_satisfaction = sum(review.rating for review in reviews) / len(reviews)
    
    return OrderMetrics(
        total_orders=total_orders,
        orders_today=orders_today,
        orders_this_week=orders_this_week,
        orders_this_month=orders_this_month,
        orders_by_status=orders_by_status,
        orders_by_type=orders_by_type,
        average_order_value=average_order_value,
        total_revenue=total_revenue,
        revenue_today=revenue_today,
        revenue_this_week=revenue_this_week,
        revenue_this_month=revenue_this_month,
        average_preparation_time=average_preparation_time,
        customer_satisfaction=customer_satisfaction
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )