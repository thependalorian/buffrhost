/**
 * Loyalty Tier by ID API Route
 *
 * Purpose: Handle individual loyalty tier operations using Neon PostgreSQL
 * Functionality: Get, update, delete specific loyalty tier
 * Location: /app/api/secure/loyalty/tiers/[id]/route.ts
 *
 * Follows 40 Rules:
 * - Uses Neon PostgreSQL as primary database
 * - Vercel-compatible with proper error handling
 * - Comprehensive validation and security
 * - Optimized for performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { neonDb } from '@/lib/neon-db';

// Types for TypeScript compliance
interface LoyaltyTier {
  id: string;
  name: string;
  description: string;
  min_points: number;
  max_points?: number;
  benefits: string[];
  color: string;
  icon: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// GET - Fetch specific loyalty tier
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tier ID is required' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        id,
        name,
        description,
        min_points,
        max_points,
        benefits,
        color,
        icon,
        is_active,
        created_at,
        updated_at
      FROM loyalty_tiers 
      WHERE id = $1
    `;

    const tier = await neonDb.queryOne<LoyaltyTier>(sql, [id]);

    if (!tier) {
      return NextResponse.json(
        { success: false, error: 'Loyalty tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tier,
    });
  } catch (error) {
    console.error('Error fetching loyalty tier:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch loyalty tier',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH - Update loyalty tier
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tier ID is required' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updateFields: string[] = [];
    const values: (string | number | boolean)[] = [];
    let paramIndex = 1;

    const allowedFields = [
      'name',
      'description',
      'min_points',
      'max_points',
      'benefits',
      'color',
      'icon',
      'is_active',
    ];

    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.includes(key) && value !== undefined) {
        if (key === 'benefits') {
          updateFields.push(`${key} = $${paramIndex++}`);
          values.push(JSON.stringify(value));
        } else {
          updateFields.push(`${key} = $${paramIndex++}`);
          values.push(value);
        }
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = NOW()`);
    values.push(id);

    const sql = `
      UPDATE loyalty_tiers 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const [updatedTier] = await neonDb.query<LoyaltyTier>(sql, values);

    if (!updatedTier) {
      return NextResponse.json(
        { success: false, error: 'Loyalty tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTier,
    });
  } catch (error) {
    console.error('Error updating loyalty tier:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update loyalty tier',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete loyalty tier
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Tier ID is required' },
        { status: 400 }
      );
    }

    // Check if tier is in use by any customers
    const checkSql = `
      SELECT COUNT(*) as count 
      FROM loyalty_members 
      WHERE tier_id = $1
    `;

    const result = await neonDb.query<{ count: number }>(checkSql, [id]);
    const count = result[0]?.count || 0;

    if (count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete tier that is assigned to customers',
          details: `${count} customers are currently using this tier`,
        },
        { status: 400 }
      );
    }

    const sql = `
      DELETE FROM loyalty_tiers 
      WHERE id = $1
      RETURNING id
    `;

    const [deletedTier] = await neonDb.query<{ id: string }>(sql, [id]);

    if (!deletedTier) {
      return NextResponse.json(
        { success: false, error: 'Loyalty tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Loyalty tier deleted successfully',
      data: { id: deletedTier.id },
    });
  } catch (error) {
    console.error('Error deleting loyalty tier:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete loyalty tier',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
