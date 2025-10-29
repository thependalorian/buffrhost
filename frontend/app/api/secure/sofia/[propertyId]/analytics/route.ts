/**
 * Sofia AI Analytics API Route
 *
 * Purpose: Handle Sofia AI analytics and performance insights
 * Functionality: Get AI analytics, trends, and performance data
 * Location: /app/api/secure/sofia/[propertyId]/analytics/route.ts
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
interface SofiaAnalyticsData {
  performance_metrics: {
    total_recommendations: number;
    acceptance_rate: number;
    average_confidence: number;
    response_time_avg: number;
    learning_accuracy: number;
  };
  trends: {
    daily_recommendations: Array<{ date: string; count: number }>;
    confidence_trend: Array<{ date: string; confidence: number }>;
    acceptance_trend: Array<{ date: string; rate: number }>;
  };
  learning_progress: {
    current_phase: string;
    progress_percentage: number;
    next_milestone: string;
    estimated_completion: string;
  };
  insights: Array<{
    type: string;
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    confidence: number;
  }>;
}

// GET - Get Sofia AI analytics
export async function GET(
  request: NextRequest,
  { params }: { params: { propertyId: string } }
) {
  try {
    const { propertyId } = params;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get performance metrics
    const metricsResult = await neonDb.query(
      `
      SELECT 
        COUNT(*) as total_recommendations,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as acceptance_rate,
        AVG(confidence_score) as average_confidence,
        AVG(response_time_ms) as response_time_avg,
        AVG(learning_accuracy) as learning_accuracy
      FROM sofia_recommendations 
      WHERE property_id = $1 AND created_at >= $2
    `,
      [propertyId, startDate.toISOString()]
    );

    // Get daily trends
    const trendsResult = await neonDb.query(
      `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(confidence_score) as confidence,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END)::float / NULLIF(COUNT(*), 0) * 100 as acceptance_rate
      FROM sofia_recommendations 
      WHERE property_id = $1 AND created_at >= $2
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `,
      [propertyId, startDate.toISOString()]
    );

    // Get learning progress
    const learningResult = await neonDb.query(
      `
      SELECT 
        current_phase,
        progress_percentage,
        next_milestone,
        estimated_completion
      FROM sofia_learning_progress 
      WHERE property_id = $1
      ORDER BY last_updated DESC
      LIMIT 1
    `,
      [propertyId]
    );

    // Get insights
    const insightsResult = await neonDb.query(
      `
      SELECT 
        insight_type as type,
        title,
        description,
        impact_level as impact,
        confidence_score as confidence
      FROM sofia_insights 
      WHERE property_id = $1 AND created_at >= $2
      ORDER BY confidence_score DESC
      LIMIT 10
    `,
      [propertyId, startDate.toISOString()]
    );

    const metrics = metricsResult[0] || {};
    const learning = learningResult[0] || {};

    const dailyTrends = trendsResult.map((trend) => ({
      date: trend.date,
      count: parseInt(trend.count),
      confidence: parseFloat(trend.confidence || '0'),
      rate: parseFloat(trend.acceptance_rate || '0'),
    }));

    const analyticsData: SofiaAnalyticsData = {
      performance_metrics: {
        total_recommendations: parseInt(metrics.total_recommendations || '0'),
        acceptance_rate: parseFloat(metrics.acceptance_rate || '0'),
        average_confidence: parseFloat(metrics.average_confidence || '0'),
        response_time_avg: parseFloat(metrics.response_time_avg || '0'),
        learning_accuracy: parseFloat(metrics.learning_accuracy || '0'),
      },
      trends: {
        daily_recommendations: dailyTrends.map((t) => ({
          date: t.date,
          count: t.count,
        })),
        confidence_trend: dailyTrends.map((t) => ({
          date: t.date,
          confidence: t.confidence,
        })),
        acceptance_trend: dailyTrends.map((t) => ({
          date: t.date,
          rate: t.rate,
        })),
      },
      learning_progress: {
        current_phase: learning.current_phase || 'Initial Learning',
        progress_percentage: parseFloat(learning.progress_percentage || '0'),
        next_milestone: learning.next_milestone || 'Basic Pattern Recognition',
        estimated_completion:
          learning.estimated_completion ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      insights: insightsResult.map((insight) => ({
        type: insight.type,
        title: insight.title,
        description: insight.description,
        impact: insight.impact,
        confidence: parseFloat(insight.confidence),
      })),
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error('Error fetching Sofia AI analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
