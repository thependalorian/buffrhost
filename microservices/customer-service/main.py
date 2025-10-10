"""
Buffr Host Customer Service
Comprehensive customer management and loyalty programs for Buffr Host platform
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
from pydantic import BaseModel, Field, validator, EmailStr
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

class CustomerStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    VIP = "vip"

class LoyaltyTier(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"
    DIAMOND = "diamond"

class NotificationPreference(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    NONE = "none"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global supabase_client
    
    # Startup
    logger.info("Starting Buffr Host Customer Service Service...")
    
    try:
        # Initialize Supabase client
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase configuration")
        
        supabase_client = create_client(supabase_url, supabase_key)
        
        # Run database migrations
        try:
            from shared.supabase_migrations.supabase_migration_runner import CustomerserviceServiceSupabaseMigrationRunner
            database_url = os.getenv("DATABASE_URL")
            if database_url:
                migration_runner = CustomerserviceServiceSupabaseMigrationRunner(database_url)
                migration_success = await migration_runner.run_migrations()
                if migration_success:
                    logger.info("Database migrations completed successfully")
                else:
                    logger.warning("Database migrations failed - continuing anyway")
            else:
                logger.warning("No DATABASE_URL provided - skipping migrations")
        except Exception as migration_error:
            logger.error(f"Migration error: {migration_error} - continuing anyway")
        
        logger.info("Customer Service Service initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Customer Service Service: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down Customer Service Service...")# Create FastAPI app
app = FastAPI(
    title="Buffr Host Customer Service",
    description="Customer management and loyalty programs for Buffr Host platform",
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
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"
    is_primary: bool = False

class ContactInfo(BaseModel):
    phone: str = Field(..., regex=r'^\+?[1-9]\d{1,14}$')
    email: EmailStr
    alternate_phone: Optional[str] = None
    alternate_email: Optional[EmailStr] = None

class LoyaltyProgram(BaseModel):
    tier: LoyaltyTier = LoyaltyTier.BRONZE
    points: int = 0
    total_spent: float = 0.0
    visits_count: int = 0
    last_visit: Optional[str] = None
    join_date: str

class Preferences(BaseModel):
    dietary_restrictions: List[str] = []
    allergies: List[str] = []
    favorite_cuisines: List[str] = []
    preferred_payment_method: Optional[str] = None
    notification_preferences: List[NotificationPreference] = [NotificationPreference.EMAIL]
    marketing_consent: bool = False

class CreateCustomerRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    contact_info: ContactInfo
    addresses: List[Address] = []
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    preferences: Preferences = Preferences()
    status: CustomerStatus = CustomerStatus.ACTIVE
    notes: Optional[str] = None
    referral_source: Optional[str] = None

class CustomerResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    contact_info: ContactInfo
    addresses: List[Address]
    date_of_birth: Optional[str]
    gender: Optional[str]
    preferences: Preferences
    loyalty_program: LoyaltyProgram
    status: CustomerStatus
    notes: Optional[str]
    referral_source: Optional[str]
    created_at: str
    updated_at: str

class UpdateCustomerRequest(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    contact_info: Optional[ContactInfo] = None
    addresses: Optional[List[Address]] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    preferences: Optional[Preferences] = None
    status: Optional[CustomerStatus] = None
    notes: Optional[str] = None

class LoyaltyTransaction(BaseModel):
    customer_id: str
    points_earned: int = 0
    points_redeemed: int = 0
    transaction_type: str  # earn, redeem, expire, bonus
    description: str
    order_id: Optional[str] = None
    amount: Optional[float] = None

class LoyaltyTransactionResponse(BaseModel):
    id: str
    customer_id: str
    points_earned: int
    points_redeemed: int
    transaction_type: str
    description: str
    order_id: Optional[str]
    amount: Optional[float]
    created_at: str

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

def calculate_loyalty_tier(total_spent: float, visits_count: int) -> LoyaltyTier:
    """Calculate loyalty tier based on spending and visits"""
    if total_spent >= 10000 or visits_count >= 100:
        return LoyaltyTier.DIAMOND
    elif total_spent >= 5000 or visits_count >= 50:
        return LoyaltyTier.PLATINUM
    elif total_spent >= 2000 or visits_count >= 25:
        return LoyaltyTier.GOLD
    elif total_spent >= 500 or visits_count >= 10:
        return LoyaltyTier.SILVER
    else:
        return LoyaltyTier.BRONZE

def calculate_points_earned(amount: float, tier: LoyaltyTier) -> int:
    """Calculate points earned based on amount and tier"""
    base_rate = 1  # 1 point per dollar
    tier_multiplier = {
        LoyaltyTier.BRONZE: 1.0,
        LoyaltyTier.SILVER: 1.2,
        LoyaltyTier.GOLD: 1.5,
        LoyaltyTier.PLATINUM: 2.0,
        LoyaltyTier.DIAMOND: 2.5
    }
    
    return int(amount * base_rate * tier_multiplier.get(tier, 1.0))

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
@app.post("/customers", response_model=CustomerResponse)
async def create_customer(
    customer_data: CreateCustomerRequest,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Create a new customer"""
    try:
        # Check if customer already exists by email
        existing_customer = supabase_client.table("customers").select("id").eq("contact_info->>email", customer_data.contact_info.email).execute()
        
        if existing_customer.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Customer with this email already exists"
            )
        
        # Create customer record
        customer_id = str(uuid.uuid4())
        loyalty_program = LoyaltyProgram(
            tier=LoyaltyTier.BRONZE,
            points=0,
            total_spent=0.0,
            visits_count=0,
            join_date=datetime.utcnow().isoformat()
        )
        
        customer_record = {
            "id": customer_id,
            "first_name": customer_data.first_name,
            "last_name": customer_data.last_name,
            "contact_info": customer_data.contact_info.dict(),
            "addresses": [address.dict() for address in customer_data.addresses],
            "date_of_birth": customer_data.date_of_birth,
            "gender": customer_data.gender,
            "preferences": customer_data.preferences.dict(),
            "loyalty_program": loyalty_program.dict(),
            "status": customer_data.status.value,
            "notes": customer_data.notes,
            "referral_source": customer_data.referral_source,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("customers").insert(customer_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create customer"
            )
        
        return CustomerResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create customer error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create customer"
        )

@app.get("/customers/{customer_id}", response_model=CustomerResponse)
async def get_customer(
    customer_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get customer by ID"""
    try:
        result = supabase_client.table("customers").select("*").eq("id", customer_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        customer = result.data[0]
        
        # Check if user has access to this customer
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and customer["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this customer"
            )
        
        return CustomerResponse(**customer)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get customer error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get customer"
        )

@app.get("/customers", response_model=List[CustomerResponse])
async def list_customers(
    skip: int = 0,
    limit: int = 100,
    status: Optional[CustomerStatus] = None,
    loyalty_tier: Optional[LoyaltyTier] = None,
    search: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """List customers with filters"""
    try:
        query = supabase_client.table("customers").select("*")
        
        # Apply filters
        if status:
            query = query.eq("status", status.value)
        if loyalty_tier:
            query = query.eq("loyalty_program->>tier", loyalty_tier.value)
        if search:
            query = query.or_(f"first_name.ilike.%{search}%,last_name.ilike.%{search}%,contact_info->>email.ilike.%{search}%")
        
        # Apply pagination
        result = query.range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        customers = [CustomerResponse(**customer) for customer in result.data]
        return customers
        
    except Exception as e:
        logger.error(f"List customers error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to list customers"
        )

@app.put("/customers/{customer_id}", response_model=CustomerResponse)
async def update_customer(
    customer_id: str,
    customer_update: UpdateCustomerRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Update customer"""
    try:
        # Get current customer
        customer_result = supabase_client.table("customers").select("*").eq("id", customer_id).execute()
        
        if not customer_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        customer = customer_result.data[0]
        
        # Check if user has access to update this customer
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and customer["id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to update this customer"
            )
        
        # Prepare update data
        update_data = {k: v for k, v in customer_update.dict().items() if v is not None}
        
        # Convert nested objects to dict
        if "contact_info" in update_data:
            update_data["contact_info"] = update_data["contact_info"].dict()
        if "addresses" in update_data:
            update_data["addresses"] = [address.dict() for address in update_data["addresses"]]
        if "preferences" in update_data:
            update_data["preferences"] = update_data["preferences"].dict()
        
        update_data["updated_at"] = datetime.utcnow().isoformat()
        
        # Update customer
        result = supabase_client.table("customers").update(update_data).eq("id", customer_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update customer"
            )
        
        return CustomerResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update customer error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update customer"
        )

@app.post("/customers/{customer_id}/loyalty/earn", response_model=LoyaltyTransactionResponse)
async def earn_loyalty_points(
    customer_id: str,
    transaction_data: LoyaltyTransaction,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Earn loyalty points for customer"""
    try:
        # Get customer
        customer_result = supabase_client.table("customers").select("*").eq("id", customer_id).execute()
        
        if not customer_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        customer = customer_result.data[0]
        loyalty_program = customer["loyalty_program"]
        
        # Calculate new tier and points
        new_total_spent = loyalty_program["total_spent"] + (transaction_data.amount or 0)
        new_points = loyalty_program["points"] + transaction_data.points_earned
        new_tier = calculate_loyalty_tier(new_total_spent, loyalty_program["visits_count"])
        
        # Update loyalty program
        updated_loyalty = {
            "tier": new_tier.value,
            "points": new_points,
            "total_spent": new_total_spent,
            "visits_count": loyalty_program["visits_count"] + 1,
            "last_visit": datetime.utcnow().isoformat()
        }
        
        # Update customer
        supabase_client.table("customers").update({
            "loyalty_program": updated_loyalty,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", customer_id).execute()
        
        # Create loyalty transaction record
        transaction_id = str(uuid.uuid4())
        transaction_record = {
            "id": transaction_id,
            "customer_id": customer_id,
            "points_earned": transaction_data.points_earned,
            "points_redeemed": 0,
            "transaction_type": transaction_data.transaction_type,
            "description": transaction_data.description,
            "order_id": transaction_data.order_id,
            "amount": transaction_data.amount,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("loyalty_transactions").insert(transaction_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create loyalty transaction"
            )
        
        return LoyaltyTransactionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Earn loyalty points error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to earn loyalty points"
        )

@app.post("/customers/{customer_id}/loyalty/redeem", response_model=LoyaltyTransactionResponse)
async def redeem_loyalty_points(
    customer_id: str,
    points_to_redeem: int,
    description: str,
    current_user: Dict[str, Any] = Depends(require_role("staff"))
):
    """Redeem loyalty points for customer"""
    try:
        # Get customer
        customer_result = supabase_client.table("customers").select("*").eq("id", customer_id).execute()
        
        if not customer_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        customer = customer_result.data[0]
        loyalty_program = customer["loyalty_program"]
        
        # Check if customer has enough points
        if loyalty_program["points"] < points_to_redeem:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient loyalty points"
            )
        
        # Update loyalty program
        updated_loyalty = {
            **loyalty_program,
            "points": loyalty_program["points"] - points_to_redeem
        }
        
        # Update customer
        supabase_client.table("customers").update({
            "loyalty_program": updated_loyalty,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", customer_id).execute()
        
        # Create loyalty transaction record
        transaction_id = str(uuid.uuid4())
        transaction_record = {
            "id": transaction_id,
            "customer_id": customer_id,
            "points_earned": 0,
            "points_redeemed": points_to_redeem,
            "transaction_type": "redeem",
            "description": description,
            "created_by": current_user["id"],
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase_client.table("loyalty_transactions").insert(transaction_record).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create loyalty transaction"
            )
        
        return LoyaltyTransactionResponse(**result.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Redeem loyalty points error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to redeem loyalty points"
        )

@app.get("/customers/{customer_id}/loyalty/transactions", response_model=List[LoyaltyTransactionResponse])
async def get_loyalty_transactions(
    customer_id: str,
    skip: int = 0,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Get loyalty transactions for customer"""
    try:
        # Check if user has access to this customer
        customer_result = supabase_client.table("customers").select("id").eq("id", customer_id).execute()
        
        if not customer_result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found"
            )
        
        user_role = current_user["role"]
        if user_role not in ["admin", "manager", "staff"] and customer_id != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this customer's transactions"
            )
        
        # Get transactions
        result = supabase_client.table("loyalty_transactions").select("*").eq("customer_id", customer_id).range(skip, skip + limit - 1).order("created_at", desc=True).execute()
        
        transactions = [LoyaltyTransactionResponse(**transaction) for transaction in result.data]
        return transactions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get loyalty transactions error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get loyalty transactions"
        )

@app.get("/customers/analytics/summary")
async def get_customer_analytics(
    property_id: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    current_user: Dict[str, Any] = Depends(require_role("manager"))
):
    """Get customer analytics summary"""
    try:
        # Get customers
        query = supabase_client.table("customers").select("*")
        
        if date_from:
            query = query.gte("created_at", date_from.isoformat())
        
        if date_to:
            query = query.lte("created_at", date_to.isoformat())
        
        result = query.execute()
        customers = result.data
        
        # Calculate analytics
        total_customers = len(customers)
        active_customers = len([c for c in customers if c["status"] == CustomerStatus.ACTIVE.value])
        
        # Loyalty tier breakdown
        tier_counts = {}
        for customer in customers:
            tier = customer["loyalty_program"]["tier"]
            tier_counts[tier] = tier_counts.get(tier, 0) + 1
        
        # Total loyalty points
        total_points = sum(c["loyalty_program"]["points"] for c in customers)
        
        # Total spending
        total_spending = sum(c["loyalty_program"]["total_spent"] for c in customers)
        
        # Average spending per customer
        avg_spending = total_spending / total_customers if total_customers > 0 else 0
        
        return {
            "total_customers": total_customers,
            "active_customers": active_customers,
            "inactive_customers": total_customers - active_customers,
            "loyalty_tier_breakdown": tier_counts,
            "total_loyalty_points": total_points,
            "total_spending": round(total_spending, 2),
            "average_spending_per_customer": round(avg_spending, 2),
            "period": {
                "from": date_from.isoformat() if date_from else None,
                "to": date_to.isoformat() if date_to else None
            }
        }
        
    except Exception as e:
        logger.error(f"Get customer analytics error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get customer analytics"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "customer-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8004,
        reload=True,
        log_level="info"
    )