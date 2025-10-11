"""
Analytics Routes
FastAPI routes for analytics and reporting
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging

from database import get_db
from auth.dependencies import get_current_user
from auth.permissions import require_permission
from services.analytics_service import AnalyticsService
from schemas.analytics import (
    RevenueAnalyticsRequest,
    RevenueAnalyticsResponse,
    OccupancyAnalyticsRequest,
    OccupancyAnalyticsResponse,
    GuestAnalyticsRequest,
    GuestAnalyticsResponse,
    PerformanceAnalyticsRequest,
    PerformanceAnalyticsResponse,
    CompetitiveAnalysisRequest,
    CompetitiveAnalysisResponse,
    ForecastingRequest,
    ForecastingResponse,
    CustomReportRequest,
    CustomReportResponse,
    DashboardData,
    RealTimeMetrics,
    AnalyticsExport,
    BulkAnalyticsRequest,
    BulkAnalyticsResponse
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

@router.get("/dashboard/{property_id}", response_model=DashboardData)
async def get_dashboard_data(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive dashboard data for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        # Get performance data
        performance_data = analytics_service.get_property_performance(property_id, 30)
        
        # Get real-time metrics
        real_time_metrics = analytics_service.get_real_time_metrics(property_id)
        
        # Get trends
        trends = analytics_service.get_trends(property_id, 30)
        
        # Get market comparison
        market_comparison = analytics_service.get_market_comparison(property_id, [])
        
        # Compile dashboard data
        dashboard_data = {
            "property_id": property_id,
            "property_name": performance_data.get("property_name", ""),
            "current_period": {
                "start": "30 days ago",
                "end": "today"
            },
            "kpis": performance_data.get("kpis", {}),
            "trends": trends,
            "market_comparison": market_comparison,
            "alerts": [],  # Would be populated from alert system
            "generated_at": performance_data.get("generated_at", "")
        }
        
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Failed to get dashboard data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve dashboard data"
        )

@router.post("/revenue", response_model=RevenueAnalyticsResponse)
async def get_revenue_analytics(
    request: RevenueAnalyticsRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get revenue analytics for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        revenue_data = analytics_service.get_revenue_analytics(
            property_id=request.property_id,
            start_date=request.start_date,
            end_date=request.end_date,
            group_by=request.group_by.value
        )
        
        return revenue_data
        
    except Exception as e:
        logger.error(f"Failed to get revenue analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve revenue analytics"
        )

@router.post("/occupancy", response_model=OccupancyAnalyticsResponse)
async def get_occupancy_analytics(
    request: OccupancyAnalyticsRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get occupancy analytics for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        occupancy_data = analytics_service.get_occupancy_analytics(
            property_id=request.property_id,
            start_date=request.start_date,
            end_date=request.end_date
        )
        
        return occupancy_data
        
    except Exception as e:
        logger.error(f"Failed to get occupancy analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve occupancy analytics"
        )

@router.post("/guests", response_model=GuestAnalyticsResponse)
async def get_guest_analytics(
    request: GuestAnalyticsRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get guest analytics for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        guest_data = analytics_service.get_guest_analytics(
            property_id=request.property_id,
            days=request.days
        )
        
        return guest_data
        
    except Exception as e:
        logger.error(f"Failed to get guest analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve guest analytics"
        )

@router.post("/performance", response_model=PerformanceAnalyticsResponse)
async def get_property_performance(
    request: PerformanceAnalyticsRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive property performance metrics"""
    try:
        analytics_service = AnalyticsService(db)
        
        performance_data = analytics_service.get_property_performance(
            property_id=request.property_id,
            days=request.days
        )
        
        return performance_data
        
    except Exception as e:
        logger.error(f"Failed to get property performance: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve property performance"
        )

@router.post("/competitive", response_model=CompetitiveAnalysisResponse)
async def get_competitive_analysis(
    request: CompetitiveAnalysisRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get competitive analysis for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        competitive_data = analytics_service.get_competitive_analysis(
            property_id=request.property_id,
            competitor_properties=request.competitor_properties
        )
        
        return competitive_data
        
    except Exception as e:
        logger.error(f"Failed to get competitive analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve competitive analysis"
        )

@router.post("/forecast", response_model=ForecastingResponse)
async def get_forecasting_data(
    request: ForecastingRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get forecasting data for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        forecast_data = analytics_service.get_forecasting_data(
            property_id=request.property_id,
            forecast_days=request.forecast_days
        )
        
        return forecast_data
        
    except Exception as e:
        logger.error(f"Failed to get forecasting data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve forecasting data"
        )

@router.post("/custom-report", response_model=CustomReportResponse)
async def generate_custom_report(
    request: CustomReportRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate custom analytics report"""
    try:
        analytics_service = AnalyticsService(db)
        
        report_data = analytics_service.get_custom_report(
            property_id=request.property_id,
            report_config={
                "type": request.report_type.value,
                "start_date": request.start_date,
                "end_date": request.end_date,
                "metrics": [metric.value for metric in request.metrics],
                "filters": request.filters,
                "group_by": request.group_by.value if request.group_by else "day"
            }
        )
        
        return report_data
        
    except Exception as e:
        logger.error(f"Failed to generate custom report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate custom report"
        )

@router.get("/real-time/{property_id}", response_model=RealTimeMetrics)
async def get_real_time_metrics(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get real-time metrics for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        real_time_data = analytics_service.get_real_time_metrics(property_id)
        
        return real_time_data
        
    except Exception as e:
        logger.error(f"Failed to get real-time metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve real-time metrics"
        )

@router.post("/export")
async def export_analytics(
    request: AnalyticsExport,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export analytics data in specified format"""
    try:
        analytics_service = AnalyticsService(db)
        
        # Generate export data
        export_data = analytics_service.generate_export(
            property_id=request.property_id,
            report_type=request.report_type.value,
            start_date=request.start_date,
            end_date=request.end_date,
            metrics=[metric.value for metric in request.metrics],
            format=request.format,
            filters=request.filters
        )
        
        # Schedule background task for file generation
        background_tasks.add_task(
            analytics_service.generate_export_file,
            export_data,
            request.format
        )
        
        return {
            "message": "Export initiated",
            "export_id": export_data.get("export_id"),
            "estimated_completion": "5 minutes"
        }
        
    except Exception as e:
        logger.error(f"Failed to export analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to export analytics data"
        )

@router.post("/bulk", response_model=BulkAnalyticsResponse)
async def get_bulk_analytics(
    request: BulkAnalyticsRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics for multiple properties"""
    try:
        analytics_service = AnalyticsService(db)
        
        bulk_data = analytics_service.get_bulk_analytics(
            property_ids=request.property_ids,
            report_type=request.report_type.value,
            start_date=request.start_date,
            end_date=request.end_date,
            metrics=[metric.value for metric in request.metrics],
            group_by=request.group_by.value
        )
        
        return bulk_data
        
    except Exception as e:
        logger.error(f"Failed to get bulk analytics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve bulk analytics"
        )

@router.get("/alerts/{property_id}")
async def get_analytics_alerts(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics alerts for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        alerts = analytics_service.get_analytics_alerts(property_id)
        
        return {
            "property_id": property_id,
            "alerts": alerts,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to get analytics alerts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics alerts"
        )

@router.get("/benchmarks/{property_id}")
async def get_benchmark_data(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get benchmark data for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        benchmark_data = analytics_service.get_benchmark_data(property_id)
        
        return benchmark_data
        
    except Exception as e:
        logger.error(f"Failed to get benchmark data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve benchmark data"
        )

@router.get("/trends/{property_id}")
async def get_trend_analysis(
    property_id: str,
    days: int = 30,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get trend analysis for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        trend_data = analytics_service.get_trend_analysis(property_id, days)
        
        return trend_data
        
    except Exception as e:
        logger.error(f"Failed to get trend analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trend analysis"
        )

@router.get("/seasonality/{property_id}")
async def get_seasonality_analysis(
    property_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get seasonality analysis for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        seasonality_data = analytics_service.get_seasonality_analysis(property_id)
        
        return seasonality_data
        
    except Exception as e:
        logger.error(f"Failed to get seasonality analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve seasonality analysis"
        )

@router.get("/cohorts/{property_id}")
async def get_cohort_analysis(
    property_id: str,
    cohort_type: str = "booking_month",
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get cohort analysis for a property"""
    try:
        analytics_service = AnalyticsService(db)
        
        cohort_data = analytics_service.get_cohort_analysis(property_id, cohort_type)
        
        return cohort_data
        
    except Exception as e:
        logger.error(f"Failed to get cohort analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve cohort analysis"
        )