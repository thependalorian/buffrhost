import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from database import Base


class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False
    )  # Owner of the bank account
    account_name = Column(String, nullable=False)
    bank_name = Column(String, nullable=False)
    account_number = Column(String, nullable=False)
    routing_number = Column(String)  # Or SWIFT/BIC
    currency = Column(String, default="NAD")
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(
        UUID(as_uuid=True), ForeignKey("bank_accounts.id"), nullable=False
    )
    type = Column(
        String, nullable=False
    )  # e.g., 'deposit', 'withdrawal', 'payment', 'refund'
    amount = Column(Float, nullable=False)
    currency = Column(String, default="NAD")
    description = Column(String)
    status = Column(
        String, default="pending"
    )  # e.g., pending, completed, failed, reversed
    transaction_date = Column(DateTime, default=datetime.utcnow)
    metadata_ = Column(JSONB)  # Additional transaction details
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PaymentGateway(Base):
    __tablename__ = "payment_gateways"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    api_key = Column(String)  # Encrypted in production
    secret_key = Column(String)  # Encrypted in production
    is_active = Column(Boolean, default=True)
    config = Column(JSONB)  # Gateway specific configuration
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Disbursement(Base):
    __tablename__ = "disbursements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(
        UUID(as_uuid=True), ForeignKey("transactions.id"), unique=True
    )  # Link to a specific transaction if applicable
    source_account_id = Column(
        UUID(as_uuid=True), ForeignKey("bank_accounts.id"), nullable=False
    )
    destination_account_details = Column(
        JSONB, nullable=False
    )  # e.g., {"bank_name": "", "account_number": ""}
    amount = Column(Float, nullable=False)
    currency = Column(String, default="NAD")
    status = Column(String, default="pending")  # e.g., pending, processed, failed
    disbursement_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
