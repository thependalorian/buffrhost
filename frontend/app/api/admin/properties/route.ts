/**
 * Admin Properties Management API Route
 *
 * Purpose: Handle property management for admin dashboard
 * Functionality: Get, create, update, delete properties
 * Location: /app/api/admin/properties/route.ts
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
interface AdminProperty {
  id: string;
  name: string;
  type: string;
  location: string;
  address: string;
  property_code: string;
  capacity: number;
  phone: string;
  email: string;
  website: string;
  status: 'active' | 'inactive' | 'suspended';
  owner_id: string;
  owner_name: string;
  owner_email: string;
  created_at: string;
  updated_at: string;
  total_bookings: number;
  total_revenue: number;
  last_activity: string;
}

// GET - Get all properties for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const sort_by = searchParams.get('sort_by') || 'created_at';
    const sort_order = searchParams.get('sort_order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with filters
    let query = `
      SELECT 
        p.id, p.name, p.type, p.location, p.address, p.property_code, p.capacity,
        p.phone, p.email, p.website, p.status, p.owner_id, p.created_at, p.updated_at,
        u.name as owner_name, u.email as owner_email,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(pay.amount), 0) as total_revenue,
        MAX(b.created_at) as last_activity
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      LEFT JOIN bookings b ON p.id = b.property_id
      LEFT JOIN payments pay ON b.id = pay.booking_id AND pay.status = 'completed'
      WHERE 1=1
    `;

    const queryParams: (string | number)[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND p.type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (search) {
      query += ` AND (p.name ILIKE $${paramIndex} OR p.location ILIKE $${paramIndex} OR p.address ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY p.id, u.name, u.email`;

    // Add sorting
    const validSortFields = [
      'name',
      'type',
      'location',
      'created_at',
      'updated_at',
      'total_bookings',
      'total_revenue',
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : 'created_at';
    const sortDirection = sort_order === 'asc' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${sortField} ${sortDirection}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await neonDb.query(query, queryParams);

    const properties: AdminProperty[] = result.map((prop) => ({
      id: prop.id,
      name: prop.name,
      type: prop.type,
      location: prop.location,
      address: prop.address,
      property_code: prop.property_code,
      capacity: prop.capacity,
      phone: prop.phone,
      email: prop.email,
      website: prop.website,
      status: prop.status,
      owner_id: prop.owner_id,
      owner_name: prop.owner_name || 'Unknown',
      owner_email: prop.owner_email || 'Unknown',
      created_at: prop.created_at,
      updated_at: prop.updated_at,
      total_bookings: parseInt(prop.total_bookings || '0'),
      total_revenue: parseFloat(prop.total_revenue || '0'),
      last_activity: prop.last_activity || prop.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        limit,
        offset,
        total: properties.length,
      },
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update property status
export async function PATCH(request: NextRequest) {
  try {
    const body: {
      property_id: string;
      status: 'active' | 'inactive' | 'suspended';
    } = await request.json();

    if (!body.property_id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { property_id, status } = body;

    // Update property status
    const result = await neonDb.query(
      `
      UPDATE properties 
      SET 
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `,
      [status, property_id]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    const updatedProperty = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProperty.id,
        status: updatedProperty.status,
        updated_at: updatedProperty.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating property status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
