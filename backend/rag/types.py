"""
Types and enums for the RAG system.
"""
from enum import Enum
from dataclasses import dataclass
from typing import Optional, Dict, Any
from datetime import datetime


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


@dataclass
class Document:
    """Document structure for the knowledge base."""
    
    id: str
    title: str
    content: str
    document_type: DocumentType
    status: DocumentStatus
    property_id: str
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None


@dataclass
class SearchResult:
    """Search result from vector store."""
    
    document: Document
    score: float
    metadata: Optional[Dict[str, Any]] = None
