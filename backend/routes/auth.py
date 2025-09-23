"""
Authentication routes for The Shandi platform.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt

from database import get_db
from models.user import BuffrHostUser
from schemas.user import (
    UserCreate, UserResponse, UserLogin, UserLoginResponse,
    PasswordChange, PasswordReset, PasswordResetConfirm
)
from auth.rbac import rbac_manager, Permission, Role
from config import settings
from services.email_service import email_service
from fastapi_limiter.depends import RateLimiter

router = APIRouter()
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> BuffrHostUser:
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    result = await db.execute(select(BuffrHostUser).where(BuffrHostUser.owner_id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    return user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def register_user(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user."""
    result = await db.execute(select(BuffrHostUser).where(BuffrHostUser.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(user_data.password)
    
    user = BuffrHostUser(
        email=user_data.email,
        name=user_data.name,
        property_id=user_data.property_id,
        role=user_data.role,
        password=hashed_password
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.from_orm(user)


@router.post("/login", response_model=UserLoginResponse, dependencies=[Depends(RateLimiter(times=5, seconds=60))])
async def login_user(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """Authenticate user and return access token."""
    result = await db.execute(select(BuffrHostUser).where(BuffrHostUser.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.owner_id, "property_id": user.property_id, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return UserLoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse.from_orm(user)
    )


@router.post("/forgot-password", dependencies=[Depends(RateLimiter(times=2, seconds=120))])
async def forgot_password(
    reset_data: PasswordReset,
    db: AsyncSession = Depends(get_db)
):
    """Request password reset."""
    result = await db.execute(select(BuffrHostUser).where(BuffrHostUser.email == reset_data.email))
    user = result.scalar_one_or_none()
    
    if user:
        password_reset_token = create_access_token(
            data={"sub": user.owner_id, "scope": "password_reset"},
            expires_delta=timedelta(minutes=getattr(settings, 'PASSWORD_RESET_TOKEN_EXPIRE_MINUTES', 15))
        )
        email_service.send_email(
            to=user.email,
            subject="Password Reset Request",
            body=f"Click the link to reset your password: {settings.CLIENT_URL}/reset-password?token={password_reset_token}"
        )
    
    return {"message": "If a user with that email exists, a password reset link has been sent."}


@router.post("/reset-password", dependencies=[Depends(RateLimiter(times=2, seconds=120))])
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db)
):
    """Reset password with token."""
    try:
        payload = jwt.decode(reset_data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("scope") != "password_reset":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token scope")
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    result = await db.execute(select(BuffrHostUser).where(BuffrHostUser.owner_id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    hashed_password = hash_password(reset_data.new_password)
    user.password = hashed_password
    await db.commit()

    return {"message": "Password has been reset successfully."}


async def require_permission(permission: Permission, user: BuffrHostUser = Depends(get_current_user)):
    """Require a specific permission for the current user."""
    if not rbac_manager.has_permission(user, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    return user


async def require_property_access(property_id: int, user: BuffrHostUser = Depends(get_current_user)):
    """Require access to a specific property."""
    # This is a simplified check - in a real implementation, you'd check if the user
    # has access to the specific property through ownership, roles, or permissions
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not active"
        )
    return user
