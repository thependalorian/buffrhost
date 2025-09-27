"""
Buffr Host Auth Service - Microservice
Handles authentication, authorization, and user management for Buffr Host hospitality platform
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
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
import bcrypt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_auth")
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
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Service configuration
SERVICE_NAME = "auth-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8001))

# Enums
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    CUSTOMER = "customer"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

class UserType(str, Enum):
    INDIVIDUAL = "individual"
    BUSINESS = "business"
    CORPORATE = "corporate"

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=True, index=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default=UserRole.CUSTOMER)
    user_type = Column(String, default=UserType.INDIVIDUAL)
    status = Column(String, default=UserStatus.ACTIVE)
    email_verified = Column(Boolean, default=False)
    phone_verified = Column(Boolean, default=False)
    last_login = Column(DateTime)
    login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime)
    preferences = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    session_token = Column(String, unique=True, nullable=False, index=True)
    refresh_token = Column(String, unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    refresh_expires_at = Column(DateTime, nullable=False)
    ip_address = Column(String)
    user_agent = Column(Text)
    device_info = Column(JSON, default=dict)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserPermission(Base):
    __tablename__ = "user_permissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    permission = Column(String, nullable=False, index=True)
    resource = Column(String, nullable=True)
    granted_by = Column(String, nullable=False)
    granted_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

class AuthLog(Base):
    __tablename__ = "auth_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=True, index=True)
    action = Column(String, nullable=False, index=True)
    ip_address = Column(String)
    user_agent = Column(Text)
    success = Column(Boolean, default=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    password: str
    first_name: str
    last_name: str
    role: UserRole = UserRole.CUSTOMER
    user_type: UserType = UserType.INDIVIDUAL

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    user_type: Optional[UserType] = None
    status: Optional[UserStatus] = None
    preferences: Optional[Dict[str, Any]] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class PasswordReset(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class UserResponse(BaseModel):
    id: str
    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    role: str
    user_type: str
    status: str
    email_verified: bool
    phone_verified: bool
    last_login: Optional[datetime]
    preferences: Dict[str, Any]
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class AuthResponse(BaseModel):
    total_users: int
    active_users: int
    suspended_users: int
    pending_users: int
    total_sessions: int
    active_sessions: int
    failed_logins_today: int
    last_login: Optional[datetime]

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
        logger.info("✅ Redis connected for auth service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Utility functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
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

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Check if session is active in Redis
    if redis_client:
        session_key = f"session:{user_id}"
        session_data = await redis_client.get(session_key)
        if not session_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session expired"
            )
    
    # Get user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )
    
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account is temporarily locked"
        )
    
    return {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "user_type": user.user_type
    }

# Permission check
def require_permission(permission: str):
    def permission_checker(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
        # Check if user has permission
        user_permission = db.query(UserPermission).filter(
            UserPermission.user_id == current_user["user_id"],
            UserPermission.permission == permission,
            UserPermission.expires_at > datetime.utcnow()
        ).first()
        
        if not user_permission:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        return current_user
    return permission_checker

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
    description="Authentication and authorization microservice for Buffr Host",
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
        "description": "Authentication and authorization microservice",
        "endpoints": {
            "health": "/health",
            "register": "/api/auth/register",
            "login": "/api/auth/login",
            "refresh": "/api/auth/refresh",
            "logout": "/api/auth/logout",
            "profile": "/api/auth/profile",
            "users": "/api/auth/users",
            "metrics": "/api/auth/metrics"
        }
    }

@app.post("/api/auth/register", response_model=UserResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check phone if provided
    if user_data.phone:
        existing_phone = db.query(User).filter(User.phone == user_data.phone).first()
        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number already registered"
            )
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        phone=user_data.phone,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        role=user_data.role,
        user_type=user_data.user_type
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Log registration
    auth_log = AuthLog(
        user_id=new_user.id,
        action="register",
        success=True,
        details={"email": new_user.email, "role": new_user.role}
    )
    db.add(auth_log)
    db.commit()
    
    logger.info(f"✅ New user registered: {new_user.email}")
    
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        phone=new_user.phone,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        role=new_user.role,
        user_type=new_user.user_type,
        status=new_user.status,
        email_verified=new_user.email_verified,
        phone_verified=new_user.phone_verified,
        last_login=new_user.last_login,
        preferences=new_user.preferences,
        created_at=new_user.created_at
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login_user(
    login_data: UserLogin, 
    request: Request,
    db: Session = Depends(get_db)
):
    """Authenticate user and return tokens"""
    # Find user by email
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        # Log failed login attempt
        auth_log = AuthLog(
            action="login",
            success=False,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"email": login_data.email, "reason": "user_not_found"}
        )
        db.add(auth_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check if account is locked
    if user.locked_until and user.locked_until > datetime.utcnow():
        auth_log = AuthLog(
            user_id=user.id,
            action="login",
            success=False,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"reason": "account_locked"}
        )
        db.add(auth_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_423_LOCKED,
            detail="Account is temporarily locked"
        )
    
    # Verify password
    if not verify_password(login_data.password, user.password_hash):
        # Increment login attempts
        user.login_attempts += 1
        if user.login_attempts >= 5:
            user.locked_until = datetime.utcnow() + timedelta(minutes=30)
        
        db.commit()
        
        # Log failed login attempt
        auth_log = AuthLog(
            user_id=user.id,
            action="login",
            success=False,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"reason": "invalid_password", "attempts": user.login_attempts}
        )
        db.add(auth_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check user status
    if user.status != UserStatus.ACTIVE:
        auth_log = AuthLog(
            user_id=user.id,
            action="login",
            success=False,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
            details={"reason": "account_inactive", "status": user.status}
        )
        db.add(auth_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )
    
    # Reset login attempts on successful login
    user.login_attempts = 0
    user.locked_until = None
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    refresh_token = create_refresh_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    # Store session in database
    session = UserSession(
        user_id=user.id,
        session_token=access_token,
        refresh_token=refresh_token,
        expires_at=datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        refresh_expires_at=datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        device_info={"remember_me": login_data.remember_me}
    )
    
    db.add(session)
    db.commit()
    
    # Store session in Redis for fast access
    if redis_client:
        session_key = f"session:{user.id}"
        session_data = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_at": session.expires_at.isoformat(),
            "refresh_expires_at": session.refresh_expires_at.isoformat()
        }
        await redis_client.setex(session_key, ACCESS_TOKEN_EXPIRE_MINUTES * 60, str(session_data))
    
    # Log successful login
    auth_log = AuthLog(
        user_id=user.id,
        action="login",
        success=True,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        details={"remember_me": login_data.remember_me}
    )
    db.add(auth_log)
    db.commit()
    
    logger.info(f"✅ User logged in: {user.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/api/auth/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    # Verify refresh token
    payload = verify_token(refresh_data.refresh_token)
    
    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Check if refresh token exists in database
    session = db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.refresh_token == refresh_data.refresh_token,
        UserSession.is_active == True
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Check if refresh token is expired
    if session.refresh_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    
    # Get user
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.status != UserStatus.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Create new tokens
    new_access_token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    new_refresh_token = create_refresh_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    # Update session
    session.session_token = new_access_token
    session.refresh_token = new_refresh_token
    session.expires_at = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    session.refresh_expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    session.updated_at = datetime.utcnow()
    
    db.commit()
    
    # Update Redis session
    if redis_client:
        session_key = f"session:{user.id}"
        session_data = {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "expires_at": session.expires_at.isoformat(),
            "refresh_expires_at": session.refresh_expires_at.isoformat()
        }
        await redis_client.setex(session_key, ACCESS_TOKEN_EXPIRE_MINUTES * 60, str(session_data))
    
    logger.info(f"✅ Token refreshed for user: {user.email}")
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@app.post("/api/auth/logout")
async def logout_user(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Logout user and invalidate session"""
    user_id = current_user["user_id"]
    
    # Deactivate all sessions for user
    sessions = db.query(UserSession).filter(
        UserSession.user_id == user_id,
        UserSession.is_active == True
    ).all()
    
    for session in sessions:
        session.is_active = False
        session.updated_at = datetime.utcnow()
    
    db.commit()
    
    # Remove session from Redis
    if redis_client:
        session_key = f"session:{user_id}"
        await redis_client.delete(session_key)
    
    # Log logout
    auth_log = AuthLog(
        user_id=user_id,
        action="logout",
        success=True
    )
    db.add(auth_log)
    db.commit()
    
    logger.info(f"✅ User logged out: {current_user['email']}")
    
    return {"message": "Successfully logged out"}

@app.get("/api/auth/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        user_type=user.user_type,
        status=user.status,
        email_verified=user.email_verified,
        phone_verified=user.phone_verified,
        last_login=user.last_login,
        preferences=user.preferences,
        created_at=user.created_at
    )

@app.put("/api/auth/profile", response_model=UserResponse)
async def update_user_profile(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if user_data.first_name is not None:
        user.first_name = user_data.first_name
    if user_data.last_name is not None:
        user.last_name = user_data.last_name
    if user_data.phone is not None:
        user.phone = user_data.phone
    if user_data.preferences is not None:
        user.preferences = user_data.preferences
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    logger.info(f"✅ User profile updated: {user.email}")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        phone=user.phone,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        user_type=user.user_type,
        status=user.status,
        email_verified=user.email_verified,
        phone_verified=user.phone_verified,
        last_login=user.last_login,
        preferences=user.preferences,
        created_at=user.created_at
    )

@app.get("/api/auth/users", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role: Optional[UserRole] = None,
    status: Optional[UserStatus] = None,
    user_type: Optional[UserType] = None,
    current_user: dict = Depends(require_permission("users.read")),
    db: Session = Depends(get_db)
):
    """Get all users with filtering (admin only)"""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    if status:
        query = query.filter(User.status == status)
    if user_type:
        query = query.filter(User.user_type == user_type)
    
    users = query.offset(skip).limit(limit).all()
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            phone=user.phone,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            user_type=user.user_type,
            status=user.status,
            email_verified=user.email_verified,
            phone_verified=user.phone_verified,
            last_login=user.last_login,
            preferences=user.preferences,
            created_at=user.created_at
        )
        for user in users
    ]

@app.get("/api/auth/metrics", response_model=AuthResponse)
async def get_auth_metrics(
    current_user: dict = Depends(require_permission("auth.metrics")),
    db: Session = Depends(get_db)
):
    """Get authentication metrics (admin only)"""
    # Get user counts
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.status == UserStatus.ACTIVE).count()
    suspended_users = db.query(User).filter(User.status == UserStatus.SUSPENDED).count()
    pending_users = db.query(User).filter(User.status == UserStatus.PENDING).count()
    
    # Get session counts
    total_sessions = db.query(UserSession).count()
    active_sessions = db.query(UserSession).filter(UserSession.is_active == True).count()
    
    # Get failed logins today
    today = datetime.utcnow().date()
    failed_logins_today = db.query(AuthLog).filter(
        AuthLog.action == "login",
        AuthLog.success == False,
        db.func.date(AuthLog.timestamp) == today
    ).count()
    
    # Get last login
    last_login = db.query(User).filter(User.last_login.isnot(None)).order_by(User.last_login.desc()).first()
    
    return AuthResponse(
        total_users=total_users,
        active_users=active_users,
        suspended_users=suspended_users,
        pending_users=pending_users,
        total_sessions=total_sessions,
        active_sessions=active_sessions,
        failed_logins_today=failed_logins_today,
        last_login=last_login.last_login if last_login else None
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )