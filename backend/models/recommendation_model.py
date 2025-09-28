"""
Recommendation System Models
Supports AI/ML recommendation engine for personalized content
"""

from sqlalchemy import (DECIMAL, JSON, Boolean, Column, DateTime, ForeignKey,
                        Index, Integer, String, Text)
from sqlalchemy.dialects.postgresql import INET, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class UserPreference(Base):
    """User preferences and interactions for recommendation system"""

    __tablename__ = "user_recommendation_preferences"

    preference_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    item_id = Column(String(255), nullable=False)
    item_type = Column(
        String(50), nullable=False, index=True
    )  # 'room', 'tour', 'service', 'menu_item'
    action = Column(
        String(50), nullable=False, index=True
    )  # 'like', 'unlike', 'view', 'book', 'share'
    preference_score = Column(DECIMAL(3, 2), default=0.0)  # -1.0 to 1.0
    context_data = Column(JSON)  # Additional context like device, location, time
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Indexes
    __table_args__ = (
        Index(
            "idx_user_recommendation_preferences_user_item_action",
            "user_id",
            "item_id",
            "action",
            unique=True,
        ),
        Index("idx_user_recommendation_preferences_created_at", "created_at"),
    )

    def __repr__(self):
        return f"<UserPreference(user_id={self.user_id}, item_id={self.item_id}, action={self.action})>"


class RecommendationCache(Base):
    """Recommendation cache for performance optimization"""

    __tablename__ = "recommendation_cache"

    cache_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    recommendation_type = Column(
        String(50), nullable=False, index=True
    )  # 'personalized', 'trending', 'similar'
    item_id = Column(String(255), nullable=False)
    item_type = Column(String(50), nullable=False)
    recommendation_score = Column(DECIMAL(5, 4), nullable=False)  # 0.0000 to 1.0000
    confidence_score = Column(DECIMAL(5, 4), default=0.0)
    algorithm_version = Column(String(20), default="v1.0")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), server_default=func.now())

    # Indexes
    __table_args__ = (
        Index("idx_recommendation_cache_expires", "expires_at"),
        Index("idx_recommendation_cache_score", "recommendation_score"),
    )

    def __repr__(self):
        return f"<RecommendationCache(user_id={self.user_id}, item_id={self.item_id}, score={self.recommendation_score})>"


class UserBehaviorAnalytics(Base):
    """User behavior analytics for recommendation system"""

    __tablename__ = "user_behavior_analytics"

    behavior_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    session_id = Column(String(255), index=True)
    page_path = Column(String(500), nullable=False)
    action_type = Column(
        String(100), nullable=False, index=True
    )  # 'page_view', 'button_click', 'form_submit'
    action_data = Column(JSON)  # Additional action-specific data
    user_agent = Column(Text)
    ip_address = Column(INET)
    referrer = Column(String(500))
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    def __repr__(self):
        return f"<UserBehaviorAnalytics(user_id={self.user_id}, action={self.action_type}, page={self.page_path})>"


class BookingInquiry(Base):
    """Booking inquiries and quotes from customers"""

    __tablename__ = "booking_inquiries"

    inquiry_id = Column(UUID(as_uuid=True), primary_key=True)
    property_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    item_id = Column(String(255), nullable=False)
    item_type = Column(
        String(50), nullable=False, index=True
    )  # 'room', 'tour', 'service'
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(50))
    preferred_date = Column(DateTime(timezone=True))
    check_out_date = Column(DateTime(timezone=True))  # For room bookings
    number_of_people = Column(Integer, default=1)
    special_requests = Column(Text)
    inquiry_status = Column(
        String(50), default="pending", index=True
    )  # 'pending', 'contacted', 'quoted', 'booked', 'cancelled'
    assigned_staff_id = Column(UUID(as_uuid=True))
    response_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self):
        return f"<BookingInquiry(customer={self.customer_name}, item={self.item_id}, status={self.inquiry_status})>"


class UserFavorite(Base):
    """User favorites/wishlist"""

    __tablename__ = "user_favorites"

    favorite_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    item_id = Column(String(255), nullable=False)
    item_type = Column(
        String(50), nullable=False, index=True
    )  # 'room', 'tour', 'service', 'menu_item'
    property_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Indexes
    __table_args__ = (
        Index("idx_user_favorites_user_item", "user_id", "item_id", unique=True),
    )

    def __repr__(self):
        return f"<UserFavorite(user_id={self.user_id}, item_id={self.item_id}, type={self.item_type})>"


class RecommendationEngine(Base):
    """Recommendation engine configuration and metrics"""

    __tablename__ = "recommendation_engine"

    engine_id = Column(UUID(as_uuid=True), primary_key=True)
    engine_name = Column(String(100), nullable=False, unique=True)
    algorithm_type = Column(
        String(50), nullable=False
    )  # 'collaborative', 'content_based', 'hybrid'
    model_version = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True)
    configuration = Column(JSON)  # Algorithm-specific configuration
    performance_metrics = Column(JSON)  # Accuracy, precision, recall, etc.
    last_trained_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    def __repr__(self):
        return f"<RecommendationEngine(name={self.engine_name}, type={self.algorithm_type}, active={self.is_active})>"


class RecommendationFeedback(Base):
    """User feedback on recommendations for model improvement"""

    __tablename__ = "recommendation_feedback"

    feedback_id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    recommendation_id = Column(
        UUID(as_uuid=True), nullable=False
    )  # Reference to recommendation_cache
    item_id = Column(String(255), nullable=False)
    item_type = Column(String(50), nullable=False)
    feedback_type = Column(
        String(50), nullable=False
    )  # 'clicked', 'booked', 'dismissed', 'rated'
    feedback_value = Column(DECIMAL(3, 2))  # Rating or score
    feedback_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<RecommendationFeedback(user_id={self.user_id}, type={self.feedback_type}, value={self.feedback_value})>"
