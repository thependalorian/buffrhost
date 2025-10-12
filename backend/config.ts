/**
 * CONFIGURATION MANAGEMENT SYSTEM
 * Centralized configuration for Buffr Host application with environment variable support
 */

import { z } from 'zod';

// Environment validation schema
const EnvironmentSchema = z.enum(['development', 'staging', 'production', 'testing']);

// Configuration interface
export interface Config {
  // Application
  APP_NAME: string;
  APP_VERSION: string;
  DEBUG: boolean;
  ENVIRONMENT: string;
  
  // Security
  SECRET_KEY: string;
  ALGORITHM: string;
  ACCESS_TOKEN_EXPIRE_MINUTES: number;
  REFRESH_TOKEN_EXPIRE_DAYS: number;
  
  // Database
  DATABASE_URL: string;
  DATABASE_POOL_SIZE: number;
  DATABASE_MAX_OVERFLOW: number;
  DATABASE_ECHO: boolean;
  
  // Redis
  REDIS_URL: string;
  REDIS_PASSWORD?: string;
  REDIS_DB: number;
  
  // CORS
  CORS_ORIGINS: string[];
  CORS_ALLOW_CREDENTIALS: boolean;
  CORS_ALLOW_METHODS: string[];
  CORS_ALLOW_HEADERS: string[];
  
  // Email Configuration
  SMTP_SERVER: string;
  SMTP_PORT: number;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
  SMTP_USE_TLS: boolean;
  SMTP_USE_SSL: boolean;
  
  // Email Providers
  SENDGRID_API_KEY?: string;
  RESEND_API_KEY?: string;
  AWS_SES_ACCESS_KEY?: string;
  AWS_SES_SECRET_KEY?: string;
  AWS_SES_REGION: string;
  
  // AI Services
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  OPENAI_MAX_TOKENS: number;
  OPENAI_TEMPERATURE: number;
  
  // LangChain Configuration
  LANGCHAIN_API_KEY?: string;
  LANGCHAIN_PROJECT: string;
  LANGCHAIN_TRACING: boolean;
  
  // Payment Gateways
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  
  ADUMO_API_KEY: string;
  ADUMO_MERCHANT_ID: string;
  ADUMO_ENVIRONMENT: string;
  
  REALPAY_API_KEY: string;
  REALPAY_MERCHANT_ID: string;
  REALPAY_ENVIRONMENT: string;
  
  // BuffrPay Configuration
  BUFFR_PAY_API_KEY: string;
  BUFFR_PAY_MERCHANT_ID: string;
  BUFFR_PAY_WEBHOOK_SECRET: string;
  BUFFR_PAY_ENVIRONMENT: string;
  
  // File Storage
  UPLOAD_DIR: string;
  MAX_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  
  // AWS S3
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_S3_BUCKET?: string;
  AWS_S3_REGION: string;
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: number;
  RATE_LIMIT_WINDOW: number;
  RATE_LIMIT_STORAGE: string;
  
  // Logging
  LOG_LEVEL: string;
  LOG_FORMAT: string;
  LOG_FILE?: string;
  
  // Monitoring
  ENABLE_METRICS: boolean;
  METRICS_PORT: number;
  HEALTH_CHECK_INTERVAL: number;
  
  // Features
  ENABLE_AI_FEATURES: boolean;
  ENABLE_REALTIME: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_MARKETING: boolean;
  ENABLE_MULTI_TENANT: boolean;
  ENABLE_API_DOCS: boolean;
  
  // Multi-tenant Configuration
  DEFAULT_TENANT_TIER: string;
  TENANT_TRIAL_DAYS: number;
  MAX_TENANTS_PER_USER: number;
  
  // Onboarding
  ONBOARDING_EMAIL_TEMPLATES: boolean;
  ONBOARDING_AUTOMATION: boolean;
  ONBOARDING_AI_RECOMMENDATIONS: boolean;
  
  // Business Logic
  DEFAULT_CURRENCY: string;
  DEFAULT_TIMEZONE: string;
  DEFAULT_LANGUAGE: string;
  
  // Hotel Configuration
  HOTEL_CONFIGURATION_ENABLED: boolean;
  HOTEL_TYPES_CACHE_TTL: number;
  HOTEL_SERVICES_CACHE_TTL: number;
  
  // Booking Engine
  BOOKING_ADVANCE_DAYS: number;
  BOOKING_CANCELLATION_HOURS: number;
  BOOKING_MIN_STAY: number;
  BOOKING_MAX_STAY: number;
  
  // Revenue Management
  ENABLE_DYNAMIC_PRICING: boolean;
  PRICING_UPDATE_INTERVAL: number;
  OCCUPANCY_THRESHOLD: number;
  
  // Integration Settings
  ENABLE_WEBHOOKS: boolean;
  WEBHOOK_TIMEOUT: number;
  WEBHOOK_RETRY_ATTEMPTS: number;
  
  // Cache Settings
  CACHE_TTL: number;
  CACHE_MAX_SIZE: number;
  CACHE_BACKEND: string;
  
  // Background Tasks
  ENABLE_BACKGROUND_TASKS: boolean;
  TASK_BROKER_URL: string;
  TASK_RESULT_BACKEND: string;
  
  // API Configuration
  API_V1_STR: string;
  API_PREFIX: string;
  API_TITLE: string;
  API_DESCRIPTION: string;
  
  // Pagination
  DEFAULT_PAGE_SIZE: number;
  MAX_PAGE_SIZE: number;
}

// Configuration validation schema
const ConfigSchema = z.object({
  // Application
  APP_NAME: z.string().default('Buffr Host'),
  APP_VERSION: z.string().default('1.0.0'),
  DEBUG: z.boolean().default(false),
  ENVIRONMENT: EnvironmentSchema.default('development'),
  
  // Security
  SECRET_KEY: z.string().min(32, 'SECRET_KEY must be at least 32 characters long'),
  ALGORITHM: z.string().default('HS256'),
  ACCESS_TOKEN_EXPIRE_MINUTES: z.number().default(30),
  REFRESH_TOKEN_EXPIRE_DAYS: z.number().default(30),
  
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_POOL_SIZE: z.number().default(10),
  DATABASE_MAX_OVERFLOW: z.number().default(20),
  DATABASE_ECHO: z.boolean().default(false),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.number().default(0),
  
  // CORS
  CORS_ORIGINS: z.string().transform(val => 
    val ? val.split(',').map(origin => origin.trim()) : ['http://localhost:3000', 'http://localhost:8000']
  ).default('http://localhost:3000,http://localhost:8000'),
  CORS_ALLOW_CREDENTIALS: z.boolean().default(true),
  CORS_ALLOW_METHODS: z.string().transform(val => 
    val ? val.split(',').map(method => method.trim()) : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  ).default('GET,POST,PUT,DELETE,OPTIONS'),
  CORS_ALLOW_HEADERS: z.string().transform(val => 
    val ? val.split(',').map(header => header.trim()) : ['*']
  ).default('*'),
  
  // Email Configuration
  SMTP_SERVER: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.number().default(587),
  SMTP_USERNAME: z.string().default(''),
  SMTP_PASSWORD: z.string().default(''),
  SMTP_USE_TLS: z.boolean().default(true),
  SMTP_USE_SSL: z.boolean().default(false),
  
  // Email Providers
  SENDGRID_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  AWS_SES_ACCESS_KEY: z.string().optional(),
  AWS_SES_SECRET_KEY: z.string().optional(),
  AWS_SES_REGION: z.string().default('us-east-1'),
  
  // AI Services
  OPENAI_API_KEY: z.string().default(''),
  OPENAI_MODEL: z.string().default('gpt-4'),
  OPENAI_MAX_TOKENS: z.number().default(4000),
  OPENAI_TEMPERATURE: z.number().default(0.7),
  
  // LangChain Configuration
  LANGCHAIN_API_KEY: z.string().optional(),
  LANGCHAIN_PROJECT: z.string().default('buffr-host'),
  LANGCHAIN_TRACING: z.boolean().default(false),
  
  // Payment Gateways
  STRIPE_SECRET_KEY: z.string().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().default(''),
  
  ADUMO_API_KEY: z.string().default(''),
  ADUMO_MERCHANT_ID: z.string().default(''),
  ADUMO_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  
  REALPAY_API_KEY: z.string().default(''),
  REALPAY_MERCHANT_ID: z.string().default(''),
  REALPAY_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  
  // BuffrPay Configuration
  BUFFR_PAY_API_KEY: z.string().default(''),
  BUFFR_PAY_MERCHANT_ID: z.string().default(''),
  BUFFR_PAY_WEBHOOK_SECRET: z.string().default(''),
  BUFFR_PAY_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  
  // File Storage
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.number().default(50 * 1024 * 1024), // 50MB
  ALLOWED_FILE_TYPES: z.string().transform(val => 
    val ? val.split(',').map(type => type.trim()) : [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/json'
    ]
  ).default('image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,application/json'),
  
  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().default('us-east-1'),
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: z.number().default(100),
  RATE_LIMIT_WINDOW: z.number().default(60),
  RATE_LIMIT_STORAGE: z.enum(['redis', 'memory']).default('redis'),
  
  // Logging
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']).default('INFO'),
  LOG_FORMAT: z.string().default('%(asctime)s - %(name)s - %(levelname)s - %(message)s'),
  LOG_FILE: z.string().optional(),
  
  // Monitoring
  ENABLE_METRICS: z.boolean().default(true),
  METRICS_PORT: z.number().default(9090),
  HEALTH_CHECK_INTERVAL: z.number().default(30),
  
  // Features
  ENABLE_AI_FEATURES: z.boolean().default(true),
  ENABLE_REALTIME: z.boolean().default(true),
  ENABLE_ANALYTICS: z.boolean().default(true),
  ENABLE_MARKETING: z.boolean().default(true),
  ENABLE_MULTI_TENANT: z.boolean().default(true),
  ENABLE_API_DOCS: z.boolean().default(true),
  
  // Multi-tenant Configuration
  DEFAULT_TENANT_TIER: z.string().default('essential'),
  TENANT_TRIAL_DAYS: z.number().default(14),
  MAX_TENANTS_PER_USER: z.number().default(5),
  
  // Onboarding
  ONBOARDING_EMAIL_TEMPLATES: z.boolean().default(true),
  ONBOARDING_AUTOMATION: z.boolean().default(true),
  ONBOARDING_AI_RECOMMENDATIONS: z.boolean().default(true),
  
  // Business Logic
  DEFAULT_CURRENCY: z.string().default('NAD'),
  DEFAULT_TIMEZONE: z.string().default('UTC'),
  DEFAULT_LANGUAGE: z.string().default('en'),
  
  // Hotel Configuration
  HOTEL_CONFIGURATION_ENABLED: z.boolean().default(true),
  HOTEL_TYPES_CACHE_TTL: z.number().default(3600),
  HOTEL_SERVICES_CACHE_TTL: z.number().default(3600),
  
  // Booking Engine
  BOOKING_ADVANCE_DAYS: z.number().default(365),
  BOOKING_CANCELLATION_HOURS: z.number().default(24),
  BOOKING_MIN_STAY: z.number().default(1),
  BOOKING_MAX_STAY: z.number().default(30),
  
  // Revenue Management
  ENABLE_DYNAMIC_PRICING: z.boolean().default(true),
  PRICING_UPDATE_INTERVAL: z.number().default(60),
  OCCUPANCY_THRESHOLD: z.number().default(0.8),
  
  // Integration Settings
  ENABLE_WEBHOOKS: z.boolean().default(true),
  WEBHOOK_TIMEOUT: z.number().default(30),
  WEBHOOK_RETRY_ATTEMPTS: z.number().default(3),
  
  // Cache Settings
  CACHE_TTL: z.number().default(300),
  CACHE_MAX_SIZE: z.number().default(1000),
  CACHE_BACKEND: z.enum(['redis', 'memory']).default('redis'),
  
  // Background Tasks
  ENABLE_BACKGROUND_TASKS: z.boolean().default(true),
  TASK_BROKER_URL: z.string().default('redis://localhost:6379/1'),
  TASK_RESULT_BACKEND: z.string().default('redis://localhost:6379/2'),
  
  // API Configuration
  API_V1_STR: z.string().default('/api/v1'),
  API_PREFIX: z.string().default('/api'),
  API_TITLE: z.string().default('Buffr Host API'),
  API_DESCRIPTION: z.string().default('Comprehensive hospitality management platform API'),
  
  // Pagination
  DEFAULT_PAGE_SIZE: z.number().default(20),
  MAX_PAGE_SIZE: z.number().default(100),
});

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private cache: Map<string, any> = new Map();

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    try {
      // Load environment variables
      const envVars = this.loadEnvironmentVariables();
      
      // Validate configuration
      const validatedConfig = ConfigSchema.parse(envVars);
      
      return validatedConfig;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw new Error('Invalid configuration');
    }
  }

  private loadEnvironmentVariables(): Record<string, any> {
    const envVars: Record<string, any> = {};
    
    // Load from process.env
    for (const [key, value] of Object.entries(process.env)) {
      if (value !== undefined) {
        // Convert string values to appropriate types
        envVars[key] = this.convertValue(value);
      }
    }
    
    return envVars;
  }

  private convertValue(value: string): any {
    // Convert string values to appropriate types
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (value === 'undefined') return undefined;
    
    // Try to convert to number
    if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
      return Number(value);
    }
    
    return value;
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  public getAll(): Config {
    return { ...this.config };
  }

  public getCached<T>(key: string, factory: () => T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const value = factory();
    this.cache.set(key, value);
    return value;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public reload(): void {
    this.clearCache();
    this.config = this.loadConfig();
  }

  public validate(): boolean {
    try {
      ConfigSchema.parse(this.config);
      return true;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return false;
    }
  }

  public getEnvironment(): string {
    return this.config.ENVIRONMENT;
  }

  public isDevelopment(): boolean {
    return this.config.ENVIRONMENT === 'development';
  }

  public isProduction(): boolean {
    return this.config.ENVIRONMENT === 'production';
  }

  public isStaging(): boolean {
    return this.config.ENVIRONMENT === 'staging';
  }

  public isTesting(): boolean {
    return this.config.ENVIRONMENT === 'testing';
  }

  public getDatabaseConfig(): {
    url: string;
    poolSize: number;
    maxOverflow: number;
    echo: boolean;
  } {
    return {
      url: this.config.DATABASE_URL,
      poolSize: this.config.DATABASE_POOL_SIZE,
      maxOverflow: this.config.DATABASE_MAX_OVERFLOW,
      echo: this.config.DATABASE_ECHO,
    };
  }

  public getRedisConfig(): {
    url: string;
    password?: string;
    db: number;
  } {
    return {
      url: this.config.REDIS_URL,
      password: this.config.REDIS_PASSWORD,
      db: this.config.REDIS_DB,
    };
  }

  public getCorsConfig(): {
    origins: string[];
    allowCredentials: boolean;
    methods: string[];
    headers: string[];
  } {
    return {
      origins: this.config.CORS_ORIGINS,
      allowCredentials: this.config.CORS_ALLOW_CREDENTIALS,
      methods: this.config.CORS_ALLOW_METHODS,
      headers: this.config.CORS_ALLOW_HEADERS,
    };
  }

  public getEmailConfig(): {
    smtp: {
      server: string;
      port: number;
      username: string;
      password: string;
      useTLS: boolean;
      useSSL: boolean;
    };
    providers: {
      sendgrid?: string;
      resend?: string;
      awsSes?: {
        accessKey: string;
        secretKey: string;
        region: string;
      };
    };
  } {
    return {
      smtp: {
        server: this.config.SMTP_SERVER,
        port: this.config.SMTP_PORT,
        username: this.config.SMTP_USERNAME,
        password: this.config.SMTP_PASSWORD,
        useTLS: this.config.SMTP_USE_TLS,
        useSSL: this.config.SMTP_USE_SSL,
      },
      providers: {
        sendgrid: this.config.SENDGRID_API_KEY,
        resend: this.config.RESEND_API_KEY,
        awsSes: this.config.AWS_SES_ACCESS_KEY && this.config.AWS_SES_SECRET_KEY ? {
          accessKey: this.config.AWS_SES_ACCESS_KEY,
          secretKey: this.config.AWS_SES_SECRET_KEY,
          region: this.config.AWS_SES_REGION,
        } : undefined,
      },
    };
  }

  public getAIConfig(): {
    openai: {
      apiKey: string;
      model: string;
      maxTokens: number;
      temperature: number;
    };
    langchain: {
      apiKey?: string;
      project: string;
      tracing: boolean;
    };
  } {
    return {
      openai: {
        apiKey: this.config.OPENAI_API_KEY,
        model: this.config.OPENAI_MODEL,
        maxTokens: this.config.OPENAI_MAX_TOKENS,
        temperature: this.config.OPENAI_TEMPERATURE,
      },
      langchain: {
        apiKey: this.config.LANGCHAIN_API_KEY,
        project: this.config.LANGCHAIN_PROJECT,
        tracing: this.config.LANGCHAIN_TRACING,
      },
    };
  }

  public getPaymentConfig(): {
    stripe: {
      secretKey: string;
      publishableKey: string;
      webhookSecret: string;
    };
    adumo: {
      apiKey: string;
      merchantId: string;
      environment: string;
    };
    realpay: {
      apiKey: string;
      merchantId: string;
      environment: string;
    };
    buffrPay: {
      apiKey: string;
      merchantId: string;
      webhookSecret: string;
      environment: string;
    };
  } {
    return {
      stripe: {
        secretKey: this.config.STRIPE_SECRET_KEY,
        publishableKey: this.config.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: this.config.STRIPE_WEBHOOK_SECRET,
      },
      adumo: {
        apiKey: this.config.ADUMO_API_KEY,
        merchantId: this.config.ADUMO_MERCHANT_ID,
        environment: this.config.ADUMO_ENVIRONMENT,
      },
      realpay: {
        apiKey: this.config.REALPAY_API_KEY,
        merchantId: this.config.REALPAY_MERCHANT_ID,
        environment: this.config.REALPAY_ENVIRONMENT,
      },
      buffrPay: {
        apiKey: this.config.BUFFR_PAY_API_KEY,
        merchantId: this.config.BUFFR_PAY_MERCHANT_ID,
        webhookSecret: this.config.BUFFR_PAY_WEBHOOK_SECRET,
        environment: this.config.BUFFR_PAY_ENVIRONMENT,
      },
    };
  }

  public getFileStorageConfig(): {
    uploadDir: string;
    maxFileSize: number;
    allowedTypes: string[];
    aws?: {
      accessKeyId: string;
      secretAccessKey: string;
      bucket: string;
      region: string;
    };
  } {
    return {
      uploadDir: this.config.UPLOAD_DIR,
      maxFileSize: this.config.MAX_FILE_SIZE,
      allowedTypes: this.config.ALLOWED_FILE_TYPES,
      aws: this.config.AWS_ACCESS_KEY_ID && this.config.AWS_SECRET_ACCESS_KEY && this.config.AWS_S3_BUCKET ? {
        accessKeyId: this.config.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.config.AWS_SECRET_ACCESS_KEY,
        bucket: this.config.AWS_S3_BUCKET,
        region: this.config.AWS_S3_REGION,
      } : undefined,
    };
  }

  public getRateLimitConfig(): {
    requests: number;
    window: number;
    storage: string;
  } {
    return {
      requests: this.config.RATE_LIMIT_REQUESTS,
      window: this.config.RATE_LIMIT_WINDOW,
      storage: this.config.RATE_LIMIT_STORAGE,
    };
  }

  public getLoggingConfig(): {
    level: string;
    format: string;
    file?: string;
  } {
    return {
      level: this.config.LOG_LEVEL,
      format: this.config.LOG_FORMAT,
      file: this.config.LOG_FILE,
    };
  }

  public getMonitoringConfig(): {
    enableMetrics: boolean;
    metricsPort: number;
    healthCheckInterval: number;
  } {
    return {
      enableMetrics: this.config.ENABLE_METRICS,
      metricsPort: this.config.METRICS_PORT,
      healthCheckInterval: this.config.HEALTH_CHECK_INTERVAL,
    };
  }

  public getFeatureFlags(): {
    ai: boolean;
    realtime: boolean;
    analytics: boolean;
    marketing: boolean;
    multiTenant: boolean;
    apiDocs: boolean;
  } {
    return {
      ai: this.config.ENABLE_AI_FEATURES,
      realtime: this.config.ENABLE_REALTIME,
      analytics: this.config.ENABLE_ANALYTICS,
      marketing: this.config.ENABLE_MARKETING,
      multiTenant: this.config.ENABLE_MULTI_TENANT,
      apiDocs: this.config.ENABLE_API_DOCS,
    };
  }

  public getBusinessConfig(): {
    currency: string;
    timezone: string;
    language: string;
    tenantTier: string;
    trialDays: number;
    maxTenantsPerUser: number;
  } {
    return {
      currency: this.config.DEFAULT_CURRENCY,
      timezone: this.config.DEFAULT_TIMEZONE,
      language: this.config.DEFAULT_LANGUAGE,
      tenantTier: this.config.DEFAULT_TENANT_TIER,
      trialDays: this.config.TENANT_TRIAL_DAYS,
      maxTenantsPerUser: this.config.MAX_TENANTS_PER_USER,
    };
  }

  public getBookingConfig(): {
    advanceDays: number;
    cancellationHours: number;
    minStay: number;
    maxStay: number;
  } {
    return {
      advanceDays: this.config.BOOKING_ADVANCE_DAYS,
      cancellationHours: this.config.BOOKING_CANCELLATION_HOURS,
      minStay: this.config.BOOKING_MIN_STAY,
      maxStay: this.config.BOOKING_MAX_STAY,
    };
  }

  public getRevenueConfig(): {
    enableDynamicPricing: boolean;
    updateInterval: number;
    occupancyThreshold: number;
  } {
    return {
      enableDynamicPricing: this.config.ENABLE_DYNAMIC_PRICING,
      updateInterval: this.config.PRICING_UPDATE_INTERVAL,
      occupancyThreshold: this.config.OCCUPANCY_THRESHOLD,
    };
  }

  public getCacheConfig(): {
    ttl: number;
    maxSize: number;
    backend: string;
  } {
    return {
      ttl: this.config.CACHE_TTL,
      maxSize: this.config.CACHE_MAX_SIZE,
      backend: this.config.CACHE_BACKEND,
    };
  }

  public getAPIConfig(): {
    v1Str: string;
    prefix: string;
    title: string;
    description: string;
    defaultPageSize: number;
    maxPageSize: number;
  } {
    return {
      v1Str: this.config.API_V1_STR,
      prefix: this.config.API_PREFIX,
      title: this.config.API_TITLE,
      description: this.config.API_DESCRIPTION,
      defaultPageSize: this.config.DEFAULT_PAGE_SIZE,
      maxPageSize: this.config.MAX_PAGE_SIZE,
    };
  }
}

// Environment-specific configurations
export class DevelopmentConfig extends ConfigManager {
  constructor() {
    super();
    // Override with development-specific values
    this.config.DEBUG = true;
    this.config.ENVIRONMENT = 'development';
    this.config.DATABASE_ECHO = true;
    this.config.LOG_LEVEL = 'DEBUG';
    this.config.CORS_ORIGINS = ['*'];
    this.config.ENABLE_API_DOCS = true;
  }
}

export class StagingConfig extends ConfigManager {
  constructor() {
    super();
    // Override with staging-specific values
    this.config.DEBUG = false;
    this.config.ENVIRONMENT = 'staging';
    this.config.LOG_LEVEL = 'INFO';
    this.config.ENABLE_API_DOCS = true;
  }
}

export class ProductionConfig extends ConfigManager {
  constructor() {
    super();
    // Override with production-specific values
    this.config.DEBUG = false;
    this.config.ENVIRONMENT = 'production';
    this.config.LOG_LEVEL = 'WARNING';
    this.config.ENABLE_API_DOCS = false;
    this.config.CORS_ORIGINS = ['https://buffr.ai', 'https://host.buffr.ai'];
  }
}

// Factory function to get configuration based on environment
export function getConfig(): ConfigManager {
  const environment = process.env.ENVIRONMENT || 'development';
  
  switch (environment) {
    case 'production':
      return new ProductionConfig();
    case 'staging':
      return new StagingConfig();
    case 'testing':
      return new DevelopmentConfig(); // Use development config for testing
    default:
      return new DevelopmentConfig();
  }
}

// Global configuration instance
export const config = getConfig();

// Export types
export type { Config };
export { ConfigSchema, EnvironmentSchema };