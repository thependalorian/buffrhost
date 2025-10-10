"""
Buffr Host Menu Service
Comprehensive menu management for Buffr Host platform
"""

import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager
from enum import Enum

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator
import jwt
from supabase import create_client, Client
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables
supabase_client: Optional[Client] = None
security = HTTPBearer()

# JWT Configuration
JWT_ACCESS_SECRET = os.getenv("JWT_ACCESS_SECRET", "buffr-host-access-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"

class ItemStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"
    SEASONAL = "seasonal"

class ItemCategory(str, Enum):
    APPETIZER = "appetizer"
    MAIN_COURSE = "main_course"
    DESSERT = "dessert"
    BEVERAGE = "beverage"
    SIDE_DISH = "side_dish"
    SALAD = "salad"
    SOUP = "soup"
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"

class AllergenType(str, Enum):
    GLUTEN = "gluten"
    DAIRY = "dairy"
    NUTS = "nuts"
    PEANUTS = "peanuts"
    SOY = "soy"
    EGGS = "eggs"
    FISH = "fish"
    SHELLFISH = "shellfish"
    SESAME = "sesame"

class DietaryType(str, Enum):
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTEN_FREE = "gluten_free"
    DAIRY_FREE = "dairy_free"
    KETO = "keto"
    PALEO = "paleo"
    LOW_CARB = "low_carb"
    HIGH_PROTEIN = "high_protein"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Menu Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import MenuserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = MenuserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Menu Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Menu Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Menu Service Service...")# Create FastAPI app
app = FastAPI(
    title="Buffr Host Menu Service",
    description="Menu management for Buffr Host platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Pydantic Models
class MenuItemModifier(BaseModel):
    name: str
    price_adjustment: float = 0.0
    is_required: bool = False
    options: List[str] = []

class MenuItem(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category: ItemCategory
    status: ItemStatus = ItemStatus.ACTIVE
    allergens: List[AllergenType] = []
    dietary_info: List[DietaryType] = []
    calories: Optional[int] = Field(None, ge=0)
    preparation_time: Optional[int] = Field(None, ge=0)  # minutes
    images: List[str] = []
    modifiers: List[MenuItemModifier] = []
    ingredients: List[str] = []
    tags: List[str] = []
    is_featured: bool = False
    sort_order: int = 0

class MenuCategory(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True
    image: Optional[str] = None

class CreateMenuRequest(BaseModel):
    property_id: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    categories: List[MenuCategory] = []
    items: List[MenuItem] = []
    is_active: bool = True
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None

class MenuResponse(BaseModel):
    id: str
    property_id: str
    name: str
    description: Optional[str]
    categories: List[MenuCategory]
    items: List[MenuItem]
    is_active: bool
    valid_from: Optional[str]
    valid_until: Optional[str]
    created_at: str
    updated_at: str

class UpdateMenuRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    categories: Optional[List[MenuCategory]] = None
    items: Optional[List[MenuItem]] = None
    is_active: Optional[bool] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None

class MenuItemResponse(BaseModel):
    id: str
    menu_id: str
    name: str
    description: Optional[str]
    price: float
    category: ItemCategory
    status: ItemStatus
    allergens: List[AllergenType]
    dietary_info: List[DietaryType]
    calories: Optional[int]
    preparation_time: Optional[int]
    images: List[str]
    modifiers: List[MenuItemModifier]
    ingredients: List[str]
    tags: List[str]
    is_featured: bool
    sort_order: int
    created_at: str
    updated_at: str

# Utility Functions
def verify_jwt_token(token: str) -> Dict[str, Any]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_ACCESS_SECRET, algorithms=[JWT_ALGORITHM])
        
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

# Authentication Dependencies
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    # Get user from database
    result = supabase_client.table("users").select("*").eq("id", payload["sub"]).execute()
    
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    user = result.data[0]
    
    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    return user

async def require_role(required_role: str):
    """Require specific role for endpoint access"""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user["role"]
        
        # Role hierarchy: admin > manager > staff > customer
        role_hierarchy = {"admin": 4, "manager": 3, "staff": 2, "customer": 1}
        
        if role_hierarchy.get(user_role, 0) < role_hierarchy.get(required_role, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {required_role}"
            )
        
        return current_user
    
    return role_checker

# API Endpoints
@app.post("/menus", response_model=MenuResponse)
async def create_menu(
    menu_data: CreateMenuRequest,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Create a new menu"""
    try:
        # Validate property exists
        property_result = supabase_client.table("properties").select("id").eq("id", menu_data.property_id).execute()
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Property not found"
            )
        
        # Create menu record
        menu_id = str(uuid.uuid4())
        menu_record = {
            "id": menu_id,
            "property_id": menu_data.property_id,
            "name": menu_data.name,
            "description": menu_data.description,
            "categories": [category.dict() for category in menu_data.categories],
            "items": [item.dict() for item in menu_data.items],
            "is_active": menu_data.is_active,
            "valid_from": menu_data.valid_from.isoformat() if menu_data.valid_from else None,
            "valid_until": menu_data.valid_until.isoformat() if menu_data.valid_until else None,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("menus").insert(menu_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create menu"
            )
        
        return MenuResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create menu error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create menu"
        )

@app.get("/menus/{menu_id}", response_model=MenuResponse)
async def get_menu(
    menu_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get menu by ID"""
    try:
        result = supabase_client.table("menus").select("*").eq("id", menu_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        menu = result.data[0]
        
        # Check if user has access to this menu's property
        property_result = supabase_client.table("properties").select("owner_id").eq("id", menu["property_id"]).execute()
        
        if property_result.data:
            property_data = property_result.data[0]
            user_role = current_user["role"]
            if user_role not in ["admin", "manager", "staff"] and property_data["owner_id"] != current_user["id"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this menu"
                )
        
        return MenuResponse(**menu)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get menu error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get menu"
        )

@app.get("/menus", response_model=List[MenuResponse])
async def list_menus(
    property_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """List menus with filters"""
    try:
        query = supabase_client.table("menus").select("*")
        
        # Apply filters
        if property_id:
            query = query.eq("property_id", property_id)
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        menus = [MenuResponse(**menu) for menu in result.data]
        return menus
        
    except Exception as e:
        logger.error(f"List menus error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list menus"
        )

@app.put("/menus/{menu_id}", response_model=MenuResponse)
async def update_menu(
    menu_id: str,
    menu_update: UpdateMenuRequest,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Update menu"""
    try:
        # Get current menu
        menu_result = supabase_client.table("menus").select("*").eq("id", menu_id).execute()
        
        if not menu_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in menu_update.dict().items() if v is not None}
        
        # Convert nested objects to dict
        if "categories" in update_data:
            update_data["categories"] = [category.dict() for category in update_data["categories"]]
        if "items" in update_data:
            update_data["items"] = [item.dict() for item in update_data["items"]]
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update menu
        result = supabase_client.table("menus").update(update_data).eq("id", menu_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update menu"
            )
        
        return MenuResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update menu error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update menu"
        )

@app.post("/menus/{menu_id}/items", response_model=MenuItemResponse)
async def add_menu_item(
    menu_id: str,
    item_data: MenuItem,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Add item to menu"""
    try:
        # Get current menu
        menu_result = supabase_client.table("menus").select("*").eq("id", menu_id).execute()
        
        if not menu_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        menu = menu_result.data[0]
        
        # Add item to menu
        items = menu["items"]
        item_id = str(uuid.uuid4())
        new_item = {
            "id": item_id,
            "menu_id": menu_id,
            **item_data.dict(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        items.append(new_item)
        
        # Update menu
        result = supabase_client.table("menus").update({
            "items": items,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", menu_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to add menu item"
            )
        
        return MenuItemResponse(**new_item)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Add menu item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add menu item"
        )

@app.put("/menus/{menu_id}/items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    menu_id: str,
    item_id: str,
    item_update: MenuItem,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Update menu item"""
    try:
        # Get current menu
        menu_result = supabase_client.table("menus").select("*").eq("id", menu_id).execute()
        
        if not menu_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        menu = menu_result.data[0]
        items = menu["items"]
        
        # Find item to update
        item_index = None
        for i, item in enumerate(items):
            if item["id"] == item_id:
                item_index = i
                break
        
        if item_index is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu item not found"
            )
        
        # Update item
        updated_item = {
            **items[item_index],
            **item_update.dict(),
            "updated_at": datetime.utcnow().isoformat()
        }
        items[item_index] = updated_item
        
        # Update menu
        result = supabase_client.table("menus").update({
            "items": items,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", menu_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update menu item"
            )
        
        return MenuItemResponse(**updated_item)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update menu item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update menu item"
        )

@app.delete("/menus/{menu_id}/items/{item_id}")
async def delete_menu_item(
    menu_id: str,
    item_id: str,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Delete menu item"""
    try:
        # Get current menu
        menu_result = supabase_client.table("menus").select("*").eq("id", menu_id).execute()
        
        if not menu_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        menu = menu_result.data[0]
        items = menu["items"]
        
        # Find item to delete
        item_index = None
        for i, item in enumerate(items):
            if item["id"] == item_id:
                item_index = i
                break
        
        if item_index is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu item not found"
            )
        
        # Remove item
        items.pop(item_index)
        
        # Update menu
        result = supabase_client.table("menus").update({
            "items": items,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", menu_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete menu item"
            )
        
        return {"message": "Menu item deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete menu item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete menu item"
        )

@app.get("/menus/property/{property_id}", response_model=List[MenuResponse])
async def get_property_menus(
    property_id: str,
    active_only: bool = True,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get menus for a specific property"""
    try:
        query = supabase_client.table("menus").select("*").eq("property_id", property_id)
        
        if active_only:
            query = query.eq("is_active", True)
        
        result = query.order("created_at", desc=True).execute()
        
        menus = [MenuResponse(**menu) for menu in result.data]
        return menus
        
    except Exception as e:
        logger.error(f"Get property menus error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property menus"
        )

@app.get("/menus/{menu_id}/items", response_model=List[MenuItemResponse])
async def get_menu_items(
    menu_id: str,
    category: Optional[ItemCategory] = None,
    status: Optional[ItemStatus] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get items for a specific menu"""
    try:
        # Get menu
        menu_result = supabase_client.table("menus").select("items").eq("id", menu_id).execute()
        
        if not menu_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Menu not found"
            )
        
        items_data = menu_result.data[0]["items"]
        
        # Filter items
        filtered_items = items_data
        
        if category:
            filtered_items = [item for item in filtered_items if item["category"] == category.value]
        
        if status:
            filtered_items = [item for item in filtered_items if item["status"] == status.value]
        
        items = [MenuItemResponse(**item) for item in filtered_items]
        return items
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get menu items error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get menu items"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "menu-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8003,
        reload=True,
        log_level="info"
    )