"""
Pydantic schemas for user-related API operations.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    name: Optional[str] = Field(None, max_length=255)
    restaurant_id: int
    role: Optional[str] = Field(None, max_length=50)


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, max_length=255)


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, max_length=255)
    role: Optional[str] = Field(None, max_length=50)
    password: Optional[str] = Field(None, min_length=8, max_length=255)


class UserResponse(UserBase):
    """Schema for user API responses."""
    owner_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    """Schema for login response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class UserSummary(BaseModel):
    """Simplified user schema for lists and references."""
    owner_id: str
    email: str
    name: Optional[str] = None
    role: Optional[str] = None
    restaurant_id: int

    class Config:
        from_attributes = True


class PasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=255)


class PasswordReset(BaseModel):
    """Schema for password reset request."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=255)
