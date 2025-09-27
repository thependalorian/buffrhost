"""
AI-Powered Loyalty Campaign Optimization for Buffr Host Hospitality Platform

This module implements intelligent loyalty campaign management using:
- Pydantic AI for structured campaign responses
- LangChain for campaign chain processing
- Machine learning for customer segmentation
- Predictive analytics for campaign optimization

Features:
- Intelligent loyalty campaign generation
- Profile segmentation and targeting
- Campaign performance optimization
- A/B testing for loyalty programs
- Cross-service loyalty integration
- Personalized reward recommendations
- Campaign ROI analysis and reporting
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from datetime import datetime, timedelta
import asyncio
import logging
from enum import Enum
from dataclasses import dataclass
import numpy as np
from collections import defaultdict
import asyncio
from typing import Tuple

from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel

from langchain.schema import BaseMessage, HumanMessage, AIMessage
from langchain.memory import ConversationBufferMemory

# ML imports
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.decomposition import PCA

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func, desc

from models.user import User, Profile
from models.hospitality_property import HospitalityProperty
from models.loyalty import CrossBusinessLoyalty, LoyaltyTransaction
from models.order import Order
from models.room import RoomReservation
from models.services import ServiceBooking

logger = logging.getLogger(__name__)


class CampaignType(str, Enum):
    """Types of loyalty campaigns"""
    WELCOME = "welcome"
    RETENTION = "retention"
    REACTIVATION = "reactivation"
    CROSS_SELL = "cross_sell"
    UPSELL = "upsell"
    SEASONAL = "seasonal"
    REFERRAL = "referral"
    BIRTHDAY = "birthday"
    ANNIVERSARY = "anniversary"
    MILESTONE = "milestone"


class CampaignStatus(str, Enum):
    """Campaign status"""
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RewardType(str, Enum):
    """Types of rewards"""
    POINTS = "points"
    DISCOUNT = "discount"
    FREE_SERVICE = "free_service"
    UPGRADE = "upgrade"
    GIFT = "gift"
    EXPERIENCE = "experience"


class ProfileSegment(str, Enum):
    """Profile segments for targeting"""
    HIGH_VALUE = "high_value"
    FREQUENT = "frequent"
    NEW = "new"
    AT_RISK = "at_risk"
    DORMANT = "dormant"
    VIP = "vip"
    BUDGET = "budget"
    BUSINESS = "business"


class LoyaltyCampaign(BaseModel):
    """Loyalty campaign structure"""
    campaign_id: str
    name: str
    description: str
    campaign_type: CampaignType
    status: CampaignStatus
    target_segment: ProfileSegment
    reward_type: RewardType
    reward_value: float
    start_date: datetime
    end_date: datetime
    budget: float
    expected_roi: float
    success_metrics: Dict[str, float] = Field(default_factory=dict)
    performance_data: Dict[str, Any] = Field(default_factory=dict)


class CampaignRecommendation(BaseModel):
    """AI-generated campaign recommendation"""
    campaign_type: CampaignType
    target_segment: ProfileSegment
    reward_type: RewardType
    reward_value: float
    campaign_duration: int  # days
    expected_participation: float
    expected_roi: float
    reasoning: str
    success_probability: float
    suggested_budget: float
    key_metrics: List[str] = Field(default_factory=list)


class ProfileSegmentAnalysis(BaseModel):
    """Profile segment analysis"""
    segment: ProfileSegment
    customer_count: int
    avg_spending: float
    avg_frequency: float
    loyalty_score: float
    churn_risk: float
    growth_potential: float
    recommended_campaigns: List[CampaignType] = Field(default_factory=list)


class LoyaltyAI:
    """
    AI-powered loyalty campaign optimization system
    
    Features:
    - Intelligent campaign generation and optimization
    - Profile segmentation and targeting
    - Campaign performance prediction
    - A/B testing for loyalty programs
    - Cross-service loyalty integration
    - Personalized reward recommendations
    - ROI analysis and reporting
    """
    
    def __init__(self, db_session: AsyncSession, openai_api_key: str):
        self.db = db_session
        self.openai_api_key = openai_api_key
        
        # Initialize Pydantic AI Agent for campaign optimization
        self.agent = Agent(
            model=OpenAIModel('gpt-4o-mini', api_key=openai_api_key),
            result_type=CampaignRecommendation,
            system_prompt=self._get_loyalty_system_prompt()
        )
        
        # Initialize campaign memory
        self.memory = ConversationBufferMemory(
            memory_key="campaign_history",
            return_messages=True
        )
        
        # Campaign performance weights
        self.campaign_weights = {
            "participation_rate": 0.3,
            "conversion_rate": 0.25,
            "roi": 0.25,
            "customer_satisfaction": 0.2
        }
        
        # Profile segment definitions
        self.segment_definitions = self._initialize_segment_definitions()
        
        # Campaign templates
        self.campaign_templates = self._initialize_campaign_templates()
        
        # Initialize ML models
        self.ml_models = {
            'customer_segmentation': KMeans(n_clusters=8, random_state=42),
            'churn_prediction': RandomForestClassifier(n_estimators=100, random_state=42),
            'lifetime_value': RandomForestRegressor(n_estimators=100, random_state=42),
            'campaign_response': LogisticRegression(random_state=42)
        }
        
        # Initialize preprocessing
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.pca = PCA(n_components=0.95)
        
        # Model training status
        self.models_trained = {
            'customer_segmentation': False,
            'churn_prediction': False,
            'lifetime_value': False,
            'campaign_response': False
        }
    
    def _get_loyalty_system_prompt(self) -> str:
        """Get system prompt for loyalty AI agent"""
        return """
        You are Buffr Host AI, a loyalty program optimization specialist for the Buffr Host hospitality platform.
        
        Your role is to create, optimize, and manage loyalty campaigns that drive customer engagement,
        retention, and revenue across all hospitality services.
        
        **Campaign Optimization Guidelines:**
        1. **Profile-Centric**: Design campaigns that provide genuine value to customers
        2. **Data-Driven**: Use customer behavior data to inform campaign decisions
        3. **Cross-Service**: Leverage the full hospitality ecosystem for campaigns
        4. **ROI-Focused**: Ensure campaigns deliver measurable business value
        5. **Personalized**: Tailor campaigns to specific customer segments
        
        **Campaign Types:**
        - Welcome: New customer onboarding campaigns
        - Retention: Keeping existing customers engaged
        - Reactivation: Re-engaging dormant customers
        - Cross-Sell: Promoting additional services
        - Upsell: Encouraging premium services
        - Seasonal: Time-based promotional campaigns
        - Referral: Profile acquisition through referrals
        - Birthday/Anniversary: Personal milestone campaigns
        - Milestone: Achievement-based rewards
        
        **Profile Segments:**
        - High Value: Top spending customers
        - Frequent: Regular visitors
        - New: Recent customers
        - At Risk: Profiles showing churn signals
        - Dormant: Inactive customers
        - VIP: Premium tier customers
        - Budget: Price-sensitive customers
        - Business: Corporate customers
        
        **Reward Types:**
        - Points: Loyalty point rewards
        - Discount: Percentage or fixed discounts
        - Free Service: Complimentary services
        - Upgrade: Service upgrades
        - Gift: Physical or digital gifts
        - Experience: Special experiences or access
        
        Always consider customer lifetime value, engagement patterns, and cross-service opportunities
        when designing campaigns.
        """
    
    def _initialize_segment_definitions(self) -> Dict[ProfileSegment, Dict[str, Any]]:
        """Initialize customer segment definitions"""
        return {
            ProfileSegment.HIGH_VALUE: {
                "spending_threshold": 1000,
                "frequency_threshold": 10,
                "description": "Top spending customers with high lifetime value"
            },
            ProfileSegment.FREQUENT: {
                "frequency_threshold": 5,
                "time_period": 90,  # days
                "description": "Regular customers with consistent visits"
            },
            ProfileSegment.NEW: {
                "days_since_first_visit": 30,
                "max_visits": 3,
                "description": "Recent customers in onboarding phase"
            },
            ProfileSegment.AT_RISK: {
                "days_since_last_visit": 60,
                "declining_frequency": True,
                "description": "Profiles showing signs of churn"
            },
            ProfileSegment.DORMANT: {
                "days_since_last_visit": 180,
                "description": "Inactive customers needing reactivation"
            },
            ProfileSegment.VIP: {
                "loyalty_tier": ["Gold", "Platinum", "Diamond"],
                "description": "Premium loyalty tier customers"
            },
            ProfileSegment.BUDGET: {
                "avg_order_value": 50,
                "price_sensitivity": "high",
                "description": "Price-sensitive customers"
            },
            ProfileSegment.BUSINESS: {
                "customer_type": "corporate",
                "description": "Business and corporate customers"
            }
        }
    
    def _initialize_campaign_templates(self) -> Dict[CampaignType, Dict[str, Any]]:
        """Initialize campaign templates"""
        return {
            CampaignType.WELCOME: {
                "reward_type": RewardType.POINTS,
                "reward_value": 100,
                "duration": 30,
                "description": "Welcome new customers with bonus points"
            },
            CampaignType.RETENTION: {
                "reward_type": RewardType.DISCOUNT,
                "reward_value": 15,
                "duration": 14,
                "description": "Retain existing customers with special offers"
            },
            CampaignType.REACTIVATION: {
                "reward_type": RewardType.FREE_SERVICE,
                "reward_value": 50,
                "duration": 7,
                "description": "Reactivate dormant customers with free services"
            },
            CampaignType.CROSS_SELL: {
                "reward_type": RewardType.POINTS,
                "reward_value": 50,
                "duration": 21,
                "description": "Encourage cross-service usage"
            },
            CampaignType.UPSELL: {
                "reward_type": RewardType.UPGRADE,
                "reward_value": 25,
                "duration": 14,
                "description": "Promote premium service upgrades"
            },
            CampaignType.SEASONAL: {
                "reward_type": RewardType.EXPERIENCE,
                "reward_value": 100,
                "duration": 30,
                "description": "Seasonal promotional campaigns"
            },
            CampaignType.REFERRAL: {
                "reward_type": RewardType.POINTS,
                "reward_value": 200,
                "duration": 60,
                "description": "Profile referral programs"
            },
            CampaignType.BIRTHDAY: {
                "reward_type": RewardType.GIFT,
                "reward_value": 75,
                "duration": 7,
                "description": "Birthday celebration rewards"
            }
        }
    
    async def analyze_customer_segments(self, property_id: int) -> List[ProfileSegmentAnalysis]:
        """
        Analyze customer segments for campaign targeting
        
        Args:
            property_id: Hospitality property ID
            
        Returns:
            List of customer segment analyses
        """
        try:
            segments = []
            
            for segment_type in ProfileSegment:
                analysis = await self._analyze_segment(property_id, segment_type)
                if analysis:
                    segments.append(analysis)
            
            return segments
            
        except Exception as e:
            logger.error(f"Error analyzing customer segments: {e}")
            return []
    
    async def _analyze_segment(self, property_id: int, segment: ProfileSegment) -> Optional[ProfileSegmentAnalysis]:
        """Analyze a specific customer segment"""
        try:
            # Get customers in this segment
            customers = await self._get_customers_in_segment(property_id, segment)
            
            if not customers:
                return None
            
            # Calculate segment metrics
            customer_count = len(customers)
            avg_spending = await self._calculate_avg_spending(customers)
            avg_frequency = await self._calculate_avg_frequency(customers)
            loyalty_score = await self._calculate_loyalty_score(customers)
            churn_risk = await self._calculate_churn_risk(customers)
            growth_potential = await self._calculate_growth_potential(customers)
            
            # Get recommended campaigns for this segment
            recommended_campaigns = await self._get_recommended_campaigns(segment)
            
            return ProfileSegmentAnalysis(
                segment=segment,
                customer_count=customer_count,
                avg_spending=avg_spending,
                avg_frequency=avg_frequency,
                loyalty_score=loyalty_score,
                churn_risk=churn_risk,
                growth_potential=growth_potential,
                recommended_campaigns=recommended_campaigns
            )
            
        except Exception as e:
            logger.error(f"Error analyzing segment {segment}: {e}")
            return None
    
    async def _get_customers_in_segment(self, property_id: int, segment: ProfileSegment) -> List[Profile]:
        """Get customers belonging to a specific segment"""
        try:
            customers = []
            
            if segment == ProfileSegment.HIGH_VALUE:
                # Get customers with high spending
                query = select(Profile).join(CrossBusinessLoyalty).where(
                    and_(
                        Profile.property_id == property_id,
                        CrossBusinessLoyalty.total_points >= 1000
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.FREQUENT:
                # Get customers with high visit frequency
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.created_at >= datetime.now() - timedelta(days=90)
                    )
                )
                result = await self.db.execute(query)
                all_customers = result.scalars().all()
                
                # Filter by actual visit frequency
                frequent_customers = []
                for customer in all_customers:
                    visit_count = await self._get_customer_visit_frequency(customer.id)
                    if visit_count >= 5:  # 5+ visits in 90 days
                        frequent_customers.append(customer)
                customers = frequent_customers
                
            elif segment == ProfileSegment.NEW:
                # Get new customers
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.created_at >= datetime.now() - timedelta(days=30)
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.AT_RISK:
                # Get customers at risk of churn
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.last_login <= datetime.now() - timedelta(days=60)
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.DORMANT:
                # Get dormant customers
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.last_login <= datetime.now() - timedelta(days=180)
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.VIP:
                # Get VIP customers
                query = select(Profile).join(CrossBusinessLoyalty).where(
                    and_(
                        Profile.property_id == property_id,
                        CrossBusinessLoyalty.tier_level.in_(["Gold", "Platinum", "Diamond"])
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.BUDGET:
                # Get budget-conscious customers
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.avg_order_value <= 50
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
                
            elif segment == ProfileSegment.BUSINESS:
                # Get business customers
                query = select(Profile).where(
                    and_(
                        Profile.property_id == property_id,
                        Profile.customer_type == "corporate"
                    )
                )
                result = await self.db.execute(query)
                customers = result.scalars().all()
            
            return customers
            
        except Exception as e:
            logger.error(f"Error getting customers in segment {segment}: {e}")
            return []
    
    async def _calculate_avg_spending(self, customers: List[Profile]) -> float:
        """Calculate average spending for customer segment"""
        try:
            if not customers:
                return 0.0
            
            total_spending = 0.0
            customer_count = 0
            
            for customer in customers:
                # Get customer's total spending
                spending = await self._get_customer_total_spending(customer.id)
                total_spending += spending
                customer_count += 1
            
            return total_spending / customer_count if customer_count > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating average spending: {e}")
            return 0.0
    
    async def _calculate_avg_frequency(self, customers: List[Profile]) -> float:
        """Calculate average visit frequency for customer segment"""
        try:
            if not customers:
                return 0.0
            
            total_visits = 0
            customer_count = 0
            
            for customer in customers:
                # Get customer's visit frequency
                visits = await self._get_customer_visit_frequency(customer.id)
                total_visits += visits
                customer_count += 1
            
            return total_visits / customer_count if customer_count > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating average frequency: {e}")
            return 0.0
    
    async def _calculate_loyalty_score(self, customers: List[Profile]) -> float:
        """Calculate loyalty score for customer segment"""
        try:
            if not customers:
                return 0.0
            
            total_score = 0.0
            customer_count = 0
            
            for customer in customers:
                # Get customer's loyalty score
                score = await self._get_customer_loyalty_score(customer.id)
                total_score += score
                customer_count += 1
            
            return total_score / customer_count if customer_count > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating loyalty score: {e}")
            return 0.0
    
    async def _calculate_churn_risk(self, customers: List[Profile]) -> float:
        """Calculate churn risk for customer segment"""
        try:
            if not customers:
                return 0.0
            
            at_risk_count = 0
            total_customers = len(customers)
            
            for customer in customers:
                # Check if customer is at risk
                is_at_risk = await self._is_customer_at_risk(customer.id)
                if is_at_risk:
                    at_risk_count += 1
            
            return at_risk_count / total_customers if total_customers > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating churn risk: {e}")
            return 0.0
    
    async def _calculate_growth_potential(self, customers: List[Profile]) -> float:
        """Calculate growth potential for customer segment"""
        try:
            if not customers:
                return 0.0
            
            total_growth_score = 0.0
            customer_count = 0
            
            for customer in customers:
                # Analyze spending trends over time
                recent_spending = await self._get_recent_spending_trend(customer.id)
                service_diversity = await self._get_service_diversity_score(customer.id)
                engagement_trend = await self._get_engagement_trend(customer.id)
                
                # Calculate growth potential score (0-1)
                growth_score = (recent_spending * 0.4) + (service_diversity * 0.3) + (engagement_trend * 0.3)
                total_growth_score += growth_score
                customer_count += 1
            
            return total_growth_score / customer_count if customer_count > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating growth potential: {e}")
            return 0.0
    
    async def _get_recommended_campaigns(self, segment: ProfileSegment) -> List[CampaignType]:
        """Get recommended campaign types for a segment"""
        try:
            recommendations = {
                ProfileSegment.HIGH_VALUE: [CampaignType.UPSELL, CampaignType.CROSS_SELL, CampaignType.VIP],
                ProfileSegment.FREQUENT: [CampaignType.RETENTION, CampaignType.CROSS_SELL],
                ProfileSegment.NEW: [CampaignType.WELCOME, CampaignType.CROSS_SELL],
                ProfileSegment.AT_RISK: [CampaignType.RETENTION, CampaignType.REACTIVATION],
                ProfileSegment.DORMANT: [CampaignType.REACTIVATION, CampaignType.SEASONAL],
                ProfileSegment.VIP: [CampaignType.UPSELL, CampaignType.EXPERIENCE],
                ProfileSegment.BUDGET: [CampaignType.DISCOUNT, CampaignType.SEASONAL],
                ProfileSegment.BUSINESS: [CampaignType.CROSS_SELL, CampaignType.BUSINESS]
            }
            
            return recommendations.get(segment, [CampaignType.RETENTION])
            
        except Exception as e:
            logger.error(f"Error getting recommended campaigns: {e}")
            return []
    
    async def generate_campaign_recommendations(
        self, 
        property_id: int, 
        target_segment: Optional[ProfileSegment] = None,
        campaign_type: Optional[CampaignType] = None,
        budget: Optional[float] = None
    ) -> List[CampaignRecommendation]:
        """
        Generate AI-powered campaign recommendations
        
        Args:
            property_id: Hospitality property ID
            target_segment: Specific segment to target (optional)
            campaign_type: Specific campaign type (optional)
            budget: Campaign budget (optional)
            
        Returns:
            List of campaign recommendations
        """
        try:
            recommendations = []
            
            # Get customer segment analysis
            segments = await self.analyze_customer_segments(property_id)
            
            # Generate recommendations for each segment
            for segment_analysis in segments:
                if target_segment and segment_analysis.segment != target_segment:
                    continue
                
                # Generate recommendations for this segment
                segment_recommendations = await self._generate_segment_recommendations(
                    segment_analysis, campaign_type, budget
                )
                recommendations.extend(segment_recommendations)
            
            # Sort by expected ROI
            recommendations.sort(key=lambda x: x.expected_roi, reverse=True)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating campaign recommendations: {e}")
            return []
    
    async def _generate_segment_recommendations(
        self, 
        segment_analysis: ProfileSegmentAnalysis,
        campaign_type: Optional[CampaignType] = None,
        budget: Optional[float] = None
    ) -> List[CampaignRecommendation]:
        """Generate recommendations for a specific segment"""
        try:
            recommendations = []
            
            # Get recommended campaign types for this segment
            campaign_types = segment_analysis.recommended_campaigns
            if campaign_type:
                campaign_types = [campaign_type]
            
            for camp_type in campaign_types:
                # Get campaign template
                template = self.campaign_templates.get(camp_type, {})
                
                # Calculate campaign parameters
                reward_value = template.get("reward_value", 50)
                duration = template.get("duration", 14)
                
                # Calculate expected participation
                expected_participation = await self._calculate_expected_participation(
                    segment_analysis, camp_type
                )
                
                # Calculate expected ROI
                expected_roi = await self._calculate_expected_roi(
                    segment_analysis, camp_type, reward_value, expected_participation
                )
                
                # Calculate success probability
                success_probability = await self._calculate_success_probability(
                    segment_analysis, camp_type
                )
                
                # Calculate suggested budget
                suggested_budget = await self._calculate_suggested_budget(
                    segment_analysis, reward_value, expected_participation
                )
                
                if budget and suggested_budget > budget:
                    continue  # Skip if over budget
                
                # Generate reasoning
                reasoning = await self._generate_campaign_reasoning(
                    segment_analysis, camp_type, expected_participation, expected_roi
                )
                
                recommendation = CampaignRecommendation(
                    campaign_type=camp_type,
                    target_segment=segment_analysis.segment,
                    reward_type=RewardType(template.get("reward_type", "points")),
                    reward_value=reward_value,
                    campaign_duration=duration,
                    expected_participation=expected_participation,
                    expected_roi=expected_roi,
                    reasoning=reasoning,
                    success_probability=success_probability,
                    suggested_budget=suggested_budget,
                    key_metrics=["participation_rate", "conversion_rate", "roi", "customer_satisfaction"]
                )
                
                recommendations.append(recommendation)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating segment recommendations: {e}")
            return []
    
    async def _calculate_expected_participation(
        self, 
        segment_analysis: ProfileSegmentAnalysis, 
        campaign_type: CampaignType
    ) -> float:
        """Calculate expected participation rate for campaign"""
        try:
            # Base participation rates by segment and campaign type
            base_rates = {
                ProfileSegment.HIGH_VALUE: {
                    CampaignType.UPSELL: 0.8,
                    CampaignType.CROSS_SELL: 0.7,
                    CampaignType.RETENTION: 0.6
                },
                ProfileSegment.FREQUENT: {
                    CampaignType.RETENTION: 0.7,
                    CampaignType.CROSS_SELL: 0.6,
                    CampaignType.SEASONAL: 0.5
                },
                ProfileSegment.NEW: {
                    CampaignType.WELCOME: 0.9,
                    CampaignType.CROSS_SELL: 0.4,
                    CampaignType.REFERRAL: 0.3
                },
                ProfileSegment.AT_RISK: {
                    CampaignType.RETENTION: 0.5,
                    CampaignType.REACTIVATION: 0.4,
                    CampaignType.SEASONAL: 0.3
                },
                ProfileSegment.DORMANT: {
                    CampaignType.REACTIVATION: 0.3,
                    CampaignType.SEASONAL: 0.2,
                    CampaignType.REFERRAL: 0.1
                }
            }
            
            segment_rates = base_rates.get(segment_analysis.segment, {})
            base_rate = segment_rates.get(campaign_type, 0.3)
            
            # Adjust based on segment characteristics
            loyalty_adjustment = segment_analysis.loyalty_score * 0.2
            churn_adjustment = (1 - segment_analysis.churn_risk) * 0.1
            
            expected_participation = base_rate + loyalty_adjustment + churn_adjustment
            return min(expected_participation, 1.0)  # Cap at 100%
            
        except Exception as e:
            logger.error(f"Error calculating expected participation: {e}")
            return 0.3
    
    async def _calculate_expected_roi(
        self, 
        segment_analysis: ProfileSegmentAnalysis, 
        campaign_type: CampaignType,
        reward_value: float,
        expected_participation: float
    ) -> float:
        """Calculate expected ROI for campaign"""
        try:
            # Calculate campaign cost
            campaign_cost = segment_analysis.customer_count * expected_participation * reward_value
            
            # Calculate expected revenue
            avg_spending = segment_analysis.avg_spending
            expected_revenue = segment_analysis.customer_count * expected_participation * avg_spending * 1.2  # 20% uplift
            
            # Calculate ROI
            if campaign_cost > 0:
                roi = (expected_revenue - campaign_cost) / campaign_cost
            else:
                roi = 0.0
            
            return roi
            
        except Exception as e:
            logger.error(f"Error calculating expected ROI: {e}")
            return 0.0
    
    async def _calculate_success_probability(
        self, 
        segment_analysis: ProfileSegmentAnalysis, 
        campaign_type: CampaignType
    ) -> float:
        """Calculate success probability for campaign"""
        try:
            # Base success rates by campaign type
            base_success_rates = {
                CampaignType.WELCOME: 0.8,
                CampaignType.RETENTION: 0.6,
                CampaignType.REACTIVATION: 0.4,
                CampaignType.CROSS_SELL: 0.5,
                CampaignType.UPSELL: 0.4,
                CampaignType.SEASONAL: 0.6,
                CampaignType.REFERRAL: 0.3,
                CampaignType.BIRTHDAY: 0.7
            }
            
            base_rate = base_success_rates.get(campaign_type, 0.5)
            
            # Adjust based on segment characteristics
            loyalty_adjustment = segment_analysis.loyalty_score * 0.2
            growth_adjustment = segment_analysis.growth_potential * 0.1
            
            success_probability = base_rate + loyalty_adjustment + growth_adjustment
            return min(success_probability, 1.0)  # Cap at 100%
            
        except Exception as e:
            logger.error(f"Error calculating success probability: {e}")
            return 0.5
    
    async def _calculate_suggested_budget(
        self, 
        segment_analysis: ProfileSegmentAnalysis, 
        reward_value: float,
        expected_participation: float
    ) -> float:
        """Calculate suggested budget for campaign"""
        try:
            customer_count = segment_analysis.customer_count
            suggested_budget = customer_count * expected_participation * reward_value
            
            # Add 20% buffer for campaign management
            suggested_budget *= 1.2
            
            return suggested_budget
            
        except Exception as e:
            logger.error(f"Error calculating suggested budget: {e}")
            return 1000.0
    
    async def _generate_campaign_reasoning(
        self, 
        segment_analysis: ProfileSegmentAnalysis, 
        campaign_type: CampaignType,
        expected_participation: float,
        expected_roi: float
    ) -> str:
        """Generate reasoning for campaign recommendation"""
        try:
            reasoning_parts = []
            
            # Segment characteristics
            reasoning_parts.append(f"Targeting {segment_analysis.segment.value} segment with {segment_analysis.customer_count} customers")
            
            # Campaign rationale
            if campaign_type == CampaignType.WELCOME:
                reasoning_parts.append("New customers need onboarding to establish loyalty")
            elif campaign_type == CampaignType.RETENTION:
                reasoning_parts.append("Existing customers need engagement to prevent churn")
            elif campaign_type == CampaignType.REACTIVATION:
                reasoning_parts.append("Dormant customers need incentives to return")
            elif campaign_type == CampaignType.CROSS_SELL:
                reasoning_parts.append("Cross-service promotion increases customer value")
            elif campaign_type == CampaignType.UPSELL:
                reasoning_parts.append("Premium service promotion increases revenue per customer")
            
            # Performance expectations
            reasoning_parts.append(f"Expected {expected_participation:.1%} participation rate")
            reasoning_parts.append(f"Expected {expected_roi:.1%} ROI")
            
            # Segment insights
            if segment_analysis.loyalty_score > 0.7:
                reasoning_parts.append("High loyalty score indicates strong engagement potential")
            if segment_analysis.churn_risk > 0.5:
                reasoning_parts.append("High churn risk requires immediate attention")
            if segment_analysis.growth_potential > 0.6:
                reasoning_parts.append("High growth potential for revenue expansion")
            
            return ". ".join(reasoning_parts) + "."
            
        except Exception as e:
            logger.error(f"Error generating campaign reasoning: {e}")
            return "Campaign recommended based on segment analysis and historical performance."
    
    async def _get_customer_total_spending(self, customer_id: int) -> float:
        """Get total spending for a customer"""
        try:
            # Get orders
            order_query = select(func.sum(Order.total_amount)).where(Order.customer_id == customer_id)
            order_result = await self.db.execute(order_query)
            order_total = order_result.scalar() or 0
            
            # Get reservations
            reservation_query = select(func.sum(RoomReservation.total_amount)).where(
                RoomReservation.customer_id == customer_id
            )
            reservation_result = await self.db.execute(reservation_query)
            reservation_total = reservation_result.scalar() or 0
            
            # Get service bookings
            booking_query = select(func.sum(ServiceBooking.total_amount)).where(
                ServiceBooking.customer_id == customer_id
            )
            booking_result = await self.db.execute(booking_query)
            booking_total = booking_result.scalar() or 0
            
            return order_total + reservation_total + booking_total
            
        except Exception as e:
            logger.error(f"Error getting customer total spending: {e}")
            return 0.0
    
    async def _get_customer_visit_frequency(self, customer_id: int) -> int:
        """Get visit frequency for a customer"""
        try:
            # Count orders in last 90 days
            order_query = select(func.count(Order.id)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= datetime.now() - timedelta(days=90)
                )
            )
            order_result = await self.db.execute(order_query)
            order_count = order_result.scalar() or 0
            
            # Count reservations in last 90 days
            reservation_query = select(func.count(RoomReservation.id)).where(
                and_(
                    RoomReservation.customer_id == customer_id,
                    RoomReservation.check_in_date >= datetime.now() - timedelta(days=90)
                )
            )
            reservation_result = await self.db.execute(reservation_query)
            reservation_count = reservation_result.scalar() or 0
            
            # Count service bookings in last 90 days
            booking_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.booking_date >= datetime.now() - timedelta(days=90)
                )
            )
            booking_result = await self.db.execute(booking_query)
            booking_count = booking_result.scalar() or 0
            
            return order_count + reservation_count + booking_count
            
        except Exception as e:
            logger.error(f"Error getting customer visit frequency: {e}")
            return 0
    
    async def _get_customer_loyalty_score(self, customer_id: int) -> float:
        """Get loyalty score for a customer"""
        try:
            # Get loyalty information
            query = select(CrossBusinessLoyalty).where(CrossBusinessLoyalty.customer_id == customer_id)
            result = await self.db.execute(query)
            loyalty = result.scalar_one_or_none()
            
            if not loyalty:
                return 0.0
            
            # Calculate loyalty score based on points and tier
            tier_scores = {"Bronze": 0.3, "Silver": 0.5, "Gold": 0.7, "Platinum": 0.8, "Diamond": 0.9}
            tier_score = tier_scores.get(loyalty.tier_level, 0.3)
            
            # Adjust based on total points
            points_score = min(loyalty.total_points / 1000, 1.0)  # Normalize to 0-1
            
            # Combine scores
            loyalty_score = (tier_score * 0.6) + (points_score * 0.4)
            
            return loyalty_score
            
        except Exception as e:
            logger.error(f"Error getting customer loyalty score: {e}")
            return 0.0
    
    async def _is_customer_at_risk(self, customer_id: int) -> bool:
        """Check if customer is at risk of churn"""
        try:
            # Get customer's last activity
            query = select(Profile).where(Profile.id == customer_id)
            result = await self.db.execute(query)
            customer = result.scalar_one_or_none()
            
            if not customer:
                return False
            
            # Check if last login was more than 60 days ago
            if customer.last_login and customer.last_login < datetime.now() - timedelta(days=60):
                return True
            
            # Check visit frequency decline
            recent_visits = await self._get_customer_visit_frequency(customer_id)
            if recent_visits < 2:  # Less than 2 visits in 90 days
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking customer churn risk: {e}")
            return False
    
    async def optimize_campaign_performance(
        self, 
        campaign_id: str, 
        performance_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Optimize campaign performance based on real-time data"""
        try:
            optimizations = {
                "recommended_adjustments": [],
                "performance_insights": [],
                "next_actions": []
            }
            
            # Analyze performance metrics
            participation_rate = performance_data.get("participation_rate", 0)
            conversion_rate = performance_data.get("conversion_rate", 0)
            roi = performance_data.get("roi", 0)
            
            # Generate optimization recommendations
            if participation_rate < 0.3:
                optimizations["recommended_adjustments"].append(
                    "Increase reward value or improve targeting to boost participation"
                )
            
            if conversion_rate < 0.2:
                optimizations["recommended_adjustments"].append(
                    "Improve campaign messaging or offer more relevant rewards"
                )
            
            if roi < 0.5:
                optimizations["recommended_adjustments"].append(
                    "Reduce campaign costs or increase customer lifetime value"
                )
            
            # Performance insights
            if participation_rate > 0.7:
                optimizations["performance_insights"].append(
                    "High participation rate indicates strong campaign appeal"
                )
            
            if roi > 1.0:
                optimizations["performance_insights"].append(
                    "Positive ROI indicates successful campaign execution"
                )
            
            # Next actions
            optimizations["next_actions"].extend([
                "Monitor campaign performance daily",
                "A/B test different reward values",
                "Segment customers for more targeted messaging",
                "Analyze customer feedback for improvements"
            ])
            
            return optimizations
            
        except Exception as e:
            logger.error(f"Error optimizing campaign performance: {e}")
            return {}
    
    async def get_loyalty_analytics(self, property_id: int) -> Dict[str, Any]:
        """Get comprehensive loyalty program analytics"""
        try:
            analytics = {
                "total_customers": 0,
                "active_customers": 0,
                "loyalty_tiers": {},
                "points_distribution": {},
                "campaign_performance": {},
                "revenue_attribution": {},
                "churn_analysis": {},
                "growth_metrics": {}
            }
            
            # Get customer counts
            customer_query = select(func.count(Profile.id)).where(Profile.property_id == property_id)
            customer_result = await self.db.execute(customer_query)
            analytics["total_customers"] = customer_result.scalar() or 0
            
            # Get active customers (last 30 days)
            active_query = select(func.count(Profile.id)).where(
                and_(
                    Profile.property_id == property_id,
                    Profile.last_login >= datetime.now() - timedelta(days=30)
                )
            )
            active_result = await self.db.execute(active_query)
            analytics["active_customers"] = active_result.scalar() or 0
            
            # Get loyalty tier distribution
            tier_query = select(
                CrossBusinessLoyalty.tier_level,
                func.count(CrossBusinessLoyalty.customer_id)
            ).where(
                CrossBusinessLoyalty.property_id == property_id
            ).group_by(CrossBusinessLoyalty.tier_level)
            
            tier_result = await self.db.execute(tier_query)
            for tier, count in tier_result:
                analytics["loyalty_tiers"][tier] = count
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error getting loyalty analytics: {e}")
            return {}
    
    async def _extract_customer_features(self, customer: Profile) -> np.ndarray:
        """Extract comprehensive features for ML models"""
        try:
            features = []
            
            # Basic customer features
            features.append(customer.id)
            features.append((datetime.now() - customer.created_at).days)  # Profile age in days
            features.append(1 if customer.is_active else 0)  # Active status
            
            # Behavioral features
            visit_frequency = await self._get_visit_frequency(customer.id)
            features.append(visit_frequency)
            
            avg_spending = await self._get_avg_spending(customer.id)
            features.append(avg_spending)
            
            total_spending = await self._get_total_spending(customer.id)
            features.append(total_spending)
            
            # Loyalty features
            loyalty_points = await self._get_loyalty_points(customer.id)
            features.append(loyalty_points)
            
            loyalty_tier = await self._get_loyalty_tier(customer.id)
            features.append(loyalty_tier)
            
            # Temporal features
            days_since_last_visit = await self._get_days_since_last_visit(customer.id)
            features.append(days_since_last_visit)
            
            visit_consistency = await self._get_visit_consistency(customer.id)
            features.append(visit_consistency)
            
            # Engagement features
            campaign_response_rate = await self._get_campaign_response_rate(customer.id)
            features.append(campaign_response_rate)
            
            referral_activity = await self._get_referral_activity(customer.id)
            features.append(referral_activity)
            
            # Service preferences
            service_preferences = await self._get_service_preferences(customer.id)
            features.extend(service_preferences)
            
            # Seasonal patterns
            seasonal_patterns = await self._get_seasonal_patterns(customer.id)
            features.extend(seasonal_patterns)
            
            # Payment behavior
            payment_behavior = await self._get_payment_behavior(customer.id)
            features.extend(payment_behavior)
            
            return np.array(features)
            
        except Exception as e:
            logger.error(f"Error extracting customer features: {e}")
            return np.array([])
    
    async def _get_visit_frequency(self, customer_id: int) -> float:
        """Get customer visit frequency (visits per month)"""
        try:
            # Get total visits in last 90 days
            query = select(func.count(Order.id)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= datetime.now() - timedelta(days=90)
                )
            )
            result = await self.db.execute(query)
            visits = result.scalar() or 0
            
            return visits / 3.0  # Visits per month
        except Exception as e:
            logger.error(f"Error getting visit frequency: {e}")
            return 0.0
    
    async def _get_avg_spending(self, customer_id: int) -> float:
        """Get average spending per visit"""
        try:
            query = select(func.avg(Order.total_amount)).where(Order.customer_id == customer_id)
            result = await self.db.execute(query)
            return result.scalar() or 0.0
        except Exception as e:
            logger.error(f"Error getting average spending: {e}")
            return 0.0
    
    async def _get_total_spending(self, customer_id: int) -> float:
        """Get total lifetime spending"""
        try:
            query = select(func.sum(Order.total_amount)).where(Order.customer_id == customer_id)
            result = await self.db.execute(query)
            return result.scalar() or 0.0
        except Exception as e:
            logger.error(f"Error getting total spending: {e}")
            return 0.0
    
    async def _get_loyalty_points(self, customer_id: int) -> int:
        """Get current loyalty points"""
        try:
            query = select(CrossBusinessLoyalty.total_points).where(
                CrossBusinessLoyalty.customer_id == customer_id
            )
            result = await self.db.execute(query)
            return result.scalar() or 0
        except Exception as e:
            logger.error(f"Error getting loyalty points: {e}")
            return 0
    
    async def _get_loyalty_tier(self, customer_id: int) -> int:
        """Get loyalty tier level"""
        try:
            query = select(CrossBusinessLoyalty.tier_level).where(
                CrossBusinessLoyalty.customer_id == customer_id
            )
            result = await self.db.execute(query)
            return result.scalar() or 1
        except Exception as e:
            logger.error(f"Error getting loyalty tier: {e}")
            return 1
    
    async def _get_days_since_last_visit(self, customer_id: int) -> int:
        """Get days since last visit"""
        try:
            query = select(func.max(Order.created_at)).where(Order.customer_id == customer_id)
            result = await self.db.execute(query)
            last_visit = result.scalar()
            
            if last_visit:
                return (datetime.now() - last_visit).days
            return 999  # Never visited
        except Exception as e:
            logger.error(f"Error getting days since last visit: {e}")
            return 999
    
    async def _get_visit_consistency(self, customer_id: int) -> float:
        """Get visit consistency score (0-1)"""
        try:
            # Get visit intervals
            query = select(Order.created_at).where(Order.customer_id == customer_id).order_by(Order.created_at)
            result = await self.db.execute(query)
            visits = [row[0] for row in result.fetchall()]
            
            if len(visits) < 2:
                return 0.0
            
            # Calculate standard deviation of visit intervals
            intervals = [(visits[i+1] - visits[i]).days for i in range(len(visits)-1)]
            if not intervals:
                return 0.0
            
            mean_interval = np.mean(intervals)
            std_interval = np.std(intervals)
            
            # Consistency score (lower std = higher consistency)
            consistency = max(0, 1 - (std_interval / mean_interval)) if mean_interval > 0 else 0
            return min(1.0, consistency)
            
        except Exception as e:
            logger.error(f"Error getting visit consistency: {e}")
            return 0.0
    
    async def _get_campaign_response_rate(self, customer_id: int) -> float:
        """Get campaign response rate based on actual campaign interactions"""
        try:
            # Get loyalty transactions that indicate campaign responses
            campaign_query = select(func.count(LoyaltyTransaction.id)).where(
                and_(
                    LoyaltyTransaction.customer_id == customer_id,
                    LoyaltyTransaction.transaction_type.in_(['campaign_bonus', 'promotional_points', 'referral_bonus'])
                )
            )
            campaign_result = await self.db.execute(campaign_query)
            campaign_responses = campaign_result.scalar() or 0
            
            # Get total campaigns sent (would need campaign tracking table)
            # For now, estimate based on customer tenure and loyalty tier
            customer_query = select(Profile).where(Profile.id == customer_id)
            customer_result = await self.db.execute(customer_query)
            customer = customer_result.scalar_one_or_none()
            
            if not customer:
                return 0.0
            
            # Estimate campaigns sent based on customer tenure
            customer_tenure_days = (datetime.now() - customer.created_at).days
            estimated_campaigns = max(1, customer_tenure_days // 30)  # Assume monthly campaigns
            
            # Calculate response rate
            response_rate = campaign_responses / estimated_campaigns if estimated_campaigns > 0 else 0.0
            return min(1.0, response_rate)
            
        except Exception as e:
            logger.error(f"Error getting campaign response rate: {e}")
            return 0.0
    
    async def _get_referral_activity(self, customer_id: int) -> int:
        """Get number of referrals made based on actual referral data"""
        try:
            # Get referral transactions
            referral_query = select(func.count(LoyaltyTransaction.id)).where(
                and_(
                    LoyaltyTransaction.customer_id == customer_id,
                    LoyaltyTransaction.transaction_type == 'referral_bonus'
                )
            )
            referral_result = await self.db.execute(referral_query)
            referral_count = referral_result.scalar() or 0
            
            return referral_count
        except Exception as e:
            logger.error(f"Error getting referral activity: {e}")
            return 0
    
    async def _get_service_preferences(self, customer_id: int) -> List[float]:
        """Get service preference scores based on actual usage"""
        try:
            preferences = [0.0] * 5  # 5 service categories: restaurant, spa, conference, transportation, accommodation
            
            # Get restaurant usage
            restaurant_query = select(func.count(Order.id)).where(Order.customer_id == customer_id)
            restaurant_result = await self.db.execute(restaurant_query)
            restaurant_count = restaurant_result.scalar() or 0
            
            # Get spa usage
            spa_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'spa'
                )
            )
            spa_result = await self.db.execute(spa_query)
            spa_count = spa_result.scalar() or 0
            
            # Get conference usage
            conference_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'conference'
                )
            )
            conference_result = await self.db.execute(conference_query)
            conference_count = conference_result.scalar() or 0
            
            # Get transportation usage
            transport_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'transportation'
                )
            )
            transport_result = await self.db.execute(transport_query)
            transport_count = transport_result.scalar() or 0
            
            # Get accommodation usage
            room_query = select(func.count(RoomReservation.id)).where(
                RoomReservation.customer_id == customer_id
            )
            room_result = await self.db.execute(room_query)
            room_count = room_result.scalar() or 0
            
            # Calculate total usage
            total_usage = restaurant_count + spa_count + conference_count + transport_count + room_count
            
            if total_usage > 0:
                preferences[0] = restaurant_count / total_usage  # Restaurant
                preferences[1] = spa_count / total_usage  # Spa
                preferences[2] = conference_count / total_usage  # Conference
                preferences[3] = transport_count / total_usage  # Transportation
                preferences[4] = room_count / total_usage  # Accommodation
            
            return preferences
        except Exception as e:
            logger.error(f"Error getting service preferences: {e}")
            return [0.0] * 5
    
    async def _get_seasonal_patterns(self, customer_id: int) -> List[float]:
        """Get seasonal visit patterns based on actual historical data"""
        try:
            patterns = [0.0] * 12  # 12 months
            
            # Get monthly visit counts for the past year
            for month in range(1, 13):
                # Calculate date range for this month in the past year
                current_year = datetime.now().year
                month_start = datetime(current_year - 1, month, 1)
                if month == 12:
                    month_end = datetime(current_year, 1, 1)
                else:
                    month_end = datetime(current_year - 1, month + 1, 1)
                
                # Count orders in this month
                order_query = select(func.count(Order.id)).where(
                    and_(
                        Order.customer_id == customer_id,
                        Order.created_at >= month_start,
                        Order.created_at < month_end
                    )
                )
                order_result = await self.db.execute(order_query)
                order_count = order_result.scalar() or 0
                
                # Count service bookings in this month
                booking_query = select(func.count(ServiceBooking.id)).where(
                    and_(
                        ServiceBooking.customer_id == customer_id,
                        ServiceBooking.booking_date >= month_start,
                        ServiceBooking.booking_date < month_end
                    )
                )
                booking_result = await self.db.execute(booking_query)
                booking_count = booking_result.scalar() or 0
                
                # Count room reservations in this month
                room_query = select(func.count(RoomReservation.id)).where(
                    and_(
                        RoomReservation.customer_id == customer_id,
                        RoomReservation.check_in_date >= month_start,
                        RoomReservation.check_in_date < month_end
                    )
                )
                room_result = await self.db.execute(room_query)
                room_count = room_result.scalar() or 0
                
                # Total activity for this month
                total_activity = order_count + booking_count + room_count
                patterns[month - 1] = total_activity
            
            # Normalize patterns to sum to 1.0
            total_activity = sum(patterns)
            if total_activity > 0:
                patterns = [p / total_activity for p in patterns]
            
            return patterns
        except Exception as e:
            logger.error(f"Error getting seasonal patterns: {e}")
            return [0.0] * 12
    
    async def _get_payment_behavior(self, customer_id: int) -> List[float]:
        """Get payment behavior features based on actual payment data"""
        try:
            # Get all orders for the customer
            orders_query = select(Order).where(Order.customer_id == customer_id)
            orders_result = await self.db.execute(orders_query)
            orders = orders_result.scalars().all()
            
            if not orders:
                return [0.0] * 4
            
            total_orders = len(orders)
            successful_payments = 0
            discount_usage = 0
            late_payments = 0
            payment_methods = {}
            
            for order in orders:
                # Payment success rate (assuming paid orders are successful)
                if order.status == 'completed' or order.status == 'paid':
                    successful_payments += 1
                
                # Discount usage
                if order.discount_amount and order.discount_amount > 0:
                    discount_usage += 1
                
                # Late payments (orders created but not paid within 7 days)
                if order.created_at and order.status not in ['completed', 'paid']:
                    days_since_order = (datetime.now() - order.created_at).days
                    if days_since_order > 7:
                        late_payments += 1
                
                # Payment method tracking
                if hasattr(order, 'payment_method') and order.payment_method:
                    payment_methods[order.payment_method] = payment_methods.get(order.payment_method, 0) + 1
            
            # Calculate features
            payment_success_rate = successful_payments / total_orders if total_orders > 0 else 0.0
            discount_usage_rate = discount_usage / total_orders if total_orders > 0 else 0.0
            late_payment_rate = late_payments / total_orders if total_orders > 0 else 0.0
            
            # Preferred payment method score (consistency in payment method)
            if payment_methods:
                most_used_method = max(payment_methods.values())
                payment_consistency = most_used_method / total_orders
            else:
                payment_consistency = 0.0
            
            return [
                payment_success_rate,
                discount_usage_rate,
                late_payment_rate,
                payment_consistency
            ]
        except Exception as e:
            logger.error(f"Error getting payment behavior: {e}")
            return [0.0] * 4
    
    async def train_ml_models(self, property_id: int) -> Dict[str, Any]:
        """Train all ML models with customer data"""
        try:
            logger.info("Starting ML model training for loyalty system...")
            
            # Get all customers for the property
            customers_query = select(Profile).where(Profile.property_id == property_id)
            customers_result = await self.db.execute(customers_query)
            customers = customers_result.scalars().all()
            
            if len(customers) < 10:
                logger.warning("Insufficient customer data for ML training")
                return {"status": "insufficient_data", "message": "Need at least 10 customers"}
            
            # Extract features for all customers
            customer_features = []
            customer_ids = []
            
            for customer in customers:
                features = await self._extract_customer_features(customer)
                if len(features) > 0:
                    customer_features.append(features)
                    customer_ids.append(customer.id)
            
            if len(customer_features) < 10:
                logger.warning("Insufficient feature data for ML training")
                return {"status": "insufficient_features", "message": "Need at least 10 customers with features"}
            
            # Convert to numpy array
            X = np.array(customer_features)
            
            # Remove customer ID from features (first column)
            X_features = X[:, 1:]  # Remove customer ID
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X_features)
            
            # Apply PCA for dimensionality reduction
            X_pca = self.pca.fit_transform(X_scaled)
            
            training_results = {}
            
            # 1. Train Profile Segmentation Model
            try:
                self.ml_models['customer_segmentation'].fit(X_pca)
                clusters = self.ml_models['customer_segmentation'].labels_
                
                # Map clusters to customer segments
                segment_mapping = self._map_clusters_to_segments(clusters, customer_ids)
                
                training_results['customer_segmentation'] = {
                    'status': 'trained',
                    'clusters_found': len(set(clusters)),
                    'segment_mapping': segment_mapping,
                    'inertia': self.ml_models['customer_segmentation'].inertia_
                }
                self.models_trained['customer_segmentation'] = True
                
            except Exception as e:
                logger.error(f"Error training customer segmentation: {e}")
                training_results['customer_segmentation'] = {'status': 'failed', 'error': str(e)}
            
            # 2. Train Churn Prediction Model
            try:
                # Create churn labels (customers with no visits in last 60 days)
                churn_labels = []
                for customer_id in customer_ids:
                    days_since_visit = await self._get_days_since_last_visit(customer_id)
                    churn_labels.append(1 if days_since_visit > 60 else 0)
                
                y_churn = np.array(churn_labels)
                
                if len(set(y_churn)) > 1:  # Need both classes
                    X_train, X_test, y_train, y_test = train_test_split(
                        X_pca, y_churn, test_size=0.2, random_state=42, stratify=y_churn
                    )
                    
                    self.ml_models['churn_prediction'].fit(X_train, y_train)
                    y_pred = self.ml_models['churn_prediction'].predict(X_test)
                    
                    # Calculate metrics
                    accuracy = accuracy_score(y_test, y_pred)
                    precision = precision_score(y_test, y_pred, zero_division=0)
                    recall = recall_score(y_test, y_pred, zero_division=0)
                    f1 = f1_score(y_test, y_pred, zero_division=0)
                    
                    training_results['churn_prediction'] = {
                        'status': 'trained',
                        'accuracy': accuracy,
                        'precision': precision,
                        'recall': recall,
                        'f1_score': f1,
                        'feature_importance': self.ml_models['churn_prediction'].feature_importances_.tolist()
                    }
                    self.models_trained['churn_prediction'] = True
                else:
                    training_results['churn_prediction'] = {
                        'status': 'insufficient_data',
                        'message': 'Need both churn and non-churn customers'
                    }
                    
            except Exception as e:
                logger.error(f"Error training churn prediction: {e}")
                training_results['churn_prediction'] = {'status': 'failed', 'error': str(e)}
            
            # 3. Train Lifetime Value Model
            try:
                # Create lifetime value labels
                ltv_labels = []
                for customer_id in customer_ids:
                    total_spending = await self._get_total_spending(customer_id)
                    visit_frequency = await self._get_visit_frequency(customer_id)
                    ltv = total_spending * (1 + visit_frequency)  # Simple LTV calculation
                    ltv_labels.append(ltv)
                
                y_ltv = np.array(ltv_labels)
                
                X_train, X_test, y_train, y_test = train_test_split(
                    X_pca, y_ltv, test_size=0.2, random_state=42
                )
                
                self.ml_models['lifetime_value'].fit(X_train, y_train)
                y_pred = self.ml_models['lifetime_value'].predict(X_test)
                
                # Calculate R² score
                r2_score = self.ml_models['lifetime_value'].score(X_test, y_test)
                
                training_results['lifetime_value'] = {
                    'status': 'trained',
                    'r2_score': r2_score,
                    'feature_importance': self.ml_models['lifetime_value'].feature_importances_.tolist()
                }
                self.models_trained['lifetime_value'] = True
                
            except Exception as e:
                logger.error(f"Error training lifetime value model: {e}")
                training_results['lifetime_value'] = {'status': 'failed', 'error': str(e)}
            
            logger.info("ML model training completed")
            return {
                'status': 'completed',
                'models_trained': sum(self.models_trained.values()),
                'total_models': len(self.models_trained),
                'training_results': training_results
            }
            
        except Exception as e:
            logger.error(f"Error training ML models: {e}")
            return {'status': 'failed', 'error': str(e)}
    
    def _map_clusters_to_segments(self, clusters: np.ndarray, customer_ids: List[int]) -> Dict[int, str]:
        """Map K-means clusters to customer segments"""
        cluster_segments = {}
        
        # Analyze cluster characteristics to assign segments
        for cluster_id in set(clusters):
            cluster_customers = [customer_ids[i] for i, c in enumerate(clusters) if c == cluster_id]
            
            # Simple heuristic mapping (would be more sophisticated in production)
            if len(cluster_customers) < 5:
                segment = "VIP"
            elif len(cluster_customers) < 20:
                segment = "HIGH_VALUE"
            elif len(cluster_customers) < 50:
                segment = "FREQUENT"
            else:
                segment = "BUDGET"
            
            cluster_segments[cluster_id] = segment
        
        return cluster_segments
    
    async def predict_customer_churn(self, customer_id: int) -> Dict[str, Any]:
        """Predict customer churn probability using ML"""
        try:
            if not self.models_trained['churn_prediction']:
                return {"error": "Churn prediction model not trained"}
            
            # Get customer features
            customer_query = select(Profile).where(Profile.id == customer_id)
            customer_result = await self.db.execute(customer_query)
            customer = customer_result.scalar_one_or_none()
            
            if not customer:
                return {"error": "Profile not found"}
            
            features = await self._extract_customer_features(customer)
            if len(features) == 0:
                return {"error": "Could not extract customer features"}
            
            # Prepare features (remove customer ID and scale)
            X = features[1:].reshape(1, -1)  # Remove customer ID
            X_scaled = self.scaler.transform(X)
            X_pca = self.pca.transform(X_scaled)
            
            # Predict churn probability
            churn_probability = self.ml_models['churn_prediction'].predict_proba(X_pca)[0][1]
            
            # Determine risk level
            if churn_probability > 0.7:
                risk_level = "high"
            elif churn_probability > 0.4:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            # Get recommended actions
            recommended_actions = self._get_churn_prevention_actions(churn_probability)
            
            return {
                "customer_id": customer_id,
                "churn_probability": float(churn_probability),
                "risk_level": risk_level,
                "recommended_actions": recommended_actions,
                "model_confidence": "high" if churn_probability > 0.8 or churn_probability < 0.2 else "medium"
            }
            
        except Exception as e:
            logger.error(f"Error predicting customer churn: {e}")
            return {"error": str(e)}
    
    async def predict_customer_lifetime_value(self, customer_id: int) -> Dict[str, Any]:
        """Predict customer lifetime value using ML"""
        try:
            if not self.models_trained['lifetime_value']:
                return {"error": "Lifetime value model not trained"}
            
            # Get customer features
            customer_query = select(Profile).where(Profile.id == customer_id)
            customer_result = await self.db.execute(customer_query)
            customer = customer_result.scalar_one_or_none()
            
            if not customer:
                return {"error": "Profile not found"}
            
            features = await self._extract_customer_features(customer)
            if len(features) == 0:
                return {"error": "Could not extract customer features"}
            
            # Prepare features (remove customer ID and scale)
            X = features[1:].reshape(1, -1)  # Remove customer ID
            X_scaled = self.scaler.transform(X)
            X_pca = self.pca.transform(X_scaled)
            
            # Predict lifetime value
            predicted_ltv = self.ml_models['lifetime_value'].predict(X_pca)[0]
            
            # Get current LTV for comparison
            current_ltv = await self._get_total_spending(customer_id)
            
            return {
                "customer_id": customer_id,
                "predicted_lifetime_value": float(predicted_ltv),
                "current_lifetime_value": float(current_ltv),
                "growth_potential": float(predicted_ltv - current_ltv),
                "growth_percentage": float((predicted_ltv - current_ltv) / current_ltv * 100) if current_ltv > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"Error predicting customer lifetime value: {e}")
            return {"error": str(e)}
    
    def _get_churn_prevention_actions(self, churn_probability: float) -> List[str]:
        """Get recommended actions based on churn probability"""
        actions = []
        
        if churn_probability > 0.7:
            actions.extend([
                "Send personalized retention offer",
                "Schedule follow-up call",
                "Provide exclusive VIP benefits",
                "Offer loyalty point bonus"
            ])
        elif churn_probability > 0.4:
            actions.extend([
                "Send targeted promotional campaign",
                "Invite to special event",
                "Offer service upgrade",
                "Provide personalized recommendations"
            ])
        else:
            actions.extend([
                "Continue regular engagement",
                "Monitor for changes in behavior",
                "Maintain current service quality"
            ])
        
        return actions
    
    async def _get_recent_spending_trend(self, customer_id: int) -> float:
        """Calculate recent spending trend (0-1)"""
        try:
            # Get spending in last 30 days vs previous 30 days
            now = datetime.now()
            recent_start = now - timedelta(days=30)
            previous_start = now - timedelta(days=60)
            
            # Recent spending
            recent_query = select(func.sum(Order.total_amount)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= recent_start,
                    Order.created_at < now
                )
            )
            recent_result = await self.db.execute(recent_query)
            recent_spending = recent_result.scalar() or 0
            
            # Previous spending
            previous_query = select(func.sum(Order.total_amount)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= previous_start,
                    Order.created_at < recent_start
                )
            )
            previous_result = await self.db.execute(previous_query)
            previous_spending = previous_result.scalar() or 0
            
            if previous_spending == 0:
                return 1.0 if recent_spending > 0 else 0.0
            
            # Calculate trend (positive = growing, negative = declining)
            trend = (recent_spending - previous_spending) / previous_spending
            return max(0.0, min(1.0, (trend + 1) / 2))  # Normalize to 0-1
            
        except Exception as e:
            logger.error(f"Error calculating spending trend: {e}")
            return 0.5
    
    async def _get_service_diversity_score(self, customer_id: int) -> float:
        """Calculate service diversity score (0-1)"""
        try:
            # Count unique service categories used
            service_categories = set()
            
            # Get restaurant orders
            restaurant_query = select(func.count(Order.id)).where(Order.customer_id == customer_id)
            restaurant_result = await self.db.execute(restaurant_query)
            if restaurant_result.scalar() > 0:
                service_categories.add('restaurant')
            
            # Get spa bookings
            spa_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'spa'
                )
            )
            spa_result = await self.db.execute(spa_query)
            if spa_result.scalar() > 0:
                service_categories.add('spa')
            
            # Get conference bookings
            conference_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'conference'
                )
            )
            conference_result = await self.db.execute(conference_query)
            if conference_result.scalar() > 0:
                service_categories.add('conference')
            
            # Get transportation bookings
            transport_query = select(func.count(ServiceBooking.id)).where(
                and_(
                    ServiceBooking.customer_id == customer_id,
                    ServiceBooking.service_type == 'transportation'
                )
            )
            transport_result = await self.db.execute(transport_query)
            if transport_result.scalar() > 0:
                service_categories.add('transportation')
            
            # Get room reservations
            room_query = select(func.count(RoomReservation.id)).where(
                RoomReservation.customer_id == customer_id
            )
            room_result = await self.db.execute(room_query)
            if room_result.scalar() > 0:
                service_categories.add('accommodation')
            
            # Score based on diversity (max 5 categories)
            diversity_score = len(service_categories) / 5.0
            return min(1.0, diversity_score)
            
        except Exception as e:
            logger.error(f"Error calculating service diversity: {e}")
            return 0.0
    
    async def _get_engagement_trend(self, customer_id: int) -> float:
        """Calculate engagement trend (0-1)"""
        try:
            # Get recent activity frequency
            now = datetime.now()
            recent_30_days = now - timedelta(days=30)
            previous_30_days = now - timedelta(days=60)
            
            # Recent activity count
            recent_query = select(func.count(Order.id)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= recent_30_days
                )
            )
            recent_result = await self.db.execute(recent_query)
            recent_activity = recent_result.scalar() or 0
            
            # Previous activity count
            previous_query = select(func.count(Order.id)).where(
                and_(
                    Order.customer_id == customer_id,
                    Order.created_at >= previous_30_days,
                    Order.created_at < recent_30_days
                )
            )
            previous_result = await self.db.execute(previous_query)
            previous_activity = previous_result.scalar() or 0
            
            if previous_activity == 0:
                return 1.0 if recent_activity > 0 else 0.0
            
            # Calculate engagement trend
            trend = (recent_activity - previous_activity) / previous_activity
            return max(0.0, min(1.0, (trend + 1) / 2))  # Normalize to 0-1
            
        except Exception as e:
            logger.error(f"Error calculating engagement trend: {e}")
            return 0.5
