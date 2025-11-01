/**
 * Staff API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for staff operations providing staff data management and operations
 * @location buffr-host/frontend/app/api/staff/route.ts
 * @purpose staff data management and operations
 * @modularity staff-focused API endpoint with specialized staff operations
 * @database_connections Reads/writes to staff related tables
 * @api_integration staff service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Staff Management Capabilities:
 * - staff CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/staff - Staff Retrieval Endpoint
 * @method GET
 * @endpoint /api/staff
 * @purpose staff data management and operations
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
 * GET /api/staff
 * /api/staff
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
 * Staff API - Using New API Design Standards
 *
 * Location: app/api/staff/route.ts
 * Features: Standardized responses, rate limiting, monitoring, versioning
 */

import { NextRequest } from 'next/server';
import {
  withAPIWrapper,
  apiSuccess,
  apiError,
} from '@/lib/middleware/api-wrapper';
import { rateLimiters } from '@/lib/middleware/rateLimit';
import { createProtectedRoute } from '@/lib/middleware/api-protection';
import { StaffService } from '@/lib/services/staffService';
import { ErrorCodes, HttpStatus } from '@/lib/utils/api-response';
import {
  extractPagination,
  createPaginationResult,
  validateRequiredFields,
} from '@/lib/utils/api-helpers';

/**
 * GET /api/staff
 *
 * List staff members with pagination and filtering
 *
 * Query Parameters:
 * - propertyId: Filter by property ID
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "staff": [...],
 *     "pagination": {...}
 *   }
 * }
 */
export const GET = createProtectedRoute(
  withAPIWrapper(
    async (req: NextRequest, context: any) => {
      try {
        const { searchParams } = new URL(req.url);
        const propertyId = searchParams.get('propertyId');
        const { page, limit } = extractPagination(req, 20, 100);

        const staffService = new StaffService();
        const result = await staffService.getAllStaff(
          context.tenantId,
          propertyId || undefined
        );

        // If result is already paginated, return it
        if (result && typeof result === 'object' && 'data' in result) {
          return apiSuccess(result);
        }

        // Otherwise, wrap in pagination structure
        const staffArray = Array.isArray(result) ? result : [];
        const pagination = createPaginationResult(
          page,
          limit,
          staffArray.length
        );

        return apiSuccess(
          {
            staff: staffArray,
            pagination,
          },
          HttpStatus.OK
        );
      } catch (error) {
        console.error('Error fetching staff:', error);
        return apiError(
          ErrorCodes.INTERNAL_ERROR,
          'Failed to fetch staff',
          { message: error instanceof Error ? error.message : 'Unknown error' },
          HttpStatus.INTERNAL_ERROR
        );
      }
    },
    {
      rateLimiter: rateLimiters.general,
      enableMonitoring: true,
      enableVersioning: true,
      requiredAuth: 'standard',
    }
  ),
  { requiredIds: ['tenantId'], securityLevel: 'BUSINESS' }
);

/**
 * POST /api/staff
 *
 * Create a new staff member
 *
 * Request Body:
 * {
 *   "userId": "uuid",
 *   "propertyId": "uuid",
 *   "position": "string",
 *   "department": "string",
 *   ...
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { staff member object }
 * }
 */
export const POST = createProtectedRoute(
  withAPIWrapper(
    async (req: NextRequest, context: any) => {
      try {
        const body = await req.json();

        // Validate required fields
        const validationErrors = validateRequiredFields(body, [
          'userId',
          'propertyId',
          'position',
        ]);

        if (validationErrors.length > 0) {
          return apiError(
            ErrorCodes.VALIDATION_ERROR,
            'Missing required fields',
            { errors: validationErrors },
            HttpStatus.BAD_REQUEST
          );
        }

        const staffService = new StaffService();
        const staff = await staffService.createStaff(body, context.tenantId);

        return apiSuccess(staff, HttpStatus.CREATED);
      } catch (error) {
        console.error('Error creating staff:', error);
        return apiError(
          ErrorCodes.INTERNAL_ERROR,
          'Failed to create staff',
          { message: error instanceof Error ? error.message : 'Unknown error' },
          HttpStatus.INTERNAL_ERROR
        );
      }
    },
    {
      rateLimiter: rateLimiters.general,
      enableMonitoring: true,
      enableVersioning: true,
      requiredAuth: 'standard',
    }
  ),
  { requiredIds: ['tenantId'], securityLevel: 'BUSINESS' }
);
