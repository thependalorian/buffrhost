"""
Order-related models for Buffr Host.
Uses standardized SQL types from the unified database schema.
"""
import enum
import uuid

from sqlalchemy import Column, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


# Enums from the unified schema
class BookingStatusEnum(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class PaymentStatusEnum(enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    FAILED = "failed"
    REFUNDED = "refunded"


class Order(Base):
    __tablename__ = "orders"
    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_number = Column(
        Integer, unique=True, nullable=False, index=True, autoincrement=True
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    property_id = Column(Integer, ForeignKey("hospitality_properties.property_id"))
    status = Column(
        SQLAlchemyEnum(BookingStatusEnum), default=BookingStatusEnum.PENDING, index=True
    )
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    total = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(3), default="NAD")
    payment_method = Column(String(100))
    payment_status = Column(
        SQLAlchemyEnum(PaymentStatusEnum), default=PaymentStatusEnum.PENDING, index=True
    )
    service_type = Column(String(50), default="restaurant")
    order_type = Column(String(50), default="dine_in")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now())
    special_instructions = Column(Text)
    order_metadata = Column(JSONB, default={})

    customer = relationship("Profile", back_populates="orders")
    property = relationship("HospitalityProperty", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")
    payment_transactions = relationship("PaymentTransaction", back_populates="order")


class OrderItem(Base):
    __tablename__ = "orderitem"
    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"))
    menu_item_id = Column(Integer, ForeignKey("menu.menu_item_id"))
    quantity = Column(Integer, nullable=False, default=1)
    price_at_order = Column(Numeric(10, 2), nullable=False)
    special_instructions = Column(Text)
    order = relationship("Order", back_populates="order_items")
    menu_item = relationship("Menu", back_populates="order_items")
    options = relationship("OrderItemOption", back_populates="order_item")


class OrderItemOption(Base):
    __tablename__ = "orderitemoption"
    order_item_id = Column(
        Integer, ForeignKey("orderitem.order_item_id"), primary_key=True
    )
    option_value_id = Column(
        Integer, ForeignKey("menuoptionvalue.option_value_id"), primary_key=True
    )
    order_item = relationship("OrderItem", back_populates="options")
    option_value = relationship("MenuOptionValue")
