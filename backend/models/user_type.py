"""
UserType model for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class UserType(Base):
    __tablename__ = "user_type"
    
    user_type_id = Column(Integer, primary_key=True, index=True)
    type_name = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text)
    requires_kyc = Column(Boolean, default=True)
    requires_kyb = Column(Boolean, default=False)
    can_book_rooms = Column(Boolean, default=True)
    can_book_facilities = Column(Boolean, default=True)
    can_order_restaurant = Column(Boolean, default=True)
    can_generate_invoices = Column(Boolean, default=False)
    can_manage_bookings = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("BuffrHostUser", back_populates="user_type")
    customers = relationship("Customer", back_populates="user_type")