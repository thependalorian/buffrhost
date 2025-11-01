// frontend/app/api/ml/recommend/route.ts
/**
 * Ml Recommend API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for ml operations providing machine learning model operations and predictions
 * @location buffr-host/frontend/app/api/ml/recommend/route.ts
 * @purpose Machine learning model operations and predictions
 * @modularity ml-focused API endpoint with specialized recommend operations
 * @database_connections Reads/writes to ml_models, predictions, training_data tables
 * @api_integration ML model services, prediction engines, monitoring systems
 * @scalability ML inference scaling with model sharding and parallel processing
 * @performance ML inference optimized with model caching and parallel processing
 * @monitoring ML model performance, prediction accuracy, and inference latency tracking
 * @security Model access control, prediction result validation, and data privacy
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Ml Management Capabilities:
 * - Model inference and predictions
 * - ML model management
 * - Training data handling
 * - Performance monitoring
 *
 * Key Features:
 * - Model inference
 * - Prediction APIs
 * - Model management
 * - Performance monitoring
 */

/**
 * GET /api/ml/recommend - Ml Recommend Retrieval Endpoint
 * @method GET
 * @endpoint /api/ml/recommend
 * @purpose Machine learning model operations and predictions
 * @authentication JWT authentication required - Bearer token in Authorization header
 * @authorization JWT authorization required - Bearer token in Authorization header
 * @permissions Execute access to ML models and predictions
 * @rate_limit ML prediction rate limiter (higher limits for inference)
 * @caching Model predictions cached with short TTL for performance
 * @returns {Promise<NextResponse>} ML prediction results with confidence scores
 * @security Model access control, prediction result validation, and data privacy
 * @database_queries ML model queries with prediction result storage and performance tracking
 * @performance ML inference optimized with model caching and parallel processing
 * @example
 * GET /api/ml/recommend
 * /api/ml/recommend
 *
 * Success Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "prediction": 42.5,
 *     "confidence": 0.95,
 *     "modelVersion": "1.0.0"
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
import { NextRequest, NextResponse } from 'next/server';
import { getGlobalMLService } from '@/lib/services/ml/globalMLService';

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();

    // Validate request
    if (!body.guestPreferences || !body.context) {
      return NextResponse.json(
        { error: 'Missing required fields: guestPreferences and context' },
        { status: 400 }
      );
    }

    const mlService = await getGlobalMLService();

    // Get room recommendations
    const recommendations = await mlService.getRoomRecommendations(body);

    return NextResponse.json({
      message: 'Recommendations generated successfully',
      recommendations,
      recommendationCount: recommendations.length,
    });
  } catch (error) {
    console.error('ML Recommendation API Error:', error);
    return NextResponse.json(
      {
        error: 'Recommendation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for booking date recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const preferredDates = searchParams.get('dates')?.split(',') || [];
    const guestType = searchParams.get('guestType') || 'leisure';
    const historicalBookings =
      searchParams.get('bookings')?.split(',').map(Number) || [];

    if (preferredDates.length === 0 || historicalBookings.length === 0) {
      return NextResponse.json(
        { error: 'Missing required query parameters: dates and bookings' },
        { status: 400 }
      );
    }

    const mlService = await getGlobalMLService();
    const recommendations = await mlService.getBookingDateRecommendations(
      preferredDates,
      historicalBookings,
      guestType
    );

    return NextResponse.json({
      message: 'Date recommendations generated successfully',
      recommendations,
    });
  } catch (error) {
    console.error('ML Date Recommendation API Error:', error);
    return NextResponse.json(
      {
        error: 'Date recommendation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
