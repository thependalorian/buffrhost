"""
User Routes
FastAPI routes for user management
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from database import get_db
from auth.dependencies import get_current_user, require_permission
from services.user_service import UserService
from schemas.user import (
    UserCreate,
    UserUpdate,
    UserResponse,
    UserListResponse,
    UserLogin,
    PasswordChange,
    PasswordReset,
    PasswordResetConfirm,
    EmailVerification,
    PhoneVerification,
    UserSearch,
    UserFilter,
    UserStats,
    UserCreateResponse,
    UserUpdateResponse,
    UserDeleteResponse
)

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=UserCreateResponse)
async def create_user(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new user"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:write")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to create users"
            )
        
        # Create user
        user = user_service.create_user(user_data)
        
        # Create access token
        access_token = user_service.create_access_token(user)
        refresh_token = user_service.create_refresh_token(user)
        
        # Schedule welcome email
        background_tasks.add_task(
            send_welcome_email,
            user.email,
            user.full_name
        )
        
        return UserCreateResponse(
            user=UserResponse.from_orm(user),
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=1800,  # 30 minutes
            message="User created successfully"
        )
        
    except Exception as e:
        logger.error(f"Failed to create user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

@router.get("/", response_model=UserListResponse)
async def get_users(
    skip: int = 0,
    limit: int = 100,
    tenant_id: Optional[str] = None,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of users with optional filters"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:read")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view users"
            )
        
        # Get users
        users = user_service.get_users(
            skip=skip,
            limit=limit,
            tenant_id=tenant_id,
            role=role,
            is_active=is_active
        )
        
        # Get total count
        total = len(users)
        
        return UserListResponse(
            users=[UserResponse.from_orm(user) for user in users],
            total=total,
            page=skip // limit + 1,
            size=limit,
            pages=(total + limit - 1) // limit
        )
        
    except Exception as e:
        logger.error(f"Failed to get users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user by ID"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:read")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view user"
            )
        
        # Get user
        user = user_service.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse.from_orm(user)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user"
        )

@router.put("/{user_id}", response_model=UserUpdateResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user information"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:write")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to update user"
            )
        
        # Update user
        user = user_service.update_user(user_id, user_data)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserUpdateResponse(
            user=UserResponse.from_orm(user),
            message="User updated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )

@router.delete("/{user_id}", response_model=UserDeleteResponse)
async def delete_user(
    user_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user (soft delete)"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:write")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to delete user"
            )
        
        # Delete user
        success = user_service.delete_user(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserDeleteResponse(
            message="User deleted successfully",
            deleted_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete user"
        )

@router.post("/{user_id}/verify-email")
async def verify_email(
    user_id: str,
    verification: EmailVerification,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify user email"""
    try:
        user_service = UserService(db)
        
        # Verify email
        success = user_service.verify_email(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "Email verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to verify email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify email"
        )

@router.post("/{user_id}/verify-phone")
async def verify_phone(
    user_id: str,
    verification: PhoneVerification,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Verify user phone"""
    try:
        user_service = UserService(db)
        
        # Verify phone
        success = user_service.verify_phone(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "Phone verified successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to verify phone: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify phone"
        )

@router.post("/{user_id}/change-password")
async def change_password(
    user_id: str,
    password_data: PasswordChange,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    try:
        user_service = UserService(db)
        
        # Change password
        success = user_service.change_password(
            user_id,
            password_data.current_password,
            password_data.new_password
        )
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to change password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )

@router.get("/stats/summary", response_model=UserStats)
async def get_user_stats(
    tenant_id: Optional[str] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user statistics"""
    try:
        user_service = UserService(db)
        
        # Check permissions
        if not require_permission("users:read")(lambda: None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to view user statistics"
            )
        
        # Get stats
        stats = user_service.get_user_stats(tenant_id)
        
        return UserStats(**stats)
        
    except Exception as e:
        logger.error(f"Failed to get user stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user statistics"
        )

# Helper functions
async def send_welcome_email(email: str, name: str):
    """Send welcome email to new user"""
    # This would integrate with your email service
    logger.info(f"Sending welcome email to {email} for {name}")

# Import datetime for delete response
from datetime import datetime