/**
 * User Profile API Endpoint
 *
 * Manages user profile with cross-tenant activity
 * Features: User profile, cross-tenant activity, permissions
 * Location: app/api/secure/user/profile/route.ts
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _tenantId = searchParams.get('tenant_id');
    const userId = searchParams.get('user_id');

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Tenant ID and User ID are required' },
        { status: 400 }
      );
    }

    // Query user profile with cross-tenant activity
    const userQuery = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.phone,
        u.role,
        u.tenant_id,
        u.created_at,
        u.updated_at,
        t.name as tenant_name,
        t.type as tenant_type
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE u.id = $1 AND u.tenant_id = $2
    `;

    const userResult = await pool.query(userQuery, [userId, tenantId]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Get user activity across tenants
    const activityQuery = `
      SELECT 
        COUNT(CASE WHEN b.id IS NOT NULL THEN 1 END) as hotel_bookings,
        COUNT(CASE WHEN o.id IS NOT NULL THEN 1 END) as restaurant_orders,
        COALESCE(SUM(b.total_amount), 0) + COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN bookings b ON u.id = b.guest_id
      LEFT JOIN orders o ON u.id = o.customer_id
      WHERE u.id = $1
    `;

    const activityResult = await pool.query(activityQuery, [userId]);
    const activity = activityResult.rows[0] || {
      hotel_bookings: 0,
      restaurant_orders: 0,
      total_spent: 0,
    };

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      tenant_id: user.tenant_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
      tenant: {
        name: user.tenant_name,
        type: user.tenant_type,
      },
      activity: {
        hotel_bookings: parseInt(activity.hotel_bookings),
        restaurant_orders: parseInt(activity.restaurant_orders),
        total_spent: parseFloat(activity.total_spent),
      },
    };

    return NextResponse.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error('User Profile API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _tenantId = searchParams.get('tenant_id');
    const userId = searchParams.get('user_id');

    if (!tenantId || !userId) {
      return NextResponse.json(
        { error: 'Tenant ID and User ID are required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, phone, email } = body;

    // Update user profile
    const updateQuery = `
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email),
        updated_at = NOW()
      WHERE id = $4 AND tenant_id = $5
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      name,
      phone,
      email,
      userId,
      tenantId,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'User profile updated successfully',
    });
  } catch (error) {
    console.error('User Profile Update API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
