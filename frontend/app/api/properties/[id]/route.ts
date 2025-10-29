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
      latitude: null,
      longitude: null,
      phone: propertyRow.phone,
      email: propertyRow.email,
      website: propertyRow.website,
      check_in_time: null,
      check_out_time: null,
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
      hotel_details: propertyRow.type === 'hotel' ? {
        id: propertyRow.id,
        property_id: propertyRow.id,
        total_rooms: propertyRow.total_rooms || 0,
        available_rooms: propertyRow.available_rooms || 0,
        room_types_count: propertyRow.room_types_count || 0,
        amenities: propertyRow.hotel_amenities || [],
        policies: propertyRow.hotel_policies || {},
        created_at: propertyRow.created_at,
        updated_at: propertyRow.updated_at
      } : undefined,
      restaurant_details: propertyRow.type === 'restaurant' ? {
        id: propertyRow.id,
        property_id: propertyRow.id,
        cuisine_type: propertyRow.cuisine_type || 'International',
        price_range: propertyRow.price_range || '$$',
        max_capacity: propertyRow.max_capacity || 0,
        opening_hours: propertyRow.opening_hours || {},
        special_dietary_options: propertyRow.special_dietary_options || [],
        payment_methods: propertyRow.payment_methods || [],
        delivery_available: propertyRow.delivery_available || false,
        takeaway_available: propertyRow.takeaway_available || false,
        dine_in_available: propertyRow.dine_in_available || true,
        average_prep_time: propertyRow.average_prep_time || 30,
        created_at: propertyRow.created_at,
        updated_at: propertyRow.updated_at
      } : undefined,
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