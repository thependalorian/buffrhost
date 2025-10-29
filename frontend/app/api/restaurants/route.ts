/**
 * Restaurants API Endpoint
 *
 * Returns restaurant data from the database
 * Location: app/api/restaurants/route.ts
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

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Query using correct column names
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.address,
        p.location,
        p.rating,
        p.phone,
        p.email,
        p.website,
        rd.cuisine_type,
        rd.price_range,
        rd.opening_hours,
        rd.delivery_available,
        rd.takeaway_available,
        rd.dine_in_available
      FROM properties p
      LEFT JOIN restaurant_details rd ON p.id = rd.property_id
      WHERE p.type = 'restaurant' AND p.status = 'active'
      ORDER BY p.rating DESC
      LIMIT 20
    `);

    const restaurants = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      address: row.address,
      location: row.location,
      rating: parseFloat(row.rating) || 0,
      contact: {
        phone: row.phone,
        email: row.email,
        website: row.website,
      },
      restaurantDetails: {
        cuisineType: row.cuisine_type,
        priceRange: row.price_range,
        openingHours: row.opening_hours,
        features: {
          delivery: row.delivery_available,
          takeaway: row.takeaway_available,
          dineIn: row.dine_in_available,
        },
      },
    }));

    return NextResponse.json({
      success: true,
      data: restaurants,
      total: restaurants.length,
    });
  } catch (error) {
    console.error('Restaurants API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
