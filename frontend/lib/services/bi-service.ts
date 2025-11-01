/**
 * Business Intelligence Service for Buffr Host Hospitality Platform
 * @fileoverview Comprehensive BI service providing machine learning metrics, predictive analytics, and data quality monitoring
 * @location buffr-host/frontend/lib/services/bi-service.ts
 * @purpose Delivers advanced business intelligence and ML analytics for hospitality operations
 * @modularity Centralized BI service with comprehensive analytics and predictive capabilities
 * @database_connections Reads from `ml_models`, `predictions`, `analytics_events`, `data_quality_metrics`, `model_performance` tables
 * @api_integration RESTful API endpoints for BI operations with real-time data processing
 * @scalability High-performance BI analytics with data aggregation and caching
 * @performance Optimized analytics queries with real-time processing and predictive modeling
 * @monitoring Comprehensive BI monitoring, model performance tracking, and data quality validation
 *
 * BI Capabilities:
 * - Machine learning model performance monitoring
 * - Predictive analytics and forecasting
 * - Credit scoring and risk assessment
 * - Revenue prediction and optimization
 * - Customer behavior analytics
 * - Data quality assessment and monitoring
 * - Real-time dashboard data and KPIs
 * - Model training progress and validation
 *
 * Key Features:
 * - ML model performance metrics (accuracy, precision, recall, F1, AUC)
 * - Predictive analytics with confidence intervals
 * - Data quality monitoring and alerting
 * - Real-time BI dashboard data
 * - Model lifecycle management
 * - Automated report generation
 * - Performance optimization recommendations
 * - Multi-tenant analytics isolation
 */

import { apiClient } from './api-client';

/**
 * Machine learning model performance metrics
 * @interface BIMetrics
 * @property {number} accuracy - Model accuracy percentage (0-1)
 * @property {number} precision - Model precision score (0-1)
 * @property {number} recall - Model recall score (0-1)
 * @property {number} f1Score - F1 score combining precision and recall (0-1)
 * @property {number} auc - Area under ROC curve (0-1)
 * @property {string} lastUpdated - ISO timestamp of last metrics update
 */
export interface BIMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  lastUpdated: string;
}

/**
 * Prediction data with actual vs predicted values
 * @interface PredictionData
 * @property {string} date - Date of the prediction in ISO format
 * @property {number} actual - Actual observed value
 * @property {number} predicted - Model predicted value
 * @property {number} confidence - Prediction confidence score (0-1)
 */
export interface PredictionData {
  date: string;
  actual: number;
  predicted: number;
  confidence: number;
}

/**
 * Data quality assessment metrics
 * @interface DataQualityMetrics
 * @property {number} completeness - Percentage of complete records (0-1)
 * @property {number} accuracy - Percentage of accurate data (0-1)
 * @property {number} consistency - Data consistency score (0-1)
 * @property {number} validity - Data validity score (0-1)
 * @property {number} uniqueness - Data uniqueness score (0-1)
 * @property {number} timeliness - Data timeliness score (0-1)
 */
export interface DataQualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  validity: number;
  uniqueness: number;
  timeliness: number;
}

/**
 * Machine learning model performance information
 * @interface ModelPerformance
 * @property {string} modelId - Unique model identifier
 * @property {string} name - Human-readable model name
 * @property {string} version - Model version string
 * @property {'active' | 'training' | 'error' | 'deprecated'} status - Current model status
 * @property {BIMetrics} metrics - Model performance metrics
 * @property {string} lastTrained - ISO timestamp of last training
 * @property {number} trainingDataSize - Size of training dataset
 * @property {number} predictionCount - Number of predictions made
 */
export interface ModelPerformance {
  modelId: string;
  name: string;
  version: string;
  status: 'active' | 'training' | 'error' | 'deprecated';
  metrics: BIMetrics;
  lastTrained: string;
  trainingDataSize: number;
  predictionCount: number;
}

/**
 * Production-ready Business Intelligence service with comprehensive analytics capabilities
 * @class BIService
 * @purpose Provides advanced BI analytics, ML model monitoring, and predictive insights
 * @modularity Service instance with comprehensive BI methods and data processing
 * @scalability Multi-tenant BI analytics with data isolation and performance optimization
 * @performance Optimized BI queries with caching, aggregation, and real-time processing
 * @monitoring Real-time BI monitoring, model performance tracking, and data quality validation
 */
/**
 * Production-ready Business Intelligence service with comprehensive analytics capabilities
 * @class BIService
 * @purpose Provides advanced BI analytics, ML model monitoring, and predictive insights
 * @modularity Service instance with comprehensive BI methods and data processing
 * @scalability Multi-tenant BI analytics with data isolation and performance optimization
 * @performance Optimized BI queries with caching, aggregation, and real-time processing
 * @monitoring Real-time BI monitoring, model performance tracking, and data quality validation
 */
export class BIService {
  // Credit Scoring

  /**
   * Retrieve credit scoring model performance metrics
   * @method getCreditScoringMetrics
   * @returns {Promise<BIMetrics>} Credit scoring model performance metrics
   * @api_integration GET /bi/credit-scoring/metrics endpoint
   * @caching BI metrics caching with configurable TTL
   * @performance Optimized API call with error handling and retry logic
   * @monitoring Credit scoring model performance tracking
   * @example
   * const biService = new BIService();
   * const metrics = await biService.getCreditScoringMetrics();
   * console.log('Credit scoring accuracy:', metrics.accuracy);
   */
  async getCreditScoringMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/credit-scoring/metrics'
    );
    return response.data;
  }

  async getCreditScoringPredictions(
    limit: number = 30
  ): Promise<PredictionData[]> {
    const response = await apiClient.get<{ data: PredictionData[] }>(
      `/bi/credit-scoring/predictions?limit=${limit}`
    );
    return response.data;
  }

  // Fraud Detection
  async getFraudDetectionMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/fraud-detection/metrics'
    );
    return response.data;
  }

  async getFraudDetectionAlerts(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/fraud-detection/alerts');
    return response.data;
  }

  // Recommendations
  async getRecommendationMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/recommendations/metrics'
    );
    return response.data;
  }

  async getRecommendationPerformance(): Promise<PredictionData[]> {
    const response = await apiClient.get<{ data: PredictionData[] }>(
      '/bi/recommendations/performance'
    );
    return response.data;
  }

  // Customer Segmentation
  async getCustomerSegmentationMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/customer-segmentation/metrics'
    );
    return response.data;
  }

  async getSegmentationClusters(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/customer-segmentation/clusters');
    return response.data;
  }

  // Dynamic Pricing
  async getDynamicPricingMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/dynamic-pricing/metrics'
    );
    return response.data;
  }

  async getPricingOptimization(): Promise<PredictionData[]> {
    const response = await apiClient.get<{ data: PredictionData[] }>(
      '/bi/dynamic-pricing/optimization'
    );
    return response.data;
  }

  // Churn Prediction
  async getChurnPredictionMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/churn-prediction/metrics'
    );
    return response.data;
  }

  async getChurnRiskCustomers(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/churn-prediction/risk-customers');
    return response.data;
  }

  // Spending Analysis NLP
  async getSpendingAnalysisMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/spending-analysis/metrics'
    );
    return response.data;
  }

  async getSpendingInsights(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/spending-analysis/insights');
    return response.data;
  }

  // Financial Education
  async getFinancialEducationMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/financial-education/metrics'
    );
    return response.data;
  }

  async getEducationProgress(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/financial-education/progress');
    return response.data;
  }

  // Gamification ML
  async getGamificationMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/gamification/metrics'
    );
    return response.data;
  }

  async getGamificationLeaderboard(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/gamification/leaderboard');
    return response.data;
  }

  // A/B Testing
  async getABTestingMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/ab-testing/metrics'
    );
    return response.data;
  }

  async getABTestResults(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/ab-testing/results');
    return response.data;
  }

  // Model Monitoring
  async getModelMonitoringMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/model-monitoring/metrics'
    );
    return response.data;
  }

  async getModelDrift(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/model-monitoring/drift');
    return response.data;
  }

  // Advanced Analytics
  async getAdvancedAnalyticsMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/advanced-analytics/metrics'
    );
    return response.data;
  }

  async getAdvancedAnalyticsInsights(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/advanced-analytics/insights');
    return response.data;
  }

  // Data Quality
  async getDataQualityMetrics(): Promise<DataQualityMetrics> {
    const response = await apiClient.get<{ data: DataQualityMetrics }>(
      '/bi/data-quality/metrics'
    );
    return response.data;
  }

  async getDataQualityIssues(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/data-quality/issues');
    return response.data;
  }

  // Business Intelligence
  async getBusinessIntelligenceMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/business-intelligence/metrics'
    );
    return response.data;
  }

  async getBusinessIntelligenceReports(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/business-intelligence/reports');
    return response.data;
  }

  // Predictive Analytics
  async getPredictiveAnalyticsMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/predictive-analytics/metrics'
    );
    return response.data;
  }

  async getPredictiveAnalyticsForecasts(): Promise<PredictionData[]> {
    const response = await apiClient.get<{ data: PredictionData[] }>(
      '/bi/predictive-analytics/forecasts'
    );
    return response.data;
  }

  // Real-time Analytics
  async getRealtimeAnalyticsMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/realtime-analytics/metrics'
    );
    return response.data;
  }

  async getRealtimeAnalyticsStream(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/realtime-analytics/stream');
    return response.data;
  }

  // Data Visualization
  async getDataVisualizationMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/data-visualization/metrics'
    );
    return response.data;
  }

  async getDataVisualizationCharts(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/data-visualization/charts');
    return response.data;
  }

  // MLOps
  async getMLOpsMetrics(): Promise<BIMetrics> {
    const response = await apiClient.get<{ data: BIMetrics }>(
      '/bi/mlops/metrics'
    );
    return response.data;
  }

  async getMLOpsPipelineStatus(): Promise<unknown[]> {
    const response = await apiClient.get<{
      data: (string | number | boolean)[];
    }>('/bi/mlops/pipeline-status');
    return response.data;
  }

  // Generic methods
  async getAllModelPerformance(): Promise<ModelPerformance[]> {
    const response = await apiClient.get<{ data: ModelPerformance[] }>(
      '/bi/models/performance'
    );
    return response.data;
  }

  async retrainModel(modelId: string): Promise<void> {
    await apiClient.post(`/bi/models/${modelId}/retrain`);
  }

  async exportData(
    system: string,
    format: 'csv' | 'json' | 'excel'
  ): Promise<Blob> {
    const response = await fetch(`/api/bi/${system}/export?format=${format}`);
    return await response.blob();
  }
}

export const biService = new BIService();
export default biService;
