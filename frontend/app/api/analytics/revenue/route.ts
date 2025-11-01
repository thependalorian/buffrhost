// /app/api/analytics/revenue/route.ts

/**
 * Analytics Revenue API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for analytics operations providing analytics data management and operations
 * @location buffr-host/frontend/app/api/analytics/revenue/route.ts
 * @purpose analytics data management and operations
 * @modularity analytics-focused API endpoint with specialized revenue operations
 * @database_connections Reads/writes to analytics related tables
 * @api_integration analytics service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Analytics Management Capabilities:
 * - analytics CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/analytics/revenue - Analytics Revenue Retrieval Endpoint
 * @method GET
 * @endpoint /api/analytics/revenue
 * @purpose analytics data management and operations
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Appropriate permissions based on operation type
 * @rate_limit Standard API rate limiter applied
 * @caching Appropriate caching strategy applied
 * @returns {Promise<NextResponse>} API operation result with success status and data
 * @security Multi-tenant security with data isolation and access control
 * @database_queries Optimized database queries with appropriate indexing and performance
 * @performance Performance optimized with database indexing and caching
 * @example
 * GET /api/analytics/revenue
 * /api/analytics/revenue
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
import { NextRequest, NextResponse } from 'next/server';
import { createProtectedRoute } from '@/lib/middleware/api-protection';
import { AnalyticsService } from '@/lib/services/analyticsService';

export const GET = createProtectedRoute(
  async (req: NextRequest, context: any) => {
    try {
      const { searchParams } = new URL(req.url);
      const propertyId = searchParams.get('propertyId');

      const analyticsService = new AnalyticsService();
      const result = await analyticsService.getRevenueAnalytics(
        context.tenantId,
        propertyId || undefined
      );

      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch revenue analytics' },
        { status: 500 }
      );
    }
  },
  { requiredIds: ['tenantId'], securityLevel: 'BUSINESS' }
);
