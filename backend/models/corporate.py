"""
Corporate and financial models for Buffr Host.
"""
from sqlalchemy import (Boolean, Column, Date, DateTime, ForeignKey, Integer,
                        Numeric, String, Text, Time)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class CorporateCustomer(Base):
    __tablename__ = "corporatecustomer"
    corporate_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    company_name = Column(String(255), nullable=False)
    business_registration_number = Column(String(100))
    tax_id = Column(String(100))
    business_type = Column(String(100))
    industry = Column(String(100))
    company_size = Column(String(50))
    annual_revenue = Column(Numeric(15, 2))
    billing_address = Column(Text)
    billing_city = Column(String(100))
    billing_state = Column(String(100))
    billing_country = Column(String(100))
    billing_postal_code = Column(String(20))
    authorized_signatory_name = Column(String(255))
    authorized_signatory_title = Column(String(100))
    authorized_signatory_email = Column(String(255))
    authorized_signatory_phone = Column(String(20))
    credit_limit = Column(Numeric(15, 2), default=0.00)
    payment_terms = Column(Integer, default=30)
    kyb_status = Column(String(50), default="pending")
    kyb_verified_at = Column(DateTime(timezone=True))
    kyb_expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CorporateBooking(Base):
    __tablename__ = "corporatebooking"
    corporate_booking_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    corporate_id = Column(
        UUID(as_uuid=True), ForeignKey("corporatecustomer.corporate_id")
    )
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    booking_type = Column(String(50), nullable=False)
    event_name = Column(String(255))
    event_description = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    start_time = Column(Time)
    end_time = Column(Time)
    expected_attendees = Column(Integer)
    actual_attendees = Column(Integer)
    booking_status = Column(String(50), default="pending")
    total_estimated_cost = Column(Numeric(15, 2), default=0.00)
    total_actual_cost = Column(Numeric(15, 2), default=0.00)
    deposit_amount = Column(Numeric(15, 2), default=0.00)
    balance_amount = Column(Numeric(15, 2), default=0.00)
    payment_terms = Column(Integer, default=30)
    special_requirements = Column(Text)
    contact_person_name = Column(String(255))
    contact_person_email = Column(String(255))
    contact_person_phone = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class CorporateBookingItem(Base):
    __tablename__ = "corporatebookingitem"
    booking_item_id = Column(Integer, primary_key=True, index=True)
    corporate_booking_id = Column(
        UUID(as_uuid=True), ForeignKey("corporatebooking.corporate_booking_id")
    )
    item_type = Column(String(50), nullable=False)
    item_id = Column(Integer)
    item_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)
    special_requirements = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Quotation(Base):
    __tablename__ = "quotation"
    quotation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    corporate_booking_id = Column(
        UUID(as_uuid=True), ForeignKey("corporatebooking.corporate_booking_id")
    )
    quotation_number = Column(String(50), unique=True, nullable=False)
    quotation_date = Column(Date, nullable=False)
    valid_until = Column(Date, nullable=False)
    status = Column(String(50), default="draft")
    subtotal = Column(Numeric(15, 2), nullable=False)
    tax_rate = Column(Numeric(5, 2), default=0.00)
    tax_amount = Column(Numeric(15, 2), default=0.00)
    discount_rate = Column(Numeric(5, 2), default=0.00)
    discount_amount = Column(Numeric(15, 2), default=0.00)
    total_amount = Column(Numeric(15, 2), nullable=False)
    terms_and_conditions = Column(Text)
    notes = Column(Text)
    prepared_by = Column(String(255))
    sent_to_email = Column(String(255))
    sent_at = Column(DateTime(timezone=True))
    accepted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class QuotationItem(Base):
    __tablename__ = "quotationitem"
    quotation_item_id = Column(Integer, primary_key=True, index=True)
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("quotation.quotation_id"))
    item_type = Column(String(50), nullable=False)
    item_name = Column(String(255), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Invoice(Base):
    __tablename__ = "invoice"
    invoice_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    corporate_booking_id = Column(
        UUID(as_uuid=True), ForeignKey("corporatebooking.corporate_booking_id")
    )
    quotation_id = Column(UUID(as_uuid=True), ForeignKey("quotation.quotation_id"))
    invoice_number = Column(String(50), unique=True, nullable=False)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), default="draft")
    subtotal = Column(Numeric(15, 2), nullable=False)
    tax_rate = Column(Numeric(5, 2), default=0.00)
    tax_amount = Column(Numeric(15, 2), default=0.00)
    discount_rate = Column(Numeric(5, 2), default=0.00)
    discount_amount = Column(Numeric(15, 2), default=0.00)
    total_amount = Column(Numeric(15, 2), nullable=False)
    paid_amount = Column(Numeric(15, 2), default=0.00)
    balance_amount = Column(Numeric(15, 2), nullable=False)
    payment_terms = Column(Integer, default=30)
    payment_method = Column(String(50))
    payment_reference = Column(String(255))
    paid_at = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class InvoiceItem(Base):
    __tablename__ = "invoiceitem"
    invoice_item_id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoice.invoice_id"))
    item_type = Column(String(50), nullable=False)
    item_name = Column(String(255), nullable=False)
    description = Column(Text)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
