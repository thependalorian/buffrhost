/**
 * DEVELOPMENT CONFIGURATION
 * Development-specific configuration overrides for Buffr Host platform
 */

import { ConfigManager } from './config';

export class DevelopmentConfig extends ConfigManager {
  constructor() {
    super();
    this.applyDevelopmentOverrides();
  }

  private applyDevelopmentOverrides(): void {
    // Development environment
    this.config.DEBUG = true;
    this.config.ENVIRONMENT = 'development';

    // Development database
    this.config.DATABASE_URL = process.env.DATABASE_URL || 'sqlite:///./dev.db';

    // Development CORS - allow all origins for development
    this.config.CORS_ORIGINS = ['*'];

    // Development SMTP settings (using a local mail server or service)
    this.config.SMTP_SERVER = process.env.SMTP_HOST || 'localhost';
    this.config.SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025'); // MailHog or similar
    this.config.SMTP_USERNAME = process.env.SMTP_USERNAME || '';
    this.config.SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
    this.config.SMTP_FROM_EMAIL = 'dev@buffr.local';

    // Development API keys (test/sandbox keys)
    this.config.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-test-development-key';

    // Stripe test keys for development
    this.config.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_...';
    this.config.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...';

    // Adumo test configuration
    this.config.ADUMO_TEST_MODE = true;
    this.config.ADUMO_MERCHANT_ID = process.env.ADUMO_MERCHANT_ID || 'test_merchant';
    this.config.ADUMO_APPLICATION_ID = process.env.ADUMO_APPLICATION_ID || 'test_app';
    this.config.ADUMO_JWT_SECRET = process.env.ADUMO_JWT_SECRET || 'test_jwt_secret';

    // Development logging
    this.config.LOG_LEVEL = 'DEBUG';
    this.config.SQL_ECHO = true; // Show SQL queries in development

    // Enable detailed errors in development
    this.config.DETAILED_ERRORS = true;

    // Development feature flags - enable all features for testing
    this.config.ENABLE_AI_FEATURES = true;
    this.config.ENABLE_REALTIME = true;
    this.config.ENABLE_ANALYTICS = true;
    this.config.ENABLE_MARKETING = true;
    this.config.ENABLE_API_DOCS = true;

    // Development security settings - relaxed for testing
    this.config.MIN_PASSWORD_LENGTH = 6; // Shorter passwords for testing
    this.config.REQUIRE_SPECIAL_CHARS = false;
    this.config.REQUIRE_NUMBERS = false;
    this.config.REQUIRE_UPPERCASE = false;

    // Development session settings - longer timeout for development
    this.config.SESSION_TIMEOUT_MINUTES = 1440; // 24 hours for development

    // Disable rate limiting in development
    this.config.RATE_LIMIT_REQUESTS = 10000;
    this.config.RATE_LIMIT_WINDOW = 3600;

    // Development cache settings - shorter TTL for immediate feedback
    this.config.CACHE_TTL_SHORT = 30; // 30 seconds
    this.config.CACHE_TTL_MEDIUM = 300; // 5 minutes
    this.config.CACHE_TTL_LONG = 3600; // 1 hour

    // Development file upload settings
    this.config.MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for development
  }

  // Development-specific methods
  public getDevelopmentFeatures(): {
    detailedErrors: boolean;
    sqlEcho: boolean;
    minPasswordLength: number;
    sessionTimeoutMinutes: number;
    cacheTTL: {
      short: number;
      medium: number;
      long: number;
    };
  } {
    return {
      detailedErrors: this.config.DETAILED_ERRORS || false,
      sqlEcho: this.config.SQL_ECHO || false,
      minPasswordLength: this.config.MIN_PASSWORD_LENGTH || 6,
      sessionTimeoutMinutes: this.config.SESSION_TIMEOUT_MINUTES || 1440,
      cacheTTL: {
        short: this.config.CACHE_TTL_SHORT || 30,
        medium: this.config.CACHE_TTL_MEDIUM || 300,
        long: this.config.CACHE_TTL_LONG || 3600,
      },
    };
  }

  public getTestCredentials(): {
    stripe: {
      secretKey: string;
      publishableKey: string;
    };
    adumo: {
      merchantId: string;
      applicationId: string;
      jwtSecret: string;
      testMode: boolean;
    };
  } {
    return {
      stripe: {
        secretKey: this.config.STRIPE_SECRET_KEY,
        publishableKey: this.config.STRIPE_PUBLISHABLE_KEY,
      },
      adumo: {
        merchantId: this.config.ADUMO_MERCHANT_ID,
        applicationId: this.config.ADUMO_APPLICATION_ID || 'test_app',
        jwtSecret: this.config.ADUMO_JWT_SECRET || 'test_jwt_secret',
        testMode: this.config.ADUMO_TEST_MODE || true,
      },
    };
  }

  public getDevelopmentSMTP(): {
    server: string;
    port: number;
    username: string;
    password: string;
    fromEmail: string;
  } {
    return {
      server: this.config.SMTP_SERVER,
      port: this.config.SMTP_PORT,
      username: this.config.SMTP_USERNAME,
      password: this.config.SMTP_PASSWORD,
      fromEmail: this.config.SMTP_FROM_EMAIL || 'dev@buffr.local',
    };
  }

  public isDevelopmentMode(): boolean {
    return this.config.ENVIRONMENT === 'development';
  }

  public shouldShowDetailedErrors(): boolean {
    return this.config.DETAILED_ERRORS || false;
  }

  public shouldEchoSQL(): boolean {
    return this.config.SQL_ECHO || false;
  }

  public getRelaxedSecuritySettings(): {
    minPasswordLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
  } {
    return {
      minPasswordLength: this.config.MIN_PASSWORD_LENGTH || 6,
      requireSpecialChars: this.config.REQUIRE_SPECIAL_CHARS || false,
      requireNumbers: this.config.REQUIRE_NUMBERS || false,
      requireUppercase: this.config.REQUIRE_UPPERCASE || false,
    };
  }

  public getDevelopmentRateLimits(): {
    requests: number;
    window: number;
  } {
    return {
      requests: this.config.RATE_LIMIT_REQUESTS || 10000,
      window: this.config.RATE_LIMIT_WINDOW || 3600,
    };
  }
}

// Create development settings instance
export const devConfig = new DevelopmentConfig();

// Export the development configuration
export default devConfig;