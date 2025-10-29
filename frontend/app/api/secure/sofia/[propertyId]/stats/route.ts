/**
 * Sofia AI Stats API Route
 *
 * Purpose: Handle Sofia AI statistics and performance metrics
 * Functionality: Get AI stats, performance data, and analytics
 * Location: /app/api/secure/sofia/[propertyId]/stats/route.ts
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
interface SofiaStats {
  total_recommendations: number;
  accepted_recommendations: number;
  rejected_recommendations: number;
  pending_recommendations: number;
  average_confidence: number;
  success_rate: number;
  total_notifications: number;
  unread_notifications: number;
  learning_progress: number;
  last_updated: string;
}

// GET - Get Sofia AI stats for property
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Get Sofia AI stats from database
    const statsResult = await neonDb.query(
      `
      SELECT 
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_recommendations,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_recommendations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_recommendations,
        COUNT(*) as total_recommendations,
        AVG(confidence_score) as average_confidence,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as success_rate
      FROM sofia_recommendations 
      WHERE property_id = $1
    `,
      [propertyId]
    );

    // Get notification stats
    const notificationResult = await neonDb.query(
      `
      SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications
      FROM sofia_notifications 
      WHERE property_id = $1
    `,
      [propertyId]
    );

    // Get learning progress
    const learningResult = await neonDb.query(
      `
      SELECT 
        learning_progress,
        last_updated
      FROM sofia_learning_progress 
      WHERE property_id = $1
      ORDER BY last_updated DESC
      LIMIT 1
    `,
      [propertyId]
    );

    const stats = statsResult[0] || {};
    const notifications = notificationResult[0] || {};
    const learning = learningResult[0] || {};

    const sofiaStats: SofiaStats = {
      total_recommendations: parseInt(stats.total_recommendations || '0'),
      accepted_recommendations: parseInt(stats.accepted_recommendations || '0'),
      rejected_recommendations: parseInt(stats.rejected_recommendations || '0'),
      pending_recommendations: parseInt(stats.pending_recommendations || '0'),
      average_confidence: parseFloat(stats.average_confidence || '0'),
      success_rate: parseFloat(stats.success_rate || '0'),
      total_notifications: parseInt(notifications.total_notifications || '0'),
      unread_notifications: parseInt(notifications.unread_notifications || '0'),
      learning_progress: parseFloat(learning.learning_progress || '0'),
      last_updated: learning.last_updated || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: sofiaStats,
    });
  } catch (error) {
    console.error('Error fetching Sofia AI stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
