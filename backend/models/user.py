"""
User Model
SQLAlchemy model for user management with authentication and authorization
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from database import Base

class User(Base):
    """User model for authentication and authorization"""
    
    __tablename__ = "users"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Authentication
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Profile information
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    
    # Role and permissions
    role = Column(String, default="guest", nullable=False)
    tenant_id = Column(String, ForeignKey("tenant_profiles.id"), nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)
    phone_verified = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Additional profile fields
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    timezone = Column(String, default="UTC", nullable=False)
    language = Column(String, default="en", nullable=False)
    
    # Preferences
    preferences = Column(Text, nullable=True)  # JSON string for user preferences
    notification_settings = Column(Text, nullable=True)  # JSON string for notification settings
    
    # Security
    failed_login_attempts = Column(String, default="0", nullable=False)
    locked_until = Column(DateTime, nullable=True)
    password_changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    tenant = relationship("TenantProfile", back_populates="users")
    
    def __repr__(self):
        return f"<User(id='{self.id}', email='{self.email}', role='{self.role}')>"
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "phone": self.phone,
            "role": self.role,
            "tenant_id": self.tenant_id,
            "is_active": self.is_active,
            "email_verified": self.email_verified,
            "phone_verified": self.phone_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "timezone": self.timezone,
            "language": self.language
        }
    
    def is_locked(self) -> bool:
        """Check if user account is locked"""
        if not self.locked_until:
            return False
        return datetime.utcnow() < self.locked_until
    
    def get_failed_login_attempts(self) -> int:
        """Get number of failed login attempts"""
        try:
            return int(self.failed_login_attempts)
        except (ValueError, TypeError):
            return 0
    
    def increment_failed_login_attempts(self):
        """Increment failed login attempts"""
        current_attempts = self.get_failed_login_attempts()
        self.failed_login_attempts = str(current_attempts + 1)
        
        # Lock account after 5 failed attempts
        if current_attempts >= 4:
            self.locked_until = datetime.utcnow() + timedelta(minutes=30)
    
    def reset_failed_login_attempts(self):
        """Reset failed login attempts"""
        self.failed_login_attempts = "0"
        self.locked_until = None

class UserRoleAssignment(Base):
    """User role assignment history"""
    
    __tablename__ = "user_role_assignments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role = Column(String, nullable=False)
    assigned_by = Column(String, ForeignKey("users.id"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    reason = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    assigner = relationship("User", foreign_keys=[assigned_by])

class UserSession(Base):
    """User session management"""
    
    __tablename__ = "user_sessions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    access_token = Column(String, unique=True, nullable=False)
    refresh_token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_activity = Column(DateTime, default=datetime.utcnow, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    user = relationship("User")

class UserActivity(Base):
    """User activity log"""
    
    __tablename__ = "user_activities"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)  # JSON string
    ip_address = Column(String, nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User")

class UserAudit(Base):
    """User audit trail"""
    
    __tablename__ = "user_audits"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    action = Column(String, nullable=False)
    old_values = Column(Text, nullable=True)  # JSON string
    new_values = Column(Text, nullable=True)  # JSON string
    changed_by = Column(String, ForeignKey("users.id"), nullable=False)
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ip_address = Column(String, nullable=True)
    reason = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    changer = relationship("User", foreign_keys=[changed_by])

class CustomRole(Base):
    """Custom roles for fine-grained permissions"""
    
    __tablename__ = "custom_roles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, unique=True, nullable=False)
    description = Column(Text, nullable=True)
    permissions = Column(Text, nullable=False)  # JSON string
    tenant_id = Column(String, ForeignKey("tenant_profiles.id"), nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    tenant = relationship("TenantProfile")
    creator = relationship("User")

class UserPermission(Base):
    """User-specific permissions"""
    
    __tablename__ = "user_permissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    permission = Column(String, nullable=False)
    granted = Column(Boolean, default=True, nullable=False)
    granted_by = Column(String, ForeignKey("users.id"), nullable=False)
    granted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    reason = Column(Text, nullable=True)
    source = Column(String, nullable=True)  # ADDED: Missing field from Pydantic
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    granter = relationship("User", foreign_keys=[granted_by])

class UserNotification(Base):
    """User notifications"""
    
    __tablename__ = "user_notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info", nullable=False)  # info, warning, error, success
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read_at = Column(DateTime, nullable=True)
    action_url = Column(String, nullable=True)
    notification_metadata = Column(Text, nullable=True)  # JSON string
    
    # Relationships
    user = relationship("User")

class UserPreference(Base):
    """User preferences and settings"""
    
    __tablename__ = "user_preferences"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)  # notifications, display, privacy, etc.
    key = Column(String, nullable=False)
    value = Column(Text, nullable=False)  # JSON string
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User")
    
    # Unique constraint on user_id, category, key
    __table_args__ = (
        {"extend_existing": True}
    )