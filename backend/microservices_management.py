"""
Microservices Management API
Comprehensive backend API for managing microservices, health monitoring, and service administration
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import text, func, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import asyncio
import httpx
import json
import logging
from pydantic import BaseModel, Field
from enum import Enum

from database import get_db
from auth import verify_jwt_token
from models import (
    ServiceRegistry, ServiceHealthChecks, ServiceMetrics, ServiceLogs,
    ApiGatewayRoutes, ApiGatewayPolicies, ServiceAlerts, ServiceConfigurations,
    ServiceDeployments, ServiceDependencies, ServiceIntegrations,
    ServiceAnalytics, ServiceTesting, ServiceSecurity
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security
security = HTTPBearer()

# Router
router = APIRouter(prefix="/api/v1/microservices", tags=["Microservices Management"])

# Enums
class ServiceStatus(str, Enum):
    HEALTHY = "healthy"
    WARNING = "warning"
    ERROR = "error"
    UNKNOWN = "unknown"

class ServiceType(str, Enum):
    GATEWAY = "gateway"
    AUTHENTICATION = "authentication"
    HOSPITALITY = "hospitality"
    COMMUNICATION = "communication"
    MONITORING = "monitoring"
    AUTOMATION = "automation"
    DOCUMENT = "document"

class AlertType(str, Enum):
    HEALTH = "health"
    PERFORMANCE = "performance"
    ERROR = "error"
    SECURITY = "security"
    CAPACITY = "capacity"

class AlertSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Pydantic Models
class ServiceRegistryCreate(BaseModel):
    service_name: str = Field(..., min_length=1, max_length=100)
    service_type: ServiceType
    version: str = Field(..., min_length=1, max_length=20)
    port: int = Field(..., ge=1000, le=65535)
    host: str = Field(..., min_length=1, max_length=255)
    health_check_url: Optional[str] = Field(None, max_length=500)

class ServiceRegistryUpdate(BaseModel):
    service_name: Optional[str] = Field(None, min_length=1, max_length=100)
    service_type: Optional[ServiceType] = None
    version: Optional[str] = Field(None, min_length=1, max_length=20)
    port: Optional[int] = Field(None, ge=1000, le=65535)
    host: Optional[str] = Field(None, min_length=1, max_length=255)
    health_check_url: Optional[str] = Field(None, max_length=500)
    status: Optional[ServiceStatus] = None

class ServiceRegistryResponse(BaseModel):
    id: str
    service_name: str
    service_type: str
    version: str
    port: int
    host: str
    health_check_url: Optional[str]
    status: str
    last_health_check: Optional[datetime]
    response_time_ms: Optional[int]
    uptime_percentage: float
    created_at: datetime
    updated_at: datetime

class HealthCheckCreate(BaseModel):
    service_id: str
    check_type: str = Field(..., min_length=1, max_length=50)
    check_url: Optional[str] = Field(None, max_length=500)
    check_interval_seconds: int = Field(30, ge=10, le=3600)
    timeout_seconds: int = Field(10, ge=1, le=300)
    retry_count: int = Field(3, ge=0, le=10)
    is_active: bool = True

class HealthCheckResponse(BaseModel):
    id: str
    service_id: str
    check_type: str
    check_url: Optional[str]
    check_interval_seconds: int
    timeout_seconds: int
    retry_count: int
    is_active: bool
    last_check: Optional[datetime]
    last_status: Optional[str]
    last_response_time_ms: Optional[int]
    consecutive_failures: int

class ServiceMetricCreate(BaseModel):
    service_id: str
    metric_name: str = Field(..., min_length=1, max_length=100)
    metric_value: float
    metric_unit: Optional[str] = Field(None, max_length=20)
    metric_type: str = Field("gauge", regex="^(gauge|counter|histogram|summary)$")
    labels: Optional[Dict[str, Any]] = {}

class ServiceMetricResponse(BaseModel):
    id: str
    service_id: str
    metric_name: str
    metric_value: float
    metric_unit: Optional[str]
    metric_type: str
    labels: Dict[str, Any]
    timestamp: datetime

class ServiceLogCreate(BaseModel):
    service_id: str
    log_level: str = Field(..., regex="^(DEBUG|INFO|WARN|ERROR|FATAL)$")
    message: str = Field(..., min_length=1)
    context: Optional[Dict[str, Any]] = {}
    trace_id: Optional[str] = Field(None, max_length=100)
    span_id: Optional[str] = Field(None, max_length=100)
    user_id: Optional[str] = None
    session_id: Optional[str] = Field(None, max_length=100)
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class ServiceLogResponse(BaseModel):
    id: str
    service_id: str
    log_level: str
    message: str
    context: Dict[str, Any]
    trace_id: Optional[str]
    span_id: Optional[str]
    user_id: Optional[str]
    session_id: Optional[str]
    ip_address: Optional[str]
    user_agent: Optional[str]
    timestamp: datetime

class ApiRouteCreate(BaseModel):
    route_name: str = Field(..., min_length=1, max_length=100)
    service_id: str
    path: str = Field(..., min_length=1, max_length=500)
    method: str = Field(..., regex="^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)$")
    target_url: str = Field(..., min_length=1, max_length=500)
    is_active: bool = True
    rate_limit_per_minute: int = Field(100, ge=1, le=10000)
    timeout_seconds: int = Field(30, ge=1, le=300)
    retry_count: int = Field(3, ge=0, le=10)
    circuit_breaker_enabled: bool = False
    circuit_breaker_threshold: int = Field(5, ge=1, le=100)
    authentication_required: bool = True
    cors_enabled: bool = True
    cors_origins: Optional[List[str]] = []
    middleware_config: Optional[Dict[str, Any]] = {}

class ApiRouteResponse(BaseModel):
    id: str
    route_name: str
    service_id: str
    path: str
    method: str
    target_url: str
    is_active: bool
    rate_limit_per_minute: int
    timeout_seconds: int
    retry_count: int
    circuit_breaker_enabled: bool
    circuit_breaker_threshold: int
    authentication_required: bool
    cors_enabled: bool
    cors_origins: List[str]
    middleware_config: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class ServiceAlertCreate(BaseModel):
    alert_name: str = Field(..., min_length=1, max_length=100)
    service_id: Optional[str] = None
    alert_type: AlertType
    condition_config: Dict[str, Any]
    severity: AlertSeverity = AlertSeverity.MEDIUM
    is_active: bool = True
    notification_channels: Optional[List[str]] = []
    escalation_rules: Optional[Dict[str, Any]] = {}

class ServiceAlertResponse(BaseModel):
    id: str
    alert_name: str
    service_id: Optional[str]
    alert_type: str
    condition_config: Dict[str, Any]
    severity: str
    is_active: bool
    notification_channels: List[str]
    escalation_rules: Dict[str, Any]
    last_triggered: Optional[datetime]
    trigger_count: int
    created_at: datetime
    updated_at: datetime

class ServiceConfigCreate(BaseModel):
    service_id: str
    config_key: str = Field(..., min_length=1, max_length=200)
    config_value: str = Field(..., min_length=1)
    config_type: str = Field("string", regex="^(string|number|boolean|json|secret)$")
    is_secret: bool = False
    environment: str = Field("production", min_length=1, max_length=50)
    is_active: bool = True

class ServiceConfigResponse(BaseModel):
    id: str
    service_id: str
    config_key: str
    config_value: str
    config_type: str
    is_secret: bool
    environment: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

class ServiceHealthOverview(BaseModel):
    service_name: str
    service_type: str
    version: str
    status: str
    response_time_ms: Optional[int]
    uptime_percentage: float
    last_health_check: Optional[datetime]
    health_check_count: int
    healthy_checks: int
    error_checks: int

class ServiceMetricsSummary(BaseModel):
    service_name: str
    metric_name: str
    avg_value: float
    min_value: float
    max_value: float
    metric_count: int
    last_metric_time: Optional[datetime]

class ApiGatewayRoutesSummary(BaseModel):
    service_name: str
    route_count: int
    active_routes: int
    avg_rate_limit: float
    avg_timeout: float

# Dependency to get current user
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

# Dependency to check admin permissions
async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["admin", "service_manager"]:
        raise HTTPException(status_code=403, detail="Admin or service manager role required")
    return user

# Dependency to check developer permissions
async def require_developer(user: dict = Depends(get_current_user)):
    if user.get("role") not in ["admin", "service_manager", "developer"]:
        raise HTTPException(status_code=403, detail="Developer role required")
    return user

# Service Registry Endpoints
@router.get("/services", response_model=List[ServiceRegistryResponse])
async def get_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service_type: Optional[ServiceType] = None,
    status: Optional[ServiceStatus] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get all services with optional filtering"""
    query = db.query(ServiceRegistry)
    
    if service_type:
        query = query.filter(ServiceRegistry.service_type == service_type)
    if status:
        query = query.filter(ServiceRegistry.status == status)
    
    services = query.offset(skip).limit(limit).all()
    return services

@router.get("/services/{service_id}", response_model=ServiceRegistryResponse)
async def get_service(
    service_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get a specific service by ID"""
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/services", response_model=ServiceRegistryResponse)
async def create_service(
    service_data: ServiceRegistryCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Create a new service"""
    # Check if service name already exists
    existing_service = db.query(ServiceRegistry).filter(
        ServiceRegistry.service_name == service_data.service_name
    ).first()
    if existing_service:
        raise HTTPException(status_code=400, detail="Service name already exists")
    
    service = ServiceRegistry(
        service_name=service_data.service_name,
        service_type=service_data.service_type,
        version=service_data.version,
        port=service_data.port,
        host=service_data.host,
        health_check_url=service_data.health_check_url,
        created_by=user["user_id"],
        updated_by=user["user_id"]
    )
    
    db.add(service)
    db.commit()
    db.refresh(service)
    
    logger.info(f"Created service: {service.service_name} by user {user['user_id']}")
    return service

@router.put("/services/{service_id}", response_model=ServiceRegistryResponse)
async def update_service(
    service_id: str,
    service_data: ServiceRegistryUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Update a service"""
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Update fields if provided
    update_data = service_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)
    
    service.updated_by = user["user_id"]
    service.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(service)
    
    logger.info(f"Updated service: {service.service_name} by user {user['user_id']}")
    return service

@router.delete("/services/{service_id}")
async def delete_service(
    service_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Delete a service"""
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service_name = service.service_name
    db.delete(service)
    db.commit()
    
    logger.info(f"Deleted service: {service_name} by user {user['user_id']}")
    return {"message": "Service deleted successfully"}

# Health Check Endpoints
@router.get("/services/{service_id}/health-checks", response_model=List[HealthCheckResponse])
async def get_service_health_checks(
    service_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get health checks for a service"""
    health_checks = db.query(ServiceHealthChecks).filter(
        ServiceHealthChecks.service_id == service_id
    ).all()
    return health_checks

@router.post("/services/{service_id}/health-checks", response_model=HealthCheckResponse)
async def create_health_check(
    service_id: str,
    health_check_data: HealthCheckCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Create a health check for a service"""
    # Verify service exists
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    health_check = ServiceHealthChecks(
        service_id=service_id,
        check_type=health_check_data.check_type,
        check_url=health_check_data.check_url,
        check_interval_seconds=health_check_data.check_interval_seconds,
        timeout_seconds=health_check_data.timeout_seconds,
        retry_count=health_check_data.retry_count,
        is_active=health_check_data.is_active
    )
    
    db.add(health_check)
    db.commit()
    db.refresh(health_check)
    
    logger.info(f"Created health check for service {service.service_name}")
    return health_check

@router.post("/services/{service_id}/health-check/run")
async def run_health_check(
    service_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Run health check for a service"""
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Run health check in background
    background_tasks.add_task(perform_health_check, service_id, db)
    
    return {"message": "Health check initiated"}

# Metrics Endpoints
@router.get("/services/{service_id}/metrics", response_model=List[ServiceMetricResponse])
async def get_service_metrics(
    service_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    metric_name: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get metrics for a service"""
    query = db.query(ServiceMetrics).filter(ServiceMetrics.service_id == service_id)
    
    if metric_name:
        query = query.filter(ServiceMetrics.metric_name == metric_name)
    if start_time:
        query = query.filter(ServiceMetrics.timestamp >= start_time)
    if end_time:
        query = query.filter(ServiceMetrics.timestamp <= end_time)
    
    metrics = query.order_by(ServiceMetrics.timestamp.desc()).offset(skip).limit(limit).all()
    return metrics

@router.post("/services/{service_id}/metrics", response_model=ServiceMetricResponse)
async def create_service_metric(
    service_id: str,
    metric_data: ServiceMetricCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Create a metric for a service"""
    # Verify service exists
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    metric = ServiceMetrics(
        service_id=service_id,
        metric_name=metric_data.metric_name,
        metric_value=metric_data.metric_value,
        metric_unit=metric_data.metric_unit,
        metric_type=metric_data.metric_type,
        labels=metric_data.labels or {}
    )
    
    db.add(metric)
    db.commit()
    db.refresh(metric)
    
    return metric

# Logs Endpoints
@router.get("/services/{service_id}/logs", response_model=List[ServiceLogResponse])
async def get_service_logs(
    service_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    log_level: Optional[str] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get logs for a service"""
    query = db.query(ServiceLogs).filter(ServiceLogs.service_id == service_id)
    
    if log_level:
        query = query.filter(ServiceLogs.log_level == log_level)
    if start_time:
        query = query.filter(ServiceLogs.timestamp >= start_time)
    if end_time:
        query = query.filter(ServiceLogs.timestamp <= end_time)
    if search:
        query = query.filter(ServiceLogs.message.ilike(f"%{search}%"))
    
    logs = query.order_by(ServiceLogs.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

@router.post("/services/{service_id}/logs", response_model=ServiceLogResponse)
async def create_service_log(
    service_id: str,
    log_data: ServiceLogCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Create a log entry for a service"""
    # Verify service exists
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    log = ServiceLogs(
        service_id=service_id,
        log_level=log_data.log_level,
        message=log_data.message,
        context=log_data.context or {},
        trace_id=log_data.trace_id,
        span_id=log_data.span_id,
        user_id=log_data.user_id,
        session_id=log_data.session_id,
        ip_address=log_data.ip_address,
        user_agent=log_data.user_agent
    )
    
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return log

# API Gateway Routes Endpoints
@router.get("/gateway/routes", response_model=List[ApiRouteResponse])
async def get_api_routes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get API Gateway routes"""
    query = db.query(ApiGatewayRoutes)
    
    if service_id:
        query = query.filter(ApiGatewayRoutes.service_id == service_id)
    if is_active is not None:
        query = query.filter(ApiGatewayRoutes.is_active == is_active)
    
    routes = query.offset(skip).limit(limit).all()
    return routes

@router.post("/gateway/routes", response_model=ApiRouteResponse)
async def create_api_route(
    route_data: ApiRouteCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Create an API Gateway route"""
    # Check if route name already exists
    existing_route = db.query(ApiGatewayRoutes).filter(
        ApiGatewayRoutes.route_name == route_data.route_name
    ).first()
    if existing_route:
        raise HTTPException(status_code=400, detail="Route name already exists")
    
    # Verify service exists
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == route_data.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    route = ApiGatewayRoutes(
        route_name=route_data.route_name,
        service_id=route_data.service_id,
        path=route_data.path,
        method=route_data.method,
        target_url=route_data.target_url,
        is_active=route_data.is_active,
        rate_limit_per_minute=route_data.rate_limit_per_minute,
        timeout_seconds=route_data.timeout_seconds,
        retry_count=route_data.retry_count,
        circuit_breaker_enabled=route_data.circuit_breaker_enabled,
        circuit_breaker_threshold=route_data.circuit_breaker_threshold,
        authentication_required=route_data.authentication_required,
        cors_enabled=route_data.cors_enabled,
        cors_origins=route_data.cors_origins or [],
        middleware_config=route_data.middleware_config or {},
        created_by=user["user_id"],
        updated_by=user["user_id"]
    )
    
    db.add(route)
    db.commit()
    db.refresh(route)
    
    logger.info(f"Created API route: {route.route_name}")
    return route

# Service Alerts Endpoints
@router.get("/alerts", response_model=List[ServiceAlertResponse])
async def get_service_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    service_id: Optional[str] = None,
    alert_type: Optional[AlertType] = None,
    severity: Optional[AlertSeverity] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get service alerts"""
    query = db.query(ServiceAlerts)
    
    if service_id:
        query = query.filter(ServiceAlerts.service_id == service_id)
    if alert_type:
        query = query.filter(ServiceAlerts.alert_type == alert_type)
    if severity:
        query = query.filter(ServiceAlerts.severity == severity)
    if is_active is not None:
        query = query.filter(ServiceAlerts.is_active == is_active)
    
    alerts = query.offset(skip).limit(limit).all()
    return alerts

@router.post("/alerts", response_model=ServiceAlertResponse)
async def create_service_alert(
    alert_data: ServiceAlertCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Create a service alert"""
    # Verify service exists if provided
    if alert_data.service_id:
        service = db.query(ServiceRegistry).filter(ServiceRegistry.id == alert_data.service_id).first()
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
    
    alert = ServiceAlerts(
        alert_name=alert_data.alert_name,
        service_id=alert_data.service_id,
        alert_type=alert_data.alert_type,
        condition_config=alert_data.condition_config,
        severity=alert_data.severity,
        is_active=alert_data.is_active,
        notification_channels=alert_data.notification_channels or [],
        escalation_rules=alert_data.escalation_rules or {},
        created_by=user["user_id"],
        updated_by=user["user_id"]
    )
    
    db.add(alert)
    db.commit()
    db.refresh(alert)
    
    logger.info(f"Created alert: {alert.alert_name}")
    return alert

# Service Configuration Endpoints
@router.get("/services/{service_id}/configurations", response_model=List[ServiceConfigResponse])
async def get_service_configurations(
    service_id: str,
    environment: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get configurations for a service"""
    query = db.query(ServiceConfigurations).filter(ServiceConfigurations.service_id == service_id)
    
    if environment:
        query = query.filter(ServiceConfigurations.environment == environment)
    if is_active is not None:
        query = query.filter(ServiceConfigurations.is_active == is_active)
    
    configurations = query.all()
    return configurations

@router.post("/services/{service_id}/configurations", response_model=ServiceConfigResponse)
async def create_service_configuration(
    service_id: str,
    config_data: ServiceConfigCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Create a configuration for a service"""
    # Verify service exists
    service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Check if configuration already exists
    existing_config = db.query(ServiceConfigurations).filter(
        ServiceConfigurations.service_id == service_id,
        ServiceConfigurations.config_key == config_data.config_key,
        ServiceConfigurations.environment == config_data.environment
    ).first()
    if existing_config:
        raise HTTPException(status_code=400, detail="Configuration already exists for this service and environment")
    
    configuration = ServiceConfigurations(
        service_id=service_id,
        config_key=config_data.config_key,
        config_value=config_data.config_value,
        config_type=config_data.config_type,
        is_secret=config_data.is_secret,
        environment=config_data.environment,
        is_active=config_data.is_active,
        created_by=user["user_id"],
        updated_by=user["user_id"]
    )
    
    db.add(configuration)
    db.commit()
    db.refresh(configuration)
    
    logger.info(f"Created configuration for service {service.service_name}")
    return configuration

# Overview and Summary Endpoints
@router.get("/overview/health", response_model=List[ServiceHealthOverview])
async def get_service_health_overview(
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get service health overview"""
    # Use the view created in SQL
    result = db.execute(text("SELECT * FROM service_health_overview"))
    overview = result.fetchall()
    
    return [
        ServiceHealthOverview(
            service_name=row[0],
            service_type=row[1],
            version=row[2],
            status=row[3],
            response_time_ms=row[4],
            uptime_percentage=row[5],
            last_health_check=row[6],
            health_check_count=row[7],
            healthy_checks=row[8],
            error_checks=row[9]
        )
        for row in overview
    ]

@router.get("/overview/metrics", response_model=List[ServiceMetricsSummary])
async def get_service_metrics_summary(
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get service metrics summary"""
    # Use the view created in SQL
    result = db.execute(text("SELECT * FROM service_metrics_summary"))
    summary = result.fetchall()
    
    return [
        ServiceMetricsSummary(
            service_name=row[0],
            metric_name=row[1],
            avg_value=row[2],
            min_value=row[3],
            max_value=row[4],
            metric_count=row[5],
            last_metric_time=row[6]
        )
        for row in summary
    ]

@router.get("/overview/gateway", response_model=List[ApiGatewayRoutesSummary])
async def get_api_gateway_routes_summary(
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Get API Gateway routes summary"""
    # Use the view created in SQL
    result = db.execute(text("SELECT * FROM api_gateway_routes_summary"))
    summary = result.fetchall()
    
    return [
        ApiGatewayRoutesSummary(
            service_name=row[0],
            route_count=row[1],
            active_routes=row[2],
            avg_rate_limit=row[3],
            avg_timeout=row[4]
        )
        for row in summary
    ]

# Health Check Background Task
async def perform_health_check(service_id: str, db: Session):
    """Perform health check for a service"""
    try:
        service = db.query(ServiceRegistry).filter(ServiceRegistry.id == service_id).first()
        if not service:
            logger.error(f"Service {service_id} not found for health check")
            return
        
        health_checks = db.query(ServiceHealthChecks).filter(
            ServiceHealthChecks.service_id == service_id,
            ServiceHealthChecks.is_active == True
        ).all()
        
        if not health_checks:
            logger.warning(f"No active health checks found for service {service.service_name}")
            return
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            for health_check in health_checks:
                try:
                    start_time = datetime.utcnow()
                    response = await client.get(health_check.check_url or service.health_check_url)
                    end_time = datetime.utcnow()
                    
                    response_time = int((end_time - start_time).total_seconds() * 1000)
                    status = "healthy" if response.status_code == 200 else "warning"
                    
                    # Update health check
                    health_check.last_check = end_time
                    health_check.last_status = status
                    health_check.last_response_time_ms = response_time
                    health_check.consecutive_failures = 0
                    
                    # Update service status
                    service.status = status
                    service.last_health_check = end_time
                    service.response_time_ms = response_time
                    
                except Exception as e:
                    logger.error(f"Health check failed for service {service.service_name}: {str(e)}")
                    
                    # Update health check
                    health_check.last_check = datetime.utcnow()
                    health_check.last_status = "error"
                    health_check.consecutive_failures += 1
                    
                    # Update service status
                    service.status = "error"
                    service.last_health_check = datetime.utcnow()
        
        db.commit()
        logger.info(f"Health check completed for service {service.service_name}")
        
    except Exception as e:
        logger.error(f"Error performing health check for service {service_id}: {str(e)}")
        db.rollback()

# Cleanup Background Task
@router.post("/cleanup/logs")
async def cleanup_old_logs(
    background_tasks: BackgroundTasks,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    user: dict = Depends(require_admin)
):
    """Clean up old logs"""
    background_tasks.add_task(cleanup_logs_task, days, db)
    return {"message": f"Log cleanup initiated for logs older than {days} days"}

async def cleanup_logs_task(days: int, db: Session):
    """Background task to cleanup old logs"""
    try:
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        # Delete old logs
        deleted_logs = db.query(ServiceLogs).filter(
            ServiceLogs.timestamp < cutoff_date
        ).delete()
        
        # Delete old metrics (keep only last 90 days)
        cutoff_metrics = datetime.utcnow() - timedelta(days=90)
        deleted_metrics = db.query(ServiceMetrics).filter(
            ServiceMetrics.timestamp < cutoff_metrics
        ).delete()
        
        db.commit()
        logger.info(f"Cleanup completed: {deleted_logs} logs and {deleted_metrics} metrics deleted")
        
    except Exception as e:
        logger.error(f"Error during cleanup: {str(e)}")
        db.rollback()

# Service Status Check
@router.get("/services/{service_name}/health")
async def check_service_health(
    service_name: str,
    db: Session = Depends(get_db),
    user: dict = Depends(require_developer)
):
    """Check health of a specific service by name"""
    result = db.execute(
        text("SELECT * FROM check_service_health(:service_name)"),
        {"service_name": service_name}
    )
    health_data = result.fetchone()
    
    if not health_data:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return {
        "service_name": health_data[0],
        "status": health_data[1],
        "response_time_ms": health_data[2],
        "last_check": health_data[3],
        "uptime_percentage": health_data[4]
    }