/**
 * Properties API
 *
 * Fetches properties from the database with filtering and pagination
 * Features: Hotel and restaurant listings with real database data
 * Location: app/api/properties/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonClient } from '../../../lib/database/neon-client';
import { ApiResponse, Property } from '../../../lib/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Properties API called with URL:', request.url);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'hotel', 'restaurant', or 'all'
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    console.log('API Parameters:', { type, search, location, page, limit, offset });

    // Build the base query - simplified for testing
    let query = `
      SELECT 
        p.*
      FROM properties p
      WHERE p.status = 'active'
    `;

    const queryParams: any[] = [];
    let paramCount = 1;

    // Add type filter
    if (type === 'hotel') {
      query += ` AND p.type = 'hotel'`;
    } else if (type === 'restaurant') {
      query += ` AND p.type = 'restaurant'`;
    }

    // Add search filter
    if (search) {
      query += ` AND (
        p.name ILIKE $${paramCount} OR 
        p.description ILIKE $${paramCount} OR
        p.address ILIKE $${paramCount}
      )`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Add location filter
    if (location) {
      query += ` AND (
        p.city ILIKE $${paramCount} OR 
        p.region ILIKE $${paramCount} OR
        p.address ILIKE $${paramCount}
      )`;
      queryParams.push(`%${location}%`);
      paramCount++;
    }

    // Add ordering and pagination
    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    // Execute the query
    console.log('Executing query:', query);
    console.log('Query params:', queryParams);
    
    let result;
    if (queryParams.length === 0) {
      result = await neonClient.query(query);
    } else {
      result = await neonClient.query(query, queryParams);
    }
    console.log('Query result:', result);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM properties p
      WHERE p.status = 'active'
    `;

    const countParams: any[] = [];
    let countParamCount = 1;

    if (type === 'hotel') {
      countQuery += ` AND p.type = 'hotel'`;
    } else if (type === 'restaurant') {
      countQuery += ` AND p.type = 'restaurant'`;
    }

    if (search) {
      countQuery += ` AND (
        p.name ILIKE $${countParamCount} OR 
        p.description ILIKE $${countParamCount} OR
        p.address ILIKE $${countParamCount}
      )`;
      countParams.push(`%${search}%`);
      countParamCount++;
    }

    if (location) {
      countQuery += ` AND (
        p.city ILIKE $${countParamCount} OR 
        p.region ILIKE $${countParamCount} OR
        p.address ILIKE $${countParamCount}
      )`;
      countParams.push(`%${location}%`);
      countParamCount++;
    }

    let total = 0;
    try {
      const countResult = await neonClient.query(countQuery, countParams);
      total = parseInt((countResult as any).rows[0]?.total || '0');
    } catch (error) {
      console.log('Count query failed, using 0:', error.message);
      total = 0;
    }

    // Transform the data to match our Property interface
    const rows = (result as any)?.rows || [];
    const properties: Property[] = rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      property_type: row.type,
      address: row.address,
      city: row.city,
      region: row.region,
      country: row.country,
      postal_code: row.postal_code,
      latitude: row.latitude,
      longitude: row.longitude,
      phone: row.phone,
      email: row.email,
      website: row.website,
      check_in_time: row.check_in_time,
      check_out_time: row.check_out_time,
      amenities: row.amenities || [],
      policies: row.policies || {},
      images: row.images || [],
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
      tenant_id: row.tenant_id,
      // Additional computed fields
      average_rating: parseFloat(row.average_rating || '0'),
      total_reviews: parseInt(row.total_reviews || '0'),
      total_bookings: parseInt(row.total_bookings || '0'),
      total_orders: parseInt(row.total_orders || '0'),
      // Hotel-specific data
      hotel_details: row.type === 'hotel' ? {
        id: row.id,
        property_id: row.property_id,
        star_rating: row.star_rating,
        room_count: row.room_count,
        check_in_time: row.check_in_time,
        check_out_time: row.check_out_time,
        amenities: row.amenities || [],
        policies: row.policies || {},
        created_at: row.created_at,
        updated_at: row.updated_at
      } : undefined,
      // Restaurant-specific data
      restaurant_details: row.type === 'restaurant' ? {
        id: row.id,
        property_id: row.property_id,
        cuisine_type: row.cuisine_type,
        price_range: row.price_range,
        seating_capacity: row.seating_capacity,
        operating_hours: row.operating_hours || {},
        special_features: row.special_features || [],
        created_at: row.created_at,
        updated_at: row.updated_at
      } : undefined
    }));

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
          total_pages: Math.ceil(total / limit)
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching properties:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch properties',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}