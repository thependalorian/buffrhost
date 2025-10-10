"""
AI Services Schemas
Pydantic models for AI-powered services
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from enum import Enum

class ChannelType(str, Enum):
    """Communication channel types"""
    EMAIL = "email"
    SMS = "sms"
    VOICE = "voice"
    PUSH = "push"
    CHAT = "chat"

class VoiceType(str, Enum):
    """Voice synthesis types"""
    MALE = "male"
    FEMALE = "female"
    NEUTRAL = "neutral"
    CUSTOM = "custom"

class LanguageType(str, Enum):
    """Language types"""
    EN = "en"
    ES = "es"
    FR = "fr"
    DE = "de"
    IT = "it"
    PT = "pt"

# AI Receptionist Schemas
class ReceptionistRequest(BaseModel):
    """Request for AI receptionist"""
    message: str
    customer_id: Optional[str] = None
    channel: ChannelType = ChannelType.CHAT
    language: LanguageType = LanguageType.EN
    context: Optional[Dict[str, Any]] = None

class ReceptionistResponse(BaseModel):
    """Response from AI receptionist"""
    message: str
    confidence_score: float
    suggested_actions: List[str] = []
    requires_human: bool = False
    tenant_id: str
    processed_at: datetime

class VoiceRequest(BaseModel):
    """Voice input request"""
    audio_data: bytes
    customer_id: Optional[str] = None
    language: LanguageType = LanguageType.EN
    preferred_voice: VoiceType = VoiceType.FEMALE

class VoiceResponse(BaseModel):
    """Voice output response"""
    audio_data: bytes
    transcript: str
    response: str
    confidence_score: float
    tenant_id: str
    processed_at: datetime

class KnowledgeUploadRequest(BaseModel):
    """Knowledge base upload request"""
    title: str
    content: str
    content_type: str = "text"
    category: str = "general"
    tags: List[str] = []

class KnowledgeUploadResponse(BaseModel):
    """Knowledge base upload response"""
    success: bool
    document_id: Optional[str] = None
    chunks_created: int = 0
    message: str

# Sales Funnel Schemas
class SalesFunnelRequest(BaseModel):
    """Sales funnel processing request"""
    lead_id: Optional[str] = None
    name: str
    email: str
    company: Optional[str] = None
    source: str = "website"
    stage: str = "new"
    budget: Optional[float] = None
    authority: Optional[str] = None
    need: Optional[str] = None
    timeline: Optional[str] = None
    notes: Optional[str] = None

class SalesFunnelResponse(BaseModel):
    """Sales funnel processing response"""
    lead_id: str
    current_stage: str
    next_actions: List[str]
    confidence_score: float
    estimated_close_probability: float
    recommended_approach: str
    tenant_id: str
    processed_at: datetime

class LeadQualificationRequest(BaseModel):
    """Lead qualification request"""
    name: str
    email: str
    company: Optional[str] = None
    budget: Optional[float] = None
    authority: Optional[str] = None
    need: Optional[str] = None
    timeline: Optional[str] = None

class LeadQualificationResponse(BaseModel):
    """Lead qualification response"""
    qualified: bool
    qualification_score: float
    qualification_reasons: List[str]
    recommended_approach: str
    next_steps: List[str]

class SalesStageUpdate(BaseModel):
    """Sales stage update"""
    lead_id: str
    new_stage: str
    notes: Optional[str] = None
    confidence_score: Optional[float] = None

class SalesAnalytics(BaseModel):
    """Sales analytics"""
    tenant_id: str
    period_days: int
    total_leads: int
    qualified_leads: int
    closed_leads: int
    qualification_rate: float
    close_rate: float
    average_qualification_score: float
    stage_distribution: Dict[str, int]

# Customer Reactivation Schemas
class ReactivationRequest(BaseModel):
    """Customer reactivation request"""
    target_segments: List[str]
    channels: List[ChannelType]
    message_templates: Dict[str, str]
    max_customers: Optional[int] = None

class ReactivationResponse(BaseModel):
    """Customer reactivation response"""
    success: bool
    message: str
    reactivated_customers: int = 0
    campaign_id: Optional[str] = None

class CustomerSegmentation(BaseModel):
    """Customer segmentation result"""
    tenant_id: str
    segments: Dict[str, Dict[str, Any]]
    total_customers: int
    message: str

class CampaignRequest(BaseModel):
    """Campaign creation request"""
    name: str
    description: str
    target_segments: List[str]
    channels: List[ChannelType]
    message_templates: Dict[str, str]
    scheduled_at: Optional[datetime] = None

class CampaignResponse(BaseModel):
    """Campaign creation response"""
    success: bool
    campaign_id: Optional[str] = None
    target_customers: int = 0
    estimated_reactivation_rate: float = 0.0
    message: str

class ReactivationAnalytics(BaseModel):
    """Reactivation analytics"""
    tenant_id: str
    period_days: int
    total_campaigns: int
    total_interactions: int
    successful_interactions: int
    success_rate: float
    avg_reactivation_rate: float
    channel_performance: Dict[str, Dict[str, Any]]

# AI Analytics Schemas
class AIAnalyticsRequest(BaseModel):
    """AI analytics request"""
    service_type: str  # receptionist, sales_funnel, reactivation
    start_date: datetime
    end_date: datetime
    metrics: List[str] = ["interactions", "success_rate", "response_time"]

class AIAnalyticsResponse(BaseModel):
    """AI analytics response"""
    tenant_id: str
    service_type: str
    period: Dict[str, str]
    metrics: Dict[str, Any]
    generated_at: datetime

class AIPerformanceMetrics(BaseModel):
    """AI performance metrics"""
    tenant_id: str
    service_type: str
    total_interactions: int
    success_rate: float
    average_response_time: float
    customer_satisfaction: float
    error_rate: float
    uptime_percentage: float

# AI Configuration Schemas
class AIConfiguration(BaseModel):
    """AI service configuration"""
    tenant_id: str
    service_type: str
    enabled: bool = True
    settings: Dict[str, Any] = {}
    custom_prompts: Dict[str, str] = {}
    language: LanguageType = LanguageType.EN
    voice_settings: Dict[str, Any] = {}

class AIWorkflowStep(BaseModel):
    """AI workflow step"""
    step_id: str
    name: str
    description: str
    agent_type: str
    conditions: List[str] = []
    actions: List[str] = []
    next_steps: List[str] = []

class AIWorkflow(BaseModel):
    """AI workflow definition"""
    workflow_id: str
    name: str
    description: str
    tenant_id: str
    steps: List[AIWorkflowStep]
    triggers: List[str] = []
    is_active: bool = True

# AI Training Schemas
class AITrainingData(BaseModel):
    """AI training data"""
    tenant_id: str
    data_type: str  # conversations, outcomes, feedback
    content: str
    metadata: Dict[str, Any] = {}
    quality_score: Optional[float] = None

class AITrainingRequest(BaseModel):
    """AI training request"""
    tenant_id: str
    model_type: str
    training_data: List[AITrainingData]
    validation_split: float = 0.2
    epochs: int = 10

class AITrainingResponse(BaseModel):
    """AI training response"""
    success: bool
    model_id: Optional[str] = None
    accuracy: Optional[float] = None
    training_time: Optional[float] = None
    message: str

# AI Integration Schemas
class AIIntegration(BaseModel):
    """AI service integration"""
    tenant_id: str
    service_name: str
    integration_type: str
    config: Dict[str, Any]
    is_active: bool = True
    last_sync: Optional[datetime] = None

class AIWebhook(BaseModel):
    """AI webhook configuration"""
    tenant_id: str
    webhook_url: str
    events: List[str]
    secret: str
    is_active: bool = True

# Error Schemas
class AIError(BaseModel):
    """AI service error"""
    error_code: str
    message: str
    service_type: str
    tenant_id: str
    timestamp: datetime
    details: Optional[Dict[str, Any]] = None

class AIErrorResponse(BaseModel):
    """AI error response"""
    success: bool = False
    error: AIError
    retry_after: Optional[int] = None