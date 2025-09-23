"""
Types and enums for the RAG system.
"""
from enum import Enum

class DocumentType(str, Enum):
    """Types of documents that can be added to the knowledge base."""
    COMPANY_INFO = "company_info"
    POLICIES = "policies"
    PROCEDURES = "procedures"
    FAQ = "faq"
    MENU_INFO = "menu_info"
    ROOM_INFO = "room_info"
    SERVICES = "services"
    AMENITIES = "amenities"
    CONTACT_INFO = "contact_info"
    EMERGENCY_PROCEDURES = "emergency_procedures"
    STAFF_TRAINING = "staff_training"
    CUSTOMER_SERVICE = "customer_service"
    BOOKING_PROCEDURES = "booking_procedures"
    PAYMENT_POLICIES = "payment_policies"
    CANCELLATION_POLICIES = "cancellation_policies"
    LOYALTY_PROGRAM = "loyalty_program"
    OTHER = "other"

class DocumentStatus(str, Enum):
    """Status of documents in the knowledge base."""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    INDEXED = "indexed"
    ACTIVE = "active"
    ARCHIVED = "archived"
    ERROR = "error"
