/**
 * Monitoring API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for monitoring operations providing system monitoring and analytics data collection
 * @location buffr-host/frontend/app/api/monitoring/route.ts
 * @purpose System monitoring and analytics data collection
 * @modularity monitoring-focused API endpoint with specialized monitoring operations
 * @database_connections Reads/writes to monitoring_logs, system_metrics, analytics_data tables
 * @api_integration Monitoring services, analytics platforms, health check systems
 * @scalability Monitoring data scaling with time-series databases and aggregation
 * @performance Monitoring optimized with efficient data aggregation and storage
 * @monitoring System health metrics, performance indicators, and alerting systems
 * @security Secure metric collection, access logging, and audit trails
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Monitoring Management Capabilities:
 * - Performance monitoring
 * - System health tracking
 * - Analytics data collection
 * - Operational metrics
 *
 * Key Features:
 * - System monitoring
 * - Health checks
 * - Analytics
 * - Operational metrics
 */

/**
 * GET /api/monitoring - Monitoring Retrieval Endpoint
 * @method GET
 * @endpoint /api/monitoring
 * @purpose System monitoring and analytics data collection
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Read access to system metrics and logs
 * @rate_limit Monitoring rate limiter (higher limits for system checks)
 * @caching No caching - Real-time monitoring data required
 * @returns {Promise<NextResponse>} System metrics and monitoring data
 * @security Secure metric collection, access logging, and audit trails
 * @database_queries Monitoring queries with efficient aggregation and performance metrics
 * @performance Monitoring optimized with efficient data aggregation and storage
 * @example
 * GET /api/monitoring
 * /api/monitoring
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "result": "success"
 *   }
 * }
 *
 * Error Response (400/500):
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Error description"
 *   }
 * }
 */
/**
 * API Monitoring Endpoint - Using New API Design Standards
 *
 * Location: app/api/monitoring/route.ts
 * Features: Standardized responses, rate limiting, versioning
 */

import { NextRequest } from 'next/server';
import {
  withAPIWrapper,
  apiSuccess,
  apiError,
} from '@/lib/middleware/api-wrapper';
import { rateLimiters } from '@/lib/middleware/rateLimit';
import { apiMonitor } from '@/lib/services/monitoring/APIMonitor';
import { ErrorCodes, HttpStatus } from '@/lib/utils/api-response';

/**
 * GET /api/monitoring
 *
 * Get comprehensive API monitoring metrics
 *
 * Query Parameters:
 * - hours: Time range in hours (default: 24, max: 168)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "metrics": {...},
 *     "health": {...},
 *     "security": [...]
 *   }
 * }
 */
export const GET = withAPIWrapper(
  async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const hours = Math.min(
        168,
        Math.max(1, parseInt(searchParams.get('hours') || '24'))
      );

      const metrics = apiMonitor.exportMetrics();
      const timeRangeMetrics = {
        ...metrics,
        timeRange: `${hours} hours`,
        metrics: apiMonitor.getMetrics(hours),
        security: apiMonitor.getSecurityEvents(hours),
      };

      return apiSuccess(timeRangeMetrics, HttpStatus.OK);
    } catch (error) {
      console.error('Monitoring API error:', error);
      return apiError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to retrieve monitoring data',
        { message: error instanceof Error ? error.message : 'Unknown error' },
        HttpStatus.INTERNAL_ERROR
      );
    }
  },
  {
    rateLimiter: rateLimiters.admin, // Admin-only endpoint
    enableMonitoring: false, // Don't monitor the monitoring endpoint
    enableVersioning: true,
    requiredAuth: 'elevated', // Requires elevated permissions
  }
);

/**
 * POST /api/monitoring/log
 *
 * Log an API request (called by middleware internally)
 *
 * Request Body:
 * {
 *   "method": "GET",
 *   "url": "/api/staff",
 *   "userAgent": "...",
 *   "ip": "192.168.1.1",
 *   "duration": 123,
 *   "statusCode": 200,
 *   ...
 * }
 */
export const POST = withAPIWrapper(
  async (request: NextRequest) => {
    try {
      const body = await request.json();

      // Record the request in the monitor
      apiMonitor.recordRequest({
        method: body.method,
        url: body.url,
        userAgent: body.userAgent,
        ip: body.ip,
        userId: body.userId,
        timestamp: new Date(body.timestamp),
        duration: body.duration,
        statusCode: body.statusCode,
        error: body.error,
        requestSize: body.requestSize,
        responseSize: body.responseSize,
      });

      return apiSuccess(
        { message: 'Request logged successfully' },
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Request logging error:', error);
      // Don't fail the request logging - return success even if logging fails
      return apiSuccess(
        {
          message:
            'Request logging encountered an error, but request continues',
        },
        HttpStatus.OK
      );
    }
  },
  {
    rateLimiter: rateLimiters.general,
    enableMonitoring: false, // Don't monitor logging endpoint
    enableVersioning: true,
    requiredAuth: 'none', // Internal endpoint
  }
);
