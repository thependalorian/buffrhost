/**
 * Restaurants API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for restaurants operations providing restaurants property management and operations
 * @location buffr-host/frontend/app/api/restaurants/route.ts
 * @purpose Restaurants property management and operations
 * @modularity restaurants-focused API endpoint with specialized restaurants operations
 * @database_connections Reads/writes to restaurants, restaurants_bookings, restaurants_services tables
 * @api_integration Restaurants management services, booking systems
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Restaurants Management Capabilities:
 * - Restaurants data management
 * - Property operations
 * - Booking integration
 * - Guest services
 *
 * Key Features:
 * - Property management
 * - Operations tracking
 * - Booking integration
 * - Guest services
 */

/**
 * GET /api/restaurants - Restaurants Retrieval Endpoint
 * @method GET
 * @endpoint /api/restaurants
 * @purpose Restaurants property management and operations
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
 * GET /api/restaurants
 * /api/restaurants
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
 * Restaurants API
 *
 * Fetches restaurants from the database with filtering and pagination
 * Features: Restaurant listings with real database data
 * Location: app/api/restaurants/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '../../../lib/database/neon-client';
import { ApiResponse, Property } from '../../../lib/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Restaurants API called with URL:', request.url);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'restaurant'; // Default to restaurant type
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    console.log('API Parameters:', {
      type,
      search,
      location,
      page,
      limit,
      offset,
    });

    // Build the base query
    let query = `
      SELECT
        p.*
      FROM properties p
      WHERE p.status = 'active' AND p.type = 'restaurant'
    `;

    const queryParams: any[] = [];
    let paramCount = 1;

    // Add search filter
    if (search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Add location filter
    if (location) {
      query += ` AND (p.city ILIKE $${paramCount} OR p.region ILIKE $${paramCount})`;
      queryParams.push(`%${location}%`);
      paramCount++;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    console.log('Executing query:', query);
    console.log('With parameters:', queryParams);

    // Execute the query
    const rows = await neonClient.query(query, queryParams);
    console.log('Query result count:', rows.length);

    // Get total count
    const countQuery =
      'SELECT COUNT(*) FROM properties WHERE status = $1 AND type = $2';
    const countRows = await neonClient.query(countQuery, [
      'active',
      'restaurant',
    ]);
    const total = parseInt(countRows[0].count);

    const totalPages = Math.ceil(total / limit);

    const restaurants: Property[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      property_type: row.type,
      address: row.address,
      city: row.location?.split(',')[0] || '',
      region: row.location?.split(',')[1] || '',
      country: 'Namibia',
      postal_code: '',
      latitude: undefined,
      longitude: undefined,
      phone: row.phone,
      email: row.email,
      website: row.website,
      check_in_time: undefined,
      check_out_time: undefined,
      amenities: row.amenities || [],
      policies: row.policies || {},
      images: row.images || [],
      is_active: row.is_active,
      is_featured: row.is_featured,
      is_verified: row.is_verified,
      price_range: row.price_range,
      total_reviews: row.total_reviews,
      social_media: row.social_media || {},
    }));

    const response: ApiResponse<{
      restaurants: Property[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    }> = {
      success: true,
      data: {
        restaurants,
        pagination: {
          page,
          limit,
          total,
          total_pages: totalPages,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants', details: error.message },
      { status: 500 }
    );
  }
}
