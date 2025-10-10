"""
Error Response Models
Standardized error response schemas
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class ErrorResponse(BaseModel):
    """Standard error response schema"""
    success: bool = False
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    error_id: Optional[str] = None
    timestamp: str
    path: Optional[str] = None
    method: Optional[str] = None

class ValidationErrorDetail(BaseModel):
    """Validation error detail schema"""
    field: str
    message: str
    type: str
    input: Optional[Any] = None

class ValidationErrorResponse(BaseModel):
    """Validation error response schema"""
    success: bool = False
    error_code: str = "VALIDATION_ERROR"
    message: str = "Validation failed"
    validation_errors: List[ValidationErrorDetail]
    error_id: Optional[str] = None
    timestamp: str
    path: Optional[str] = None
    method: Optional[str] = None

class APIErrorResponse(BaseModel):
    """API error response schema"""
    success: bool = False
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None
    error_id: Optional[str] = None
    timestamp: str

class BusinessErrorResponse(BaseModel):
    """Business logic error response schema"""
    success: bool = False
    error_code: str
    message: str
    business_rule: Optional[str] = None
    suggested_action: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class SystemErrorResponse(BaseModel):
    """System error response schema"""
    success: bool = False
    error_code: str = "SYSTEM_ERROR"
    message: str = "A system error occurred"
    error_id: str
    timestamp: str
    support_reference: Optional[str] = None

class RateLimitResponse(BaseModel):
    """Rate limit error response schema"""
    success: bool = False
    error_code: str = "RATE_LIMIT_EXCEEDED"
    message: str
    retry_after: Optional[int] = None
    limit: Optional[int] = None
    remaining: Optional[int] = None
    reset_time: Optional[datetime] = None
    error_id: Optional[str] = None
    timestamp: str

class MaintenanceResponse(BaseModel):
    """Maintenance mode response schema"""
    success: bool = False
    error_code: str = "MAINTENANCE_MODE"
    message: str = "Service is temporarily unavailable for maintenance"
    maintenance_start: Optional[datetime] = None
    estimated_end: Optional[datetime] = None
    reason: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class AuthenticationErrorResponse(BaseModel):
    """Authentication error response schema"""
    success: bool = False
    error_code: str = "AUTHENTICATION_ERROR"
    message: str = "Authentication failed"
    auth_type: Optional[str] = None
    required_permissions: Optional[List[str]] = None
    error_id: Optional[str] = None
    timestamp: str

class AuthorizationErrorResponse(BaseModel):
    """Authorization error response schema"""
    success: bool = False
    error_code: str = "AUTHORIZATION_ERROR"
    message: str = "Access denied"
    required_permission: Optional[str] = None
    user_role: Optional[str] = None
    resource: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class NotFoundErrorResponse(BaseModel):
    """Not found error response schema"""
    success: bool = False
    error_code: str = "NOT_FOUND"
    message: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    suggestions: Optional[List[str]] = None
    error_id: Optional[str] = None
    timestamp: str

class ConflictErrorResponse(BaseModel):
    """Conflict error response schema"""
    success: bool = False
    error_code: str = "CONFLICT"
    message: str
    conflicting_resource: Optional[str] = None
    conflict_reason: Optional[str] = None
    resolution_suggestions: Optional[List[str]] = None
    error_id: Optional[str] = None
    timestamp: str

class ExternalServiceErrorResponse(BaseModel):
    """External service error response schema"""
    success: bool = False
    error_code: str = "EXTERNAL_SERVICE_ERROR"
    message: str
    service_name: Optional[str] = None
    service_status: Optional[str] = None
    retry_after: Optional[int] = None
    error_id: Optional[str] = None
    timestamp: str

class DatabaseErrorResponse(BaseModel):
    """Database error response schema"""
    success: bool = False
    error_code: str = "DATABASE_ERROR"
    message: str = "Database operation failed"
    operation: Optional[str] = None
    table: Optional[str] = None
    constraint: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class TenantErrorResponse(BaseModel):
    """Tenant error response schema"""
    success: bool = False
    error_code: str = "TENANT_ERROR"
    message: str
    tenant_id: Optional[str] = None
    tenant_status: Optional[str] = None
    required_tier: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class PropertyErrorResponse(BaseModel):
    """Property error response schema"""
    success: bool = False
    error_code: str = "PROPERTY_ERROR"
    message: str
    property_id: Optional[str] = None
    property_status: Optional[str] = None
    operation: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class BookingErrorResponse(BaseModel):
    """Booking error response schema"""
    success: bool = False
    error_code: str = "BOOKING_ERROR"
    message: str
    booking_id: Optional[str] = None
    booking_status: Optional[str] = None
    room_availability: Optional[bool] = None
    alternative_suggestions: Optional[List[Dict[str, Any]]] = None
    error_id: Optional[str] = None
    timestamp: str

class PaymentErrorResponse(BaseModel):
    """Payment error response schema"""
    success: bool = False
    error_code: str = "PAYMENT_ERROR"
    message: str
    payment_id: Optional[str] = None
    payment_status: Optional[str] = None
    payment_method: Optional[str] = None
    retry_suggested: Optional[bool] = None
    error_id: Optional[str] = None
    timestamp: str

class OnboardingErrorResponse(BaseModel):
    """Onboarding error response schema"""
    success: bool = False
    error_code: str = "ONBOARDING_ERROR"
    message: str
    tenant_id: Optional[str] = None
    current_step: Optional[str] = None
    required_actions: Optional[List[str]] = None
    support_contact: Optional[str] = None
    error_id: Optional[str] = None
    timestamp: str

class AnalyticsErrorResponse(BaseModel):
    """Analytics error response schema"""
    success: bool = False
    error_code: str = "ANALYTICS_ERROR"
    message: str
    property_id: Optional[str] = None
    report_type: Optional[str] = None
    data_availability: Optional[bool] = None
    alternative_periods: Optional[List[str]] = None
    error_id: Optional[str] = None
    timestamp: str

# Error response factory
def create_error_response(
    error_type: str,
    message: str,
    **kwargs
) -> BaseModel:
    """Create appropriate error response based on error type"""
    
    error_responses = {
        "validation": ValidationErrorResponse,
        "authentication": AuthenticationErrorResponse,
        "authorization": AuthorizationErrorResponse,
        "not_found": NotFoundErrorResponse,
        "conflict": ConflictErrorResponse,
        "rate_limit": RateLimitResponse,
        "maintenance": MaintenanceResponse,
        "external_service": ExternalServiceErrorResponse,
        "database": DatabaseErrorResponse,
        "tenant": TenantErrorResponse,
        "property": PropertyErrorResponse,
        "booking": BookingErrorResponse,
        "payment": PaymentErrorResponse,
        "onboarding": OnboardingErrorResponse,
        "analytics": AnalyticsErrorResponse,
        "business": BusinessErrorResponse,
        "system": SystemErrorResponse
    }
    
    response_class = error_responses.get(error_type, ErrorResponse)
    
    # Add timestamp if not provided
    if "timestamp" not in kwargs:
        kwargs["timestamp"] = datetime.utcnow().isoformat()
    
    return response_class(
        message=message,
        **kwargs
    )