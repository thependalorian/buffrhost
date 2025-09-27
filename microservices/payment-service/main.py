"""
Buffr Host Payment Service - Microservice
Handles payment processing, transactions, and financial management for Buffr Host platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_payments")
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
SERVICE_NAME = "payment-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8007))

# Enums
class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    PARTIAL_REFUND = "partial_refund"

class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    BANK_TRANSFER = "bank_transfer"
    MOBILE_MONEY = "mobile_money"
    DIGITAL_WALLET = "digital_wallet"
    CRYPTOCURRENCY = "cryptocurrency"

class TransactionType(str, Enum):
    PAYMENT = "payment"
    REFUND = "refund"
    CHARGEBACK = "chargeback"
    DISPUTE = "dispute"
    SETTLEMENT = "settlement"

class Currency(str, Enum):
    NAD = "NAD"
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    ZAR = "ZAR"

# Database Models
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    order_id = Column(String, nullable=True, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Payment Information
    payment_reference = Column(String, unique=True, nullable=False, index=True)
    external_payment_id = Column(String, nullable=True, index=True)
    payment_method = Column(String, nullable=False)
    payment_status = Column(String, default=PaymentStatus.PENDING)
    
    # Financial Information
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default=Currency.NAD)
    exchange_rate = Column(Numeric(10, 4), default=1.0)
    base_amount = Column(Numeric(10, 2), nullable=False)  # Amount in base currency
    
    # Fee Information
    processing_fee = Column(Numeric(10, 2), default=0.0)
    gateway_fee = Column(Numeric(10, 2), default=0.0)
    total_fee = Column(Numeric(10, 2), default=0.0)
    net_amount = Column(Numeric(10, 2), nullable=False)
    
    # Payment Details
    payment_gateway = Column(String, nullable=True)
    gateway_response = Column(JSON, default=dict)
    payment_details = Column(JSON, default=dict)
    
    # Card Information (encrypted)
    card_last_four = Column(String, nullable=True)
    card_brand = Column(String, nullable=True)
    card_expiry = Column(String, nullable=True)
    
    # Customer Information
    customer_name = Column(String, nullable=True)
    customer_email = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    
    # Timestamps
    payment_date = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = Column(String, ForeignKey("payments.id"), nullable=False, index=True)
    transaction_type = Column(String, nullable=False)
    transaction_reference = Column(String, nullable=True, index=True)
    
    # Transaction Information
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String, default=Currency.NAD)
    status = Column(String, default=PaymentStatus.PENDING)
    
    # Gateway Information
    gateway_transaction_id = Column(String, nullable=True)
    gateway_response = Column(JSON, default=dict)
    
    # Reason and Notes
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # User Information
    processed_by = Column(String, nullable=True)
    
    # Timestamps
    transaction_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Payment Method Information
    method_type = Column(String, nullable=False)
    method_name = Column(String, nullable=False)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Method Details
    method_details = Column(JSON, default=dict)
    
    # Security Information
    encrypted_data = Column(Text, nullable=True)
    token = Column(String, nullable=True, index=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaymentGateway(Base):
    __tablename__ = "payment_gateways"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    gateway_name = Column(String, nullable=False)
    gateway_type = Column(String, nullable=False)
    
    # Configuration
    configuration = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    
    # Fee Configuration
    processing_fee_rate = Column(Numeric(5, 4), default=0.0)  # Percentage
    fixed_fee = Column(Numeric(10, 2), default=0.0)
    minimum_fee = Column(Numeric(10, 2), default=0.0)
    maximum_fee = Column(Numeric(10, 2), default=0.0)
    
    # Supported Features
    supported_methods = Column(JSON, default=list)
    supported_currencies = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaymentRefund(Base):
    __tablename__ = "payment_refunds"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id = Column(String, ForeignKey("payments.id"), nullable=False, index=True)
    refund_reference = Column(String, unique=True, nullable=False, index=True)
    
    # Refund Information
    refund_amount = Column(Numeric(10, 2), nullable=False)
    refund_reason = Column(Text, nullable=True)
    refund_status = Column(String, default=PaymentStatus.PENDING)
    
    # Processing Information
    processed_by = Column(String, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    gateway_refund_id = Column(String, nullable=True)
    gateway_response = Column(JSON, default=dict)
    
    # Timestamps
    requested_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class PaymentSettlement(Base):
    __tablename__ = "payment_settlements"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    settlement_reference = Column(String, unique=True, nullable=False, index=True)
    
    # Settlement Information
    settlement_date = Column(DateTime, nullable=False)
    settlement_period_start = Column(DateTime, nullable=False)
    settlement_period_end = Column(DateTime, nullable=False)
    
    # Financial Information
    total_gross_amount = Column(Numeric(10, 2), default=0.0)
    total_fees = Column(Numeric(10, 2), default=0.0)
    total_refunds = Column(Numeric(10, 2), default=0.0)
    net_settlement_amount = Column(Numeric(10, 2), default=0.0)
    currency = Column(String, default=Currency.NAD)
    
    # Settlement Details
    payment_count = Column(Integer, default=0)
    refund_count = Column(Integer, default=0)
    settlement_method = Column(String, nullable=True)
    bank_reference = Column(String, nullable=True)
    
    # Status
    status = Column(String, default="pending")
    processed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class PaymentCreate(BaseModel):
    property_id: str
    order_id: Optional[str] = None
    customer_id: Optional[str] = None
    payment_method: PaymentMethod
    amount: float
    currency: Currency = Currency.NAD
    payment_gateway: Optional[str] = None
    payment_details: Optional[Dict[str, Any]] = {}
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

class PaymentUpdate(BaseModel):
    payment_status: Optional[PaymentStatus] = None
    external_payment_id: Optional[str] = None
    gateway_response: Optional[Dict[str, Any]] = None
    payment_details: Optional[Dict[str, Any]] = None
    processed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    failed_at: Optional[datetime] = None

class RefundCreate(BaseModel):
    payment_id: str
    refund_amount: float
    refund_reason: Optional[str] = None

class PaymentMethodCreate(BaseModel):
    property_id: str
    customer_id: Optional[str] = None
    method_type: PaymentMethod
    method_name: str
    is_default: bool = False
    method_details: Optional[Dict[str, Any]] = {}

class PaymentGatewayCreate(BaseModel):
    property_id: str
    gateway_name: str
    gateway_type: str
    configuration: Dict[str, Any]
    processing_fee_rate: float = 0.0
    fixed_fee: float = 0.0
    minimum_fee: float = 0.0
    maximum_fee: float = 0.0
    supported_methods: Optional[List[str]] = []
    supported_currencies: Optional[List[str]] = []

class PaymentResponse(BaseModel):
    id: str
    property_id: str
    order_id: Optional[str]
    customer_id: Optional[str]
    payment_reference: str
    external_payment_id: Optional[str]
    payment_method: str
    payment_status: str
    amount: float
    currency: str
    exchange_rate: float
    base_amount: float
    processing_fee: float
    gateway_fee: float
    total_fee: float
    net_amount: float
    payment_gateway: Optional[str]
    gateway_response: Dict[str, Any]
    payment_details: Dict[str, Any]
    card_last_four: Optional[str]
    card_brand: Optional[str]
    card_expiry: Optional[str]
    customer_name: Optional[str]
    customer_email: Optional[str]
    customer_phone: Optional[str]
    payment_date: datetime
    processed_at: Optional[datetime]
    completed_at: Optional[datetime]
    failed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class PaymentMetrics(BaseModel):
    total_payments: int
    successful_payments: int
    failed_payments: int
    pending_payments: int
    total_amount: float
    successful_amount: float
    failed_amount: float
    total_fees: float
    payments_by_method: Dict[str, int]
    payments_by_status: Dict[str, int]
    payments_today: int
    revenue_today: float
    average_payment_amount: float
    refund_rate: float

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
        logger.info("✅ Redis connected for payment service")
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
def generate_payment_reference() -> str:
    """Generate unique payment reference"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"PAY-{timestamp}-{random_suffix}"

def generate_refund_reference() -> str:
    """Generate unique refund reference"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"REF-{timestamp}-{random_suffix}"

def calculate_fees(amount: float, gateway: Optional[PaymentGateway] = None) -> Dict[str, float]:
    """Calculate payment fees"""
    if not gateway:
        return {
            "processing_fee": 0.0,
            "gateway_fee": 0.0,
            "total_fee": 0.0,
            "net_amount": amount
        }
    
    # Calculate percentage fee
    percentage_fee = amount * float(gateway.processing_fee_rate)
    
    # Add fixed fee
    fixed_fee = float(gateway.fixed_fee)
    
    # Calculate total fee
    total_fee = percentage_fee + fixed_fee
    
    # Apply minimum and maximum limits
    if gateway.minimum_fee and total_fee < float(gateway.minimum_fee):
        total_fee = float(gateway.minimum_fee)
    elif gateway.maximum_fee and total_fee > float(gateway.maximum_fee):
        total_fee = float(gateway.maximum_fee)
    
    net_amount = amount - total_fee
    
    return {
        "processing_fee": percentage_fee,
        "gateway_fee": fixed_fee,
        "total_fee": total_fee,
        "net_amount": net_amount
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
    description="Payment processing and financial management microservice",
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
        "description": "Payment processing and financial management",
        "endpoints": {
            "health": "/health",
            "payments": "/api/payments",
            "refunds": "/api/payments/refunds",
            "methods": "/api/payments/methods",
            "gateways": "/api/payments/gateways",
            "settlements": "/api/payments/settlements",
            "metrics": "/api/payments/metrics"
        }
    }

@app.get("/api/payments", response_model=List[PaymentResponse])
async def get_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    order_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    payment_status: Optional[PaymentStatus] = None,
    payment_method: Optional[PaymentMethod] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payments with filtering and search"""
    query = db.query(Payment)
    
    if property_id:
        query = query.filter(Payment.property_id == property_id)
    if order_id:
        query = query.filter(Payment.order_id == order_id)
    if customer_id:
        query = query.filter(Payment.customer_id == customer_id)
    if payment_status:
        query = query.filter(Payment.payment_status == payment_status)
    if payment_method:
        query = query.filter(Payment.payment_method == payment_method)
    if date_from:
        query = query.filter(Payment.payment_date >= date_from)
    if date_to:
        query = query.filter(Payment.payment_date <= date_to)
    if search:
        query = query.filter(
            (Payment.payment_reference.ilike(f"%{search}%")) |
            (Payment.customer_name.ilike(f"%{search}%")) |
            (Payment.customer_email.ilike(f"%{search}%"))
        )
    
    payments = query.order_by(Payment.payment_date.desc()).offset(skip).limit(limit).all()
    
    return [
        PaymentResponse(
            id=payment.id,
            property_id=payment.property_id,
            order_id=payment.order_id,
            customer_id=payment.customer_id,
            payment_reference=payment.payment_reference,
            external_payment_id=payment.external_payment_id,
            payment_method=payment.payment_method,
            payment_status=payment.payment_status,
            amount=float(payment.amount),
            currency=payment.currency,
            exchange_rate=float(payment.exchange_rate),
            base_amount=float(payment.base_amount),
            processing_fee=float(payment.processing_fee),
            gateway_fee=float(payment.gateway_fee),
            total_fee=float(payment.total_fee),
            net_amount=float(payment.net_amount),
            payment_gateway=payment.payment_gateway,
            gateway_response=payment.gateway_response,
            payment_details=payment.payment_details,
            card_last_four=payment.card_last_four,
            card_brand=payment.card_brand,
            card_expiry=payment.card_expiry,
            customer_name=payment.customer_name,
            customer_email=payment.customer_email,
            customer_phone=payment.customer_phone,
            payment_date=payment.payment_date,
            processed_at=payment.processed_at,
            completed_at=payment.completed_at,
            failed_at=payment.failed_at,
            created_at=payment.created_at,
            updated_at=payment.updated_at
        )
        for payment in payments
    ]

@app.post("/api/payments", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new payment"""
    # Generate payment reference
    payment_reference = generate_payment_reference()
    
    # Get payment gateway configuration
    gateway = None
    if payment_data.payment_gateway:
        gateway = db.query(PaymentGateway).filter(
            PaymentGateway.id == payment_data.payment_gateway,
            PaymentGateway.property_id == payment_data.property_id,
            PaymentGateway.is_active == True
        ).first()
    
    # Calculate fees
    fees = calculate_fees(payment_data.amount, gateway)
    
    # Create payment
    new_payment = Payment(
        property_id=payment_data.property_id,
        order_id=payment_data.order_id,
        customer_id=payment_data.customer_id,
        payment_reference=payment_reference,
        payment_method=payment_data.payment_method,
        amount=payment_data.amount,
        currency=payment_data.currency,
        base_amount=payment_data.amount,
        processing_fee=fees["processing_fee"],
        gateway_fee=fees["gateway_fee"],
        total_fee=fees["total_fee"],
        net_amount=fees["net_amount"],
        payment_gateway=payment_data.payment_gateway,
        payment_details=payment_data.payment_details,
        customer_name=payment_data.customer_name,
        customer_email=payment_data.customer_email,
        customer_phone=payment_data.customer_phone
    )
    
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    
    # Create initial transaction record
    transaction = PaymentTransaction(
        payment_id=new_payment.id,
        transaction_type=TransactionType.PAYMENT,
        transaction_reference=payment_reference,
        amount=payment_data.amount,
        currency=payment_data.currency,
        status=PaymentStatus.PENDING,
        reason="Payment initiated"
    )
    db.add(transaction)
    db.commit()
    
    logger.info(f"✅ Payment created: {new_payment.payment_reference}")
    
    return PaymentResponse(
        id=new_payment.id,
        property_id=new_payment.property_id,
        order_id=new_payment.order_id,
        customer_id=new_payment.customer_id,
        payment_reference=new_payment.payment_reference,
        external_payment_id=new_payment.external_payment_id,
        payment_method=new_payment.payment_method,
        payment_status=new_payment.payment_status,
        amount=float(new_payment.amount),
        currency=new_payment.currency,
        exchange_rate=float(new_payment.exchange_rate),
        base_amount=float(new_payment.base_amount),
        processing_fee=float(new_payment.processing_fee),
        gateway_fee=float(new_payment.gateway_fee),
        total_fee=float(new_payment.total_fee),
        net_amount=float(new_payment.net_amount),
        payment_gateway=new_payment.payment_gateway,
        gateway_response=new_payment.gateway_response,
        payment_details=new_payment.payment_details,
        card_last_four=new_payment.card_last_four,
        card_brand=new_payment.card_brand,
        card_expiry=new_payment.card_expiry,
        customer_name=new_payment.customer_name,
        customer_email=new_payment.customer_email,
        customer_phone=new_payment.customer_phone,
        payment_date=new_payment.payment_date,
        processed_at=new_payment.processed_at,
        completed_at=new_payment.completed_at,
        failed_at=new_payment.failed_at,
        created_at=new_payment.created_at,
        updated_at=new_payment.updated_at
    )

@app.put("/api/payments/{payment_id}", response_model=PaymentResponse)
async def update_payment(
    payment_id: str,
    payment_data: PaymentUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a payment"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Track status changes
    previous_status = payment.payment_status
    if payment_data.payment_status and payment_data.payment_status != previous_status:
        transaction = PaymentTransaction(
            payment_id=payment.id,
            transaction_type=TransactionType.PAYMENT,
            amount=float(payment.amount),
            currency=payment.currency,
            status=payment_data.payment_status,
            reason=f"Status changed from {previous_status} to {payment_data.payment_status}",
            processed_by=current_user["user_id"]
        )
        db.add(transaction)
    
    # Update fields
    if payment_data.payment_status is not None:
        payment.payment_status = payment_data.payment_status
    if payment_data.external_payment_id is not None:
        payment.external_payment_id = payment_data.external_payment_id
    if payment_data.gateway_response is not None:
        payment.gateway_response = payment_data.gateway_response
    if payment_data.payment_details is not None:
        payment.payment_details = payment_data.payment_details
    if payment_data.processed_at is not None:
        payment.processed_at = payment_data.processed_at
    if payment_data.completed_at is not None:
        payment.completed_at = payment_data.completed_at
    if payment_data.failed_at is not None:
        payment.failed_at = payment_data.failed_at
    
    payment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)
    
    logger.info(f"✅ Payment updated: {payment.payment_reference}")
    
    return PaymentResponse(
        id=payment.id,
        property_id=payment.property_id,
        order_id=payment.order_id,
        customer_id=payment.customer_id,
        payment_reference=payment.payment_reference,
        external_payment_id=payment.external_payment_id,
        payment_method=payment.payment_method,
        payment_status=payment.payment_status,
        amount=float(payment.amount),
        currency=payment.currency,
        exchange_rate=float(payment.exchange_rate),
        base_amount=float(payment.base_amount),
        processing_fee=float(payment.processing_fee),
        gateway_fee=float(payment.gateway_fee),
        total_fee=float(payment.total_fee),
        net_amount=float(payment.net_amount),
        payment_gateway=payment.payment_gateway,
        gateway_response=payment.gateway_response,
        payment_details=payment.payment_details,
        card_last_four=payment.card_last_four,
        card_brand=payment.card_brand,
        card_expiry=payment.card_expiry,
        customer_name=payment.customer_name,
        customer_email=payment.customer_email,
        customer_phone=payment.customer_phone,
        payment_date=payment.payment_date,
        processed_at=payment.processed_at,
        completed_at=payment.completed_at,
        failed_at=payment.failed_at,
        created_at=payment.created_at,
        updated_at=payment.updated_at
    )

@app.post("/api/payments/refunds")
async def create_refund(
    refund_data: RefundCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a payment refund"""
    # Get the original payment
    payment = db.query(Payment).filter(Payment.id == refund_data.payment_id).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    # Check if payment is refundable
    if payment.payment_status not in [PaymentStatus.COMPLETED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment is not refundable"
        )
    
    # Check refund amount
    if refund_data.refund_amount > float(payment.amount):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refund amount cannot exceed payment amount"
        )
    
    # Generate refund reference
    refund_reference = generate_refund_reference()
    
    # Create refund
    new_refund = PaymentRefund(
        payment_id=payment.id,
        refund_reference=refund_reference,
        refund_amount=refund_data.refund_amount,
        refund_reason=refund_data.refund_reason,
        processed_by=current_user["user_id"]
    )
    
    db.add(new_refund)
    
    # Update payment status
    if refund_data.refund_amount == float(payment.amount):
        payment.payment_status = PaymentStatus.REFUNDED
    else:
        payment.payment_status = PaymentStatus.PARTIAL_REFUND
    
    # Create transaction record
    transaction = PaymentTransaction(
        payment_id=payment.id,
        transaction_type=TransactionType.REFUND,
        transaction_reference=refund_reference,
        amount=refund_data.refund_amount,
        currency=payment.currency,
        status=PaymentStatus.PENDING,
        reason=f"Refund: {refund_data.refund_reason or 'No reason provided'}",
        processed_by=current_user["user_id"]
    )
    db.add(transaction)
    
    db.commit()
    
    logger.info(f"✅ Refund created: {refund_reference}")
    
    return {
        "message": "Refund created successfully",
        "refund_id": new_refund.id,
        "refund_reference": refund_reference,
        "refund_amount": refund_data.refund_amount,
        "payment_id": payment.id
    }

@app.get("/api/payments/metrics", response_model=PaymentMetrics)
async def get_payment_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get payment metrics"""
    query = db.query(Payment)
    if property_id:
        query = query.filter(Payment.property_id == property_id)
    
    # Get basic counts
    total_payments = query.count()
    successful_payments = query.filter(Payment.payment_status == PaymentStatus.COMPLETED).count()
    failed_payments = query.filter(Payment.payment_status == PaymentStatus.FAILED).count()
    pending_payments = query.filter(Payment.payment_status == PaymentStatus.PENDING).count()
    
    # Get financial metrics
    payments = query.all()
    total_amount = sum(float(payment.amount) for payment in payments)
    successful_amount = sum(float(payment.amount) for payment in payments if payment.payment_status == PaymentStatus.COMPLETED)
    failed_amount = sum(float(payment.amount) for payment in payments if payment.payment_status == PaymentStatus.FAILED)
    total_fees = sum(float(payment.total_fee) for payment in payments)
    
    # Get payments by method
    payments_by_method = {}
    for method in PaymentMethod:
        count = query.filter(Payment.payment_method == method).count()
        payments_by_method[method] = count
    
    # Get payments by status
    payments_by_status = {}
    for status in PaymentStatus:
        count = query.filter(Payment.payment_status == status).count()
        payments_by_status[status] = count
    
    # Get today's metrics
    today = datetime.utcnow().date()
    payments_today = query.filter(db.func.date(Payment.payment_date) == today).count()
    revenue_today = sum(
        float(payment.amount) for payment in 
        query.filter(db.func.date(Payment.payment_date) == today).all()
        if payment.payment_status == PaymentStatus.COMPLETED
    )
    
    # Calculate average payment amount
    average_payment_amount = 0.0
    if successful_payments > 0:
        average_payment_amount = successful_amount / successful_payments
    
    # Calculate refund rate
    refunds = db.query(PaymentRefund).count()
    refund_rate = 0.0
    if total_payments > 0:
        refund_rate = (refunds / total_payments) * 100
    
    return PaymentMetrics(
        total_payments=total_payments,
        successful_payments=successful_payments,
        failed_payments=failed_payments,
        pending_payments=pending_payments,
        total_amount=total_amount,
        successful_amount=successful_amount,
        failed_amount=failed_amount,
        total_fees=total_fees,
        payments_by_method=payments_by_method,
        payments_by_status=payments_by_status,
        payments_today=payments_today,
        revenue_today=revenue_today,
        average_payment_amount=average_payment_amount,
        refund_rate=refund_rate
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )