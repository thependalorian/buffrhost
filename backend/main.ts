/**
 * BUFFR HOST APPLICATION
 * Main entry point for the hospitality management platform API
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';
import { devConfig } from './dev_config';

// Import route handlers (these would be implemented as Next.js API routes)
// import { authRoutes } from './routes/auth';
// import { hospitalityPropertyRoutes } from './routes/hospitality_property';
// import { menuRoutes } from './routes/menu';
// import { inventoryRoutes } from './routes/inventory';
// import { customerRoutes } from './routes/customer';
// import { orderRoutes } from './routes/order';
// import { analyticsRoutes } from './routes/analytics';
// import { cmsRoutes } from './routes/cms';
// import { knowledgeBaseRoutes } from './routes/knowledge_base';
// import { spaRoutes } from './routes/spa';
// import { conferenceRoutes } from './routes/conference';
// import { transportationRoutes } from './routes/transportation';
// import { loyaltyRoutes } from './routes/loyalty';
// import { qrLoyaltyRoutes } from './routes/qr_loyalty';
// import { staffRoutes } from './routes/staff';
// import { aiKnowledgeRoutes } from './routes/ai_knowledge';
// import { calendarRoutes } from './routes/calendar';
// import { arcadeRoutes } from './routes/arcade';
// import { paymentRoutes } from './routes/payment';
// import { demoRequestsRoutes } from './routes/demo_requests';
// import { buffrAgentRoutes } from './routes/buffr_agent';
// import { previewRoutes } from './routes/preview';
// import { financialRoutes } from './routes/financial';
// import { etunaDemoAIRoutes } from './routes/etuna_demo_ai';
// import { etunaDemoRoutes } from './routes/etuna_demo';
// import { waitlistRoutes } from './routes/waitlist';
// import { restaurantRoutes } from './routes/restaurant';
// import { onboardingRoutes } from './routes/onboarding';
// import { mlRoutes } from './routes/ml_routes';
// import { yangoRoutes } from './routes/yango_routes';
// import { hotelConfigurationRoutes } from './routes/hotel_configuration';
// import { publicRoutes } from './routes/public';

// Import email routes
// import { emailSendRoutes } from './routes/email_send_route';
// import { emailAnalyticsRoutes } from './routes/email_analytics_route';
// import { emailPreferencesRoutes } from './routes/email_preferences_route';
// import { emailTemplatesRoutes } from './routes/email_templates_route';
// import { emailQueueRoutes } from './routes/email_queue_route';
// import { emailBlacklistRoutes } from './routes/email_blacklist_route';
// import { emailBookingConfirmationRoutes } from './routes/email_booking_confirmation_route';
// import { emailCheckInReminderRoutes } from './routes/email_check_in_reminder_route';
// import { emailCheckOutReminderRoutes } from './routes/email_check_out_reminder_route';
// import { emailPropertyUpdateRoutes } from './routes/email_property_update_route';
// import { emailBookingCancellationRoutes } from './routes/email_booking_cancellation_route';
// import { emailHostSummaryRoutes } from './routes/email_host_summary_route';
// import { emailWebhookSendgridRoutes } from './routes/email_webhook_sendgrid_route';
// import { emailWebhookResendRoutes } from './routes/email_webhook_resend_route';
// import { emailWebhookSesRoutes } from './routes/email_webhook_ses_route';

// Import new systems
// import { userRoutes } from './routes/user_routes';
// import { bookingRoutes } from './routes/booking_routes';

// Import error handling
// import { setupErrorHandling, setupLogging } from './error_handling';

// Setup comprehensive logging
// setupLogging();

// Interfaces
interface EmployeeLoanApplication {
  employee_id: string;
  property_id: string;
  requested_amount: number;
  loan_purpose: string;
  employment_start_date: string;
  salary: number;
  contact_email: string;
  contact_phone?: string;
}

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
  services: {
    database: string;
    api: string;
  };
}

interface APIStatusResponse {
  api_version: string;
  environment: string;
  features: {
    ai_enabled: boolean;
    realtime_enabled: boolean;
    analytics_enabled: boolean;
    marketing_enabled: boolean;
  };
  limits: {
    rate_limit_requests: number;
    rate_limit_window: number;
    max_file_size: number;
  };
}

// Application class
export class BuffrHostApp {
  private config: typeof config;
  private devConfig: typeof devConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = config;
    this.devConfig = devConfig;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Starting Buffr Host API...');

      // Check database connection
      if (!await this.checkDatabaseConnection()) {
        console.error('Database connection failed');
        throw new Error('Database connection failed');
      }

      // Create database tables
      await this.createTables();
      console.log('Database tables created/verified');

      // Initialize rate limiting
      try {
        await this.initializeRateLimiting();
        console.log('Rate limiting initialized');
      } catch (error) {
        console.warn(`Redis connection failed: ${error}. Rate limiting disabled.`);
      }

      this.isInitialized = true;
      console.log('Buffr Host API startup complete');
    } catch (error) {
      console.error('Failed to initialize application:', error);
      throw error;
    }
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    try {
      // This would be implemented with actual database connection check
      // For now, return true as a placeholder
      return true;
    } catch (error) {
      console.error('Database connection check failed:', error);
      return false;
    }
  }

  private async createTables(): Promise<void> {
    try {
      // This would be implemented with actual table creation
      // For now, just log the action
      console.log('Creating/verifying database tables...');
    } catch (error) {
      console.error('Failed to create database tables:', error);
      throw error;
    }
  }

  private async initializeRateLimiting(): Promise<void> {
    try {
      // This would be implemented with actual Redis connection
      // For now, just log the action
      console.log('Initializing rate limiting...');
    } catch (error) {
      console.error('Failed to initialize rate limiting:', error);
      throw error;
    }
  }

  public async shutdown(): Promise<void> {
    try {
      console.log('Shutting down Buffr Host API...');
      
      // Close database connections
      await this.closeDatabaseConnections();
      console.log('Database connections closed');

      // Close rate limiting
      try {
        await this.closeRateLimiting();
        console.log('Rate limiting closed');
      } catch (error) {
        console.warn(`Error closing rate limiting: ${error}`);
      }

      console.log('Buffr Host API shutdown complete');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }

  private async closeDatabaseConnections(): Promise<void> {
    try {
      // This would be implemented with actual database connection closing
      console.log('Closing database connections...');
    } catch (error) {
      console.error('Failed to close database connections:', error);
    }
  }

  private async closeRateLimiting(): Promise<void> {
    try {
      // This would be implemented with actual Redis connection closing
      console.log('Closing rate limiting...');
    } catch (error) {
      console.error('Failed to close rate limiting:', error);
      throw error;
    }
  }

  // API Route Handlers
  public async handleRoot(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    res.status(200).json({
      message: 'Welcome to Buffr Host API',
      version: '1.0.0',
      docs_url: this.config.get('ENABLE_API_DOCS') ? '/docs' : 'Documentation disabled',
      status: 'operational',
      domain: 'host.buffr.ai',
      contact: 'george@buffr.ai'
    });
  }

  public async handleEmployeeLoanApplication(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const application: EmployeeLoanApplication = req.body;

      // Validate required fields
      if (!application.employee_id || !application.property_id || !application.requested_amount) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      // Placeholder for actual application processing logic
      console.log(`Received employee loan application for employee: ${application.employee_id}`);

      // In a real scenario, this would save the application to the database
      // and potentially notify relevant staff for review.

      res.status(200).json({
        message: 'Employee loan application received successfully',
        application_id: `app-${application.employee_id}-${uuidv4()}`,
        employee_id: application.employee_id,
        status: 'received',
        received_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing employee loan application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async handleHealthCheck(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      // Check database connection
      const dbHealthy = await this.checkDatabaseConnection();

      const response: HealthCheckResponse = {
        status: dbHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: dbHealthy ? 'healthy' : 'unhealthy',
          api: 'healthy'
        }
      };

      if (dbHealthy) {
        res.status(200).json(response);
      } else {
        res.status(503).json(response);
      }
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: 'unhealthy',
          api: 'unhealthy'
        }
      });
    }
  }

  public async handleAPIStatus(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const response: APIStatusResponse = {
      api_version: '1.0.0',
      environment: this.config.get('ENVIRONMENT'),
      features: {
        ai_enabled: this.config.get('ENABLE_AI_FEATURES'),
        realtime_enabled: this.config.get('ENABLE_REALTIME'),
        analytics_enabled: this.config.get('ENABLE_ANALYTICS'),
        marketing_enabled: this.config.get('ENABLE_MARKETING')
      },
      limits: {
        rate_limit_requests: this.config.get('RATE_LIMIT_REQUESTS'),
        rate_limit_window: this.config.get('RATE_LIMIT_WINDOW'),
        max_file_size: this.config.get('MAX_FILE_SIZE')
      }
    };

    res.status(200).json(response);
  }

  // CORS middleware
  public setupCORS(req: NextApiRequest, res: NextApiResponse): void {
    const corsOrigins = this.config.get('CORS_ORIGINS');
    const origin = req.headers.origin;

    if (corsOrigins.includes('*') || (origin && corsOrigins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', this.config.get('CORS_ALLOW_CREDENTIALS').toString());
    res.setHeader('Access-Control-Allow-Methods', this.config.get('CORS_ALLOW_METHODS').join(', '));
    res.setHeader('Access-Control-Allow-Headers', this.config.get('CORS_ALLOW_HEADERS').join(', '));

    if (req.method === 'OPTIONS') {
      res.status(200).end();
    }
  }

  // Security middleware
  public setupSecurity(req: NextApiRequest, res: NextApiResponse): void {
    // Trusted host middleware (production only)
    if (this.config.get('ENVIRONMENT') === 'production') {
      const allowedHosts = ['buffr.ai', '*.buffr.ai', 'host.buffr.ai', 'api.buffr.ai'];
      const host = req.headers.host;

      if (host && !allowedHosts.some(allowedHost => 
        allowedHost.includes('*') ? host.endsWith(allowedHost.replace('*', '')) : host === allowedHost
      )) {
        res.status(400).json({ error: 'Invalid host' });
        return;
      }
    }

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }

  // Error handling middleware
  public setupErrorHandling(error: Error, req: NextApiRequest, res: NextApiResponse): void {
    console.error('API Error:', error);

    if (this.config.get('ENVIRONMENT') === 'development') {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      });
    }
  }

  // Rate limiting middleware
  public async setupRateLimiting(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
    try {
      // This would be implemented with actual rate limiting logic
      // For now, just return true (allow request)
      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow request if rate limiting fails
    }
  }

  // Main request handler
  public async handleRequest(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      // Setup middleware
      this.setupCORS(req, res);
      this.setupSecurity(req, res);

      // Check rate limiting
      const rateLimitPassed = await this.setupRateLimiting(req, res);
      if (!rateLimitPassed) {
        res.status(429).json({ error: 'Too many requests' });
        return;
      }

      // Route handling
      const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
      
      switch (pathname) {
        case '/':
          await this.handleRoot(req, res);
          break;
        case '/employee-loan-applications':
          await this.handleEmployeeLoanApplication(req, res);
          break;
        case '/health':
          await this.handleHealthCheck(req, res);
          break;
        case '/api/v1/status':
          await this.handleAPIStatus(req, res);
          break;
        default:
          res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      this.setupErrorHandling(error as Error, req, res);
    }
  }
}

// Create application instance
const app = new BuffrHostApp();

// Initialize application
app.initialize().catch(error => {
  console.error('Failed to initialize application:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

// Export the application and handler
export default app;

// Next.js API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await app.handleRequest(req, res);
}

// Export types
export type { EmployeeLoanApplication, HealthCheckResponse, APIStatusResponse };