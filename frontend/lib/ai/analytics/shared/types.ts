/**
 * Shared Types and Interfaces for Analytics System
 *
 * Centralized type definitions for all analytics modules
 * Location: lib/ai/analytics/shared/types.ts
 * Purpose: Provide consistent interfaces across all analytics components
 * Modularity: Separated types for better maintainability and reusability
 */

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface ForecastResult {
  timestamp: Date;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  confidence_level: number;
}

export interface CohortAnalysis {
  cohort_period: string;
  cohort_size: number;
  retention_rates: number[];
  revenue_per_cohort: number[];
  lifetime_value: number;
}

export interface CustomerLifetimeValue {
  customer_id: string;
  predicted_ltv: number;
  confidence_score: number;
  factors: {
    recency: number;
    frequency: number;
    monetary: number;
    engagement: number;
  };
  recommendations: string[];
}

export interface DemandForecast {
  property_id: string;
  service_type: string;
  forecast_period: string;
  predicted_demand: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  seasonality_factor: number;
  trend_factor: number;
  external_factors: Record<string, number>;
}

export interface RevenuePrediction {
  property_id: string;
  period: string;
  predicted_revenue: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  breakdown: {
    room_revenue: number;
    restaurant_revenue: number;
    spa_revenue: number;
    other_revenue: number;
  };
  growth_rate: number;
}

export interface BusinessIntelligenceMetrics {
  kpis: {
    occupancy_rate: number;
    average_daily_rate: number;
    revenue_per_available_room: number;
    customer_satisfaction: number;
    employee_productivity: number;
  };
  trends: {
    revenue_trend: 'increasing' | 'decreasing' | 'stable';
    occupancy_trend: 'increasing' | 'decreasing' | 'stable';
    customer_satisfaction_trend: 'increasing' | 'decreasing' | 'stable';
  };
  insights: string[];
  recommendations: string[];
}

// Configuration interfaces
export interface AnalyticsConfig {
  cache: {
    ttl_ms: number;
    max_size: number;
  };
  forecasting: {
    min_data_points: number;
    default_confidence_level: number;
    max_forecast_periods: number;
  };
  modeling: {
    default_iterations: number;
    convergence_threshold: number;
    regularization_strength: number;
  };
}

// Base analytics interface
export interface BaseAnalytics {
  initialize(): Promise<void>;
  getHealthStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    last_updated: Date;
    cache_hit_rate?: number;
    error_rate?: number;
  }>;
}

// Forecasting method types
export type ForecastingMethod =
  | 'arima'
  | 'exponential_smoothing'
  | 'linear_regression'
  | 'seasonal';

// Statistical analysis interfaces
export interface StatisticalSummary {
  mean: number;
  median: number;
  mode: number[];
  standard_deviation: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  min: number;
  max: number;
  quartiles: [number, number, number];
  outliers: number[];
}

export interface CorrelationAnalysis {
  correlation_coefficient: number;
  p_value: number;
  significance_level: number;
  relationship_strength: 'weak' | 'moderate' | 'strong' | 'very_strong';
  direction: 'positive' | 'negative' | 'none';
}

// Time series analysis interfaces
export interface SeasonalDecomposition {
  trend: TimeSeriesData[];
  seasonal: TimeSeriesData[];
  residual: TimeSeriesData[];
  seasonal_period: number;
}

export interface TrendAnalysis {
  slope: number;
  intercept: number;
  r_squared: number;
  trend_direction: 'increasing' | 'decreasing' | 'stable';
  change_rate: number; // percentage change per period
}

// Customer segmentation interfaces
export interface CustomerSegment {
  segment_id: string;
  segment_name: string;
  customer_count: number;
  average_ltv: number;
  characteristics: {
    demographics: Record<string, any>;
    behavior: Record<string, any>;
    preferences: string[];
  };
  recommendations: string[];
}

// Performance tracking interfaces
export interface AnalyticsPerformanceMetrics {
  query_execution_time: number;
  cache_hit_rate: number;
  model_accuracy: number;
  prediction_error_rate: number;
  system_uptime: number;
}

// Database query result interfaces
export interface RevenueDataPoint {
  date: Date;
  revenue: number;
  category: string;
  source: string;
}

export interface CustomerDataPoint {
  customer_id: string;
  first_visit: Date;
  last_visit: Date;
  total_spent: number;
  visit_count: number;
  average_order_value: number;
  preferred_services: string[];
}

export interface OperationalDataPoint {
  date: Date;
  occupancy_rate: number;
  average_daily_rate: number;
  bookings_count: number;
  cancellations_count: number;
  no_show_count: number;
}
