/**
 * Individual Hotel API Endpoint
 *
 * Returns detailed hotel data from the database
 * Location: app/api/hotels/[id]/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '@/lib/database/neon-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const hotelId = params.id;

  try {
    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Get hotel details from database
    const hotelQuery = `
      SELECT 
        id,
        name,
        property_type as "type",
        city as "location",
        address,
        phone,
        email,
        website,
        description,
        amenities,
        images,
        tenant_id as "tenantId",
        is_active as "status",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM hospitality_properties 
      WHERE id = $1 AND property_type = 'hotel'
    `;

    const hotelResult = await neonClient.query(hotelQuery, [hotelId]);

    if (hotelResult.length === 0) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
    }

    const hotel = hotelResult[0];

    // Fetch hotel images
    const imagesQuery = `
      SELECT 
        id,
        property_id as "propertyId",
        image_url as "imageUrl",
        image_type as "imageType",
        alt_text as "altText",
        sort_order as "sortOrder",
        is_active as "isActive",
        created_at as "createdAt"
      FROM property_images 
      WHERE property_id = $1 AND is_active = true
      ORDER BY sort_order, created_at
    `;
    const imagesResult = await neonClient.query(imagesQuery, [hotelId]);

    // Fetch hotel features
    const featuresQuery = `
      SELECT 
        id,
        property_id as "propertyId",
        feature_name as "featureName",
        feature_type as "featureType",
        description,
        is_active as "isActive",
        created_at as "createdAt"
      FROM property_features 
      WHERE property_id = $1 AND is_active = true
      ORDER BY feature_name
    `;
    const featuresResult = await neonClient.query(featuresQuery, [hotelId]);

    // Fetch hotel details
    const hotelDetailsQuery = `
      SELECT 
        id,
        property_id as "propertyId",
        star_rating as "starRating",
        check_in_time as "checkInTime",
        check_out_time as "checkOutTime",
        total_rooms as "totalRooms",
        available_rooms as "availableRooms",
        room_types as "roomTypes",
        amenities,
        policies,
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM hotel_details 
      WHERE property_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const hotelDetailsResult = await neonClient.query(hotelDetailsQuery, [
      hotelId,
    ]);

    // Fetch room types
    const roomTypesQuery = `
      SELECT 
        id,
        property_id as "propertyId",
        name as "typeName",
        description,
        max_occupancy as "maxOccupancy",
        base_price as "basePrice",
        size_sqm as "sizeSqm",
        bed_type as "bedType",
        amenities,
        is_active as "isActive",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM room_types 
      WHERE property_id = $1 AND is_active = true
      ORDER BY base_price
    `;
    const roomTypesResult = await neonClient.query(roomTypesQuery, [hotelId]);

    // Transform the data to match the expected interface
    const transformedHotel = {
      id: hotel.id,
      buffrId: hotel.id, // Use id as buffrId for now
      name: hotel.name,
      type: hotel.type,
      location: hotel.location,
      ownerId: '', // Not available in hospitality_properties
      tenantId: hotel.tenantId,
      status: hotel.status ? 'active' : 'inactive',
      description: hotel.description || '',
      address: hotel.address || '',
      phone: hotel.phone,
      email: hotel.email,
      website: hotel.website,
      rating: 4.5, // Default rating
      totalOrders: 0, // Not available in hospitality_properties
      totalRevenue: 0, // Not available in hospitality_properties
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
      images: imagesResult,
      features: featuresResult,
      reviews: [], // Will add later when we have the reviews table
      hotelDetails: hotelDetailsResult[0] || null,
      roomTypes: roomTypesResult,
    };

    return NextResponse.json({
      success: true,
      data: transformedHotel,
    });
  } catch (error) {
    console.error('Hotel API Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      hotelId,
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
