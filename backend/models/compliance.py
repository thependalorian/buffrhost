"""
Compliance-related models (KYC/KYB) for Buffr Host.
"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class KYCKYBDocument(Base):
    __tablename__ = "kyckybdokument"
    document_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    corporate_id = Column(
        UUID(as_uuid=True), ForeignKey("corporatecustomer.corporate_id")
    )
    document_type = Column(String(100), nullable=False)
    document_category = Column(String(50), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    upload_status = Column(String(50), default="uploaded")
    verification_status = Column(String(50), default="pending")
    verification_notes = Column(Text)
    verified_by = Column(String(255))
    verified_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
