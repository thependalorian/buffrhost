"""
Analytics Schemas
Pydantic models for analytics and reporting API requests and responses
"""

from pydantic import BaseModel, validator
from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from enum import Enum

class ReportType(str, Enum):
    """Report type options"""
    REVENUE = "revenue"
    OCCUPANCY = "occupancy"
    GUEST = "guest"
    PERFORMANCE = "performance"
    COMPETITIVE = "competitive"
    FORECAST = "forecast"
    CUSTOM = "custom"

class GroupBy(str, Enum):
    """Grouping options for analytics"""
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    QUARTER = "quarter"
    YEAR = "year"

class MetricType(str, Enum):
    """Metric type options"""
    REVENUE = "revenue"
    OCCUPANCY = "occupancy"
    ADR = "adr"
    REVPAR = "revpar"
    GUEST_COUNT = "guest_count"
    BOOKING_COUNT = "booking_count"
    SATISFACTION = "satisfaction"

# Base analytics request schema
class AnalyticsRequest(BaseModel):
    """Base schema for analytics requests"""
    property_id: str
    start_date: datetime
    end_date: datetime
    group_by: GroupBy = GroupBy.DAY

# Revenue analytics schema
class RevenueAnalyticsRequest(AnalyticsRequest):
    """Schema for revenue analytics request"""
    include_breakdown: bool = True
    include_growth: bool = True

class RevenueAnalyticsResponse(BaseModel):
    """Schema for revenue analytics response"""
    property_id: str
    period: Dict[str, str]
    summary: Dict[str, float]
    revenue_trend: List[Dict[str, Any]]
    room_type_breakdown: List[Dict[str, Any]]
    generated_at: str

# Occupancy analytics schema
class OccupancyAnalyticsRequest(AnalyticsRequest):
    """Schema for occupancy analytics request"""
    include_room_types: bool = True
    include_seasonality: bool = False

class OccupancyAnalyticsResponse(BaseModel):
    """Schema for occupancy analytics response"""
    property_id: str
    period: Dict[str, str]
    summary: Dict[str, float]
    daily_occupancy: List[Dict[str, Any]]
    generated_at: str

# Guest analytics schema
class GuestAnalyticsRequest(BaseModel):
    """Schema for guest analytics request"""
    property_id: str
    days: int = 30
    include_demographics: bool = True
    include_behavior: bool = True

class GuestAnalyticsResponse(BaseModel):
    """Schema for guest analytics response"""
    property_id: str
    period_days: int
    summary: Dict[str, Any]
    demographics: Dict[str, Any]
    generated_at: str

# Performance analytics schema
class PerformanceAnalyticsRequest(BaseModel):
    """Schema for performance analytics request"""
    property_id: str
    days: int = 30
    include_trends: bool = True
    include_forecasting: bool = False

class PerformanceAnalyticsResponse(BaseModel):
    """Schema for performance analytics response"""
    property_id: str
    property_name: str
    period_days: int
    kpis: Dict[str, Any]
    revenue_metrics: Dict[str, Any]
    occupancy_metrics: Dict[str, Any]
    guest_metrics: Dict[str, Any]
    market_comparison: Dict[str, Any]
    trends: Dict[str, Any]
    generated_at: str

# Competitive analysis schema
class CompetitiveAnalysisRequest(BaseModel):
    """Schema for competitive analysis request"""
    property_id: str
    competitor_properties: List[str]
    metrics: List[MetricType] = [MetricType.OCCUPANCY, MetricType.ADR, MetricType.REVPAR]

class CompetitiveAnalysisResponse(BaseModel):
    """Schema for competitive analysis response"""
    property_id: str
    competitors: int
    analysis: Dict[str, Any]
    generated_at: str

# Forecasting schema
class ForecastingRequest(BaseModel):
    """Schema for forecasting request"""
    property_id: str
    forecast_days: int = 30
    include_confidence: bool = True
    include_scenarios: bool = False

class ForecastingResponse(BaseModel):
    """Schema for forecasting response"""
    property_id: str
    forecast_days: int
    forecast: Dict[str, Any]
    confidence_level: float
    generated_at: str

# Custom report schema
class CustomReportRequest(BaseModel):
    """Schema for custom report request"""
    property_id: str
    report_type: ReportType = ReportType.CUSTOM
    start_date: datetime
    end_date: datetime
    metrics: List[MetricType]
    filters: Optional[Dict[str, Any]] = None
    group_by: Optional[GroupBy] = None
    format: str = "json"  # json, csv, pdf

class CustomReportResponse(BaseModel):
    """Schema for custom report response"""
    property_id: str
    report_type: str
    period: Dict[str, str]
    metrics: Dict[str, Any]
    generated_at: str

# KPI schema
class KPISummary(BaseModel):
    """Schema for KPI summary"""
    total_revenue: float
    average_occupancy: float
    average_daily_rate: float
    revenue_per_available_room: float
    total_guests: int
    repeat_guest_rate: float
    average_stay_length: float
    revenue_growth: float

# Trend analysis schema
class TrendAnalysis(BaseModel):
    """Schema for trend analysis"""
    metric: str
    trend_direction: str  # increasing, decreasing, stable
    change_percentage: float
    period: str
    confidence: float

# Market comparison schema
class MarketComparison(BaseModel):
    """Schema for market comparison"""
    metric: str
    property_value: float
    market_average: float
    variance: float
    percentile: int
    performance: str  # above_average, average, below_average

# Dashboard data schema
class DashboardData(BaseModel):
    """Schema for dashboard data"""
    property_id: str
    property_name: str
    current_period: Dict[str, str]
    kpis: KPISummary
    trends: List[TrendAnalysis]
    market_comparison: List[MarketComparison]
    alerts: List[Dict[str, Any]]
    generated_at: str

# Alert schema
class AnalyticsAlert(BaseModel):
    """Schema for analytics alerts"""
    id: str
    type: str  # warning, error, info, success
    title: str
    message: str
    metric: str
    current_value: float
    threshold_value: float
    severity: str  # low, medium, high, critical
    created_at: datetime
    acknowledged: bool = False

# Export schema
class AnalyticsExport(BaseModel):
    """Schema for analytics export"""
    property_id: str
    report_type: ReportType
    start_date: datetime
    end_date: datetime
    format: str = "csv"  # csv, json, xlsx, pdf
    metrics: List[MetricType]
    filters: Optional[Dict[str, Any]] = None

# Benchmark schema
class BenchmarkData(BaseModel):
    """Schema for benchmark data"""
    property_id: str
    metric: str
    current_value: float
    benchmark_value: float
    industry_average: float
    percentile_rank: int
    performance_rating: str  # excellent, good, average, below_average, poor

# Seasonality analysis schema
class SeasonalityAnalysis(BaseModel):
    """Schema for seasonality analysis"""
    property_id: str
    metric: str
    seasonal_index: Dict[str, float]  # month -> index
    peak_season: List[str]
    low_season: List[str]
    seasonality_strength: float  # 0-1 scale
    recommendations: List[str]

# Cohort analysis schema
class CohortAnalysis(BaseModel):
    """Schema for cohort analysis"""
    property_id: str
    cohort_type: str  # booking_month, guest_type, etc.
    cohorts: List[Dict[str, Any]]
    retention_rates: Dict[str, float]
    average_lifetime_value: float
    churn_rate: float

# Real-time metrics schema
class RealTimeMetrics(BaseModel):
    """Schema for real-time metrics"""
    property_id: str
    timestamp: datetime
    current_occupancy: float
    today_revenue: float
    today_bookings: int
    pending_check_ins: int
    pending_check_outs: int
    available_rooms: int
    alerts_count: int

# Performance comparison schema
class PerformanceComparison(BaseModel):
    """Schema for performance comparison"""
    property_id: str
    comparison_period: str
    current_period: Dict[str, Any]
    previous_period: Dict[str, Any]
    changes: Dict[str, float]
    insights: List[str]

# API response schemas
class AnalyticsListResponse(BaseModel):
    """Schema for analytics list response"""
    analytics: List[Dict[str, Any]]
    total: int
    page: int
    size: int
    pages: int

class AnalyticsErrorResponse(BaseModel):
    """Schema for analytics error response"""
    success: bool = False
    error: str
    details: Optional[Dict[str, Any]] = None
    generated_at: str

# Bulk analytics schema
class BulkAnalyticsRequest(BaseModel):
    """Schema for bulk analytics request"""
    property_ids: List[str]
    report_type: ReportType
    start_date: datetime
    end_date: datetime
    metrics: List[MetricType]
    group_by: GroupBy = GroupBy.DAY

class BulkAnalyticsResponse(BaseModel):
    """Schema for bulk analytics response"""
    properties: List[Dict[str, Any]]
    summary: Dict[str, Any]
    generated_at: str

# Scheduled report schema
class ScheduledReport(BaseModel):
    """Schema for scheduled report"""
    id: str
    property_id: str
    report_type: ReportType
    schedule: str  # cron expression
    recipients: List[str]
    metrics: List[MetricType]
    is_active: bool
    created_at: datetime
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None

# Report template schema
class ReportTemplate(BaseModel):
    """Schema for report template"""
    id: str
    name: str
    description: str
    report_type: ReportType
    metrics: List[MetricType]
    filters: Dict[str, Any]
    group_by: GroupBy
    format: str
    is_public: bool
    created_by: str
    created_at: datetime

# Analytics configuration schema
class AnalyticsConfig(BaseModel):
    """Schema for analytics configuration"""
    property_id: str
    auto_reports: bool
    alert_thresholds: Dict[str, float]
    dashboard_widgets: List[str]
    report_schedule: Optional[str] = None
    data_retention_days: int = 365
    real_time_enabled: bool = True