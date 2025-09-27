"""
Buffr Host AI Service - Microservice
Handles artificial intelligence, machine learning, and conversational AI for Buffr Host platform
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
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/buffr_host_ai")
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
SERVICE_NAME = "ai-service"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8012))

# Enums
class AIProvider(str, Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    AZURE = "azure"
    LOCAL = "local"

class ConversationType(str, Enum):
    CUSTOMER_SUPPORT = "customer_support"
    BOOKING_ASSISTANCE = "booking_assistance"
    MENU_RECOMMENDATION = "menu_recommendation"
    GENERAL_INQUIRY = "general_inquiry"
    COMPLAINT = "complaint"
    FEEDBACK = "feedback"

class ModelType(str, Enum):
    TEXT_GENERATION = "text_generation"
    TEXT_CLASSIFICATION = "text_classification"
    SENTIMENT_ANALYSIS = "sentiment_analysis"
    RECOMMENDATION = "recommendation"
    PREDICTION = "prediction"
    IMAGE_RECOGNITION = "image_recognition"

class TrainingStatus(str, Enum):
    PENDING = "pending"
    TRAINING = "training"
    COMPLETED = "completed"
    FAILED = "failed"

# Database Models
class AIModel(Base):
    __tablename__ = "ai_models"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Model Configuration
    model_type = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    version = Column(String, default="1.0.0")
    
    # Model Settings
    parameters = Column(JSON, default=dict)
    configuration = Column(JSON, default=dict)
    
    # Training Information
    training_data_source = Column(String, nullable=True)
    training_status = Column(String, default=TrainingStatus.PENDING)
    training_started_at = Column(DateTime, nullable=True)
    training_completed_at = Column(DateTime, nullable=True)
    
    # Performance Metrics
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    
    # Model Status
    is_active = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Conversation Information
    conversation_type = Column(String, nullable=False)
    session_id = Column(String, nullable=False, index=True)
    status = Column(String, default="active")  # active, closed, archived
    
    # Context Information
    context = Column(JSON, default=dict)
    metadata = Column(JSON, default=dict)
    
    # Conversation Metrics
    message_count = Column(Integer, default=0)
    duration_minutes = Column(Integer, nullable=True)
    satisfaction_rating = Column(Integer, nullable=True)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConversationMessage(Base):
    __tablename__ = "conversation_messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False, index=True)
    
    # Message Information
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    message_type = Column(String, default="text")  # text, image, audio, video
    
    # AI Processing
    model_used = Column(String, nullable=True)
    processing_time_ms = Column(Integer, nullable=True)
    tokens_used = Column(Integer, nullable=True)
    cost = Column(Numeric(10, 6), nullable=True)
    
    # Message Metadata
    metadata = Column(JSON, default=dict)
    sentiment = Column(String, nullable=True)
    intent = Column(String, nullable=True)
    entities = Column(JSON, default=list)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    customer_id = Column(String, nullable=True, index=True)
    
    # Recommendation Information
    recommendation_type = Column(String, nullable=False)  # menu_item, service, event
    target_id = Column(String, nullable=False)  # menu_item_id, service_id, etc.
    target_type = Column(String, nullable=False)
    
    # Recommendation Details
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=False)
    reasoning = Column(Text, nullable=True)
    
    # Recommendation Context
    context = Column(JSON, default=dict)
    user_preferences = Column(JSON, default=dict)
    
    # Recommendation Status
    status = Column(String, default="active")  # active, dismissed, accepted
    viewed_at = Column(DateTime, nullable=True)
    accepted_at = Column(DateTime, nullable=True)
    dismissed_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    property_id = Column(String, nullable=False, index=True)
    model_id = Column(String, ForeignKey("ai_models.id"), nullable=False, index=True)
    
    # Prediction Information
    prediction_type = Column(String, nullable=False)  # demand, revenue, customer_behavior
    target_date = Column(DateTime, nullable=False)
    predicted_value = Column(Numeric(15, 4), nullable=False)
    confidence_interval = Column(JSON, default=dict)
    
    # Prediction Context
    input_features = Column(JSON, default=dict)
    context = Column(JSON, default=dict)
    
    # Prediction Status
    status = Column(String, default="pending")  # pending, validated, expired
    actual_value = Column(Numeric(15, 4), nullable=True)
    accuracy = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    validated_at = Column(DateTime, nullable=True)

class TrainingData(Base):
    __tablename__ = "training_data"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    model_id = Column(String, ForeignKey("ai_models.id"), nullable=False, index=True)
    
    # Data Information
    data_type = Column(String, nullable=False)  # text, numerical, categorical
    data_source = Column(String, nullable=False)
    data_format = Column(String, nullable=False)  # json, csv, text
    
    # Data Content
    content = Column(Text, nullable=False)
    metadata = Column(JSON, default=dict)
    
    # Data Quality
    quality_score = Column(Float, nullable=True)
    validation_status = Column(String, default="pending")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class AIModelCreate(BaseModel):
    property_id: str
    name: str
    description: Optional[str] = None
    model_type: ModelType
    provider: AIProvider
    model_name: str
    version: str = "1.0.0"
    parameters: Optional[Dict[str, Any]] = {}
    configuration: Optional[Dict[str, Any]] = {}
    training_data_source: Optional[str] = None

class ConversationCreate(BaseModel):
    property_id: str
    customer_id: Optional[str] = None
    conversation_type: ConversationType
    session_id: str
    context: Optional[Dict[str, Any]] = {}
    metadata: Optional[Dict[str, Any]] = {}

class MessageCreate(BaseModel):
    conversation_id: str
    role: str
    content: str
    message_type: str = "text"
    metadata: Optional[Dict[str, Any]] = {}

class RecommendationCreate(BaseModel):
    property_id: str
    customer_id: Optional[str] = None
    recommendation_type: str
    target_id: str
    target_type: str
    title: str
    description: Optional[str] = None
    confidence_score: float
    reasoning: Optional[str] = None
    context: Optional[Dict[str, Any]] = {}
    user_preferences: Optional[Dict[str, Any]] = {}

class PredictionCreate(BaseModel):
    property_id: str
    model_id: str
    prediction_type: str
    target_date: datetime
    predicted_value: float
    confidence_interval: Optional[Dict[str, Any]] = {}
    input_features: Optional[Dict[str, Any]] = {}
    context: Optional[Dict[str, Any]] = {}

class ConversationResponse(BaseModel):
    id: str
    property_id: str
    customer_id: Optional[str]
    conversation_type: str
    session_id: str
    status: str
    context: Dict[str, Any]
    metadata: Dict[str, Any]
    message_count: int
    duration_minutes: Optional[int]
    satisfaction_rating: Optional[int]
    started_at: datetime
    ended_at: Optional[datetime]
    created_at: datetime

class AIMetrics(BaseModel):
    total_models: int
    active_models: int
    total_conversations: int
    active_conversations: int
    conversations_today: int
    total_messages: int
    total_recommendations: int
    recommendations_accepted: int
    total_predictions: int
    average_accuracy: float
    total_training_data: int
    models_by_type: Dict[str, int]
    conversations_by_type: Dict[str, int]

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
        logger.info("✅ Redis connected for AI service")
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
def generate_session_id() -> str:
    """Generate unique session ID"""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"AI-{timestamp}-{random_suffix}"

def calculate_confidence_score(accuracy: float, data_quality: float, model_performance: float) -> float:
    """Calculate confidence score for recommendations"""
    return (accuracy * 0.4 + data_quality * 0.3 + model_performance * 0.3)

def extract_entities(text: str) -> List[Dict[str, Any]]:
    """Extract entities from text (simplified implementation)"""
    entities = []
    # This would typically use NLP libraries like spaCy or NLTK
    # For now, returning empty list
    return entities

def analyze_sentiment(text: str) -> str:
    """Analyze sentiment of text (simplified implementation)"""
    # This would typically use sentiment analysis models
    # For now, returning neutral
    return "neutral"

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
    description="Artificial intelligence and machine learning microservice",
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
        "description": "Artificial intelligence and machine learning",
        "endpoints": {
            "health": "/health",
            "models": "/api/ai/models",
            "conversations": "/api/ai/conversations",
            "messages": "/api/ai/messages",
            "recommendations": "/api/ai/recommendations",
            "predictions": "/api/ai/predictions",
            "training": "/api/ai/training",
            "metrics": "/api/ai/metrics"
        }
    }

@app.post("/api/ai/conversations", response_model=ConversationResponse)
async def create_conversation(
    conversation_data: ConversationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new AI conversation"""
    new_conversation = Conversation(
        property_id=conversation_data.property_id,
        customer_id=conversation_data.customer_id,
        conversation_type=conversation_data.conversation_type,
        session_id=conversation_data.session_id,
        context=conversation_data.context,
        metadata=conversation_data.metadata
    )
    
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    
    logger.info(f"✅ AI conversation created: {new_conversation.session_id}")
    
    return ConversationResponse(
        id=new_conversation.id,
        property_id=new_conversation.property_id,
        customer_id=new_conversation.customer_id,
        conversation_type=new_conversation.conversation_type,
        session_id=new_conversation.session_id,
        status=new_conversation.status,
        context=new_conversation.context,
        metadata=new_conversation.metadata,
        message_count=new_conversation.message_count,
        duration_minutes=new_conversation.duration_minutes,
        satisfaction_rating=new_conversation.satisfaction_rating,
        started_at=new_conversation.started_at,
        ended_at=new_conversation.ended_at,
        created_at=new_conversation.created_at
    )

@app.post("/api/ai/messages")
async def send_message(
    message_data: MessageCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send a message in a conversation"""
    # Get conversation
    conversation = db.query(Conversation).filter(Conversation.id == message_data.conversation_id).first()
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Analyze message
    sentiment = analyze_sentiment(message_data.content)
    entities = extract_entities(message_data.content)
    
    # Create message
    new_message = ConversationMessage(
        conversation_id=message_data.conversation_id,
        role=message_data.role,
        content=message_data.content,
        message_type=message_data.message_type,
        metadata=message_data.metadata,
        sentiment=sentiment,
        entities=entities
    )
    
    db.add(new_message)
    
    # Update conversation message count
    conversation.message_count += 1
    
    # If this is a user message, generate AI response
    if message_data.role == "user":
        # Generate AI response (simplified)
        ai_response = "Thank you for your message. How can I assist you today?"
        
        # Create AI response message
        ai_message = ConversationMessage(
            conversation_id=message_data.conversation_id,
            role="assistant",
            content=ai_response,
            message_type="text",
            model_used="gpt-3.5-turbo",
            processing_time_ms=1500,
            tokens_used=25
        )
        
        db.add(ai_message)
        conversation.message_count += 1
    
    db.commit()
    db.refresh(new_message)
    
    logger.info(f"✅ Message sent in conversation: {message_data.conversation_id}")
    
    return {
        "message": "Message sent successfully",
        "message_id": new_message.id,
        "conversation_id": message_data.conversation_id,
        "sentiment": sentiment,
        "entities": entities
    }

@app.post("/api/ai/recommendations")
async def create_recommendation(
    recommendation_data: RecommendationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new AI recommendation"""
    new_recommendation = Recommendation(
        property_id=recommendation_data.property_id,
        customer_id=recommendation_data.customer_id,
        recommendation_type=recommendation_data.recommendation_type,
        target_id=recommendation_data.target_id,
        target_type=recommendation_data.target_type,
        title=recommendation_data.title,
        description=recommendation_data.description,
        confidence_score=recommendation_data.confidence_score,
        reasoning=recommendation_data.reasoning,
        context=recommendation_data.context,
        user_preferences=recommendation_data.user_preferences
    )
    
    db.add(new_recommendation)
    db.commit()
    db.refresh(new_recommendation)
    
    logger.info(f"✅ AI recommendation created: {new_recommendation.title}")
    
    return {
        "message": "Recommendation created successfully",
        "recommendation_id": new_recommendation.id,
        "title": new_recommendation.title,
        "confidence_score": new_recommendation.confidence_score
    }

@app.get("/api/ai/recommendations")
async def get_recommendations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    property_id: Optional[str] = None,
    customer_id: Optional[str] = None,
    recommendation_type: Optional[str] = None,
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI recommendations with filtering"""
    query = db.query(Recommendation)
    
    if property_id:
        query = query.filter(Recommendation.property_id == property_id)
    if customer_id:
        query = query.filter(Recommendation.customer_id == customer_id)
    if recommendation_type:
        query = query.filter(Recommendation.recommendation_type == recommendation_type)
    if status:
        query = query.filter(Recommendation.status == status)
    
    recommendations = query.order_by(Recommendation.confidence_score.desc()).offset(skip).limit(limit).all()
    
    return [
        {
            "id": rec.id,
            "property_id": rec.property_id,
            "customer_id": rec.customer_id,
            "recommendation_type": rec.recommendation_type,
            "target_id": rec.target_id,
            "target_type": rec.target_type,
            "title": rec.title,
            "description": rec.description,
            "confidence_score": float(rec.confidence_score),
            "reasoning": rec.reasoning,
            "context": rec.context,
            "user_preferences": rec.user_preferences,
            "status": rec.status,
            "created_at": rec.created_at
        }
        for rec in recommendations
    ]

@app.post("/api/ai/predictions")
async def create_prediction(
    prediction_data: PredictionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new AI prediction"""
    new_prediction = Prediction(
        property_id=prediction_data.property_id,
        model_id=prediction_data.model_id,
        prediction_type=prediction_data.prediction_type,
        target_date=prediction_data.target_date,
        predicted_value=prediction_data.predicted_value,
        confidence_interval=prediction_data.confidence_interval,
        input_features=prediction_data.input_features,
        context=prediction_data.context
    )
    
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    
    logger.info(f"✅ AI prediction created: {new_prediction.prediction_type}")
    
    return {
        "message": "Prediction created successfully",
        "prediction_id": new_prediction.id,
        "prediction_type": new_prediction.prediction_type,
        "predicted_value": float(new_prediction.predicted_value),
        "target_date": new_prediction.target_date
    }

@app.get("/api/ai/metrics", response_model=AIMetrics)
async def get_ai_metrics(
    property_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI service metrics"""
    # Get model counts
    model_query = db.query(AIModel)
    if property_id:
        model_query = model_query.filter(AIModel.property_id == property_id)
    
    total_models = model_query.count()
    active_models = model_query.filter(AIModel.is_active == True).count()
    
    # Get conversation counts
    conversation_query = db.query(Conversation)
    if property_id:
        conversation_query = conversation_query.filter(Conversation.property_id == property_id)
    
    total_conversations = conversation_query.count()
    active_conversations = conversation_query.filter(Conversation.status == "active").count()
    
    # Get conversations today
    today = datetime.utcnow().date()
    conversations_today = conversation_query.filter(db.func.date(Conversation.created_at) == today).count()
    
    # Get message counts
    message_query = db.query(ConversationMessage)
    if property_id:
        message_query = message_query.join(Conversation).filter(Conversation.property_id == property_id)
    
    total_messages = message_query.count()
    
    # Get recommendation counts
    recommendation_query = db.query(Recommendation)
    if property_id:
        recommendation_query = recommendation_query.filter(Recommendation.property_id == property_id)
    
    total_recommendations = recommendation_query.count()
    recommendations_accepted = recommendation_query.filter(Recommendation.status == "accepted").count()
    
    # Get prediction counts
    prediction_query = db.query(Prediction)
    if property_id:
        prediction_query = prediction_query.filter(Prediction.property_id == property_id)
    
    total_predictions = prediction_query.count()
    
    # Calculate average accuracy
    models_with_accuracy = model_query.filter(AIModel.accuracy.isnot(None)).all()
    average_accuracy = 0.0
    if models_with_accuracy:
        average_accuracy = sum(model.accuracy for model in models_with_accuracy) / len(models_with_accuracy)
    
    # Get training data counts
    training_data_query = db.query(TrainingData)
    if property_id:
        training_data_query = training_data_query.join(AIModel).filter(AIModel.property_id == property_id)
    
    total_training_data = training_data_query.count()
    
    # Get models by type
    models_by_type = {}
    for model_type in ModelType:
        count = model_query.filter(AIModel.model_type == model_type).count()
        models_by_type[model_type] = count
    
    # Get conversations by type
    conversations_by_type = {}
    for conv_type in ConversationType:
        count = conversation_query.filter(Conversation.conversation_type == conv_type).count()
        conversations_by_type[conv_type] = count
    
    return AIMetrics(
        total_models=total_models,
        active_models=active_models,
        total_conversations=total_conversations,
        active_conversations=active_conversations,
        conversations_today=conversations_today,
        total_messages=total_messages,
        total_recommendations=total_recommendations,
        recommendations_accepted=recommendations_accepted,
        total_predictions=total_predictions,
        average_accuracy=average_accuracy,
        total_training_data=total_training_data,
        models_by_type=models_by_type,
        conversations_by_type=conversations_by_type
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )