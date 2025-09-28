"""
Buffr Host API Gateway Service - Microservice
Centralized routing, authentication, and rate limiting for Buffr Host hospitality platform
"""

import os
import logging
import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from enum import Enum

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, status, Depends, Query, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, EmailStr
import jwt
import httpx
from contextlib import asynccontextmanager
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Service configuration
SERVICE_NAME = "api-gateway"
SERVICE_VERSION = "1.0.0"
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8000))

# Redis setup
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = None

# Security
security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")

# Service Registry
SERVICE_REGISTRY = {
    "auth-service": {"url": "http://localhost:8001", "health": "/health"},
    "property-service": {"url": "http://localhost:8002", "health": "/health"},
    "menu-service": {"url": "http://localhost:8003", "health": "/health"},
    "inventory-service": {"url": "http://localhost:8004", "health": "/health"},
    "customer-service": {"url": "http://localhost:8005", "health": "/health"},
    "order-service": {"url": "http://localhost:8006", "health": "/health"},
    "payment-service": {"url": "http://localhost:8007", "health": "/health"},
    "loyalty-service": {"url": "http://localhost:8008", "health": "/health"},
    "staff-service": {"url": "http://localhost:8009", "health": "/health"},
    "calendar-service": {"url": "http://localhost:8010", "health": "/health"},
    "analytics-service": {"url": "http://localhost:8011", "health": "/health"},
    "ai-service": {"url": "http://localhost:8012", "health": "/health"},
    "communication-service": {"url": "http://localhost:8013", "health": "/health"},
    "content-service": {"url": "http://localhost:8014", "health": "/health"},
    "restaurant-service": {"url": "http://localhost:8015", "health": "/health"}
}

# Route Mapping
ROUTE_MAPPING = {
    "/api/v1/auth": "auth-service",
    "/api/v1/properties": "property-service",
    "/api/v1/menus": "menu-service",
    "/api/v1/inventory": "inventory-service",
    "/api/v1/customers": "customer-service",
    "/api/v1/orders": "order-service",
    "/api/v1/payments": "payment-service",
    "/api/v1/loyalty": "loyalty-service",
    "/api/v1/staff": "staff-service",
    "/api/v1/calendar": "calendar-service",
    "/api/v1/analytics": "analytics-service",
    "/api/v1/ai": "ai-service",
    "/api/v1/communications": "communication-service",
    "/api/v1/content": "content-service",
    "/api/v1/restaurants": "restaurant-service"
}

# Enums
class ServiceStatus(str, Enum):
    HEALTHY = "healthy"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"

class RequestMethod(str, Enum):
    GET = "GET"
    POST = "POST"
    PUT = "PUT"
    DELETE = "DELETE"
    PATCH = "PATCH"

# Pydantic Models
class ServiceHealth(BaseModel):
    service_name: str
    status: ServiceStatus
    response_time: float
    last_check: datetime
    error_message: Optional[str] = None

class GatewayMetrics(BaseModel):
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time: float
    services_healthy: int
    services_unhealthy: int
    uptime: str

class RateLimitInfo(BaseModel):
    limit: int
    remaining: int
    reset_time: datetime
    retry_after: Optional[int] = None

# Redis connection
async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connected for API Gateway")
    except Exception as e:
        logger.warning(f"⚠️ Redis not available: {e}")
        redis_client = None

# Service discovery
def get_target_service(path: str) -> Optional[str]:
    """Determine target service based on request path"""
    for route_prefix, service_name in ROUTE_MAPPING.items():
        if path.startswith(route_prefix):
            return service_name
    return None

# Authentication
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token"""
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

# Rate limiting
async def check_rate_limit(request: Request, user_info: dict = Depends(verify_token)) -> RateLimitInfo:
    """Check and enforce rate limits"""
    if not redis_client:
        return RateLimitInfo(limit=1000, remaining=999, reset_time=datetime.utcnow() + timedelta(hours=1))
    
    user_id = user_info.get("user_id", "anonymous")
    client_ip = request.client.host if request.client else "unknown"
    
    # Create rate limit key
    rate_key = f"rate_limit:{user_id}:{client_ip}"
    
    # Get current count
    current_count = await redis_client.get(rate_key)
    if current_count is None:
        current_count = 0
    else:
        current_count = int(current_count)
    
    # Rate limit: 100 requests per minute
    limit = 100
    remaining = max(0, limit - current_count)
    
    if current_count >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded",
            headers={"Retry-After": "60"}
        )
    
    # Increment counter
    await redis_client.incr(rate_key)
    await redis_client.expire(rate_key, 60)  # 1 minute window
    
    return RateLimitInfo(
        limit=limit,
        remaining=remaining,
        reset_time=datetime.utcnow() + timedelta(minutes=1)
    )

# Service health check
async def check_service_health(service_name: str) -> ServiceHealth:
    """Check health of a specific service"""
    service_info = SERVICE_REGISTRY.get(service_name)
    if not service_info:
        return ServiceHealth(
            service_name=service_name,
            status=ServiceStatus.UNKNOWN,
            response_time=0.0,
            last_check=datetime.utcnow(),
            error_message="Service not found in registry"
        )
    
    start_time = datetime.utcnow()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{service_info['url']}{service_info['health']}")
            response_time = (datetime.utcnow() - start_time).total_seconds()
            
            if response.status_code == 200:
                return ServiceHealth(
                    service_name=service_name,
                    status=ServiceStatus.HEALTHY,
                    response_time=response_time,
                    last_check=datetime.utcnow()
                )
            else:
                return ServiceHealth(
                    service_name=service_name,
                    status=ServiceStatus.UNHEALTHY,
                    response_time=response_time,
                    last_check=datetime.utcnow(),
                    error_message=f"HTTP {response.status_code}"
                )
    except Exception as e:
        response_time = (datetime.utcnow() - start_time).total_seconds()
        return ServiceHealth(
            service_name=service_name,
            status=ServiceStatus.UNHEALTHY,
            response_time=response_time,
            last_check=datetime.utcnow(),
            error_message=str(e)
        )

# Proxy request to target service
async def proxy_request(
    request: Request,
    target_service: str,
    path: str,
    method: str,
    headers: dict,
    body: bytes = None
) -> Response:
    """Proxy request to target service"""
    service_info = SERVICE_REGISTRY.get(target_service)
    if not service_info:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service {target_service} not available"
        )
    
    # Build target URL
    target_url = f"{service_info['url']}{path}"
    
    # Prepare headers (remove host and authorization)
    proxy_headers = {k: v for k, v in headers.items() 
                    if k.lower() not in ['host', 'authorization']}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method == "GET":
                response = await client.get(target_url, headers=proxy_headers)
            elif method == "POST":
                response = await client.post(target_url, headers=proxy_headers, content=body)
            elif method == "PUT":
                response = await client.put(target_url, headers=proxy_headers, content=body)
            elif method == "DELETE":
                response = await client.delete(target_url, headers=proxy_headers)
            elif method == "PATCH":
                response = await client.patch(target_url, headers=proxy_headers, content=body)
            else:
                raise HTTPException(
                    status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                    detail=f"Method {method} not allowed"
                )
            
            # Return response
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.headers.get("content-type")
            )
    
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Service timeout"
        )
    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service {target_service} unavailable"
        )
    except Exception as e:
        logger.error(f"Proxy error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

# Application lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"🚀 Starting {SERVICE_NAME} v{SERVICE_VERSION}")
    await connect_redis()
    
    # Start health check background task
    asyncio.create_task(health_check_background_task())
    
    yield
    
    # Shutdown
    if redis_client:
        await redis_client.close()
    logger.info(f"🛑 {SERVICE_NAME} shutdown complete")

# Background health check task
async def health_check_background_task():
    """Background task to check service health"""
    while True:
        try:
            for service_name in SERVICE_REGISTRY.keys():
                health = await check_service_health(service_name)
                # Store health status in Redis
                if redis_client:
                    await redis_client.setex(
                        f"service_health:{service_name}",
                        60,  # 1 minute TTL
                        health.status
                    )
        except Exception as e:
            logger.error(f"Health check error: {e}")
        
        await asyncio.sleep(30)  # Check every 30 seconds

# FastAPI app
app = FastAPI(
    title=f"{SERVICE_NAME.title()}",
    description="API Gateway for Buffr Host hospitality platform",
    version=SERVICE_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# API Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services_registered": len(SERVICE_REGISTRY)
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": SERVICE_NAME,
        "version": SERVICE_VERSION,
        "description": "API Gateway for Buffr Host hospitality platform",
        "services": list(SERVICE_REGISTRY.keys()),
        "endpoints": {
            "health": "/health",
            "services": "/api/gateway/services",
            "metrics": "/api/gateway/metrics"
        }
    }

@app.get("/api/gateway/services")
async def get_services_status():
    """Get status of all registered services"""
    services_status = []
    
    for service_name in SERVICE_REGISTRY.keys():
        health = await check_service_health(service_name)
        services_status.append(health)
    
    return {
        "services": services_status,
        "total_services": len(services_status),
        "healthy_services": len([s for s in services_status if s.status == ServiceStatus.HEALTHY]),
        "unhealthy_services": len([s for s in services_status if s.status == ServiceStatus.UNHEALTHY])
    }

@app.get("/api/gateway/metrics", response_model=GatewayMetrics)
async def get_gateway_metrics():
    """Get gateway metrics"""
    # Get metrics from Redis
    if redis_client:
        total_requests = await redis_client.get("gateway:total_requests") or 0
        successful_requests = await redis_client.get("gateway:successful_requests") or 0
        failed_requests = await redis_client.get("gateway:failed_requests") or 0
        response_times = await redis_client.lrange("gateway:response_times", 0, -1)
        
        avg_response_time = 0.0
        if response_times:
            avg_response_time = sum(float(t) for t in response_times) / len(response_times)
        
        # Count healthy services
        healthy_count = 0
        unhealthy_count = 0
        for service_name in SERVICE_REGISTRY.keys():
            health_status = await redis_client.get(f"service_health:{service_name}")
            if health_status == ServiceStatus.HEALTHY:
                healthy_count += 1
            else:
                unhealthy_count += 1
    else:
        total_requests = 0
        successful_requests = 0
        failed_requests = 0
        avg_response_time = 0.0
        healthy_count = len(SERVICE_REGISTRY)
        unhealthy_count = 0
    
    return GatewayMetrics(
        total_requests=int(total_requests),
        successful_requests=int(successful_requests),
        failed_requests=int(failed_requests),
        average_response_time=avg_response_time,
        services_healthy=healthy_count,
        services_unhealthy=unhealthy_count,
        uptime="99.9%"  # Would be calculated from actual uptime
    )

# Catch-all route for proxying requests
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_all_requests(
    request: Request,
    path: str,
    rate_limit: RateLimitInfo = Depends(check_rate_limit)
):
    """Proxy all requests to appropriate microservices"""
    # Skip gateway's own endpoints
    if path.startswith("api/gateway") or path in ["health", "docs", "openapi.json"]:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    
    # Determine target service
    target_service = get_target_service(f"/{path}")
    if not target_service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )
    
    # Check if service is healthy
    if redis_client:
        health_status = await redis_client.get(f"service_health:{target_service}")
        if health_status == ServiceStatus.UNHEALTHY:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Service {target_service} is currently unavailable"
            )
    
    # Get request body
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
    
    # Update metrics
    if redis_client:
        await redis_client.incr("gateway:total_requests")
        start_time = datetime.utcnow()
    
    try:
        # Proxy request
        response = await proxy_request(
            request=request,
            target_service=target_service,
            path=f"/{path}",
            method=request.method,
            headers=dict(request.headers),
            body=body
        )
        
        # Update success metrics
        if redis_client:
            await redis_client.incr("gateway:successful_requests")
            response_time = (datetime.utcnow() - start_time).total_seconds()
            await redis_client.lpush("gateway:response_times", response_time)
            await redis_client.ltrim("gateway:response_times", 0, 99)  # Keep last 100
        
        return response
    
    except HTTPException:
        # Update failure metrics
        if redis_client:
            await redis_client.incr("gateway:failed_requests")
        raise
    except Exception as e:
        # Update failure metrics
        if redis_client:
            await redis_client.incr("gateway:failed_requests")
        
        logger.error(f"Proxy error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=SERVICE_PORT,
        reload=True
    )