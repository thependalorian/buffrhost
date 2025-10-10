"""
Pydantic models for signature service
"""

from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from enum import Enum
from pydantic import BaseModel, Field, validator, EmailStr

class EnvelopeStatus(str, Enum):
    """Envelope status enumeration"""
    DRAFT = "draft"
    SENT = "sent"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    DECLINED = "declined"
    VOIDED = "voided"

class RecipientType(str, Enum):
    """Recipient type enumeration"""
    SIGNER = "signer"
    CARBON_COPY = "carbon_copy"
    APPROVER = "approver"
    WITNESS = "witness"

class FieldType(str, Enum):
    """Signature field type enumeration"""
    SIGN_HERE = "signHere"
    INITIAL_HERE = "initialHere"
    DATE_SIGNED = "dateSigned"
    TEXT = "text"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    DROPDOWN = "dropdown"

class EIDASComplianceLevel(str, Enum):
    """eIDAS compliance level enumeration"""
    STANDARD = "standard"
    ADVANCED = "advanced"
    QUALIFIED = "qualified"

class AuthMethod(str, Enum):
    """Authentication method enumeration"""
    EMAIL = "email"
    SMS = "sms"
    BIOMETRIC = "biometric"
    HARDWARE_TOKEN = "hardware_token"

# Base models
class BaseSignatureModel(BaseModel):
    """Base model for signature-related data"""
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Request models
class EnvelopeCreateRequest(BaseSignatureModel):
    """Request model for creating an envelope"""
    envelope_name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    compliance_level: EIDASComplianceLevel = Field(EIDASComplianceLevel.STANDARD)
    recipients: List[Dict[str, Any]] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)
    fields: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    @validator('recipients')
    def validate_recipients(cls, v):
        if not v:
            raise ValueError('At least one recipient is required')
        return v

class EnvelopeUpdateRequest(BaseSignatureModel):
    """Request model for updating an envelope"""
    envelope_name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[EnvelopeStatus] = None
    recipients: Optional[List[Dict[str, Any]]] = None
    documents: Optional[List[str]] = None
    fields: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None

class SignatureFieldRequest(BaseSignatureModel):
    """Request model for signing a field"""
    field_id: str = Field(..., min_length=1)
    signature_data: str = Field(..., min_length=1)
    signature_type: str = Field(default="electronic")
    timestamp: Optional[datetime] = None

class DigitalInitialsRequest(BaseSignatureModel):
    """Request model for generating digital initials"""
    name: str = Field(..., min_length=1, max_length=255)
    preferred_style: str = Field(default="formal", regex="^(formal|cursive|block|signature-style)$")

# Response models
class SignatureRecipientResponse(BaseSignatureModel):
    """Recipient response model"""
    id: str
    email: str
    name: str
    recipient_type: RecipientType
    status: str
    signed_at: Optional[datetime] = None
    authentication_method: Optional[AuthMethod] = None

class SignatureFieldResponse(BaseSignatureModel):
    """Signature field response model"""
    id: str
    field_type: FieldType
    field_name: str
    page_number: int
    x_position: float
    y_position: float
    width: float
    height: float
    is_required: bool
    is_signed: bool
    signed_at: Optional[datetime] = None
    signature_data: Optional[str] = None

class EnvelopeResponse(BaseSignatureModel):
    """Envelope response model"""
    id: str
    envelope_name: str
    description: Optional[str] = None
    status: EnvelopeStatus
    compliance_level: EIDASComplianceLevel
    created_by: str
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None
    
    # Related data
    recipients: Optional[List[SignatureRecipientResponse]] = None
    fields: Optional[List[SignatureFieldResponse]] = None
    documents: Optional[List[str]] = None

class DigitalInitialsResponse(BaseSignatureModel):
    """Digital initials response model"""
    id: str
    user_id: str
    initials: str
    style: str
    initials_data: Dict[str, Any]
    created_at: datetime
    metadata: Optional[Dict[str, Any]] = None

class EnvelopeStatusResponse(BaseSignatureModel):
    """Envelope status response model"""
    envelope_id: str
    status: EnvelopeStatus
    progress_percentage: float
    completed_fields: int
    total_fields: int
    completed_recipients: int
    total_recipients: int
    last_activity: Optional[datetime] = None
    estimated_completion: Optional[datetime] = None

# Error models
class SignatureErrorResponse(BaseSignatureModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    envelope_id: Optional[str] = None
    field_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)