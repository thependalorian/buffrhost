"""
User models for The Shandi (Unified Schema)

Defines SQLAlchemy models for users, profiles, and preferences, aligning with the unified schema.
Uses standardized SQL types from the unified database schema.
"""
import enum

from sqlalchemy import ARRAY, Boolean, Column, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# Enums from the unified schema - matching SQL types exactly
class UserRoleEnum(enum.Enum):
    INDIVIDUAL = "individual"
    SME_USER = "sme_user"
    ENTERPRISE_USER = "enterprise_user"
    ADMIN = "admin"
    HOSPITALITY_STAFF = "hospitality_staff"
    CUSTOMER = "customer"
    CORPORATE_CUSTOMER = "corporate_customer"


class UserStatusEnum(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"
    ARCHIVED = "archived"


# Unified User and Profile Models - matching SQL schema exactly
class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        server_default=func.gen_random_uuid())
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), unique=True)
    role = Column(
        SQLAlchemyEnum(UserRoleEnum), nullable=False, default=UserRoleEnum.INDIVIDUAL
    )
    status = Column(
        SQLAlchemyEnum(UserStatusEnum),
        nullable=False,
        default=UserStatusEnum.PENDING_VERIFICATION)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # ADD MISSING AUTHENTICATION FIELDS:
    owner_id = Column(String(255), unique=True, index=True)  # For auth compatibility
    password = Column(String(255))  # For authentication
    is_active = Column(Boolean, default=True)  # For user status
    property_id = Column(Integer)  # For hospitality context
    name = Column(String(255))  # For user display

    profile = relationship("Profile", back_populates="user", uselist=False)
    preferences = relationship("UserPreferences", back_populates="user", uselist=False)


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    email = Column(Text, unique=True, nullable=False)
    full_name = Column(Text)
    phone_number = Column(Text)
    company_name = Column(Text)
    user_role = Column(SQLAlchemyEnum(UserRoleEnum), default=UserRoleEnum.INDIVIDUAL)
    plan_type = Column(Text, default="free")
    status = Column(Text, default="active")
    is_verified = Column(Boolean, default=False)
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Additional fields from unified schema
    preferences = Column(JSONB, default={})
    biometric_data = Column(JSONB, default=[])
    behavioral_metrics = Column(JSONB, default={})
    subscription_expires_at = Column(DateTime(timezone=True))
    first_name = Column(Text)
    last_name = Column(Text)
    property_id = Column(Integer)  # Link to hospitality_property if applicable
    user_type_id = Column(Integer)  # Link to user_type if applicable
    permissions = Column(ARRAY(Text), default=[])

    # KYC Information
    country_code = Column(Text)
    national_id_number = Column(Text)
    national_id_type = Column(Text)
    id_document_url = Column(Text)
    kyc_status = Column(Text, default="pending")
    consent_given = Column(Boolean, default=False)
    legal_basis = Column(Text)
    retention_period = Column(Integer)  # in days

    user = relationship("User", back_populates="profile")


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    push_notifications = Column(Boolean, default=True)
    two_factor_enabled = Column(Boolean, default=False)
    privacy_level = Column(String(50), default="standard")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="preferences")


# Password Reset Models
class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token_id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    email = Column(String(255), nullable=False)
    
    # Token Details
    reset_token = Column(String(255), unique=True, nullable=False)
    token_hash = Column(String(255), nullable=False)
    
    # Token Status
    is_used = Column(Boolean, default=False)
    is_expired = Column(Boolean, default=False)
    
    # Token Lifecycle
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used_at = Column(DateTime(timezone=True))
    
    # Security Details
    ip_address = Column(INET)
    user_agent = Column(Text)
    request_source = Column(String(50), default="web")
    
    # Additional Metadata
    metadata = Column(JSONB, default={})
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class PasswordResetAttempt(Base):
    __tablename__ = "password_reset_attempts"

    attempt_id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    email = Column(String(255), nullable=False)
    ip_address = Column(INET, nullable=False)
    
    # Attempt Details
    attempt_type = Column(String(50), nullable=False)  # 'request', 'verify', 'reset'
    success = Column(Boolean, nullable=False)
    failure_reason = Column(String(255))
    
    # Security Details
    user_agent = Column(Text)
    request_source = Column(String(50), default="web")
    
    # Timestamps
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional Metadata
    metadata = Column(JSONB, default={})


class PasswordHistory(Base):
    __tablename__ = "password_history"

    history_id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    
    # Password Details
    password_hash = Column(String(255), nullable=False)
    password_salt = Column(String(255), nullable=False)
    
    # Change Details
    changed_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    change_reason = Column(String(50), default="user_request")  # 'user_request', 'admin_reset', 'password_reset'
    change_source = Column(String(50), default="web")  # 'web', 'mobile', 'api'
    
    # Timestamps
    changed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Additional Metadata
    metadata = Column(JSONB, default={})
