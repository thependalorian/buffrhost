"""
Recommendation System Pydantic Schemas
Data validation and serialization for recommendation functionality
"""

from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional, Union
from uuid import UUID

from pydantic import BaseModel, Field, validator


# User Preference Schemas
class UserPreferenceBase(BaseModel):
    """Base user preference schema"""

    user_id: UUID
    item_id: str = Field(..., max_length=255)
    item_type: str = Field(..., pattern=r"^(room|tour|service|menu_item|facility)$")
    action: str = Field(..., pattern=r"^(like|unlike|view|book|share|click|hover)$")
    preference_score: Optional[Decimal] = Field(None, ge=-1.0, le=1.0)
    context_data: Optional[Dict[str, Any]] = None

    @validator("preference_score", pre=True, always=True)
    def calculate_score(cls, v, values):
        """Calculate score if not provided"""
        if v is not None:
            return v

        action = values.get("action")
        if action == "like":
            return Decimal("1.0")
        elif action == "unlike":
            return Decimal("-1.0")
        elif action == "book":
            return Decimal("0.8")
        elif action == "view":
            return Decimal("0.3")
        elif action == "share":
            return Decimal("0.6")
        else:
            return Decimal("0.0")


class UserPreferenceCreate(UserPreferenceBase):
    """Schema for creating user preferences"""

    pass


class UserPreferenceUpdate(BaseModel):
    """Schema for updating user preferences"""

    preference_score: Optional[Decimal] = Field(None, ge=-1.0, le=1.0)
    context_data: Optional[Dict[str, Any]] = None


class UserPreferenceResponse(UserPreferenceBase):
    """Schema for user preference responses"""

    preference_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Recommendation Cache Schemas
class RecommendationCacheBase(BaseModel):
    """Base recommendation cache schema"""

    user_id: UUID
    recommendation_type: str = Field(
        ..., pattern=r"^(personalized|trending|similar|popular)$"
    )
    item_id: str = Field(..., max_length=255)
    item_type: str = Field(..., pattern=r"^(room|tour|service|menu_item|facility)$")
    recommendation_score: Decimal = Field(..., ge=0.0, le=1.0)
    confidence_score: Optional[Decimal] = Field(0.0, ge=0.0, le=1.0)
    algorithm_version: str = Field("v1.0", max_length=20)


class RecommendationCacheCreate(RecommendationCacheBase):
    """Schema for creating recommendation cache"""

    expires_at: Optional[datetime] = None


class RecommendationCacheResponse(RecommendationCacheBase):
    """Schema for recommendation cache responses"""

    cache_id: UUID
    generated_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True


# User Behavior Analytics Schemas
class UserBehaviorAnalyticsBase(BaseModel):
    """Base user behavior analytics schema"""

    user_id: UUID
    session_id: Optional[str] = Field(None, max_length=255)
    page_path: str = Field(..., max_length=500)
    action_type: str = Field(
        ...,
        pattern=r"^(page_view|button_click|form_submit|search|filter|sort|share|bookmark|download|video_play)$",
    )
    action_data: Optional[Dict[str, Any]] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    referrer: Optional[str] = Field(None, max_length=500)


class UserBehaviorAnalyticsCreate(UserBehaviorAnalyticsBase):
    """Schema for creating user behavior analytics"""

    pass


class UserBehaviorAnalyticsResponse(UserBehaviorAnalyticsBase):
    """Schema for user behavior analytics responses"""

    behavior_id: UUID
    timestamp: datetime

    class Config:
        from_attributes = True


# Booking Inquiry Schemas
class BookingInquiryBase(BaseModel):
    """Base booking inquiry schema"""

    property_id: UUID
    item_id: str = Field(..., max_length=255)
    item_type: str = Field(..., pattern=r"^(room|tour|service)$")
    customer_name: str = Field(..., max_length=255)
    customer_email: str = Field(..., max_length=255)
    customer_phone: Optional[str] = Field(None, max_length=50)
    preferred_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    number_of_people: Optional[int] = Field(1, ge=1)
    special_requests: Optional[str] = None


class BookingInquiryCreate(BookingInquiryBase):
    """Schema for creating booking inquiries"""

    pass


class BookingInquiryUpdate(BaseModel):
    """Schema for updating booking inquiries"""

    inquiry_status: Optional[str] = Field(
        None, pattern=r"^(pending|contacted|quoted|booked|cancelled)$"
    )
    assigned_staff_id: Optional[UUID] = None
    response_notes: Optional[str] = None


class BookingInquiryResponse(BookingInquiryBase):
    """Schema for booking inquiry responses"""

    inquiry_id: UUID
    inquiry_status: str
    assigned_staff_id: Optional[UUID]
    response_notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# User Favorite Schemas
class UserFavoriteBase(BaseModel):
    """Base user favorite schema"""

    user_id: UUID
    item_id: str = Field(..., max_length=255)
    item_type: str = Field(..., pattern=r"^(room|tour|service|menu_item)$")
    property_id: UUID


class UserFavoriteCreate(UserFavoriteBase):
    """Schema for creating user favorites"""

    pass


class UserFavoriteResponse(UserFavoriteBase):
    """Schema for user favorite responses"""

    favorite_id: UUID
    added_at: datetime

    class Config:
        from_attributes = True


# Recommendation Engine Schemas
class RecommendationEngineBase(BaseModel):
    """Base recommendation engine schema"""

    engine_name: str = Field(..., max_length=100)
    algorithm_type: str = Field(..., pattern=r"^(collaborative|content_based|hybrid)$")
    model_version: str = Field(..., max_length=20)
    is_active: bool = True
    configuration: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None


class RecommendationEngineCreate(RecommendationEngineBase):
    """Schema for creating recommendation engines"""

    pass


class RecommendationEngineUpdate(BaseModel):
    """Schema for updating recommendation engines"""

    is_active: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None
    performance_metrics: Optional[Dict[str, Any]] = None
    last_trained_at: Optional[datetime] = None


class RecommendationEngineResponse(RecommendationEngineBase):
    """Schema for recommendation engine responses"""

    engine_id: UUID
    last_trained_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Recommendation Feedback Schemas
class RecommendationFeedbackBase(BaseModel):
    """Base recommendation feedback schema"""

    user_id: UUID
    recommendation_id: UUID
    item_id: str = Field(..., max_length=255)
    item_type: str = Field(..., pattern=r"^(room|tour|service|menu_item)$")
    feedback_type: str = Field(..., pattern=r"^(clicked|booked|dismissed|rated)$")
    feedback_value: Optional[Decimal] = Field(None, ge=-1.0, le=1.0)
    feedback_text: Optional[str] = None


class RecommendationFeedbackCreate(RecommendationFeedbackBase):
    """Schema for creating recommendation feedback"""

    pass


class RecommendationFeedbackResponse(RecommendationFeedbackBase):
    """Schema for recommendation feedback responses"""

    feedback_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


# API Request/Response Schemas
class RecommendationRequest(BaseModel):
    """Schema for recommendation requests"""

    user_id: UUID
    item_type: Optional[str] = Field(None, pattern=r"^(room|tour|service|menu_item)$")
    limit: Optional[int] = Field(10, ge=1, le=50)
    recommendation_type: Optional[str] = Field(
        "personalized", pattern=r"^(personalized|trending|similar|popular)$"
    )


class RecommendationItem(BaseModel):
    """Schema for individual recommendation items"""

    item_id: str
    item_type: str
    recommendation_score: Decimal
    confidence_score: Decimal
    reason: str


class RecommendationResponse(BaseModel):
    """Schema for recommendation responses"""

    user_id: UUID
    recommendations: List[RecommendationItem]
    generated_at: datetime
    algorithm_version: str


class UserPreferenceBatchRequest(BaseModel):
    """Schema for batch user preference updates"""

    preferences: List[UserPreferenceCreate]


class UserPreferenceBatchResponse(BaseModel):
    """Schema for batch user preference responses"""

    processed_count: int
    failed_count: int
    errors: List[Dict[str, Any]]


# Analytics Schemas
class UserAnalyticsRequest(BaseModel):
    """Schema for user analytics requests"""

    user_id: UUID
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    action_types: Optional[List[str]] = None


class UserAnalyticsResponse(BaseModel):
    """Schema for user analytics responses"""

    user_id: UUID
    total_actions: int
    action_breakdown: Dict[str, int]
    top_pages: List[Dict[str, Any]]
    top_items: List[Dict[str, Any]]
    session_count: int
    average_session_duration: Optional[float]


# Dashboard Schemas
class RecommendationDashboardData(BaseModel):
    """Schema for recommendation dashboard data"""

    total_users: int
    total_preferences: int
    total_recommendations: int
    recommendation_accuracy: Optional[Decimal]
    popular_items: List[Dict[str, Any]]
    user_engagement: Dict[str, Any]
    algorithm_performance: Dict[str, Any]
