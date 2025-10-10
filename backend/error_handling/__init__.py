"""
Error Handling Module
Global error management, logging, and exception handling
"""

from .global_error_manager import GlobalErrorManager
from .custom_exceptions import (
    BuffrHostException,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError
)
from .error_responses import ErrorResponse, ValidationErrorResponse
from .logging_config import setup_logging

__all__ = [
    "GlobalErrorManager",
    "BuffrHostException",
    "ValidationError", 
    "AuthenticationError",
    "AuthorizationError",
    "NotFoundError",
    "ConflictError",
    "RateLimitError",
    "ServiceUnavailableError",
    "ErrorResponse",
    "ValidationErrorResponse",
    "setup_logging"
]