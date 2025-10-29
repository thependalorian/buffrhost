/**
 * Properties API Route
 *
 * Purpose: Handle property creation and management
 * Functionality: Create, read, update, delete properties
 * Location: /app/api/secure/properties/route.ts
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
interface PropertyData {
  name: string;
  type: string;
  location: string;
  description: string;
  address: string;
  property_code: string;
  capacity: number;
  phone: string;
  email: string;
  website: string;
  cuisine_type?: string;
  price_range?: string;
  star_rating?: number;
  check_in_time?: string;
  check_out_time?: string;
  minimum_stay?: number;
  maximum_stay?: number;
  opening_hours: Record<string, unknown>;
  amenities: string[];
  cancellation_policy?: string;
  house_rules?: string;
  instant_booking: boolean;
  featured: boolean;
  social_media: Record<string, unknown>;
  owner_id: string;
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const body: PropertyData = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.type ||
      !body.location ||
      !body.address ||
      !body.owner_id
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate property ID
    const _propertyId = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Insert property into database
    const result = await neonDb.query(
      `
      INSERT INTO properties (
        id, name, type, location, description, address, property_code, capacity,
        phone, email, website, cuisine_type, price_range, star_rating,
        check_in_time, check_out_time, minimum_stay, maximum_stay,
        opening_hours, amenities, cancellation_policy, house_rules,
        instant_booking, featured, social_media, owner_id, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, NOW(), NOW()
      )
      RETURNING *
    `,
      [
        propertyId,
        body.name,
        body.type,
        body.location,
        body.description || '',
        body.address,
        body.property_code ||
          `${body.type.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        body.capacity || 0,
        body.phone,
        body.email,
        body.website || '',
        body.cuisine_type || '',
        body.price_range || '',
        body.star_rating || 0,
        body.check_in_time || '15:00',
        body.check_out_time || '11:00',
        body.minimum_stay || 1,
        body.maximum_stay || 0,
        JSON.stringify(body.opening_hours),
        JSON.stringify(body.amenities),
        body.cancellation_policy || '',
        body.house_rules || '',
        body.instant_booking || false,
        body.featured || false,
        JSON.stringify(body.social_media),
      ]
    );

    if (result.length === 0) {
      throw new Error('Failed to create property');
    }

    const property = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: property.id,
        name: property.name,
        type: property.type,
        location: property.location,
        description: property.description,
        address: property.address,
        property_code: property.property_code,
        capacity: property.capacity,
        phone: property.phone,
        email: property.email,
        website: property.website,
        cuisine_type: property.cuisine_type,
        price_range: property.price_range,
        star_rating: property.star_rating,
        check_in_time: property.check_in_time,
        check_out_time: property.check_out_time,
        minimum_stay: property.minimum_stay,
        maximum_stay: property.maximum_stay,
        opening_hours: JSON.parse(property.opening_hours),
        amenities: JSON.parse(property.amenities),
        cancellation_policy: property.cancellation_policy,
        house_rules: property.house_rules,
        instant_booking: property.instant_booking,
        featured: property.featured,
        social_media: JSON.parse(property.social_media),
        owner_id: property.owner_id,
        created_at: property.created_at,
        updated_at: property.updated_at,
      },
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM properties WHERE 1=1';
    const params: string[] = [];
    let paramIndex = 1;

    if (ownerId) {
      query += ` AND owner_id = $${paramIndex}`;
      params.push(ownerId);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await neonDb.query(query, params);

    const properties = result.map((property) => ({
      id: property.id,
      name: property.name,
      type: property.type,
      location: property.location,
      description: property.description,
      address: property.address,
      property_code: property.property_code,
      capacity: property.capacity,
      phone: property.phone,
      email: property.email,
      website: property.website,
      cuisine_type: property.cuisine_type,
      price_range: property.price_range,
      star_rating: property.star_rating,
      check_in_time: property.check_in_time,
      check_out_time: property.check_out_time,
      minimum_stay: property.minimum_stay,
      maximum_stay: property.maximum_stay,
      opening_hours: JSON.parse(property.opening_hours),
      amenities: JSON.parse(property.amenities),
      cancellation_policy: property.cancellation_policy,
      house_rules: property.house_rules,
      instant_booking: property.instant_booking,
      featured: property.featured,
      social_media: JSON.parse(property.social_media),
      owner_id: property.owner_id,
      created_at: property.created_at,
      updated_at: property.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        limit,
        offset,
        total: properties.length,
      },
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
