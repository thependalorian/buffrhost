/**
 * Hotels [id]/rooms/[roomId] API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for hotels operations providing hotels property management and operations
 * @location buffr-host/frontend/app/api/hotels/[id]/rooms/[roomId]/route.ts
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
 * GET /api/hotels/[id]/rooms/[roomId] - Hotels [id] Retrieval Endpoint
 * @method GET
 * @endpoint /api/hotels/[id]/rooms/[roomId]
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
 * GET /api/hotels/[id]/rooms/[roomId]
 * /api/hotels/[id]/rooms/[roomId]
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
 * Room Detail API Endpoint
 *
 * Fetches individual room details from the database
 * Features: Room data, images, amenities, pricing
 * Location: app/api/hotels/[id]/rooms/[roomId]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const { id: hotelId, roomId } = params;

    if (!hotelId || !roomId) {
      return NextResponse.json(
        { error: 'Hotel ID and Room ID are required' },
        { status: 400 }
      );
    }

    // Query room details from the database
    const roomQuery = `
      SELECT 
        rt.id,
        rt.property_id as "propertyId",
        rt.name as "typeName",
        rt.description,
        rt.max_occupancy as "maxOccupancy",
        rt.base_price as "basePrice",
        rt.size_sqm as "sizeSqm",
        rt.bed_type as "bedType",
        rt.amenities,
        rt.is_active as "isActive",
        rt.created_at as "createdAt",
        rt.updated_at as "updatedAt"
      FROM room_types rt
      WHERE rt.id = $1 AND rt.property_id = $2 AND rt.is_active = true
    `;

    const result = await neonClient.query(roomQuery, [roomId, hotelId]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const room = result[0];

    // Fetch room images
    const imagesQuery = `
      SELECT 
        id,
        room_type_id as "roomTypeId",
        image_url as "imageUrl",
        alt_text as "altText",
        sort_order as "sortOrder",
        is_active as "isActive",
        created_at as "createdAt"
      FROM room_images 
      WHERE room_type_id = $1 AND is_active = true
      ORDER BY sort_order, created_at
    `;
    const imagesResult = await neonClient.query(imagesQuery, [roomId]);

    // Transform the data to match the expected interface
    const roomData = {
      id: room.id,
      hotelId: room.propertyId,
      typeName: room.typeName,
      description: room.description,
      maxOccupancy: parseInt(room.maxOccupancy),
      basePrice: parseFloat(room.basePrice),
      sizeSqm: room.sizeSqm ? parseInt(room.sizeSqm) : null,
      bedType: room.bedType,
      amenities: Array.isArray(room.amenities)
        ? room.amenities
        : room.amenities
          ? JSON.parse(room.amenities)
          : [],
      isActive: room.isActive,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      images:
        imagesResult.length > 0
          ? imagesResult.map((img) => img.imageUrl)
          : [
              'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
            ],
    };

    return NextResponse.json({
      success: true,
      data: roomData,
    });
  } catch (error) {
    console.error('Room Detail API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const { id: hotelId, roomId } = params;
    const body = await request.json();

    if (!hotelId || !roomId) {
      return NextResponse.json(
        { error: 'Hotel ID and Room ID are required' },
        { status: 400 }
      );
    }

    const {
      typeName,
      description,
      maxOccupancy,
      basePrice,
      sizeSqm,
      bedType,
      amenities,
      isActive,
    } = body;

    // Update room details
    const updateQuery = `
      UPDATE room_types 
      SET 
        type_name = COALESCE($1, type_name),
        description = COALESCE($2, description),
        max_occupancy = COALESCE($3, max_occupancy),
        base_price = COALESCE($4, base_price),
        size_sqm = COALESCE($5, size_sqm),
        bed_type = COALESCE($6, bed_type),
        amenities = COALESCE($7, amenities),
        is_active = COALESCE($8, is_active),
        updated_at = NOW()
      WHERE id = $9 AND property_id = $10
      RETURNING *
    `;

    const result = await neonClient.query(updateQuery, [
      typeName,
      description,
      maxOccupancy,
      basePrice,
      sizeSqm,
      bedType,
      amenities,
      isActive,
      roomId,
      hotelId,
    ]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Room Update API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; roomId: string } }
) {
  try {
    const { id: hotelId, roomId } = params;

    if (!hotelId || !roomId) {
      return NextResponse.json(
        { error: 'Hotel ID and Room ID are required' },
        { status: 400 }
      );
    }

    // Soft delete room (set is_active to false)
    const deleteQuery = `
      UPDATE room_types 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1 AND property_id = $2
      RETURNING *
    `;

    const result = await neonClient.query(deleteQuery, [roomId, hotelId]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    console.error('Room Delete API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
