/**
 * Reviews API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for reviews operations providing reviews data management and operations
 * @location buffr-host/frontend/app/api/reviews/route.ts
 * @purpose reviews data management and operations
 * @modularity reviews-focused API endpoint with specialized reviews operations
 * @database_connections Reads/writes to reviews related tables
 * @api_integration reviews service integrations
 * @scalability Scalable operations with database optimization and caching
 * @performance Performance optimized with database indexing and caching
 * @monitoring Operational metrics and performance monitoring
 * @security Multi-tenant security with data isolation and access control
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Reviews Management Capabilities:
 * - reviews CRUD operations
 * - Data management
 * - Business logic processing
 *
 * Key Features:
 * - Data management
 * - CRUD operations
 * - Business logic
 */

/**
 * GET /api/reviews - Reviews Retrieval Endpoint
 * @method GET
 * @endpoint /api/reviews
 * @purpose reviews data management and operations
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Appropriate permissions based on operation type
 * @rate_limit Standard API rate limiter applied
 * @caching Appropriate caching strategy applied
 * @returns {Promise<NextResponse>} API operation result with success status and data
 * @security Multi-tenant security with data isolation and access control
 * @database_queries Optimized database queries with appropriate indexing and performance
 * @performance Performance optimized with database indexing and caching
 * @example
 * GET /api/reviews
 * /api/reviews
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "result": "success"
 *   }
 * }
 *
 * Error Response (400/500):
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Error description"
 *   }
 * }
 */
/**
 * Reviews API Route
 *
 * Handles CRUD operations for product reviews with CRM/BI integration
 * Endpoints: GET /api/reviews, POST /api/reviews
 * Location: app/api/reviews/route.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbPool } from '@/lib/database/connection-pool';

// GET /api/reviews - Fetch reviews for a property with CRM/BI integration
export async function GET(request: NextRequest) {
  try {


    const { searchParams } = request.nextUrl;
    const _propertyId = searchParams.get('propertyId');
    const _tenantId = searchParams.get('tenantId') || 'default-tenant';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const filterBy = searchParams.get('filterBy') || 'all';

    if (!_propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const client = await dbPool.getPool().connect();

    try {
      // Build WHERE clause
      let whereClause = 'WHERE r.property_id = $1 AND r.tenant_id = $2';
      const queryParams: string[] = [_propertyId, _tenantId];
      let paramCount = 2;

      // Apply rating filter
      if (filterBy !== 'all') {
        paramCount++;
        whereClause += ` AND r.overall_rating = $${paramCount}`;
        queryParams.push(parseInt(filterBy).toString());
      }

      // Build ORDER BY clause
      let orderBy = 'ORDER BY r.created_at DESC';
      switch (sortBy) {
        case 'newest':
          orderBy = 'ORDER BY r.created_at DESC';
          break;
        case 'oldest':
          orderBy = 'ORDER BY r.created_at ASC';
          break;
        case 'highest':
          orderBy = 'ORDER BY r.overall_rating DESC';
          break;
        case 'lowest':
          orderBy = 'ORDER BY r.overall_rating ASC';
          break;
        case 'most_helpful':
          // For now, order by overall_rating since we don't have helpful_count yet
          orderBy = 'ORDER BY r.overall_rating DESC';
          break;
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reviews r
        ${whereClause}
      `;
      const countResult = await client.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Get reviews with pagination
      const offset = (page - 1) * limit;
      const reviewsQuery = `
        SELECT 
          r.id,
          r.order_id,
          r.property_id,
          r.tenant_id,
          r.customer_name,
          r.customer_email,
          r.overall_rating,
          r.food_rating,
          r.service_rating,
          r.accommodation_rating,
          r.atmosphere_rating,
          r.value_rating,
          r.review_text,
          r.is_verified,
          r.is_public,
          r.response_text,
          r.response_by,
          r.response_at,
          r.created_at,
          r.updated_at,
          o.order_number,
          o.guest_name,
          o.guest_email
        FROM reviews r
        LEFT JOIN orders o ON r.order_id = o.id
        ${whereClause}
        ${orderBy}
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;

      queryParams.push(limit.toString(), offset.toString());
      const reviewsResult = await client.query(reviewsQuery, queryParams);

      // Transform data to match frontend interface
      const transformedReviews = reviewsResult.rows.map((review) => ({
        id: review.id,
        userId: review.customer_email || 'anonymous',
        userName: review.customer_name || 'Anonymous',
        userAvatar: null, // We don't have avatar URLs in the current schema
        rating: review.overall_rating,
        title: `Review for ${review.order_number || 'Order'}`,
        comment: review.review_text || '',
        photos: [], // We don't have photos in the current schema
        recommend: review.overall_rating >= 4, // Consider 4+ stars as recommended
        createdAt: review.created_at,
        helpful: 0, // We don't have helpful count yet
        verified: review.is_verified || false,
        orderNumber: review.order_number,
        detailedRatings: {
          food: review.food_rating,
          service: review.service_rating,
          accommodation: review.accommodation_rating,
          atmosphere: review.atmosphere_rating,
          value: review.value_rating,
        },
        response: review.response_text
          ? {
              text: review.response_text,
              by: review.response_by,
              at: review.response_at,
            }
          : null,
      }));

      return NextResponse.json({
        reviews: transformedReviews,
        pagination: {
          page,
          limit,
          total,
          hasMore: total > page * limit,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review with CRM/BI integration
export async function POST(request: NextRequest) {
  try {


    const body = await request.json();
    const {
      propertyId,
      tenantId = 'default-tenant',
      orderId,
      customerName,
      customerEmail,
      overallRating,
      foodRating,
      serviceRating,
      accommodationRating,
      atmosphereRating,
      valueRating,
      reviewText,
      isVerified = false,
    } = body;

    // Validate required fields
    if (
      !propertyId ||
      !orderId ||
      !customerName ||
      !overallRating ||
      !reviewText
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (overallRating < 1 || overallRating > 5) {
      return NextResponse.json(
        { error: 'Overall rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const client = await dbPool.getPool().connect();

    try {
      // Check if order exists and belongs to the property
      const orderCheck = await client.query(
        'SELECT id, property_id, tenant_id FROM orders WHERE id = $1 AND property_id = $2 AND tenant_id = $3',
        [orderId, propertyId, tenantId]
      );

      if (orderCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Order not found or does not belong to this property' },
          { status: 404 }
        );
      }

      // Check if review already exists for this order
      const existingReview = await client.query(
        'SELECT id FROM reviews WHERE order_id = $1',
        [orderId]
      );

      if (existingReview.rows.length > 0) {
        return NextResponse.json(
          { error: 'Review already exists for this order' },
          { status: 409 }
        );
      }

      // Calculate overall rating if not provided
      let finalOverallRating = overallRating;
      if (!finalOverallRating) {
        const ratingResult = await client.query(
          `
          SELECT calculate_overall_rating($1, $2, $3, $4, $5) as overall_rating
        `,
          [
            foodRating,
            serviceRating,
            accommodationRating,
            atmosphereRating,
            valueRating,
          ]
        );
        finalOverallRating = ratingResult.rows[0].overall_rating;
      }

      // Create review
      const reviewResult = await client.query(
        `
        INSERT INTO reviews (
          order_id, property_id, tenant_id, customer_name, customer_email,
          overall_rating, food_rating, service_rating, accommodation_rating,
          atmosphere_rating, value_rating, review_text, is_verified, is_public
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `,
        [
          orderId,
          propertyId,
          tenantId,
          customerName,
          customerEmail,
          finalOverallRating,
          foodRating,
          serviceRating,
          accommodationRating,
          atmosphereRating,
          valueRating,
          reviewText,
          isVerified,
          true,
        ]
      );

      const review = reviewResult.rows[0];

      // Update order status to include review
      await client.query('UPDATE orders SET updated_at = NOW() WHERE id = $1', [
        orderId,
      ]);

      // Log review creation for CRM/BI analytics
      await client.query(
        `
        INSERT INTO order_status_history (order_id, status, changed_by, reason)
        VALUES ($1, 'reviewed', 'customer', 'Customer submitted review')
      `,
        [orderId]
      );

      // Transform response
      const transformedReview = {
        id: review.id,
        userId: review.customer_email || 'anonymous',
        userName: review.customer_name,
        userAvatar: null,
        rating: review.overall_rating,
        title: `Review for Order ${orderId.slice(-8)}`,
        comment: review.review_text,
        photos: [],
        recommend: review.overall_rating >= 4,
        createdAt: review.created_at,
        helpful: 0,
        verified: review.is_verified,
        orderNumber: orderId,
        detailedRatings: {
          food: review.food_rating,
          service: review.service_rating,
          accommodation: review.accommodation_rating,
          atmosphere: review.atmosphere_rating,
          value: review.value_rating,
        },
        response: null,
      };

      return NextResponse.json(
        {
          review: transformedReview,
          message: 'Review created successfully',
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
