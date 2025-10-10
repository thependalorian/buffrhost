"""
Pydantic Schemas for Tenant Onboarding System
"""

from pydantic import BaseModel, validator, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class IndustryType(str, Enum):
    HOTEL = "hotel"
    RESORT = "resort"
    VACATION_RENTAL = "vacation-rental" 
    HOSTEL = "hostel"
    BOUTIQUE_HOTEL = "boutique-hotel"
    BED_AND_BREAKFAST = "bed-and-breakfast"
    APARTMENT_HOTEL = "apartment-hotel"

class ServiceLevel(str, Enum):
    LUXURY = "luxury"
    PREMIUM = "premium"
    STANDARD = "standard"
    BUDGET = "budget"

class OnboardingTier(str, Enum):
    SELF_SERVICE = "self-service"
    ASSISTED = "assisted"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, Enum):
    TRIAL = "trial"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    CANCELLED = "cancelled"

class OnboardingStage(str, Enum):
    QUALIFICATION = "qualification"
    SETUP = "setup"
    CONFIGURATION = "configuration"
    LIVE = "live"

# Request Schemas
class ProspectQualificationRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    industry: IndustryType
    room_count: int = Field(..., ge=1, le=10000)
    property_type: str = Field(..., min_length=2, max_length=50)
    has_existing_pms: bool = False
    it_team_size: int = Field(0, ge=0, le=100)
    required_integrations: List[str] = Field(default_factory=list)
    multi_property: bool = False
    target_market: List[str] = Field(default_factory=list)
    service_level: ServiceLevel = ServiceLevel.STANDARD
    annual_revenue: Optional[float] = Field(None, ge=0)
    location: Optional[str] = Field(None, max_length=100)
    
    @validator('required_integrations')
    def validate_integrations(cls, v):
        valid_integrations = [
            'channel-manager', 'payment-gateway', 'review-system',
            'pms', 'crm', 'analytics', 'booking-engine', 'revenue-management'
        ]
        for integration in v:
            if integration not in valid_integrations:
                raise ValueError(f'Invalid integration: {integration}')
        return v

class TenantCreationRequest(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=100)
    legal_name: Optional[str] = Field(None, max_length=100)
    industry: IndustryType
    subdomain: str = Field(..., min_length=3, max_length=50)
    contact_email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    contact_phone: str = Field(..., min_length=10, max_length=20)
    timezone: str = Field(default="UTC", max_length=50)
    base_currency: str = Field(default="USD", max_length=3)
    website: Optional[str] = Field(None, max_length=200)
    tax_id: Optional[str] = Field(None, max_length=50)
    
    @validator('subdomain')
    def validate_subdomain(cls, v):
        if not v.replace('-', '').replace('_', '').isalnum():
            raise ValueError('Subdomain can only contain letters, numbers, hyphens, and underscores')
        if len(v) < 3:
            raise ValueError('Subdomain must be at least 3 characters long')
        return v.lower()

class PropertySetupRequest(BaseModel):
    tenant_id: str
    property_name: str = Field(..., min_length=2, max_length=100)
    address: Dict[str, Any] = Field(..., description="Property address information")
    room_count: int = Field(..., ge=1, le=10000)
    room_types: List[Dict[str, Any]] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    contact_info: Dict[str, Any] = Field(..., description="Property contact information")
    operational_hours: Dict[str, Any] = Field(default_factory=dict)
    service_level: ServiceLevel = ServiceLevel.STANDARD
    star_rating: Optional[int] = Field(None, ge=1, le=5)
    
    @validator('address')
    def validate_address(cls, v):
        required_fields = ['street', 'city', 'country']
        for field in required_fields:
            if field not in v or not v[field]:
                raise ValueError(f'Address must include {field}')
        return v

class OnboardingStepCompletion(BaseModel):
    tenant_id: str
    step_id: str = Field(..., min_length=1, max_length=50)
    step_data: Dict[str, Any] = Field(default_factory=dict)
    completed_at: Optional[datetime] = None

    @validator('completed_at', pre=True, always=True)
    def set_completed_at(cls, v):
        return v or datetime.utcnow()

# Response Schemas
class QualificationResponse(BaseModel):
    qualification_score: int = Field(..., ge=0, le=100)
    recommended_tier: OnboardingTier
    estimated_timeline: str
    support_level: str
    recommended_features: List[str]
    confidence_level: float = Field(..., ge=0.0, le=1.0)
    next_steps: List[Dict[str, Any]] = Field(default_factory=list)

class OnboardingStep(BaseModel):
    id: str
    title: str
    description: str
    estimated_minutes: int = Field(..., ge=1)
    required: bool = True
    component: str
    prerequisites: List[str] = Field(default_factory=list)
    dependencies: List[str] = Field(default_factory=list)

class OnboardingProgressResponse(BaseModel):
    tenant_id: str
    current_step: str
    completed_steps: List[str]
    progress_percentage: float = Field(..., ge=0.0, le=100.0)
    next_steps: List[OnboardingStep] = Field(default_factory=list)
    estimated_completion: Optional[datetime] = None
    recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    is_complete: bool = False

class TenantProfileResponse(BaseModel):
    id: str
    company_name: str
    legal_name: Optional[str]
    industry: IndustryType
    subdomain: str
    tier: str
    subscription_status: SubscriptionStatus
    trial_ends_at: Optional[datetime]
    onboarding_stage: OnboardingStage
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PropertyTemplateResponse(BaseModel):
    tenant_id: str
    template_type: str
    room_types: List[Dict[str, Any]]
    rate_plans: List[Dict[str, Any]]
    services: List[Dict[str, Any]]
    default_settings: Dict[str, Any]
    available_features: List[str]
    customization_suggestions: List[Dict[str, Any]] = Field(default_factory=list)

class OnboardingChecklist(BaseModel):
    tenant_id: str
    tier: OnboardingTier
    total_steps: int
    estimated_total_minutes: int
    steps: List[OnboardingStep]
    priority_items: List[OnboardingStep]
    optional_items: List[OnboardingStep]
    completion_percentage: float = Field(..., ge=0.0, le=100.0)

# Error Schemas
class OnboardingError(BaseModel):
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    suggested_action: Optional[str] = None

class ValidationError(BaseModel):
    field: str
    message: str
    value: Any

# Success Response Schema
class OnboardingSuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# API Response Wrapper
class OnboardingAPIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    errors: Optional[List[OnboardingError]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)