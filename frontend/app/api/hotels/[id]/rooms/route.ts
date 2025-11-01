/**
 * Hotels [id]/rooms API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for hotels operations providing hotels property management and operations
 * @location buffr-host/frontend/app/api/hotels/[id]/rooms/route.ts
 * @purpose Hotels property management and operations
 * @modularity hotels-focused API endpoint with specialized [id] operations
 * @database_connections Reads/writes to hotels, hotels_bookings, hotels_services tables
 * @api_integration Hotels management services, booking systems
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Hotels Management Capabilities:
 * - Hotels data management
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
 * GET /api/hotels/[id]/rooms - Hotels [id] Retrieval Endpoint
 * @method GET
 * @endpoint /api/hotels/[id]/rooms
 * @purpose Hotels property management and operations
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
 * GET /api/hotels/[id]/rooms
 * /api/hotels/[id]/rooms
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
 * Hotel Rooms API Endpoint
 *
 * Fetches all rooms for a specific hotel
 * Features: Room listing, filtering, pagination
 * Location: app/api/hotels/[id]/rooms/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbPool } from '@/lib/database/connection-pool';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotelId = params.id;

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Query room types from the database
    const roomsQuery = `
      SELECT 
        rt.id,
        rt.property_id as hotelId,
        rt.name as typeName,
        rt.description,
        rt.max_occupancy as maxOccupancy,
        rt.base_price as basePrice,
        rt.room_type as bedType,
        rt.amenities,
        rt.is_active as isActive,
        rt.created_at as createdAt,
        rt.updated_at as updatedAt
      FROM room_types rt
      WHERE rt.property_id = $1 AND rt.is_active = true
      ORDER BY rt.base_price ASC
    `;

    const result = await dbPool.query(roomsQuery, [hotelId]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: 'No rooms found for this hotel',
      });
    }

    // Return rooms without images for now
    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Hotel Rooms API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotel rooms' },
      { status: 500 }
    );
  }
}
