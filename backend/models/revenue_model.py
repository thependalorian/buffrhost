from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid

from database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    plan_name = Column(String, nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)
    status = Column(String, default="active") # e.g., active, cancelled, expired
    price = Column(Float, nullable=False)
    currency = Column(String, default="NAD")
    billing_period = Column(String) # e.g., monthly, annually
    metadata_ = Column(JSONB) # Additional subscription details
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ServiceFee(Base):
    __tablename__ = "service_fees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    fee_type = Column(String) # e.g., fixed, percentage
    value = Column(Float, nullable=False) # e.g., 10.00 or 0.05
    applies_to = Column(String) # e.g., booking, payment, transaction
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CommissionStructure(Base):
    __tablename__ = "commission_structures"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String)
    commission_type = Column(String) # e.g., fixed, percentage, tiered
    value = Column(Float, nullable=False)
    applies_to_role = Column(String) # e.g., staff, manager
    is_active = Column(Boolean, default=True)
    metadata_ = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    total_amount = Column(Float, nullable=False)
    currency = Column(String, default="NAD")
    status = Column(String, default="pending") # e.g., pending, paid, overdue, cancelled
    items = Column(JSONB) # e.g., [{"description": "Room booking", "quantity": 1, "unit_price": 500.00}]
    payment_details = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
