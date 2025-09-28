"""
Recommendation API Routes
Handles recommendation system endpoints
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_user
from database import get_db
from models.user import User
from schemas.recommendation_model import (BookingInquiryCreate,
                                          BookingInquiryResponse,
                                          RecommendationDashboardData,
                                          RecommendationItem,
                                          RecommendationRequest,
                                          RecommendationResponse,
                                          UserAnalyticsRequest,
                                          UserAnalyticsResponse,
                                          UserFavoriteResponse,
                                          UserPreferenceBatchRequest,
                                          UserPreferenceBatchResponse,
                                          UserPreferenceCreate,
                                          UserPreferenceResponse)
from services.recommendation_service import RecommendationService

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.post("/preferences", response_model=UserPreferenceResponse)
async def record_preference(
    preference: UserPreferenceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record user preference for recommendation system"""

    service = RecommendationService(db)

    try:
        result = await service.record_user_preference(
            user_id=current_user.id,
            item_id=preference.item_id,
            item_type=preference.item_type,
            action=preference.action,
            preference_score=preference.preference_score,
            context_data=preference.context_data,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to record preference: {str(e)}"
        )


@router.post("/preferences/batch", response_model=UserPreferenceBatchResponse)
async def record_preferences_batch(
    batch_request: UserPreferenceBatchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record multiple user preferences in batch"""

    service = RecommendationService(db)
    processed_count = 0
    failed_count = 0
    errors = []

    for preference in batch_request.preferences:
        try:
            await service.record_user_preference(
                user_id=current_user.id,
                item_id=preference.item_id,
                item_type=preference.item_type,
                action=preference.action,
                preference_score=preference.preference_score,
                context_data=preference.context_data,
            )
            processed_count += 1
        except Exception as e:
            failed_count += 1
            errors.append({"item_id": preference.item_id, "error": str(e)})

    return UserPreferenceBatchResponse(
        processed_count=processed_count, failed_count=failed_count, errors=errors
    )


@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    item_type: Optional[str] = Query(None, regex=r"^(room|tour|service|menu_item)$"),
    limit: int = Query(10, ge=1, le=50),
    recommendation_type: str = Query(
        "personalized", regex=r"^(personalized|trending|similar|popular)$"
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get personalized recommendations for user"""

    service = RecommendationService(db)

    try:
        recommendations = await service.get_user_recommendations(
            user_id=current_user.id,
            item_type=item_type,
            limit=limit,
            recommendation_type=recommendation_type,
        )

        return RecommendationResponse(
            user_id=current_user.id,
            recommendations=recommendations,
            generated_at=datetime.utcnow(),
            algorithm_version="v1.0",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get recommendations: {str(e)}"
        )


@router.post("/favorites/toggle")
async def toggle_favorite(
    item_id: str = Body(...),
    item_type: str = Body(..., regex=r"^(room|tour|service|menu_item)$"),
    property_id: UUID = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Toggle user favorite (add if not exists, remove if exists)"""

    service = RecommendationService(db)

    try:
        is_favorite = await service.toggle_user_favorite(
            user_id=current_user.id,
            item_id=item_id,
            item_type=item_type,
            property_id=property_id,
        )

        # Record preference for recommendation system
        await service.record_user_preference(
            user_id=current_user.id,
            item_id=item_id,
            item_type=item_type,
            action="like" if is_favorite else "unlike",
        )

        return {
            "is_favorite": is_favorite,
            "message": f"{'Added to' if is_favorite else 'Removed from'} favorites",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to toggle favorite: {str(e)}"
        )


@router.get("/favorites", response_model=List[UserFavoriteResponse])
async def get_favorites(
    item_type: Optional[str] = Query(None, regex=r"^(room|tour|service|menu_item)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's favorites"""

    service = RecommendationService(db)

    try:
        favorites = await service.get_user_favorites(
            user_id=current_user.id, item_type=item_type
        )
        return favorites
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get favorites: {str(e)}"
        )


@router.post("/behavior")
async def record_behavior(
    session_id: Optional[str] = Body(None),
    page_path: str = Body(...),
    action_type: str = Body(
        ...,
        regex=r"^(page_view|button_click|form_submit|search|filter|sort|share|bookmark|download|video_play)$",
    ),
    action_data: Optional[Dict[str, Any]] = Body(None),
    user_agent: Optional[str] = Body(None),
    ip_address: Optional[str] = Body(None),
    referrer: Optional[str] = Body(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Record user behavior for analytics"""

    service = RecommendationService(db)

    try:
        behavior = await service.record_user_behavior(
            user_id=current_user.id,
            session_id=session_id,
            page_path=page_path,
            action_type=action_type,
            action_data=action_data,
            user_agent=user_agent,
            ip_address=ip_address,
            referrer=referrer,
        )

        return {
            "behavior_id": behavior.behavior_id,
            "message": "Behavior recorded successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to record behavior: {str(e)}"
        )


@router.post("/inquiries", response_model=BookingInquiryResponse)
async def create_booking_inquiry(
    inquiry: BookingInquiryCreate, db: AsyncSession = Depends(get_db)
):
    """Create a new booking inquiry (no auth required for guest inquiries)"""

    service = RecommendationService(db)

    try:
        result = await service.create_booking_inquiry(inquiry.dict())
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create inquiry: {str(e)}"
        )


@router.get("/inquiries", response_model=List[BookingInquiryResponse])
async def get_booking_inquiries(
    property_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(
        None, regex=r"^(pending|contacted|quoted|booked|cancelled)$"
    ),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get booking inquiries (staff only)"""

    # Check if user is staff
    if current_user.role not in ["admin", "manager", "staff"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    service = RecommendationService(db)

    try:
        inquiries = await service.get_booking_inquiries(
            property_id=property_id, status=status, limit=limit
        )
        return inquiries
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get inquiries: {str(e)}"
        )


@router.get("/analytics", response_model=UserAnalyticsResponse)
async def get_user_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user analytics data"""

    service = RecommendationService(db)

    try:
        analytics = await service.get_user_analytics(
            user_id=current_user.id, start_date=start_date, end_date=end_date
        )

        return UserAnalyticsResponse(user_id=current_user.id, **analytics)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get analytics: {str(e)}"
        )


@router.get("/dashboard", response_model=RecommendationDashboardData)
async def get_dashboard_data(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """Get recommendation dashboard data (admin only)"""

    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    service = RecommendationService(db)

    try:
        # This would be implemented with actual dashboard queries
        # For now, returning mock data
        return RecommendationDashboardData(
            total_users=1000,
            total_preferences=5000,
            total_recommendations=10000,
            recommendation_accuracy=0.75,
            popular_items=[
                {"item_id": "room-001", "item_type": "room", "likes": 150},
                {"item_id": "tour-002", "item_type": "tour", "likes": 120},
                {"item_id": "service-001", "item_type": "service", "likes": 80},
            ],
            user_engagement={
                "daily_active_users": 250,
                "avg_session_duration": 15.5,
                "conversion_rate": 0.12,
            },
            algorithm_performance={"accuracy": 0.75, "precision": 0.68, "recall": 0.72},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get dashboard data: {str(e)}"
        )


@router.post("/cleanup")
async def cleanup_expired_recommendations(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """Clean up expired recommendation cache (admin only)"""

    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    service = RecommendationService(db)

    try:
        deleted_count = await service.cleanup_expired_recommendations()
        return {
            "deleted_count": deleted_count,
            "message": f"Cleaned up {deleted_count} expired recommendations",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cleanup: {str(e)}")


# Guest endpoints (no authentication required)
@router.post("/guest/preferences")
async def record_guest_preference(
    user_id: str = Body(..., description="Guest user identifier"),
    item_id: str = Body(...),
    item_type: str = Body(..., regex=r"^(room|tour|service|menu_item)$"),
    action: str = Body(..., regex=r"^(like|unlike|view|book|share|click|hover)$"),
    preference_score: Optional[float] = Body(None),
    context_data: Optional[Dict[str, Any]] = Body(None),
    db: AsyncSession = Depends(get_db),
):
    """Record guest user preference (no authentication required)"""

    service = RecommendationService(db)

    try:
        # Convert string user_id to UUID for guest users
        guest_uuid = UUID(
            f"00000000-0000-0000-0000-{user_id.replace('-', '').zfill(12)}"
        )

        result = await service.record_user_preference(
            user_id=guest_uuid,
            item_id=item_id,
            item_type=item_type,
            action=action,
            preference_score=preference_score,
            context_data=context_data,
        )

        return {
            "preference_id": result.preference_id,
            "message": "Guest preference recorded successfully",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to record guest preference: {str(e)}"
        )


@router.get("/guest/recommendations")
async def get_guest_recommendations(
    user_id: str = Query(..., description="Guest user identifier"),
    item_type: Optional[str] = Query(None, regex=r"^(room|tour|service|menu_item)$"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Get recommendations for guest user (no authentication required)"""

    service = RecommendationService(db)

    try:
        # Convert string user_id to UUID for guest users
        guest_uuid = UUID(
            f"00000000-0000-0000-0000-{user_id.replace('-', '').zfill(12)}"
        )

        recommendations = await service.get_user_recommendations(
            user_id=guest_uuid,
            item_type=item_type,
            limit=limit,
            recommendation_type="personalized",
        )

        return RecommendationResponse(
            user_id=guest_uuid,
            recommendations=recommendations,
            generated_at=datetime.utcnow(),
            algorithm_version="v1.0",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get guest recommendations: {str(e)}"
        )
