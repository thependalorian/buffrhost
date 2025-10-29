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

// GET /api/rbac/users/[id]/roles - Get user roles
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const client = await pool.connect();
    try {
      const rolesQuery = `
        SELECT 
          r.id, r.name, r.description, r.is_system_role, r.tenant_id,
          up.granted_at, up.granted_by, up.expires_at
        FROM roles r
        JOIN user_permissions up ON r.id = up.permission_id
        WHERE up.user_id = $1
        ORDER BY r.name
      `;
      const result = await client.query(rolesQuery, [userId]);

      return NextResponse.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rbac/users/[id]/roles - Assign roles to user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { roleIds, grantedBy, expiresAt } = body;

    if (!roleIds || !Array.isArray(roleIds)) {
      return NextResponse.json(
        { error: 'roleIds array is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Add new role assignments
      for (const roleId of roleIds) {
        await client.query(
          `INSERT INTO user_permissions (user_id, permission_id, granted_by, granted_at, expires_at) 
           VALUES ($1, $2, $3, NOW(), $4)
           ON CONFLICT (user_id, permission_id) DO UPDATE SET
           granted_by = EXCLUDED.granted_by,
           granted_at = EXCLUDED.granted_at,
           expires_at = EXCLUDED.expires_at`,
          [userId, roleId, grantedBy, expiresAt]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'User roles assigned successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error assigning user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rbac/users/[id]/roles - Remove roles from user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const { searchParams } = request.nextUrl;
    const roleIds = searchParams.get('roleIds')?.split(',');

    const client = await pool.connect();
    try {
      if (roleIds && roleIds.length > 0) {
        // Remove specific roles
        const deleteQuery = `
          DELETE FROM user_permissions 
          WHERE user_id = $1 AND permission_id = ANY($2)
        `;
        await client.query(deleteQuery, [userId, roleIds]);
      } else {
        // Remove all roles
        const deleteQuery = 'DELETE FROM user_permissions WHERE user_id = $1';
        await client.query(deleteQuery, [userId]);
      }

      return NextResponse.json({
        success: true,
        message: 'User roles removed successfully',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error removing user roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
