"""
Payment-related models for Adumo Online integration.
"""
from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from database import Base

class PaymentTransaction(Base):
    """Model for tracking Adumo payment transactions."""
    __tablename__ = "payment_transaction"
    
    transaction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"), nullable=False)
    merchant_reference = Column(String(100), unique=True, nullable=False, index=True)
    
    # Adumo specific fields
    adumo_transaction_index = Column(String(100), nullable=True)
    adumo_result_code = Column(Integer, nullable=True)
    adumo_status = Column(String(50), nullable=True)
    adumo_error_code = Column(String(10), nullable=True)
    adumo_error_message = Column(Text, nullable=True)
    
    # Payment details
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="NAD")
    payment_method = Column(String(50), nullable=True)
    
    # Transaction status
    status = Column(String(20), default="pending", index=True)  # pending, processing, completed, failed, cancelled
    is_successful = Column(Boolean, default=False)
    
    # Timestamps
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # JWT tokens
    request_token = Column(Text, nullable=True)  # JWT token sent to Adumo
    response_token = Column(Text, nullable=True)  # JWT token received from Adumo
    
    # URLs
    success_url = Column(String(500), nullable=True)
    failed_url = Column(String(500), nullable=True)
    notification_url = Column(String(500), nullable=True)
    
    # Relationships
    order = relationship("Order", back_populates="payment_transactions")

class PaymentWebhook(Base):
    """Model for tracking Adumo webhook notifications."""
    __tablename__ = "payment_webhook"
    
    webhook_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("payment_transaction.transaction_id"), nullable=False)
    
    # Webhook data
    raw_data = Column(Text, nullable=False)  # Raw webhook payload
    event_type = Column(String(50), nullable=False)
    processed = Column(Boolean, default=False)
    
    # Timestamps
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    transaction = relationship("PaymentTransaction")
