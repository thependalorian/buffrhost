/**
 * Hotels API Endpoint
 *
 * Returns hotel data from the database
 * Location: app/api/hotels/route.ts
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
    // Query using correct column names from the schema
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
        p.star_rating,
        p.amenities,
        p.policies,
        p.check_in_time,
        p.check_out_time
      FROM properties p
      WHERE p.type = 'hotel' AND p.status = 'active'
      ORDER BY p.rating DESC
      LIMIT 20
    `);

    const hotels = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: 'hotel',
      location: row.location,
      ownerId: row.owner_id || '',
      tenantId: row.tenant_id || '',
      status: row.status || 'active',
      description: row.description,
      address: row.address,
      phone: row.phone,
      email: row.email,
      website: row.website,
      rating: parseFloat(row.rating) || 0,
      totalOrders: 0,
      totalRevenue: 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      images: [],
      features: [],
    }));

    return NextResponse.json({
      success: true,
      data: hotels,
      total: hotels.length,
    });
  } catch (error) {
    console.error('Hotels API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
