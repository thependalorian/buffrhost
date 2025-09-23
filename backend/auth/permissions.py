"""
Permission system for Buffr Host platform.
"""
from enum import Enum
from fastapi import HTTPException, status
from typing import List, Optional
from models.user import BuffrHostUser


class HospitalityPermissions(Enum):
    """Hospitality-specific permissions."""
    
    # Property Management
    MANAGE_PROPERTY = "manage_property"
    VIEW_PROPERTY = "view_property"
    UPDATE_PROPERTY = "update_property"
    DELETE_PROPERTY = "delete_property"
    
    # Menu Management
    MANAGE_MENU = "manage_menu"
    VIEW_MENU = "view_menu"
    UPDATE_MENU = "update_menu"
    DELETE_MENU = "delete_menu"
    
    # Order Management
    MANAGE_ORDERS = "manage_orders"
    VIEW_ORDERS = "view_orders"
    CREATE_ORDERS = "create_orders"
    UPDATE_ORDERS = "update_orders"
    DELETE_ORDERS = "delete_orders"
    
    # Customer Management
    MANAGE_CUSTOMERS = "manage_customers"
    VIEW_CUSTOMERS = "view_customers"
    CREATE_CUSTOMERS = "create_customers"
    UPDATE_CUSTOMERS = "update_customers"
    DELETE_CUSTOMERS = "delete_customers"
    
    # Staff Management
    MANAGE_STAFF = "manage_staff"
    VIEW_STAFF = "view_staff"
    CREATE_STAFF = "create_staff"
    UPDATE_STAFF = "update_staff"
    DELETE_STAFF = "delete_staff"
    
    # Inventory Management
    MANAGE_INVENTORY = "manage_inventory"
    VIEW_INVENTORY = "view_inventory"
    UPDATE_INVENTORY = "update_inventory"
    
    # Analytics
    VIEW_ANALYTICS = "view_analytics"
    EXPORT_ANALYTICS = "export_analytics"
    
    # Loyalty Program
    MANAGE_LOYALTY = "manage_loyalty"
    VIEW_LOYALTY = "view_loyalty"
    UPDATE_LOYALTY = "update_loyalty"
    
    # AI Features
    MANAGE_AI = "manage_ai"
    VIEW_AI = "view_ai"
    USE_AI = "use_ai"
    
    # Knowledge Base
    MANAGE_KNOWLEDGE_BASE = "manage_knowledge_base"
    VIEW_KNOWLEDGE_BASE = "view_knowledge_base"
    UPLOAD_DOCUMENTS = "upload_documents"
    
    # Voice Features
    MANAGE_VOICE = "manage_voice"
    USE_VOICE = "use_voice"
    
    # CMS
    MANAGE_CMS = "manage_cms"
    VIEW_CMS = "view_cms"
    PUBLISH_CONTENT = "publish_content"


# Role-based permission mapping
ROLE_PERMISSIONS = {
    "admin": list(HospitalityPermissions),
    "manager": [
        HospitalityPermissions.MANAGE_PROPERTY,
        HospitalityPermissions.MANAGE_MENU,
        HospitalityPermissions.MANAGE_ORDERS,
        HospitalityPermissions.MANAGE_CUSTOMERS,
        HospitalityPermissions.MANAGE_STAFF,
        HospitalityPermissions.MANAGE_INVENTORY,
        HospitalityPermissions.VIEW_ANALYTICS,
        HospitalityPermissions.MANAGE_LOYALTY,
        HospitalityPermissions.VIEW_AI,
        HospitalityPermissions.USE_AI,
        HospitalityPermissions.MANAGE_KNOWLEDGE_BASE,
        HospitalityPermissions.VIEW_KNOWLEDGE_BASE,
        HospitalityPermissions.UPLOAD_DOCUMENTS,
        HospitalityPermissions.USE_VOICE,
        HospitalityPermissions.MANAGE_CMS,
        HospitalityPermissions.VIEW_CMS,
        HospitalityPermissions.PUBLISH_CONTENT,
    ],
    "staff": [
        HospitalityPermissions.VIEW_PROPERTY,
        HospitalityPermissions.VIEW_MENU,
        HospitalityPermissions.MANAGE_ORDERS,
        HospitalityPermissions.VIEW_ORDERS,
        HospitalityPermissions.CREATE_ORDERS,
        HospitalityPermissions.UPDATE_ORDERS,
        HospitalityPermissions.VIEW_CUSTOMERS,
        HospitalityPermissions.CREATE_CUSTOMERS,
        HospitalityPermissions.VIEW_STAFF,
        HospitalityPermissions.VIEW_INVENTORY,
        HospitalityPermissions.VIEW_LOYALTY,
        HospitalityPermissions.USE_AI,
        HospitalityPermissions.VIEW_KNOWLEDGE_BASE,
        HospitalityPermissions.USE_VOICE,
        HospitalityPermissions.VIEW_CMS,
    ],
    "customer": [
        HospitalityPermissions.VIEW_MENU,
        HospitalityPermissions.CREATE_ORDERS,
        HospitalityPermissions.VIEW_LOYALTY,
        HospitalityPermissions.USE_AI,
        HospitalityPermissions.VIEW_KNOWLEDGE_BASE,
        HospitalityPermissions.USE_VOICE,
    ]
}


def has_permission(user: BuffrHostUser, permission: HospitalityPermissions) -> bool:
    """Check if user has a specific permission."""
    user_permissions = ROLE_PERMISSIONS.get(user.role, [])
    return permission in user_permissions


def require_permission(permission: HospitalityPermissions):
    """Decorator to require a specific permission."""
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Find the current_user parameter
            current_user = None
            for arg in args:
                if isinstance(arg, BuffrHostUser):
                    current_user = arg
                    break
            
            if not current_user:
                for key, value in kwargs.items():
                    if isinstance(value, BuffrHostUser):
                        current_user = value
                        break
            
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            if not has_permission(current_user, permission):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission required: {permission.value}"
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator


async def require_permission_async(
    user: BuffrHostUser, 
    permission: HospitalityPermissions, 
    property_id: Optional[int] = None
) -> None:
    """Async function to require a specific permission."""
    if not has_permission(user, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission required: {permission.value}"
        )
    
    # Additional property-level permission check
    if property_id and user.property_id != property_id and user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this property"
        )


def get_user_permissions(user: BuffrHostUser) -> List[HospitalityPermissions]:
    """Get all permissions for a user."""
    return ROLE_PERMISSIONS.get(user.role, [])
