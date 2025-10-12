/**
 * Configuration Management
 * Centralized configuration for Buffr Host application
 * Converted from Python config.py to TypeScript
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration schema validation
const ConfigSchema = z.object({
  // Application
  APP_NAME: z.string().default('Buffr Host'),
  APP_VERSION: z.string().default('1.0.0'),
  DEBUG: z.boolean().default(false),
  ENVIRONMENT: z.enum(['development', 'staging', 'production', 'testing']).default('development'),
  
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
  
  // AWS S3 (if using S3 for file storage)
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_REGION: z.string().default('us-east-1'),
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS: z.number().default(100),
  RATE_LIMIT_WINDOW: z.number().default(60), // seconds
  RATE_LIMIT_STORAGE: z.enum(['redis', 'memory']).default('redis'),
  
  // Logging
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
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
  PRICING_UPDATE_INTERVAL: z.number().default(60), // minutes
  OCCUPANCY_THRESHOLD: z.number().default(0.8),
  
  // Integration Settings
  ENABLE_WEBHOOKS: z.boolean().default(true),
  WEBHOOK_TIMEOUT: z.number().default(30),
  WEBHOOK_RETRY_ATTEMPTS: z.number().default(3),
  
  // Cache Settings
  CACHE_TTL: z.number().default(300), // 5 minutes
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

export type Config = z.infer<typeof ConfigSchema>;

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

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
      const rawConfig = {
        // Application
        APP_NAME: process.env.APP_NAME,
        APP_VERSION: process.env.APP_VERSION,
        DEBUG: process.env.DEBUG === 'true',
        ENVIRONMENT: process.env.ENVIRONMENT,
        
        // Security
        SECRET_KEY: process.env.SECRET_KEY,
        ALGORITHM: process.env.ALGORITHM,
        ACCESS_TOKEN_EXPIRE_MINUTES: process.env.ACCESS_TOKEN_EXPIRE_MINUTES ? parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) : undefined,
        REFRESH_TOKEN_EXPIRE_DAYS: process.env.REFRESH_TOKEN_EXPIRE_DAYS ? parseInt(process.env.REFRESH_TOKEN_EXPIRE_DAYS) : undefined,
        
        // Database
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_POOL_SIZE: process.env.DATABASE_POOL_SIZE ? parseInt(process.env.DATABASE_POOL_SIZE) : undefined,
        DATABASE_MAX_OVERFLOW: process.env.DATABASE_MAX_OVERFLOW ? parseInt(process.env.DATABASE_MAX_OVERFLOW) : undefined,
        DATABASE_ECHO: process.env.DATABASE_ECHO === 'true',
        
        // Redis
        REDIS_URL: process.env.REDIS_URL,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD,
        REDIS_DB: process.env.REDIS_DB ? parseInt(process.env.REDIS_DB) : undefined,
        
        // CORS
        CORS_ORIGINS: process.env.CORS_ORIGINS,
        CORS_ALLOW_CREDENTIALS: process.env.CORS_ALLOW_CREDENTIALS === 'true',
        CORS_ALLOW_METHODS: process.env.CORS_ALLOW_METHODS,
        CORS_ALLOW_HEADERS: process.env.CORS_ALLOW_HEADERS,
        
        // Email Configuration
        SMTP_SERVER: process.env.SMTP_SERVER,
        SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
        SMTP_USERNAME: process.env.SMTP_USERNAME,
        SMTP_PASSWORD: process.env.SMTP_PASSWORD,
        SMTP_USE_TLS: process.env.SMTP_USE_TLS === 'true',
        SMTP_USE_SSL: process.env.SMTP_USE_SSL === 'true',
        
        // Email Providers
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        AWS_SES_ACCESS_KEY: process.env.AWS_SES_ACCESS_KEY,
        AWS_SES_SECRET_KEY: process.env.AWS_SES_SECRET_KEY,
        AWS_SES_REGION: process.env.AWS_SES_REGION,
        
        // AI Services
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        OPENAI_MODEL: process.env.OPENAI_MODEL,
        OPENAI_MAX_TOKENS: process.env.OPENAI_MAX_TOKENS ? parseInt(process.env.OPENAI_MAX_TOKENS) : undefined,
        OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : undefined,
        
        // LangChain Configuration
        LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY,
        LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT,
        LANGCHAIN_TRACING: process.env.LANGCHAIN_TRACING === 'true',
        
        // Payment Gateways
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
        
        ADUMO_API_KEY: process.env.ADUMO_API_KEY,
        ADUMO_MERCHANT_ID: process.env.ADUMO_MERCHANT_ID,
        ADUMO_ENVIRONMENT: process.env.ADUMO_ENVIRONMENT,
        
        REALPAY_API_KEY: process.env.REALPAY_API_KEY,
        REALPAY_MERCHANT_ID: process.env.REALPAY_MERCHANT_ID,
        REALPAY_ENVIRONMENT: process.env.REALPAY_ENVIRONMENT,
        
        // BuffrPay Configuration
        BUFFR_PAY_API_KEY: process.env.BUFFR_PAY_API_KEY,
        BUFFR_PAY_MERCHANT_ID: process.env.BUFFR_PAY_MERCHANT_ID,
        BUFFR_PAY_WEBHOOK_SECRET: process.env.BUFFR_PAY_WEBHOOK_SECRET,
        BUFFR_PAY_ENVIRONMENT: process.env.BUFFR_PAY_ENVIRONMENT,
        
        // File Storage
        UPLOAD_DIR: process.env.UPLOAD_DIR,
        MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : undefined,
        ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES,
        
        // AWS S3
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        AWS_S3_REGION: process.env.AWS_S3_REGION,
        
        // Rate Limiting
        RATE_LIMIT_REQUESTS: process.env.RATE_LIMIT_REQUESTS ? parseInt(process.env.RATE_LIMIT_REQUESTS) : undefined,
        RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW ? parseInt(process.env.RATE_LIMIT_WINDOW) : undefined,
        RATE_LIMIT_STORAGE: process.env.RATE_LIMIT_STORAGE,
        
        // Logging
        LOG_LEVEL: process.env.LOG_LEVEL,
        LOG_FORMAT: process.env.LOG_FORMAT,
        LOG_FILE: process.env.LOG_FILE,
        
        // Monitoring
        ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
        METRICS_PORT: process.env.METRICS_PORT ? parseInt(process.env.METRICS_PORT) : undefined,
        HEALTH_CHECK_INTERVAL: process.env.HEALTH_CHECK_INTERVAL ? parseInt(process.env.HEALTH_CHECK_INTERVAL) : undefined,
        
        // Features
        ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === 'true',
        ENABLE_REALTIME: process.env.ENABLE_REALTIME === 'true',
        ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
        ENABLE_MARKETING: process.env.ENABLE_MARKETING === 'true',
        ENABLE_MULTI_TENANT: process.env.ENABLE_MULTI_TENANT === 'true',
        ENABLE_API_DOCS: process.env.ENABLE_API_DOCS === 'true',
        
        // Multi-tenant Configuration
        DEFAULT_TENANT_TIER: process.env.DEFAULT_TENANT_TIER,
        TENANT_TRIAL_DAYS: process.env.TENANT_TRIAL_DAYS ? parseInt(process.env.TENANT_TRIAL_DAYS) : undefined,
        MAX_TENANTS_PER_USER: process.env.MAX_TENANTS_PER_USER ? parseInt(process.env.MAX_TENANTS_PER_USER) : undefined,
        
        // Onboarding
        ONBOARDING_EMAIL_TEMPLATES: process.env.ONBOARDING_EMAIL_TEMPLATES === 'true',
        ONBOARDING_AUTOMATION: process.env.ONBOARDING_AUTOMATION === 'true',
        ONBOARDING_AI_RECOMMENDATIONS: process.env.ONBOARDING_AI_RECOMMENDATIONS === 'true',
        
        // Business Logic
        DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY,
        DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE,
        DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
        
        // Hotel Configuration
        HOTEL_CONFIGURATION_ENABLED: process.env.HOTEL_CONFIGURATION_ENABLED === 'true',
        HOTEL_TYPES_CACHE_TTL: process.env.HOTEL_TYPES_CACHE_TTL ? parseInt(process.env.HOTEL_TYPES_CACHE_TTL) : undefined,
        HOTEL_SERVICES_CACHE_TTL: process.env.HOTEL_SERVICES_CACHE_TTL ? parseInt(process.env.HOTEL_SERVICES_CACHE_TTL) : undefined,
        
        // Booking Engine
        BOOKING_ADVANCE_DAYS: process.env.BOOKING_ADVANCE_DAYS ? parseInt(process.env.BOOKING_ADVANCE_DAYS) : undefined,
        BOOKING_CANCELLATION_HOURS: process.env.BOOKING_CANCELLATION_HOURS ? parseInt(process.env.BOOKING_CANCELLATION_HOURS) : undefined,
        BOOKING_MIN_STAY: process.env.BOOKING_MIN_STAY ? parseInt(process.env.BOOKING_MIN_STAY) : undefined,
        BOOKING_MAX_STAY: process.env.BOOKING_MAX_STAY ? parseInt(process.env.BOOKING_MAX_STAY) : undefined,
        
        // Revenue Management
        ENABLE_DYNAMIC_PRICING: process.env.ENABLE_DYNAMIC_PRICING === 'true',
        PRICING_UPDATE_INTERVAL: process.env.PRICING_UPDATE_INTERVAL ? parseInt(process.env.PRICING_UPDATE_INTERVAL) : undefined,
        OCCUPANCY_THRESHOLD: process.env.OCCUPANCY_THRESHOLD ? parseFloat(process.env.OCCUPANCY_THRESHOLD) : undefined,
        
        // Integration Settings
        ENABLE_WEBHOOKS: process.env.ENABLE_WEBHOOKS === 'true',
        WEBHOOK_TIMEOUT: process.env.WEBHOOK_TIMEOUT ? parseInt(process.env.WEBHOOK_TIMEOUT) : undefined,
        WEBHOOK_RETRY_ATTEMPTS: process.env.WEBHOOK_RETRY_ATTEMPTS ? parseInt(process.env.WEBHOOK_RETRY_ATTEMPTS) : undefined,
        
        // Cache Settings
        CACHE_TTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : undefined,
        CACHE_MAX_SIZE: process.env.CACHE_MAX_SIZE ? parseInt(process.env.CACHE_MAX_SIZE) : undefined,
        CACHE_BACKEND: process.env.CACHE_BACKEND,
        
        // Background Tasks
        ENABLE_BACKGROUND_TASKS: process.env.ENABLE_BACKGROUND_TASKS === 'true',
        TASK_BROKER_URL: process.env.TASK_BROKER_URL,
        TASK_RESULT_BACKEND: process.env.TASK_RESULT_BACKEND,
        
        // API Configuration
        API_V1_STR: process.env.API_V1_STR,
        API_PREFIX: process.env.API_PREFIX,
        API_TITLE: process.env.API_TITLE,
        API_DESCRIPTION: process.env.API_DESCRIPTION,
        
        // Pagination
        DEFAULT_PAGE_SIZE: process.env.DEFAULT_PAGE_SIZE ? parseInt(process.env.DEFAULT_PAGE_SIZE) : undefined,
        MAX_PAGE_SIZE: process.env.MAX_PAGE_SIZE ? parseInt(process.env.MAX_PAGE_SIZE) : undefined,
      };

      return ConfigSchema.parse(rawConfig);
    } catch (error) {
      console.error('Configuration validation failed:', error);
      throw new Error(`Invalid configuration: ${error}`);
    }
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  public getAll(): Config {
    return { ...this.config };
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
}

// Environment-specific configurations
export class DevelopmentConfig extends ConfigManager {
  constructor() {
    super();
    this.config = {
      ...this.config,
      DEBUG: true,
      ENVIRONMENT: 'development',
      DATABASE_ECHO: true,
      LOG_LEVEL: 'DEBUG',
      CORS_ORIGINS: ['*'],
      ENABLE_API_DOCS: true,
    };
  }
}

export class StagingConfig extends ConfigManager {
  constructor() {
    super();
    this.config = {
      ...this.config,
      DEBUG: false,
      ENVIRONMENT: 'staging',
      LOG_LEVEL: 'INFO',
      ENABLE_API_DOCS: true,
    };
  }
}

export class ProductionConfig extends ConfigManager {
  constructor() {
    super();
    this.config = {
      ...this.config,
      DEBUG: false,
      ENVIRONMENT: 'production',
      LOG_LEVEL: 'WARN',
      ENABLE_API_DOCS: false,
      CORS_ORIGINS: ['https://buffr.ai', 'https://host.buffr.ai'],
    };
  }
}

export function getConfig(): ConfigManager {
  const env = process.env.ENVIRONMENT || 'development';
  
  switch (env) {
    case 'production':
      return new ProductionConfig();
    case 'staging':
      return new StagingConfig();
    default:
      return new DevelopmentConfig();
  }
}

// Export the appropriate configuration
export const config = getConfig();