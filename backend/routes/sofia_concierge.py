"""
Sofia Concierge AI API routes for Buffr Host platform.
Phase 2: Sofia Concierge AI Integration
"""
from datetime import date, datetime
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from database import get_db
from services.sofia_concierge_service import SofiaConciergeService

router = APIRouter(prefix="/api/sofia", tags=["sofia-concierge"])

# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

class RecommendationRequest(BaseModel):
    property_id: int
    guest_id: int
    request_type: str  # 'inventory', 'service', 'table', 'room'
    preferences: Optional[Dict[str, Any]] = None
    context: Optional[Dict[str, Any]] = None

class PersonalizedRecommendationRequest(BaseModel):
    property_id: int
    guest_id: int
    context: Dict[str, Any]

class DemandForecastRequest(BaseModel):
    property_id: int
    target_date: date
    service_type: Optional[str] = None

class CapacityOptimizationRequest(BaseModel):
    property_id: int
    service_type: str
    target_date: date

class ReservationOptimizationRequest(BaseModel):
    property_id: int
    guest_id: int
    reservation_request: Dict[str, Any]

class GuestInteractionRequest(BaseModel):
    guest_id: int
    property_id: int
    interaction_data: Dict[str, Any]

class NotificationRequest(BaseModel):
    property_id: int
    guest_id: int
    notification_type: str
    message: str
    priority: str = "medium"

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, Any]]
    total_count: int
    confidence_threshold: float
    generated_at: datetime

class AnalyticsResponse(BaseModel):
    analysis_type: str
    data: Dict[str, Any]
    accuracy_score: Optional[float]
    generated_at: datetime

class GuestInsightsResponse(BaseModel):
    guest_id: int
    property_id: int
    insights: Dict[str, Any]
    preference_score: float
    last_updated: datetime

# =============================================================================
# RECOMMENDATION ENDPOINTS
# =============================================================================

@router.post("/recommendations/availability", response_model=RecommendationResponse)
async def get_availability_recommendations(
    request: RecommendationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get AI-powered availability recommendations for a guest."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        recommendations = await sofia_service.get_availability_recommendations(
            property_id=request.property_id,
            guest_id=request.guest_id,
            request_type=request.request_type,
            preferences=request.preferences
        )
        
        return RecommendationResponse(
            recommendations=recommendations,
            total_count=len(recommendations),
            confidence_threshold=0.6,
            generated_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

@router.post("/recommendations/personalized", response_model=RecommendationResponse)
async def get_personalized_recommendations(
    request: PersonalizedRecommendationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get personalized recommendations based on guest context."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        recommendations = await sofia_service.get_personalized_recommendations(
            property_id=request.property_id,
            guest_id=request.guest_id,
            context=request.context
        )
        
        return RecommendationResponse(
            recommendations=recommendations,
            total_count=len(recommendations),
            confidence_threshold=0.6,
            generated_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get personalized recommendations: {str(e)}")

@router.get("/recommendations/guest/{guest_id}")
async def get_guest_recommendations(
    guest_id: int,
    property_id: int = Query(...),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Get all recommendations for a specific guest."""
    try:
        query = text("""
            SELECT sr.*, p.name as property_name, u.username as guest_name
            FROM sofia_recommendations sr
            JOIN properties p ON sr.property_id = p.id
            JOIN users u ON sr.guest_id = u.id
            WHERE sr.guest_id = :guest_id AND sr.property_id = :property_id
            AND sr.is_active = true
            ORDER BY sr.confidence_score DESC, sr.created_at DESC
            LIMIT :limit
        """)
        
        result = await db.execute(query, {
            "guest_id": guest_id,
            "property_id": property_id,
            "limit": limit
        })
        
        recommendations = []
        for row in result.fetchall():
            recommendations.append({
                "id": str(row.id),
                "recommendation_type": row.recommendation_type,
                "target_type": row.target_type,
                "target_id": str(row.target_id),
                "confidence_score": float(row.confidence_score),
                "recommendation_data": row.recommendation_data,
                "reasoning": row.reasoning,
                "is_accepted": row.is_accepted,
                "feedback_score": row.feedback_score,
                "created_at": row.created_at.isoformat(),
                "expires_at": row.expires_at.isoformat() if row.expires_at else None
            })
        
        return {
            "success": True,
            "recommendations": recommendations,
            "total_count": len(recommendations),
            "guest_id": guest_id,
            "property_id": property_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get guest recommendations: {str(e)}")

@router.post("/recommendations/{recommendation_id}/feedback")
async def submit_recommendation_feedback(
    recommendation_id: str,
    feedback_score: int = Query(..., ge=1, le=5),
    is_accepted: bool = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Submit feedback on a recommendation."""
    try:
        query = text("""
            UPDATE sofia_recommendations 
            SET feedback_score = :feedback_score, is_accepted = :is_accepted
            WHERE id = :recommendation_id
        """)
        
        await db.execute(query, {
            "recommendation_id": recommendation_id,
            "feedback_score": feedback_score,
            "is_accepted": is_accepted
        })
        
        await db.commit()
        
        return {
            "success": True,
            "message": "Feedback submitted successfully",
            "recommendation_id": recommendation_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")

# =============================================================================
# ANALYTICS ENDPOINTS
# =============================================================================

@router.post("/analytics/demand-forecast", response_model=AnalyticsResponse)
async def get_demand_forecast(
    request: DemandForecastRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get demand forecast for a specific date and service type."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        forecast = await sofia_service.predict_demand(
            property_id=request.property_id,
            target_date=request.target_date,
            service_type=request.service_type
        )
        
        return AnalyticsResponse(
            analysis_type="demand_forecast",
            data=forecast,
            accuracy_score=forecast.get("accuracy_score"),
            generated_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get demand forecast: {str(e)}")

@router.post("/analytics/capacity-optimization", response_model=AnalyticsResponse)
async def get_capacity_optimization(
    request: CapacityOptimizationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get capacity optimization recommendations."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        optimization = await sofia_service.optimize_capacity(
            property_id=request.property_id,
            service_type=request.service_type,
            target_date=request.target_date
        )
        
        return AnalyticsResponse(
            analysis_type="capacity_optimization",
            data=optimization,
            accuracy_score=optimization.get("accuracy_score"),
            generated_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get capacity optimization: {str(e)}")

@router.get("/analytics/guest-insights/{guest_id}")
async def get_guest_insights(
    guest_id: int,
    property_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Get AI-generated insights about a guest."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        insights = await sofia_service.get_guest_insights(
            guest_id=guest_id,
            property_id=property_id
        )
        
        return {
            "success": True,
            "guest_id": guest_id,
            "property_id": property_id,
            "insights": insights,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get guest insights: {str(e)}")

@router.get("/analytics/property/{property_id}/summary")
async def get_property_analytics_summary(
    property_id: int,
    days: int = Query(30, ge=1, le=365),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics summary for a property."""
    try:
        query = text("""
            SELECT 
                analysis_type,
                COUNT(*) as analysis_count,
                AVG(accuracy_score) as avg_accuracy,
                MAX(analysis_date) as latest_analysis
            FROM sofia_analytics
            WHERE property_id = :property_id
            AND analysis_date >= CURRENT_DATE - INTERVAL '%s days'
            GROUP BY analysis_type
        """ % days)
        
        result = await db.execute(query, {"property_id": property_id})
        
        analytics_summary = []
        for row in result.fetchall():
            analytics_summary.append({
                "analysis_type": row.analysis_type,
                "analysis_count": row.analysis_count,
                "avg_accuracy": float(row.avg_accuracy) if row.avg_accuracy else None,
                "latest_analysis": row.latest_analysis.isoformat() if row.latest_analysis else None
            })
        
        return {
            "success": True,
            "property_id": property_id,
            "period_days": days,
            "analytics_summary": analytics_summary,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics summary: {str(e)}")

# =============================================================================
# SMART RESERVATION ENDPOINTS
# =============================================================================

@router.post("/reservations/optimize")
async def optimize_reservation(
    request: ReservationOptimizationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Optimize a reservation request using AI."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        optimization = await sofia_service.optimize_reservation(
            property_id=request.property_id,
            guest_id=request.guest_id,
            reservation_request=request.reservation_request
        )
        
        return {
            "success": True,
            "optimization": optimization,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize reservation: {str(e)}")

@router.post("/reservations/resolve-conflicts")
async def resolve_reservation_conflicts(
    property_id: int = Query(...),
    conflicts: List[Dict[str, Any]] = [],
    db: AsyncSession = Depends(get_db)
):
    """Resolve reservation conflicts using AI."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        resolutions = await sofia_service.resolve_conflicts(
            property_id=property_id,
            conflicts=conflicts
        )
        
        return {
            "success": True,
            "resolutions": resolutions,
            "conflicts_resolved": len(resolutions),
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resolve conflicts: {str(e)}")

# =============================================================================
# LEARNING SYSTEM ENDPOINTS
# =============================================================================

@router.post("/learning/interaction")
async def record_guest_interaction(
    request: GuestInteractionRequest,
    db: AsyncSession = Depends(get_db)
):
    """Record guest interaction for AI learning."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        learning_result = await sofia_service.learn_from_interaction(
            guest_id=request.guest_id,
            property_id=request.property_id,
            interaction_data=request.interaction_data
        )
        
        return {
            "success": True,
            "learning_result": learning_result,
            "recorded_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record interaction: {str(e)}")

@router.get("/learning/guest/{guest_id}/preferences")
async def get_guest_preferences(
    guest_id: int,
    property_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Get learned guest preferences."""
    try:
        query = text("""
            SELECT 
                data_category,
                data_key,
                data_value,
                confidence_level,
                weight,
                created_at
            FROM sofia_learning_data
            WHERE guest_id = :guest_id AND property_id = :property_id
            ORDER BY confidence_level DESC, weight DESC, created_at DESC
        """)
        
        result = await db.execute(query, {
            "guest_id": guest_id,
            "property_id": property_id
        })
        
        preferences = []
        for row in result.fetchall():
            preferences.append({
                "category": row.data_category,
                "key": row.data_key,
                "value": row.data_value,
                "confidence_level": float(row.confidence_level),
                "weight": float(row.weight),
                "learned_at": row.created_at.isoformat()
            })
        
        return {
            "success": True,
            "guest_id": guest_id,
            "property_id": property_id,
            "preferences": preferences,
            "total_preferences": len(preferences)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get guest preferences: {str(e)}")

# =============================================================================
# NOTIFICATION ENDPOINTS
# =============================================================================

@router.post("/notifications/send")
async def send_smart_notification(
    request: NotificationRequest,
    db: AsyncSession = Depends(get_db)
):
    """Send AI-powered notification to guest."""
    try:
        sofia_service = SofiaConciergeService(db)
        
        success = await sofia_service.send_smart_notification(
            property_id=request.property_id,
            guest_id=request.guest_id,
            notification_type=request.notification_type,
            message=request.message,
            priority=request.priority
        )
        
        return {
            "success": success,
            "message": "Notification sent successfully" if success else "Notification not sent",
            "sent_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send notification: {str(e)}")

@router.get("/notifications/guest/{guest_id}")
async def get_guest_notifications(
    guest_id: int,
    property_id: int = Query(...),
    unread_only: bool = Query(False),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get notifications for a specific guest."""
    try:
        where_clause = "WHERE guest_id = :guest_id AND property_id = :property_id"
        if unread_only:
            where_clause += " AND is_read = false"
        
        query = text(f"""
            SELECT 
                id,
                notification_type,
                priority,
                title,
                message,
                action_required,
                action_data,
                is_read,
                is_sent,
                sent_at,
                created_at
            FROM sofia_notifications
            {where_clause}
            ORDER BY created_at DESC
            LIMIT :limit
        """)
        
        result = await db.execute(query, {
            "guest_id": guest_id,
            "property_id": property_id,
            "limit": limit
        })
        
        notifications = []
        for row in result.fetchall():
            notifications.append({
                "id": str(row.id),
                "notification_type": row.notification_type,
                "priority": row.priority,
                "title": row.title,
                "message": row.message,
                "action_required": row.action_required,
                "action_data": row.action_data,
                "is_read": row.is_read,
                "is_sent": row.is_sent,
                "sent_at": row.sent_at.isoformat() if row.sent_at else None,
                "created_at": row.created_at.isoformat()
            })
        
        return {
            "success": True,
            "guest_id": guest_id,
            "property_id": property_id,
            "notifications": notifications,
            "total_count": len(notifications),
            "unread_only": unread_only
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get notifications: {str(e)}")

@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark a notification as read."""
    try:
        query = text("""
            UPDATE sofia_notifications 
            SET is_read = true
            WHERE id = :notification_id
        """)
        
        await db.execute(query, {"notification_id": notification_id})
        await db.commit()
        
        return {
            "success": True,
            "message": "Notification marked as read",
            "notification_id": notification_id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark notification as read: {str(e)}")

# =============================================================================
# HEALTH CHECK
# =============================================================================

@router.get("/health")
async def sofia_health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint for Sofia Concierge AI."""
    try:
        # Check database connectivity
        query = text("SELECT 1")
        await db.execute(query)
        
        # Check Sofia system health
        health_query = text("""
            SELECT 
                component,
                health_status,
                performance_score,
                checked_at
            FROM sofia_system_health
            WHERE property_id = 1  -- Assuming property 1 exists
            ORDER BY checked_at DESC
            LIMIT 5
        """)
        
        health_result = await db.execute(health_query)
        health_status = [{
            "component": row.component,
            "status": row.health_status,
            "performance_score": float(row.performance_score),
            "checked_at": row.checked_at.isoformat()
        } for row in health_result.fetchall()]
        
        return {
            "status": "healthy",
            "service": "sofia-concierge-ai",
            "phase": "2",
            "components": health_status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "sofia-concierge-ai",
            "phase": "2",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }