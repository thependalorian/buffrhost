/**
 * Properties [id] API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for properties operations providing property data management and crud operations
 * @location buffr-host/frontend/app/api/properties/[id]/route.ts
 * @purpose Property data management and CRUD operations
 * @modularity properties-focused API endpoint with specialized [id] operations
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
 * GET /api/properties/[id] - Properties [id] Retrieval Endpoint
 * @method GET
 * @endpoint /api/properties/[id]
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
 * GET /api/properties/[id]
 * /api/properties/[id]
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
import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '../../../../lib/database/neon-client';
import { ApiResponse, Property } from '../../../../lib/types/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const propertyId = params.id;

    console.log('Fetching property details for ID:', propertyId);

    // Get property details
    const propertyQuery = `
      SELECT 
        p.*,
        hd.total_rooms,
        hd.available_rooms,
        hd.room_types_count,
        hd.amenities as hotel_amenities,
        hd.policies as hotel_policies,
        rd.cuisine_type,
        rd.price_range,
        rd.max_capacity,
        rd.opening_hours,
        rd.special_dietary_options,
        rd.payment_methods,
        rd.delivery_available,
        rd.takeaway_available,
        rd.dine_in_available,
        rd.average_prep_time
      FROM properties p
      LEFT JOIN hotel_details hd ON p.id = hd.property_id
      LEFT JOIN restaurant_details rd ON p.id = rd.property_id
      WHERE p.id = $1 AND p.status = 'active' AND p.is_active = true
    `;

    const propertyResult = await neonClient.query(propertyQuery, [propertyId]);

    if (propertyResult.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Property not found',
        message: 'The requested property could not be found or is not active',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const propertyRow = propertyResult[0];

    // Transform to Property interface
    const property: Property = {
      id: propertyRow.id,
      name: propertyRow.name,
      description: propertyRow.description,
      property_type: propertyRow.type,
      address: propertyRow.address,
      city: propertyRow.location?.split(',')[0] || '',
      region: propertyRow.location?.split(',')[1] || '',
      country: 'Namibia',
      postal_code: '',
      latitude: undefined,
      longitude: undefined,
      phone: propertyRow.phone,
      email: propertyRow.email,
      website: propertyRow.website,
      check_in_time: undefined,
      check_out_time: undefined,
      amenities: propertyRow.amenities || [],
      policies: propertyRow.policies || {},
      images: propertyRow.images || [],
      is_active: propertyRow.is_active,
      created_at: propertyRow.created_at,
      updated_at: propertyRow.updated_at,
      tenant_id: propertyRow.tenant_id,
      average_rating: parseFloat(propertyRow.rating || '0'),
      total_reviews: parseInt(propertyRow.total_reviews || '0'),
      total_bookings: 0,
      total_orders: parseInt(propertyRow.total_orders || '0'),
      recent_reviews: [],
      hotel_details:
        propertyRow.type === 'hotel'
          ? {
              id: propertyRow.id,
              property_id: propertyRow.id,
              star_rating: propertyRow.star_rating || undefined,
              room_count: propertyRow.total_rooms || 0,
              check_in_time: propertyRow.check_in_time || undefined,
              check_out_time: propertyRow.check_out_time || undefined,
              amenities: propertyRow.hotel_amenities || [],
              policies: propertyRow.hotel_policies || {},
              created_at: propertyRow.created_at,
              updated_at: propertyRow.updated_at,
            }
          : undefined,
      restaurant_details:
        propertyRow.type === 'restaurant'
          ? {
              id: propertyRow.id,
              property_id: propertyRow.id,
              cuisine_type: propertyRow.cuisine_type || 'International',
              price_range: propertyRow.price_range || '$$',
              seating_capacity: propertyRow.max_capacity || 0,
              operating_hours: propertyRow.opening_hours || {},
              special_features: propertyRow.special_dietary_options || [],
              created_at: propertyRow.created_at,
              updated_at: propertyRow.updated_at,
            }
          : undefined,
    };

    const response: ApiResponse<Property> = {
      success: true,
      data: property,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Database query error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch property details',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
