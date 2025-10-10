"""
Customer Reactivation Service
Tenant-aware ML-powered customer reactivation and segmentation
"""

from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime, timedelta
import logging
import json
import numpy as np
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd

from models.tenant import TenantUser
from models.customer import Customer
from models.campaign import Campaign, CampaignSegment
from models.interaction import CustomerInteraction
from schemas.ai import (
    ReactivationRequest,
    ReactivationResponse,
    CustomerSegmentation,
    CampaignRequest,
    CampaignResponse,
    ReactivationAnalytics
)

logger = logging.getLogger(__name__)

class CustomerReactivationService:
    """Tenant-aware customer reactivation service with ML"""
    
    def __init__(self, db: Session, tenant_id: str):
        self.db = db
        self.tenant_id = tenant_id
        self.tenant = self._get_tenant()
        self.scaler = StandardScaler()
        self.segmentation_model = None
        self.reactivation_model = None
        self._initialize_ml_models()
    
    def _get_tenant(self) -> Optional[TenantUser]:
        """Get tenant profile"""
        return self.db.query(TenantUser).filter(
            TenantUser.id == self.tenant_id
        ).first()
    
    def _initialize_ml_models(self):
        """Initialize ML models for customer segmentation and reactivation"""
        try:
            # Initialize models
            self.segmentation_model = KMeans(n_clusters=5, random_state=42)
            self.reactivation_model = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                random_state=42
            )
            
            logger.info(f"ML models initialized for tenant {self.tenant_id}")
            
        except Exception as e:
            logger.error(f"Failed to initialize ML models: {str(e)}")
            raise
    
    async def segment_customers(self) -> CustomerSegmentation:
        """Segment customers using ML clustering"""
        try:
            # Get customer data
            customers = self._get_customer_data()
            
            if len(customers) < 10:
                return CustomerSegmentation(
                    tenant_id=self.tenant_id,
                    segments={},
                    total_customers=len(customers),
                    message="Insufficient data for segmentation"
                )
            
            # Prepare features for clustering
            features = self._prepare_customer_features(customers)
            
            # Perform clustering
            cluster_labels = self.segmentation_model.fit_predict(features)
            
            # Analyze segments
            segments = self._analyze_segments(customers, cluster_labels)
            
            # Update customer records with segments
            await self._update_customer_segments(customers, cluster_labels)
            
            return CustomerSegmentation(
                tenant_id=self.tenant_id,
                segments=segments,
                total_customers=len(customers),
                message="Customer segmentation completed successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to segment customers: {str(e)}")
            return CustomerSegmentation(
                tenant_id=self.tenant_id,
                segments={},
                total_customers=0,
                message=f"Segmentation failed: {str(e)}"
            )
    
    async def create_reactivation_campaign(
        self, 
        request: CampaignRequest
    ) -> CampaignResponse:
        """Create ML-powered reactivation campaign"""
        try:
            # Get target customers
            target_customers = self._get_target_customers(request.target_segments)
            
            if not target_customers:
                return CampaignResponse(
                    success=False,
                    message="No customers found for target segments"
                )
            
            # Predict reactivation probability
            reactivation_scores = await self._predict_reactivation_probability(target_customers)
            
            # Create campaign
            campaign = Campaign(
                tenant_id=self.tenant_id,
                name=request.name,
                description=request.description,
                target_segments=request.target_segments,
                channels=request.channels,
                message_templates=request.message_templates,
                target_customer_count=len(target_customers),
                created_at=datetime.utcnow()
            )
            
            self.db.add(campaign)
            self.db.commit()
            
            # Create campaign segments
            for segment in request.target_segments:
                campaign_segment = CampaignSegment(
                    campaign_id=campaign.id,
                    segment_name=segment,
                    customer_count=len([c for c in target_customers if c.segment == segment]),
                    created_at=datetime.utcnow()
                )
                self.db.add(campaign_segment)
            
            self.db.commit()
            
            return CampaignResponse(
                success=True,
                campaign_id=campaign.id,
                target_customers=len(target_customers),
                estimated_reactivation_rate=self._calculate_estimated_reactivation_rate(reactivation_scores),
                message="Campaign created successfully"
            )
            
        except Exception as e:
            logger.error(f"Failed to create reactivation campaign: {str(e)}")
            return CampaignResponse(
                success=False,
                message=f"Campaign creation failed: {str(e)}"
            )
    
    async def execute_campaign(self, campaign_id: str) -> Dict[str, Any]:
        """Execute reactivation campaign"""
        try:
            campaign = self.db.query(Campaign).filter(
                Campaign.id == campaign_id,
                Campaign.tenant_id == self.tenant_id
            ).first()
            
            if not campaign:
                return {"success": False, "message": "Campaign not found"}
            
            # Get target customers
            target_customers = self._get_target_customers(campaign.target_segments)
            
            # Execute campaign for each customer
            results = []
            for customer in target_customers:
                result = await self._execute_customer_campaign(customer, campaign)
                results.append(result)
            
            # Update campaign status
            campaign.status = "completed"
            campaign.completed_at = datetime.utcnow()
            self.db.commit()
            
            return {
                "success": True,
                "campaign_id": campaign_id,
                "customers_contacted": len(results),
                "successful_contacts": len([r for r in results if r["success"]]),
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Failed to execute campaign: {str(e)}")
            return {"success": False, "message": f"Campaign execution failed: {str(e)}"}
    
    def _get_customer_data(self) -> List[Customer]:
        """Get customer data for ML processing"""
        return self.db.query(Customer).filter(
            Customer.tenant_id == self.tenant_id,
            Customer.is_active == True
        ).all()
    
    def _prepare_customer_features(self, customers: List[Customer]) -> np.ndarray:
        """Prepare customer features for ML clustering"""
        features = []
        
        for customer in customers:
            # Calculate customer features
            feature_vector = [
                customer.total_spent or 0,
                customer.visit_count or 0,
                customer.last_visit_days_ago or 365,
                customer.booking_frequency or 0,
                customer.avg_booking_value or 0,
                customer.cancellation_rate or 0,
                customer.referral_count or 0,
                customer.complaint_count or 0,
                customer.loyalty_points or 0,
                customer.preferred_services_count or 0
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def _analyze_segments(self, customers: List[Customer], cluster_labels: np.ndarray) -> Dict[str, Dict[str, Any]]:
        """Analyze customer segments"""
        segments = {}
        
        for i, customer in enumerate(customers):
            segment_id = f"segment_{cluster_labels[i]}"
            
            if segment_id not in segments:
                segments[segment_id] = {
                    "name": f"Segment {cluster_labels[i]}",
                    "customer_count": 0,
                    "avg_spent": 0,
                    "avg_visits": 0,
                    "avg_last_visit": 0,
                    "characteristics": []
                }
            
            segments[segment_id]["customer_count"] += 1
            segments[segment_id]["avg_spent"] += customer.total_spent or 0
            segments[segment_id]["avg_visits"] += customer.visit_count or 0
            segments[segment_id]["avg_last_visit"] += customer.last_visit_days_ago or 365
        
        # Calculate averages
        for segment in segments.values():
            count = segment["customer_count"]
            if count > 0:
                segment["avg_spent"] /= count
                segment["avg_visits"] /= count
                segment["avg_last_visit"] /= count
        
        # Add characteristics
        for segment_id, segment in segments.items():
            if segment["avg_last_visit"] > 90:
                segment["characteristics"].append("Dormant")
            if segment["avg_spent"] > 1000:
                segment["characteristics"].append("High Value")
            if segment["avg_visits"] > 10:
                segment["characteristics"].append("Frequent")
        
        return segments
    
    async def _update_customer_segments(self, customers: List[Customer], cluster_labels: np.ndarray):
        """Update customer records with segment information"""
        for i, customer in enumerate(customers):
            customer.segment = f"segment_{cluster_labels[i]}"
            customer.updated_at = datetime.utcnow()
        
        self.db.commit()
    
    def _get_target_customers(self, target_segments: List[str]) -> List[Customer]:
        """Get customers for target segments"""
        return self.db.query(Customer).filter(
            Customer.tenant_id == self.tenant_id,
            Customer.segment.in_(target_segments),
            Customer.is_active == True
        ).all()
    
    async def _predict_reactivation_probability(self, customers: List[Customer]) -> List[float]:
        """Predict reactivation probability for customers"""
        # Prepare features for prediction
        features = self._prepare_customer_features(customers)
        
        # Scale features
        features_scaled = self.scaler.fit_transform(features)
        
        # Predict probabilities (simplified - would use trained model)
        probabilities = []
        for feature_vector in features_scaled:
            # Simple heuristic based on features
            score = 0.5  # Base probability
            
            # Adjust based on features
            if feature_vector[0] > 0:  # Has spent money
                score += 0.2
            if feature_vector[1] > 5:  # Has visited multiple times
                score += 0.2
            if feature_vector[2] < 30:  # Recent visit
                score += 0.1
            if feature_vector[6] > 0:  # Has referred others
                score += 0.1
            
            probabilities.append(min(1.0, max(0.0, score)))
        
        return probabilities
    
    def _calculate_estimated_reactivation_rate(self, reactivation_scores: List[float]) -> float:
        """Calculate estimated reactivation rate"""
        if not reactivation_scores:
            return 0.0
        
        # Weighted average based on scores
        total_score = sum(reactivation_scores)
        return total_score / len(reactivation_scores)
    
    async def _execute_customer_campaign(self, customer: Customer, campaign: Campaign) -> Dict[str, Any]:
        """Execute campaign for individual customer"""
        try:
            # Select appropriate channel and message
            channel = self._select_optimal_channel(customer, campaign.channels)
            message = self._personalize_message(customer, campaign.message_templates)
            
            # Send message (would integrate with actual communication service)
            success = await self._send_message(customer, channel, message)
            
            # Log interaction
            interaction = CustomerInteraction(
                tenant_id=self.tenant_id,
                customer_id=customer.id,
                campaign_id=campaign.id,
                channel=channel,
                message=message,
                success=success,
                created_at=datetime.utcnow()
            )
            
            self.db.add(interaction)
            self.db.commit()
            
            return {
                "customer_id": customer.id,
                "channel": channel,
                "success": success,
                "message": message
            }
            
        except Exception as e:
            logger.error(f"Failed to execute campaign for customer {customer.id}: {str(e)}")
            return {
                "customer_id": customer.id,
                "success": False,
                "error": str(e)
            }
    
    def _select_optimal_channel(self, customer: Customer, available_channels: List[str]) -> str:
        """Select optimal communication channel for customer"""
        # Simple heuristic - would use ML model
        if "email" in available_channels and customer.email:
            return "email"
        elif "sms" in available_channels and customer.phone:
            return "sms"
        elif "push" in available_channels:
            return "push"
        else:
            return available_channels[0] if available_channels else "email"
    
    def _personalize_message(self, customer: Customer, templates: Dict[str, str]) -> str:
        """Personalize message for customer"""
        # Select appropriate template
        channel = self._select_optimal_channel(customer, list(templates.keys()))
        template = templates.get(channel, templates.get("email", "Hello {name}!"))
        
        # Personalize with customer data
        personalized = template.format(
            name=customer.name or "Valued Customer",
            company=customer.company or "our business",
            last_visit=customer.last_visit_days_ago or "recently",
            loyalty_points=customer.loyalty_points or 0
        )
        
        return personalized
    
    async def _send_message(self, customer: Customer, channel: str, message: str) -> bool:
        """Send message to customer"""
        # This would integrate with actual communication service
        logger.info(f"Sending {channel} message to {customer.email}: {message}")
        return True
    
    def get_reactivation_analytics(self, days: int = 30) -> ReactivationAnalytics:
        """Get reactivation analytics for the tenant"""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get campaign data
        campaigns = self.db.query(Campaign).filter(
            Campaign.tenant_id == self.tenant_id,
            Campaign.created_at >= start_date
        ).all()
        
        # Get interaction data
        interactions = self.db.query(CustomerInteraction).filter(
            CustomerInteraction.tenant_id == self.tenant_id,
            CustomerInteraction.created_at >= start_date
        ).all()
        
        total_campaigns = len(campaigns)
        total_interactions = len(interactions)
        successful_interactions = len([i for i in interactions if i.success])
        
        return ReactivationAnalytics(
            tenant_id=self.tenant_id,
            period_days=days,
            total_campaigns=total_campaigns,
            total_interactions=total_interactions,
            successful_interactions=successful_interactions,
            success_rate=successful_interactions / total_interactions if total_interactions > 0 else 0,
            avg_reactivation_rate=self._calculate_avg_reactivation_rate(campaigns),
            channel_performance=self._get_channel_performance(interactions)
        )
    
    def _calculate_avg_reactivation_rate(self, campaigns: List[Campaign]) -> float:
        """Calculate average reactivation rate across campaigns"""
        if not campaigns:
            return 0.0
        
        # This would calculate based on actual campaign results
        return 0.15  # Placeholder
    
    def _get_channel_performance(self, interactions: List[CustomerInteraction]) -> Dict[str, Dict[str, Any]]:
        """Get performance metrics by channel"""
        channel_stats = {}
        
        for interaction in interactions:
            channel = interaction.channel
            if channel not in channel_stats:
                channel_stats[channel] = {
                    "total": 0,
                    "successful": 0,
                    "success_rate": 0.0
                }
            
            channel_stats[channel]["total"] += 1
            if interaction.success:
                channel_stats[channel]["successful"] += 1
        
        # Calculate success rates
        for channel in channel_stats:
            total = channel_stats[channel]["total"]
            successful = channel_stats[channel]["successful"]
            channel_stats[channel]["success_rate"] = successful / total if total > 0 else 0.0
        
        return channel_stats