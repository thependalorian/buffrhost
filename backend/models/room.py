"""
Hotel room management models for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, Time, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

from database import Base

class RoomType(Base):
    __tablename__ = "roomtype"
    room_type_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    type_name = Column(String(100), nullable=False)
    type_class = Column(String(50), nullable=False)
    description = Column(Text)
    base_price_per_night = Column(Numeric(10, 2), nullable=False)
    max_occupancy = Column(Integer, nullable=False, default=2)
    bed_type = Column(String(100))
    room_size_sqft = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    property = relationship("HospitalityProperty", back_populates="room_types")
    rooms = relationship("Room", back_populates="room_type")

class Room(Base):
    __tablename__ = "room"
    room_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    room_type_id = Column(Integer, ForeignKey("roomtype.room_type_id"))
    room_number = Column(String(20), nullable=False)
    floor_number = Column(Integer)
    room_status = Column(String(50), default="available")
    is_smoking = Column(Boolean, default=False)
    is_accessible = Column(Boolean, default=False)
    view_type = Column(String(100))
    last_cleaned = Column(DateTime(timezone=True))
    last_maintenance = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    property = relationship("HospitalityProperty", back_populates="rooms")
    room_type = relationship("RoomType", back_populates="rooms")

class RoomAmenity(Base):
    __tablename__ = "roomamenity"
    amenity_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    amenity_name = Column(String(100), nullable=False)
    amenity_category = Column(String(50))
    description = Column(Text)
    is_chargeable = Column(Boolean, default=False)
    additional_cost = Column(Numeric(10, 2), default=0.00)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RoomTypeAmenity(Base):
    __tablename__ = "roomtypeamenity"
    room_type_id = Column(Integer, ForeignKey("roomtype.room_type_id"), primary_key=True)
    amenity_id = Column(Integer, ForeignKey("roomamenity.amenity_id"), primary_key=True)
    is_included = Column(Boolean, default=True)
    additional_cost = Column(Numeric(10, 2), default=0.00)

class RoomReservation(Base):
    __tablename__ = "roomreservation"
    reservation_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    room_id = Column(Integer, ForeignKey("room.room_id"))
    room_type_id = Column(Integer, ForeignKey("roomtype.room_type_id"))
    check_in_date = Column(Date, nullable=False)
    check_out_date = Column(Date, nullable=False)
    check_in_time = Column(Time)
    check_out_time = Column(Time)
    number_of_guests = Column(Integer, nullable=False, default=1)
    adults = Column(Integer, nullable=False, default=1)
    children = Column(Integer, default=0)
    infants = Column(Integer, default=0)
    reservation_status = Column(String(50), default='confirmed')
    total_nights = Column(Integer, nullable=False)
    base_rate = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    taxes = Column(Numeric(10, 2), default=0.00)
    fees = Column(Numeric(10, 2), default=0.00)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    payment_status = Column(String(50), default='pending')
    special_requests = Column(Text)
    loyalty_points_earned = Column(Integer, default=0)
    loyalty_points_redeemed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RoomRate(Base):
    __tablename__ = "roomrate"
    rate_id = Column(Integer, primary_key=True, index=True)
    room_type_id = Column(Integer, ForeignKey("roomtype.room_type_id"))
    rate_name = Column(String(100), nullable=False)
    rate_type = Column(String(50), nullable=False)
    base_rate = Column(Numeric(10, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    min_nights = Column(Integer, default=1)
    max_nights = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RoomServiceOrder(Base):
    __tablename__ = "roomserviceorder"
    room_service_id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    reservation_id = Column(UUID(as_uuid=True), ForeignKey("roomreservation.reservation_id"))
    room_id = Column(Integer, ForeignKey("room.room_id"))
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    order_status = Column(String(50), default='pending')
    order_time = Column(DateTime(timezone=True), server_default=func.now())
    delivery_time = Column(DateTime(timezone=True))
    total_amount = Column(Numeric(10, 2), nullable=False)
    delivery_fee = Column(Numeric(10, 2), default=0.00)
    gratuity = Column(Numeric(10, 2), default=0.00)
    special_instructions = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class RoomServiceItem(Base):
    __tablename__ = "roomserviceitem"
    room_service_item_id = Column(Integer, primary_key=True, index=True)
    room_service_id = Column(UUID(as_uuid=True), ForeignKey("roomserviceorder.room_service_id"))
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"))
    quantity = Column(Integer, nullable=False, default=1)
    price_at_order = Column(Numeric(10, 2), nullable=False)
    special_instructions = Column(Text)
