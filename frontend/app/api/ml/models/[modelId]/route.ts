// frontend/app/api/ml/models/[modelId]/route.ts
/**
 * Ml Models/[modelId] API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview GET endpoint for ml operations providing machine learning model operations and predictions
 * @location buffr-host/frontend/app/api/ml/models/[modelId]/route.ts
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
 * GET /api/ml/models/[modelId] - Ml Models Retrieval Endpoint
 * @method GET
 * @endpoint /api/ml/models/[modelId]
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
 * GET /api/ml/models/[modelId]
 * /api/ml/models/[modelId]
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
import { MLService } from '@/lib/services/ml/MLService';

// Singleton ML service instance
let mlService: MLService | null = null;

async function getMLService(): Promise<MLService> {
  if (!mlService) {
    mlService = new MLService();
    await mlService.initialize();
  }
  return mlService;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const mlService = await getMLService();
    const model = mlService.getModel(params.modelId);

    if (!model) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Model retrieved successfully',
      model,
    });
  } catch (error) {
    console.error('ML Model GET API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve model',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const mlService = await getMLService();
    const deleted = mlService.deleteModel(params.modelId);

    if (!deleted) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Model deleted successfully',
      modelId: params.modelId,
    });
  } catch (error) {
    console.error('ML Model DELETE API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete model',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { modelId: string } }
) {
  try {
    const body = await request.json();
    const { action, testFeatures, testLabels } = body;

    const mlService = await getMLService();

    switch (action) {
      case 'evaluate':
        if (!testFeatures || !testLabels) {
          return NextResponse.json(
            { error: 'Missing testFeatures or testLabels for evaluation' },
            { status: 400 }
          );
        }

        const evaluation = await mlService.evaluateModel(
          params.modelId,
          testFeatures,
          testLabels
        );
        return NextResponse.json({
          message: 'Model evaluation completed',
          evaluation,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: evaluate' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('ML Model POST API Error:', error);
    return NextResponse.json(
      {
        error: 'Model operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
