"""
Buffr Host Inventory Service - Microservice
Handles inventory management, stock tracking, and supplier management for Buffr Host platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_inventory")
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
SERVICE_NAME = "inventory-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8004))

# Enums
class ItemStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISCONTINUED = "discontinued"
    OUT_OF_STOCK = "out_of_stock"

class ItemType(str, Enum):
    FOOD = "food"
    BEVERAGE = "beverage"
    SUPPLIES = "supplies"
    EQUIPMENT = "equipment"
    CLEANING = "cleaning"
    OFFICE = "office"

class UnitType(str, Enum):
    PIECE = "piece"
    KILOGRAM = "kilogram"
    GRAM = "gram"
    LITER = "liter"
    MILLILITER = "milliliter"
    BOX = "box"
    PACK = "pack"
    CASE = "case"

class TransactionType(str, Enum):
    IN = "in"
    OUT = "out"
    ADJUSTMENT = "adjustment"
    TRANSFER = "transfer"
    WASTE = "waste"
    RETURN = "return"

class OrderStatus(str, Enum):
    PENDING = "pending"
    ORDERED = "ordered"
    RECEIVED = "received"
    PARTIAL = "partial"
    CANCELLED = "cancelled"

# Database Models
class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    item_type = Column(String, nullable=False)
    category = Column(String, nullable=True)
    sku = Column(String, unique=True, nullable=False, index=True)
    barcode = Column(String, nullable=True, index=True)
    
    # Stock Information
    current_stock = Column(Numeric(10, 2), default=0.0)
    minimum_stock = Column(Numeric(10, 2), default=0.0)
    maximum_stock = Column(Numeric(10, 2), default=0.0)
    reorder_point = Column(Numeric(10, 2), default=0.0)
    reorder_quantity = Column(Numeric(10, 2), default=0.0)
    
    # Unit Information
    unit_type = Column(String, nullable=False)
    unit_cost = Column(Numeric(10, 2), default=0.0)
    selling_price = Column(Numeric(10, 2), default=0.0)
    currency = Column(String, default="NAD")
    
    # Supplier Information
    supplier_id = Column(String, nullable=True, index=True)
    supplier_sku = Column(String, nullable=True)
    lead_time_days = Column(Integer, default=0)
    
    # Item Properties
    status = Column(String, default=ItemStatus.ACTIVE)
    is_perishable = Column(Boolean, default=False)
    expiry_days = Column(Integer, nullable=True)
    storage_location = Column(String, nullable=True)
    storage_conditions = Column(JSON, default=dict)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("inventory_items.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    transaction_type = Column(String, nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    unit_cost = Column(Numeric(10, 2), nullable=True)
    total_cost = Column(Numeric(10, 2), nullable=True)
    
    # Reference Information
    reference_id = Column(String, nullable=True)  # Order ID, Transfer ID, etc.
    reference_type = Column(String, nullable=True)  # order, transfer, adjustment, etc.
    notes = Column(Text, nullable=True)
    
    # User Information
    performed_by = Column(String, nullable=False)
    approved_by = Column(String, nullable=True)
    
    # Timestamps
    transaction_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True)
    country = Column(String, nullable=True)
    
    # Business Information
    tax_id = Column(String, nullable=True)
    payment_terms = Column(String, nullable=True)
    credit_limit = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, default="NAD")
    
    # Status
    is_active = Column(Boolean, default=True)
    rating = Column(Integer, default=0)  # 1-5 stars
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    supplier_id = Column(String, ForeignKey("suppliers.id"), nullable=False, index=True)
    order_number = Column(String, unique=True, nullable=False, index=True)
    
    # Order Information
    status = Column(String, default=OrderStatus.PENDING)
    order_date = Column(DateTime, default=datetime.utcnow)
    expected_delivery = Column(DateTime, nullable=True)
    actual_delivery = Column(DateTime, nullable=True)
    
    # Financial Information
    subtotal = Column(Numeric(10, 2), default=0.0)
    tax_amount = Column(Numeric(10, 2), default=0.0)
    shipping_cost = Column(Numeric(10, 2), default=0.0)
    total_amount = Column(Numeric(10, 2), default=0.0)
    currency = Column(String, default="NAD")
    
    # User Information
    created_by = Column(String, nullable=False)
    approved_by = Column(String, nullable=True)
    received_by = Column(String, nullable=True)
    
    # Notes
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String, ForeignKey("purchase_orders.id"), nullable=False, index=True)
    item_id = Column(String, ForeignKey("inventory_items.id"), nullable=False, index=True)
    quantity_ordered = Column(Numeric(10, 2), nullable=False)
    quantity_received = Column(Numeric(10, 2), default=0.0)
    unit_cost = Column(Numeric(10, 2), nullable=False)
    total_cost = Column(Numeric(10, 2), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StockAlert(Base):
    __tablename__ = "stock_alerts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id = Column(String, ForeignKey("inventory_items.id"), nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    alert_type = Column(String, nullable=False)  # low_stock, out_of_stock, expiry
    current_stock = Column(Numeric(10, 2), nullable=False)
    threshold_value = Column(Numeric(10, 2), nullable=False)
    message = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    resolved_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class InventoryItemCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    item_type: ItemType
    category: Optional[str] = None
    sku: str
    barcode: Optional[str] = None
    current_stock: float = 0.0
    minimum_stock: float = 0.0
    maximum_stock: float = 0.0
    reorder_point: float = 0.0
    reorder_quantity: float = 0.0
    unit_type: UnitType
    unit_cost: float = 0.0
    selling_price: float = 0.0
    currency: str = "NAD"
    supplier_id: Optional[str] = None
    supplier_sku: Optional[str] = None
    lead_time_days: int = 0
    is_perishable: bool = False
    expiry_days: Optional[int] = None
    storage_location: Optional[str] = None
    storage_conditions: Optional[Dict[str, Any]] = {}
    settings: Optional[Dict[str, Any]] = {}

class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    item_type: Optional[ItemType] = None
    category: Optional[str] = None
    barcode: Optional[str] = None
    minimum_stock: Optional[float] = None
    maximum_stock: Optional[float] = None
    reorder_point: Optional[float] = None
    reorder_quantity: Optional[float] = None
    unit_type: Optional[UnitType] = None
    unit_cost: Optional[float] = None
    selling_price: Optional[float] = None
    currency: Optional[str] = None
    supplier_id: Optional[str] = None
    supplier_sku: Optional[str] = None
    lead_time_days: Optional[int] = None
    status: Optional[ItemStatus] = None
    is_perishable: Optional[bool] = None
    expiry_days: Optional[int] = None
    storage_location: Optional[str] = None
    storage_conditions: Optional[Dict[str, Any]] = None
    settings: Optional[Dict[str, Any]] = None

class StockAdjustment(BaseModel):
    item_id: str
    property_id: str
    adjustment_type: TransactionType
    quantity: float
    unit_cost: Optional[float] = None
    notes: Optional[str] = None
    reference_id: Optional[str] = None
    reference_type: Optional[str] = None

class SupplierCreate(BaseModel):
    property_id: str
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    tax_id: Optional[str] = None
    payment_terms: Optional[str] = None
    credit_limit: Optional[float] = None
    currency: str = "NAD"
    settings: Optional[Dict[str, Any]] = {}

class PurchaseOrderCreate(BaseModel):
    property_id: str
    supplier_id: str
    expected_delivery: Optional[datetime] = None
    notes: Optional[str] = None

class InventoryItemResponse(BaseModel):
    id: str
    property_id: str
    name: str
    description: Optional[str]
    item_type: str
    category: Optional[str]
    sku: str
    barcode: Optional[str]
    current_stock: float
    minimum_stock: float
    maximum_stock: float
    reorder_point: float
    reorder_quantity: float
    unit_type: str
    unit_cost: float
    selling_price: float
    currency: str
    supplier_id: Optional[str]
    supplier_sku: Optional[str]
    lead_time_days: int
    status: str
    is_perishable: bool
    expiry_days: Optional[int]
    storage_location: Optional[str]
    storage_conditions: Dict[str, Any]
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class InventoryMetrics(BaseModel):
    total_items: int
    active_items: int
    low_stock_items: int
    out_of_stock_items: int
    total_value: float
    items_by_type: Dict[str, int]
    items_by_status: Dict[str, int]
    total_suppliers: int
    active_suppliers: int
    pending_orders: int
    total_transactions_today: int

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
        logger.info("✅ Redis connected for inventory service")
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
    description="Inventory management and stock tracking microservice",
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
        "description": "Inventory management and stock tracking",
        "endpoints": {
            "health": "/health",
            "items": "/api/inventory/items",
            "transactions": "/api/inventory/transactions",
            "suppliers": "/api/inventory/suppliers",
            "orders": "/api/inventory/orders",
            "alerts": "/api/inventory/alerts",
            "metrics": "/api/inventory/metrics"
        }
    }

@app.get("/api/inventory/items", response_model=List[InventoryItemResponse])
async def get_inventory_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    item_type: Optional[ItemType] = None,
    status: Optional[ItemStatus] = None,
    low_stock: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get inventory items with filtering and search"""
    query = db.query(InventoryItem)
    
    if property_id:
        query = query.filter(InventoryItem.property_id == property_id)
    if item_type:
        query = query.filter(InventoryItem.item_type == item_type)
    if status:
        query = query.filter(InventoryItem.status == status)
    if low_stock:
        query = query.filter(InventoryItem.current_stock <= InventoryItem.minimum_stock)
    if search:
        query = query.filter(
            (InventoryItem.name.ilike(f"%{search}%")) |
            (InventoryItem.description.ilike(f"%{search}%")) |
            (InventoryItem.sku.ilike(f"%{search}%"))
        )
    
    items = query.order_by(InventoryItem.name).offset(skip).limit(limit).all()
    
    return [
        InventoryItemResponse(
            id=item.id,
            property_id=item.property_id,
            name=item.name,
            description=item.description,
            item_type=item.item_type,
            category=item.category,
            sku=item.sku,
            barcode=item.barcode,
            current_stock=float(item.current_stock),
            minimum_stock=float(item.minimum_stock),
            maximum_stock=float(item.maximum_stock),
            reorder_point=float(item.reorder_point),
            reorder_quantity=float(item.reorder_quantity),
            unit_type=item.unit_type,
            unit_cost=float(item.unit_cost),
            selling_price=float(item.selling_price),
            currency=item.currency,
            supplier_id=item.supplier_id,
            supplier_sku=item.supplier_sku,
            lead_time_days=item.lead_time_days,
            status=item.status,
            is_perishable=item.is_perishable,
            expiry_days=item.expiry_days,
            storage_location=item.storage_location,
            storage_conditions=item.storage_conditions,
            settings=item.settings,
            created_at=item.created_at,
            updated_at=item.updated_at
        )
        for item in items
    ]

@app.post("/api/inventory/items", response_model=InventoryItemResponse)
async def create_inventory_item(
    item_data: InventoryItemCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new inventory item"""
    # Check if SKU already exists
    existing_item = db.query(InventoryItem).filter(InventoryItem.sku == item_data.sku).first()
    if existing_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SKU already exists"
        )
    
    new_item = InventoryItem(
        property_id=item_data.property_id,
        name=item_data.name,
        description=item_data.description,
        item_type=item_data.item_type,
        category=item_data.category,
        sku=item_data.sku,
        barcode=item_data.barcode,
        current_stock=item_data.current_stock,
        minimum_stock=item_data.minimum_stock,
        maximum_stock=item_data.maximum_stock,
        reorder_point=item_data.reorder_point,
        reorder_quantity=item_data.reorder_quantity,
        unit_type=item_data.unit_type,
        unit_cost=item_data.unit_cost,
        selling_price=item_data.selling_price,
        currency=item_data.currency,
        supplier_id=item_data.supplier_id,
        supplier_sku=item_data.supplier_sku,
        lead_time_days=item_data.lead_time_days,
        is_perishable=item_data.is_perishable,
        expiry_days=item_data.expiry_days,
        storage_location=item_data.storage_location,
        storage_conditions=item_data.storage_conditions,
        settings=item_data.settings
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    # Create initial transaction if stock > 0
    if item_data.current_stock > 0:
        transaction = InventoryTransaction(
            item_id=new_item.id,
            property_id=new_item.property_id,
            transaction_type=TransactionType.IN,
            quantity=item_data.current_stock,
            unit_cost=item_data.unit_cost,
            total_cost=item_data.current_stock * item_data.unit_cost,
            notes="Initial stock",
            performed_by=current_user["user_id"]
        )
        db.add(transaction)
        db.commit()
    
    logger.info(f"✅ Inventory item created: {new_item.name}")
    
    return InventoryItemResponse(
        id=new_item.id,
        property_id=new_item.property_id,
        name=new_item.name,
        description=new_item.description,
        item_type=new_item.item_type,
        category=new_item.category,
        sku=new_item.sku,
        barcode=new_item.barcode,
        current_stock=float(new_item.current_stock),
        minimum_stock=float(new_item.minimum_stock),
        maximum_stock=float(new_item.maximum_stock),
        reorder_point=float(new_item.reorder_point),
        reorder_quantity=float(new_item.reorder_quantity),
        unit_type=new_item.unit_type,
        unit_cost=float(new_item.unit_cost),
        selling_price=float(new_item.selling_price),
        currency=new_item.currency,
        supplier_id=new_item.supplier_id,
        supplier_sku=new_item.supplier_sku,
        lead_time_days=new_item.lead_time_days,
        status=new_item.status,
        is_perishable=new_item.is_perishable,
        expiry_days=new_item.expiry_days,
        storage_location=new_item.storage_location,
        storage_conditions=new_item.storage_conditions,
        settings=new_item.settings,
        created_at=new_item.created_at,
        updated_at=new_item.updated_at
    )

@app.post("/api/inventory/adjustments")
async def adjust_stock(
    adjustment_data: StockAdjustment,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Adjust stock levels"""
    item = db.query(InventoryItem).filter(InventoryItem.id == adjustment_data.item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found"
        )
    
    # Calculate new stock level
    if adjustment_data.adjustment_type == TransactionType.IN:
        new_stock = float(item.current_stock) + adjustment_data.quantity
    elif adjustment_data.adjustment_type == TransactionType.OUT:
        new_stock = float(item.current_stock) - adjustment_data.quantity
        if new_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock"
            )
    else:  # ADJUSTMENT
        new_stock = adjustment_data.quantity
    
    # Update item stock
    item.current_stock = new_stock
    item.updated_at = datetime.utcnow()
    
    # Create transaction record
    transaction = InventoryTransaction(
        item_id=item.id,
        property_id=item.property_id,
        transaction_type=adjustment_data.adjustment_type,
        quantity=adjustment_data.quantity,
        unit_cost=adjustment_data.unit_cost,
        total_cost=adjustment_data.quantity * (adjustment_data.unit_cost or 0),
        reference_id=adjustment_data.reference_id,
        reference_type=adjustment_data.reference_type,
        notes=adjustment_data.notes,
        performed_by=current_user["user_id"]
    )
    
    db.add(transaction)
    db.commit()
    
    # Check for stock alerts
    if new_stock <= item.minimum_stock:
        alert = StockAlert(
            item_id=item.id,
            property_id=item.property_id,
            alert_type="low_stock",
            current_stock=new_stock,
            threshold_value=float(item.minimum_stock),
            message=f"Low stock alert for {item.name}. Current: {new_stock}, Minimum: {item.minimum_stock}"
        )
        db.add(alert)
        db.commit()
    
    logger.info(f"✅ Stock adjusted for {item.name}: {adjustment_data.quantity}")
    
    return {
        "message": "Stock adjusted successfully",
        "item_id": item.id,
        "new_stock": new_stock,
        "transaction_id": transaction.id
    }

@app.get("/api/inventory/alerts")
async def get_stock_alerts(
    property_id: Optional[str] = None,
    alert_type: Optional[str] = None,
    is_resolved: Optional[bool] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get stock alerts"""
    query = db.query(StockAlert)
    
    if property_id:
        query = query.filter(StockAlert.property_id == property_id)
    if alert_type:
        query = query.filter(StockAlert.alert_type == alert_type)
    if is_resolved is not None:
        query = query.filter(StockAlert.is_resolved == is_resolved)
    
    alerts = query.order_by(StockAlert.created_at.desc()).all()
    
    return [
        {
            "id": alert.id,
            "item_id": alert.item_id,
            "property_id": alert.property_id,
            "alert_type": alert.alert_type,
            "current_stock": float(alert.current_stock),
            "threshold_value": float(alert.threshold_value),
            "message": alert.message,
            "is_resolved": alert.is_resolved,
            "resolved_at": alert.resolved_at,
            "resolved_by": alert.resolved_by,
            "created_at": alert.created_at
        }
        for alert in alerts
    ]

@app.get("/api/inventory/metrics", response_model=InventoryMetrics)
async def get_inventory_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get inventory metrics"""
    query = db.query(InventoryItem)
    if property_id:
        query = query.filter(InventoryItem.property_id == property_id)
    
    # Get basic counts
    total_items = query.count()
    active_items = query.filter(InventoryItem.status == ItemStatus.ACTIVE).count()
    low_stock_items = query.filter(InventoryItem.current_stock <= InventoryItem.minimum_stock).count()
    out_of_stock_items = query.filter(InventoryItem.current_stock <= 0).count()
    
    # Calculate total value
    items = query.filter(InventoryItem.status == ItemStatus.ACTIVE).all()
    total_value = sum(float(item.current_stock) * float(item.unit_cost) for item in items)
    
    # Get items by type
    items_by_type = {}
    for item_type in ItemType:
        count = query.filter(InventoryItem.item_type == item_type).count()
        items_by_type[item_type] = count
    
    # Get items by status
    items_by_status = {}
    for status in ItemStatus:
        count = query.filter(InventoryItem.status == status).count()
        items_by_status[status] = count
    
    # Get supplier counts
    supplier_query = db.query(Supplier)
    if property_id:
        supplier_query = supplier_query.filter(Supplier.property_id == property_id)
    
    total_suppliers = supplier_query.count()
    active_suppliers = supplier_query.filter(Supplier.is_active == True).count()
    
    # Get pending orders
    order_query = db.query(PurchaseOrder)
    if property_id:
        order_query = order_query.filter(PurchaseOrder.property_id == property_id)
    
    pending_orders = order_query.filter(PurchaseOrder.status == OrderStatus.PENDING).count()
    
    # Get transactions today
    today = datetime.utcnow().date()
    transactions_today = db.query(InventoryTransaction).filter(
        db.func.date(InventoryTransaction.transaction_date) == today
    ).count()
    
    return InventoryMetrics(
        total_items=total_items,
        active_items=active_items,
        low_stock_items=low_stock_items,
        out_of_stock_items=out_of_stock_items,
        total_value=total_value,
        items_by_type=items_by_type,
        items_by_status=items_by_status,
        total_suppliers=total_suppliers,
        active_suppliers=active_suppliers,
        pending_orders=pending_orders,
        total_transactions_today=transactions_today
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )