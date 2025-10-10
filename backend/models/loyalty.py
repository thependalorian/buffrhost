"""
Loyalty-related models for Buffr Host.
"""
from sqlalchemy import (Boolean, Column, Date, DateTime, ForeignKey, Integer,
                        String, Text)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class CrossBusinessLoyalty(Base):
    __tablename__ = "crossbusinessloyalty"
    loyalty_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    total_points = Column(Integer, default=0)
    tier_level = Column(String(50), default="bronze")
    points_earned_restaurant = Column(Integer, default=0)
    points_earned_hotel = Column(Integer, default=0)
    points_earned_spa = Column(Integer, default=0)
    points_earned_conference = Column(Integer, default=0)
    points_earned_transportation = Column(Integer, default=0)
    points_earned_recreation = Column(Integer, default=0)
    points_earned_specialized = Column(Integer, default=0)
    points_redeemed = Column(Integer, default=0)
    last_activity_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class LoyaltyTransaction(Base):
    __tablename__ = "loyaltytransaction"
    transaction_id = Column(
        UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4()
    )
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customer.customer_id"))
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    transaction_type = Column(String(50), nullable=False)
    points_amount = Column(Integer, nullable=False)
    service_type = Column(String(50))
    order_id = Column(UUID(as_uuid=True), ForeignKey("order.order_id"))
    booking_id = Column(UUID(as_uuid=True), ForeignKey("servicebooking.booking_id"))
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class LoyaltyCampaign(Base):
    __tablename__ = "loyaltycampaign"
    campaign_id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("hospitality_property.property_id"))
    campaign_name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    points_multiplier = Column(Integer, default=1)
    target_tiers = Column(ARRAY(String))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # ADDED: Missing fields from Pydantic LoyaltyCampaign
    success_probability = Column(String, nullable=True)
    target_segment = Column(String, nullable=True)
    customer_count = Column(Integer, nullable=True)
    reward_type = Column(String, nullable=True)
    avg_frequency = Column(String, nullable=True)
    expected_roi = Column(String, nullable=True)
    success_metrics = Column(Text, nullable=True)  # JSON string
    churn_risk = Column(String, nullable=True)
    segment = Column(String, nullable=True)
    reward_value = Column(String, nullable=True)
    loyalty_score = Column(String, nullable=True)
    expected_participation = Column(String, nullable=True)
    name = Column(String, nullable=True)
    campaign_type = Column(String, nullable=True)
    suggested_budget = Column(String, nullable=True)
    key_metrics = Column(Text, nullable=True)  # JSON string
    growth_potential = Column(String, nullable=True)
    performance_data = Column(Text, nullable=True)  # JSON string
    budget = Column(String, nullable=True)
    recommended_campaigns = Column(Text, nullable=True)  # JSON string
    status = Column(String, nullable=True)
    avg_spending = Column(String, nullable=True)
    reasoning = Column(Text, nullable=True)
    campaign_duration = Column(Integer, nullable=True)
