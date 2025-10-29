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

// POST /api/rbac/check - Check user permissions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, permission, resourceId, tenantId } = body;

    if (!userId || !permission) {
      return NextResponse.json(
        { error: 'userId and permission are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Check if user has the permission through roles or direct assignment
      const permissionQuery = `
        WITH user_permissions AS (
          -- Direct user permissions
          SELECT p.name, p.resource, p.action, up.expires_at
          FROM user_permissions up
          JOIN permissions p ON up.permission_id = p.id
          WHERE up.user_id = $1
            AND (up.expires_at IS NULL OR up.expires_at > NOW())
          
          UNION
          
          -- Role-based permissions
          SELECT p.name, p.resource, p.action, NULL as expires_at
          FROM user_permissions up
          JOIN role_permissions rp ON up.permission_id = rp.role_id
          JOIN permissions p ON rp.permission_id = p.id
          WHERE up.user_id = $1
            AND (up.expires_at IS NULL OR up.expires_at > NOW())
        )
        SELECT 
          COUNT(*) > 0 as has_permission,
          array_agg(DISTINCT name) as permissions,
          array_agg(DISTINCT resource) as resources,
          array_agg(DISTINCT action) as actions
        FROM user_permissions
        WHERE name = $2
           OR (resource = $3 AND action = $4)
           OR (resource = $3 AND action = 'manage')
      `;

      const [permissionName, resource, action] = permission.split(':');
      const result = await client.query(permissionQuery, [
        userId,
        permission,
        resource || permissionName,
        action || 'read',
      ]);

      const hasPermission = result.rows[0]?.has_permission || false;

      return NextResponse.json({
        success: true,
        data: {
          hasPermission,
          permission,
          resourceId,
          userId,
          details: result.rows[0],
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error checking permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
