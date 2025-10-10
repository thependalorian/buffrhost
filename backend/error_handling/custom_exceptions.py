"""
Custom Exceptions
Application-specific exception classes
"""

from typing import Optional, Dict, Any
from fastapi import status

class BuffrHostException(Exception):
    """Base exception for all BuffrHost application errors"""
    
    def __init__(
        self,
        message: str,
        error_code: str = "GENERIC_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)

class ValidationError(BuffrHostException):
    """Raised when data validation fails"""
    
    def __init__(
        self,
        message: str = "Validation failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details=details
        )

class AuthenticationError(BuffrHostException):
    """Raised when authentication fails"""
    
    def __init__(
        self,
        message: str = "Authentication failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details
        )

class AuthorizationError(BuffrHostException):
    """Raised when authorization fails"""
    
    def __init__(
        self,
        message: str = "Access denied",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            status_code=status.HTTP_403_FORBIDDEN,
            details=details
        )

class NotFoundError(BuffrHostException):
    """Raised when a resource is not found"""
    
    def __init__(
        self,
        resource: str = "Resource",
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"{resource} not found"
        if resource_id:
            message += f" with ID: {resource_id}"
        
        super().__init__(
            message=message,
            error_code="NOT_FOUND_ERROR",
            status_code=status.HTTP_404_NOT_FOUND,
            details=details
        )

class ConflictError(BuffrHostException):
    """Raised when a resource conflict occurs"""
    
    def __init__(
        self,
        message: str = "Resource conflict",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code="CONFLICT_ERROR",
            status_code=status.HTTP_409_CONFLICT,
            details=details
        )

class RateLimitError(BuffrHostException):
    """Raised when rate limit is exceeded"""
    
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        retry_after: Optional[int] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if retry_after:
            message += f". Retry after {retry_after} seconds"
        
        super().__init__(
            message=message,
            error_code="RATE_LIMIT_ERROR",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            details=details
        )

class ServiceUnavailableError(BuffrHostException):
    """Raised when a service is unavailable"""
    
    def __init__(
        self,
        service: str = "Service",
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if not message:
            message = f"{service} is currently unavailable"
        
        super().__init__(
            message=message,
            error_code="SERVICE_UNAVAILABLE_ERROR",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details=details
        )

class DatabaseError(BuffrHostException):
    """Raised when database operations fail"""
    
    def __init__(
        self,
        operation: str = "Database operation",
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if not message:
            message = f"{operation} failed"
        
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )

class ExternalServiceError(BuffrHostException):
    """Raised when external service calls fail"""
    
    def __init__(
        self,
        service: str = "External service",
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if not message:
            message = f"{service} call failed"
        
        super().__init__(
            message=message,
            error_code="EXTERNAL_SERVICE_ERROR",
            status_code=status.HTTP_502_BAD_GATEWAY,
            details=details
        )

class BusinessLogicError(BuffrHostException):
    """Raised when business logic validation fails"""
    
    def __init__(
        self,
        message: str = "Business logic validation failed",
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message=message,
            error_code="BUSINESS_LOGIC_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class ConfigurationError(BuffrHostException):
    """Raised when configuration is invalid"""
    
    def __init__(
        self,
        setting: str = "Configuration setting",
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if not message:
            message = f"Invalid configuration: {setting}"
        
        super().__init__(
            message=message,
            error_code="CONFIGURATION_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )

class TenantError(BuffrHostException):
    """Raised when tenant-related operations fail"""
    
    def __init__(
        self,
        message: str = "Tenant operation failed",
        tenant_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if tenant_id:
            message += f" for tenant: {tenant_id}"
        
        super().__init__(
            message=message,
            error_code="TENANT_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class PropertyError(BuffrHostException):
    """Raised when property-related operations fail"""
    
    def __init__(
        self,
        message: str = "Property operation failed",
        property_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if property_id:
            message += f" for property: {property_id}"
        
        super().__init__(
            message=message,
            error_code="PROPERTY_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class BookingError(BuffrHostException):
    """Raised when booking-related operations fail"""
    
    def __init__(
        self,
        message: str = "Booking operation failed",
        booking_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if booking_id:
            message += f" for booking: {booking_id}"
        
        super().__init__(
            message=message,
            error_code="BOOKING_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class PaymentError(BuffrHostException):
    """Raised when payment-related operations fail"""
    
    def __init__(
        self,
        message: str = "Payment operation failed",
        payment_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if payment_id:
            message += f" for payment: {payment_id}"
        
        super().__init__(
            message=message,
            error_code="PAYMENT_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class OnboardingError(BuffrHostException):
    """Raised when onboarding operations fail"""
    
    def __init__(
        self,
        message: str = "Onboarding operation failed",
        tenant_id: Optional[str] = None,
        step: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if tenant_id:
            message += f" for tenant: {tenant_id}"
        if step:
            message += f" at step: {step}"
        
        super().__init__(
            message=message,
            error_code="ONBOARDING_ERROR",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )

class AnalyticsError(BuffrHostException):
    """Raised when analytics operations fail"""
    
    def __init__(
        self,
        message: str = "Analytics operation failed",
        property_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        if property_id:
            message += f" for property: {property_id}"
        
        super().__init__(
            message=message,
            error_code="ANALYTICS_ERROR",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            details=details
        )