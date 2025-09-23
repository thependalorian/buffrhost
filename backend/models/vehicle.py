"""
Vehicle model for Buffr Host platform.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

class Vehicle(Base):
    __tablename__ = "vehicle"
    vehicle_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    vehicle_type = Column(String(100), nullable=False)
    make = Column(String(100))
    model = Column(String(100))
    year = Column(Integer)
    license_plate = Column(String(20), unique=True, index=True)
    capacity = Column(Integer)
    is_available = Column(Boolean, default=True)
    driver_id = Column(String(255), ForeignKey("staff_profile.staff_id"))
    last_maintenance = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    property = relationship("HospitalityProperty", back_populates="vehicles")
    driver = relationship("StaffProfile")
