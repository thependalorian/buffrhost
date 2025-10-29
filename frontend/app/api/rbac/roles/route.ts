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

// GET /api/rbac/roles - Get all roles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const _tenantId = searchParams.get('tenantId');

    const client = await pool.connect();
    try {
      const rolesQuery = `
        SELECT 
          r.id, r.name, r.description, r.is_system_role, r.tenant_id, r.created_at,
          (SELECT COUNT(*) FROM user_permissions up WHERE up.user_id IN (
            SELECT user_id FROM user_permissions WHERE permission_id IN (
              SELECT p.id FROM permissions p 
              JOIN role_permissions rp ON p.id = rp.permission_id 
              WHERE rp.role_id = r.id
            )
          )) as user_count
        FROM roles r
        WHERE r.tenant_id = $1 OR r.tenant_id IS NULL
        ORDER BY r.is_system_role DESC, r.name ASC
      `;
      const result = await client.query(rolesQuery, [_tenantId]);

      return NextResponse.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rbac/roles - Create new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, tenantId, isSystemRole = false } = body;

    if (!name || !tenantId) {
      return NextResponse.json(
        { error: 'Name and tenantId are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO roles (name, description, is_system_role, tenant_id, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      const result = await client.query(insertQuery, [
        name,
        description,
        isSystemRole,
        tenantId,
      ]);

      return NextResponse.json({
        success: true,
        message: 'Role created successfully',
        data: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
