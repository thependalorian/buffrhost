"""
Customer model for Buffr Host platform.
"""
from sqlalchemy import Column, String, Integer, DateTime, Date, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

class Customer(Base):
    __tablename__ = "customer"
    
    customer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_type_id = Column(Integer, ForeignKey("user_type.user_type_id"), default=1)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20), index=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    date_of_birth = Column(Date)
    nationality = Column(String(100))
    passport_number = Column(String(50))
    id_document_type = Column(String(50))
    id_document_number = Column(String(100))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(20))
    kyc_status = Column(String(50), default='pending')
    kyc_verified_at = Column(DateTime(timezone=True))
    kyc_expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    loyalty_points = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    orders = relationship("Order", back_populates="customer")
    user_type = relationship("UserType", back_populates="customers")