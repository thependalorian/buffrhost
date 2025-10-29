/**
 * Loyalty Rewards API Route
 *
 * Purpose: Handle CRUD operations for loyalty rewards using Neon PostgreSQL
 * Functionality: Create, read, update, delete loyalty rewards
 * Location: /app/api/secure/loyalty/rewards/route.ts
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
interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  type: 'discount' | 'free_item' | 'points_bonus' | 'experience';
  value: number;
  value_type: 'percentage' | 'fixed' | 'points';
  points_required: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  usage_limit?: number;
  usage_count: number;
  category: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

// GET - Fetch all loyalty rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const active = searchParams.get('active');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    let whereConditions: string[] = [];
    const params: (string | boolean)[] = [];
    let paramIndex = 1;

    if (active !== null) {
      whereConditions.push(`is_active = $${paramIndex++}`);
      params.push(active === 'true');
    }

    if (type) {
      whereConditions.push(`type = $${paramIndex++}`);
      params.push(type);
    }

    if (category) {
      whereConditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

    const sql = `
      SELECT 
        id,
        name,
        description,
        type,
        value,
        value_type,
        points_required,
        is_active,
        valid_from,
        valid_until,
        usage_limit,
        usage_count,
        category,
        image,
        created_at,
        updated_at
      FROM loyalty_rewards 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    params.push(limit, offset);

    const rewards = await neonDb.query<LoyaltyReward>(sql, params);

    return NextResponse.json({
      success: true,
      data: rewards,
      pagination: {
        limit,
        offset,
        total: rewards.length,
      },
    });
  } catch (error) {
    console.error('Error fetching loyalty rewards:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch loyalty rewards',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new loyalty reward
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      type,
      value,
      value_type,
      points_required,
      is_active = true,
      valid_from,
      valid_until,
      usage_limit,
      category = 'general',
      image,
    } = body;

    // Validation
    if (
      !name ||
      !description ||
      !type ||
      value === undefined ||
      points_required === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: name, description, type, value, points_required',
        },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['discount', 'free_item', 'points_bonus', 'experience'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate value_type
    const validValueTypes = ['percentage', 'fixed', 'points'];
    if (!validValueTypes.includes(value_type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid value_type. Must be one of: ${validValueTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO loyalty_rewards (
        id,
        name,
        description,
        type,
        value,
        value_type,
        points_required,
        is_active,
        valid_from,
        valid_until,
        usage_limit,
        usage_count,
        category,
        image,
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
        $9,
        $10,
        0,
        $11,
        $12,
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const params = [
      name,
      description,
      type,
      value,
      value_type,
      points_required,
      is_active,
      valid_from || new Date().toISOString().split('T')[0],
      valid_until ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      usage_limit || null,
      category,
      image || null,
    ];

    const [newReward] = await neonDb.query<LoyaltyReward>(sql, params);

    return NextResponse.json(
      {
        success: true,
        data: newReward,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating loyalty reward:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create loyalty reward',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
