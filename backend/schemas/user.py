"""
User Schemas
Pydantic models for user-related API requests and responses
"""

from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """Available user roles"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    GUEST = "guest"

class UserStatus(str, Enum):
    """User status options"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

# Base user schema
class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: UserRole = UserRole.GUEST
    tenant_id: Optional[str] = None
    is_active: bool = True
    email_verified: bool = False
    phone_verified: bool = False

# User creation schema
class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and len(v) < 10:
            raise ValueError('Phone number must be at least 10 characters')
        return v

# User update schema
class UserUpdate(BaseModel):
    """Schema for updating user information"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    tenant_id: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None
    phone_verified: Optional[bool] = None
    password: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if v and len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and len(v) < 10:
            raise ValueError('Phone number must be at least 10 characters')
        return v

# User response schema
class UserResponse(UserBase):
    """Schema for user response data"""
    id: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# User login schema
class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

# Password change schema
class PasswordChange(BaseModel):
    """Schema for changing password"""
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v

# Password reset schema
class PasswordReset(BaseModel):
    """Schema for password reset"""
    email: EmailStr

# Password reset confirm schema
class PasswordResetConfirm(BaseModel):
    """Schema for confirming password reset"""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('New password must be at least 8 characters long')
        return v

# Email verification schema
class EmailVerification(BaseModel):
    """Schema for email verification"""
    token: str

# Phone verification schema
class PhoneVerification(BaseModel):
    """Schema for phone verification"""
    phone: str
    code: str

# User search schema
class UserSearch(BaseModel):
    """Schema for user search"""
    query: str
    tenant_id: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    limit: int = 20
    offset: int = 0

# User filter schema
class UserFilter(BaseModel):
    """Schema for filtering users"""
    tenant_id: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None
    phone_verified: Optional[bool] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    last_login_after: Optional[datetime] = None
    last_login_before: Optional[datetime] = None

# User statistics schema
class UserStats(BaseModel):
    """Schema for user statistics"""
    total_users: int
    active_users: int
    inactive_users: int
    verified_users: int
    unverified_users: int
    role_distribution: Dict[str, int]
    recent_registrations: int

# User permission schema
class UserPermission(BaseModel):
    """Schema for user permission"""
    permission: str
    granted: bool
    source: str  # role, custom, etc.

# User role assignment schema
class UserRoleAssignment(BaseModel):
    """Schema for user role assignment"""
    user_id: str
    role: UserRole
    assigned_by: str
    assigned_at: datetime

# User activity schema
class UserActivity(BaseModel):
    """Schema for user activity log"""
    id: str
    user_id: str
    action: str
    details: Dict[str, Any]
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

# User session schema
class UserSession(BaseModel):
    """Schema for user session"""
    id: str
    user_id: str
    access_token: str
    refresh_token: str
    expires_at: datetime
    created_at: datetime
    last_activity: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

# User profile schema
class UserProfile(BaseModel):
    """Schema for user profile"""
    user: UserResponse
    permissions: List[UserPermission]
    stats: Dict[str, Any]
    preferences: Dict[str, Any]

# Bulk user operations schema
class BulkUserOperation(BaseModel):
    """Schema for bulk user operations"""
    user_ids: List[str]
    operation: str  # activate, deactivate, delete, change_role
    data: Optional[Dict[str, Any]] = None

# User import schema
class UserImport(BaseModel):
    """Schema for importing users"""
    users: List[UserCreate]
    send_welcome_email: bool = True
    require_password_change: bool = True

# User export schema
class UserExport(BaseModel):
    """Schema for exporting users"""
    format: str = "csv"  # csv, json, xlsx
    fields: List[str] = ["id", "email", "full_name", "role", "is_active", "created_at"]
    filters: Optional[UserFilter] = None

# User audit schema
class UserAudit(BaseModel):
    """Schema for user audit trail"""
    id: str
    user_id: str
    action: str
    old_values: Optional[Dict[str, Any]] = None
    new_values: Optional[Dict[str, Any]] = None
    changed_by: str
    changed_at: datetime
    ip_address: Optional[str] = None

# User notification preferences schema
class UserNotificationPreferences(BaseModel):
    """Schema for user notification preferences"""
    email_notifications: bool = True
    sms_notifications: bool = False
    push_notifications: bool = True
    marketing_emails: bool = False
    security_alerts: bool = True
    booking_updates: bool = True
    payment_notifications: bool = True
    system_maintenance: bool = True

# User settings schema
class UserSettings(BaseModel):
    """Schema for user settings"""
    timezone: str = "UTC"
    language: str = "en"
    date_format: str = "YYYY-MM-DD"
    time_format: str = "24h"
    currency: str = "USD"
    theme: str = "light"  # light, dark, auto
    notifications: UserNotificationPreferences

# User dashboard schema
class UserDashboard(BaseModel):
    """Schema for user dashboard data"""
    user: UserResponse
    stats: Dict[str, Any]
    recent_activities: List[UserActivity]
    notifications: List[Dict[str, Any]]
    quick_actions: List[Dict[str, Any]]

# API response schemas
class UserListResponse(BaseModel):
    """Schema for user list response"""
    users: List[UserResponse]
    total: int
    page: int
    size: int
    pages: int

class UserCreateResponse(BaseModel):
    """Schema for user creation response"""
    user: UserResponse
    access_token: str
    refresh_token: str
    expires_in: int

class UserLoginResponse(BaseModel):
    """Schema for user login response"""
    user: UserResponse
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "bearer"

class UserUpdateResponse(BaseModel):
    """Schema for user update response"""
    user: UserResponse
    message: str

class UserDeleteResponse(BaseModel):
    """Schema for user deletion response"""
    message: str
    deleted_at: datetime

# Error schemas
class UserError(BaseModel):
    """Schema for user-related errors"""
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class ValidationError(BaseModel):
    """Schema for validation errors"""
    field: str
    message: str
    value: Any

class UserErrorResponse(BaseModel):
    """Schema for user error response"""
    success: bool = False
    error: UserError
    validation_errors: Optional[List[ValidationError]] = None