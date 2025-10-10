"""
Global Error Manager
Centralized error handling and logging system
"""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import traceback
import uuid
from datetime import datetime
from typing import Dict, Any, Optional
import sys

from .custom_exceptions import BuffrHostException
from .error_responses import ErrorResponse, ValidationErrorResponse
from config import settings

logger = logging.getLogger(__name__)

class GlobalErrorManager:
    """Global error management and logging system"""
    
    def __init__(self, app: FastAPI):
        self.app = app
        self._register_handlers()
        self._register_middleware()
    
    def _register_handlers(self):
        """Register global exception handlers"""
        
        @self.app.exception_handler(BuffrHostException)
        async def buffr_host_exception_handler(request: Request, exc: BuffrHostException):
            """Handle custom BuffrHost exceptions"""
            error_id = str(uuid.uuid4())
            
            # Log the error
            logger.error(
                f"BuffrHost Exception [{error_id}]: {exc.message}",
                extra={
                    "error_id": error_id,
                    "error_type": exc.__class__.__name__,
                    "status_code": exc.status_code,
                    "details": exc.details,
                    "path": request.url.path,
                    "method": request.method,
                    "client_ip": request.client.host if request.client else None
                }
            )
            
            return JSONResponse(
                status_code=exc.status_code,
                content=ErrorResponse(
                    success=False,
                    error_code=exc.error_code,
                    message=exc.message,
                    details=exc.details,
                    error_id=error_id,
                    timestamp=datetime.utcnow().isoformat()
                ).dict()
            )
        
        @self.app.exception_handler(StarletteHTTPException)
        async def http_exception_handler(request: Request, exc: StarletteHTTPException):
            """Handle HTTP exceptions"""
            error_id = str(uuid.uuid4())
            
            # Log the error
            logger.warning(
                f"HTTP Exception [{error_id}]: {exc.detail}",
                extra={
                    "error_id": error_id,
                    "status_code": exc.status_code,
                    "path": request.url.path,
                    "method": request.method,
                    "client_ip": request.client.host if request.client else None
                }
            )
            
            return JSONResponse(
                status_code=exc.status_code,
                content=ErrorResponse(
                    success=False,
                    error_code=f"HTTP_{exc.status_code}",
                    message=exc.detail,
                    error_id=error_id,
                    timestamp=datetime.utcnow().isoformat()
                ).dict()
            )
        
        @self.app.exception_handler(RequestValidationError)
        async def validation_exception_handler(request: Request, exc: RequestValidationError):
            """Handle validation errors"""
            error_id = str(uuid.uuid4())
            
            # Format validation errors
            validation_errors = []
            for error in exc.errors():
                validation_errors.append({
                    "field": " -> ".join(str(loc) for loc in error["loc"]),
                    "message": error["msg"],
                    "type": error["type"],
                    "input": error.get("input")
                })
            
            # Log the error
            logger.warning(
                f"Validation Error [{error_id}]: {len(validation_errors)} validation errors",
                extra={
                    "error_id": error_id,
                    "validation_errors": validation_errors,
                    "path": request.url.path,
                    "method": request.method,
                    "client_ip": request.client.host if request.client else None
                }
            )
            
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content=ValidationErrorResponse(
                    success=False,
                    error_code="VALIDATION_ERROR",
                    message="Validation failed",
                    validation_errors=validation_errors,
                    error_id=error_id,
                    timestamp=datetime.utcnow().isoformat()
                ).dict()
            )
        
        @self.app.exception_handler(Exception)
        async def global_exception_handler(request: Request, exc: Exception):
            """Handle all other exceptions"""
            error_id = str(uuid.uuid4())
            
            # Log the error with full traceback
            logger.error(
                f"Unhandled Exception [{error_id}]: {str(exc)}",
                extra={
                    "error_id": error_id,
                    "error_type": exc.__class__.__name__,
                    "path": request.url.path,
                    "method": request.method,
                    "client_ip": request.client.host if request.client else None,
                    "traceback": traceback.format_exc()
                },
                exc_info=True
            )
            
            # Return generic error response
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content=ErrorResponse(
                    success=False,
                    error_code="INTERNAL_SERVER_ERROR",
                    message="An unexpected error occurred" if not settings.DEBUG else str(exc),
                    details={"traceback": traceback.format_exc()} if settings.DEBUG else None,
                    error_id=error_id,
                    timestamp=datetime.utcnow().isoformat()
                ).dict()
            )
    
    def _register_middleware(self):
        """Register error handling middleware"""
        
        @self.app.middleware("http")
        async def error_logging_middleware(request: Request, call_next):
            """Middleware for logging requests and responses"""
            start_time = datetime.utcnow()
            request_id = str(uuid.uuid4())
            
            # Add request ID to request state
            request.state.request_id = request_id
            
            # Log incoming request
            logger.info(
                f"Request [{request_id}]: {request.method} {request.url.path}",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "client_ip": request.client.host if request.client else None,
                    "user_agent": request.headers.get("user-agent"),
                    "start_time": start_time.isoformat()
                }
            )
            
            try:
                response = await call_next(request)
                
                # Calculate processing time
                processing_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Log response
                logger.info(
                    f"Response [{request_id}]: {response.status_code} in {processing_time:.3f}s",
                    extra={
                        "request_id": request_id,
                        "status_code": response.status_code,
                        "processing_time": processing_time,
                        "end_time": datetime.utcnow().isoformat()
                    }
                )
                
                # Add request ID to response headers
                response.headers["X-Request-ID"] = request_id
                
                return response
                
            except Exception as exc:
                # Calculate processing time
                processing_time = (datetime.utcnow() - start_time).total_seconds()
                
                # Log error
                logger.error(
                    f"Request Error [{request_id}]: {str(exc)} in {processing_time:.3f}s",
                    extra={
                        "request_id": request_id,
                        "error_type": exc.__class__.__name__,
                        "processing_time": processing_time,
                        "traceback": traceback.format_exc()
                    },
                    exc_info=True
                )
                
                # Re-raise the exception to be handled by exception handlers
                raise

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Custom error handling middleware"""
    
    async def dispatch(self, request: Request, call_next):
        """Process request and handle errors"""
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            # Let the global exception handlers deal with it
            raise

def setup_error_handling(app: FastAPI):
    """Setup global error handling for the application"""
    error_manager = GlobalErrorManager(app)
    return error_manager

def log_error(
    error: Exception,
    context: Dict[str, Any],
    level: str = "ERROR"
) -> str:
    """Log an error with context and return error ID"""
    error_id = str(uuid.uuid4())
    
    log_data = {
        "error_id": error_id,
        "error_type": error.__class__.__name__,
        "error_message": str(error),
        "context": context,
        "timestamp": datetime.utcnow().isoformat(),
        "traceback": traceback.format_exc()
    }
    
    if level.upper() == "ERROR":
        logger.error(f"Error [{error_id}]: {str(error)}", extra=log_data)
    elif level.upper() == "WARNING":
        logger.warning(f"Warning [{error_id}]: {str(error)}", extra=log_data)
    else:
        logger.info(f"Info [{error_id}]: {str(error)}", extra=log_data)
    
    return error_id

def create_error_response(
    error_code: str,
    message: str,
    status_code: int = 500,
    details: Optional[Dict[str, Any]] = None
) -> JSONResponse:
    """Create a standardized error response"""
    error_id = str(uuid.uuid4())
    
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(
            success=False,
            error_code=error_code,
            message=message,
            details=details,
            error_id=error_id,
            timestamp=datetime.utcnow().isoformat()
        ).dict()
    )