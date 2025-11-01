/**
 * Crm Customers API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for crm operations providing customer relationship management and guest data operations
 * @location buffr-host/frontend/app/api/crm/customers/route.ts
 * @purpose Customer relationship management and guest data operations
 * @modularity crm-focused API endpoint with specialized customers operations
 * @database_connections Reads/writes to crm_customers, customer_interactions, loyalty_transactions tables
 * @api_integration CRM services, analytics engines, loyalty program systems
 * @scalability Customer data scaling with sharding and optimized query performance
 * @performance Customer queries optimized with advanced indexing and query planning
 * @monitoring Customer engagement metrics, loyalty program analytics, and retention tracking
 * @security Customer data protection, GDPR compliance, and privacy controls
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Crm Management Capabilities:
 * - Customer profile management
 * - Loyalty program administration
 * - Customer analytics
 * - Guest data segmentation
 *
 * Key Features:
 * - Customer profiles
 * - Loyalty programs
 * - Analytics
 * - Segmentation
 */

/**
 * GET /api/crm/customers - Crm Customers Retrieval Endpoint
 * @method GET
 * @endpoint /api/crm/customers
 * @purpose Customer relationship management and guest data operations
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Read access to customer data
 * @rate_limit Standard API rate limiter applied
 * @caching Customer data cached with privacy considerations
 * @returns {Promise<NextResponse>} Customer data response with profile information
 * @security Customer data protection, GDPR compliance, and privacy controls
 * @database_queries Customer queries with privacy controls and data protection measures
 * @performance Customer queries optimized with advanced indexing and query planning
 * @example
 * GET /api/crm/customers
 * /api/crm/customers
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "customer": {
 *       "id": "cust-123",
 *       "name": "John Doe",
 *       "email": "john@example.com"
 *     }
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
 * CRM Customers API - Using New API Design Standards
 *
 * Location: app/api/crm/customers/route.ts
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
import { CrmService } from '@/lib/services/crmService';
import { ErrorCodes, HttpStatus } from '@/lib/utils/api-response';
import {
  extractPagination,
  createPaginationResult,
  validateRequiredFields,
  validateEmail,
} from '@/lib/utils/api-helpers';

/**
 * GET /api/crm/customers
 *
 * List customers with pagination and filtering
 *
 * Query Parameters:
 * - propertyId: Filter by property ID
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - search: Search by name or email
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "customers": [...],
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
        const search = searchParams.get('search') || '';
        const { page, limit } = extractPagination(req, 20, 100);

        const crmService = new CrmService();
        const result = await crmService.getAllCustomers(
          context.tenantId,
          propertyId || undefined
        );

        // Filter by search term if provided
        let customers = Array.isArray(result) ? result : [];
        if (search) {
          const searchLower = search.toLowerCase();
          customers = customers.filter((customer: any) => {
            const name = customer.name?.toLowerCase() || '';
            const email = customer.email?.toLowerCase() || '';
            return name.includes(searchLower) || email.includes(searchLower);
          });
        }

        const pagination = createPaginationResult(
          page,
          limit,
          customers.length
        );
        const paginatedCustomers = customers.slice(
          (page - 1) * limit,
          page * limit
        );

        return apiSuccess(
          {
            customers: paginatedCustomers,
            pagination,
          },
          HttpStatus.OK
        );
      } catch (error) {
        console.error('Error fetching customers:', error);
        return apiError(
          ErrorCodes.INTERNAL_ERROR,
          'Failed to fetch customers',
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
 * POST /api/crm/customers
 *
 * Create a new customer
 *
 * Request Body:
 * {
 *   "name": "string",
 *   "email": "string (required, must be valid email)",
 *   "phone": "string",
 *   "propertyId": "uuid",
 *   ...
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": { customer object }
 * }
 */
export const POST = createProtectedRoute(
  withAPIWrapper(
    async (req: NextRequest, context: any) => {
      try {
        const body = await req.json();

        // Validate required fields
        const validationErrors = validateRequiredFields(body, [
          'name',
          'email',
        ]);

        // Validate email format
        if (body.email && !validateEmail(body.email)) {
          validationErrors.push({
            field: 'email',
            message: 'Invalid email format',
            code: 'INVALID_EMAIL_FORMAT',
          });
        }

        if (validationErrors.length > 0) {
          return apiError(
            ErrorCodes.VALIDATION_ERROR,
            'Validation failed',
            { errors: validationErrors },
            HttpStatus.BAD_REQUEST
          );
        }

        const crmService = new CrmService();
        const customer = await crmService.createCustomer(
          body,
          context.tenantId
        );

        return apiSuccess(customer, HttpStatus.CREATED);
      } catch (error) {
        console.error('Error creating customer:', error);
        return apiError(
          ErrorCodes.INTERNAL_ERROR,
          'Failed to create customer',
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
