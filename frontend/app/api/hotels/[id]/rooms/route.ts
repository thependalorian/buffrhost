/**
 * Hotel Rooms API Endpoint
 *
 * Fetches all rooms for a specific hotel
 * Features: Room listing, filtering, pagination
 * Location: app/api/hotels/[id]/rooms/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Database connection
const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

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

    const result = await pool.query(roomsQuery, [hotelId]);

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
