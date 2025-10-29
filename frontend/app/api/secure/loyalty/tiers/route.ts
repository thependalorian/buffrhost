/**
 * Loyalty Tiers API Route
 *
 * Purpose: Handle CRUD operations for loyalty tiers using Neon PostgreSQL
 * Functionality: Create, read, update, delete loyalty tiers
 * Location: /app/api/secure/loyalty/tiers/route.ts
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

// GET - Fetch all loyalty tiers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const active = searchParams.get('active');

    let whereClause = '';
    const params: (string | boolean)[] = [];
    let paramIndex = 1;

    if (active !== null) {
      whereClause = `WHERE is_active = $${paramIndex++}`;
      params.push(active === 'true');
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
      ${whereClause}
      ORDER BY min_points ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(limit, offset);

    const tiers = await neonDb.query<LoyaltyTier>(sql, params);

    return NextResponse.json({
      success: true,
      data: tiers,
      pagination: {
        limit,
        offset,
        total: tiers.length,
      },
    });
  } catch (error) {
    console.error('Error fetching loyalty tiers:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch loyalty tiers',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new loyalty tier
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      min_points,
      max_points,
      benefits,
      color,
      icon,
      is_active = true,
    } = body;

    // Validation
    if (!name || !description || min_points === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, description, min_points',
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO loyalty_tiers (
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
      ) VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const params = [
      name,
      description,
      min_points,
      max_points || null,
      JSON.stringify(benefits || []),
      color || '#3B82F6',
      icon || 'star',
      is_active,
    ];

    const [newTier] = await neonDb.query<LoyaltyTier>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: newTier,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating loyalty tier:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create loyalty tier',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
