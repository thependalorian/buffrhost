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

// GET /api/rbac/roles/[id]/permissions - Get role permissions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id;

    const client = await pool.connect();
    try {
      const permissionsQuery = `
        SELECT 
          p.id, p.name, p.resource, p.action, p.description,
          rp.created_at as assigned_at
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = $1
        ORDER BY p.resource, p.action
      `;
      const result = await client.query(permissionsQuery, [roleId]);

      return NextResponse.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rbac/roles/[id]/permissions - Assign permissions to role
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id;
    const body = await request.json();
    const { permissionIds } = body;

    if (!permissionIds || !Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'permissionIds array is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Remove existing permissions
      await client.query('DELETE FROM role_permissions WHERE role_id = $1', [
        roleId,
      ]);

      // Add new permissions
      for (const permissionId of permissionIds) {
        await client.query(
          'INSERT INTO role_permissions (role_id, permission_id, created_at) VALUES ($1, $2, NOW())',
          [roleId, permissionId]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Role permissions updated successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating role permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rbac/roles/[id]/permissions - Remove all permissions from role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const roleId = params.id;

    const client = await pool.connect();
    try {
      const deleteQuery = 'DELETE FROM role_permissions WHERE role_id = $1';
      await client.query(deleteQuery, [roleId]);

      return NextResponse.json({
        success: true,
        message: 'Role permissions removed successfully',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error removing role permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
