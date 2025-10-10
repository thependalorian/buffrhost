"""
Configuration Management
Centralized configuration for Buffr Host application
"""

import os
from typing import List, Optional, Dict, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application
    APP_NAME: str = "Buffr Host"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: Optional[str] = None
    REDIS_DB: int = 0
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_USE_TLS: bool = True
    SMTP_USE_SSL: bool = False
    
    # Email Providers
    SENDGRID_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    AWS_SES_ACCESS_KEY: Optional[str] = None
    AWS_SES_SECRET_KEY: Optional[str] = None
    AWS_SES_REGION: str = "us-east-1"
    
    # AI Services
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_MAX_TOKENS: int = 4000
    OPENAI_TEMPERATURE: float = 0.7
    
    # LangChain Configuration
    LANGCHAIN_API_KEY: Optional[str] = None
    LANGCHAIN_PROJECT: str = "buffr-host"
    LANGCHAIN_TRACING: bool = False
    
    # Payment Gateways
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    ADUMO_API_KEY: str = ""
    ADUMO_MERCHANT_ID: str = ""
    ADUMO_ENVIRONMENT: str = "sandbox"  # sandbox or production
    
    REALPAY_API_KEY: str = ""
    REALPAY_MERCHANT_ID: str = ""
    REALPAY_ENVIRONMENT: str = "sandbox"
    
    # BuffrPay Configuration
    BUFFR_PAY_API_KEY: str = ""
    BUFFR_PAY_MERCHANT_ID: str = ""
    BUFFR_PAY_WEBHOOK_SECRET: str = ""
    BUFFR_PAY_ENVIRONMENT: str = "sandbox"
    
    # File Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "application/pdf", "text/plain", "application/json"
    ]
    
    # AWS S3 (if using S3 for file storage)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_S3_REGION: str = "us-east-1"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    RATE_LIMIT_STORAGE: str = "redis"  # redis or memory
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_FILE: Optional[str] = None
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9090
    HEALTH_CHECK_INTERVAL: int = 30
    
    # Features
    ENABLE_AI_FEATURES: bool = True
    ENABLE_REALTIME: bool = True
    ENABLE_ANALYTICS: bool = True
    ENABLE_MARKETING: bool = True
    ENABLE_MULTI_TENANT: bool = True
    ENABLE_API_DOCS: bool = True
    
    # Multi-tenant Configuration
    DEFAULT_TENANT_TIER: str = "essential"
    TENANT_TRIAL_DAYS: int = 14
    MAX_TENANTS_PER_USER: int = 5
    
    # Onboarding
    ONBOARDING_EMAIL_TEMPLATES: bool = True
    ONBOARDING_AUTOMATION: bool = True
    ONBOARDING_AI_RECOMMENDATIONS: bool = True
    
    # Business Logic
    DEFAULT_CURRENCY: str = "USD"
    DEFAULT_TIMEZONE: str = "UTC"
    DEFAULT_LANGUAGE: str = "en"
    
    # Booking Engine
    BOOKING_ADVANCE_DAYS: int = 365
    BOOKING_CANCELLATION_HOURS: int = 24
    BOOKING_MIN_STAY: int = 1
    BOOKING_MAX_STAY: int = 30
    
    # Revenue Management
    ENABLE_DYNAMIC_PRICING: bool = True
    PRICING_UPDATE_INTERVAL: int = 60  # minutes
    OCCUPANCY_THRESHOLD: float = 0.8
    
    # Integration Settings
    ENABLE_WEBHOOKS: bool = True
    WEBHOOK_TIMEOUT: int = 30
    WEBHOOK_RETRY_ATTEMPTS: int = 3
    
    # Cache Settings
    CACHE_TTL: int = 300  # 5 minutes
    CACHE_MAX_SIZE: int = 1000
    CACHE_BACKEND: str = "redis"  # redis or memory
    
    # Background Tasks
    ENABLE_BACKGROUND_TASKS: bool = True
    TASK_BROKER_URL: str = "redis://localhost:6379/1"
    TASK_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    API_PREFIX: str = "/api"
    API_TITLE: str = "Buffr Host API"
    API_DESCRIPTION: str = "Comprehensive hospitality management platform API"
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100
    
    # Validation
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @field_validator("ALLOWED_FILE_TYPES", mode="before")
    @classmethod
    def assemble_file_types(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v):
        if not v:
            raise ValueError("DATABASE_URL is required")
        return v
    
    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v):
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v):
        allowed = ["development", "staging", "production", "testing"]
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}")
        return v
    
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True
    }

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

# Global settings instance
settings = get_settings()

# Environment-specific configurations
class DevelopmentConfig(Settings):
    """Development environment configuration"""
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    DATABASE_ECHO: bool = True
    LOG_LEVEL: str = "DEBUG"
    CORS_ORIGINS: List[str] = ["*"]
    ENABLE_API_DOCS: bool = True

class StagingConfig(Settings):
    """Staging environment configuration"""
    DEBUG: bool = False
    ENVIRONMENT: str = "staging"
    LOG_LEVEL: str = "INFO"
    ENABLE_API_DOCS: bool = True

class ProductionConfig(Settings):
    """Production environment configuration"""
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    LOG_LEVEL: str = "WARNING"
    ENABLE_API_DOCS: bool = False
    CORS_ORIGINS: List[str] = ["https://buffr.ai", "https://host.buffr.ai"]

def get_config() -> Settings:
    """Get configuration based on environment"""
    env = os.getenv("ENVIRONMENT", "development")
    
    if env == "production":
        return ProductionConfig()
    elif env == "staging":
        return StagingConfig()
    else:
        return DevelopmentConfig()

# Export the appropriate configuration
config = get_config()