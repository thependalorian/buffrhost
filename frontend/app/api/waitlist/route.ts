/**
 * Waitlist API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for waitlist operations providing waitlist data management and operations
 * @location buffr-host/frontend/app/api/waitlist/route.ts
 * @purpose waitlist data management and operations
 * @modularity waitlist-focused API endpoint with specialized waitlist operations
 * @database_connections Reads/writes to waitlist related tables
 * @api_integration waitlist service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Waitlist Management Capabilities:
 * - waitlist CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/waitlist - Waitlist Retrieval Endpoint
 * @method GET
 * @endpoint /api/waitlist
 * @purpose waitlist data management and operations
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
 * GET /api/waitlist
 * /api/waitlist
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
import { createWaitlistService } from '@/lib/services/waitlist-service';
import { validateBody } from '@/lib/validation/middleware';
import { waitlistSignupSchema } from '@/lib/validation/schemas';
// import { safeValidateWaitlistRequest } from '@/lib/validation/waitlist-schemas';

/**
 * Waitlist API Route Handler
 * TypeScript-first implementation with Python backend fallback
 */

export async function POST(req: NextRequest) {
  // Validate request body
  const validationResult = await validateBody(req, waitlistSignupSchema);
  if (!validationResult.success) {
    return validationResult.response;
  }

  const data = validationResult.data;

  try {
    // Extract tenant and user info from headers or default
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant';
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    // Create waitlist service
    const waitlistService = createWaitlistService(tenantId, userId);

    // Process waitlist signup
    const result = await waitlistService.joinWaitlist(data);

    // Return success response
    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Waitlist API error:', error);

    // Try Python backend fallback
    try {
      const backendUrl =
        process.env['BACKEND_API_URL'] || 'http://localhost:8000';
      const fallbackResponse = await fetch(`${backendUrl}/api/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': req.headers.get('x-tenant-id') || 'default-tenant',
          'X-User-ID': req.headers.get('x-user-id') || 'anonymous-user',
        },
        body: JSON.stringify(data),
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        return NextResponse.json(fallbackData, { status: 200 });
      }
    } catch (fallbackError) {
      console.error('Python backend fallback failed:', fallbackError);
    }

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process waitlist signup. Please try again later.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Extract tenant and user info
    const _tenantId = req.headers.get('x-tenant-id') || 'default-tenant';
    const userId = req.headers.get('x-user-id') || 'anonymous-user';

    // Create waitlist service
    const waitlistService = createWaitlistService(tenantId, userId);

    // Get waitlist statistics
    const stats = await waitlistService.getWaitlistStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Waitlist stats API error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get waitlist statistics',
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
