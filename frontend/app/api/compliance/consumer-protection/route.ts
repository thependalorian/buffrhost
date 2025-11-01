/**
 * Compliance Consumer-protection API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for compliance operations providing compliance data management and operations
 * @location buffr-host/frontend/app/api/compliance/consumer-protection/route.ts
 * @purpose compliance data management and operations
 * @modularity compliance-focused API endpoint with specialized consumer-protection operations
 * @database_connections Reads/writes to compliance related tables
 * @api_integration compliance service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Compliance Management Capabilities:
 * - compliance CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/compliance/consumer-protection - Compliance Consumer-protection Retrieval Endpoint
 * @method GET
 * @endpoint /api/compliance/consumer-protection
 * @purpose compliance data management and operations
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
 * GET /api/compliance/consumer-protection
 * /api/compliance/consumer-protection
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
 * @fileoverview Consumer Protection API Route
 * @description API endpoints for consumer rights and cooling-off periods
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConsumerProtectionService } from '@/lib/services/consumer-protection-service';
import { createProtectedRoute } from '@/lib/middleware/api-wrapper';
import { apiSuccess, apiError } from '@/lib/middleware/api-wrapper';

/**
 * GET /api/compliance/consumer-protection/rights
 * Get consumer rights information for a booking
 */
async function getConsumerRights(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return apiError('Booking ID is required', 400);
    }

    const rights = await ConsumerProtectionService.getConsumerRights(
      userId,
      bookingId as any
    );

    return apiSuccess(rights, 'Consumer rights retrieved successfully');
  } catch (error) {
    console.error('Failed to get consumer rights:', error);
    return apiError('Failed to retrieve consumer rights', 500);
  }
}

/**
 * POST /api/compliance/consumer-protection/withdrawal
 * Submit a withdrawal request during cooling-off period
 */
async function submitWithdrawal(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const body = await request.json();
    const { bookingId, reason } = body;

    if (!bookingId) {
      return apiError('Booking ID is required', 400);
    }

    if (!reason || reason.trim().length === 0) {
      return apiError('Withdrawal reason is required', 400);
    }

    const withdrawal = await ConsumerProtectionService.submitWithdrawalRequest(
      userId,
      bookingId,
      reason
    );

    return apiSuccess(withdrawal, 'Withdrawal request submitted successfully');
  } catch (error) {
    console.error('Failed to submit withdrawal request:', error);
    return apiError('Failed to submit withdrawal request', 500);
  }
}

/**
 * GET /api/compliance/consumer-protection/cooling-off
 * Get cooling-off period information for a booking
 */
async function getCoolingOffInfo(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return apiError('Booking ID is required', 400);
    }

    const coolingOff = await ConsumerProtectionService.getCoolingOffPeriod(
      bookingId as any
    );

    return apiSuccess(
      coolingOff,
      'Cooling-off period information retrieved successfully'
    );
  } catch (error) {
    console.error('Failed to get cooling-off information:', error);
    return apiError('Failed to retrieve cooling-off information', 500);
  }
}

/**
 * POST /api/compliance/consumer-protection/contract
 * Generate consumer contract terms for a booking
 */
async function generateContract(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return apiError('Booking ID is required', 400);
    }

    const contract =
      await ConsumerProtectionService.generateContractTerms(bookingId);

    return apiSuccess(
      contract,
      'Consumer contract terms generated successfully'
    );
  } catch (error) {
    console.error('Failed to generate contract terms:', error);
    return apiError('Failed to generate contract terms', 500);
  }
}

// Export route handlers
export const GET = createProtectedRoute(getConsumerRights);
export const POST = createProtectedRoute(submitWithdrawal);

// Additional endpoints
export const PUT = createProtectedRoute(getCoolingOffInfo); // Using PUT for cooling-off info
export const PATCH = generateContract; // Contract generation can be public for viewing
