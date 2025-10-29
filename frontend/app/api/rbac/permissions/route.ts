import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// GET /api/rbac/permissions - Get all permissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const resource = searchParams.get('resource');
    const action = searchParams.get('action');

    const client = await pool.connect();
    try {
      let permissionsQuery = `
        SELECT 
          p.id, p.name, p.resource, p.action, p.description, p.created_at,
          (SELECT COUNT(*) FROM role_permissions rp WHERE rp.permission_id = p.id) as role_count,
          (SELECT COUNT(*) FROM user_permissions up WHERE up.permission_id = p.id) as user_count
        FROM permissions p
      `;

      const queryParams: (string | number)[] = [];
      const conditions: (string | number)[] = [];

      if (resource) {
        conditions.push(`p.resource = $${queryParams.length + 1}`);
        queryParams.push(resource);
      }

      if (action) {
        conditions.push(`p.action = $${queryParams.length + 1}`);
        queryParams.push(action);
      }

      if (conditions.length > 0) {
        permissionsQuery += ` WHERE ${conditions.join(' AND ')}`;
      }

      permissionsQuery += ` ORDER BY p.resource, p.action`;

      const result = await client.query(permissionsQuery, queryParams);

      return NextResponse.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rbac/permissions - Create new permission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, resource, action, description } = body;

    if (!name || !resource || !action) {
      return NextResponse.json(
        { error: 'Name, resource, and action are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO permissions (name, resource, action, description, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const result = await client.query(insertQuery, [
        name,
        resource,
        action,
        description,
      ]);

      return NextResponse.json({
        success: true,
        message: 'Permission created successfully',
        data: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
