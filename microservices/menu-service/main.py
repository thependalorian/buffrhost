"""
Buffr Host Menu Service - Microservice
Handles menu management, categories, and food service for Buffr Host platform
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
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_menus")
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
SERVICE_NAME = "menu-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8003))

# Enums
class MenuStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"
    ARCHIVED = "archived"

class ItemStatus(str, Enum):
    AVAILABLE = "available"
    UNAVAILABLE = "unavailable"
    OUT_OF_STOCK = "out_of_stock"
    DISCONTINUED = "discontinued"

class CategoryType(str, Enum):
    FOOD = "food"
    BEVERAGE = "beverage"
    DESSERT = "dessert"
    APPETIZER = "appetizer"
    MAIN_COURSE = "main_course"
    SIDE_DISH = "side_dish"
    SPECIALTY = "specialty"

class DietaryInfo(str, Enum):
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    NUT_FREE = "nut_free"
    HALAL = "halal"
    KOSHER = "kosher"

# Database Models
class Menu(Base):
    __tablename__ = "menus"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    menu_type = Column(String, nullable=False)  # breakfast, lunch, dinner, etc.
    status = Column(String, default=MenuStatus.ACTIVE)
    
    # Timing Information
    available_from = Column(DateTime, nullable=True)
    available_until = Column(DateTime, nullable=True)
    valid_days = Column(JSON, default=list)  # [monday, tuesday, etc.]
    
    # Display Information
    display_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    image_url = Column(String, nullable=True)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MenuCategory(Base):
    __tablename__ = "menu_categories"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    menu_id = Column(String, ForeignKey("menus.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    category_type = Column(String, nullable=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    menu_id = Column(String, ForeignKey("menus.id"), nullable=False, index=True)
    category_id = Column(String, ForeignKey("menu_categories.id"), nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    short_description = Column(String, nullable=True)
    
    # Pricing Information
    base_price = Column(Float, nullable=False)
    currency = Column(String, default="NAD")
    tax_rate = Column(Float, default=0.0)
    
    # Item Information
    status = Column(String, default=ItemStatus.AVAILABLE)
    is_featured = Column(Boolean, default=False)
    is_spicy = Column(Boolean, default=False)
    spice_level = Column(Integer, default=0)  # 0-5
    
    # Dietary Information
    dietary_info = Column(JSON, default=list)
    allergens = Column(JSON, default=list)
    calories = Column(Integer, nullable=True)
    prep_time_minutes = Column(Integer, nullable=True)
    
    # Display Information
    display_order = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    
    # Inventory Information
    track_inventory = Column(Boolean, default=False)
    inventory_item_id = Column(String, nullable=True)
    low_stock_threshold = Column(Integer, default=0)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MenuModifier(Base):
    __tablename__ = "menu_modifiers"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    menu_item_id = Column(String, ForeignKey("menu_items.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    modifier_type = Column(String, nullable=False)  # single_choice, multiple_choice, addon
    is_required = Column(Boolean, default=False)
    max_selections = Column(Integer, default=1)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ModifierOption(Base):
    __tablename__ = "modifier_options"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    modifier_id = Column(String, ForeignKey("menu_modifiers.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price_adjustment = Column(Float, default=0.0)
    is_default = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MenuTemplate(Base):
    __tablename__ = "menu_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    template_type = Column(String, nullable=False)  # restaurant, cafe, bar, etc.
    cuisine_type = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)
    created_by = Column(String, nullable=False)
    template_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class MenuCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    menu_type: str
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    valid_days: Optional[List[str]] = []
    display_order: int = 0
    is_featured: bool = False
    image_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = {}

class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    menu_type: Optional[str] = None
    status: Optional[MenuStatus] = None
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    valid_days: Optional[List[str]] = None
    display_order: Optional[int] = None
    is_featured: Optional[bool] = None
    image_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class MenuCategoryCreate(BaseModel):
    menu_id: str
    name: str
    description: Optional[str] = None
    category_type: CategoryType
    display_order: int = 0
    image_url: Optional[str] = None

class MenuItemCreate(BaseModel):
    menu_id: str
    category_id: str
    name: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    base_price: float
    currency: str = "NAD"
    tax_rate: float = 0.0
    status: ItemStatus = ItemStatus.AVAILABLE
    is_featured: bool = False
    is_spicy: bool = False
    spice_level: int = 0
    dietary_info: Optional[List[DietaryInfo]] = []
    allergens: Optional[List[str]] = []
    calories: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    display_order: int = 0
    image_url: Optional[str] = None
    tags: Optional[List[str]] = []
    track_inventory: bool = False
    inventory_item_id: Optional[str] = None
    low_stock_threshold: int = 0
    settings: Optional[Dict[str, Any]] = {}

class MenuModifierCreate(BaseModel):
    menu_item_id: str
    name: str
    description: Optional[str] = None
    modifier_type: str
    is_required: bool = False
    max_selections: int = 1
    display_order: int = 0

class ModifierOptionCreate(BaseModel):
    modifier_id: str
    name: str
    description: Optional[str] = None
    price_adjustment: float = 0.0
    is_default: bool = False
    display_order: int = 0

class MenuResponse(BaseModel):
    id: str
    property_id: str
    name: str
    description: Optional[str]
    menu_type: str
    status: str
    available_from: Optional[datetime]
    available_until: Optional[datetime]
    valid_days: List[str]
    display_order: int
    is_featured: bool
    image_url: Optional[str]
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class MenuItemResponse(BaseModel):
    id: str
    menu_id: str
    category_id: str
    name: str
    description: Optional[str]
    short_description: Optional[str]
    base_price: float
    currency: str
    tax_rate: float
    status: str
    is_featured: bool
    is_spicy: bool
    spice_level: int
    dietary_info: List[str]
    allergens: List[str]
    calories: Optional[int]
    prep_time_minutes: Optional[int]
    display_order: int
    image_url: Optional[str]
    tags: List[str]
    track_inventory: bool
    inventory_item_id: Optional[str]
    low_stock_threshold: int
    settings: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class MenuMetrics(BaseModel):
    total_menus: int
    active_menus: int
    total_categories: int
    total_items: int
    items_by_status: Dict[str, int]
    items_by_category: Dict[str, int]
    average_item_price: float
    featured_items: int

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
        logger.info("✅ Redis connected for menu service")
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
    description="Menu management and food service microservice",
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
        "description": "Menu management and food service",
        "endpoints": {
            "health": "/health",
            "menus": "/api/menus",
            "categories": "/api/menus/categories",
            "items": "/api/menus/items",
            "modifiers": "/api/menus/modifiers",
            "templates": "/api/menus/templates",
            "metrics": "/api/menus/metrics"
        }
    }

@app.get("/api/menus", response_model=List[MenuResponse])
async def get_menus(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    menu_type: Optional[str] = None,
    status: Optional[MenuStatus] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get menus with filtering and search"""
    query = db.query(Menu)
    
    if property_id:
        query = query.filter(Menu.property_id == property_id)
    if menu_type:
        query = query.filter(Menu.menu_type == menu_type)
    if status:
        query = query.filter(Menu.status == status)
    if is_featured is not None:
        query = query.filter(Menu.is_featured == is_featured)
    if search:
        query = query.filter(
            (Menu.name.ilike(f"%{search}%")) |
            (Menu.description.ilike(f"%{search}%"))
        )
    
    menus = query.order_by(Menu.display_order, Menu.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        MenuResponse(
            id=menu.id,
            property_id=menu.property_id,
            name=menu.name,
            description=menu.description,
            menu_type=menu.menu_type,
            status=menu.status,
            available_from=menu.available_from,
            available_until=menu.available_until,
            valid_days=menu.valid_days,
            display_order=menu.display_order,
            is_featured=menu.is_featured,
            image_url=menu.image_url,
            settings=menu.settings,
            created_at=menu.created_at,
            updated_at=menu.updated_at
        )
        for menu in menus
    ]

@app.post("/api/menus", response_model=MenuResponse)
async def create_menu(
    menu_data: MenuCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new menu"""
    new_menu = Menu(
        property_id=menu_data.property_id,
        name=menu_data.name,
        description=menu_data.description,
        menu_type=menu_data.menu_type,
        available_from=menu_data.available_from,
        available_until=menu_data.available_until,
        valid_days=menu_data.valid_days,
        display_order=menu_data.display_order,
        is_featured=menu_data.is_featured,
        image_url=menu_data.image_url,
        settings=menu_data.settings
    )
    
    db.add(new_menu)
    db.commit()
    db.refresh(new_menu)
    
    logger.info(f"✅ Menu created: {new_menu.name}")
    
    return MenuResponse(
        id=new_menu.id,
        property_id=new_menu.property_id,
        name=new_menu.name,
        description=new_menu.description,
        menu_type=new_menu.menu_type,
        status=new_menu.status,
        available_from=new_menu.available_from,
        available_until=new_menu.available_until,
        valid_days=new_menu.valid_days,
        display_order=new_menu.display_order,
        is_featured=new_menu.is_featured,
        image_url=new_menu.image_url,
        settings=new_menu.settings,
        created_at=new_menu.created_at,
        updated_at=new_menu.updated_at
    )

@app.get("/api/menus/{menu_id}", response_model=MenuResponse)
async def get_menu(
    menu_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific menu by ID"""
    menu = db.query(Menu).filter(Menu.id == menu_id).first()
    if not menu:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu not found"
        )
    
    return MenuResponse(
        id=menu.id,
        property_id=menu.property_id,
        name=menu.name,
        description=menu.description,
        menu_type=menu.menu_type,
        status=menu.status,
        available_from=menu.available_from,
        available_until=menu.available_until,
        valid_days=menu.valid_days,
        display_order=menu.display_order,
        is_featured=menu.is_featured,
        image_url=menu.image_url,
        settings=menu.settings,
        created_at=menu.created_at,
        updated_at=menu.updated_at
    )

@app.get("/api/menus/{menu_id}/items", response_model=List[MenuItemResponse])
async def get_menu_items(
    menu_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category_id: Optional[str] = None,
    status: Optional[ItemStatus] = None,
    is_featured: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get menu items with filtering"""
    query = db.query(MenuItem).filter(MenuItem.menu_id == menu_id)
    
    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    if status:
        query = query.filter(MenuItem.status == status)
    if is_featured is not None:
        query = query.filter(MenuItem.is_featured == is_featured)
    if search:
        query = query.filter(
            (MenuItem.name.ilike(f"%{search}%")) |
            (MenuItem.description.ilike(f"%{search}%"))
        )
    
    items = query.order_by(MenuItem.display_order, MenuItem.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        MenuItemResponse(
            id=item.id,
            menu_id=item.menu_id,
            category_id=item.category_id,
            name=item.name,
            description=item.description,
            short_description=item.short_description,
            base_price=item.base_price,
            currency=item.currency,
            tax_rate=item.tax_rate,
            status=item.status,
            is_featured=item.is_featured,
            is_spicy=item.is_spicy,
            spice_level=item.spice_level,
            dietary_info=item.dietary_info,
            allergens=item.allergens,
            calories=item.calories,
            prep_time_minutes=item.prep_time_minutes,
            display_order=item.display_order,
            image_url=item.image_url,
            tags=item.tags,
            track_inventory=item.track_inventory,
            inventory_item_id=item.inventory_item_id,
            low_stock_threshold=item.low_stock_threshold,
            settings=item.settings,
            created_at=item.created_at,
            updated_at=item.updated_at
        )
        for item in items
    ]

@app.post("/api/menus/items", response_model=MenuItemResponse)
async def create_menu_item(
    item_data: MenuItemCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new menu item"""
    new_item = MenuItem(
        menu_id=item_data.menu_id,
        category_id=item_data.category_id,
        name=item_data.name,
        description=item_data.description,
        short_description=item_data.short_description,
        base_price=item_data.base_price,
        currency=item_data.currency,
        tax_rate=item_data.tax_rate,
        status=item_data.status,
        is_featured=item_data.is_featured,
        is_spicy=item_data.is_spicy,
        spice_level=item_data.spice_level,
        dietary_info=item_data.dietary_info,
        allergens=item_data.allergens,
        calories=item_data.calories,
        prep_time_minutes=item_data.prep_time_minutes,
        display_order=item_data.display_order,
        image_url=item_data.image_url,
        tags=item_data.tags,
        track_inventory=item_data.track_inventory,
        inventory_item_id=item_data.inventory_item_id,
        low_stock_threshold=item_data.low_stock_threshold,
        settings=item_data.settings
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    logger.info(f"✅ Menu item created: {new_item.name}")
    
    return MenuItemResponse(
        id=new_item.id,
        menu_id=new_item.menu_id,
        category_id=new_item.category_id,
        name=new_item.name,
        description=new_item.description,
        short_description=new_item.short_description,
        base_price=new_item.base_price,
        currency=new_item.currency,
        tax_rate=new_item.tax_rate,
        status=new_item.status,
        is_featured=new_item.is_featured,
        is_spicy=new_item.is_spicy,
        spice_level=new_item.spice_level,
        dietary_info=new_item.dietary_info,
        allergens=new_item.allergens,
        calories=new_item.calories,
        prep_time_minutes=new_item.prep_time_minutes,
        display_order=new_item.display_order,
        image_url=new_item.image_url,
        tags=new_item.tags,
        track_inventory=new_item.track_inventory,
        inventory_item_id=new_item.inventory_item_id,
        low_stock_threshold=new_item.low_stock_threshold,
        settings=new_item.settings,
        created_at=new_item.created_at,
        updated_at=new_item.updated_at
    )

@app.get("/api/menus/metrics", response_model=MenuMetrics)
async def get_menu_metrics(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get menu metrics"""
    # Get basic counts
    total_menus = db.query(Menu).count()
    active_menus = db.query(Menu).filter(Menu.status == MenuStatus.ACTIVE).count()
    total_categories = db.query(MenuCategory).count()
    total_items = db.query(MenuItem).count()
    
    # Get items by status
    items_by_status = {}
    for status in ItemStatus:
        count = db.query(MenuItem).filter(MenuItem.status == status).count()
        items_by_status[status] = count
    
    # Get items by category
    items_by_category = {}
    categories = db.query(MenuCategory).all()
    for category in categories:
        count = db.query(MenuItem).filter(MenuItem.category_id == category.id).count()
        items_by_category[category.name] = count
    
    # Get average item price
    items = db.query(MenuItem).filter(MenuItem.base_price > 0).all()
    average_item_price = 0.0
    if items:
        average_item_price = sum(item.base_price for item in items) / len(items)
    
    # Get featured items count
    featured_items = db.query(MenuItem).filter(MenuItem.is_featured == True).count()
    
    return MenuMetrics(
        total_menus=total_menus,
        active_menus=active_menus,
        total_categories=total_categories,
        total_items=total_items,
        items_by_status=items_by_status,
        items_by_category=items_by_category,
        average_item_price=average_item_price,
        featured_items=featured_items
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )