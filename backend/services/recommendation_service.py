"""
Recommendation Service
Handles AI/ML recommendation logic and user preference management
"""

import asyncio
import json
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Any, Dict, List, Optional, Tuple
from uuid import UUID

from sqlalchemy import and_, asc, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.recommendation_model import (BookingInquiry, RecommendationCache,
                                         RecommendationEngine,
                                         RecommendationFeedback,
                                         UserBehaviorAnalytics, UserFavorite,
                                         UserPreference)
from schemas.recommendation_model import (RecommendationDashboardData,
                                          RecommendationItem,
                                          RecommendationRequest,
                                          RecommendationResponse,
                                          UserAnalyticsRequest,
                                          UserAnalyticsResponse,
                                          UserPreferenceBatchRequest,
                                          UserPreferenceCreate)


class RecommendationService:
    """Service for handling recommendation system operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def record_user_preference(
        self,
        user_id: UUID,
        item_id: str,
        item_type: str,
        action: str,
        preference_score: Optional[Decimal] = None,
        context_data: Optional[Dict[str, Any]] = None,
    ) -> UserPreference:
        """Record or update user preference"""

        # Calculate score if not provided
        if preference_score is None:
            score_map = {
                "like": Decimal("1.0"),
                "unlike": Decimal("-1.0"),
                "book": Decimal("0.8"),
                "view": Decimal("0.3"),
                "share": Decimal("0.6"),
                "click": Decimal("0.2"),
                "hover": Decimal("0.1"),
            }
            preference_score = score_map.get(action, Decimal("0.0"))

        # Check if preference already exists
        existing_preference = await self.db.execute(
            select(UserPreference).where(
                and_(
                    UserPreference.user_id == user_id,
                    UserPreference.item_id == item_id,
                    UserPreference.action == action,
                )
            )
        )
        existing_preference = existing_preference.scalar_one_or_none()

        if existing_preference:
            # Update existing preference
            existing_preference.preference_score = preference_score
            existing_preference.context_data = context_data
            existing_preference.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(existing_preference)
            return existing_preference
        else:
            # Create new preference
            new_preference = UserPreference(
                user_id=user_id,
                item_id=item_id,
                item_type=item_type,
                action=action,
                preference_score=preference_score,
                context_data=context_data,
            )
            self.db.add(new_preference)
            await self.db.commit()
            await self.db.refresh(new_preference)
            return new_preference

    async def get_user_recommendations(
        self,
        user_id: UUID,
        item_type: Optional[str] = None,
        limit: int = 10,
        recommendation_type: str = "personalized",
    ) -> List[RecommendationItem]:
        """Get personalized recommendations for user"""

        # First check cache
        cache_query = select(RecommendationCache).where(
            and_(
                RecommendationCache.user_id == user_id,
                RecommendationCache.expires_at > datetime.utcnow(),
            )
        )

        if item_type:
            cache_query = cache_query.where(RecommendationCache.item_type == item_type)

        cache_query = cache_query.order_by(
            desc(RecommendationCache.recommendation_score)
        ).limit(limit)

        cached_recommendations = await self.db.execute(cache_query)
        cached_results = cached_recommendations.scalars().all()

        if cached_results:
            return [
                RecommendationItem(
                    item_id=rec.item_id,
                    item_type=rec.item_type,
                    recommendation_score=rec.recommendation_score,
                    confidence_score=rec.confidence_score,
                    reason=self._get_recommendation_reason(rec.recommendation_score),
                )
                for rec in cached_results
            ]

        # If no cache, generate recommendations
        return await self._generate_recommendations(
            user_id, item_type, limit, recommendation_type
        )

    async def _generate_recommendations(
        self,
        user_id: UUID,
        item_type: Optional[str],
        limit: int,
        recommendation_type: str,
    ) -> List[RecommendationItem]:
        """Generate new recommendations using collaborative filtering"""

        # Get user's preferences
        user_preferences = await self.db.execute(
            select(UserPreference).where(UserPreference.user_id == user_id)
        )
        user_prefs = user_preferences.scalars().all()

        if not user_prefs:
            # No preferences, return popular items
            return await self._get_popular_items(item_type, limit)

        # Find similar users based on preferences
        similar_users = await self._find_similar_users(user_id, user_prefs)

        if not similar_users:
            # No similar users, return popular items
            return await self._get_popular_items(item_type, limit)

        # Get items liked by similar users
        recommendations = await self._get_items_from_similar_users(
            similar_users, user_prefs, item_type, limit
        )

        # Cache the recommendations
        await self._cache_recommendations(user_id, recommendations, recommendation_type)

        return recommendations

    async def _find_similar_users(
        self, user_id: UUID, user_prefs: List[UserPreference]
    ) -> List[UUID]:
        """Find users with similar preferences"""

        # Get items the user has interacted with
        user_items = {pref.item_id for pref in user_prefs}

        # Find users who have interacted with the same items
        similar_users_query = (
            select(UserPreference.user_id)
            .where(
                and_(
                    UserPreference.user_id != user_id,
                    UserPreference.item_id.in_(user_items),
                    UserPreference.action.in_(["like", "book"]),
                )
            )
            .group_by(UserPreference.user_id)
            .having(func.count(UserPreference.item_id) >= 2)
            .limit(50)
        )

        result = await self.db.execute(similar_users_query)
        return [row[0] for row in result.fetchall()]

    async def _get_items_from_similar_users(
        self,
        similar_users: List[UUID],
        user_prefs: List[UserPreference],
        item_type: Optional[str],
        limit: int,
    ) -> List[RecommendationItem]:
        """Get items liked by similar users that current user hasn't seen"""

        user_items = {pref.item_id for pref in user_prefs}

        query = select(
            UserPreference.item_id,
            UserPreference.item_type,
            func.avg(UserPreference.preference_score).label("avg_score"),
            func.count(UserPreference.user_id).label("user_count"),
        ).where(
            and_(
                UserPreference.user_id.in_(similar_users),
                UserPreference.item_id.notin_(user_items),
                UserPreference.action.in_(["like", "book"]),
            )
        )

        if item_type:
            query = query.where(UserPreference.item_type == item_type)

        query = (
            query.group_by(UserPreference.item_id, UserPreference.item_type)
            .having(func.count(UserPreference.user_id) >= 2)
            .order_by(desc("avg_score"), desc("user_count"))
            .limit(limit)
        )

        result = await self.db.execute(query)
        rows = result.fetchall()

        return [
            RecommendationItem(
                item_id=row.item_id,
                item_type=row.item_type,
                recommendation_score=Decimal(str(row.avg_score)),
                confidence_score=min(
                    Decimal(str(row.user_count)) / Decimal("10"), Decimal("1.0")
                ),
                reason=f"Liked by {row.user_count} similar users",
            )
            for row in rows
        ]

    async def _get_popular_items(
        self, item_type: Optional[str], limit: int
    ) -> List[RecommendationItem]:
        """Get popular items when no user preferences exist"""

        query = select(
            UserPreference.item_id,
            UserPreference.item_type,
            func.count(UserPreference.user_id).label("like_count"),
            func.avg(UserPreference.preference_score).label("avg_score"),
        ).where(UserPreference.action.in_(["like", "book"]))

        if item_type:
            query = query.where(UserPreference.item_type == item_type)

        query = (
            query.group_by(UserPreference.item_id, UserPreference.item_type)
            .order_by(desc("like_count"), desc("avg_score"))
            .limit(limit)
        )

        result = await self.db.execute(query)
        rows = result.fetchall()

        return [
            RecommendationItem(
                item_id=row.item_id,
                item_type=row.item_type,
                recommendation_score=min(
                    Decimal(str(row.like_count)) / Decimal("100"), Decimal("1.0")
                ),
                confidence_score=Decimal("0.5"),
                reason=f"Popular choice ({row.like_count} likes)",
            )
            for row in rows
        ]

    async def _cache_recommendations(
        self,
        user_id: UUID,
        recommendations: List[RecommendationItem],
        recommendation_type: str,
    ):
        """Cache recommendations for performance"""

        # Clear existing cache for user
        await self.db.execute(
            select(RecommendationCache).where(RecommendationCache.user_id == user_id)
        )

        # Add new recommendations to cache
        for rec in recommendations:
            cache_item = RecommendationCache(
                user_id=user_id,
                recommendation_type=recommendation_type,
                item_id=rec.item_id,
                item_type=rec.item_type,
                recommendation_score=rec.recommendation_score,
                confidence_score=rec.confidence_score,
                expires_at=datetime.utcnow() + timedelta(hours=24),
            )
            self.db.add(cache_item)

        await self.db.commit()

    def _get_recommendation_reason(self, score: Decimal) -> str:
        """Get human-readable reason for recommendation"""
        if score >= Decimal("0.8"):
            return "Highly recommended based on your preferences"
        elif score >= Decimal("0.6"):
            return "Recommended based on similar users"
        elif score >= Decimal("0.4"):
            return "You might like this"
        else:
            return "Popular choice"

    async def toggle_user_favorite(
        self, user_id: UUID, item_id: str, item_type: str, property_id: UUID
    ) -> bool:
        """Toggle user favorite (add if not exists, remove if exists)"""

        # Check if favorite exists
        existing_favorite = await self.db.execute(
            select(UserFavorite).where(
                and_(UserFavorite.user_id == user_id, UserFavorite.item_id == item_id)
            )
        )
        existing_favorite = existing_favorite.scalar_one_or_none()

        if existing_favorite:
            # Remove favorite
            await self.db.delete(existing_favorite)
            await self.db.commit()
            return False
        else:
            # Add favorite
            new_favorite = UserFavorite(
                user_id=user_id,
                item_id=item_id,
                item_type=item_type,
                property_id=property_id,
            )
            self.db.add(new_favorite)
            await self.db.commit()
            return True

    async def get_user_favorites(
        self, user_id: UUID, item_type: Optional[str] = None
    ) -> List[UserFavorite]:
        """Get user's favorites"""

        query = select(UserFavorite).where(UserFavorite.user_id == user_id)

        if item_type:
            query = query.where(UserFavorite.item_type == item_type)

        query = query.order_by(desc(UserFavorite.added_at))

        result = await self.db.execute(query)
        return result.scalars().all()

    async def record_user_behavior(
        self,
        user_id: UUID,
        session_id: Optional[str],
        page_path: str,
        action_type: str,
        action_data: Optional[Dict[str, Any]] = None,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None,
        referrer: Optional[str] = None,
    ) -> UserBehaviorAnalytics:
        """Record user behavior for analytics"""

        behavior = UserBehaviorAnalytics(
            user_id=user_id,
            session_id=session_id,
            page_path=page_path,
            action_type=action_type,
            action_data=action_data,
            user_agent=user_agent,
            ip_address=ip_address,
            referrer=referrer,
        )

        self.db.add(behavior)
        await self.db.commit()
        await self.db.refresh(behavior)
        return behavior

    async def create_booking_inquiry(
        self, inquiry_data: Dict[str, Any]
    ) -> BookingInquiry:
        """Create a new booking inquiry"""

        inquiry = BookingInquiry(**inquiry_data)
        self.db.add(inquiry)
        await self.db.commit()
        await self.db.refresh(inquiry)
        return inquiry

    async def get_booking_inquiries(
        self,
        property_id: Optional[UUID] = None,
        status: Optional[str] = None,
        limit: int = 50,
    ) -> List[BookingInquiry]:
        """Get booking inquiries with optional filters"""

        query = select(BookingInquiry)

        if property_id:
            query = query.where(BookingInquiry.property_id == property_id)

        if status:
            query = query.where(BookingInquiry.inquiry_status == status)

        query = query.order_by(desc(BookingInquiry.created_at)).limit(limit)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_user_analytics(
        self,
        user_id: UUID,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Get user analytics data"""

        query = select(UserBehaviorAnalytics).where(
            UserBehaviorAnalytics.user_id == user_id
        )

        if start_date:
            query = query.where(UserBehaviorAnalytics.timestamp >= start_date)

        if end_date:
            query = query.where(UserBehaviorAnalytics.timestamp <= end_date)

        result = await self.db.execute(query)
        behaviors = result.scalars().all()

        if not behaviors:
            return {
                "total_actions": 0,
                "action_breakdown": {},
                "top_pages": [],
                "session_count": 0,
            }

        # Analyze behaviors
        action_breakdown = {}
        page_counts = {}
        sessions = set()

        for behavior in behaviors:
            # Count actions
            action_breakdown[behavior.action_type] = (
                action_breakdown.get(behavior.action_type, 0) + 1
            )

            # Count pages
            page_counts[behavior.page_path] = page_counts.get(behavior.page_path, 0) + 1

            # Count sessions
            if behavior.session_id:
                sessions.add(behavior.session_id)

        # Get top pages
        top_pages = [
            {"page": page, "count": count}
            for page, count in sorted(
                page_counts.items(), key=lambda x: x[1], reverse=True
            )[:10]
        ]

        return {
            "total_actions": len(behaviors),
            "action_breakdown": action_breakdown,
            "top_pages": top_pages,
            "session_count": len(sessions),
        }

    async def cleanup_expired_recommendations(self) -> int:
        """Clean up expired recommendation cache entries"""

        result = await self.db.execute(
            select(RecommendationCache).where(
                RecommendationCache.expires_at < datetime.utcnow()
            )
        )
        expired_items = result.scalars().all()

        for item in expired_items:
            await self.db.delete(item)

        await self.db.commit()
        return len(expired_items)
