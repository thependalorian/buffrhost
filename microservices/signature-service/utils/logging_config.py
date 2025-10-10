"""
Logging configuration for signature service
"""

import logging
import os
import sys
from datetime import datetime
from typing import Optional

def setup_logging(level: Optional[str] = None, log_file: Optional[str] = None, service_name: str = "signature-service") -> None:
    """Setup logging configuration"""
    try:
        # Get log level from environment or parameter
        log_level = level or os.getenv("LOG_LEVEL", "INFO").upper()
        
        # Convert string level to logging constant
        numeric_level = getattr(logging, log_level, logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter(
            fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # Setup root logger
        root_logger = logging.getLogger()
        root_logger.setLevel(numeric_level)
        
        # Remove existing handlers
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(numeric_level)
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)
        
        # File handler (if specified)
        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(numeric_level)
            file_handler.setFormatter(formatter)
            root_logger.addHandler(file_handler)
        
        # Set specific logger levels
        logging.getLogger("uvicorn").setLevel(logging.INFO)
        logging.getLogger("fastapi").setLevel(logging.INFO)
        logging.getLogger("supabase").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.WARNING)
        
        # Log startup message
        logger = logging.getLogger(__name__)
        logger.info(f"Logging configured for {service_name} at level {log_level}")
        
    except Exception as e:
        print(f"Failed to setup logging: {e}")
        sys.exit(1)

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)

class ServiceLogger:
    """Service-specific logger wrapper"""
    
    def __init__(self, service_name: str):
        self.logger = logging.getLogger(service_name)
    
    def info(self, message: str, **kwargs):
        """Log info message"""
        self.logger.info(message, extra=kwargs)
    
    def warning(self, message: str, **kwargs):
        """Log warning message"""
        self.logger.warning(message, extra=kwargs)
    
    def error(self, message: str, **kwargs):
        """Log error message"""
        self.logger.error(message, extra=kwargs)
    
    def debug(self, message: str, **kwargs):
        """Log debug message"""
        self.logger.debug(message, extra=kwargs)
    
    def critical(self, message: str, **kwargs):
        """Log critical message"""
        self.logger.critical(message, extra=kwargs)

def log_function_call(func_name: str, **kwargs):
    """Log function call with parameters"""
    logger = logging.getLogger(__name__)
    params = ", ".join([f"{k}={v}" for k, v in kwargs.items()])
    logger.debug(f"Calling {func_name}({params})")

def log_performance(operation: str, duration: float, **kwargs):
    """Log performance metrics"""
    logger = logging.getLogger(__name__)
    extra_info = ", ".join([f"{k}={v}" for k, v in kwargs.items()])
    logger.info(f"Performance: {operation} took {duration:.3f}s ({extra_info})")

def log_error(error: Exception, context: str = "", **kwargs):
    """Log error with context"""
    logger = logging.getLogger(__name__)
    extra_info = ", ".join([f"{k}={v}" for k, v in kwargs.items()])
    logger.error(f"Error in {context}: {str(error)} ({extra_info})", exc_info=True)