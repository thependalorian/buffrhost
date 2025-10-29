/**
 * Admin Users Management API Route
 *
 * Purpose: Handle user management for admin dashboard
 * Functionality: Get, create, update, delete users
 * Location: /app/api/admin/users/route.ts
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
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'property_owner' | 'guest' | 'staff';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  last_login: string;
  total_properties: number;
  total_bookings: number;
  total_spent: number;
  phone?: string;
  avatar_url?: string;
}

// GET - Get all users for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with filters
    let query = `
      SELECT 
        u.id, u.name, u.email, u.role, u.status, u.created_at, u.updated_at, u.last_login,
        u.phone, u.avatar_url,
        COUNT(DISTINCT p.id) as total_properties,
        COUNT(DISTINCT b.id) as total_bookings,
        COALESCE(SUM(pay.amount), 0) as total_spent
      FROM users u
      LEFT JOIN properties p ON u.id = p.owner_id
      LEFT JOIN bookings b ON u.id = b.user_id
      LEFT JOIN payments pay ON b.id = pay.booking_id AND pay.status = 'completed'
      WHERE 1=1
    `;

    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND u.role = $${paramIndex}`;
      queryParams.push(role);
      paramIndex++;
    }

    if (status) {
      query += ` AND u.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND (u.name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY u.id`;

    // Add sorting
    const validSortFields = [
      'name',
      'email',
      'role',
      'status',
      'created_at',
      'updated_at',
      'last_login',
      'total_properties',
      'total_bookings',
      'total_spent',
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortDirection}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await neonDb.query(query, queryParams);

    const users: AdminUser[] = result.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      total_properties: parseInt(user.total_properties || '0'),
      total_bookings: parseInt(user.total_bookings || '0'),
      total_spent: parseFloat(user.total_spent || '0'),
      phone: user.phone,
      avatar_url: user.avatar_url,
    }));

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        limit,
        offset,
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update user status or role
export async function PATCH(request: NextRequest) {
  try {
    const body: {
      user_id: string;
      status?: 'active' | 'inactive' | 'suspended';
      role?: 'admin' | 'property_owner' | 'guest' | 'staff';
    } = await request.json();

    if (!body.user_id || (!body.status && !body.role)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { user_id, status, role } = body;

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: (string | number)[] = [];
    let paramIndex = 1;

    if (status) {
      updateFields.push(`status = $${paramIndex}`);
      updateValues.push(status);
      paramIndex++;
    }

    if (role) {
      updateFields.push(`role = $${paramIndex}`);
      updateValues.push(role);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(user_id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await neonDb.query(query, updateValues);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        status: updatedUser.status,
        role: updatedUser.role,
        updated_at: updatedUser.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
