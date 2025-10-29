/**
 * Sofia AI Recommendations API Route
 *
 * Purpose: Handle Sofia AI recommendations management
 * Functionality: Get, create, update, and manage AI recommendations
 * Location: /app/api/secure/sofia/[propertyId]/recommendations/route.ts
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
interface SofiaRecommendation {
  id: string;
  property_id: string;
  category: string;
  title: string;
  description: string;
  confidence_score: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'accepted' | 'rejected';
  action_type: string;
  estimated_impact: string;
  implementation_effort: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface RecommendationUpdate {
  status: 'accepted' | 'rejected';
  notes?: string;
}

// GET - Get Sofia AI recommendations
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Build query with filters
    let query = `
      SELECT 
        id, property_id, category, title, description, confidence_score,
        priority, status, action_type, estimated_impact, implementation_effort,
        created_at, updated_at
      FROM sofia_recommendations 
      WHERE property_id = $1
    `;

    const queryParams = [propertyId];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (category) {
      query += ` AND category = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (priority) {
      query += ` AND priority = $${paramIndex}`;
      queryParams.push(priority);
      paramIndex++;
    }

    query += ` ORDER BY confidence_score DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit.toString(), offset.toString());

    const result = await neonDb.query(query, queryParams);

    const recommendations: SofiaRecommendation[] = result.map((rec) => ({
      id: rec.id,
      property_id: rec.property_id,
      category: rec.category,
      title: rec.title,
      description: rec.description,
      confidence_score: parseFloat(rec.confidence_score),
      priority: rec.priority,
      status: rec.status,
      action_type: rec.action_type,
      estimated_impact: rec.estimated_impact,
      implementation_effort: rec.implementation_effort,
      created_at: rec.created_at,
      updated_at: rec.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: recommendations,
      pagination: {
        limit,
        offset,
        total: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Error fetching Sofia AI recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update recommendation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const body: { recommendation_id: string; update: RecommendationUpdate } =
      await request.json();

    if (!propertyId || !body.recommendation_id || !body.update.status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { recommendation_id, update } = body;

    // Update recommendation status
    const result = await neonDb.query(
      `
      UPDATE sofia_recommendations 
      SET 
        status = $1,
        notes = $2,
        updated_at = NOW()
      WHERE id = $3 AND property_id = $4
      RETURNING *
    `,
      [update.status, update.notes || '', recommendation_id, propertyId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    const updatedRecommendation = result[0];

    return NextResponse.json({
      success: true,
      data: {
        id: updatedRecommendation.id,
        status: updatedRecommendation.status,
        notes: updatedRecommendation.notes,
        updated_at: updatedRecommendation.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating Sofia AI recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
