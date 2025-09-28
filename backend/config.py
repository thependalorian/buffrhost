"""
Configuration settings for Buffr Host platform.
"""
import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application settings
    APP_NAME: str = "Buffr Host API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Database configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://buffrhost:password@localhost:5432/buffrhost_dev")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "10"))
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", "20"))
    
    # Redis configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Authentication & Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Validate critical security settings
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._validate_security_settings()
    
    def _validate_security_settings(self):
        """Validate critical security settings."""
        if not self.SECRET_KEY or self.SECRET_KEY == "your-super-secret-key-change-this-in-production":
            if self.ENVIRONMENT == "production":
                raise ValueError("SECRET_KEY must be set in production environment")
            else:
                import secrets
                self.SECRET_KEY = secrets.token_urlsafe(32)
                print("WARNING: Using auto-generated SECRET_KEY for development")
        
        if self.ENVIRONMENT == "production" and self.DEBUG:
            raise ValueError("DEBUG must be False in production environment")
        
        if self.ENVIRONMENT == "production" and not self.SMTP_HOST:
            raise ValueError("SMTP configuration required in production environment")
    
    # External API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE_NUMBER: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    
    # Adumo Online Payment Integration
    ADUMO_MERCHANT_ID: str = os.getenv("ADUMO_MERCHANT_ID", "")
    ADUMO_APPLICATION_ID: str = os.getenv("ADUMO_APPLICATION_ID", "")
    ADUMO_JWT_SECRET: str = os.getenv("ADUMO_JWT_SECRET", "")
    ADUMO_TEST_MODE: bool = os.getenv("ADUMO_TEST_MODE", "true").lower() == "true"
    ADUMO_TEST_BASE_URL: str = os.getenv("ADUMO_TEST_BASE_URL", "https://staging-apiv3.adumoonline.com")
    ADUMO_PROD_BASE_URL: str = os.getenv("ADUMO_PROD_BASE_URL", "https://apiv3.adumoonline.com")
    ADUMO_WEBHOOK_BASE_URL: str = os.getenv("ADUMO_WEBHOOK_BASE_URL", "")
    ADUMO_SUCCESS_REDIRECT_URL: str = os.getenv("ADUMO_SUCCESS_REDIRECT_URL", "")
    ADUMO_FAILED_REDIRECT_URL: str = os.getenv("ADUMO_FAILED_REDIRECT_URL", "")
    
    # File upload configuration
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    UPLOAD_DIRECTORY: str = os.getenv("UPLOAD_DIRECTORY", "uploads")
    
    # CORS configuration
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    # Rate limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "1000"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))
    
    # Email configuration
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "noreply@mail.buffr.ai")
    
    # Supabase Storage configuration
    SUPABASE_STORAGE_BUCKET: str = os.getenv("SUPABASE_STORAGE_BUCKET", "buffr-host-files")
    SUPABASE_STORAGE_URL: str = os.getenv("SUPABASE_STORAGE_URL", "")
    SUPABASE_STORAGE_PUBLIC_URL: str = os.getenv("SUPABASE_STORAGE_PUBLIC_URL", "")
    
    # Monitoring & Logging
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Development settings
    SQL_ECHO: bool = os.getenv("SQL_ECHO", "false").lower() == "true"
    DETAILED_ERRORS: bool = os.getenv("DETAILED_ERRORS", "false").lower() == "true"
    
    # Production settings
    FORCE_HTTPS: bool = os.getenv("FORCE_HTTPS", "false").lower() == "true"
    TRUST_PROXY: bool = os.getenv("TRUST_PROXY", "false").lower() == "true"
    
    # Feature flags
    ENABLE_AI_FEATURES: bool = os.getenv("ENABLE_AI_FEATURES", "true").lower() == "true"
    ENABLE_REALTIME: bool = os.getenv("ENABLE_REALTIME", "true").lower() == "true"
    ENABLE_ANALYTICS: bool = os.getenv("ENABLE_ANALYTICS", "true").lower() == "true"
    ENABLE_MARKETING: bool = os.getenv("ENABLE_MARKETING", "true").lower() == "true"
    ENABLE_API_DOCS: bool = os.getenv("ENABLE_API_DOCS", "true").lower() == "true"
    
    # Business settings
    DEFAULT_TIMEZONE: str = os.getenv("DEFAULT_TIMEZONE", "UTC")
    DEFAULT_CURRENCY: str = os.getenv("DEFAULT_CURRENCY", "NAD")
    CURRENCY_SYMBOL: str = os.getenv("CURRENCY_SYMBOL", "N$")
    
    # Loyalty program settings (Namibian Dollar based)
    LOYALTY_POINTS_PER_DOLLAR: int = int(os.getenv("LOYALTY_POINTS_PER_DOLLAR", "1"))  # 1 point per N$1
    LOYALTY_POINT_VALUE: float = float(os.getenv("LOYALTY_POINT_VALUE", "0.01"))  # N$0.01 per point
    
    # Notification settings
    EMAIL_NOTIFICATIONS_ENABLED: bool = os.getenv("EMAIL_NOTIFICATIONS_ENABLED", "true").lower() == "true"
    SMS_NOTIFICATIONS_ENABLED: bool = os.getenv("SMS_NOTIFICATIONS_ENABLED", "true").lower() == "true"
    PUSH_NOTIFICATIONS_ENABLED: bool = os.getenv("PUSH_NOTIFICATIONS_ENABLED", "true").lower() == "true"
    
    # Cache settings
    CACHE_TTL_SHORT: int = int(os.getenv("CACHE_TTL_SHORT", "300"))  # 5 minutes
    CACHE_TTL_MEDIUM: int = int(os.getenv("CACHE_TTL_MEDIUM", "3600"))  # 1 hour
    CACHE_TTL_LONG: int = int(os.getenv("CACHE_TTL_LONG", "86400"))  # 24 hours
    
    # Security settings
    MIN_PASSWORD_LENGTH: int = int(os.getenv("MIN_PASSWORD_LENGTH", "8"))
    REQUIRE_SPECIAL_CHARS: bool = os.getenv("REQUIRE_SPECIAL_CHARS", "true").lower() == "true"
    REQUIRE_NUMBERS: bool = os.getenv("REQUIRE_NUMBERS", "true").lower() == "true"
    REQUIRE_UPPERCASE: bool = os.getenv("REQUIRE_UPPERCASE", "true").lower() == "true"
    
    # Session settings
    SESSION_TIMEOUT_MINUTES: int = int(os.getenv("SESSION_TIMEOUT_MINUTES", "480"))  # 8 hours
    MAX_LOGIN_ATTEMPTS: int = int(os.getenv("MAX_LOGIN_ATTEMPTS", "5"))
    LOCKOUT_DURATION_MINUTES: int = int(os.getenv("LOCKOUT_DURATION_MINUTES", "30"))
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()