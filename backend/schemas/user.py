"""
Pydantic schemas for user-related API operations.
Uses standardized types from the unified database schema.
"""
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# Enums matching the database schema
class UserRoleEnum(str, Enum):
    INDIVIDUAL = "individual"
    SME_USER = "sme_user"
    ENTERPRISE_USER = "enterprise_user"
    ADMIN = "admin"
    HOSPITALITY_STAFF = "hospitality_staff"
    CUSTOMER = "customer"
    CORPORATE_CUSTOMER = "corporate_customer"


class UserStatusEnum(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"
    ARCHIVED = "archived"


class UserBase(BaseModel):
    """Base user schema with common fields."""

    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    role: UserRoleEnum = UserRoleEnum.INDIVIDUAL
    status: UserStatusEnum = UserStatusEnum.PENDING_VERIFICATION


class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str = Field(..., min_length=8, max_length=255)
    name: Optional[str] = Field(None, max_length=255)  # ADD: name field
    property_id: Optional[int] = None  # ADD: property_id field


class UserUpdate(BaseModel):
    """Schema for updating user information."""

    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=50)
    role: Optional[UserRoleEnum] = None
    status: Optional[UserStatusEnum] = None
    password: Optional[str] = Field(None, min_length=8, max_length=255)


class UserResponse(UserBase):
    """Schema for user API responses."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    """Base profile schema."""

    email: EmailStr
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    user_role: UserRoleEnum = UserRoleEnum.INDIVIDUAL
    plan_type: str = "free"
    status: str = "active"
    is_verified: bool = False
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    property_id: Optional[int] = None
    permissions: List[str] = []
    country_code: Optional[str] = None
    national_id_number: Optional[str] = None
    national_id_type: Optional[str] = None
    kyc_status: str = "pending"
    consent_given: bool = False


class ProfileCreate(ProfileBase):
    """Schema for creating a profile."""

    pass


class ProfileUpdate(BaseModel):
    """Schema for updating profile information."""

    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    company_name: Optional[str] = None
    user_role: Optional[UserRoleEnum] = None
    plan_type: Optional[str] = None
    status: Optional[str] = None
    is_verified: Optional[bool] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    property_id: Optional[int] = None
    permissions: Optional[List[str]] = None
    country_code: Optional[str] = None
    national_id_number: Optional[str] = None
    national_id_type: Optional[str] = None
    kyc_status: Optional[str] = None
    consent_given: Optional[bool] = None


class ProfileResponse(ProfileBase):
    """Schema for profile API responses."""

    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login_at: Optional[datetime] = None
    subscription_expires_at: Optional[datetime] = None
    preferences: Dict[str, Any] = {}
    biometric_data: List[Dict[str, Any]] = []
    behavioral_metrics: Dict[str, Any] = {}

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

    id: str  # Use id instead of owner_id
    email: str
    name: Optional[str] = None
    role: Optional[str] = None
    property_id: Optional[int] = None  # Use property_id instead of restaurant_id

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
