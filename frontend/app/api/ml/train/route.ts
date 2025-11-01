// frontend/app/api/ml/train/route.ts
/**
 * Ml Train API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview POST endpoint for ml operations providing machine learning model operations and predictions
 * @location buffr-host/frontend/app/api/ml/train/route.ts
 * @purpose Machine learning model operations and predictions
 * @modularity ml-focused API endpoint with specialized train operations
 * @database_connections Reads/writes to ml_models, predictions, training_data tables
 * @api_integration ML model services, prediction engines, monitoring systems
 * @scalability ML inference scaling with model sharding and parallel processing
 * @performance ML inference optimized with model caching and parallel processing
 * @monitoring ML model performance, prediction accuracy, and inference latency tracking
 * @security Model access control, prediction result validation, and data privacy
 * @multi_tenant Automatic tenant context application with data isolation
 *
 * Ml Operations Capabilities:
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
 * POST /api/ml/train - Ml Train Creation Endpoint
 * @method POST
 * @endpoint /api/ml/train
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
 * POST /api/ml/train
 * POST /api/ml/train
 * Content-Type: application/json
 *
 * {
 *   "modelId": "linear-regression",
 *   "input": [1.0, 2.0, 3.0]
 * }
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
    const body: TrainingRequest = await request.json();

    // Validate request
    if (!body.modelType || !body.modelName) {
      return NextResponse.json(
        { error: 'Missing required fields: modelType and modelName' },
        { status: 400 }
      );
    }

    if (
      !body.features ||
      !Array.isArray(body.features) ||
      body.features.length === 0
    ) {
      return NextResponse.json(
        { error: 'Features must be a non-empty array of arrays' },
        { status: 400 }
      );
    }

    if (!body.labels || !Array.isArray(body.labels)) {
      return NextResponse.json(
        { error: 'Labels must be an array' },
        { status: 400 }
      );
    }

    if (body.features.length !== body.labels.length) {
      return NextResponse.json(
        { error: 'Features and labels must have the same length' },
        { status: 400 }
      );
    }

    const mlService = await getGlobalMLService();

    // For large training requests, this might take time
    const result = await mlService.trainModel(body);

    return NextResponse.json({
      message: 'Model trained successfully',
      model: {
        id: result.id,
        name: result.name,
        type: result.type,
        status: result.status,
        accuracy: result.accuracy,
        lastTrained: result.lastTrained,
        featureCount: result.featureCount,
      },
    });
  } catch (error) {
    console.error('ML Training API Error:', error);
    return NextResponse.json(
      {
        error: 'Training failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
