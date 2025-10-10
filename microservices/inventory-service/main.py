"""
Buffr Host Inventory Service
Comprehensive inventory and stock management for Buffr Host platform
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
    DISCONTINUED = "discontinued"
    OUT_OF_STOCK = "out_of_stock"

class ItemCategory(str, Enum):
    FOOD = "food"
    BEVERAGE = "beverage"
    SUPPLIES = "supplies"
    EQUIPMENT = "equipment"
    CLEANING = "cleaning"
    OFFICE = "office"
    MAINTENANCE = "maintenance"

class UnitType(str, Enum):
    PIECE = "piece"
    KILOGRAM = "kilogram"
    GRAM = "gram"
    LITER = "liter"
    MILLILITER = "milliliter"
    POUND = "pound"
    OUNCE = "ounce"
    GALLON = "gallon"
    BOX = "box"
    CASE = "case"

class TransactionType(str, Enum):
    IN = "in"
    OUT = "out"
    ADJUSTMENT = "adjustment"
    TRANSFER = "transfer"
    WASTE = "waste"
    RETURN = "return"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Inventory Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import InventoryserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = InventoryserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Inventory Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Inventory Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Inventory Service Service...")# Create FastAPI app
app = FastAPI(
    title="Buffr Host Inventory Service",
    description="Inventory and stock management for Buffr Host platform",
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
class Supplier(BaseModel):
    name: str
    contact_person: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    is_active: bool = True

class CreateInventoryItemRequest(BaseModel):
    property_id: str
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: ItemCategory
    unit_type: UnitType
    unit_cost: float = Field(..., gt=0)
    selling_price: Optional[float] = Field(None, gt=0)
    sku: Optional[str] = None
    barcode: Optional[str] = None
    supplier: Optional[Supplier] = None
    min_stock_level: int = Field(0, ge=0)
    max_stock_level: Optional[int] = Field(None, gt=0)
    reorder_point: int = Field(0, ge=0)
    reorder_quantity: int = Field(0, gt=0)
    shelf_life_days: Optional[int] = Field(None, gt=0)
    storage_location: Optional[str] = None
    status: ItemStatus = ItemStatus.ACTIVE
    tags: List[str] = []

class InventoryItemResponse(BaseModel):
    id: str
    property_id: str
    name: str
    description: Optional[str]
    category: ItemCategory
    unit_type: UnitType
    unit_cost: float
    selling_price: Optional[float]
    sku: Optional[str]
    barcode: Optional[str]
    supplier: Optional[Supplier]
    current_stock: int
    min_stock_level: int
    max_stock_level: Optional[int]
    reorder_point: int
    reorder_quantity: int
    shelf_life_days: Optional[int]
    storage_location: Optional[str]
    status: ItemStatus
    tags: List[str]
    created_at: str
    updated_at: str

class UpdateInventoryItemRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[ItemCategory] = None
    unit_type: Optional[UnitType] = None
    unit_cost: Optional[float] = Field(None, gt=0)
    selling_price: Optional[float] = Field(None, gt=0)
    sku: Optional[str] = None
    barcode: Optional[str] = None
    supplier: Optional[Supplier] = None
    min_stock_level: Optional[int] = Field(None, ge=0)
    max_stock_level: Optional[int] = Field(None, gt=0)
    reorder_point: Optional[int] = Field(None, ge=0)
    reorder_quantity: Optional[int] = Field(None, gt=0)
    shelf_life_days: Optional[int] = Field(None, gt=0)
    storage_location: Optional[str] = None
    status: Optional[ItemStatus] = None
    tags: Optional[List[str]] = None

class StockTransaction(BaseModel):
    item_id: str
    transaction_type: TransactionType
    quantity: int
    unit_cost: Optional[float] = None
    reference_number: Optional[str] = None
    notes: Optional[str] = None
    expiry_date: Optional[str] = None

class StockTransactionResponse(BaseModel):
    id: str
    item_id: str
    transaction_type: TransactionType
    quantity: int
    unit_cost: Optional[float]
    reference_number: Optional[str]
    notes: Optional[str]
    expiry_date: Optional[str]
    created_by: str
    created_at: str

class StockAdjustment(BaseModel):
    item_id: str
    new_quantity: int
    reason: str
    notes: Optional[str] = None

class LowStockAlert(BaseModel):
    item_id: str
    item_name: str
    current_stock: int
    min_stock_level: int
    reorder_point: int
    reorder_quantity: int
    days_until_stockout: Optional[int] = None

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

def generate_sku(name: str, category: ItemCategory) -> str:
    """Generate SKU from name and category"""
    name_prefix = "".join([word[:2].upper() for word in name.split()[:2]])
    category_prefix = category.value[:3].upper()
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"{category_prefix}-{name_prefix}-{random_suffix}"

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
@app.post("/inventory/items", response_model=InventoryItemResponse)
async def create_inventory_item(
    item_data: CreateInventoryItemRequest,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Create a new inventory item"""
    try:
        # Validate property exists
        property_result = supabase_client.table("properties").select("id").eq("id", item_data.property_id).execute()
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Property not found"
            )
        
        # Generate SKU if not provided
        sku = item_data.sku or generate_sku(item_data.name, item_data.category)
        
        # Create inventory item record
        item_id = str(uuid.uuid4())
        item_record = {
            "id": item_id,
            "property_id": item_data.property_id,
            "name": item_data.name,
            "description": item_data.description,
            "category": item_data.category.value,
            "unit_type": item_data.unit_type.value,
            "unit_cost": item_data.unit_cost,
            "selling_price": item_data.selling_price,
            "sku": sku,
            "barcode": item_data.barcode,
            "supplier": item_data.supplier.dict() if item_data.supplier else None,
            "current_stock": 0,
            "min_stock_level": item_data.min_stock_level,
            "max_stock_level": item_data.max_stock_level,
            "reorder_point": item_data.reorder_point,
            "reorder_quantity": item_data.reorder_quantity,
            "shelf_life_days": item_data.shelf_life_days,
            "storage_location": item_data.storage_location,
            "status": item_data.status.value,
            "tags": item_data.tags,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("inventory_items").insert(item_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create inventory item"
            )
        
        return InventoryItemResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create inventory item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create inventory item"
        )

@app.get("/inventory/items/{item_id}", response_model=InventoryItemResponse)
async def get_inventory_item(
    item_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get inventory item by ID"""
    try:
        result = supabase_client.table("inventory_items").select("*").eq("id", item_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory item not found"
            )
        
        return InventoryItemResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get inventory item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get inventory item"
        )

@app.get("/inventory/items", response_model=List[InventoryItemResponse])
async def list_inventory_items(
    property_id: Optional[str] = None,
    category: Optional[ItemCategory] = None,
    status: Optional[ItemStatus] = None,
    low_stock_only: bool = False,
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """List inventory items with filters"""
    try:
        query = supabase_client.table("inventory_items").select("*")
        
        # Apply filters
        if property_id:
            query = query.eq("property_id", property_id)
        if category:
            query = query.eq("category", category.value)
        if status:
            query = query.eq("status", status.value)
        if low_stock_only:
            query = query.filter("current_stock", "lte", "min_stock_level")
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        items = [InventoryItemResponse(**item) for item in result.data]
        return items
        
    except Exception as e:
        logger.error(f"List inventory items error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list inventory items"
        )

@app.put("/inventory/items/{item_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    item_id: str,
    item_update: UpdateInventoryItemRequest,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Update inventory item"""
    try:
        # Get current item
        item_result = supabase_client.table("inventory_items").select("*").eq("id", item_id).execute()
        
        if not item_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory item not found"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in item_update.dict().items() if v is not None}
        
        # Convert nested objects to dict
        if "supplier" in update_data:
            update_data["supplier"] = update_data["supplier"].dict()
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update item
        result = supabase_client.table("inventory_items").update(update_data).eq("id", item_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update inventory item"
            )
        
        return InventoryItemResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update inventory item error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update inventory item"
        )

@app.post("/inventory/transactions", response_model=StockTransactionResponse)
async def create_stock_transaction(
    transaction_data: StockTransaction,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Create stock transaction"""
    try:
        # Get inventory item
        item_result = supabase_client.table("inventory_items").select("*").eq("id", transaction_data.item_id).execute()
        
        if not item_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory item not found"
            )
        
        item = item_result.data[0]
        
        # Calculate new stock level
        current_stock = item["current_stock"]
        quantity_change = transaction_data.quantity
        
        if transaction_data.transaction_type in [TransactionType.OUT, TransactionType.WASTE, TransactionType.RETURN]:
            quantity_change = -quantity_change
        
        new_stock = current_stock + quantity_change
        
        # Validate stock level
        if new_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient stock for this transaction"
            )
        
        # Create transaction record
        transaction_id = str(uuid.uuid4())
        transaction_record = {
            "id": transaction_id,
            "item_id": transaction_data.item_id,
            "transaction_type": transaction_data.transaction_type.value,
            "quantity": transaction_data.quantity,
            "unit_cost": transaction_data.unit_cost,
            "reference_number": transaction_data.reference_number,
            "notes": transaction_data.notes,
            "expiry_date": transaction_data.expiry_date,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insert transaction
        result = supabase_client.table("stock_transactions").insert(transaction_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create stock transaction"
            )
        
        # Update item stock
        supabase_client.table("inventory_items").update({
            "current_stock": new_stock,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", transaction_data.item_id).execute()
        
        return StockTransactionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create stock transaction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create stock transaction"
        )

@app.post("/inventory/adjustments")
async def adjust_stock(
    adjustment_data: StockAdjustment,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Adjust stock level"""
    try:
        # Get inventory item
        item_result = supabase_client.table("inventory_items").select("*").eq("id", adjustment_data.item_id).execute()
        
        if not item_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inventory item not found"
            )
        
        item = item_result.data[0]
        current_stock = item["current_stock"]
        new_stock = adjustment_data.new_quantity
        
        # Validate new stock level
        if new_stock < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stock level cannot be negative"
            )
        
        # Calculate adjustment quantity
        adjustment_quantity = abs(new_stock - current_stock)
        transaction_type = TransactionType.IN if new_stock > current_stock else TransactionType.OUT
        
        # Create adjustment transaction
        transaction_data = StockTransaction(
            item_id=adjustment_data.item_id,
            transaction_type=transaction_type,
            quantity=adjustment_quantity,
            notes=f"Stock adjustment: {adjustment_data.reason}. {adjustment_data.notes or ''}"
        )
        
        transaction_response = await create_stock_transaction(transaction_data, current_user)
        
        return {
            "message": "Stock adjusted successfully",
            "transaction": transaction_response,
            "old_stock": current_stock,
            "new_stock": new_stock
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Adjust stock error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to adjust stock"
        )

@app.get("/inventory/transactions/{item_id}", response_model=List[StockTransactionResponse])
async def get_item_transactions(
    item_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get transactions for an inventory item"""
    try:
        result = supabase_client.table("stock_transactions").select("*").eq("item_id", item_id).range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        transactions = [StockTransactionResponse(**transaction) for transaction in result.data]
        return transactions
        
    except Exception as e:
        logger.error(f"Get item transactions error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get item transactions"
        )

@app.get("/inventory/alerts/low-stock", response_model=List[LowStockAlert])
async def get_low_stock_alerts(
    property_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Get low stock alerts"""
    try:
        query = supabase_client.table("inventory_items").select("*")
        
        if property_id:
            query = query.eq("property_id", property_id)
        
        # Filter for low stock items
        query = query.filter("current_stock", "lte", "min_stock_level")
        
        result = query.execute()
        
        alerts = []
        for item in result.data:
            # Calculate days until stockout (simplified calculation)
            daily_usage = 1  # This should be calculated based on historical data
            days_until_stockout = item["current_stock"] // daily_usage if daily_usage > 0 else None
            
            alert = LowStockAlert(
                item_id=item["id"],
                item_name=item["name"],
                current_stock=item["current_stock"],
                min_stock_level=item["min_stock_level"],
                reorder_point=item["reorder_point"],
                reorder_quantity=item["reorder_quantity"],
                days_until_stockout=days_until_stockout
            )
            alerts.append(alert)
        
        return alerts
        
    except Exception as e:
        logger.error(f"Get low stock alerts error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get low stock alerts"
        )

@app.get("/inventory/analytics/summary")
async def get_inventory_analytics(
    property_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Get inventory analytics summary"""
    try:
        query = supabase_client.table("inventory_items").select("*")
        
        if property_id:
            query = query.eq("property_id", property_id)
        
        result = query.execute()
        items = result.data
        
        # Calculate analytics
        total_items = len(items)
        active_items = len([item for item in items if item["status"] == ItemStatus.ACTIVE.value])
        low_stock_items = len([item for item in items if item["current_stock"] <= item["min_stock_level"]])
        out_of_stock_items = len([item for item in items if item["current_stock"] == 0])
        
        # Category breakdown
        category_counts = {}
        for item in items:
            category = item["category"]
            category_counts[category] = category_counts.get(category, 0) + 1
        
        # Total inventory value
        total_value = sum(item["current_stock"] * item["unit_cost"] for item in items)
        
        # Average stock level
        avg_stock = sum(item["current_stock"] for item in items) / total_items if total_items > 0 else 0
        
        return {
            "total_items": total_items,
            "active_items": active_items,
            "low_stock_items": low_stock_items,
            "out_of_stock_items": out_of_stock_items,
            "category_breakdown": category_counts,
            "total_inventory_value": round(total_value, 2),
            "average_stock_level": round(avg_stock, 2),
            "stock_turnover_rate": 0.0  # This would need historical data to calculate
        }
        
    except Exception as e:
        logger.error(f"Get inventory analytics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get inventory analytics"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "inventory-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8005,
        reload=True,
        log_level="info"
    )