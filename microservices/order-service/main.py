"""
Buffr Host Order Service
Comprehensive order processing, fulfillment, and management for Buffr Host platform
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

# Order Configuration
ORDER_TIMEOUT_MINUTES = 30
AUTO_CANCEL_HOURS = 24

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    PICKED_UP = "picked_up"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class OrderType(str, Enum):
    DINE_IN = "dine_in"
    TAKEAWAY = "takeaway"
    DELIVERY = "delivery"
    PICKUP = "pickup"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Order Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import OrderserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = OrderserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Order Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Order Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Order Service Service...")# Create FastAPI app
app = FastAPI(
    title="Buffr Host Order Service",
    description="Order processing, fulfillment, and management for Buffr Host platform",
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
class OrderItem(BaseModel):
    menu_item_id: str
    quantity: int = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    special_instructions: Optional[str] = None
    modifiers: Optional[List[Dict[str, Any]]] = None

class CreateOrderRequest(BaseModel):
    customer_id: str
    property_id: str
    order_type: OrderType
    items: List[OrderItem] = Field(..., min_items=1)
    delivery_address: Optional[Dict[str, Any]] = None
    special_instructions: Optional[str] = None
    estimated_ready_time: Optional[datetime] = None
    payment_method: str = Field(..., regex="^(cash|card|digital_wallet|bank_transfer)$")
    tip_amount: Optional[float] = Field(0, ge=0)
    
    @validator('delivery_address')
    def validate_delivery_address(cls, v, values):
        if values.get('order_type') == OrderType.DELIVERY and not v:
            raise ValueError('Delivery address is required for delivery orders')
        return v

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_id: str
    property_id: str
    order_type: OrderType
    status: OrderStatus
    payment_status: PaymentStatus
    items: List[Dict[str, Any]]
    subtotal: float
    tax_amount: float
    tip_amount: float
    delivery_fee: float
    total_amount: float
    delivery_address: Optional[Dict[str, Any]]
    special_instructions: Optional[str]
    estimated_ready_time: Optional[str]
    actual_ready_time: Optional[str]
    payment_method: str
    created_at: str
    updated_at: str

class UpdateOrderStatusRequest(BaseModel):
    status: OrderStatus
    notes: Optional[str] = None

class OrderFilter(BaseModel):
    status: Optional[OrderStatus] = None
    order_type: Optional[OrderType] = None
    customer_id: Optional[str] = None
    property_id: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

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

def generate_order_number() -> str:
    """Generate unique order number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"ORD-{timestamp}-{random_suffix}"

def calculate_order_totals(items: List[OrderItem], tip_amount: float = 0, delivery_fee: float = 0) -> Dict[str, float]:
    """Calculate order totals"""
    subtotal = sum(item.quantity * item.unit_price for item in items)
    tax_rate = 0.0875  # 8.75% tax rate - should be configurable
    tax_amount = subtotal * tax_rate
    total_amount = subtotal + tax_amount + tip_amount + delivery_fee
    
    return {
        "subtotal": round(subtotal, 2),
        "tax_amount": round(tax_amount, 2),
        "tip_amount": round(tip_amount, 2),
        "delivery_fee": round(delivery_fee, 2),
        "total_amount": round(total_amount, 2)
    }

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
@app.post("/orders", response_model=OrderResponse)
async def create_order(
    order_data: CreateOrderRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Create a new order"""
    try:
        # Validate customer exists
        customer_result = supabase_client.table("customers").select("id").eq("id", order_data.customer_id).execute()
        if not customer_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Customer not found"
            )
        
        # Validate property exists
        property_result = supabase_client.table("properties").select("id").eq("id", order_data.property_id).execute()
        if not property_result.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Property not found"
            )
        
        # Validate menu items exist and get current prices
        menu_item_ids = [item.menu_item_id for item in order_data.items]
        menu_result = supabase_client.table("menu_items").select("id,price").in_("id", menu_item_ids).execute()
        
        if not menu_result.data or len(menu_result.data) != len(menu_item_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more menu items not found"
            )
        
        # Update item prices with current menu prices
        menu_prices = {item["id"]: item["price"] for item in menu_result.data}
        for item in order_data.items:
            item.unit_price = menu_prices[item.menu_item_id]
        
        # Calculate totals
        totals = calculate_order_totals(
            order_data.items,
            order_data.tip_amount,
            delivery_fee=5.0 if order_data.order_type == OrderType.DELIVERY else 0.0
        )
        
        # Generate order number
        order_number = generate_order_number()
        
        # Create order record
        order_id = str(uuid.uuid4())
        order_record = {
            "id": order_id,
            "order_number": order_number,
            "customer_id": order_data.customer_id,
            "property_id": order_data.property_id,
            "order_type": order_data.order_type.value,
            "status": OrderStatus.PENDING.value,
            "payment_status": PaymentStatus.PENDING.value,
            "items": [item.dict() for item in order_data.items],
            "subtotal": totals["subtotal"],
            "tax_amount": totals["tax_amount"],
            "tip_amount": totals["tip_amount"],
            "delivery_fee": totals["delivery_fee"],
            "total_amount": totals["total_amount"],
            "delivery_address": order_data.delivery_address,
            "special_instructions": order_data.special_instructions,
            "estimated_ready_time": order_data.estimated_ready_time.isoformat() if order_data.estimated_ready_time else None,
            "payment_method": order_data.payment_method,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("orders").insert(order_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create order"
            )
        
        # Create order status history
        status_history = {
            "order_id": order_id,
            "status": OrderStatus.PENDING.value,
            "notes": "Order created",
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase_client.table("order_status_history").insert(status_history).execute()
        
        # Return order response
        order = result.data[0]
        return OrderResponse(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create order error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create order"
        )

@app.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get order by ID"""
    try:
        result = supabase_client.table("orders").select("*").eq("id", order_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        order = result.data[0]
        
        # Check if user has access to this order
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and order["customer_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this order"
            )
        
        return OrderResponse(**order)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get order error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get order"
        )

@app.get("/orders", response_model=List[OrderResponse])
async def list_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[OrderStatus] = None,
    order_type: Optional[OrderType] = None,
    customer_id: Optional[str] = None,
    property_id: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """List orders with filters"""
    try:
        query = supabase_client.table("orders").select("*")
        
        # Apply filters
        if status:
            query = query.eq("status", status.value)
        if order_type:
            query = query.eq("order_type", order_type.value)
        if customer_id:
            query = query.eq("customer_id", customer_id)
        if property_id:
            query = query.eq("property_id", property_id)
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        orders = [OrderResponse(**order) for order in result.data]
        return orders
        
    except Exception as e:
        logger.error(f"List orders error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list orders"
        )

@app.put("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: UpdateOrderStatusRequest,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Update order status"""
    try:
        # Get current order
        order_result = supabase_client.table("orders").select("*").eq("id", order_id).execute()
        
        if not order_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        current_order = order_result.data[0]
        
        # Validate status transition
        current_status = OrderStatus(current_order["status"])
        new_status = status_update.status
        
        # Define valid status transitions
        valid_transitions = {
            OrderStatus.PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
            OrderStatus.CONFIRMED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
            OrderStatus.PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
            OrderStatus.READY: [OrderStatus.DELIVERED, OrderStatus.PICKED_UP, OrderStatus.COMPLETED],
            OrderStatus.DELIVERED: [OrderStatus.COMPLETED],
            OrderStatus.PICKED_UP: [OrderStatus.COMPLETED],
            OrderStatus.COMPLETED: [],
            OrderStatus.CANCELLED: [],
            OrderStatus.REFUNDED: []
        }
        
        if new_status not in valid_transitions.get(current_status, []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status transition from {current_status.value} to {new_status.value}"
            )
        
        # Update order
        update_data = {
            "status": new_status.value,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        # Set actual ready time if status is READY
        if new_status == OrderStatus.READY and current_status != OrderStatus.READY:
            update_data["actual_ready_time"] = datetime.utcnow().isoformat()
        
        result = supabase_client.table("orders").update(update_data).eq("id", order_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update order status"
            )
        
        # Create status history entry
        status_history = {
            "order_id": order_id,
            "status": new_status.value,
            "notes": status_update.notes or f"Status updated to {new_status.value}",
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase_client.table("order_status_history").insert(status_history).execute()
        
        return OrderResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update order status error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update order status"
        )

@app.get("/orders/{order_id}/status-history")
async def get_order_status_history(
    order_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get order status history"""
    try:
        # Check if user has access to this order
        order_result = supabase_client.table("orders").select("customer_id").eq("id", order_id).execute()
        
        if not order_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        order = order_result.data[0]
        user_role = current_user["role"]
        
        if user_role not in ["admin", "manager", "staff"] and order["customer_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this order"
            )
        
        # Get status history
        result = supabase_client.table("order_status_history").select("*").eq("order_id", order_id).order("created_at", desc=True).execute()
        
        return result.data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get order status history error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get order status history"
        )

@app.get("/orders/customer/{customer_id}", response_model=List[OrderResponse])
async def get_customer_orders(
    customer_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get orders for a specific customer"""
    try:
        # Check if user has access to this customer's orders
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and customer_id != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to customer orders"
            )
        
        result = supabase_client.table("orders").select("*").eq("customer_id", customer_id).range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        orders = [OrderResponse(**order) for order in result.data]
        return orders
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get customer orders error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get customer orders"
        )

@app.get("/orders/property/{property_id}", response_model=List[OrderResponse])
async def get_property_orders(
    property_id: str,
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Get orders for a specific property"""
    try:
        result = supabase_client.table("orders").select("*").eq("property_id", property_id).range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        orders = [OrderResponse(**order) for order in result.data]
        return orders
        
    except Exception as e:
        logger.error(f"Get property orders error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get property orders"
        )

@app.get("/orders/analytics/summary")
async def get_order_analytics(
    property_id: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Get order analytics summary"""
    try:
        query = supabase_client.table("orders").select("*")
        
        if property_id:
            query = query.eq("property_id", property_id)
        
        if date_from:
            query = query.gte("created_at", date_from.isoformat())
        
        if date_to:
            query = query.lte("created_at", date_to.isoformat())
        
        result = query.execute()
        orders = result.data
        
        # Calculate analytics
        total_orders = len(orders)
        total_revenue = sum(order["total_amount"] for order in orders)
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        status_counts = {}
        order_type_counts = {}
        
        for order in orders:
            status = order["status"]
            order_type = order["order_type"]
            
            status_counts[status] = status_counts.get(status, 0) + 1
            order_type_counts[order_type] = order_type_counts.get(order_type, 0) + 1
        
        return {
            "total_orders": total_orders,
            "total_revenue": round(total_revenue, 2),
            "average_order_value": round(avg_order_value, 2),
            "status_breakdown": status_counts,
            "order_type_breakdown": order_type_counts,
            "period": {
                "from": date_from.isoformat() if date_from else None,
                "to": date_to.isoformat() if date_to else None
            }
        }
        
    except Exception as e:
        logger.error(f"Get order analytics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get order analytics"
        )

@app.post("/orders/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    reason: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Cancel an order"""
    try:
        # Get current order
        order_result = supabase_client.table("orders").select("*").eq("id", order_id).execute()
        
        if not order_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Order not found"
            )
        
        order = order_result.data[0]
        
        # Check if user can cancel this order
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and order["customer_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to cancel this order"
            )
        
        # Check if order can be cancelled
        current_status = OrderStatus(order["status"])
        if current_status in [OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REFUNDED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Order cannot be cancelled in current status"
            )
        
        # Update order status
        update_data = {
            "status": OrderStatus.CANCELLED.value,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("orders").update(update_data).eq("id", order_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to cancel order"
            )
        
        # Create status history entry
        status_history = {
            "order_id": order_id,
            "status": OrderStatus.CANCELLED.value,
            "notes": reason or "Order cancelled",
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        supabase_client.table("order_status_history").insert(status_history).execute()
        
        return {"message": "Order cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Cancel order error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to cancel order"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "order-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8013,
        reload=True,
        log_level="info"
    )