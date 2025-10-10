"""
Solution 2: Database Reactivation System
Based on Buffr Host ML Architecture

Implements:
- ML-based customer segmentation and behavior analysis
- Multi-channel automated campaigns (email, SMS, push)
- Conflict detection and rate limiting
- Performance analytics and optimization
"""

import asyncio
import logging
import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple
from collections import defaultdict

import numpy as np
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_

# ML imports
try:
    from sklearn.cluster import KMeans, DBSCAN
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
    from sklearn.linear_model import LogisticRegression
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
    ML_AVAILABLE = True
except ImportError:
    ML_AVAILABLE = False

logger = logging.getLogger(__name__)


class CustomerSegment(str, Enum):
    """Customer segments for reactivation targeting"""
    CHAMPIONS = "champions"  # High value, engaged
    LOYAL_CUSTOMERS = "loyal_customers"  # Regular buyers
    POTENTIAL_LOYALISTS = "potential_loyalists"  # Recent customers
    NEW_CUSTOMERS = "new_customers"  # First-time buyers
    AT_RISK = "at_risk"  # Declining engagement
    CANT_LOSE_THEM = "cant_lose_them"  # High value, declining
    HIBERNATING = "hibernating"  # Dormant customers
    LOST = "lost"  # Churned customers


class CampaignChannel(str, Enum):
    """Communication channels for reactivation campaigns"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    PHONE = "phone"
    SOCIAL = "social"


class CampaignStatus(str, Enum):
    """Campaign status"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class CustomerProfile(BaseModel):
    """Customer profile for reactivation analysis"""
    customer_id: str
    email: str
    name: Optional[str] = None
    company: Optional[str] = None
    segment: CustomerSegment = CustomerSegment.NEW_CUSTOMERS
    last_activity: Optional[datetime] = None
    total_spent: float = 0.0
    order_count: int = 0
    avg_order_value: float = 0.0
    days_since_last_order: int = 0
    engagement_score: float = Field(ge=0.0, le=1.0, default=0.0)
    churn_probability: float = Field(ge=0.0, le=1.0, default=0.0)
    reactivation_score: float = Field(ge=0.0, le=1.0, default=0.0)
    preferred_channel: CampaignChannel = CampaignChannel.EMAIL
    tags: List[str] = Field(default_factory=list)
    custom_fields: Dict[str, Any] = Field(default_factory=dict)


class ReactivationCampaign(BaseModel):
    """Reactivation campaign configuration"""
    campaign_id: str
    name: str
    description: str
    target_segments: List[CustomerSegment]
    channels: List[CampaignChannel]
    message_templates: Dict[CampaignChannel, str]
    schedule_time: Optional[datetime] = None
    status: CampaignStatus = CampaignStatus.DRAFT
    personalization_enabled: bool = True
    conflict_detection_enabled: bool = True
    rate_limiting_enabled: bool = True
    max_messages_per_customer: int = 3
    min_days_between_messages: int = 7
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CampaignResult(BaseModel):
    """Campaign execution result"""
    campaign_id: str
    customers_targeted: int
    messages_sent: int
    messages_delivered: int
    messages_opened: int = 0
    messages_clicked: int = 0
    responses_received: int = 0
    conversions: int = 0
    revenue_generated: float = 0.0
    execution_time: datetime = Field(default_factory=datetime.utcnow)


class ReactivationSystem:
    """
    Database Reactivation System with ML-powered customer segmentation
    
    Features:
    - ML-based customer segmentation
    - Behavior pattern analysis
    - Multi-channel campaign management
    - Conflict detection and rate limiting
    - Performance analytics
    """

    def __init__(
        self,
        db_session: AsyncSession,
        store: BaseStore,
        communication_service_url: str = None
    ):
        self.db_session = db_session
        self.store = store
        self.communication_service_url = communication_service_url
        
        # ML components
        self.segmentation_model = None
        self.churn_prediction_model = None
        self.response_prediction_model = None
        self.scaler = None
        self.is_models_trained = False
        
        # Campaign management
        self.active_campaigns: Dict[str, ReactivationCampaign] = {}
        self.campaign_results: Dict[str, CampaignResult] = {}

    async def initialize(self):
        """Initialize the reactivation system"""
        try:
            # Train ML models
            await self._train_ml_models()
            
            # Load active campaigns
            await self._load_active_campaigns()
            
            logger.info("Reactivation System initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Reactivation System: {e}")
            raise

    async def _train_ml_models(self):
        """Train ML models for customer segmentation and prediction"""
        if not ML_AVAILABLE:
            logger.warning("ML libraries not available, using rule-based segmentation")
            return

        try:
            # Collect training data
            customer_data = await self._collect_customer_data()
            
            if len(customer_data) < 10:
                logger.warning("Insufficient data for ML training")
                return

            # Prepare features
            features, labels = self._prepare_features(customer_data)
            
            if len(features) == 0:
                logger.warning("No features extracted for ML training")
                return

            # Scale features
            self.scaler = StandardScaler()
            features_scaled = self.scaler.fit_transform(features)

            # Train segmentation model (K-Means clustering)
            self.segmentation_model = KMeans(n_clusters=8, random_state=42, n_init=10)
            self.segmentation_model.fit(features_scaled)

            # Train churn prediction model
            churn_labels = [1 if customer.get('churned', False) else 0 for customer in customer_data]
            if sum(churn_labels) > 0:  # Only train if we have churned customers
                X_train, X_test, y_train, y_test = train_test_split(
                    features_scaled, churn_labels, test_size=0.2, random_state=42
                )
                
                self.churn_prediction_model = RandomForestClassifier(
                    n_estimators=100, random_state=42
                )
                self.churn_prediction_model.fit(X_train, y_train)
                
                # Evaluate model
                y_pred = self.churn_prediction_model.predict(X_test)
                accuracy = accuracy_score(y_test, y_pred)
                logger.info(f"Churn prediction model trained with accuracy: {accuracy:.3f}")

            # Train response prediction model
            response_labels = [1 if customer.get('responded_to_campaign', False) else 0 for customer in customer_data]
            if sum(response_labels) > 0:  # Only train if we have response data
                X_train, X_test, y_train, y_test = train_test_split(
                    features_scaled, response_labels, test_size=0.2, random_state=42
                )
                
                self.response_prediction_model = GradientBoostingClassifier(
                    n_estimators=100, random_state=42
                )
                self.response_prediction_model.fit(X_train, y_train)
                
                # Evaluate model
                y_pred = self.response_prediction_model.predict(X_test)
                accuracy = accuracy_score(y_test, y_pred)
                logger.info(f"Response prediction model trained with accuracy: {accuracy:.3f}")

            self.is_models_trained = True
            logger.info("ML models trained successfully")

        except Exception as e:
            logger.error(f"Error training ML models: {e}")
            self.is_models_trained = False

    async def _collect_customer_data(self) -> List[Dict[str, Any]]:
        """Collect customer data for ML training"""
        try:
            # This would query the database for customer data
            # For now, return mock data
            mock_customers = [
                {
                    'customer_id': f'customer_{i}',
                    'total_spent': np.random.uniform(100, 5000),
                    'order_count': np.random.randint(1, 50),
                    'days_since_last_order': np.random.randint(1, 365),
                    'engagement_score': np.random.uniform(0, 1),
                    'churned': np.random.choice([True, False], p=[0.2, 0.8]),
                    'responded_to_campaign': np.random.choice([True, False], p=[0.3, 0.7])
                }
                for i in range(100)
            ]
            
            return mock_customers

        except Exception as e:
            logger.error(f"Error collecting customer data: {e}")
            return []

    def _prepare_features(self, customer_data: List[Dict[str, Any]]) -> Tuple[np.ndarray, List[str]]:
        """Prepare features for ML training"""
        try:
            features = []
            labels = []

            for customer in customer_data:
                feature_vector = [
                    customer.get('total_spent', 0),
                    customer.get('order_count', 0),
                    customer.get('days_since_last_order', 0),
                    customer.get('engagement_score', 0),
                    customer.get('avg_order_value', 0),
                    customer.get('last_activity_score', 0),
                    customer.get('channel_preference_score', 0)
                ]
                
                features.append(feature_vector)
                labels.append(customer.get('segment', 'new_customers'))

            return np.array(features), labels

        except Exception as e:
            logger.error(f"Error preparing features: {e}")
            return np.array([]), []

    async def segment_customers(self) -> Dict[str, List[CustomerProfile]]:
        """
        Segment customers using ML algorithms for reactivation targeting
        
        Returns:
            Dict mapping segment names to lists of customer profiles
        """
        try:
            # Collect customer data
            customer_data = await self._collect_customer_data()
            
            if not customer_data:
                return {}

            segments = defaultdict(list)

            if self.is_models_trained and self.segmentation_model:
                # Use ML-based segmentation
                features, _ = self._prepare_features(customer_data)
                features_scaled = self.scaler.transform(features)
                cluster_labels = self.segmentation_model.predict(features_scaled)
                
                # Map clusters to customer segments
                segment_mapping = {
                    0: CustomerSegment.CHAMPIONS,
                    1: CustomerSegment.LOYAL_CUSTOMERS,
                    2: CustomerSegment.POTENTIAL_LOYALISTS,
                    3: CustomerSegment.NEW_CUSTOMERS,
                    4: CustomerSegment.AT_RISK,
                    5: CustomerSegment.CANT_LOSE_THEM,
                    6: CustomerSegment.HIBERNATING,
                    7: CustomerSegment.LOST
                }
                
                for i, customer_data_item in enumerate(customer_data):
                    cluster = cluster_labels[i]
                    segment = segment_mapping.get(cluster, CustomerSegment.NEW_CUSTOMERS)
                    
                    # Create customer profile
                    profile = CustomerProfile(
                        customer_id=customer_data_item['customer_id'],
                        email=f"customer{customer_data_item['customer_id']}@example.com",
                        segment=segment,
                        total_spent=customer_data_item.get('total_spent', 0),
                        order_count=customer_data_item.get('order_count', 0),
                        days_since_last_order=customer_data_item.get('days_since_last_order', 0),
                        engagement_score=customer_data_item.get('engagement_score', 0)
                    )
                    
                    # Predict churn probability
                    if self.churn_prediction_model:
                        feature_vector = features[i:i+1]
                        feature_vector_scaled = self.scaler.transform(feature_vector)
                        churn_prob = self.churn_prediction_model.predict_proba(feature_vector_scaled)[0][1]
                        profile.churn_probability = churn_prob
                    
                    # Calculate reactivation score
                    profile.reactivation_score = self._calculate_reactivation_score(profile)
                    
                    segments[segment.value].append(profile)
            else:
                # Use rule-based segmentation
                for customer_data_item in customer_data:
                    profile = CustomerProfile(
                        customer_id=customer_data_item['customer_id'],
                        email=f"customer{customer_data_item['customer_id']}@example.com",
                        total_spent=customer_data_item.get('total_spent', 0),
                        order_count=customer_data_item.get('order_count', 0),
                        days_since_last_order=customer_data_item.get('days_since_last_order', 0),
                        engagement_score=customer_data_item.get('engagement_score', 0)
                    )
                    
                    # Rule-based segmentation
                    segment = self._rule_based_segmentation(profile)
                    profile.segment = segment
                    profile.reactivation_score = self._calculate_reactivation_score(profile)
                    
                    segments[segment.value].append(profile)

            logger.info(f"Segmented {sum(len(profiles) for profiles in segments.values())} customers")
            return dict(segments)

        except Exception as e:
            logger.error(f"Error segmenting customers: {e}")
            return {}

    def _rule_based_segmentation(self, profile: CustomerProfile) -> CustomerSegment:
        """Rule-based customer segmentation fallback"""
        days_since_last = profile.days_since_last_order
        total_spent = profile.total_spent
        engagement = profile.engagement_score

        if days_since_last > 365:
            return CustomerSegment.LOST
        elif days_since_last > 180:
            if total_spent > 1000:
                return CustomerSegment.CANT_LOSE_THEM
            else:
                return CustomerSegment.HIBERNATING
        elif days_since_last > 90:
            return CustomerSegment.AT_RISK
        elif total_spent > 2000 and engagement > 0.8:
            return CustomerSegment.CHAMPIONS
        elif total_spent > 500 and engagement > 0.6:
            return CustomerSegment.LOYAL_CUSTOMERS
        elif days_since_last < 30:
            return CustomerSegment.NEW_CUSTOMERS
        else:
            return CustomerSegment.POTENTIAL_LOYALISTS

    def _calculate_reactivation_score(self, profile: CustomerProfile) -> float:
        """Calculate reactivation score for a customer"""
        try:
            # Factors that influence reactivation likelihood
            factors = {
                'historical_value': min(profile.total_spent / 1000, 1.0),  # Normalize to 0-1
                'engagement_history': profile.engagement_score,
                'recency': max(0, 1 - (profile.days_since_last_order / 365)),  # More recent = higher score
                'frequency': min(profile.order_count / 10, 1.0),  # Normalize to 0-1
                'churn_risk': 1 - profile.churn_probability  # Lower churn risk = higher reactivation score
            }
            
            # Weighted combination
            weights = {
                'historical_value': 0.3,
                'engagement_history': 0.25,
                'recency': 0.2,
                'frequency': 0.15,
                'churn_risk': 0.1
            }
            
            score = sum(factors[key] * weights[key] for key in factors)
            return min(max(score, 0.0), 1.0)

        except Exception as e:
            logger.error(f"Error calculating reactivation score: {e}")
            return 0.5

    async def create_campaign(self, campaign: ReactivationCampaign) -> Dict[str, Any]:
        """
        Create and launch a reactivation campaign
        
        Args:
            campaign: ReactivationCampaign configuration
            
        Returns:
            Dict containing campaign creation result
        """
        try:
            # Validate campaign
            if not campaign.target_segments:
                raise ValueError("Campaign must target at least one segment")
            
            if not campaign.channels:
                raise ValueError("Campaign must use at least one channel")

            # Get target customers
            segments = await self.segment_customers()
            target_customers = []
            
            for segment_name in campaign.target_segments:
                if segment_name.value in segments:
                    target_customers.extend(segments[segment_name.value])

            if not target_customers:
                raise ValueError("No customers found for target segments")

            # Apply conflict detection and rate limiting
            filtered_customers = await self._apply_conflict_detection(
                target_customers, campaign
            )

            # Store campaign
            self.active_campaigns[campaign.campaign_id] = campaign

            # Execute campaign
            result = await self._execute_campaign(campaign, filtered_customers)
            
            # Store result
            self.campaign_results[campaign.campaign_id] = result

            logger.info(f"Campaign {campaign.campaign_id} created and executed successfully")
            
            return {
                "campaign_id": campaign.campaign_id,
                "status": "success",
                "customers_targeted": len(filtered_customers),
                "messages_sent": result.messages_sent,
                "execution_time": result.execution_time.isoformat()
            }

        except Exception as e:
            logger.error(f"Error creating campaign: {e}")
            return {
                "campaign_id": campaign.campaign_id,
                "status": "error",
                "error": str(e)
            }

    async def _apply_conflict_detection(
        self, 
        customers: List[CustomerProfile], 
        campaign: ReactivationCampaign
    ) -> List[CustomerProfile]:
        """Apply conflict detection and rate limiting to campaign targets"""
        try:
            if not campaign.conflict_detection_enabled:
                return customers

            filtered_customers = []
            
            for customer in customers:
                # Check rate limiting
                if campaign.rate_limiting_enabled:
                    recent_messages = await self._get_recent_messages(customer.customer_id)
                    
                    if len(recent_messages) >= campaign.max_messages_per_customer:
                        continue
                    
                    # Check minimum days between messages
                    if recent_messages:
                        last_message_time = max(msg['sent_at'] for msg in recent_messages)
                        days_since_last = (datetime.utcnow() - last_message_time).days
                        
                        if days_since_last < campaign.min_days_between_messages:
                            continue

                # Check for conflicting campaigns
                conflicting_campaigns = await self._check_conflicting_campaigns(
                    customer.customer_id, campaign
                )
                
                if not conflicting_campaigns:
                    filtered_customers.append(customer)

            logger.info(f"Conflict detection filtered {len(customers)} customers to {len(filtered_customers)}")
            return filtered_customers

        except Exception as e:
            logger.error(f"Error applying conflict detection: {e}")
            return customers

    async def _get_recent_messages(self, customer_id: str) -> List[Dict[str, Any]]:
        """Get recent messages sent to a customer"""
        try:
            # This would query the communication service
            # For now, return mock data
            return []
        except Exception as e:
            logger.error(f"Error getting recent messages: {e}")
            return []

    async def _check_conflicting_campaigns(
        self, 
        customer_id: str, 
        campaign: ReactivationCampaign
    ) -> List[str]:
        """Check for conflicting campaigns targeting the same customer"""
        try:
            # This would check for active campaigns targeting the same customer
            # For now, return empty list
            return []
        except Exception as e:
            logger.error(f"Error checking conflicting campaigns: {e}")
            return []

    async def _execute_campaign(
        self, 
        campaign: ReactivationCampaign, 
        customers: List[CustomerProfile]
    ) -> CampaignResult:
        """Execute the reactivation campaign"""
        try:
            messages_sent = 0
            messages_delivered = 0
            
            for customer in customers:
                # Personalize message for each customer
                personalized_messages = await self._personalize_messages(
                    customer, campaign
                )
                
                # Send messages through each channel
                for channel in campaign.channels:
                    if channel.value in personalized_messages:
                        message_content = personalized_messages[channel.value]
                        
                        # Send message (this would integrate with communication service)
                        success = await self._send_message(
                            customer, channel, message_content
                        )
                        
                        if success:
                            messages_sent += 1
                            messages_delivered += 1

            # Create campaign result
            result = CampaignResult(
                campaign_id=campaign.campaign_id,
                customers_targeted=len(customers),
                messages_sent=messages_sent,
                messages_delivered=messages_delivered
            )

            return result

        except Exception as e:
            logger.error(f"Error executing campaign: {e}")
            return CampaignResult(
                campaign_id=campaign.campaign_id,
                customers_targeted=0,
                messages_sent=0,
                messages_delivered=0
            )

    async def _personalize_messages(
        self, 
        customer: CustomerProfile, 
        campaign: ReactivationCampaign
    ) -> Dict[str, str]:
        """Personalize campaign messages for a customer"""
        try:
            personalized_messages = {}
            
            for channel in campaign.channels:
                template = campaign.message_templates.get(channel, "")
                
                # Personalize template with customer data
                personalized_content = template.format(
                    name=customer.name or "Valued Customer",
                    company=customer.company or "your company",
                    total_spent=customer.total_spent,
                    days_since_last=customer.days_since_last_order,
                    segment=customer.segment.value.replace('_', ' ').title()
                )
                
                personalized_messages[channel.value] = personalized_content

            return personalized_messages

        except Exception as e:
            logger.error(f"Error personalizing messages: {e}")
            return {}

    async def _send_message(
        self, 
        customer: CustomerProfile, 
        channel: CampaignChannel, 
        content: str
    ) -> bool:
        """Send a message to a customer through specified channel"""
        try:
            # This would integrate with the communication service
            # For now, simulate sending
            logger.info(f"Sending {channel.value} message to {customer.email}: {content[:50]}...")
            return True

        except Exception as e:
            logger.error(f"Error sending message: {e}")
            return False

    async def get_campaign_analytics(self, campaign_id: str) -> Dict[str, Any]:
        """Get reactivation campaign performance analytics"""
        try:
            if campaign_id not in self.campaign_results:
                raise ValueError(f"Campaign {campaign_id} not found")

            result = self.campaign_results[campaign_id]
            
            analytics = {
                "campaign_id": campaign_id,
                "customers_targeted": result.customers_targeted,
                "messages_sent": result.messages_sent,
                "messages_delivered": result.messages_delivered,
                "delivery_rate": result.messages_delivered / max(result.messages_sent, 1),
                "messages_opened": result.messages_opened,
                "open_rate": result.messages_opened / max(result.messages_delivered, 1),
                "messages_clicked": result.messages_clicked,
                "click_rate": result.messages_clicked / max(result.messages_delivered, 1),
                "responses_received": result.responses_received,
                "response_rate": result.responses_received / max(result.messages_delivered, 1),
                "conversions": result.conversions,
                "conversion_rate": result.conversions / max(result.customers_targeted, 1),
                "revenue_generated": result.revenue_generated,
                "roi": result.revenue_generated / max(result.messages_sent, 1),
                "execution_time": result.execution_time.isoformat()
            }

            return analytics

        except Exception as e:
            logger.error(f"Error getting campaign analytics: {e}")
            return {}

    async def get_system_analytics(self) -> Dict[str, Any]:
        """Get system-wide reactivation analytics"""
        try:
            analytics = {
                "total_campaigns": len(self.active_campaigns),
                "total_customers_segmented": 0,
                "average_campaign_performance": {
                    "delivery_rate": 0.0,
                    "open_rate": 0.0,
                    "click_rate": 0.0,
                    "response_rate": 0.0,
                    "conversion_rate": 0.0
                },
                "segment_distribution": {},
                "channel_performance": {},
                "ml_model_performance": {
                    "segmentation_accuracy": 0.0,
                    "churn_prediction_accuracy": 0.0,
                    "response_prediction_accuracy": 0.0
                }
            }

            return analytics

        except Exception as e:
            logger.error(f"Error getting system analytics: {e}")
            return {}

    async def _load_active_campaigns(self):
        """Load active campaigns from storage"""
        try:
            # This would load campaigns from the database
            # For now, initialize empty
            self.active_campaigns = {}
            logger.info("Active campaigns loaded")

        except Exception as e:
            logger.error(f"Error loading active campaigns: {e}")
            self.active_campaigns = {}
