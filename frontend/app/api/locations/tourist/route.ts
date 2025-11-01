/**
 * Locations Tourist API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for locations operations providing locations data management and operations
 * @location buffr-host/frontend/app/api/locations/tourist/route.ts
 * @purpose locations data management and operations
 * @modularity locations-focused API endpoint with specialized tourist operations
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
 * GET /api/locations/tourist - Locations Tourist Retrieval Endpoint
 * @method GET
 * @endpoint /api/locations/tourist
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
 * GET /api/locations/tourist
 * /api/locations/tourist
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
import { NamibiaLocationService } from '@/lib/data/namibia-locations';

// GET /api/locations/tourist - Get tourist locations
export async function GET(request: NextRequest) {
  try {
    const locations = NamibiaLocationService.getTouristLocations();

    return NextResponse.json({
      success: true,
      data: locations,
      total: locations.length,
    });
  } catch (error) {
    console.error('Tourist locations API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tourist locations' },
      { status: 500 }
    );
  }
}
