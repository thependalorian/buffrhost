"""
Buffr Host FastAPI Application
Main entry point for the hospitality management platform API.
"""
# Import development configuration first
import dev_config

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import logging
import sys
from redis.asyncio import Redis
from fastapi_limiter import FastAPILimiter
from datetime import datetime # Added for timestamp
import uuid # Added for unique ID generation

from config import settings
from database import create_tables, close_db
from routes import auth, hospitality_property, menu, inventory, customer, order, analytics, cms, knowledge_base, spa, conference, transportation, loyalty, qr_loyalty, staff, ai_knowledge, calendar, arcade, payment, demo_requests, buffr_agent, preview, financial, etuna_demo_ai, etuna_demo, waitlist, restaurant
from routes import email_send_route, email_analytics_route, email_preferences_route, email_templates_route, email_queue_route, email_blacklist_route, email_booking_confirmation_route, email_check_in_reminder_route, email_check_out_reminder_route, email_property_update_route, email_booking_cancellation_route, email_host_summary_route, email_webhook_sendgrid_route, email_webhook_resend_route, email_webhook_ses_route


# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events."""
    # Startup
    logger.info("Starting Buffr Host API...")
    await create_tables()
    logger.info("Database tables created/verified")

    # Initialize FastAPI-Limiter
    redis = Redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis)
    logger.info("FastAPI-Limiter initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Buffr Host API...")
    await close_db()
    logger.info("Database connections closed")
    await FastAPILimiter.close()
    logger.info("FastAPI-Limiter closed")


# Create FastAPI application
app = FastAPI(
    title="Buffr Host API",
    description="Comprehensive hospitality management platform API",
    version="1.0.0",
    docs_url="/docs" if settings.ENABLE_API_DOCS else None,
    redoc_url="/redoc" if settings.ENABLE_API_DOCS else None,
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(",") if settings.ALLOWED_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"])

# Trusted host middleware (production only)
if settings.ENVIRONMENT == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["buffr.ai", "*.buffr.ai", "host.buffr.ai", "api.buffr.ai"]
    )

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(hospitality_property.router, prefix="/api/v1/properties", tags=["properties"])
app.include_router(restaurant.router, prefix="/api/v1/restaurants", tags=["restaurants"])
app.include_router(menu.router, prefix="/api/v1", tags=["menu"])
app.include_router(inventory.router, prefix="/api/v1", tags=["inventory"])
app.include_router(customer.router, prefix="/api/v1", tags=["customers"])
app.include_router(order.router, prefix="/api/v1", tags=["orders"])
app.include_router(analytics.router, prefix="/api/v1", tags=["analytics"])
app.include_router(cms.router, prefix="/api/v1", tags=["cms"])
app.include_router(knowledge_base.router, prefix="/api/v1", tags=["knowledge-base"])
app.include_router(ai_knowledge.router, prefix="/api/v1", tags=["ai-knowledge"])
app.include_router(spa.router, prefix="/api/v1", tags=["spa"])
app.include_router(conference.router, prefix="/api/v1", tags=["conference"])
app.include_router(transportation.router, prefix="/api/v1", tags=["transportation"])
app.include_router(loyalty.router, prefix="/api/v1", tags=["loyalty"])
app.include_router(qr_loyalty.router, prefix="/api/v1", tags=["qr-loyalty"])
app.include_router(staff.router, prefix="/api/v1", tags=["staff"])
app.include_router(calendar.router, prefix="/api/v1", tags=["calendar"])
app.include_router(arcade.router, prefix="/api/v1/arcade", tags=["arcade-mcp"])
app.include_router(buffr_agent.router, prefix="/api/v1/agent", tags=["buffr-agent"])
app.include_router(etuna_demo_ai.router, prefix="/api/v1/etuna-ai", tags=["etuna-demo-ai"])
app.include_router(etuna_demo.router, prefix="/api/v1/etuna-demo", tags=["etuna-demo"])
app.include_router(waitlist.router, prefix="/api/v1/waitlist", tags=["waitlist"])
app.include_router(payment.router, prefix="/api/v1", tags=["payments"])
app.include_router(financial.router, prefix="/api/v1/financial", tags=["financial"])
app.include_router(demo_requests.router, prefix="/api/v1", tags=["demo-requests"])
app.include_router(preview.router, prefix="/api/v1", tags=["preview"])

app.include_router(email_send_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_analytics_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_preferences_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_templates_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_queue_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_blacklist_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_booking_confirmation_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_check_in_reminder_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_check_out_reminder_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_property_update_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_booking_cancellation_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_host_summary_route.router, prefix="/api/v1/email", tags=["email"])
app.include_router(email_webhook_sendgrid_route.router, prefix="/api/v1/email", tags=["email-webhooks"])
app.include_router(email_webhook_resend_route.router, prefix="/api/v1/email", tags=["email-webhooks"])
app.include_router(email_webhook_ses_route.router, prefix="/api/v1/email", tags=["email-webhooks"])

from routes import email_send_route
from routes import email_analytics_route
from routes import email_preferences_route
from routes import email_templates_route
from routes import email_queue_route
from routes import email_blacklist_route
from routes import email_booking_confirmation_route
from routes import email_check_in_reminder_route
from routes import email_check_out_reminder_route
from routes import email_property_update_route
from routes import email_booking_cancellation_route
from routes import email_host_summary_route
from routes import email_webhook_sendgrid_route
from routes import email_webhook_resend_route
from routes import email_webhook_ses_route

from pydantic import BaseModel # Ensure BaseModel is imported
from typing import Optional

# Pydantic model for Employee Loan Application
class EmployeeLoanApplication(BaseModel):
    employee_id: str
    property_id: str
    requested_amount: float
    loan_purpose: str
    employment_start_date: str
    salary: float
    contact_email: str
    contact_phone: Optional[str] = None

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Buffr Host API",
        "version": "1.0.0",
        "docs_url": "/docs" if settings.ENABLE_API_DOCS else "Documentation disabled",
        "status": "operational",
        "domain": "host.buffr.ai",
        "contact": "george@buffr.ai"
    }

@app.post("/employee-loan-applications")
async def receive_employee_loan_application(application: EmployeeLoanApplication):
    """
    Endpoint to receive employee loan applications from BuffrLend.
    This would typically store the application and trigger an internal review process.
    """
    # Placeholder for actual application processing logic
    print(f"Received employee loan application for employee: {application.employee_id}")
    # In a real scenario, this would save the application to the database
    # and potentially notify relevant staff for review.
    return {
        "message": "Employee loan application received successfully",
        "application_id": "app-" + application.employee_id + "-" + str(uuid.uuid4()), # Generate a unique ID
        "employee_id": application.employee_id,
        "status": "received",
        "received_at": str(datetime.now())
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    try:
        # Check database connection
        from database import get_db
        async for db in get_db():
            # Simple query to test connection
            await db.execute("SELECT 1")
            break
        
        return {
            "status": "healthy",
            "timestamp": "2024-01-01T00:00:00Z",
            "version": "1.0.0",
            "services": {
                "database": "healthy",
                "api": "healthy"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        )


@app.get("/api/v1/status")
async def api_status():
    """API status endpoint with detailed information."""
    return {
        "api_version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "features": {
            "ai_enabled": settings.ENABLE_AI_FEATURES,
            "realtime_enabled": settings.ENABLE_REALTIME,
            "analytics_enabled": settings.ENABLE_ANALYTICS,
            "marketing_enabled": settings.ENABLE_MARKETING
        },
        "limits": {
            "rate_limit_requests": settings.RATE_LIMIT_REQUESTS,
            "rate_limit_window": settings.RATE_LIMIT_WINDOW,
            "max_file_size": settings.MAX_FILE_SIZE
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
