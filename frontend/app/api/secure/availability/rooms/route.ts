/**
 * Room Availability API Route
 *
 * Purpose: Handle room availability checking for hotels
 * Functionality: Check room availability for date range
 * Location: /app/api/secure/availability/rooms/route.ts
 *
 * Follows 40 Rules:
 * - Uses Neon PostgreSQL database
 * - Vercel-compatible with SSR
 * - Comprehensive error handling
 * - TypeScript for type safety
 * - Security and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonDb } from '@/lib/neon-db';

// Types for TypeScript compliance
interface RoomAvailabilityRequest {
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  room_type?: string;
}

// POST - Check room availability
export async function POST(request: NextRequest) {
  try {
    const body: RoomAvailabilityRequest = await request.json();

    // Validate required fields
    if (!body.property_id || !body.check_in_date || !body.check_out_date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { property_id, check_in_date, check_out_date, room_type } = body;

    // Build query for available rooms
    let query = `
      SELECT 
        r.id as room_id,
        r.room_number,
        r.room_type,
        r.capacity,
        r.base_price,
        r.status,
        r.amenities
      FROM rooms r
      WHERE r.property_id = $1
        AND r.status = 'available'
    `;

    const params = [property_id];
    let paramIndex = 2;

    if (room_type) {
      query += ` AND r.room_type = $${paramIndex}`;
      params.push(room_type);
      paramIndex++;
    }

    query += ` ORDER BY r.base_price ASC`;

    const roomsResult = await neonDb.query(query, params);

    if (roomsResult.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          total_available: 0,
          total_rooms: 0,
          available_rooms: [],
        },
      });
    }

    // Get current bookings that overlap with the requested date range
    const bookingsResult = await neonDb.query(
      `
      SELECT DISTINCT rb.room_id
      FROM room_bookings rb
      WHERE rb.property_id = $1 
        AND rb.status IN ('confirmed', 'pending')
        AND (
          (rb.check_in_date <= $2 AND rb.check_out_date > $2) OR
          (rb.check_in_date < $3 AND rb.check_out_date >= $3) OR
          (rb.check_in_date >= $2 AND rb.check_out_date <= $3)
        )
    `,
      [property_id, check_in_date, check_out_date]
    );

    // Create a set of booked room IDs
    const bookedRoomIds = new Set(bookingsResult.map((b) => b.room_id));

    // Filter available rooms
    const available_rooms = roomsResult
      .filter((room) => !bookedRoomIds.has(room.room_id))
      .map((room) => ({
        room_id: room.room_id,
        room_number: room.room_number,
        room_type: room.room_type,
        capacity: room.capacity,
        base_price: parseFloat(room.base_price),
        is_available: true,
        room_status: room.status,
        amenities: room.amenities ? JSON.parse(room.amenities) : [],
      }));

    const total_available = available_rooms.length;
    const total_rooms = roomsResult.length;

    return NextResponse.json({
      success: true,
      data: {
        total_available,
        total_rooms,
        available_rooms,
        checked_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error checking room availability:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
