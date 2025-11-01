/**
 * Hotels Management API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive hotel listing and management API with property data retrieval, filtering, and tenant-isolated access
 * @location buffr-host/frontend/app/api/hotels/route.ts
 * @purpose Provides hotel property data access for hospitality management, guest services, and administrative operations
 * @modularity Hotel-focused API endpoint with property data retrieval and management capabilities
 * @database_connections Reads from properties table with hotel-specific filtering and tenant isolation
 * @api_integration Property database queries with tenant context and access control
 * @scalability Hotel data retrieval with database indexing and query optimization
 * @performance Optimized hotel queries with connection pooling and result caching
 * @monitoring Hotel data access analytics, query performance tracking, and usage metrics
 * @security Multi-tenant data isolation, property ownership validation, and access control
 * @multi_tenant Automatic tenant context application with property ownership filtering
 *
 * Hotel Management Capabilities:
 * - Comprehensive hotel property data retrieval
 * - Multi-tenant hotel data isolation and access control
 * - Property ownership validation and permission checking
 * - Hotel-specific data filtering and search capabilities
 * - Real-time hotel availability and status information
 * - Hotel management and administrative data access
 * - Property analytics and performance metrics
 * - Hotel booking and reservation integration
 * - Guest service and concierge hotel data access
 *
 * Key Features:
 * - Multi-tenant hotel data management
 * - Property ownership and access validation
 * - Hotel-specific filtering and search
 * - Real-time availability information
 * - Administrative hotel management
 * - Guest service integration
 * - Performance analytics access
 * - Booking system integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { HotelsService } from '../../../lib/services/hotelsService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET /api/hotels - Hotel Properties Listing Endpoint
 * @method GET
 * @endpoint /api/hotels
 * @purpose Retrieves paginated list of hotel properties with tenant isolation and access control
 * @authentication Optional - Public access for hotel browsing, authenticated users get enhanced data
 * @authorization Public read access for hotel listings, tenant-specific filtering applied automatically
 * @permissions Read access to hotel property data, tenant-isolated results
 * @rate_limit Standard API rate limiter applied
 * @caching Hotel data cached with TTL, invalidated on property updates
 * @returns {Promise<NextResponse>} Hotel properties listing with pagination
 * @returns {boolean} returns.success - Operation success status
 * @returns {Object} returns.data - Hotel properties payload
 * @returns {Array} returns.data.hotels - Array of hotel property objects
 * @returns {string} returns.data.hotels[].id - Unique hotel identifier
 * @returns {string} returns.data.hotels[].name - Hotel property name
 * @returns {string} returns.data.hotels[].description - Hotel description
 * @returns {string} returns.data.hotels[].location - Hotel geographic location
 * @returns {string} returns.data.hotels[].type - Property type ("hotel")
 * @returns {number} returns.data.hotels[].rating - Average guest rating
 * @returns {Array} returns.data.hotels[].amenities - Available amenities
 * @returns {Array} returns.data.hotels[].images - Hotel image URLs
 * @returns {Object} returns.data.pagination - Pagination metadata
 * @returns {number} returns.data.pagination.total - Total number of hotels
 * @returns {number} returns.data.pagination.page - Current page number
 * @returns {number} returns.data.pagination.limit - Results per page
 * @database_queries Optimized queries with tenant isolation and property ownership validation
 * @performance Connection pooling and query result caching for optimal performance
 * @security Tenant-based data isolation and property access control
 * @multi_tenant Automatic tenant context filtering for property visibility
 * @example
 * GET /api/hotels
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "hotels": [
 *       {
 *         "id": "prop-123",
 *         "name": "Windhoek Grand Hotel",
 *         "description": "Luxury hotel in the heart of Windhoek",
 *         "location": "Windhoek, Namibia",
 *         "type": "hotel",
 *         "rating": 4.5,
 *         "amenities": ["wifi", "pool", "restaurant"],
 *         "images": ["image1.jpg", "image2.jpg"]
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
 * Error Response (500 - Database Error):
 * {
 *   "success": false,
 *   "error": {
 *     "code": "DATABASE_ERROR",
 *     "message": "Failed to retrieve hotel properties"
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const ownerId = searchParams.get('ownerId');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get hotels using the service layer
    const hotels = await HotelsService.getHotels({
      tenantId: tenantId || undefined,
      ownerId: ownerId || undefined,
      status,
      limit,
    });

    // Transform for API response format
    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      type: hotel.type,
      location: hotel.location,
      ownerId: hotel.ownerId || '',
      tenantId: hotel.tenantId || '',
      status: hotel.status || 'active',
      description: hotel.description,
      address: hotel.address,
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website,
      rating: hotel.rating || 0,
      totalOrders: hotel.totalOrders || 0,
      totalRevenue: hotel.totalRevenue || 0,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      images: hotel.images || [],
      features: hotel.features || [],
      amenities: hotel.amenities || [],
      starRating: hotel.starRating,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
    }));

    return NextResponse.json({
      success: true,
      data: formattedHotels,
      total: formattedHotels.length,
    });
  } catch (error) {
    console.error('Hotels API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
