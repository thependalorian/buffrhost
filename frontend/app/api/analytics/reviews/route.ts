/**
 * Reviews Analytics API Route
 *
 * Provides CRM/BI analytics for reviews and ratings
 * Endpoints: GET /api/analytics/reviews
 * Location: app/api/analytics/reviews/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// Initialize Neon PostgreSQL connection
const pool = new Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl:
    process.env['NODE_ENV'] === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// GET /api/analytics/reviews - Get review analytics for CRM/BI
export async function GET(request: NextRequest) {
  try {
    // Check if database is properly configured
    if (!process.env['DATABASE_URL']) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = request.nextUrl;
    const _propertyId = searchParams.get('propertyId');
    const _tenantId = searchParams.get('tenantId') || 'default-tenant';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const period = searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y

    if (!_propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Calculate date range based on period
      let dateFilter = '';
      const queryParams = [_propertyId, _tenantId];
      let paramCount = 2;

      if (startDate && endDate) {
        paramCount += 2;
        dateFilter = `AND r.created_at >= $${paramCount - 1} AND r.created_at <= $${paramCount}`;
        queryParams.push(startDate, endDate);
      } else {
        // Use period-based filtering
        const days =
          period === '7d'
            ? 7
            : period === '30d'
              ? 30
              : period === '90d'
                ? 90
                : 365;
        paramCount++;
        dateFilter = `AND r.created_at >= NOW() - INTERVAL '${days} days'`;
      }

      // 1. Overall Review Statistics
      const overallStatsQuery = `
        SELECT 
          COUNT(*) as total_reviews,
          AVG(overall_rating) as average_rating,
          COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive_reviews,
          COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative_reviews,
          COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_reviews,
          COUNT(CASE WHEN response_text IS NOT NULL THEN 1 END) as responded_reviews
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
      `;

      const overallStats = await client.query(overallStatsQuery, queryParams);

      // 2. Rating Distribution
      const ratingDistributionQuery = `
        SELECT 
          overall_rating,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        GROUP BY overall_rating
        ORDER BY overall_rating DESC
      `;

      const ratingDistribution = await client.query(
        ratingDistributionQuery,
        queryParams
      );

      // 3. Category-wise Ratings (Food, Service, etc.)
      const categoryRatingsQuery = `
        SELECT 
          'Food' as category,
          AVG(food_rating) as average_rating,
          COUNT(food_rating) as review_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        AND food_rating IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'Service' as category,
          AVG(service_rating) as average_rating,
          COUNT(service_rating) as review_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        AND service_rating IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'Accommodation' as category,
          AVG(accommodation_rating) as average_rating,
          COUNT(accommodation_rating) as review_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        AND accommodation_rating IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'Atmosphere' as category,
          AVG(atmosphere_rating) as average_rating,
          COUNT(atmosphere_rating) as review_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        AND atmosphere_rating IS NOT NULL
        
        UNION ALL
        
        SELECT 
          'Value' as category,
          AVG(value_rating) as average_rating,
          COUNT(value_rating) as review_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        AND value_rating IS NOT NULL
        
        ORDER BY average_rating DESC
      `;

      const categoryRatings = await client.query(
        categoryRatingsQuery,
        queryParams
      );

      // 4. Review Trends Over Time
      const trendsQuery = `
        SELECT 
          DATE_TRUNC('day', r.created_at) as date,
          COUNT(*) as review_count,
          AVG(overall_rating) as average_rating,
          COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as positive_count,
          COUNT(CASE WHEN overall_rating <= 2 THEN 1 END) as negative_count
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        GROUP BY DATE_TRUNC('day', r.created_at)
        ORDER BY date DESC
        LIMIT 30
      `;

      const trends = await client.query(trendsQuery, queryParams);

      // 5. Customer Satisfaction Score (CSAT)
      const csatQuery = `
        SELECT 
          ROUND(
            (COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) * 100.0 / COUNT(*)), 2
          ) as csat_score
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
      `;

      const csatResult = await client.query(csatQuery, queryParams);

      // 6. Response Time Analytics
      const responseTimeQuery = `
        SELECT 
          AVG(EXTRACT(EPOCH FROM (response_at - created_at)) / 3600) as avg_response_hours,
          COUNT(CASE WHEN response_at IS NOT NULL THEN 1 END) as total_responses,
          COUNT(*) as total_reviews
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
      `;

      const responseTime = await client.query(responseTimeQuery, queryParams);

      // 7. Recent Reviews for CRM
      const recentReviewsQuery = `
        SELECT 
          r.id,
          r.customer_name,
          r.customer_email,
          r.overall_rating,
          r.review_text,
          r.created_at,
          r.is_verified,
          o.order_number,
          o.total_amount
        FROM reviews r
        LEFT JOIN orders o ON r.order_id = o.id
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        ORDER BY r.created_at DESC
        LIMIT 10
      `;

      const recentReviews = await client.query(recentReviewsQuery, queryParams);

      // 8. Review Sentiment Analysis (Basic)
      const sentimentQuery = `
        SELECT 
          CASE 
            WHEN overall_rating >= 4 THEN 'Positive'
            WHEN overall_rating = 3 THEN 'Neutral'
            ELSE 'Negative'
          END as sentiment,
          COUNT(*) as count,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM reviews r
        WHERE r.property_id = $1 AND r.tenant_id = $2 ${dateFilter}
        GROUP BY 
          CASE 
            WHEN overall_rating >= 4 THEN 'Positive'
            WHEN overall_rating = 3 THEN 'Neutral'
            ELSE 'Negative'
          END
        ORDER BY count DESC
      `;

      const sentiment = await client.query(sentimentQuery, queryParams);

      // Transform data for frontend
      const analytics = {
        overview: {
          totalReviews: parseInt(overallStats.rows[0].total_reviews),
          averageRating: parseFloat(
            overallStats.rows[0].average_rating || 0
          ).toFixed(2),
          positiveReviews: parseInt(overallStats.rows[0].positive_reviews),
          negativeReviews: parseInt(overallStats.rows[0].negative_reviews),
          verifiedReviews: parseInt(overallStats.rows[0].verified_reviews),
          respondedReviews: parseInt(overallStats.rows[0].responded_reviews),
          csatScore: parseFloat(csatResult.rows[0].csat_score || 0).toFixed(1),
        },
        ratingDistribution: ratingDistribution.rows.map((row) => ({
          rating: parseInt(row.overall_rating),
          count: parseInt(row.count),
          percentage: parseFloat(row.percentage),
        })),
        categoryRatings: categoryRatings.rows.map((row) => ({
          category: row.category,
          averageRating: parseFloat(row.average_rating || 0).toFixed(2),
          reviewCount: parseInt(row.review_count),
        })),
        trends: trends.rows.map((row) => ({
          date: row.date,
          reviewCount: parseInt(row.review_count),
          averageRating: parseFloat(row.average_rating || 0).toFixed(2),
          positiveCount: parseInt(row.positive_count),
          negativeCount: parseInt(row.negative_count),
        })),
        responseTime: {
          averageHours: parseFloat(
            responseTime.rows[0].avg_response_hours || 0
          ).toFixed(1),
          totalResponses: parseInt(responseTime.rows[0].total_responses),
          totalReviews: parseInt(responseTime.rows[0].total_reviews),
          responseRate:
            responseTime.rows[0].total_reviews > 0
              ? (
                  (responseTime.rows[0].total_responses /
                    responseTime.rows[0].total_reviews) *
                  100
                ).toFixed(1)
              : '0',
        },
        recentReviews: recentReviews.rows.map((row) => ({
          id: row.id,
          customerName: row.customer_name,
          customerEmail: row.customer_email,
          rating: parseInt(row.overall_rating),
          reviewText: row.review_text,
          createdAt: row.created_at,
          isVerified: row.is_verified,
          orderNumber: row.order_number,
          orderAmount: parseFloat(row.total_amount || 0),
        })),
        sentiment: sentiment.rows.map((row) => ({
          sentiment: row.sentiment,
          count: parseInt(row.count),
          percentage: parseFloat(row.percentage),
        })),
      };

      return NextResponse.json({
        analytics,
        period,
        _propertyId,
        _tenantId,
        generatedAt: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in reviews analytics GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
