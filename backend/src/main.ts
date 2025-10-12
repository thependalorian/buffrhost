/**
 * Buffr Host Next.js API Application
 * Main entry point for the hospitality management platform API.
 * Converted from Python FastAPI to TypeScript Next.js API routes.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createConnection } from 'typeorm';
import { ConfigManager } from './config/ConfigManager';
import { DatabaseManager } from './database/DatabaseManager';
import { ErrorHandler } from './middleware/ErrorHandler';
import { RateLimiter } from './middleware/RateLimiter';
import { CorsHandler } from './middleware/CorsHandler';
import { SecurityHandler } from './middleware/SecurityHandler';
import { Logger } from './utils/Logger';

// Initialize configuration
const config = ConfigManager.getInstance();

// Initialize logger
const logger = Logger.getInstance();

// Initialize database manager
const databaseManager = DatabaseManager.getInstance();

// Initialize middleware
const errorHandler = new ErrorHandler();
const rateLimiter = new RateLimiter();
const corsHandler = new CorsHandler();
const securityHandler = new SecurityHandler();

/**
 * Application startup and initialization
 */
async function initializeApp(): Promise<void> {
  try {
    logger.info('Starting Buffr Host API...');
    
    // Initialize database connection
    await databaseManager.initialize();
    logger.info('Database connection established');
    
    // Create database tables
    await databaseManager.createTables();
    logger.info('Database tables created/verified');
    
    // Initialize rate limiting
    await rateLimiter.initialize();
    logger.info('Rate limiting initialized');
    
    logger.info('Buffr Host API startup complete');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
}

/**
 * Application shutdown and cleanup
 */
async function shutdownApp(): Promise<void> {
  try {
    logger.info('Shutting down Buffr Host API...');
    
    // Close database connections
    await databaseManager.close();
    logger.info('Database connections closed');
    
    // Close rate limiter
    await rateLimiter.close();
    logger.info('Rate limiter closed');
    
    logger.info('Buffr Host API shutdown complete');
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
}

/**
 * Main API handler for Next.js
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Initialize app on first request
    if (!global.appInitialized) {
      await initializeApp();
      global.appInitialized = true;
    }

    // Apply middleware
    await corsHandler.handle(req, res);
    await securityHandler.handle(req, res);
    await rateLimiter.handle(req, res);
    
    // Route to appropriate handler based on path
    const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
    
    switch (pathname) {
      case '/':
        return handleRoot(req, res);
      case '/health':
        return handleHealthCheck(req, res);
      case '/api/v1/status':
        return handleApiStatus(req, res);
      case '/employee-loan-applications':
        if (req.method === 'POST') {
          return handleEmployeeLoanApplication(req, res);
        }
        break;
      default:
        // Handle API routes
        if (pathname.startsWith('/api/v1/')) {
          return handleApiRoute(req, res, pathname);
        }
        break;
    }
    
    // 404 for unmatched routes
    res.status(404).json({ error: 'Not Found' });
  } catch (error) {
    return errorHandler.handle(error, req, res);
  }
}

/**
 * Root endpoint handler
 */
async function handleRoot(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'Welcome to Buffr Host API',
    version: '1.0.0',
    docs_url: config.get('ENABLE_API_DOCS') ? '/docs' : 'Documentation disabled',
    status: 'operational',
    domain: 'host.buffr.ai',
    contact: 'george@buffr.ai'
  });
}

/**
 * Health check endpoint handler
 */
async function handleHealthCheck(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check database connection
    const dbHealth = await databaseManager.healthCheck();
    
    if (!dbHealth.healthy) {
      return res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        services: {
          database: 'unhealthy',
          api: 'healthy'
        },
        error: dbHealth.error
      });
    }
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: 'healthy',
        api: 'healthy'
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service unavailable'
    });
  }
}

/**
 * API status endpoint handler
 */
async function handleApiStatus(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    api_version: '1.0.0',
    environment: config.get('ENVIRONMENT'),
    features: {
      ai_enabled: config.get('ENABLE_AI_FEATURES'),
      realtime_enabled: config.get('ENABLE_REALTIME'),
      analytics_enabled: config.get('ENABLE_ANALYTICS'),
      marketing_enabled: config.get('ENABLE_MARKETING')
    },
    limits: {
      rate_limit_requests: config.get('RATE_LIMIT_REQUESTS'),
      rate_limit_window: config.get('RATE_LIMIT_WINDOW'),
      max_file_size: config.get('MAX_FILE_SIZE')
    }
  });
}

/**
 * Employee loan application handler
 */
async function handleEmployeeLoanApplication(req: NextApiRequest, res: NextApiResponse) {
  try {
    const application = req.body;
    
    // Validate required fields
    if (!application.employee_id || !application.property_id || !application.requested_amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['employee_id', 'property_id', 'requested_amount']
      });
    }
    
    // Generate unique application ID
    const applicationId = `app-${application.employee_id}-${Date.now()}`;
    
    // In a real scenario, this would save to database and trigger review process
    logger.info(`Received employee loan application for employee: ${application.employee_id}`);
    
    res.status(200).json({
      message: 'Employee loan application received successfully',
      application_id: applicationId,
      employee_id: application.employee_id,
      status: 'received',
      received_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error processing employee loan application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * API route handler
 */
async function handleApiRoute(req: NextApiRequest, res: NextApiResponse, pathname: string) {
  // Extract route parts
  const routeParts = pathname.split('/').filter(part => part);
  const [, , , ...apiPath] = routeParts;
  
  // Route to appropriate API handler
  switch (apiPath[0]) {
    case 'auth':
      return handleAuthRoutes(req, res, apiPath.slice(1));
    case 'users':
      return handleUserRoutes(req, res, apiPath.slice(1));
    case 'properties':
      return handlePropertyRoutes(req, res, apiPath.slice(1));
    case 'bookings':
      return handleBookingRoutes(req, res, apiPath.slice(1));
    case 'orders':
      return handleOrderRoutes(req, res, apiPath.slice(1));
    case 'rooms':
      return handleRoomRoutes(req, res, apiPath.slice(1));
    case 'services':
      return handleServiceRoutes(req, res, apiPath.slice(1));
    case 'loyalty':
      return handleLoyaltyRoutes(req, res, apiPath.slice(1));
    case 'payments':
      return handlePaymentRoutes(req, res, apiPath.slice(1));
    case 'analytics':
      return handleAnalyticsRoutes(req, res, apiPath.slice(1));
    case 'notifications':
      return handleNotificationRoutes(req, res, apiPath.slice(1));
    case 'reviews':
      return handleReviewRoutes(req, res, apiPath.slice(1));
    case 'staff':
      return handleStaffRoutes(req, res, apiPath.slice(1));
    case 'inventory':
      return handleInventoryRoutes(req, res, apiPath.slice(1));
    case 'maintenance':
      return handleMaintenanceRoutes(req, res, apiPath.slice(1));
    case 'events':
      return handleEventRoutes(req, res, apiPath.slice(1));
    case 'promotions':
      return handlePromotionRoutes(req, res, apiPath.slice(1));
    case 'feedback':
      return handleFeedbackRoutes(req, res, apiPath.slice(1));
    case 'integrations':
      return handleIntegrationRoutes(req, res, apiPath.slice(1));
    case 'audit-logs':
      return handleAuditLogRoutes(req, res, apiPath.slice(1));
    case 'configurations':
      return handleConfigurationRoutes(req, res, apiPath.slice(1));
    case 'reports':
      return handleReportRoutes(req, res, apiPath.slice(1));
    case 'dashboards':
      return handleDashboardRoutes(req, res, apiPath.slice(1));
    case 'workflows':
      return handleWorkflowRoutes(req, res, apiPath.slice(1));
    case 'tasks':
      return handleTaskRoutes(req, res, apiPath.slice(1));
    case 'schedules':
      return handleScheduleRoutes(req, res, apiPath.slice(1));
    case 'templates':
      return handleTemplateRoutes(req, res, apiPath.slice(1));
    case 'settings':
      return handleSettingsRoutes(req, res, apiPath.slice(1));
    case 'permissions':
      return handlePermissionRoutes(req, res, apiPath.slice(1));
    case 'roles':
      return handleRoleRoutes(req, res, apiPath.slice(1));
    case 'sessions':
      return handleSessionRoutes(req, res, apiPath.slice(1));
    case 'tokens':
      return handleTokenRoutes(req, res, apiPath.slice(1));
    case 'devices':
      return handleDeviceRoutes(req, res, apiPath.slice(1));
    case 'locations':
      return handleLocationRoutes(req, res, apiPath.slice(1));
    case 'buffr-agent':
      return handleBuffrAgentRoutes(req, res, apiPath.slice(1));
    case 'financial':
      return handleFinancialRoutes(req, res, apiPath.slice(1));
    case 'ml':
      return handleMLRoutes(req, res, apiPath.slice(1));
    case 'yango':
      return handleYangoRoutes(req, res, apiPath.slice(1));
    case 'hotel-configuration':
      return handleHotelConfigurationRoutes(req, res, apiPath.slice(1));
    case 'public':
      return handlePublicRoutes(req, res, apiPath.slice(1));
    default:
      res.status(404).json({ error: 'API endpoint not found' });
  }
}

// Import route handlers
import { handler as authHandler } from './routes/auth';
import { handler as userHandler } from './routes/users';
import { handler as propertyHandler } from './routes/properties';
import { handler as orderHandler } from './routes/orders';

async function handleAuthRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // Add action to query parameters
  req.query.action = path[0] || 'login';
  return await authHandler(req, res);
}

async function handleUserRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // Add action to query parameters
  req.query.action = path[0] || 'list';
  return await userHandler(req, res);
}

async function handlePropertyRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // Add action to query parameters
  req.query.action = path[0] || 'list';
  return await propertyHandler(req, res);
}

async function handleBookingRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement booking routes
  res.status(501).json({ error: 'Booking routes not implemented yet' });
}

async function handleOrderRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // Add action to query parameters
  req.query.action = path[0] || 'list';
  return await orderHandler(req, res);
}

async function handleRoomRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement room routes
  res.status(501).json({ error: 'Room routes not implemented yet' });
}

async function handleServiceRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement service routes
  res.status(501).json({ error: 'Service routes not implemented yet' });
}

async function handleLoyaltyRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement loyalty routes
  res.status(501).json({ error: 'Loyalty routes not implemented yet' });
}

async function handlePaymentRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement payment routes
  res.status(501).json({ error: 'Payment routes not implemented yet' });
}

async function handleAnalyticsRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement analytics routes
  res.status(501).json({ error: 'Analytics routes not implemented yet' });
}

async function handleNotificationRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement notification routes
  res.status(501).json({ error: 'Notification routes not implemented yet' });
}

async function handleReviewRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement review routes
  res.status(501).json({ error: 'Review routes not implemented yet' });
}

async function handleStaffRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement staff routes
  res.status(501).json({ error: 'Staff routes not implemented yet' });
}

async function handleInventoryRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement inventory routes
  res.status(501).json({ error: 'Inventory routes not implemented yet' });
}

async function handleMaintenanceRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement maintenance routes
  res.status(501).json({ error: 'Maintenance routes not implemented yet' });
}

async function handleEventRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement event routes
  res.status(501).json({ error: 'Event routes not implemented yet' });
}

async function handlePromotionRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement promotion routes
  res.status(501).json({ error: 'Promotion routes not implemented yet' });
}

async function handleFeedbackRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement feedback routes
  res.status(501).json({ error: 'Feedback routes not implemented yet' });
}

async function handleIntegrationRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement integration routes
  res.status(501).json({ error: 'Integration routes not implemented yet' });
}

async function handleAuditLogRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement audit log routes
  res.status(501).json({ error: 'Audit log routes not implemented yet' });
}

async function handleConfigurationRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement configuration routes
  res.status(501).json({ error: 'Configuration routes not implemented yet' });
}

async function handleReportRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement report routes
  res.status(501).json({ error: 'Report routes not implemented yet' });
}

async function handleDashboardRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement dashboard routes
  res.status(501).json({ error: 'Dashboard routes not implemented yet' });
}

async function handleWorkflowRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement workflow routes
  res.status(501).json({ error: 'Workflow routes not implemented yet' });
}

async function handleTaskRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement task routes
  res.status(501).json({ error: 'Task routes not implemented yet' });
}

async function handleScheduleRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement schedule routes
  res.status(501).json({ error: 'Schedule routes not implemented yet' });
}

async function handleTemplateRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement template routes
  res.status(501).json({ error: 'Template routes not implemented yet' });
}

async function handleSettingsRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement settings routes
  res.status(501).json({ error: 'Settings routes not implemented yet' });
}

async function handlePermissionRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement permission routes
  res.status(501).json({ error: 'Permission routes not implemented yet' });
}

async function handleRoleRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement role routes
  res.status(501).json({ error: 'Role routes not implemented yet' });
}

async function handleSessionRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement session routes
  res.status(501).json({ error: 'Session routes not implemented yet' });
}

async function handleTokenRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement token routes
  res.status(501).json({ error: 'Token routes not implemented yet' });
}

async function handleDeviceRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement device routes
  res.status(501).json({ error: 'Device routes not implemented yet' });
}

async function handleLocationRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement location routes
  res.status(501).json({ error: 'Location routes not implemented yet' });
}

async function handleBuffrAgentRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement Buffr agent routes
  res.status(501).json({ error: 'Buffr agent routes not implemented yet' });
}

async function handleFinancialRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement financial routes
  res.status(501).json({ error: 'Financial routes not implemented yet' });
}

async function handleMLRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement ML routes
  res.status(501).json({ error: 'ML routes not implemented yet' });
}

async function handleYangoRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement Yango routes
  res.status(501).json({ error: 'Yango routes not implemented yet' });
}

async function handleHotelConfigurationRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement hotel configuration routes
  res.status(501).json({ error: 'Hotel configuration routes not implemented yet' });
}

async function handlePublicRoutes(req: NextApiRequest, res: NextApiResponse, path: string[]) {
  // TODO: Implement public routes
  res.status(501).json({ error: 'Public routes not implemented yet' });
}

// Global app state
declare global {
  var appInitialized: boolean;
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  await shutdownApp();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await shutdownApp();
  process.exit(0);
});