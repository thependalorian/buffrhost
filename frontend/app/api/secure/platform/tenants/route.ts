/**
 * Platform Tenants API Endpoint
 *
 * Manages platform tenants (platform admin only)
 * Features: Multi-tenant management, tenant analytics, platform overview
 * Location: app/api/secure/platform/tenants/route.ts
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

    // Verify platform admin access
    const adminQuery = `
      SELECT u.role, t.type as tenant_type
      FROM users u
      LEFT JOIN tenants t ON u.tenant_id = t.id
      WHERE u.id = $1 AND u.tenant_id = $2
    `;

    const adminResult = await pool.query(adminQuery, [userId, tenantId]);

    if (
      adminResult.rows.length === 0 ||
      adminResult.rows[0].role !== 'platform_admin'
    ) {
      return NextResponse.json(
        { error: 'Platform admin access required' },
        { status: 403 }
      );
    }

    // Get all tenants with analytics
    const tenantsQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.status,
        t.created_at,
        COUNT(DISTINCT p.id) as businesses,
        COUNT(DISTINCT u.id) as users,
        COALESCE(SUM(b.total_amount), 0) + COALESCE(SUM(o.total_amount), 0) as revenue
      FROM tenants t
      LEFT JOIN properties p ON t.id = p.tenant_id
      LEFT JOIN users u ON t.id = u.tenant_id
      LEFT JOIN bookings b ON p.id = b.property_id
      LEFT JOIN orders o ON p.id = o.property_id
      WHERE t.status = 'active'
      GROUP BY t.id, t.name, t.type, t.status, t.created_at
      ORDER BY t.created_at DESC
    `;

    const tenantsResult = await pool.query(tenantsQuery);
    const tenants = tenantsResult.rows.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      type: tenant.type,
      status: tenant.status,
      created_at: tenant.created_at,
      businesses: parseInt(tenant.businesses),
      users: parseInt(tenant.users),
      revenue: parseFloat(tenant.revenue),
    }));

    return NextResponse.json({
      success: true,
      data: tenants,
      security: {
        tenantId,
        userId,
        role: 'platform_admin',
      },
    });
  } catch (error) {
    console.error('Platform Tenants API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Verify platform admin access
    const adminQuery = `
      SELECT u.role FROM users u WHERE u.id = $1 AND u.tenant_id = $2
    `;

    const adminResult = await pool.query(adminQuery, [userId, tenantId]);

    if (
      adminResult.rows.length === 0 ||
      adminResult.rows[0].role !== 'platform_admin'
    ) {
      return NextResponse.json(
        { error: 'Platform admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, status = 'active' } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Create new tenant
    const createQuery = `
      INSERT INTO tenants (name, type, status, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(createQuery, [name, type, status]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tenant created successfully',
    });
  } catch (error) {
    console.error('Platform Tenant Creation API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
