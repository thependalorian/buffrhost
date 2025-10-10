"""
User Service
Complete user management with authentication, roles, and permissions
"""

from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from models.user import User
from schemas.user import UserCreate, UserUpdate, UserResponse, UserLogin
from utils.security import hash_password, verify_password, create_access_token, create_refresh_token
from utils.validation import validate_email, validate_phone
from auth.permissions import has_permission, PERMISSIONS_MAP

logger = logging.getLogger(__name__)

class UserService:
    """User management service with authentication and authorization"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_user(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        try:
            return self.db.query(User).filter(User.id == user_id).first()
        except Exception as e:
            logger.error(f"Failed to get user {user_id}: {str(e)}")
            return None
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        try:
            return self.db.query(User).filter(User.email == email).first()
        except Exception as e:
            logger.error(f"Failed to get user by email {email}: {str(e)}")
            return None
    
    def get_users(
        self, 
        skip: int = 0, 
        limit: int = 100,
        tenant_id: Optional[str] = None,
        role: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[User]:
        """Get list of users with optional filters"""
        try:
            query = self.db.query(User)
            
            if tenant_id:
                query = query.filter(User.tenant_id == tenant_id)
            
            if role:
                query = query.filter(User.role == role)
            
            if is_active is not None:
                query = query.filter(User.is_active == is_active)
            
            return query.offset(skip).limit(limit).all()
        except Exception as e:
            logger.error(f"Failed to get users: {str(e)}")
            return []
    
    def create_user(self, user_data: UserCreate) -> Optional[User]:
        """Create new user"""
        try:
            # Validate email
            if not validate_email(user_data.email):
                raise ValueError("Invalid email format")
            
            # Check if user already exists
            existing_user = self.get_user_by_email(user_data.email)
            if existing_user:
                raise ValueError("User with this email already exists")
            
            # Validate phone if provided
            if user_data.phone and not validate_phone(user_data.phone):
                raise ValueError("Invalid phone number format")
            
            # Hash password
            hashed_password = hash_password(user_data.password)
            
            # Create user
            db_user = User(
                email=user_data.email,
                hashed_password=hashed_password,
                full_name=user_data.full_name,
                phone=user_data.phone,
                role=user_data.role,
                tenant_id=user_data.tenant_id,
                is_active=user_data.is_active,
                email_verified=user_data.email_verified,
                phone_verified=user_data.phone_verified,
                last_login=None,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            
            logger.info(f"User created successfully: {db_user.email}")
            return db_user
            
        except Exception as e:
            logger.error(f"Failed to create user: {str(e)}")
            self.db.rollback()
            raise
    
    def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        try:
            db_user = self.get_user(user_id)
            if not db_user:
                raise ValueError("User not found")
            
            # Update fields
            update_data = user_data.dict(exclude_unset=True)
            
            # Validate email if being updated
            if "email" in update_data:
                if not validate_email(update_data["email"]):
                    raise ValueError("Invalid email format")
                
                # Check if email is already taken by another user
                existing_user = self.get_user_by_email(update_data["email"])
                if existing_user and existing_user.id != user_id:
                    raise ValueError("Email already taken by another user")
            
            # Validate phone if being updated
            if "phone" in update_data and update_data["phone"]:
                if not validate_phone(update_data["phone"]):
                    raise ValueError("Invalid phone number format")
            
            # Hash password if being updated
            if "password" in update_data:
                update_data["hashed_password"] = hash_password(update_data.pop("password"))
            
            # Update user fields
            for field, value in update_data.items():
                if hasattr(db_user, field):
                    setattr(db_user, field, value)
            
            db_user.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(db_user)
            
            logger.info(f"User updated successfully: {db_user.email}")
            return db_user
            
        except Exception as e:
            logger.error(f"Failed to update user: {str(e)}")
            self.db.rollback()
            raise
    
    def delete_user(self, user_id: str) -> bool:
        """Delete user (soft delete)"""
        try:
            db_user = self.get_user(user_id)
            if not db_user:
                return False
            
            # Soft delete - mark as inactive
            db_user.is_active = False
            db_user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"User deleted successfully: {db_user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete user: {str(e)}")
            self.db.rollback()
            return False
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        try:
            user = self.get_user_by_email(email)
            if not user:
                return None
            
            if not verify_password(password, user.hashed_password):
                return None
            
            if not user.is_active:
                return None
            
            # Update last login
            user.last_login = datetime.utcnow()
            self.db.commit()
            
            logger.info(f"User authenticated successfully: {email}")
            return user
            
        except Exception as e:
            logger.error(f"Failed to authenticate user: {str(e)}")
            return None
    
    def create_access_token(self, user: User) -> str:
        """Create access token for user"""
        token_data = {
            "sub": user.id,
            "email": user.email,
            "role": user.role,
            "tenant_id": user.tenant_id
        }
        return create_access_token(token_data)
    
    def create_refresh_token(self, user: User) -> str:
        """Create refresh token for user"""
        token_data = {
            "sub": user.id,
            "email": user.email
        }
        return create_refresh_token(token_data)
    
    def verify_email(self, user_id: str) -> bool:
        """Verify user email"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            user.email_verified = True
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Email verified for user: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to verify email: {str(e)}")
            self.db.rollback()
            return False
    
    def verify_phone(self, user_id: str) -> bool:
        """Verify user phone"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            user.phone_verified = True
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Phone verified for user: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to verify phone: {str(e)}")
            self.db.rollback()
            return False
    
    def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        """Change user password"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            # Verify old password
            if not verify_password(old_password, user.hashed_password):
                raise ValueError("Current password is incorrect")
            
            # Hash new password
            user.hashed_password = hash_password(new_password)
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Password changed for user: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to change password: {str(e)}")
            self.db.rollback()
            raise
    
    def reset_password(self, user_id: str, new_password: str) -> bool:
        """Reset user password (admin function)"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            # Hash new password
            user.hashed_password = hash_password(new_password)
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Password reset for user: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to reset password: {str(e)}")
            self.db.rollback()
            return False
    
    def update_role(self, user_id: str, new_role: str, updated_by: str) -> bool:
        """Update user role"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            # Validate role
            if new_role not in PERMISSIONS_MAP:
                raise ValueError("Invalid role")
            
            old_role = user.role
            user.role = new_role
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"Role updated for user {user.email}: {old_role} -> {new_role} by {updated_by}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update role: {str(e)}")
            self.db.rollback()
            raise
    
    def get_user_permissions(self, user_id: str) -> List[str]:
        """Get user permissions based on role"""
        try:
            user = self.get_user(user_id)
            if not user:
                return []
            
            return PERMISSIONS_MAP.get(user.role, [])
            
        except Exception as e:
            logger.error(f"Failed to get user permissions: {str(e)}")
            return []
    
    def check_user_permission(self, user_id: str, permission: str) -> bool:
        """Check if user has specific permission"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            return has_permission(user, permission)
            
        except Exception as e:
            logger.error(f"Failed to check user permission: {str(e)}")
            return False
    
    def get_user_stats(self, tenant_id: Optional[str] = None) -> Dict[str, Any]:
        """Get user statistics"""
        try:
            query = self.db.query(User)
            
            if tenant_id:
                query = query.filter(User.tenant_id == tenant_id)
            
            total_users = query.count()
            active_users = query.filter(User.is_active == True).count()
            verified_users = query.filter(User.email_verified == True).count()
            
            # Role distribution
            role_stats = {}
            for role in PERMISSIONS_MAP.keys():
                count = query.filter(User.role == role).count()
                if count > 0:
                    role_stats[role] = count
            
            # Recent registrations (last 30 days)
            thirty_days_ago = datetime.utcnow() - timedelta(days=30)
            recent_registrations = query.filter(User.created_at >= thirty_days_ago).count()
            
            return {
                "total_users": total_users,
                "active_users": active_users,
                "inactive_users": total_users - active_users,
                "verified_users": verified_users,
                "unverified_users": total_users - verified_users,
                "role_distribution": role_stats,
                "recent_registrations": recent_registrations
            }
            
        except Exception as e:
            logger.error(f"Failed to get user stats: {str(e)}")
            return {}
    
    def search_users(
        self, 
        query: str, 
        tenant_id: Optional[str] = None,
        limit: int = 20
    ) -> List[User]:
        """Search users by name or email"""
        try:
            db_query = self.db.query(User)
            
            if tenant_id:
                db_query = db_query.filter(User.tenant_id == tenant_id)
            
            # Search in name and email
            search_filter = (
                User.full_name.ilike(f"%{query}%") |
                User.email.ilike(f"%{query}%")
            )
            
            return db_query.filter(search_filter).limit(limit).all()
            
        except Exception as e:
            logger.error(f"Failed to search users: {str(e)}")
            return []
    
    def get_users_by_role(self, role: str, tenant_id: Optional[str] = None) -> List[User]:
        """Get users by role"""
        try:
            query = self.db.query(User).filter(User.role == role)
            
            if tenant_id:
                query = query.filter(User.tenant_id == tenant_id)
            
            return query.all()
            
        except Exception as e:
            logger.error(f"Failed to get users by role: {str(e)}")
            return []
    
    def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            user.is_active = False
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"User deactivated: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to deactivate user: {str(e)}")
            self.db.rollback()
            return False
    
    def activate_user(self, user_id: str) -> bool:
        """Activate user account"""
        try:
            user = self.get_user(user_id)
            if not user:
                return False
            
            user.is_active = True
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            
            logger.info(f"User activated: {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to activate user: {str(e)}")
            self.db.rollback()
            return False
