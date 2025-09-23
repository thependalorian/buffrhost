"""
Financial settings and bank account models for Buffr Host.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from database import Base


class PropertyFinancialSettings(Base):
    """Model for property financial settings and bank account information."""
    __tablename__ = "property_financial_settings"
    
    settings_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    
    # Buffr's Bank Account Information (from the provided document)
    buffr_bank_name = Column(String(255), default="Bank Windhoek")
    buffr_bank_branch = Column(String(255), default="Ongwediva Branch")
    buffr_bank_address = Column(Text, default="P O Box 80059, Ongwediva, Namibia")
    buffr_bank_phone = Column(String(20), default="+264 83 299 3633")
    buffr_account_name = Column(String(255), default="BUFFR FINANCIAL SERVICES CC")
    buffr_account_number = Column(String(50), default="8050377860")
    buffr_branch_code = Column(String(20), default="485-673")
    buffr_swift_code = Column(String(20), default="BWLINANX")
    buffr_business_id = Column(String(100), default="CC/2024/09322")
    
    # Property's Bank Account Information (for receiving payments)
    property_bank_name = Column(String(255))
    property_bank_branch = Column(String(255))
    property_bank_address = Column(Text)
    property_bank_phone = Column(String(20))
    property_account_name = Column(String(255))
    property_account_number = Column(String(50))
    property_branch_code = Column(String(20))
    property_swift_code = Column(String(20))
    property_business_id = Column(String(100))
    
    # Financial Settings
    default_currency = Column(String(3), default="NAD")
    tax_rate = Column(Numeric(5, 2), default=15.00)  # 15% VAT in Namibia
    service_charge_rate = Column(Numeric(5, 2), default=0.00)
    gratuity_rate = Column(Numeric(5, 2), default=0.00)
    
    # Payment Settings
    payment_terms_days = Column(Integer, default=30)
    late_payment_fee_rate = Column(Numeric(5, 2), default=0.00)
    early_payment_discount_rate = Column(Numeric(5, 2), default=0.00)
    
    # Revenue Sharing (Buffr's commission)
    buffr_commission_rate = Column(Numeric(5, 2), default=5.00)  # 5% commission to Buffr
    minimum_commission_amount = Column(Numeric(10, 2), default=0.00)
    
    # Invoice/Quotation Settings
    invoice_prefix = Column(String(10), default="INV")
    quotation_prefix = Column(String(10), default="QUO")
    receipt_prefix = Column(String(10), default="RCP")
    next_invoice_number = Column(Integer, default=1)
    next_quotation_number = Column(Integer, default=1)
    next_receipt_number = Column(Integer, default=1)
    
    # Auto-generation settings
    auto_generate_invoices = Column(Boolean, default=True)
    auto_send_invoices = Column(Boolean, default=False)
    auto_send_quotations = Column(Boolean, default=False)
    invoice_due_days = Column(Integer, default=30)
    quotation_valid_days = Column(Integer, default=30)
    
    # Email settings for financial documents
    invoice_email_template = Column(Text)
    quotation_email_template = Column(Text)
    receipt_email_template = Column(Text)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty")


class ServiceRate(Base):
    """Model for service rates that properties can set."""
    __tablename__ = "service_rate"
    
    rate_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    
    # Service Information
    service_name = Column(String(255), nullable=False)
    service_type = Column(String(100), nullable=False)  # room, restaurant, spa, conference, etc.
    service_category = Column(String(100))  # accommodation, dining, wellness, business, etc.
    description = Column(Text)
    
    # Pricing
    base_rate = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="NAD")
    rate_type = Column(String(50), default="fixed")  # fixed, hourly, daily, per_person, per_unit
    
    # Rate Validity
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True))
    is_seasonal = Column(Boolean, default=False)
    season_name = Column(String(100))  # peak, off-peak, holiday, etc.
    
    # Conditions
    minimum_duration = Column(Integer)  # minimum hours/days
    maximum_duration = Column(Integer)  # maximum hours/days
    minimum_quantity = Column(Integer, default=1)
    maximum_quantity = Column(Integer)
    
    # Discounts
    early_booking_discount_rate = Column(Numeric(5, 2), default=0.00)
    early_booking_days = Column(Integer, default=0)
    bulk_discount_rate = Column(Numeric(5, 2), default=0.00)
    bulk_discount_quantity = Column(Integer, default=0)
    
    # Additional Charges
    setup_fee = Column(Numeric(10, 2), default=0.00)
    cleaning_fee = Column(Numeric(10, 2), default=0.00)
    service_charge = Column(Numeric(10, 2), default=0.00)
    gratuity_included = Column(Boolean, default=False)
    
    # Availability
    is_available = Column(Boolean, default=True)
    max_capacity = Column(Integer)
    advance_booking_required = Column(Boolean, default=False)
    advance_booking_days = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty")


class Receipt(Base):
    """Model for receipts generated after payments."""
    __tablename__ = "receipt"
    
    receipt_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"))
    payment_transaction_id = Column(UUID(as_uuid=True), ForeignKey("payment_transaction.transaction_id"))
    
    # Receipt Information
    receipt_number = Column(String(50), unique=True, nullable=False)
    receipt_date = Column(DateTime(timezone=True), server_default=func.now())
    receipt_type = Column(String(50), default="payment")  # payment, refund, adjustment
    
    # Customer Information
    customer_name = Column(String(255))
    customer_email = Column(String(255))
    customer_phone = Column(String(20))
    
    # Payment Information
    payment_method = Column(String(50))
    payment_reference = Column(String(255))
    amount_paid = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="NAD")
    
    # Breakdown
    subtotal = Column(Numeric(10, 2), nullable=False)
    tax_amount = Column(Numeric(10, 2), default=0.00)
    service_charge = Column(Numeric(10, 2), default=0.00)
    gratuity = Column(Numeric(10, 2), default=0.00)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(10, 2), nullable=False)
    
    # Buffr Commission
    buffr_commission_rate = Column(Numeric(5, 2), default=5.00)
    buffr_commission_amount = Column(Numeric(10, 2), default=0.00)
    property_revenue = Column(Numeric(10, 2), nullable=False)
    
    # Status
    is_issued = Column(Boolean, default=True)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_to_customer = Column(Boolean, default=False)
    sent_at = Column(DateTime(timezone=True))
    
    # Notes
    notes = Column(Text)
    internal_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty")
    order = relationship("Order")
    payment_transaction = relationship("PaymentTransaction")


class ReceiptItem(Base):
    """Model for individual items on a receipt."""
    __tablename__ = "receipt_item"
    
    receipt_item_id = Column(Integer, primary_key=True, index=True)
    receipt_id = Column(UUID(as_uuid=True), ForeignKey("receipt.receipt_id"), nullable=False)
    
    # Item Information
    item_name = Column(String(255), nullable=False)
    item_type = Column(String(50), nullable=False)  # menu_item, room, service, etc.
    item_id = Column(Integer)  # Reference to the actual item
    description = Column(Text)
    
    # Pricing
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Numeric(10, 2), nullable=False)
    total_price = Column(Numeric(10, 2), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    receipt = relationship("Receipt")


class FinancialTransaction(Base):
    """Model for tracking all financial transactions including Buffr commissions."""
    __tablename__ = "financial_transaction"
    
    transaction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"), nullable=False)
    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"))
    payment_transaction_id = Column(UUID(as_uuid=True), ForeignKey("payment_transaction.transaction_id"))
    receipt_id = Column(UUID(as_uuid=True), ForeignKey("receipt.receipt_id"))
    
    # Transaction Information
    transaction_type = Column(String(50), nullable=False)  # revenue, commission, refund, adjustment
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    reference_number = Column(String(100))
    
    # Amounts
    gross_amount = Column(Numeric(10, 2), nullable=False)
    buffr_commission_amount = Column(Numeric(10, 2), default=0.00)
    property_revenue_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="NAD")
    
    # Status
    status = Column(String(50), default="pending")  # pending, processed, settled, disputed
    processed_at = Column(DateTime(timezone=True))
    settled_at = Column(DateTime(timezone=True))
    
    # Bank Transfer Information
    bank_transfer_reference = Column(String(255))
    bank_transfer_date = Column(DateTime(timezone=True))
    bank_transfer_status = Column(String(50))
    
    # Notes
    notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    property = relationship("HospitalityProperty")
    order = relationship("Order")
    payment_transaction = relationship("PaymentTransaction")
    receipt = relationship("Receipt")
