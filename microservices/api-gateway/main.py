"""
Buffr Host API Gateway
Centralized entry point for all microservices with routing, authentication, and rate limiting.
"""
import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import Dict, List, Optional

import httpx
import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Service registry and configuration
SERVICES = {
    "auth": {
        "url": os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "hospitality": {
        "url": os.getenv("HOSPITALITY_SERVICE_URL", "http://hospitality-service:8002"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "menu": {
        "url": os.getenv("MENU_SERVICE_URL", "http://menu-service:8003"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "booking": {
        "url": os.getenv("BOOKING_SERVICE_URL", "http://booking-service:8004"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "payment": {
        "url": os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8005"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "notification": {
        "url": os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8006"),
        "health_endpoint": "/health",
        "timeout": 30
    },
    "analytics": {
        "url": os.getenv("ANALYTICS_SERVICE_URL", "http://analytics-service:8007"),
        "health_endpoint": "/health",
        "timeout": 30
    }
}

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# Rate limiting configuration
RATE_LIMITS = {
    "auth": "10/minute",
    "hospitality": "100/minute",
    "menu": "200/minute",
    "booking": "50/minute",
    "payment": "30/minute",
    "notification": "20/minute",
    "analytics": "50/minute"
}

# Request/Response models
class ServiceHealth(BaseModel):
    service: str
    status: str
    response_time: float
    last_check: str

class GatewayHealth(BaseModel):
    status: str
    services: List[ServiceHealth]
    uptime: str
    version: str = "1.0.0"

class ServiceRequest(BaseModel):
    service: str
    endpoint: str
    method: str = "GET"
    headers: Optional[Dict[str, str]] = None
    data: Optional[Dict] = None

# Global variables
redis_client: Optional[redis.Redis] = None
service_health: Dict[str, ServiceHealth] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    global redis_client
    
    # Startup
    logger.info("Starting Buffr Host API Gateway...")
    
    # Initialize Redis
    redis_client = redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis_client)
    logger.info("Redis and rate limiter initialized")
    
    # Start health check background task
    asyncio.create_task(health_check_loop())
    
    yield
    
    # Shutdown
    logger.info("Shutting down API Gateway...")
    await FastAPILimiter.close()
    if redis_client:
        await redis_client.close()

# Create FastAPI application
app = FastAPI(
    title="Buffr Host API Gateway",
    description="Centralized API Gateway for Buffr Host microservices",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware (production only)
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["buffr.ai", "*.buffr.ai", "host.buffr.ai", "api.buffr.ai"]
    )

async def health_check_loop():
    """Background task to check service health."""
    while True:
        try:
            await check_all_services()
            await asyncio.sleep(30)  # Check every 30 seconds
        except Exception as e:
            logger.error(f"Health check error: {e}")
            await asyncio.sleep(60)  # Wait longer on error

async def check_service_health(service_name: str, service_config: Dict) -> ServiceHealth:
    """Check health of a specific service."""
    import time
    start_time = time.time()
    
    try:
        async with httpx.AsyncClient(timeout=service_config["timeout"]) as client:
            response = await client.get(f"{service_config['url']}{service_config['health_endpoint']}")
            response_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            if response.status_code == 200:
                status = "healthy"
            else:
                status = "unhealthy"
                
    except Exception as e:
        response_time = (time.time() - start_time) * 1000
        status = "unhealthy"
        logger.error(f"Health check failed for {service_name}: {e}")
    
    return ServiceHealth(
        service=service_name,
        status=status,
        response_time=response_time,
        last_check=str(time.time())
    )

async def check_all_services():
    """Check health of all services."""
    global service_health
    
    for service_name, service_config in SERVICES.items():
        health = await check_service_health(service_name, service_config)
        service_health[service_name] = health

async def get_service_url(service_name: str) -> str:
    """Get service URL with health check."""
    if service_name not in SERVICES:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{service_name}' not found"
        )
    
    # Check if service is healthy
    if service_name in service_health:
        if service_health[service_name].status != "healthy":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Service '{service_name}' is unhealthy"
            )
    
    return SERVICES[service_name]["url"]

async def forward_request(service_name: str, request: Request) -> Response:
    """Forward request to appropriate service."""
    service_url = await get_service_url(service_name)
    
    # Extract path after service name
    path = request.url.path
    if path.startswith(f"/api/v1/{service_name}"):
        service_path = path.replace(f"/api/v1/{service_name}", "")
    else:
        service_path = path
    
    # Build target URL
    target_url = f"{service_url}{service_path}"
    if request.url.query:
        target_url += f"?{request.url.query}"
    
    # Prepare headers
    headers = dict(request.headers)
    headers.pop("host", None)  # Remove host header
    
    # Forward request
    async with httpx.AsyncClient(timeout=SERVICES[service_name]["timeout"]) as client:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=await request.body()
        )
        
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with gateway information."""
    return {
        "message": "Buffr Host API Gateway",
        "version": "1.0.0",
        "status": "operational",
        "services": list(SERVICES.keys()),
        "docs_url": "/docs"
    }

# Health check endpoint
@app.get("/health", response_model=GatewayHealth)
async def health_check():
    """Gateway health check with service status."""
    import time
    
    return GatewayHealth(
        status="healthy",
        services=list(service_health.values()),
        uptime=str(time.time())
    )

# Service routing endpoints
@app.api_route("/api/v1/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def auth_service(request: Request, path: str):
    """Route requests to authentication service."""
    return await forward_request("auth", request)

@app.api_route("/api/v1/hospitality/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def hospitality_service(request: Request, path: str):
    """Route requests to hospitality service."""
    return await forward_request("hospitality", request)

@app.api_route("/api/v1/menu/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def menu_service(request: Request, path: str):
    """Route requests to menu service."""
    return await forward_request("menu", request)

@app.api_route("/api/v1/booking/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def booking_service(request: Request, path: str):
    """Route requests to booking service."""
    return await forward_request("booking", request)

@app.api_route("/api/v1/payment/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def payment_service(request: Request, path: str):
    """Route requests to payment service."""
    return await forward_request("payment", request)

@app.api_route("/api/v1/notification/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def notification_service(request: Request, path: str):
    """Route requests to notification service."""
    return await forward_request("notification", request)

@app.api_route("/api/v1/analytics/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def analytics_service(request: Request, path: str):
    """Route requests to analytics service."""
    return await forward_request("analytics", request)

# Service discovery endpoint
@app.get("/api/v1/services")
async def list_services():
    """List all available services."""
    return {
        "services": [
            {
                "name": name,
                "url": config["url"],
                "status": service_health.get(name, {"status": "unknown"})["status"]
            }
            for name, config in SERVICES.items()
        ]
    }

# Service health endpoint
@app.get("/api/v1/services/{service_name}/health")
async def service_health_endpoint(service_name: str):
    """Get health status of a specific service."""
    if service_name not in service_health:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{service_name}' not found"
        )
    
    return service_health[service_name]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("ENVIRONMENT") == "development"
    )