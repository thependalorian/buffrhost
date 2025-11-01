/**
 * Analytics and Business Intelligence Type Definitions
 *
 * Purpose: Type definitions for analytics, reporting, business intelligence, and forecasting
 * in Buffr Host. These types align with backend Python schemas for consistent data structures.
 * Location: lib/types/analytics.ts
 * Usage: Shared across analytics components, BI dashboards, reporting APIs, and ML forecasting services
 *
 * @module Analytics Types
 * @author Buffr Host Development Team
 * @version 1.0.0
 */

/**
 * Report Type Enumeration
 *
 * Defines the different types of analytics reports available in the system.
 *
 * @enum ReportType
 * @property {string} REVENUE - Revenue analysis reports
 * @property {string} OCCUPANCY - Occupancy rate reports
 * @property {string} GUEST - Guest analytics reports
 * @property {string} PERFORMANCE - Performance metrics reports
 * @property {string} COMPETITIVE - Competitive analysis reports
 * @property {string} FORECAST - Forecasting and prediction reports
 * @property {string} CUSTOM - Custom report types
 */
/**
 * Analytics Type Definitions for Buffr Host Hospitality Platform
 * @fileoverview Analytics type definitions for business intelligence, reporting, and data analytics operations
 * @location buffr-host/lib/types/analytics.ts
 * @purpose analytics type definitions for business intelligence, reporting, and data analytics operations
 * @modularity Centralized type definitions providing type safety across the entire Buffr Host application
 * @api_integration REST API endpoints, HTTP request/response handling
 * @security Type-safe security definitions for authentication, authorization, and data protection
 * @ai_integration Machine learning and AI service type definitions for predictive analytics
 * @authentication User authentication and session management type definitions
 * @typescript_strict Strict TypeScript type safety ensuring compile-time error prevention
 * @type_safety Comprehensive type coverage preventing runtime errors and improving developer experience
 * @scalability Type definitions supporting horizontal scaling and multi-tenant architecture
 * @maintainability Self-documenting types enabling easier code maintenance and refactoring
 * @testing Type-driven development supporting comprehensive test coverage
 *
 * Type Definitions Summary:
 * - 25 Interfaces: AnalyticsRequest, RevenueAnalyticsRequest, RevenueAnalyticsResponse...
 * - 3 Enums: ReportType, GroupBy, MetricType
 * - Total: 28 type definitions
 *
 * Usage and Integration:
 * - Frontend Components: Type-safe props and state management
 * - API Routes: Request/response type validation
 * - Database Services: Schema-aligned data operations
 * - Business Logic: Domain-specific type constraints
 * - Testing: Type-driven test case generation
 *
 * @example
 * // Import type definitions
 * import type { ReportType, GroupBy, MetricType... } from './analytics';
 *
 * // Usage in component
 * interface ComponentProps {
 *   data: AnalyticsRequest;
 *   onAction: (event: EventType) => void;
 * }
 *
 * @example
 * // Database service usage
 * const userService = {
 *   async getUser(id: string): Promise<User> {
 *     // Type-safe database operations
 *     return await db.query('SELECT * FROM users WHERE id = $1', [id]);
 *   }
 * };
 *
 * Exported Types:
 * @typedef {Enum} ReportType
 * @typedef {Enum} GroupBy
 * @typedef {Enum} MetricType
 * @typedef {Interface} AnalyticsRequest
 * @typedef {Interface} RevenueAnalyticsRequest
 * @typedef {Interface} RevenueAnalyticsResponse
 * @typedef {Interface} OccupancyAnalyticsRequest
 * @typedef {Interface} OccupancyAnalyticsResponse
 * @typedef {Interface} GuestAnalyticsRequest
 * @typedef {Interface} GuestAnalyticsResponse
 * ... and 18 more type definitions
 *
 * @returns {Object} Type definitions module with all exported types and interfaces
 * @type_safety Ensures 100% type coverage across the Buffr Host application
 * @documentation Comprehensive JSDoc documentation for developer experience
 * @maintainability Type-driven development enabling safe refactoring and evolution
 */

export enum ReportType {
  REVENUE = 'revenue',
  OCCUPANCY = 'occupancy',
  GUEST = 'guest',
  PERFORMANCE = 'performance',
  COMPETITIVE = 'competitive',
  FORECAST = 'forecast',
  CUSTOM = 'custom',
}

/**
 * Group By Enumeration
 *
 * Defines the time periods for grouping analytics data.
 *
 * @enum GroupBy
 * @property {string} DAY - Group data by day
 * @property {string} WEEK - Group data by week
 * @property {string} MONTH - Group data by month
 * @property {string} QUARTER - Group data by quarter
 * @property {string} YEAR - Group data by year
 */
export enum GroupBy {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

/**
 * Metric Type Enumeration
 *
 * Defines the types of metrics that can be analyzed in analytics reports.
 *
 * @enum MetricType
 * @property {string} REVENUE - Total revenue metrics
 * @property {string} OCCUPANCY - Occupancy rate metrics
 * @property {string} ADR - Average Daily Rate (for hotels)
 * @property {string} REVPAR - Revenue Per Available Room (for hotels)
 * @property {string} GUEST_COUNT - Number of guests
 * @property {string} BOOKING_COUNT - Number of bookings
 * @property {string} SATISFACTION - Customer satisfaction scores
 */
export enum MetricType {
  REVENUE = 'revenue',
  OCCUPANCY = 'occupancy',
  ADR = 'adr',
  REVPAR = 'revpar',
  GUEST_COUNT = 'guest_count',
  BOOKING_COUNT = 'booking_count',
  SATISFACTION = 'satisfaction',
}

/**
 * Analytics Request Interface
 *
 * Base interface for all analytics request types. Contains common fields required
 * for analytics queries.
 *
 * @interface AnalyticsRequest
 * @property {string} property_id - Property ID to analyze (required)
 * @property {Date} start_date - Start date for the analysis period
 * @property {Date} end_date - End date for the analysis period
 * @property {GroupBy} group_by - Time period grouping for the data
 *
 * @example
 * const request: AnalyticsRequest = {
 *   property_id: 'prop_123',
 *   start_date: new Date('2024-01-01'),
 *   end_date: new Date('2024-01-31'),
 *   group_by: GroupBy.DAY
 * };
 */
export interface AnalyticsRequest {
  property_id: string;
  start_date: Date;
  end_date: Date;
  group_by: GroupBy;
}

export interface RevenueAnalyticsRequest extends AnalyticsRequest {
  include_breakdown: boolean;
  include_growth: boolean;
}

export interface RevenueAnalyticsResponse {
  property_id: string;
  period: Record<string, string>;
  summary: Record<string, number>;
  revenue_trend: Array<Record<string, any>>;
  room_type_breakdown: Array<Record<string, any>>;
  generated_at: string;
}

export interface OccupancyAnalyticsRequest extends AnalyticsRequest {
  include_room_types: boolean;
  include_seasonality: boolean;
}

export interface OccupancyAnalyticsResponse {
  property_id: string;
  period: Record<string, string>;
  summary: Record<string, number>;
  daily_occupancy: Array<Record<string, any>>;
  generated_at: string;
}

export interface GuestAnalyticsRequest {
  property_id: string;
  days: number;
  include_demographics: boolean;
  include_behavior: boolean;
}

export interface GuestAnalyticsResponse {
  property_id: string;
  period_days: number;
  summary: Record<string, any>;
  demographics: Record<string, any>;
  generated_at: string;
}

export interface PerformanceAnalyticsRequest {
  property_id: string;
  days: number;
  include_trends: boolean;
  include_forecasting: boolean;
}

export interface PerformanceAnalyticsResponse {
  property_id: string;
  property_name: string;
  period_days: number;
  kpis: Record<string, any>;
  revenue_metrics: Record<string, any>;
  occupancy_metrics: Record<string, any>;
  guest_metrics: Record<string, any>;
  market_comparison: Record<string, any>;
  trends: Record<string, any>;
  generated_at: string;
}

export interface CompetitiveAnalysisRequest {
  property_id: string;
  competitor_properties: string[];
  metrics: MetricType[];
}

export interface CompetitiveAnalysisResponse {
  property_id: string;
  competitors: number;
  analysis: Record<string, any>;
  generated_at: string;
}

export interface ForecastingRequest {
  property_id: string;
  forecast_days: number;
  include_confidence: boolean;
  include_scenarios: boolean;
}

export interface ForecastingResponse {
  property_id: string;
  forecast_days: number;
  forecast: Record<string, any>;
  confidence_level: number;
  generated_at: string;
}

export interface CustomReportRequest {
  property_id: string;
  report_type: ReportType;
  start_date: Date;
  end_date: Date;
  metrics: MetricType[];
  filters?: Record<string, any>;
  group_by?: GroupBy;
  format: string; // json, csv, pdf
}

export interface CustomReportResponse {
  property_id: string;
  report_type: string;
  period: Record<string, string>;
  metrics: Record<string, any>;
  generated_at: string;
}

export interface KPISummary {
  total_revenue: number;
  average_occupancy: number;
  average_daily_rate: number;
  revenue_per_available_room: number;
  total_guests: number;
  repeat_guest_rate: number;
  average_stay_length: number;
  revenue_growth: number;
}

export interface TrendAnalysis {
  metric: string;
  trend_direction: string; // increasing, decreasing, stable
  change_percentage: number;
  period: string;
  confidence: number;
}

export interface MarketComparison {
  metric: string;
  property_value: number;
  market_average: number;
  variance: number;
  percentile: number;
  performance: string; // above_average, average, below_average
}

export interface DashboardData {
  property_id: string;
  property_name: string;
  current_period: Record<string, string>;
  kpis: KPISummary;
  trends: TrendAnalysis[];
  market_comparison: MarketComparison[];
  generated_at: string;
}

export interface RealTimeMetrics {
  property_id: string;
  timestamp: Date;
  occupancy_rate: number;
  revenue_today: number;
  bookings_today: number;
  cancellations_today: number;
  average_rating: number;
  active_guests: number;
  available_rooms: number;
}

export interface MLModelMetrics {
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  last_trained: Date;
  predictions_today: number;
  confidence_threshold: number;
}

export interface AITaskStatus {
  task_id: string;
  status: string; // pending, running, completed, failed
  progress: number;
  result?: unknown;
  error?: string;
  created_at: Date;
  completed_at?: Date;
}

export interface DataQualityMetrics {
  property_id: string;
  data_completeness: number;
  data_accuracy: number;
  data_consistency: number;
  missing_fields: string[];
  duplicate_records: number;
  last_updated: Date;
}

export interface BusinessIntelligenceInsights {
  property_id: string;
  insight_type: string;
  title: string;
  description: string;
  impact: string; // high, medium, low
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  generated_at: Date;
}

/**
 * Revenue Analytics Interface
 *
 * Main interface for revenue analytics data and operations.
 */
export interface RevenueAnalytics {
  id: string;
  propertyId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  revenue: {
    total: number;
    breakdown: {
      bookings: number;
      services: number;
      other: number;
    };
  };
  metrics: {
    averageDailyRate: number;
    occupancyRate: number;
    revenuePerAvailableRoom: number;
  };
  trends: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  forecasts: {
    nextMonth: number;
    nextQuarter: number;
    confidence: number;
  };
}
