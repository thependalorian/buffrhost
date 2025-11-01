/**
 * Compliance Email-preferences API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for compliance operations providing compliance data management and operations
 * @location buffr-host/frontend/app/api/compliance/email-preferences/route.ts
 * @purpose compliance data management and operations
 * @modularity compliance-focused API endpoint with specialized email-preferences operations
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
 * GET /api/compliance/email-preferences - Compliance Email-preferences Retrieval Endpoint
 * @method GET
 * @endpoint /api/compliance/email-preferences
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
 * GET /api/compliance/email-preferences
 * /api/compliance/email-preferences
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
 * @fileoverview Email Preferences API Route
 * @description API endpoints for email marketing opt-out compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  EmailPreferencesService,
  EmailOptOutRequest,
} from '@/lib/services/email-preferences-service';
import { createProtectedRoute } from '@/lib/middleware/api-wrapper';
import { apiSuccess, apiError } from '@/lib/middleware/api-wrapper';

/**
 * GET /api/compliance/email-preferences
 * Get user's email preferences
 */
async function getEmailPreferences(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const preferences =
      await EmailPreferencesService.getUserPreferences(userId);
    return apiSuccess(preferences, 'Email preferences retrieved successfully');
  } catch (error) {
    console.error('Failed to get email preferences:', error);
    return apiError('Failed to retrieve email preferences', 500);
  }
}

/**
 * PUT /api/compliance/email-preferences
 * Update user's email preferences
 */
async function updateEmailPreferences(request: NextRequest) {
  try {
    const userId = (request as any).user?.id;
    if (!userId) {
      return apiError('Authentication required', 401);
    }

    const body = await request.json();
    const { categories, frequencies, subscribedLists } = body;

    // Get client IP address
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const updatedPreferences =
      await EmailPreferencesService.updateUserPreferences(
        userId,
        {
          categories,
          frequencies,
          subscribedLists,
        },
        ipAddress
      );

    return apiSuccess(
      updatedPreferences,
      'Email preferences updated successfully'
    );
  } catch (error) {
    console.error('Failed to update email preferences:', error);
    return apiError('Failed to update email preferences', 500);
  }
}

/**
 * POST /api/compliance/email-preferences/opt-out
 * Process email opt-out request
 */
async function processOptOut(request: NextRequest) {
  try {
    const body = (await request.json()) as EmailOptOutRequest;
    const { email, categories, reason, source } = body;

    if (!email) {
      return apiError('Email address is required', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiError('Invalid email format', 400);
    }

    const result = await EmailPreferencesService.processOptOut({
      email,
      categories,
      reason,
      source: source || 'api',
    });

    return apiSuccess(result, 'Email opt-out processed successfully');
  } catch (error) {
    console.error('Failed to process email opt-out:', error);
    return apiError('Failed to process email opt-out', 500);
  }
}

/**
 * POST /api/compliance/email-preferences/unsubscribe
 * Process unsubscribe via token
 */
async function processUnsubscribe(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, categories } = body;

    if (!token) {
      return apiError('Unsubscribe token is required', 400);
    }

    const result = await EmailPreferencesService.processTokenOptOut(
      token,
      categories
    );

    return apiSuccess(result, 'Unsubscribe processed successfully');
  } catch (error) {
    console.error('Failed to process unsubscribe:', error);
    return apiError('Failed to process unsubscribe', 500);
  }
}

/**
 * GET /api/compliance/email-preferences/can-send
 * Check if user can receive emails for specific category
 */
async function checkCanSend(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (!userId || !category) {
      return apiError('User ID and category are required', 400);
    }

    const canSend = await EmailPreferencesService.canReceiveEmails(
      userId as any,
      category as any
    );

    return apiSuccess(
      {
        canSend,
        userId,
        category,
      },
      'Email sending permission checked'
    );
  } catch (error) {
    console.error('Failed to check email sending permission:', error);
    return apiError('Failed to check email sending permission', 500);
  }
}

// Export protected route handlers
export const GET = createProtectedRoute(getEmailPreferences);
export const PUT = createProtectedRoute(updateEmailPreferences);

// Public endpoints for opt-out functionality
export const POST = processOptOut;

// Additional endpoints
export const PATCH = createProtectedRoute(processUnsubscribe); // Using PATCH for token-based unsubscribe
export const HEAD = createProtectedRoute(checkCanSend); // Using HEAD for permission check
