"""
Development configuration settings for Buffr Host platform.

This file provides development-specific overrides for the main configuration.
Use this for local development and testing environments.
"""

import os
from config import Settings

class DevelopmentConfig(Settings):
    """Development-specific configuration overrides."""

    # Development environment
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Development database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./dev.db")

    # Development CORS - allow all origins for development
    ALLOWED_ORIGINS: str = "*"

    # Development SMTP settings (using a local mail server or service)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "localhost")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "1025"))  # MailHog or similar
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = "dev@buffr.local"

    # Development API keys (test/sandbox keys)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "sk-test-development-key")

    # Stripe test keys for development
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_...")

    # Adumo test configuration
    ADUMO_TEST_MODE: bool = True
    ADUMO_MERCHANT_ID: str = os.getenv("ADUMO_MERCHANT_ID", "test_merchant")
    ADUMO_APPLICATION_ID: str = os.getenv("ADUMO_APPLICATION_ID", "test_app")
    ADUMO_JWT_SECRET: str = os.getenv("ADUMO_JWT_SECRET", "test_jwt_secret")

    # Development logging
    LOG_LEVEL: str = "DEBUG"
    SQL_ECHO: bool = True  # Show SQL queries in development

    # Enable detailed errors in development
    DETAILED_ERRORS: bool = True

    # Development feature flags - enable all features for testing
    ENABLE_AI_FEATURES: bool = True
    ENABLE_REALTIME: bool = True
    ENABLE_ANALYTICS: bool = True
    ENABLE_MARKETING: bool = True
    ENABLE_API_DOCS: bool = True

    # Development security settings - relaxed for testing
    MIN_PASSWORD_LENGTH: int = 6  # Shorter passwords for testing
    REQUIRE_SPECIAL_CHARS: bool = False
    REQUIRE_NUMBERS: bool = False
    REQUIRE_UPPERCASE: bool = False

    # Development session settings - longer timeout for development
    SESSION_TIMEOUT_MINUTES: int = 1440  # 24 hours for development

    # Disable rate limiting in development
    RATE_LIMIT_REQUESTS: int = 10000
    RATE_LIMIT_WINDOW: int = 3600

    # Development cache settings - shorter TTL for immediate feedback
    CACHE_TTL_SHORT: int = 30  # 30 seconds
    CACHE_TTL_MEDIUM: int = 300  # 5 minutes
    CACHE_TTL_LONG: int = 3600  # 1 hour

    # Development file upload settings
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB for development

    class Config:
        env_file = ".env.dev"
        case_sensitive = True


# Create development settings instance
dev_settings = DevelopmentConfig()