"""
Permission System
Role-based access control with granular permissions
"""

from functools import wraps
from fastapi import HTTPException, status, Depends
from typing import List, Callable, Optional
from models.user import User
from .dependencies import get_current_user

def require_permission(permission: str):
    """
    Decorator to require specific permission for endpoint access
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not has_permission(current_user, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def has_permission(user: User, permission: str) -> bool:
    """
    Check if user has specific permission
    """
    user_permissions = PERMISSIONS_MAP.get(user.role, [])
    
    # Check for exact permission match
    if permission in user_permissions:
        return True
    
    # Check for wildcard permissions (e.g., "users:*" matches "users:read")
    for user_permission in user_permissions:
        if user_permission.endswith("*"):
            prefix = user_permission[:-1]
            if permission.startswith(prefix):
                return True
    
    return False

def has_any_permission(user: User, permissions: List[str]) -> bool:
    """
    Check if user has any of the specified permissions
    """
    return any(has_permission(user, permission) for permission in permissions)

def has_all_permissions(user: User, permissions: List[str]) -> bool:
    """
    Check if user has all of the specified permissions
    """
    return all(has_permission(user, permission) for permission in permissions)

def require_any_permission(permissions: List[str]):
    """
    Decorator to require any of the specified permissions
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not has_any_permission(current_user, permissions):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: requires any of {permissions}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_all_permissions(permissions: List[str]):
    """
    Decorator to require all of the specified permissions
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not has_all_permissions(current_user, permissions):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: requires all of {permissions}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_tenant_access(tenant_id_param: str = "tenant_id"):
    """
    Decorator to require access to specific tenant
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Super admins can access any tenant
            if current_user.role == "super_admin":
                return await func(*args, **kwargs)
            
            # Get tenant_id from function arguments
            tenant_id = kwargs.get(tenant_id_param)
            if not tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Missing {tenant_id_param} parameter"
                )
            
            # Check if user belongs to this tenant
            if current_user.tenant_id != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied to this tenant"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Permission mapping by role
PERMISSIONS_MAP = {
    "super_admin": [
        # User management
        "users:*",
        "roles:*",
        "permissions:*",
        
        # Tenant management
        "tenants:*",
        "onboarding:*",
        
        # Property management
        "properties:*",
        "rooms:*",
        "amenities:*",
        
        # Booking management
        "bookings:*",
        "reservations:*",
        "availability:*",
        
        # Financial management
        "financial:*",
        "payments:*",
        "invoices:*",
        "reports:*",
        
        # System management
        "settings:*",
        "integrations:*",
        "analytics:*",
        "logs:*",
        
        # Content management
        "cms:*",
        "templates:*",
        "media:*",
        
        # Communication
        "notifications:*",
        "emails:*",
        "sms:*",
        
        # Staff management
        "staff:*",
        "departments:*",
        "schedules:*",
        
        # Guest services
        "guests:*",
        "loyalty:*",
        "reviews:*",
        
        # Inventory management
        "inventory:*",
        "supplies:*",
        "maintenance:*",
        
        # AI and automation
        "ai:*",
        "automation:*",
        "workflows:*"
    ],
    
    "admin": [
        # User management (limited)
        "users:read",
        "users:write",
        "roles:read",
        
        # Tenant management (own tenant only)
        "tenants:read",
        "onboarding:read",
        
        # Property management
        "properties:*",
        "rooms:*",
        "amenities:*",
        
        # Booking management
        "bookings:*",
        "reservations:*",
        "availability:*",
        
        # Financial management
        "financial:read",
        "financial:write",
        "payments:*",
        "invoices:*",
        "reports:read",
        
        # System management (limited)
        "settings:read",
        "settings:write",
        "integrations:read",
        "analytics:*",
        
        # Content management
        "cms:*",
        "templates:*",
        "media:*",
        
        # Communication
        "notifications:*",
        "emails:*",
        "sms:*",
        
        # Staff management
        "staff:*",
        "departments:*",
        "schedules:*",
        
        # Guest services
        "guests:*",
        "loyalty:*",
        "reviews:*",
        
        # Inventory management
        "inventory:*",
        "supplies:*",
        "maintenance:*",
        
        # AI and automation
        "ai:read",
        "automation:read",
        "workflows:read"
    ],
    
    "manager": [
        # Property management (read/write)
        "properties:read",
        "properties:write",
        "rooms:read",
        "rooms:write",
        "amenities:read",
        "amenities:write",
        
        # Booking management
        "bookings:*",
        "reservations:*",
        "availability:*",
        
        # Financial management (read only)
        "financial:read",
        "payments:read",
        "invoices:read",
        "reports:read",
        
        # Analytics
        "analytics:read",
        
        # Content management (limited)
        "cms:read",
        "cms:write",
        "templates:read",
        "media:read",
        "media:write",
        
        # Communication
        "notifications:read",
        "notifications:write",
        "emails:read",
        "emails:write",
        
        # Staff management
        "staff:read",
        "staff:write",
        "departments:read",
        "schedules:read",
        "schedules:write",
        
        # Guest services
        "guests:*",
        "loyalty:read",
        "loyalty:write",
        "reviews:read",
        "reviews:write",
        
        # Inventory management
        "inventory:*",
        "supplies:read",
        "supplies:write",
        "maintenance:read",
        "maintenance:write"
    ],
    
    "staff": [
        # Property management (read only)
        "properties:read",
        "rooms:read",
        "amenities:read",
        
        # Booking management (limited)
        "bookings:read",
        "bookings:write",
        "reservations:read",
        "reservations:write",
        "availability:read",
        
        # Financial management (read only)
        "payments:read",
        "invoices:read",
        
        # Guest services
        "guests:read",
        "guests:write",
        "loyalty:read",
        "reviews:read",
        
        # Inventory management (limited)
        "inventory:read",
        "supplies:read",
        "maintenance:read",
        "maintenance:write",
        
        # Communication (limited)
        "notifications:read",
        "emails:read"
    ],
    
    "guest": [
        # Profile management
        "profile:read",
        "profile:write",
        
        # Booking management (own bookings only)
        "bookings:read",
        "bookings:write",
        "reservations:read",
        "reservations:write",
        
        # Property information (read only)
        "properties:read",
        "rooms:read",
        "amenities:read",
        "availability:read",
        
        # Guest services
        "loyalty:read",
        "reviews:read",
        "reviews:write",
        
        # Communication
        "notifications:read"
    ]
}

# Role hierarchy for permission inheritance
ROLE_HIERARCHY = {
    "super_admin": 100,
    "admin": 80,
    "manager": 60,
    "staff": 40,
    "guest": 20
}

def get_role_level(role: str) -> int:
    """
    Get numeric level for role (higher = more permissions)
    """
    return ROLE_HIERARCHY.get(role, 0)

def can_manage_role(user_role: str, target_role: str) -> bool:
    """
    Check if user can manage users with target role
    """
    user_level = get_role_level(user_role)
    target_level = get_role_level(target_role)
    return user_level > target_level