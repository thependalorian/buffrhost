"""
Buffr Host Analytics Service
Handles business intelligence and analytics.
"""
import logging
import os
from datetime import datetime, date
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text, JSON, Numeric, Date
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost:5432/buffrhost_analytics")
engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

# Database Models
class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    event_id = Column(String, primary_key=True, index=True)
    property_id = Column(Integer, nullable=False)
    event_type = Column(String, nullable=False)
    event_data = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String)
    session_id = Column(String)

# Pydantic Models
class AnalyticsRequest(BaseModel):
    property_id: int
    event_type: str
    event_data: Dict
    user_id: Optional[str] = None
    session_id: Optional[str] = None

class AnalyticsResponse(BaseModel):
    event_id: str
    property_id: int
    event_type: str
    event_data: Dict
    timestamp: datetime
    user_id: Optional[str]
    session_id: Optional[str]

class DashboardMetrics(BaseModel):
    total_revenue: float
    total_bookings: int
    occupancy_rate: float
    average_rating: float
    period: str

# Utility functions
async def get_db():
    """Get database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def generate_event_id() -> str:
    """Generate a unique event ID."""
    import uuid
    return f"EVT{str(uuid.uuid4())[:12].upper()}"

# Create FastAPI application
app = FastAPI(
    title="Buffr Host Analytics Service",
    description="Analytics and business intelligence service",
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
        "service": "analytics-service",
        "timestamp": datetime.utcnow().isoformat()
    }

# Analytics endpoints
@app.post("/events", response_model=AnalyticsResponse)
async def track_event(
    event_data: AnalyticsRequest,
    db: AsyncSession = Depends(get_db)
):
    """Track an analytics event."""
    import uuid
    
    # Generate event ID
    event_id = generate_event_id()
    
    # Create event record
    event = AnalyticsEvent(
        event_id=event_id,
        property_id=event_data.property_id,
        event_type=event_data.event_type,
        event_data=event_data.event_data,
        user_id=event_data.user_id,
        session_id=event_data.session_id
    )
    
    db.add(event)
    await db.commit()
    await db.refresh(event)
    
    return AnalyticsResponse(
        event_id=event.event_id,
        property_id=event.property_id,
        event_type=event.event_type,
        event_data=event.event_data,
        timestamp=event.timestamp,
        user_id=event.user_id,
        session_id=event.session_id
    )

@app.get("/dashboard/{property_id}", response_model=DashboardMetrics)
async def get_dashboard_metrics(
    property_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard metrics for a property."""
    # This is a simplified implementation
    # In a real system, you would calculate actual metrics from data
    
    return DashboardMetrics(
        total_revenue=125000.0,
        total_bookings=45,
        occupancy_rate=78.5,
        average_rating=4.2,
        period="last_30_days"
    )

@app.get("/reports/{property_id}/revenue")
async def get_revenue_report(
    property_id: int,
    start_date: date,
    end_date: date,
    db: AsyncSession = Depends(get_db)
):
    """Get revenue report for a property."""
    # Simplified implementation
    return {
        "property_id": property_id,
        "start_date": start_date,
        "end_date": end_date,
        "total_revenue": 125000.0,
        "daily_revenue": [
            {"date": "2024-01-01", "revenue": 5000.0},
            {"date": "2024-01-02", "revenue": 4500.0},
            {"date": "2024-01-03", "revenue": 5200.0}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8007,
        reload=os.getenv("ENVIRONMENT") == "development"
    )
