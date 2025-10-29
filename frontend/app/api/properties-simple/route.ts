import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '../../../lib/database/neon-client';
import { ApiResponse, Property } from '../../../lib/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '12');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    console.log('Simple API Parameters:', { type, limit, page, offset });

    // Simple query without parameters
    let query = `
      SELECT 
        p.*
      FROM properties p
      WHERE p.status = 'active'
    `;

    if (type === 'hotel') {
      query += ` AND p.type = 'hotel'`;
    } else if (type === 'restaurant') {
      query += ` AND p.type = 'restaurant'`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    console.log('Executing query:', query);

    // Execute the query
    const result = await neonClient.query(query);
    console.log('Query result length:', result.length);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM properties p
      WHERE p.status = 'active'
    `;

    if (type === 'hotel') {
      countQuery += ` AND p.type = 'hotel'`;
    } else if (type === 'restaurant') {
      countQuery += ` AND p.type = 'restaurant'`;
    }

    const countResult = await neonClient.query(countQuery);
    const total = parseInt(countResult[0]?.total || '0');

    // Transform the data
    const properties: Property[] = result.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      property_type: row.type,
      address: row.address,
      city: row.location?.split(',')[0] || '',
      region: row.location?.split(',')[1] || '',
      country: 'Namibia',
      postal_code: '',
      latitude: null,
      longitude: null,
      phone: row.phone,
      email: row.email,
      website: row.website,
      check_in_time: null,
      check_out_time: null,
      amenities: row.amenities || [],
      policies: row.policies || {},
      images: row.images || [],
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tenant_id: row.tenant_id,
      // Additional computed fields
      average_rating: parseFloat(row.rating || '0'),
      total_reviews: parseInt(row.total_reviews || '0'),
      total_bookings: 0,
      total_orders: parseInt(row.total_orders || '0'),
      recent_reviews: [],
      // Hotel-specific data
      hotel_details: row.type === 'hotel' ? {
        id: row.id,
        property_id: row.id,
        star_rating: 4,
        room_count: 20,
        check_in_time: '15:00',
        check_out_time: '11:00',
        amenities: ['wifi', 'air_conditioning'],
        policies: {},
        created_at: row.created_at,
        updated_at: row.updated_at
      } : undefined,
      // Restaurant-specific data
      restaurant_details: row.type === 'restaurant' ? {
        id: row.id,
        property_id: row.id,
        cuisine_type: 'International',
        price_range: '$$',
        seating_capacity: 50,
        operating_hours: {},
        special_features: [],
        created_at: row.created_at,
        updated_at: row.updated_at
      } : undefined,
    }));

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<{
      properties: Property[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    }> = {
      success: true,
      data: {
        properties,
        pagination: {
          page,
          limit,
          total,
          total_pages: totalPages,
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Database query error:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}