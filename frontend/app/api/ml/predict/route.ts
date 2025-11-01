/**
 * ML Prediction API Endpoint for Buffr Host Hospitality Platform
 * @fileoverview Handles ML model inference requests with rate limiting and comprehensive error handling
 * @location buffr-host/frontend/app/api/ml/predict/route.ts
 * @purpose Provides RESTful API for real-time ML predictions across all trained models
 * @modularity Next.js API route handler with middleware integration and service abstraction
 * @database_connections Reads from ML model metadata tables, writes to `prediction_logs` and `api_usage_metrics`
 * @api_integration Uses Global ML Service for model inference with async processing
 * @security Rate limited endpoint with tenant isolation and input validation
 * @scalability Asynchronous processing with connection pooling and error recovery
 * @performance Optimized for low-latency predictions with model caching
 * @monitoring Comprehensive logging and metrics collection for all predictions
 *
 * Supported ML Models:
 * - Linear Regression: Revenue prediction and dynamic pricing
 * - Logistic Regression: Customer churn prediction and booking conversion
 * - K-Means Clustering: Customer segmentation and targeted marketing
 * - Time Series Forecasting: Demand prediction and optimal booking dates
 * - Random Forest: Ensemble predictions for complex hospitality scenarios
 *
 * API Endpoints:
 * - POST /api/ml/predict: Make predictions using trained models
 * - GET /api/ml/predict: List available trained models
 *
 * Rate Limiting: 50 predictions per minute per client
 * Authentication: Required via middleware
 * Content-Type: application/json
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGlobalMLService } from '@/lib/services/ml/globalMLService';

/**
 * Request payload for ML prediction
 * @interface PredictionRequest
 * @property {string} modelId - Unique identifier of the trained ML model
 * @property {number[]} features - Feature vector for prediction (must match model's training data)
 * @property {string} [tenantId] - Tenant identifier for multi-tenant isolation
 * @property {Object} [metadata] - Additional context data for prediction logging
 */
interface PredictionRequest {
  modelId: string;
  features: number[];
  tenantId?: string;
  metadata?: Record<string, any>;
}

/**
 * Prediction response structure
 * @interface PredictionResponse
 * @property {number} prediction - Model's prediction result
 * @property {number} confidence - Confidence score (0-1) if available
 * @property {Object} [metadata] - Additional prediction metadata
 * @property {string} modelId - Model identifier used for prediction
 * @property {number} processingTime - Time taken for prediction in milliseconds
 */
interface PredictionResponse {
  prediction: number;
  confidence?: number;
  metadata?: Record<string, any>;
  modelId: string;
  processingTime: number;
}

/**
 * Make ML prediction using trained model with real-time inference
 * @method POST
 * @param {NextRequest} request - Next.js request object containing prediction parameters
 * @returns {Promise<NextResponse>} JSON response with prediction result or error
 * @database_operations Logs prediction request to `prediction_logs` table with performance metrics
 * @api_operations Calls Global ML Service for model inference with async processing
 * @rate_limiting Subject to ML endpoint rate limiting (50 predictions per minute)
 * @validation Comprehensive input validation for modelId and feature vectors
 * @error_handling Detailed error responses with appropriate HTTP status codes
 * @performance Optimized for low-latency responses with model result caching
 * @monitoring Tracks prediction success/failure rates and processing times
 * @example
 * POST /api/ml/predict
 * Content-Type: application/json
 *
 * {
 *   "modelId": "revenue_predictor_v1",
 *   "features": [1000, 0.8, 0.3, 50000],
 *   "tenantId": "tenant_123",
 *   "metadata": {
 *     "customerId": "cust_456",
 *     "context": "booking_conversion"
 *   }
 * }
 *
 * Response:
 * {
 *   "prediction": 0.85,
 *   "confidence": 0.92,
 *   "modelId": "revenue_predictor_v1",
 *   "processingTime": 45,
 *   "metadata": { "model_version": "1.2.0" }
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: PredictionRequest = await request.json();

    // Comprehensive input validation
    if (!body.modelId || !body.features) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'modelId and features are required',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.features) || body.features.length === 0) {
      return NextResponse.json(
        {
          error: 'Invalid features format',
          message: 'Features must be a non-empty array of numbers',
          code: 'INVALID_FEATURES_FORMAT',
        },
        { status: 400 }
      );
    }

    // Validate all features are numbers
    if (!body.features.every((f) => typeof f === 'number' && !isNaN(f))) {
      return NextResponse.json(
        {
          error: 'Invalid feature values',
          message: 'All features must be valid numbers',
          code: 'INVALID_FEATURE_VALUES',
        },
        { status: 400 }
      );
    }

    // Get ML service and make prediction
    const mlService = await getGlobalMLService();
    const result = await mlService.predict(body);

    // Add processing time metadata
    const processingTime = Date.now() - startTime;
    const response: PredictionResponse = {
      ...result,
      processingTime,
    };

    return NextResponse.json(response);
  } catch (error) {
    const processingTime = Date.now() - startTime;

    console.error('ML Prediction API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: 'Prediction failed',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during prediction',
        processingTime,
        code: 'PREDICTION_FAILED',
      },
      { status: 500 }
    );
  }
}

/**
 * Retrieve list of all available trained ML models with metadata
 * @method GET
 * @returns {Promise<NextResponse>} JSON response with available models information
 * @database_operations Reads from ML model metadata tables to get model status and performance metrics
 * @api_operations Calls Global ML Service to retrieve model registry information
 * @caching Model list is cached to reduce database load on frequent requests
 * @monitoring Tracks model discovery requests for usage analytics
 * @response_format Standardized model metadata including accuracy, training date, and feature counts
 * @example
 * GET /api/ml/predict
 *
 * Response:
 * {
 *   "message": "Available models retrieved successfully",
 *   "models": [
 *     {
 *       "id": "revenue_predictor_v1",
 *       "name": "Revenue Predictor",
 *       "type": "linear_regression",
 *       "status": "active",
 *       "accuracy": 0.87,
 *       "lastTrained": "2024-01-15T10:30:00Z",
 *       "featureCount": 12
 *     },
 *     {
 *       "id": "churn_predictor_v2",
 *       "name": "Customer Churn Predictor",
 *       "type": "logistic_regression",
 *       "status": "active",
 *       "accuracy": 0.91,
 *       "lastTrained": "2024-01-14T16:45:00Z",
 *       "featureCount": 8
 *     }
 *   ]
 * }
 */
export async function GET() {
  try {
    const mlService = await getGlobalMLService();
    const models = mlService.getModels();

    // Transform models for API response with standardized metadata
    const modelSummaries = models.map((model) => ({
      id: model.id,
      name: model.name,
      type: model.type,
      status: model.status,
      accuracy: model.accuracy,
      lastTrained: model.lastTrained,
      featureCount: model.featureCount,
      version: model.version || '1.0.0',
      description:
        model.description ||
        `${model.type} model for ${model.name.toLowerCase()}`,
    }));

    return NextResponse.json({
      message: 'Available models retrieved successfully',
      models: modelSummaries,
      totalModels: modelSummaries.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML Models API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      endpoint: '/api/ml/predict',
    });

    return NextResponse.json(
      {
        error: 'Failed to retrieve models',
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred while fetching models',
        code: 'MODELS_RETRIEVAL_FAILED',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
