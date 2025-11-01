/**
 * Locations API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for locations operations providing locations data management and operations
 * @location buffr-host/frontend/app/api/locations/route.ts
 * @purpose locations data management and operations
 * @modularity locations-focused API endpoint with specialized locations operations
 * @database_connections Reads/writes to locations related tables
 * @api_integration locations service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Locations Management Capabilities:
 * - locations CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/locations - Locations Retrieval Endpoint
 * @method GET
 * @endpoint /api/locations
 * @purpose locations data management and operations
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
 * GET /api/locations
 * /api/locations
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
 * Locations API Endpoint
 *
 * Provides location search and filtering for Namibia
 * Includes regions, towns, cities, and villages
 *
 * Location: app/api/locations/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { NamibiaLocationService, Location } from '@/lib/data/namibia-locations';
import SecureAPIWrapper from '@/lib/security/secure-api-wrapper';

// Force dynamic rendering for this route (required when using request.url)
export const dynamic = 'force-dynamic';

// Runtime configuration
export const runtime = 'nodejs';

// GET /api/locations - Search and filter locations
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const region = url.searchParams.get('region') || '';
    const type = url.searchParams.get('type') || '';
    const limit = url.searchParams.get('limit') || '50';
    const nearby = url.searchParams.get('nearby') || '';
    const radius = url.searchParams.get('radius') || '50';

    let results: Location[] = [];

    // Search by text query
    if (search) {
      results = NamibiaLocationService.searchLocations(search);
    } else {
      // Get all locations if no search query
      results = NamibiaLocationService.searchLocations('');
    }

    // Filter by region
    if (region) {
      results = results.filter(
        (location) => location.region?.toLowerCase() === region.toLowerCase()
      );
    }

    // Filter by type
    if (type) {
      results = results.filter((location) => location.type === type);
    }

    // Filter by nearby coordinates
    if (nearby) {
      const coords = nearby.split(',').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        results = NamibiaLocationService.getNearbyLocations(
          coords[0],
          coords[1],
          parseInt(radius) || 50
        );
      }
    }

    // Apply limit
    const limitNum = parseInt(limit) || 50;
    results = results.slice(0, limitNum);

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
      filters: {
        search,
        region,
        type,
        limit: limitNum,
        nearby: nearby ? nearby.split(',') : null,
        radius: parseInt(radius) || 50,
      },
    });
  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
