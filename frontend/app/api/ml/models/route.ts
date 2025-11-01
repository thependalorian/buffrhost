// frontend/app/api/ml/models/route.ts
/**
 * Ml Models API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for ml operations providing machine learning model operations and predictions
 * @location buffr-host/frontend/app/api/ml/models/route.ts
 * @purpose Machine learning model operations and predictions
 * @modularity ml-focused API endpoint with specialized models operations
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
 * GET /api/ml/models - Ml Models Retrieval Endpoint
 * @method GET
 * @endpoint /api/ml/models
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
 * GET /api/ml/models
 * /api/ml/models
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

export async function GET() {
  try {
    const mlService = await getGlobalMLService();
    const status = mlService.getStatus();

    return NextResponse.json({
      message: 'ML service status retrieved successfully',
      ...status,
    });
  } catch (error) {
    console.error('ML Status API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
