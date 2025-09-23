"""
User model for Buffr Host platform.
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class BuffrHostUser(Base):
    __tablename__ = "buffr_host_user"
    
    owner_id = Column(String(255), primary_key=True, index=True)
    password = Column(String(255), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    user_type_id = Column(Integer, ForeignKey("user_type.user_type_id"), default=5)
    role = Column(String(50), nullable=False, default="hospitality_staff", index=True)
    permissions = Column(ARRAY(String))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    property = relationship("HospitalityProperty", back_populates="users")
    user_type = relationship("UserType", back_populates="users")
