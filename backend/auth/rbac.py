"""
Role-Based Access Control (RBAC) for Buffr Host Hospitality Ecosystem Management Platform
Provides comprehensive permission management for hospitality properties.
"""

from typing import List, Dict, Set, Optional
from enum import Enum
from dataclasses import dataclass
from models.user import BuffrHostUser

class Permission(Enum):
    """System permissions for hospitality ecosystem"""
    
    # Property Management
    MANAGE_PROPERTY = "manage_property"
    VIEW_PROPERTY = "view_property"
    UPDATE_PROPERTY = "update_property"
    DELETE_PROPERTY = "delete_property"
    
    # User Management
    MANAGE_USERS = "manage_users"
    VIEW_USERS = "view_users"
    CREATE_USERS = "create_users"
    UPDATE_USERS = "update_users"
    DELETE_USERS = "delete_users"
    
    # Menu Management
    MANAGE_MENU = "manage_menu"
    VIEW_MENU = "view_menu"
    CREATE_MENU_ITEMS = "create_menu_items"
    UPDATE_MENU_ITEMS = "update_menu_items"
    DELETE_MENU_ITEMS = "delete_menu_items"
    
    # Order Management
    MANAGE_ORDERS = "manage_orders"
    VIEW_ORDERS = "view_orders"
    CREATE_ORDERS = "create_orders"
    UPDATE_ORDERS = "update_orders"
    CANCEL_ORDERS = "cancel_orders"
    
    # Customer Management
    MANAGE_CUSTOMERS = "manage_customers"
    VIEW_CUSTOMERS = "view_customers"
    CREATE_CUSTOMERS = "create_customers"
    UPDATE_CUSTOMERS = "update_customers"
    DELETE_CUSTOMERS = "delete_customers"
    
    # Room Management (Hotel)
    MANAGE_ROOMS = "manage_rooms"
    VIEW_ROOMS = "view_rooms"
    CREATE_ROOMS = "create_rooms"
    UPDATE_ROOMS = "update_rooms"
    DELETE_ROOMS = "delete_rooms"
    
    # Reservations
    MANAGE_RESERVATIONS = "manage_reservations"
    VIEW_RESERVATIONS = "view_reservations"
    CREATE_RESERVATIONS = "create_reservations"
    UPDATE_RESERVATIONS = "update_reservations"
    CANCEL_RESERVATIONS = "cancel_reservations"
    
    # Analytics & Reports
    VIEW_ANALYTICS = "view_analytics"
    VIEW_REPORTS = "view_reports"
    EXPORT_DATA = "export_data"
    
    # Loyalty Program
    MANAGE_LOYALTY = "manage_loyalty"
    VIEW_LOYALTY = "view_loyalty"
    UPDATE_LOYALTY_POINTS = "update_loyalty_points"
    
    # CMS & Content
    MANAGE_CONTENT = "manage_content"
    VIEW_CONTENT = "view_content"
    CREATE_CONTENT = "create_content"
    UPDATE_CONTENT = "update_content"
    DELETE_CONTENT = "delete_content"
    PUBLISH_CONTENT = "publish_content"
    
    # AI & Knowledge Base
    MANAGE_AI_AGENTS = "manage_ai_agents"
    VIEW_AI_AGENTS = "view_ai_agents"
    MANAGE_KNOWLEDGE_BASE = "manage_knowledge_base"
    VIEW_KNOWLEDGE_BASE = "view_knowledge_base"
    
    # Financial
    VIEW_FINANCIALS = "view_financials"
    MANAGE_PRICING = "manage_pricing"
    PROCESS_PAYMENTS = "process_payments"
    
    # System Administration
    MANAGE_SYSTEM = "manage_system"
    VIEW_LOGS = "view_logs"
    MANAGE_INTEGRATIONS = "manage_integrations"

class Role(Enum):
    """System roles for hospitality ecosystem"""
    
    # Property Roles
    PROPERTY_OWNER = "property_owner"
    PROPERTY_MANAGER = "property_manager"
    PROPERTY_ADMIN = "property_admin"
    
    # Service-Specific Roles
    RESTAURANT_MANAGER = "restaurant_manager"
    HOTEL_MANAGER = "hotel_manager"
    SPA_MANAGER = "spa_manager"
    CONFERENCE_MANAGER = "conference_manager"
    
    # Staff Roles
    FRONT_DESK_STAFF = "front_desk_staff"
    WAITER = "waiter"
    CHEF = "chef"
    HOUSEKEEPING = "housekeeping"
    CONCIERGE = "concierge"
    
    # Support Roles
    CUSTOMER_SERVICE = "customer_service"
    MARKETING = "marketing"
    ACCOUNTING = "accounting"
    IT_SUPPORT = "it_support"
    
    # System Roles
    SYSTEM_ADMIN = "system_admin"
    SUPER_ADMIN = "super_admin"

@dataclass
class RolePermission:
    """Role and its associated permissions"""
    role: Role
    permissions: Set[Permission]
    description: str

class RBACManager:
    """Role-Based Access Control Manager"""
    
    def __init__(self):
        self.role_permissions = self._initialize_role_permissions()
    
    def _initialize_role_permissions(self) -> Dict[Role, RolePermission]:
        """Initialize role-permission mappings"""
        return {
            Role.SUPER_ADMIN: RolePermission(
                role=Role.SUPER_ADMIN,
                permissions=set(Permission),  # All permissions
                description="Full system access"
            ),
            
            Role.SYSTEM_ADMIN: RolePermission(
                role=Role.SYSTEM_ADMIN,
                permissions={
                    Permission.MANAGE_SYSTEM,
                    Permission.VIEW_LOGS,
                    Permission.MANAGE_INTEGRATIONS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_REPORTS,
                    Permission.EXPORT_DATA,
                    Permission.MANAGE_AI_AGENTS,
                    Permission.VIEW_AI_AGENTS,
                    Permission.MANAGE_KNOWLEDGE_BASE,
                    Permission.VIEW_KNOWLEDGE_BASE
                },
                description="System administration access"
            ),
            
            Role.PROPERTY_OWNER: RolePermission(
                role=Role.PROPERTY_OWNER,
                permissions={
                    Permission.MANAGE_PROPERTY,
                    Permission.VIEW_PROPERTY,
                    Permission.UPDATE_PROPERTY,
                    Permission.MANAGE_USERS,
                    Permission.VIEW_USERS,
                    Permission.CREATE_USERS,
                    Permission.UPDATE_USERS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_REPORTS,
                    Permission.EXPORT_DATA,
                    Permission.VIEW_FINANCIALS,
                    Permission.MANAGE_PRICING,
                    Permission.MANAGE_LOYALTY,
                    Permission.VIEW_LOYALTY,
                    Permission.MANAGE_CONTENT,
                    Permission.VIEW_CONTENT,
                    Permission.CREATE_CONTENT,
                    Permission.UPDATE_CONTENT,
                    Permission.DELETE_CONTENT,
                    Permission.PUBLISH_CONTENT
                },
                description="Property owner with full property access"
            ),
            
            Role.PROPERTY_MANAGER: RolePermission(
                role=Role.PROPERTY_MANAGER,
                permissions={
                    Permission.VIEW_PROPERTY,
                    Permission.UPDATE_PROPERTY,
                    Permission.VIEW_USERS,
                    Permission.UPDATE_USERS,
                    Permission.MANAGE_MENU,
                    Permission.VIEW_MENU,
                    Permission.CREATE_MENU_ITEMS,
                    Permission.UPDATE_MENU_ITEMS,
                    Permission.DELETE_MENU_ITEMS,
                    Permission.MANAGE_ORDERS,
                    Permission.VIEW_ORDERS,
                    Permission.UPDATE_ORDERS,
                    Permission.CANCEL_ORDERS,
                    Permission.MANAGE_CUSTOMERS,
                    Permission.VIEW_CUSTOMERS,
                    Permission.CREATE_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.MANAGE_ROOMS,
                    Permission.VIEW_ROOMS,
                    Permission.CREATE_ROOMS,
                    Permission.UPDATE_ROOMS,
                    Permission.MANAGE_RESERVATIONS,
                    Permission.VIEW_RESERVATIONS,
                    Permission.CREATE_RESERVATIONS,
                    Permission.UPDATE_RESERVATIONS,
                    Permission.CANCEL_RESERVATIONS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_REPORTS,
                    Permission.VIEW_LOYALTY,
                    Permission.MANAGE_CONTENT,
                    Permission.VIEW_CONTENT,
                    Permission.CREATE_CONTENT,
                    Permission.UPDATE_CONTENT
                },
                description="Property manager with operational access"
            ),
            
            Role.RESTAURANT_MANAGER: RolePermission(
                role=Role.RESTAURANT_MANAGER,
                permissions={
                    Permission.VIEW_PROPERTY,
                    Permission.MANAGE_MENU,
                    Permission.VIEW_MENU,
                    Permission.CREATE_MENU_ITEMS,
                    Permission.UPDATE_MENU_ITEMS,
                    Permission.DELETE_MENU_ITEMS,
                    Permission.MANAGE_ORDERS,
                    Permission.VIEW_ORDERS,
                    Permission.CREATE_ORDERS,
                    Permission.UPDATE_ORDERS,
                    Permission.CANCEL_ORDERS,
                    Permission.MANAGE_CUSTOMERS,
                    Permission.VIEW_CUSTOMERS,
                    Permission.CREATE_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_LOYALTY,
                    Permission.MANAGE_CONTENT,
                    Permission.VIEW_CONTENT,
                    Permission.CREATE_CONTENT,
                    Permission.UPDATE_CONTENT
                },
                description="Restaurant manager with restaurant-specific access"
            ),
            
            Role.HOTEL_MANAGER: RolePermission(
                role=Role.HOTEL_MANAGER,
                permissions={
                    Permission.VIEW_PROPERTY,
                    Permission.MANAGE_ROOMS,
                    Permission.VIEW_ROOMS,
                    Permission.CREATE_ROOMS,
                    Permission.UPDATE_ROOMS,
                    Permission.MANAGE_RESERVATIONS,
                    Permission.VIEW_RESERVATIONS,
                    Permission.CREATE_RESERVATIONS,
                    Permission.UPDATE_RESERVATIONS,
                    Permission.CANCEL_RESERVATIONS,
                    Permission.MANAGE_CUSTOMERS,
                    Permission.VIEW_CUSTOMERS,
                    Permission.CREATE_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.VIEW_ANALYTICS,
                    Permission.VIEW_LOYALTY,
                    Permission.MANAGE_CONTENT,
                    Permission.VIEW_CONTENT,
                    Permission.CREATE_CONTENT,
                    Permission.UPDATE_CONTENT
                },
                description="Hotel manager with hotel-specific access"
            ),
            
            Role.FRONT_DESK_STAFF: RolePermission(
                role=Role.FRONT_DESK_STAFF,
                permissions={
                    Permission.VIEW_PROPERTY,
                    Permission.VIEW_ROOMS,
                    Permission.VIEW_RESERVATIONS,
                    Permission.CREATE_RESERVATIONS,
                    Permission.UPDATE_RESERVATIONS,
                    Permission.VIEW_CUSTOMERS,
                    Permission.CREATE_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.VIEW_LOYALTY,
                    Permission.UPDATE_LOYALTY_POINTS
                },
                description="Front desk staff with guest service access"
            ),
            
            Role.WAITER: RolePermission(
                role=Role.WAITER,
                permissions={
                    Permission.VIEW_MENU,
                    Permission.VIEW_ORDERS,
                    Permission.CREATE_ORDERS,
                    Permission.UPDATE_ORDERS,
                    Permission.VIEW_CUSTOMERS,
                    Permission.CREATE_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.VIEW_LOYALTY,
                    Permission.UPDATE_LOYALTY_POINTS
                },
                description="Waiter with order and customer service access"
            ),
            
            Role.CHEF: RolePermission(
                role=Role.CHEF,
                permissions={
                    Permission.VIEW_MENU,
                    Permission.UPDATE_MENU_ITEMS,
                    Permission.VIEW_ORDERS,
                    Permission.UPDATE_ORDERS
                },
                description="Chef with kitchen operations access"
            ),
            
            Role.CUSTOMER_SERVICE: RolePermission(
                role=Role.CUSTOMER_SERVICE,
                permissions={
                    Permission.VIEW_CUSTOMERS,
                    Permission.UPDATE_CUSTOMERS,
                    Permission.VIEW_ORDERS,
                    Permission.VIEW_RESERVATIONS,
                    Permission.VIEW_LOYALTY,
                    Permission.UPDATE_LOYALTY_POINTS,
                    Permission.VIEW_AI_AGENTS,
                    Permission.VIEW_KNOWLEDGE_BASE
                },
                description="Customer service with guest support access"
            )
        }
    
    def has_permission(self, user: BuffrHostUser, permission: Permission) -> bool:
        """Check if user has specific permission"""
        if not user.role:
            return False
        
        try:
            user_role = Role(user.role)
            role_permission = self.role_permissions.get(user_role)
            
            if not role_permission:
                return False
            
            return permission in role_permission.permissions
        except ValueError:
            return False
    
    def has_any_permission(self, user: BuffrHostUser, permissions: List[Permission]) -> bool:
        """Check if user has any of the specified permissions"""
        return any(self.has_permission(user, perm) for perm in permissions)
    
    def has_all_permissions(self, user: BuffrHostUser, permissions: List[Permission]) -> bool:
        """Check if user has all of the specified permissions"""
        return all(self.has_permission(user, perm) for perm in permissions)
    
    def get_user_permissions(self, user: BuffrHostUser) -> Set[Permission]:
        """Get all permissions for a user"""
        if not user.role:
            return set()
        
        try:
            user_role = Role(user.role)
            role_permission = self.role_permissions.get(user_role)
            
            if not role_permission:
                return set()
            
            return role_permission.permissions
        except ValueError:
            return set()
    
    def can_access_property(self, user: BuffrHostUser, property_id: int) -> bool:
        """Check if user can access specific property"""
        # Super admin can access all properties
        if self.has_permission(user, Permission.MANAGE_SYSTEM):
            return True
        
        # User must belong to the property
        return user.property_id == property_id
    
    def can_manage_property(self, user: BuffrHostUser, property_id: int) -> bool:
        """Check if user can manage specific property"""
        if not self.can_access_property(user, property_id):
            return False
        
        return self.has_permission(user, Permission.MANAGE_PROPERTY)
    
    def can_view_analytics(self, user: BuffrHostUser, property_id: int) -> bool:
        """Check if user can view analytics for property"""
        if not self.can_access_property(user, property_id):
            return False
        
        return self.has_permission(user, Permission.VIEW_ANALYTICS)
    
    def can_manage_users(self, user: BuffrHostUser, property_id: int) -> bool:
        """Check if user can manage users for property"""
        if not self.can_access_property(user, property_id):
            return False
        
        return self.has_permission(user, Permission.MANAGE_USERS)
    
    def get_role_description(self, role: str) -> str:
        """Get description for a role"""
        try:
            user_role = Role(role)
            role_permission = self.role_permissions.get(user_role)
            return role_permission.description if role_permission else "Unknown role"
        except ValueError:
            return "Invalid role"

# Global RBAC manager instance
rbac_manager = RBACManager()
