"""
Logging Configuration
Centralized logging setup and configuration
"""

import logging
import logging.config
import sys
from pathlib import Path
from typing import Dict, Any
import json
from datetime import datetime

from config import settings

def setup_logging() -> None:
    """Setup application logging configuration"""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Define logging configuration
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S"
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s - %(funcName)s - %(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S"
            },
            "json": {
                "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": settings.LOG_LEVEL,
                "formatter": "standard",
                "stream": sys.stdout
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "detailed",
                "filename": "logs/buffr_host.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "detailed",
                "filename": "logs/errors.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            },
            "audit_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "json",
                "filename": "logs/audit.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10
            },
            "analytics_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "json",
                "filename": "logs/analytics.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            }
        },
        "loggers": {
            "": {  # Root logger
                "level": settings.LOG_LEVEL,
                "handlers": ["console", "file", "error_file"],
                "propagate": False
            },
            "buffr_host": {
                "level": settings.LOG_LEVEL,
                "handlers": ["console", "file", "error_file"],
                "propagate": False
            },
            "buffr_host.auth": {
                "level": "INFO",
                "handlers": ["audit_file"],
                "propagate": False
            },
            "buffr_host.analytics": {
                "level": "INFO",
                "handlers": ["analytics_file"],
                "propagate": False
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False
            },
            "uvicorn.error": {
                "level": "ERROR",
                "handlers": ["error_file"],
                "propagate": False
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False
            },
            "sqlalchemy": {
                "level": "WARNING",
                "handlers": ["file"],
                "propagate": False
            },
            "fastapi": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False
            }
        }
    }
    
    # Apply logging configuration
    logging.config.dictConfig(logging_config)
    
    # Set up additional loggers for specific modules
    setup_module_loggers()

def setup_module_loggers() -> None:
    """Setup loggers for specific application modules"""
    
    # Authentication logger
    auth_logger = logging.getLogger("buffr_host.auth")
    auth_logger.setLevel(logging.INFO)
    
    # Analytics logger
    analytics_logger = logging.getLogger("buffr_host.analytics")
    analytics_logger.setLevel(logging.INFO)
    
    # Database logger
    db_logger = logging.getLogger("buffr_host.database")
    db_logger.setLevel(logging.WARNING)
    
    # API logger
    api_logger = logging.getLogger("buffr_host.api")
    api_logger.setLevel(logging.INFO)

class StructuredLogger:
    """Structured logging helper class"""
    
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
    
    def log_request(
        self,
        method: str,
        path: str,
        status_code: int,
        processing_time: float,
        user_id: str = None,
        tenant_id: str = None,
        **kwargs
    ):
        """Log HTTP request"""
        self.logger.info(
            "HTTP Request",
            extra={
                "event_type": "http_request",
                "method": method,
                "path": path,
                "status_code": status_code,
                "processing_time": processing_time,
                "user_id": user_id,
                "tenant_id": tenant_id,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )
    
    def log_authentication(
        self,
        event: str,
        user_id: str = None,
        email: str = None,
        success: bool = None,
        ip_address: str = None,
        user_agent: str = None,
        **kwargs
    ):
        """Log authentication events"""
        self.logger.info(
            f"Authentication: {event}",
            extra={
                "event_type": "authentication",
                "event": event,
                "user_id": user_id,
                "email": email,
                "success": success,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )
    
    def log_authorization(
        self,
        event: str,
        user_id: str,
        resource: str,
        action: str,
        success: bool,
        **kwargs
    ):
        """Log authorization events"""
        self.logger.info(
            f"Authorization: {event}",
            extra={
                "event_type": "authorization",
                "event": event,
                "user_id": user_id,
                "resource": resource,
                "action": action,
                "success": success,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )
    
    def log_business_event(
        self,
        event: str,
        entity_type: str,
        entity_id: str,
        user_id: str = None,
        tenant_id: str = None,
        **kwargs
    ):
        """Log business events"""
        self.logger.info(
            f"Business Event: {event}",
            extra={
                "event_type": "business_event",
                "event": event,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "user_id": user_id,
                "tenant_id": tenant_id,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )
    
    def log_error(
        self,
        error: Exception,
        context: Dict[str, Any] = None,
        user_id: str = None,
        tenant_id: str = None
    ):
        """Log errors with context"""
        self.logger.error(
            f"Error: {str(error)}",
            extra={
                "event_type": "error",
                "error_type": error.__class__.__name__,
                "error_message": str(error),
                "context": context or {},
                "user_id": user_id,
                "tenant_id": tenant_id,
                "timestamp": datetime.utcnow().isoformat()
            },
            exc_info=True
        )
    
    def log_analytics(
        self,
        event: str,
        property_id: str,
        metric: str,
        value: Any,
        **kwargs
    ):
        """Log analytics events"""
        self.logger.info(
            f"Analytics: {event}",
            extra={
                "event_type": "analytics",
                "event": event,
                "property_id": property_id,
                "metric": metric,
                "value": value,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )
    
    def log_performance(
        self,
        operation: str,
        duration: float,
        success: bool,
        **kwargs
    ):
        """Log performance metrics"""
        self.logger.info(
            f"Performance: {operation}",
            extra={
                "event_type": "performance",
                "operation": operation,
                "duration": duration,
                "success": success,
                "timestamp": datetime.utcnow().isoformat(),
                **kwargs
            }
        )

def get_logger(name: str) -> StructuredLogger:
    """Get a structured logger instance"""
    return StructuredLogger(name)

def log_system_startup():
    """Log system startup information"""
    logger = logging.getLogger("buffr_host")
    logger.info("Buffr Host application starting up")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"Database URL: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else settings.DATABASE_URL}")

def log_system_shutdown():
    """Log system shutdown information"""
    logger = logging.getLogger("buffr_host")
    logger.info("Buffr Host application shutting down")

def log_database_connection(success: bool, error: str = None):
    """Log database connection status"""
    logger = logging.getLogger("buffr_host.database")
    if success:
        logger.info("Database connection established successfully")
    else:
        logger.error(f"Database connection failed: {error}")

def log_api_call(
    endpoint: str,
    method: str,
    status_code: int,
    duration: float,
    user_id: str = None,
    tenant_id: str = None
):
    """Log API call details"""
    logger = get_logger("buffr_host.api")
    logger.log_request(
        method=method,
        path=endpoint,
        status_code=status_code,
        processing_time=duration,
        user_id=user_id,
        tenant_id=tenant_id
    )