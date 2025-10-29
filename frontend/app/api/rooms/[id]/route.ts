/**
 * Individual Room API Endpoint
 *
 * Returns detailed room data from the Neon database
 * Location: app/api/rooms/[id]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const roomId = params.id;

  try {
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Get room details from database
    const roomQuery = `
      SELECT 
        r.id,
        r.property_id as "hotelId",
        h.name as "hotelName",
        r.room_number as "roomNumber",
        rt.name as "typeName",
        rt.description,
        rt.detailed_description as "detailedDescription",
        rt.max_occupancy as "maxOccupancy",
        rt.base_price as "basePrice",
        rt.size_sqm as "sizeSqm",
        rt.bed_type as "bedType",
        rt.bed_configuration as "bedConfiguration",
        rt.view_type as "viewType",
        rt.floor,
        rt.amenities,
        r.is_active as "isActive",
        r.created_at as "createdAt",
        r.updated_at as "updatedAt"
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN hospitality_properties h ON r.property_id = h.id
      WHERE r.id = $1
    `;

    const roomResult = await neonClient.query(roomQuery, [roomId]);

    if (roomResult.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const room = roomResult[0];

    // Fetch room images
    const imagesQuery = `
      SELECT 
        id,
        room_id as "roomId",
        image_url as "imageUrl",
        alt_text as "altText",
        sort_order as "sortOrder",
        is_active as "isActive",
        created_at as "createdAt"
      FROM room_images 
      WHERE room_id = $1 AND is_active = true
      ORDER BY sort_order, created_at
    `;
    const imagesResult = await neonClient.query(imagesQuery, [roomId]);

    // Fetch room availability for next 30 days
    const availabilityQuery = `
      SELECT 
        id,
        room_id as "roomId",
        date,
        is_available as "isAvailable",
        price,
        notes,
        created_at as "createdAt"
      FROM room_availability 
      WHERE room_id = $1 
        AND date >= CURRENT_DATE 
        AND date <= CURRENT_DATE + INTERVAL '30 days'
      ORDER BY date
    `;
    const availabilityResult = await neonClient.query(availabilityQuery, [
      roomId,
    ]);

    // Fetch room reviews
    const reviewsQuery = `
      SELECT 
        id,
        room_id as "roomId",
        customer_name as "customerName",
        rating,
        review_text as "reviewText",
        created_at as "createdAt",
        is_verified as "isVerified"
      FROM room_reviews 
      WHERE room_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;
    const reviewsResult = await neonClient.query(reviewsQuery, [roomId]);

    // Fetch similar rooms (same hotel, different room)
    const similarRoomsQuery = `
      SELECT 
        r.id,
        r.room_number as "roomNumber",
        rt.name as "typeName",
        rt.base_price as "basePrice",
        rt.size_sqm as "sizeSqm",
        rt.bed_type as "bedType",
        rt.view_type as "viewType",
        ri.image_url as "imageUrl",
        CASE WHEN ra.is_available = true THEN true ELSE false END as "isAvailable"
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      LEFT JOIN room_images ri ON r.id = ri.room_id AND ri.is_active = true AND ri.sort_order = 1
      LEFT JOIN room_availability ra ON r.id = ra.room_id AND ra.date = CURRENT_DATE
      WHERE r.property_id = $1 
        AND r.id != $2 
        AND r.is_active = true
      ORDER BY rt.base_price
      LIMIT 4
    `;
    const similarRoomsResult = await neonClient.query(similarRoomsQuery, [
      room.hotelId,
      roomId,
    ]);

    // Fetch room policies
    const policiesQuery = `
      SELECT 
        check_in_time as "checkInTime",
        check_out_time as "checkOutTime",
        cancellation_policy as "cancellationPolicy",
        smoking_policy as "smokingPolicy",
        pet_policy as "petPolicy",
        age_restrictions as "ageRestrictions",
        special_requests as "specialRequests"
      FROM hotel_details 
      WHERE property_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const policiesResult = await neonClient.query(policiesQuery, [
      room.hotelId,
    ]);

    // Transform the data to match the expected interface
    const transformedRoom = {
      id: room.id,
      hotelId: room.hotelId,
      hotelName: room.hotelName,
      roomNumber: room.roomNumber,
      typeName: room.typeName,
      description: room.description || '',
      detailedDescription: room.detailedDescription || '',
      maxOccupancy: room.maxOccupancy,
      basePrice: parseFloat(room.basePrice),
      sizeSqm: room.sizeSqm,
      bedType: room.bedType,
      bedConfiguration: room.bedConfiguration || '',
      viewType: room.viewType || 'city',
      floor: room.floor || 1,
      amenities: room.amenities || [],
      isActive: room.isActive,
      images: imagesResult,
      availability: availabilityResult,
      reviews: reviewsResult,
      similarRooms: similarRoomsResult,
      policies: policiesResult[0] || {
        checkInTime: '15:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        smokingPolicy: 'non-smoking',
        petPolicy: 'pets-not-allowed',
        ageRestrictions: 'Children of all ages welcome',
        specialRequests: ['Extra pillows', 'Late check-out', 'Early check-in'],
      },
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedRoom,
    });
  } catch (error) {
    console.error('Room API Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      roomId,
    });
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
