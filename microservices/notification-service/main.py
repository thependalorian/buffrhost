"""
Buffr Host Notification Service
Handles email, SMS, and push notifications.
"""
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/buffrhost_notification")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Database Models
class Notification(Base):
    __tablename__ = "notifications"
    
    notification_id = Column(String, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    customer_id = Column(String, nullable=False)
    notification_type = Column(String, nullable=False)  # email, sms, push
    subject = Column(String)
    message = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, sent, failed
    sent_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class NotificationRequest(BaseModel):
    property_id: int
    customer_id: str
    notification_type: str
    subject: Optional[str] = None
    message: str
    recipient: str  # email or phone number

class NotificationResponse(BaseModel):
    notification_id: str
    property_id: int
    customer_id: str
    notification_type: str
    subject: Optional[str]
    message: str
    status: str
    sent_at: Optional[datetime]
    created_at: datetime

# Utility functions
async def get_db():
    """Get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def generate_notification_id() -> str:
    """Generate a unique notification ID."""
    import uuid
    return f"NOT{str(uuid.uuid4())[:12].upper()}"

# Create FastAPI application
app = FastAPI(
    title="Buffr Host Notification Service",
    description="Notification management service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database initialization
@app.on_event("startup")
async def startup_event():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Service health check."""
    return {
        "status": "healthy",
        "service": "notification-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Notification endpoints
@app.post("/notifications/send", response_model=NotificationResponse)
async def send_notification(
    notification_data: NotificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send a notification."""
    import uuid
    
    # Generate notification ID
    notification_id = generate_notification_id()
    
    # Create notification record
    notification = Notification(
        notification_id=notification_id,
        property_id=notification_data.property_id,
        customer_id=notification_data.customer_id,
        notification_type=notification_data.notification_type,
        subject=notification_data.subject,
        message=notification_data.message,
        status="pending"
    )
    
    db.add(notification)
    await db.commit()
    
    # Simulate sending notification
    import random
    success = random.random() > 0.05  # 95% success rate
    
    if success:
        notification.status = "sent"
        notification.sent_at = datetime.utcnow()
    else:
        notification.status = "failed"
    
    await db.commit()
    await db.refresh(notification)
    
    return NotificationResponse(
        notification_id=notification.notification_id,
        property_id=notification.property_id,
        customer_id=notification.customer_id,
        notification_type=notification.notification_type,
        subject=notification.subject,
        message=notification.message,
        status=notification.status,
        sent_at=notification.sent_at,
        created_at=notification.created_at
    )

@app.get("/notifications/{notification_id}", response_model=NotificationResponse)
async def get_notification(notification_id: str, db: AsyncSession = Depends(get_db)):
    """Get notification details."""
    from sqlalchemy import select
    
    result = await db.execute(
        select(Notification).where(Notification.notification_id == notification_id)
    )
    notification = result.scalar_one_or_none()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return NotificationResponse(
        notification_id=notification.notification_id,
        property_id=notification.property_id,
        customer_id=notification.customer_id,
        notification_type=notification.notification_type,
        subject=notification.subject,
        message=notification.message,
        status=notification.status,
        sent_at=notification.sent_at,
        created_at=notification.created_at
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8006,
        reload=os.getenv("ENVIRONMENT") == "development"
    )