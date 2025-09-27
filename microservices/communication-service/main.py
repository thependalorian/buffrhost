"""
Buffr Host Communication Service - Microservice
Handles email, SMS, notifications, and communication management for Buffr Host platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, JSON, create_engine, ForeignKey, Float, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
import jwt
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_communications")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service configuration
SERVICE_NAME = "communication-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8013))

# Enums
class CommunicationType(str, Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH_NOTIFICATION = "push_notification"
    IN_APP_NOTIFICATION = "in_app_notification"
    WEBHOOK = "webhook"
    VOICE_CALL = "voice_call"

class MessageStatus(str, Enum):
    PENDING = "pending"
    SENT = "sent"
    DELIVERED = "delivered"
    FAILED = "failed"
    BOUNCED = "bounced"
    OPENED = "opened"
    CLICKED = "clicked"

class TemplateType(str, Enum):
    WELCOME = "welcome"
    BOOKING_CONFIRMATION = "booking_confirmation"
    ORDER_CONFIRMATION = "order_confirmation"
    PAYMENT_RECEIPT = "payment_receipt"
    REMINDER = "reminder"
    PROMOTION = "promotion"
    NOTIFICATION = "notification"
    CUSTOM = "custom"

class CampaignStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Database Models
class CommunicationTemplate(Base):
    __tablename__ = "communication_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Template Configuration
    template_type = Column(String, nullable=False)
    communication_type = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    
    # Template Content
    content = Column(Text, nullable=False)
    html_content = Column(Text, nullable=True)
    variables = Column(JSON, default=list)
    
    # Template Settings
    is_active = Column(Boolean, default=True)
    is_public = Column(Boolean, default=False)
    
    # Template Metadata
    language = Column(String, default="en")
    category = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    template_id = Column(String, ForeignKey("communication_templates.id"), nullable=True, index=True)
    
    # Message Information
    communication_type = Column(String, nullable=False)
    recipient_email = Column(String, nullable=True, index=True)
    recipient_phone = Column(String, nullable=True, index=True)
    recipient_id = Column(String, nullable=True, index=True)
    
    # Message Content
    subject = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    html_content = Column(Text, nullable=True)
    
    # Message Status
    status = Column(String, default=MessageStatus.PENDING)
    priority = Column(String, default="normal")  # low, normal, high, urgent
    
    # Delivery Information
    scheduled_at = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    opened_at = Column(DateTime, nullable=True)
    clicked_at = Column(DateTime, nullable=True)
    
    # Provider Information
    provider = Column(String, nullable=True)
    provider_message_id = Column(String, nullable=True)
    provider_response = Column(JSON, default=dict)
    
    # Error Information
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Message Metadata
    metadata = Column(JSON, default=dict)
    variables = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Campaign Configuration
    campaign_type = Column(String, nullable=False)  # email, sms, push, mixed
    template_id = Column(String, ForeignKey("communication_templates.id"), nullable=False, index=True)
    
    # Campaign Status
    status = Column(String, default=CampaignStatus.DRAFT)
    
    # Campaign Schedule
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Target Audience
    target_criteria = Column(JSON, default=dict)
    target_segments = Column(JSON, default=list)
    target_count = Column(Integer, nullable=True)
    
    # Campaign Settings
    settings = Column(JSON, default=dict)
    variables = Column(JSON, default=dict)
    
    # Campaign Statistics
    messages_sent = Column(Integer, default=0)
    messages_delivered = Column(Integer, default=0)
    messages_opened = Column(Integer, default=0)
    messages_clicked = Column(Integer, default=0)
    messages_failed = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    user_id = Column(String, nullable=True, index=True)
    
    # Notification Information
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, nullable=False)  # info, warning, error, success
    
    # Notification Content
    data = Column(JSON, default=dict)
    action_url = Column(String, nullable=True)
    action_text = Column(String, nullable=True)
    
    # Notification Status
    status = Column(String, default="unread")  # unread, read, archived
    priority = Column(String, default="normal")
    
    # Delivery Information
    delivery_methods = Column(JSON, default=list)  # email, sms, push, in_app
    delivered_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    message_id = Column(String, ForeignKey("messages.id"), nullable=True, index=True)
    
    # Log Information
    event_type = Column(String, nullable=False)  # sent, delivered, opened, clicked, failed
    event_data = Column(JSON, default=dict)
    
    # Provider Information
    provider = Column(String, nullable=True)
    provider_response = Column(JSON, default=dict)
    
    # Timestamps
    event_timestamp = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class TemplateCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    template_type: TemplateType
    communication_type: CommunicationType
    subject: Optional[str] = None
    content: str
    html_content: Optional[str] = None
    variables: Optional[List[str]] = []
    language: str = "en"
    category: Optional[str] = None
    tags: Optional[List[str]] = []

class MessageCreate(BaseModel):
    property_id: str
    template_id: Optional[str] = None
    communication_type: CommunicationType
    recipient_email: Optional[EmailStr] = None
    recipient_phone: Optional[str] = None
    recipient_id: Optional[str] = None
    subject: Optional[str] = None
    content: str
    html_content: Optional[str] = None
    priority: str = "normal"
    scheduled_at: Optional[datetime] = None
    variables: Optional[Dict[str, Any]] = {}
    metadata: Optional[Dict[str, Any]] = {}

class CampaignCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    campaign_type: str
    template_id: str
    scheduled_at: Optional[datetime] = None
    target_criteria: Optional[Dict[str, Any]] = {}
    target_segments: Optional[List[str]] = []
    settings: Optional[Dict[str, Any]] = {}
    variables: Optional[Dict[str, Any]] = {}

class NotificationCreate(BaseModel):
    property_id: str
    user_id: Optional[str] = None
    title: str
    message: str
    notification_type: str = "info"
    data: Optional[Dict[str, Any]] = {}
    action_url: Optional[str] = None
    action_text: Optional[str] = None
    priority: str = "normal"
    delivery_methods: Optional[List[str]] = ["in_app"]

class MessageResponse(BaseModel):
    id: str
    property_id: str
    template_id: Optional[str]
    communication_type: str
    recipient_email: Optional[str]
    recipient_phone: Optional[str]
    recipient_id: Optional[str]
    subject: Optional[str]
    content: str
    html_content: Optional[str]
    status: str
    priority: str
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    opened_at: Optional[datetime]
    clicked_at: Optional[datetime]
    provider: Optional[str]
    provider_message_id: Optional[str]
    error_message: Optional[str]
    retry_count: int
    metadata: Dict[str, Any]
    variables: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class CommunicationMetrics(BaseModel):
    total_templates: int
    active_templates: int
    total_messages: int
    messages_sent: int
    messages_delivered: int
    messages_failed: int
    total_campaigns: int
    active_campaigns: int
    total_notifications: int
    unread_notifications: int
    delivery_rate: float
    open_rate: float
    click_rate: float
    messages_by_type: Dict[str, int]
    campaigns_by_status: Dict[str, int]

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for communication service")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"user_id": user_id, "email": payload.get("email"), "role": payload.get("role")}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Utility functions
def generate_message_id() -> str:
    """Generate unique message ID"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"MSG-{timestamp}-{random_suffix}"

def render_template_content(content: str, variables: Dict[str, Any]) -> str:
    """Render template content with variables"""
    rendered_content = content
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        rendered_content = rendered_content.replace(placeholder, str(value))
    return rendered_content

def validate_email(email: str) -> bool:
    """Validate email format"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    import re
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    # Check if it's a valid length (7-15 digits)
    return 7 <= len(digits_only) <= 15

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="Communication and messaging microservice",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "Communication and messaging",
        "endpoints": {
            "health": "/health",
            "templates": "/api/communication/templates",
            "messages": "/api/communication/messages",
            "campaigns": "/api/communication/campaigns",
            "notifications": "/api/communication/notifications",
            "logs": "/api/communication/logs",
            "metrics": "/api/communication/metrics"
        }
    }

@app.post("/api/communication/messages", response_model=MessageResponse)
async def send_message(
    message_data: MessageCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a communication message"""
    # Validate recipient information
    if message_data.communication_type == CommunicationType.EMAIL:
        if not message_data.recipient_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is required for email communication"
            )
        if not validate_email(message_data.recipient_email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email address format"
            )
    elif message_data.communication_type == CommunicationType.SMS:
        if not message_data.recipient_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number is required for SMS communication"
            )
        if not validate_phone(message_data.recipient_phone):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number format"
            )
    
    # Render content if template is used
    content = message_data.content
    if message_data.template_id:
        template = db.query(CommunicationTemplate).filter(CommunicationTemplate.id == message_data.template_id).first()
        if template:
            content = render_template_content(template.content, message_data.variables)
            if not message_data.subject and template.subject:
                message_data.subject = render_template_content(template.subject, message_data.variables)
    
    # Create message
    new_message = Message(
        property_id=message_data.property_id,
        template_id=message_data.template_id,
        communication_type=message_data.communication_type,
        recipient_email=message_data.recipient_email,
        recipient_phone=message_data.recipient_phone,
        recipient_id=message_data.recipient_id,
        subject=message_data.subject,
        content=content,
        html_content=message_data.html_content,
        priority=message_data.priority,
        scheduled_at=message_data.scheduled_at,
        variables=message_data.variables,
        metadata=message_data.metadata
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Log message creation
    log_entry = CommunicationLog(
        property_id=message_data.property_id,
        message_id=new_message.id,
        event_type="created",
        event_data={"created_by": current_user["user_id"]}
    )
    db.add(log_entry)
    db.commit()
    
    logger.info(f"✅ Message created: {new_message.id}")
    
    return MessageResponse(
        id=new_message.id,
        property_id=new_message.property_id,
        template_id=new_message.template_id,
        communication_type=new_message.communication_type,
        recipient_email=new_message.recipient_email,
        recipient_phone=new_message.recipient_phone,
        recipient_id=new_message.recipient_id,
        subject=new_message.subject,
        content=new_message.content,
        html_content=new_message.html_content,
        status=new_message.status,
        priority=new_message.priority,
        scheduled_at=new_message.scheduled_at,
        sent_at=new_message.sent_at,
        delivered_at=new_message.delivered_at,
        opened_at=new_message.opened_at,
        clicked_at=new_message.clicked_at,
        provider=new_message.provider,
        provider_message_id=new_message.provider_message_id,
        error_message=new_message.error_message,
        retry_count=new_message.retry_count,
        metadata=new_message.metadata,
        variables=new_message.variables,
        created_at=new_message.created_at,
        updated_at=new_message.updated_at
    )

@app.get("/api/communication/messages", response_model=List[MessageResponse])
async def get_messages(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    communication_type: Optional[CommunicationType] = None,
    status: Optional[MessageStatus] = None,
    recipient_email: Optional[str] = None,
    recipient_phone: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages with filtering"""
    query = db.query(Message)
    
    if property_id:
        query = query.filter(Message.property_id == property_id)
    if communication_type:
        query = query.filter(Message.communication_type == communication_type)
    if status:
        query = query.filter(Message.status == status)
    if recipient_email:
        query = query.filter(Message.recipient_email == recipient_email)
    if recipient_phone:
        query = query.filter(Message.recipient_phone == recipient_phone)
    
    messages = query.order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        MessageResponse(
            id=message.id,
            property_id=message.property_id,
            template_id=message.template_id,
            communication_type=message.communication_type,
            recipient_email=message.recipient_email,
            recipient_phone=message.recipient_phone,
            recipient_id=message.recipient_id,
            subject=message.subject,
            content=message.content,
            html_content=message.html_content,
            status=message.status,
            priority=message.priority,
            scheduled_at=message.scheduled_at,
            sent_at=message.sent_at,
            delivered_at=message.delivered_at,
            opened_at=message.opened_at,
            clicked_at=message.clicked_at,
            provider=message.provider,
            provider_message_id=message.provider_message_id,
            error_message=message.error_message,
            retry_count=message.retry_count,
            metadata=message.metadata,
            variables=message.variables,
            created_at=message.created_at,
            updated_at=message.updated_at
        )
        for message in messages
    ]

@app.post("/api/communication/campaigns")
async def create_campaign(
    campaign_data: CampaignCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new communication campaign"""
    new_campaign = Campaign(
        property_id=campaign_data.property_id,
        name=campaign_data.name,
        description=campaign_data.description,
        campaign_type=campaign_data.campaign_type,
        template_id=campaign_data.template_id,
        scheduled_at=campaign_data.scheduled_at,
        target_criteria=campaign_data.target_criteria,
        target_segments=campaign_data.target_segments,
        settings=campaign_data.settings,
        variables=campaign_data.variables
    )
    
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    
    logger.info(f"✅ Campaign created: {new_campaign.name}")
    
    return {
        "message": "Campaign created successfully",
        "campaign_id": new_campaign.id,
        "name": new_campaign.name,
        "status": new_campaign.status
    }

@app.post("/api/communication/notifications")
async def create_notification(
    notification_data: NotificationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new notification"""
    new_notification = Notification(
        property_id=notification_data.property_id,
        user_id=notification_data.user_id,
        title=notification_data.title,
        message=notification_data.message,
        notification_type=notification_data.notification_type,
        data=notification_data.data,
        action_url=notification_data.action_url,
        action_text=notification_data.action_text,
        priority=notification_data.priority,
        delivery_methods=notification_data.delivery_methods
    )
    
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)
    
    logger.info(f"✅ Notification created: {new_notification.title}")
    
    return {
        "message": "Notification created successfully",
        "notification_id": new_notification.id,
        "title": new_notification.title,
        "status": new_notification.status
    }

@app.get("/api/communication/metrics", response_model=CommunicationMetrics)
async def get_communication_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get communication service metrics"""
    # Get template counts
    template_query = db.query(CommunicationTemplate)
    if property_id:
        template_query = template_query.filter(CommunicationTemplate.property_id == property_id)
    
    total_templates = template_query.count()
    active_templates = template_query.filter(CommunicationTemplate.is_active == True).count()
    
    # Get message counts
    message_query = db.query(Message)
    if property_id:
        message_query = message_query.filter(Message.property_id == property_id)
    
    total_messages = message_query.count()
    messages_sent = message_query.filter(Message.status == MessageStatus.SENT).count()
    messages_delivered = message_query.filter(Message.status == MessageStatus.DELIVERED).count()
    messages_failed = message_query.filter(Message.status == MessageStatus.FAILED).count()
    
    # Get campaign counts
    campaign_query = db.query(Campaign)
    if property_id:
        campaign_query = campaign_query.filter(Campaign.property_id == property_id)
    
    total_campaigns = campaign_query.count()
    active_campaigns = campaign_query.filter(Campaign.status == CampaignStatus.RUNNING).count()
    
    # Get notification counts
    notification_query = db.query(Notification)
    if property_id:
        notification_query = notification_query.filter(Notification.property_id == property_id)
    
    total_notifications = notification_query.count()
    unread_notifications = notification_query.filter(Notification.status == "unread").count()
    
    # Calculate rates
    delivery_rate = 0.0
    if messages_sent > 0:
        delivery_rate = (messages_delivered / messages_sent) * 100
    
    open_rate = 0.0
    if messages_delivered > 0:
        opened_messages = message_query.filter(Message.opened_at.isnot(None)).count()
        open_rate = (opened_messages / messages_delivered) * 100
    
    click_rate = 0.0
    if messages_delivered > 0:
        clicked_messages = message_query.filter(Message.clicked_at.isnot(None)).count()
        click_rate = (clicked_messages / messages_delivered) * 100
    
    # Get messages by type
    messages_by_type = {}
    for comm_type in CommunicationType:
        count = message_query.filter(Message.communication_type == comm_type).count()
        messages_by_type[comm_type] = count
    
    # Get campaigns by status
    campaigns_by_status = {}
    for status in CampaignStatus:
        count = campaign_query.filter(Campaign.status == status).count()
        campaigns_by_status[status] = count
    
    return CommunicationMetrics(
        total_templates=total_templates,
        active_templates=active_templates,
        total_messages=total_messages,
        messages_sent=messages_sent,
        messages_delivered=messages_delivered,
        messages_failed=messages_failed,
        total_campaigns=total_campaigns,
        active_campaigns=active_campaigns,
        total_notifications=total_notifications,
        unread_notifications=unread_notifications,
        delivery_rate=delivery_rate,
        open_rate=open_rate,
        click_rate=click_rate,
        messages_by_type=messages_by_type,
        campaigns_by_status=campaigns_by_status
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )