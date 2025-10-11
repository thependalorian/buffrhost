"""
Role-Based Access Control (RBAC) Service
Advanced permission management and role assignment
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class Permission(str, Enum):
    """Available permissions in the system"""
    # User management
    USERS_READ = "users:read"
    USERS_WRITE = "users:write"
    USERS_DELETE = "users:delete"
    USERS_MANAGE = "users:manage"
    
    # Role management
    ROLES_READ = "roles:read"
    ROLES_WRITE = "roles:write"
    ROLES_DELETE = "roles:delete"
    ROLES_MANAGE = "roles:manage"
    
    # Permission management
    PERMISSIONS_READ = "permissions:read"
    PERMISSIONS_WRITE = "permissions:write"
    PERMISSIONS_MANAGE = "permissions:manage"
    
    # Tenant management
    TENANTS_READ = "tenants:read"
    TENANTS_WRITE = "tenants:write"
    TENANTS_DELETE = "tenants:delete"
    TENANTS_MANAGE = "tenants:manage"
    
    # Property management
    PROPERTIES_READ = "properties:read"
    PROPERTIES_WRITE = "properties:write"
    PROPERTIES_DELETE = "properties:delete"
    PROPERTIES_MANAGE = "properties:manage"
    
    # Hotel configuration
    HOTEL_CONFIG_READ = "hotel_configuration:read"
    HOTEL_CONFIG_WRITE = "hotel_configuration:write"
    HOTEL_CONFIG_DELETE = "hotel_configuration:delete"
    HOTEL_CONFIG_MANAGE = "hotel_configuration:manage"
    
    # Booking management
    BOOKINGS_READ = "bookings:read"
    BOOKINGS_WRITE = "bookings:write"
    BOOKINGS_DELETE = "bookings:delete"
    BOOKINGS_MANAGE = "bookings:manage"
    
    # Financial management
    FINANCIAL_READ = "financial:read"
    FINANCIAL_WRITE = "financial:write"
    FINANCIAL_DELETE = "financial:delete"
    FINANCIAL_MANAGE = "financial:manage"
    
    # System management
    SETTINGS_READ = "settings:read"
    SETTINGS_WRITE = "settings:write"
    SETTINGS_MANAGE = "settings:manage"
    
    # Analytics
    ANALYTICS_READ = "analytics:read"
    ANALYTICS_WRITE = "analytics:write"
    ANALYTICS_MANAGE = "analytics:manage"

class Role(str, Enum):
    """Available roles in the system"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    GUEST = "guest"

class UserRole(str, Enum):
    """Available user roles in the system"""
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    MANAGER = "manager"
    STAFF = "staff"
    GUEST = "guest"

class PermissionScope(str, Enum):
    """Permission scopes for fine-grained access control"""
    GLOBAL = "global"      # System-wide access
    TENANT = "tenant"      # Tenant-specific access
    PROPERTY = "property"  # Property-specific access
    USER = "user"          # User-specific access

class RBACService:
    """
    Role-Based Access Control Service
    Manages user roles, permissions, and access control
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def assign_role(self, user_id: str, role: UserRole, assigned_by: str) -> bool:
        """
        Assign a role to a user
        """
        try:
            from models.user import User
            from models.user_role import UserRoleAssignment
            
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found for role assignment")
                return False
            
            # Check if user can assign this role
            assigner = self.db.query(User).filter(User.id == assigned_by).first()
            if not self._can_assign_role(assigner, role):
                logger.error(f"User {assigned_by} cannot assign role {role}")
                return False
            
            # Create or update role assignment
            existing_assignment = self.db.query(UserRoleAssignment).filter(
                UserRoleAssignment.user_id == user_id
            ).first()
            
            if existing_assignment:
                existing_assignment.role = role.value
                existing_assignment.assigned_by = assigned_by
                existing_assignment.assigned_at = datetime.utcnow()
            else:
                role_assignment = UserRoleAssignment(
                    user_id=user_id,
                    role=role.value,
                    assigned_by=assigned_by,
                    assigned_at=datetime.utcnow()
                )
                self.db.add(role_assignment)
            
            # Update user role
            user.role = role.value
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"Role {role} assigned to user {user_id} by {assigned_by}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to assign role: {str(e)}")
            self.db.rollback()
            return False
    
    def revoke_role(self, user_id: str, revoked_by: str) -> bool:
        """
        Revoke user's role (set to guest)
        """
        try:
            from models.user import User
            from models.user_role import UserRoleAssignment
            
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.error(f"User {user_id} not found for role revocation")
                return False
            
            # Check if user can revoke this role
            revoker = self.db.query(User).filter(User.id == revoked_by).first()
            if not self._can_revoke_role(revoker, user):
                logger.error(f"User {revoked_by} cannot revoke role from user {user_id}")
                return False
            
            # Update role assignment
            role_assignment = self.db.query(UserRoleAssignment).filter(
                UserRoleAssignment.user_id == user_id
            ).first()
            
            if role_assignment:
                role_assignment.role = UserRole.GUEST.value
                role_assignment.assigned_by = revoked_by
                role_assignment.assigned_at = datetime.utcnow()
            
            # Update user role
            user.role = UserRole.GUEST.value
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"Role revoked from user {user_id} by {revoked_by}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to revoke role: {str(e)}")
            self.db.rollback()
            return False
    
    def get_user_permissions(self, user_id: str) -> List[str]:
        """
        Get all permissions for a user based on their role
        """
        try:
            from models.user import User
            from .permissions import PERMISSIONS_MAP
            
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return []
            
            return PERMISSIONS_MAP.get(user.role, [])
            
        except Exception as e:
            logger.error(f"Failed to get user permissions: {str(e)}")
            return []
    
    def check_permission(self, user_id: str, permission: str, resource_id: Optional[str] = None) -> bool:
        """
        Check if user has specific permission, optionally for a specific resource
        """
        try:
            from models.user import User
            from .permissions import has_permission
            
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                return False
            
            # Check basic permission
            if not has_permission(user, permission):
                return False
            
            # Check resource-specific access if resource_id provided
            if resource_id:
                return self._check_resource_access(user, permission, resource_id)
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to check permission: {str(e)}")
            return False
    
    def get_users_by_role(self, role: UserRole, tenant_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get all users with specific role, optionally filtered by tenant
        """
        try:
            from models.user import User
            
            query = self.db.query(User).filter(User.role == role.value)
            
            if tenant_id:
                query = query.filter(User.tenant_id == tenant_id)
            
            users = query.all()
            
            return [
                {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "role": user.role,
                    "is_active": user.is_active,
                    "created_at": user.created_at,
                    "last_login": user.last_login
                }
                for user in users
            ]
            
        except Exception as e:
            logger.error(f"Failed to get users by role: {str(e)}")
            return []
    
    def get_role_statistics(self, tenant_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get statistics about role distribution
        """
        try:
            from models.user import User
            from sqlalchemy import func
            
            query = self.db.query(User.role, func.count(User.id).label('count'))
            
            if tenant_id:
                query = query.filter(User.tenant_id == tenant_id)
            
            results = query.group_by(User.role).all()
            
            stats = {}
            total_users = 0
            
            for role, count in results:
                stats[role] = count
                total_users += count
            
            stats['total'] = total_users
            
            # Calculate percentages
            for role in stats:
                if role != 'total' and total_users > 0:
                    stats[f"{role}_percentage"] = round((stats[role] / total_users) * 100, 2)
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get role statistics: {str(e)}")
            return {}
    
    def _can_assign_role(self, assigner, target_role: UserRole) -> bool:
        """
        Check if user can assign the target role
        """
        if not assigner:
            return False
        
        from .permissions import get_role_level, can_manage_role
        return can_manage_role(assigner.role, target_role.value)
    
    def _can_revoke_role(self, revoker, target_user) -> bool:
        """
        Check if user can revoke role from target user
        """
        if not revoker or not target_user:
            return False
        
        from .permissions import get_role_level, can_manage_role
        return can_manage_role(revoker.role, target_user.role)
    
    def _check_resource_access(self, user, permission: str, resource_id: str) -> bool:
        """
        Check if user has access to specific resource
        """
        # Super admins can access any resource
        if user.role == "super_admin":
            return True
        
        # Check tenant access
        if permission.startswith("tenants:") or permission.startswith("onboarding:"):
            return user.tenant_id == resource_id
        
        # Check property access
        if permission.startswith("properties:") or permission.startswith("rooms:") or permission.startswith("hotel_configuration:"):
            from models.hospitality_property import HospitalityProperty
            property = self.db.query(HospitalityProperty).filter(
                HospitalityProperty.id == resource_id
            ).first()
            return property and property.tenant_id == user.tenant_id
        
        # Check user access
        if permission.startswith("users:") or permission.startswith("profile:"):
            return user.id == resource_id or user.role in ["admin", "super_admin"]
        
        # Default to True for other permissions
        return True
    
    def create_custom_role(self, role_name: str, permissions: List[str], created_by: str) -> bool:
        """
        Create a custom role with specific permissions
        """
        try:
            from models.custom_role import CustomRole
            
            # Check if creator can create roles
            creator = self.db.query(User).filter(User.id == created_by).first()
            if not creator or creator.role not in ["admin", "super_admin"]:
                logger.error(f"User {created_by} cannot create custom roles")
                return False
            
            # Check if role already exists
            existing_role = self.db.query(CustomRole).filter(
                CustomRole.name == role_name
            ).first()
            
            if existing_role:
                logger.error(f"Custom role {role_name} already exists")
                return False
            
            # Create custom role
            custom_role = CustomRole(
                name=role_name,
                permissions=permissions,
                created_by=created_by,
                created_at=datetime.utcnow()
            )
            
            self.db.add(custom_role)
            self.db.commit()
            
            logger.info(f"Custom role {role_name} created by {created_by}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to create custom role: {str(e)}")
            self.db.rollback()
            return False
    
    def get_audit_log(self, user_id: Optional[str] = None, action: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Get audit log for role and permission changes
        """
        try:
            from models.audit_log import AuditLog
            
            query = self.db.query(AuditLog).filter(
                AuditLog.action.in_(["role_assigned", "role_revoked", "permission_granted", "permission_denied"])
            )
            
            if user_id:
                query = query.filter(AuditLog.user_id == user_id)
            
            if action:
                query = query.filter(AuditLog.action == action)
            
            logs = query.order_by(AuditLog.created_at.desc()).limit(100).all()
            
            return [
                {
                    "id": log.id,
                    "user_id": log.user_id,
                    "action": log.action,
                    "details": log.details,
                    "ip_address": log.ip_address,
                    "user_agent": log.user_agent,
                    "created_at": log.created_at
                }
                for log in logs
            ]
            
        except Exception as e:
            logger.error(f"Failed to get audit log: {str(e)}")
            return []

# Global RBAC manager instance
rbac_manager = None

def get_rbac_manager(db: Session) -> RBACService:
    """
    Get RBAC manager instance
    """
    global rbac_manager
    if rbac_manager is None:
        rbac_manager = RBACService(db)
    return rbac_manager