/**
 * Analytics Zod Schemas
 * Validation schemas for Business Intelligence and Analytics
 */

import { z } from 'zod';

export const ReportTypeSchema = z.enum([
  'revenue',
  'occupancy',
  'guest',
  'performance',
  'competitive',
  'forecast',
  'custom',
]);

export const GroupBySchema = z.enum([
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

export const MetricTypeSchema = z.enum([
  'revenue',
  'occupancy',
  'adr',
  'revpar',
  'guest_count',
  'booking_count',
  'satisfaction',
]);

export const AnalyticsRequestSchema = z.object({
  property_id: z.string().uuid(),
  start_date: z.date(),
  end_date: z.date(),
  group_by: GroupBySchema,
});

export const RevenueAnalyticsRequestSchema = AnalyticsRequestSchema.extend({
  include_breakdown: z.boolean().default(true),
  include_growth: z.boolean().default(true),
});

export const RevenueAnalyticsResponseSchema = z.object({
  property_id: z.string().uuid(),
  period: z.record(z.string(), z.string()),
  summary: z.record(z.string(), z.number()),
  revenue_trend: z.array(z.record(z.string(), z.any())),
  room_type_breakdown: z.array(z.record(z.string(), z.any())),
  generated_at: z.string(),
});

export const OccupancyAnalyticsRequestSchema = AnalyticsRequestSchema.extend({
  include_room_types: z.boolean().default(true),
  include_seasonality: z.boolean().default(false),
});

export const OccupancyAnalyticsResponseSchema = z.object({
  property_id: z.string().uuid(),
  period: z.record(z.string(), z.string()),
  summary: z.record(z.string(), z.number()),
  daily_occupancy: z.array(z.record(z.string(), z.any())),
  generated_at: z.string(),
});

export const GuestAnalyticsRequestSchema = z.object({
  property_id: z.string().uuid(),
  days: z.number().int().min(1).max(365).default(30),
  include_demographics: z.boolean().default(true),
  include_behavior: z.boolean().default(true),
});

export const GuestAnalyticsResponseSchema = z.object({
  property_id: z.string().uuid(),
  period_days: z.number().int(),
  summary: z.record(z.string(), z.any()),
  demographics: z.record(z.string(), z.any()),
  generated_at: z.string(),
});

export const PerformanceAnalyticsRequestSchema = z.object({
  property_id: z.string().uuid(),
  days: z.number().int().min(1).max(365).default(30),
  include_trends: z.boolean().default(true),
  include_forecasting: z.boolean().default(false),
});

export const PerformanceAnalyticsResponseSchema = z.object({
  property_id: z.string().uuid(),
  property_name: z.string(),
  period_days: z.number().int(),
  kpis: z.record(z.string(), z.any()),
  revenue_metrics: z.record(z.string(), z.any()),
  occupancy_metrics: z.record(z.string(), z.any()),
  guest_metrics: z.record(z.string(), z.any()),
  market_comparison: z.record(z.string(), z.any()),
  trends: z.record(z.string(), z.any()),
  generated_at: z.string(),
});

export const CompetitiveAnalysisRequestSchema = z.object({
  property_id: z.string().uuid(),
  competitor_properties: z.array(z.string().uuid()),
  metrics: z.array(MetricTypeSchema).default(['occupancy', 'adr', 'revpar']),
});

export const CompetitiveAnalysisResponseSchema = z.object({
  property_id: z.string().uuid(),
  competitors: z.number().int(),
  analysis: z.record(z.string(), z.any()),
  generated_at: z.string(),
});

export const ForecastingRequestSchema = z.object({
  property_id: z.string().uuid(),
  forecast_days: z.number().int().min(1).max(365).default(30),
  include_confidence: z.boolean().default(true),
  include_scenarios: z.boolean().default(false),
});

export const ForecastingResponseSchema = z.object({
  property_id: z.string().uuid(),
  forecast_days: z.number().int(),
  forecast: z.record(z.string(), z.any()),
  confidence_level: z.number().min(0).max(1),
  generated_at: z.string(),
});

export const CustomReportRequestSchema = z.object({
  property_id: z.string().uuid(),
  report_type: ReportTypeSchema.default('custom'),
  start_date: z.date(),
  end_date: z.date(),
  metrics: z.array(MetricTypeSchema),
  filters: z.record(z.string(), z.any()).optional(),
  group_by: GroupBySchema.optional(),
  format: z.enum(['json', 'csv', 'pdf']).default('json'),
});

export const CustomReportResponseSchema = z.object({
  property_id: z.string().uuid(),
  report_type: z.string(),
  period: z.record(z.string(), z.string()),
  metrics: z.record(z.string(), z.any()),
  generated_at: z.string(),
});

export const KPISummarySchema = z.object({
  total_revenue: z.number(),
  average_occupancy: z.number().min(0).max(100),
  average_daily_rate: z.number(),
  revenue_per_available_room: z.number(),
  total_guests: z.number().int(),
  repeat_guest_rate: z.number().min(0).max(100),
  average_stay_length: z.number(),
  revenue_growth: z.number(),
});

export const TrendAnalysisSchema = z.object({
  metric: z.string(),
  trend_direction: z.enum(['increasing', 'decreasing', 'stable']),
  change_percentage: z.number(),
  period: z.string(),
  confidence: z.number().min(0).max(1),
});

export const MarketComparisonSchema = z.object({
  metric: z.string(),
  property_value: z.number(),
  market_average: z.number(),
  variance: z.number(),
  percentile: z.number().int().min(0).max(100),
  performance: z.enum(['above_average', 'average', 'below_average']),
});

export const DashboardDataSchema = z.object({
  property_id: z.string().uuid(),
  property_name: z.string(),
  current_period: z.record(z.string(), z.string()),
  kpis: KPISummarySchema,
  trends: z.array(TrendAnalysisSchema),
  market_comparison: z.array(MarketComparisonSchema),
  generated_at: z.string(),
});

export const RealTimeMetricsSchema = z.object({
  property_id: z.string().uuid(),
  timestamp: z.date(),
  occupancy_rate: z.number().min(0).max(100),
  revenue_today: z.number(),
  bookings_today: z.number().int(),
  cancellations_today: z.number().int(),
  average_rating: z.number().min(0).max(5),
  active_guests: z.number().int(),
  available_rooms: z.number().int(),
});

export const MLModelMetricsSchema = z.object({
  model_name: z.string(),
  accuracy: z.number().min(0).max(1),
  precision: z.number().min(0).max(1),
  recall: z.number().min(0).max(1),
  f1_score: z.number().min(0).max(1),
  last_trained: z.date(),
  predictions_today: z.number().int(),
  confidence_threshold: z.number().min(0).max(1),
});

export const AITaskStatusSchema = z.object({
  task_id: z.string().uuid(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  result: z.any().optional(),
  error: z.string().optional(),
  created_at: z.date(),
  completed_at: z.date().optional(),
});

export const DataQualityMetricsSchema = z.object({
  property_id: z.string().uuid(),
  data_completeness: z.number().min(0).max(100),
  data_accuracy: z.number().min(0).max(100),
  data_consistency: z.number().min(0).max(100),
  missing_fields: z.array(z.string()),
  duplicate_records: z.number().int(),
  last_updated: z.date(),
});

export const BusinessIntelligenceInsightsSchema = z.object({
  property_id: z.string().uuid(),
  insight_type: z.string(),
  title: z.string(),
  description: z.string(),
  impact: z.enum(['high', 'medium', 'low']),
  confidence: z.number().min(0).max(1),
  actionable: z.boolean(),
  recommendations: z.array(z.string()),
  generated_at: z.date(),
});

export const AnalyticsSearchSchema = z.object({
  property_id: z.string().uuid().optional(),
  report_type: ReportTypeSchema.optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  metrics: z.array(MetricTypeSchema).optional(),
  group_by: GroupBySchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const AnalyticsExportSchema = z.object({
  property_id: z.string().uuid(),
  report_type: ReportTypeSchema,
  start_date: z.date(),
  end_date: z.date(),
  format: z.enum(['json', 'csv', 'pdf', 'excel']).default('json'),
  include_charts: z.boolean().default(true),
  include_raw_data: z.boolean().default(false),
});

export const AnalyticsAlertSchema = z.object({
  property_id: z.string().uuid(),
  metric: MetricTypeSchema,
  threshold: z.number(),
  operator: z.enum(['greater_than', 'less_than', 'equals', 'not_equals']),
  frequency: z.enum(['immediate', 'daily', 'weekly', 'monthly']),
  enabled: z.boolean().default(true),
  notification_channels: z.array(z.string()).default(['email']),
});

export const AnalyticsDashboardSchema = z.object({
  property_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  widgets: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      config: z.record(z.string(), z.any()),
      position: z.object({
        x: z.number().int(),
        y: z.number().int(),
        width: z.number().int(),
        height: z.number().int(),
      }),
    })
  ),
  is_public: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
});
