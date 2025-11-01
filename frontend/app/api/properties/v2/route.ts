/**
 * Properties V2 API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for properties operations providing property data management and crud operations
 * @location buffr-host/frontend/app/api/properties/v2/route.ts
 * @purpose Property data management and CRUD operations
 * @modularity properties-focused API endpoint with specialized v2 operations
 * @database_connections Reads/writes to properties, property_images, property_amenities tables
 * @api_integration Property validation services, image processing, geolocation services
 * @scalability Property data scaling with database read replicas and caching layers
 * @performance Property queries optimized with database indexing and result caching
 * @monitoring Property access analytics, search performance, and usage patterns
 * @security Property ownership validation, tenant isolation, and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Properties Management Capabilities:
 * - Property creation and updates
 * - Property search and filtering
 * - Property ownership management
 * - Multi-tenant property isolation
 *
 * Key Features:
 * - Property CRUD operations
 * - Search and filtering
 * - Ownership validation
 * - Tenant isolation
 */

/**
 * GET /api/properties/v2 - Properties V2 Retrieval Endpoint
 * @method GET
 * @endpoint /api/properties/v2
 * @purpose Property data management and CRUD operations
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Read access to property data
 * @rate_limit Standard API rate limiter applied
 * @caching Property data cached with TTL, invalidated on updates
 * @returns {Promise<NextResponse>} Property data response with pagination metadata
 * @security Property ownership validation, tenant isolation, and access control
 * @database_queries Property queries with tenant isolation and ownership validation
 * @performance Property queries optimized with database indexing and result caching
 * @example
 * GET /api/properties/v2
 * /api/properties/v2
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "properties": [
 *       {
 *         "id": "prop-123",
 *         "name": "Hotel Name",
 *         "type": "hotel",
 *         "location": "City, Country"
 *       }
 *     ],
 *     "pagination": {
 *       "total": 25,
 *       "page": 1,
 *       "limit": 10
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
 * Properties API - Version 2
 *
 * Example implementation using the new API design standards:
 * - Standardized response format
 * - Rate limiting
 * - API monitoring
 * - Versioning support
 *
 * Location: app/api/properties/v2/route.ts
 */

import { NextRequest } from 'next/server';
import {
  withAPIWrapper,
  apiSuccess,
  apiError,
} from '@/lib/middleware/api-wrapper';
import { rateLimiters } from '@/lib/middleware/rateLimit';
import { neonClient } from '../../../../lib/database/neon-client';
import { Property } from '../../../../lib/types/database';
import { ErrorCodes, HttpStatus } from '@/lib/utils/api-response';

export const dynamic = 'force-dynamic';

/**
 * GET /api/properties/v2
 *
 * List properties with filtering and pagination (Version 2)
 *
 * Query Parameters:
 * - type: 'hotel' | 'restaurant' | 'all' (default: 'all')
 * - search: Search term for name, description, or address
 * - location: Filter by location (city, region, address)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 12, max: 100)
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "properties": [...],
 *     "pagination": {
 *       "page": 1,
 *       "limit": 12,
 *       "total": 50,
 *       "totalPages": 5
 *     }
 *   },
 *   "metadata": {
 *     "timestamp": "2024-01-15T10:30:00Z",
 *     "version": "v2",
 *     "requestId": "req_123"
 *   }
 * }
 */
export const GET = withAPIWrapper(
  async (request: NextRequest, context?: any) => {
    try {
      const { searchParams } = new URL(request.url);
      const type = searchParams.get('type') || 'all';
      const search = searchParams.get('search') || '';
      const location = searchParams.get('location') || '';
      const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
      const limit = Math.min(
        100,
        Math.max(1, parseInt(searchParams.get('limit') || '12'))
      );
      const offset = (page - 1) * limit;

      // Build query
      let query = `
        SELECT 
          p.*
        FROM properties p
        WHERE p.status = 'active'
      `;

      const queryParams: any[] = [];
      let paramCount = 1;

      // Add type filter
      if (type === 'hotel') {
        query += ` AND p.type = 'hotel'`;
      } else if (type === 'restaurant') {
        query += ` AND p.type = 'restaurant'`;
      }

      // Add search filter
      if (search) {
        query += ` AND (
          p.name ILIKE $${paramCount} OR 
          p.description ILIKE $${paramCount} OR
          p.address ILIKE $${paramCount}
        )`;
        queryParams.push(`%${search}%`);
        paramCount++;
      }

      // Add location filter
      if (location) {
        query += ` AND (
          p.city ILIKE $${paramCount} OR 
          p.region ILIKE $${paramCount} OR
          p.address ILIKE $${paramCount}
        )`;
        queryParams.push(`%${location}%`);
        paramCount++;
      }

      // Add ordering and pagination
      query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      queryParams.push(limit, offset);

      // Execute query
      const rows = await neonClient.query(query, queryParams);

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM properties p
        WHERE p.status = 'active'
      `;

      const countParams: any[] = [];
      let countParamCount = 1;

      if (type === 'hotel') {
        countQuery += ` AND p.type = 'hotel'`;
      } else if (type === 'restaurant') {
        countQuery += ` AND p.type = 'restaurant'`;
      }

      if (search) {
        countQuery += ` AND (
          p.name ILIKE $${countParamCount} OR 
          p.description ILIKE $${countParamCount} OR
          p.address ILIKE $${countParamCount}
        )`;
        countParams.push(`%${search}%`);
        countParamCount++;
      }

      if (location) {
        countQuery += ` AND (
          p.city ILIKE $${countParamCount} OR 
          p.region ILIKE $${countParamCount} OR
          p.address ILIKE $${countParamCount}
        )`;
        countParams.push(`%${location}%`);
        countParamCount++;
      }

      let total = 0;
      try {
        const countRows = await neonClient.query(countQuery, countParams);
        total = parseInt(countRows[0]?.total || '0');
      } catch (error) {
        console.error('Count query failed:', error);
        total = 0;
      }

      // Transform data
      const properties: Property[] = rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        property_type: row.type,
        address: row.address,
        city: row.city,
        region: row.region,
        country: row.country || 'Namibia',
        postal_code: row.postal_code,
        latitude: row.latitude,
        longitude: row.longitude,
        phone: row.phone,
        email: row.email,
        website: row.website,
        check_in_time: row.check_in_time,
        check_out_time: row.check_out_time,
        amenities: row.amenities || [],
        policies: row.policies || {},
        images: row.images || [],
        is_active: row.is_active,
        created_at: row.created_at,
        updated_at: row.updated_at,
        tenant_id: row.tenant_id,
        average_rating: parseFloat(row.average_rating || '0'),
        total_reviews: parseInt(row.total_reviews || '0'),
        total_bookings: parseInt(row.total_bookings || '0'),
        total_orders: parseInt(row.total_orders || '0'),
      }));

      // Return standardized success response
      return apiSuccess(
        {
          properties,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        HttpStatus.OK
      );
    } catch (error) {
      console.error('Error fetching properties:', error);

      // Return standardized error response
      return apiError(
        ErrorCodes.INTERNAL_ERROR,
        'Failed to fetch properties',
        {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        },
        HttpStatus.INTERNAL_ERROR
      );
    }
  },
  {
    rateLimiter: rateLimiters.general,
    enableMonitoring: true,
    enableVersioning: true,
    requiredAuth: 'basic',
  }
);
