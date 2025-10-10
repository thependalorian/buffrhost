"""
Booking Model
SQLAlchemy model for booking and reservation management
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from database import Base

class Booking(Base):
    """Booking model for reservations and check-ins"""
    
    __tablename__ = "bookings"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Property and room relationships
    property_id = Column(String, ForeignKey("hospitality_properties.id"), nullable=False)
    room_id = Column(String, ForeignKey("rooms.id"), nullable=False)
    
    # Guest information
    guest_name = Column(String, nullable=False)
    guest_email = Column(String, nullable=False)
    guest_phone = Column(String, nullable=True)
    
    # Booking dates
    check_in = Column(DateTime, nullable=False)
    check_out = Column(DateTime, nullable=False)
    
    # Guest count
    adults = Column(Integer, default=1, nullable=False)
    children = Column(Integer, default=0, nullable=False)
    
    # Pricing
    room_rate = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    
    # Status
    status = Column(String, default="confirmed", nullable=False)  # pending, confirmed, checked_in, checked_out, cancelled, no_show
    payment_status = Column(String, default="pending", nullable=False)  # pending, paid, partial, refunded, failed
    
    # Additional information
    special_requests = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    checked_in_at = Column(DateTime, nullable=True)
    checked_out_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Relationships
    property = relationship("HospitalityProperty")
    room = relationship("Room")
    
    def __repr__(self):
        return f"<Booking(id='{self.id}', guest='{self.guest_name}', check_in='{self.check_in}')>"
    
    def to_dict(self):
        """Convert booking to dictionary"""
        return {
            "id": self.id,
            "property_id": self.property_id,
            "room_id": self.room_id,
            "guest_name": self.guest_name,
            "guest_email": self.guest_email,
            "guest_phone": self.guest_phone,
            "check_in": self.check_in.isoformat() if self.check_in else None,
            "check_out": self.check_out.isoformat() if self.check_out else None,
            "adults": self.adults,
            "children": self.children,
            "room_rate": self.room_rate,
            "total_amount": self.total_amount,
            "status": self.status,
            "payment_status": self.payment_status,
            "special_requests": self.special_requests,
            "cancellation_reason": self.cancellation_reason,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "checked_in_at": self.checked_in_at.isoformat() if self.checked_in_at else None,
            "checked_out_at": self.checked_out_at.isoformat() if self.checked_out_at else None,
            "cancelled_at": self.cancelled_at.isoformat() if self.cancelled_at else None
        }
    
    def get_length_of_stay(self) -> int:
        """Calculate length of stay in nights"""
        if not self.check_in or not self.check_out:
            return 0
        
        stay_duration = self.check_out - self.check_in
        return max(0, stay_duration.days)
    
    def is_active(self) -> bool:
        """Check if booking is active (confirmed or checked in)"""
        return self.status in ['confirmed', 'checked_in']
    
    def can_be_cancelled(self) -> bool:
        """Check if booking can be cancelled"""
        return self.status in ['pending', 'confirmed']
    
    def can_be_modified(self) -> bool:
        """Check if booking can be modified"""
        return self.status in ['pending', 'confirmed']

class BookingPayment(Base):
    """Booking payment model"""
    
    __tablename__ = "booking_payments"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Payment information
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)  # card, cash, bank_transfer, etc.
    payment_reference = Column(String, nullable=True)
    payment_gateway = Column(String, nullable=True)  # stripe, paypal, etc.
    
    # Status
    status = Column(String, default="pending", nullable=False)  # pending, completed, failed, refunded
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True)
    
    # Additional information
    notes = Column(Text, nullable=True)
    gateway_response = Column(Text, nullable=True)  # JSON string
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingPayment(id='{self.id}', amount={self.amount}, status='{self.status}')>"

class BookingModification(Base):
    """Booking modification history"""
    
    __tablename__ = "booking_modifications"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Modification details
    modification_type = Column(String, nullable=False)  # date_change, room_change, guest_change, etc.
    old_values = Column(Text, nullable=True)  # JSON string
    new_values = Column(Text, nullable=True)  # JSON string
    reason = Column(Text, nullable=True)
    
    # ADDED: Missing fields from Pydantic
    new_check_out = Column(DateTime, nullable=True)
    new_check_in = Column(DateTime, nullable=True)
    new_room_id = Column(String, nullable=True)
    
    # Charges
    additional_charges = Column(Float, default=0.0, nullable=False)
    refund_amount = Column(Float, default=0.0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    modified_by = Column(String, nullable=True)  # user_id who made the modification
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingModification(id='{self.id}', type='{self.modification_type}', booking_id='{self.booking_id}')>"

class BookingCancellation(Base):
    """Booking cancellation details"""
    
    __tablename__ = "booking_cancellations"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Cancellation details
    reason = Column(Text, nullable=True)
    cancelled_by = Column(String, nullable=True)  # guest, admin, system
    cancellation_fee = Column(Float, default=0.0, nullable=False)
    refund_amount = Column(Float, default=0.0, nullable=False)
    
    # Timestamps
    cancelled_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingCancellation(id='{self.id}', booking_id='{self.booking_id}', reason='{self.reason}')>"

class BookingGuest(Base):
    """Additional guests for booking"""
    
    __tablename__ = "booking_guests"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Guest information
    guest_name = Column(String, nullable=False)
    guest_type = Column(String, nullable=False)  # adult, child, infant
    age = Column(Integer, nullable=True)
    special_requests = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingGuest(id='{self.id}', name='{self.guest_name}', type='{self.guest_type}')>"

class BookingService(Base):
    """Additional services for booking"""
    
    __tablename__ = "booking_services"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Service information
    service_name = Column(String, nullable=False)
    service_type = Column(String, nullable=False)  # spa, dining, transportation, etc.
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    
    # Status
    status = Column(String, default="pending", nullable=False)  # pending, confirmed, completed, cancelled
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    scheduled_at = Column(DateTime, nullable=True)
    
    # Additional information
    notes = Column(Text, nullable=True)
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingService(id='{self.id}', service='{self.service_name}', booking_id='{self.booking_id}')>"

class BookingNote(Base):
    """Booking notes and comments"""
    
    __tablename__ = "booking_notes"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Note information
    note_type = Column(String, nullable=False)  # general, guest_request, internal, system
    content = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by = Column(String, nullable=True)  # user_id who created the note
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingNote(id='{self.id}', type='{self.note_type}', booking_id='{self.booking_id}')>"

class BookingAudit(Base):
    """Booking audit trail"""
    
    __tablename__ = "booking_audits"
    
    # Primary key
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Booking relationship
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False)
    
    # Audit information
    action = Column(String, nullable=False)  # created, updated, cancelled, checked_in, etc.
    old_values = Column(Text, nullable=True)  # JSON string
    new_values = Column(Text, nullable=True)  # JSON string
    
    # ADDED: Missing fields from Pydantic
    changed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    changed_by = Column(String, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_by = Column(String, nullable=True)  # user_id who performed the action
    ip_address = Column(String, nullable=True)
    
    # Relationships
    booking = relationship("Booking")
    
    def __repr__(self):
        return f"<BookingAudit(id='{self.id}', action='{self.action}', booking_id='{self.booking_id}')>"