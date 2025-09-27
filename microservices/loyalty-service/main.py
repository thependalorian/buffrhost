"""
Buffr Host Loyalty Service - Microservice
Handles loyalty programs, points, rewards, and customer retention for Buffr Host platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_loyalty")
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
SERVICE_NAME = "loyalty-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8008))

# Enums
class LoyaltyTier(str, Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"
    DIAMOND = "diamond"

class TransactionType(str, Enum):
    EARN = "earn"
    REDEEM = "redeem"
    EXPIRED = "expired"
    ADJUSTMENT = "adjustment"
    TRANSFER = "transfer"

class RewardType(str, Enum):
    DISCOUNT = "discount"
    FREE_ITEM = "free_item"
    UPGRADE = "upgrade"
    CASHBACK = "cashback"
    EXPERIENCE = "experience"

class ProgramStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

# Database Models
class LoyaltyProgram(Base):
    __tablename__ = "loyalty_programs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Program Configuration
    status = Column(String, default=ProgramStatus.ACTIVE)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    
    # Points Configuration
    points_per_currency_unit = Column(Numeric(10, 4), default=1.0)
    currency_unit = Column(String, default="NAD")
    minimum_redemption_points = Column(Integer, default=100)
    points_expiry_days = Column(Integer, nullable=True)
    
    # Tier Configuration
    tier_configuration = Column(JSON, default=dict)
    
    # Program Rules
    earning_rules = Column(JSON, default=list)
    redemption_rules = Column(JSON, default=list)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LoyaltyMember(Base):
    __tablename__ = "loyalty_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String, ForeignKey("loyalty_programs.id"), nullable=False, index=True)
    customer_id = Column(String, nullable=False, index=True)
    property_id = Column(String, nullable=False, index=True)
    
    # Membership Information
    membership_number = Column(String, unique=True, nullable=False, index=True)
    tier = Column(String, default=LoyaltyTier.BRONZE)
    status = Column(String, default="active")
    
    # Points Information
    current_points = Column(Integer, default=0)
    lifetime_points = Column(Integer, default=0)
    redeemed_points = Column(Integer, default=0)
    expired_points = Column(Integer, default=0)
    
    # Membership Dates
    joined_date = Column(DateTime, default=datetime.utcnow)
    last_activity_date = Column(DateTime, nullable=True)
    tier_upgrade_date = Column(DateTime, nullable=True)
    
    # Statistics
    total_visits = Column(Integer, default=0)
    total_spent = Column(Numeric(10, 2), default=0.0)
    average_order_value = Column(Numeric(10, 2), default=0.0)
    
    # Settings
    preferences = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    member_id = Column(String, ForeignKey("loyalty_members.id"), nullable=False, index=True)
    transaction_type = Column(String, nullable=False)
    points_amount = Column(Integer, nullable=False)
    
    # Reference Information
    reference_id = Column(String, nullable=True)  # Order ID, etc.
    reference_type = Column(String, nullable=True)  # order, manual, etc.
    
    # Transaction Details
    description = Column(Text, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    
    # Balance Information
    points_before = Column(Integer, nullable=False)
    points_after = Column(Integer, nullable=False)
    
    # User Information
    processed_by = Column(String, nullable=True)
    
    # Timestamps
    transaction_date = Column(DateTime, default=datetime.utcnow)

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String, ForeignKey("loyalty_programs.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Reward Configuration
    reward_type = Column(String, nullable=False)
    points_cost = Column(Integer, nullable=False)
    tier_requirement = Column(String, nullable=True)
    
    # Reward Details
    reward_value = Column(Numeric(10, 2), nullable=True)
    reward_details = Column(JSON, default=dict)
    
    # Availability
    is_active = Column(Boolean, default=True)
    available_from = Column(DateTime, nullable=True)
    available_until = Column(DateTime, nullable=True)
    max_redemptions = Column(Integer, nullable=True)
    current_redemptions = Column(Integer, default=0)
    
    # Settings
    settings = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    member_id = Column(String, ForeignKey("loyalty_members.id"), nullable=False, index=True)
    reward_id = Column(String, ForeignKey("rewards.id"), nullable=False, index=True)
    
    # Redemption Information
    redemption_code = Column(String, unique=True, nullable=False, index=True)
    points_used = Column(Integer, nullable=False)
    status = Column(String, default="pending")
    
    # Usage Information
    used_at = Column(DateTime, nullable=True)
    used_by = Column(String, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    
    # Reference Information
    order_id = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    redeemed_at = Column(DateTime, default=datetime.utcnow)

class LoyaltyCampaign(Base):
    __tablename__ = "loyalty_campaigns"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    program_id = Column(String, ForeignKey("loyalty_programs.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # Campaign Configuration
    campaign_type = Column(String, nullable=False)  # bonus_points, double_points, etc.
    status = Column(String, default="draft")
    
    # Campaign Period
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    
    # Campaign Rules
    target_criteria = Column(JSON, default=dict)
    bonus_multiplier = Column(Numeric(5, 2), default=1.0)
    bonus_points = Column(Integer, default=0)
    
    # Statistics
    total_participants = Column(Integer, default=0)
    total_points_awarded = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Pydantic Models
class LoyaltyProgramCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    points_per_currency_unit: float = 1.0
    currency_unit: str = "NAD"
    minimum_redemption_points: int = 100
    points_expiry_days: Optional[int] = None
    tier_configuration: Optional[Dict[str, Any]] = {}
    earning_rules: Optional[List[Dict[str, Any]]] = []
    redemption_rules: Optional[List[Dict[str, Any]]] = []
    settings: Optional[Dict[str, Any]] = {}

class LoyaltyMemberCreate(BaseModel):
    program_id: str
    customer_id: str
    property_id: str
    preferences: Optional[Dict[str, Any]] = {}

class PointsTransaction(BaseModel):
    member_id: str
    transaction_type: TransactionType
    points_amount: int
    reference_id: Optional[str] = None
    reference_type: Optional[str] = None
    description: Optional[str] = None
    expiry_date: Optional[datetime] = None

class RewardCreate(BaseModel):
    program_id: str
    name: str
    description: Optional[str] = None
    reward_type: RewardType
    points_cost: int
    tier_requirement: Optional[str] = None
    reward_value: Optional[float] = None
    reward_details: Optional[Dict[str, Any]] = {}
    available_from: Optional[datetime] = None
    available_until: Optional[datetime] = None
    max_redemptions: Optional[int] = None
    settings: Optional[Dict[str, Any]] = {}

class RewardRedemptionCreate(BaseModel):
    member_id: str
    reward_id: str
    order_id: Optional[str] = None
    notes: Optional[str] = None

class LoyaltyMemberResponse(BaseModel):
    id: str
    program_id: str
    customer_id: str
    property_id: str
    membership_number: str
    tier: str
    status: str
    current_points: int
    lifetime_points: int
    redeemed_points: int
    expired_points: int
    joined_date: datetime
    last_activity_date: Optional[datetime]
    tier_upgrade_date: Optional[datetime]
    total_visits: int
    total_spent: float
    average_order_value: float
    preferences: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class LoyaltyMetrics(BaseModel):
    total_programs: int
    active_programs: int
    total_members: int
    active_members: int
    members_by_tier: Dict[str, int]
    total_points_issued: int
    total_points_redeemed: int
    total_rewards: int
    active_rewards: int
    total_redemptions: int
    average_points_per_member: float
    redemption_rate: float

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
        logger.info("✅ Redis connected for loyalty service")
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
def generate_membership_number() -> str:
    """Generate unique membership number"""
    timestamp = datetime.utcnow().strftime("%Y%m%d")
    random_suffix = str(uuid.uuid4())[:6].upper()
    return f"MEM-{timestamp}-{random_suffix}"

def generate_redemption_code() -> str:
    """Generate unique redemption code"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:4].upper()
    return f"RED-{timestamp}-{random_suffix}"

def calculate_tier(points: int, tier_config: Dict[str, Any]) -> str:
    """Calculate loyalty tier based on points"""
    tiers = tier_config.get("tiers", {})
    
    # Sort tiers by minimum points
    sorted_tiers = sorted(tiers.items(), key=lambda x: x[1].get("min_points", 0), reverse=True)
    
    for tier_name, tier_data in sorted_tiers:
        min_points = tier_data.get("min_points", 0)
        if points >= min_points:
            return tier_name
    
    return LoyaltyTier.BRONZE

def calculate_points_earned(amount: float, points_per_unit: float, multiplier: float = 1.0) -> int:
    """Calculate points earned from spending"""
    return int(amount * points_per_unit * multiplier)

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
    description="Loyalty programs and customer retention microservice",
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
        "description": "Loyalty programs and customer retention",
        "endpoints": {
            "health": "/health",
            "programs": "/api/loyalty/programs",
            "members": "/api/loyalty/members",
            "transactions": "/api/loyalty/transactions",
            "rewards": "/api/loyalty/rewards",
            "redemptions": "/api/loyalty/redemptions",
            "campaigns": "/api/loyalty/campaigns",
            "metrics": "/api/loyalty/metrics"
        }
    }

@app.post("/api/loyalty/members", response_model=LoyaltyMemberResponse)
async def enroll_member(
    member_data: LoyaltyMemberCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll a customer in a loyalty program"""
    # Check if customer is already enrolled
    existing_member = db.query(LoyaltyMember).filter(
        LoyaltyMember.customer_id == member_data.customer_id,
        LoyaltyMember.program_id == member_data.program_id
    ).first()
    
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer is already enrolled in this program"
        )
    
    # Generate membership number
    membership_number = generate_membership_number()
    
    # Create loyalty member
    new_member = LoyaltyMember(
        program_id=member_data.program_id,
        customer_id=member_data.customer_id,
        property_id=member_data.property_id,
        membership_number=membership_number,
        preferences=member_data.preferences
    )
    
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    
    logger.info(f"✅ Loyalty member enrolled: {membership_number}")
    
    return LoyaltyMemberResponse(
        id=new_member.id,
        program_id=new_member.program_id,
        customer_id=new_member.customer_id,
        property_id=new_member.property_id,
        membership_number=new_member.membership_number,
        tier=new_member.tier,
        status=new_member.status,
        current_points=new_member.current_points,
        lifetime_points=new_member.lifetime_points,
        redeemed_points=new_member.redeemed_points,
        expired_points=new_member.expired_points,
        joined_date=new_member.joined_date,
        last_activity_date=new_member.last_activity_date,
        tier_upgrade_date=new_member.tier_upgrade_date,
        total_visits=new_member.total_visits,
        total_spent=float(new_member.total_spent),
        average_order_value=float(new_member.average_order_value),
        preferences=new_member.preferences,
        created_at=new_member.created_at,
        updated_at=new_member.updated_at
    )

@app.post("/api/loyalty/transactions")
async def process_points_transaction(
    transaction_data: PointsTransaction,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process a points transaction"""
    # Get loyalty member
    member = db.query(LoyaltyMember).filter(LoyaltyMember.id == transaction_data.member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loyalty member not found"
        )
    
    # Calculate new points balance
    points_before = member.current_points
    
    if transaction_data.transaction_type == TransactionType.EARN:
        points_after = points_before + transaction_data.points_amount
    elif transaction_data.transaction_type == TransactionType.REDEEM:
        if points_before < transaction_data.points_amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient points"
            )
        points_after = points_before - transaction_data.points_amount
    else:  # ADJUSTMENT
        points_after = transaction_data.points_amount
    
    # Update member points
    member.current_points = points_after
    member.last_activity_date = datetime.utcnow()
    
    # Update lifetime points for earning transactions
    if transaction_data.transaction_type == TransactionType.EARN:
        member.lifetime_points += transaction_data.points_amount
    elif transaction_data.transaction_type == TransactionType.REDEEM:
        member.redeemed_points += transaction_data.points_amount
    
    # Check for tier upgrade
    program = db.query(LoyaltyProgram).filter(LoyaltyProgram.id == member.program_id).first()
    if program:
        new_tier = calculate_tier(member.lifetime_points, program.tier_configuration)
        if new_tier != member.tier:
            member.tier = new_tier
            member.tier_upgrade_date = datetime.utcnow()
    
    # Create transaction record
    transaction = LoyaltyTransaction(
        member_id=member.id,
        transaction_type=transaction_data.transaction_type,
        points_amount=transaction_data.points_amount,
        reference_id=transaction_data.reference_id,
        reference_type=transaction_data.reference_type,
        description=transaction_data.description,
        expiry_date=transaction_data.expiry_date,
        points_before=points_before,
        points_after=points_after,
        processed_by=current_user["user_id"]
    )
    
    db.add(transaction)
    db.commit()
    
    logger.info(f"✅ Points transaction processed: {transaction_data.points_amount} points")
    
    return {
        "message": "Points transaction processed successfully",
        "transaction_id": transaction.id,
        "member_id": member.id,
        "points_before": points_before,
        "points_after": points_after,
        "new_tier": member.tier
    }

@app.get("/api/loyalty/members/{member_id}", response_model=LoyaltyMemberResponse)
async def get_loyalty_member(
    member_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get loyalty member details"""
    member = db.query(LoyaltyMember).filter(LoyaltyMember.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loyalty member not found"
        )
    
    return LoyaltyMemberResponse(
        id=member.id,
        program_id=member.program_id,
        customer_id=member.customer_id,
        property_id=member.property_id,
        membership_number=member.membership_number,
        tier=member.tier,
        status=member.status,
        current_points=member.current_points,
        lifetime_points=member.lifetime_points,
        redeemed_points=member.redeemed_points,
        expired_points=member.expired_points,
        joined_date=member.joined_date,
        last_activity_date=member.last_activity_date,
        tier_upgrade_date=member.tier_upgrade_date,
        total_visits=member.total_visits,
        total_spent=float(member.total_spent),
        average_order_value=float(member.average_order_value),
        preferences=member.preferences,
        created_at=member.created_at,
        updated_at=member.updated_at
    )

@app.post("/api/loyalty/rewards")
async def create_reward(
    reward_data: RewardCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new reward"""
    new_reward = Reward(
        program_id=reward_data.program_id,
        name=reward_data.name,
        description=reward_data.description,
        reward_type=reward_data.reward_type,
        points_cost=reward_data.points_cost,
        tier_requirement=reward_data.tier_requirement,
        reward_value=reward_data.reward_value,
        reward_details=reward_data.reward_details,
        available_from=reward_data.available_from,
        available_until=reward_data.available_until,
        max_redemptions=reward_data.max_redemptions,
        settings=reward_data.settings
    )
    
    db.add(new_reward)
    db.commit()
    db.refresh(new_reward)
    
    logger.info(f"✅ Reward created: {new_reward.name}")
    
    return {
        "message": "Reward created successfully",
        "reward_id": new_reward.id,
        "name": new_reward.name,
        "points_cost": new_reward.points_cost
    }

@app.post("/api/loyalty/redemptions")
async def redeem_reward(
    redemption_data: RewardRedemptionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Redeem a reward"""
    # Get loyalty member
    member = db.query(LoyaltyMember).filter(LoyaltyMember.id == redemption_data.member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loyalty member not found"
        )
    
    # Get reward
    reward = db.query(Reward).filter(Reward.id == redemption_data.reward_id).first()
    if not reward:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )
    
    # Check if reward is available
    if not reward.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reward is not available"
        )
    
    # Check tier requirement
    if reward.tier_requirement and member.tier != reward.tier_requirement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tier requirement not met. Required: {reward.tier_requirement}, Current: {member.tier}"
        )
    
    # Check points balance
    if member.current_points < reward.points_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient points"
        )
    
    # Check redemption limits
    if reward.max_redemptions and reward.current_redemptions >= reward.max_redemptions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reward redemption limit reached"
        )
    
    # Generate redemption code
    redemption_code = generate_redemption_code()
    
    # Create redemption
    new_redemption = RewardRedemption(
        member_id=member.id,
        reward_id=reward.id,
        redemption_code=redemption_code,
        points_used=reward.points_cost,
        order_id=redemption_data.order_id,
        notes=redemption_data.notes
    )
    
    db.add(new_redemption)
    
    # Update member points
    member.current_points -= reward.points_cost
    member.redeemed_points += reward.points_cost
    
    # Update reward redemption count
    reward.current_redemptions += 1
    
    # Create transaction record
    transaction = LoyaltyTransaction(
        member_id=member.id,
        transaction_type=TransactionType.REDEEM,
        points_amount=reward.points_cost,
        reference_id=new_redemption.id,
        reference_type="redemption",
        description=f"Redeemed reward: {reward.name}",
        points_before=member.current_points + reward.points_cost,
        points_after=member.current_points,
        processed_by=current_user["user_id"]
    )
    
    db.add(transaction)
    db.commit()
    
    logger.info(f"✅ Reward redeemed: {redemption_code}")
    
    return {
        "message": "Reward redeemed successfully",
        "redemption_id": new_redemption.id,
        "redemption_code": redemption_code,
        "reward_name": reward.name,
        "points_used": reward.points_cost,
        "remaining_points": member.current_points
    }

@app.get("/api/loyalty/metrics", response_model=LoyaltyMetrics)
async def get_loyalty_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get loyalty metrics"""
    # Get program counts
    program_query = db.query(LoyaltyProgram)
    if property_id:
        program_query = program_query.filter(LoyaltyProgram.property_id == property_id)
    
    total_programs = program_query.count()
    active_programs = program_query.filter(LoyaltyProgram.status == ProgramStatus.ACTIVE).count()
    
    # Get member counts
    member_query = db.query(LoyaltyMember)
    if property_id:
        member_query = member_query.filter(LoyaltyMember.property_id == property_id)
    
    total_members = member_query.count()
    active_members = member_query.filter(LoyaltyMember.status == "active").count()
    
    # Get members by tier
    members_by_tier = {}
    for tier in LoyaltyTier:
        count = member_query.filter(LoyaltyMember.tier == tier).count()
        members_by_tier[tier] = count
    
    # Get points statistics
    members = member_query.all()
    total_points_issued = sum(member.lifetime_points for member in members)
    total_points_redeemed = sum(member.redeemed_points for member in members)
    
    # Calculate average points per member
    average_points_per_member = 0.0
    if total_members > 0:
        average_points_per_member = total_points_issued / total_members
    
    # Calculate redemption rate
    redemption_rate = 0.0
    if total_points_issued > 0:
        redemption_rate = (total_points_redeemed / total_points_issued) * 100
    
    # Get reward counts
    reward_query = db.query(Reward)
    if property_id:
        reward_query = reward_query.join(LoyaltyProgram).filter(LoyaltyProgram.property_id == property_id)
    
    total_rewards = reward_query.count()
    active_rewards = reward_query.filter(Reward.is_active == True).count()
    
    # Get redemption counts
    redemption_query = db.query(RewardRedemption)
    if property_id:
        redemption_query = redemption_query.join(LoyaltyMember).filter(LoyaltyMember.property_id == property_id)
    
    total_redemptions = redemption_query.count()
    
    return LoyaltyMetrics(
        total_programs=total_programs,
        active_programs=active_programs,
        total_members=total_members,
        active_members=active_members,
        members_by_tier=members_by_tier,
        total_points_issued=total_points_issued,
        total_points_redeemed=total_points_redeemed,
        total_rewards=total_rewards,
        active_rewards=active_rewards,
        total_redemptions=total_redemptions,
        average_points_per_member=average_points_per_member,
        redemption_rate=redemption_rate
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )