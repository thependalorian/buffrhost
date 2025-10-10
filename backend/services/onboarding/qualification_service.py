"""
Prospect Qualification Service
Determines appropriate onboarding tier and support level based on business characteristics
"""

from typing import Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from schemas.onboarding import (
    ProspectQualificationRequest, 
    OnboardingTier, 
    QualificationResponse
)
import logging
import math

logger = logging.getLogger(__name__)

class QualificationService:
    def __init__(self, db_session: Session):
        self.db = db_session
        
        # Industry complexity weights
        self.INDUSTRY_WEIGHTS = {
            "resort": 1.2,
            "hotel": 1.0,
            "boutique-hotel": 0.9,
            "vacation-rental": 0.8,
            "hostel": 0.7,
            "bed-and-breakfast": 0.6,
            "apartment-hotel": 0.8
        }
        
        # Service level multipliers
        self.SERVICE_LEVEL_MULTIPLIERS = {
            "luxury": 1.3,
            "premium": 1.1,
            "standard": 1.0,
            "budget": 0.8
        }
        
        # Integration complexity scores
        self.INTEGRATION_SCORES = {
            "pms": 20,
            "channel-manager": 15,
            "payment-gateway": 10,
            "review-system": 5,
            "crm": 15,
            "analytics": 10,
            "booking-engine": 8,
            "revenue-management": 25
        }
    
    async def qualify_prospect(self, prospect_data: ProspectQualificationRequest) -> QualificationResponse:
        """Qualify prospect and determine appropriate onboarding tier"""
        
        try:
            # Calculate qualification score
            qualification_score = await self._calculate_qualification_score(prospect_data)
            
            # Determine tier based on score
            tier = self._determine_tier(qualification_score)
            
            # Calculate confidence level
            confidence = self._calculate_confidence(prospect_data, qualification_score)
            
            # Get recommendations
            recommendations = self._get_recommended_features(prospect_data, tier)
            
            # Generate next steps
            next_steps = self._generate_next_steps(prospect_data, tier)
            
            return QualificationResponse(
                qualification_score=qualification_score,
                recommended_tier=tier,
                estimated_timeline=self._get_timeline_estimate(tier),
                support_level=self._get_support_level(tier),
                recommended_features=recommendations,
                confidence_level=confidence,
                next_steps=next_steps
            )
            
        except Exception as e:
            logger.error(f"Qualification failed: {str(e)}")
            raise ValueError(f"Qualification process failed: {str(e)}")
    
    async def _calculate_qualification_score(self, prospect: ProspectQualificationRequest) -> int:
        """Calculate comprehensive qualification score based on business complexity"""
        
        score = 0
        
        # 1. Property Size & Scale (0-25 points)
        room_count_score = self._calculate_room_count_score(prospect.room_count)
        score += room_count_score
        
        # 2. Industry Complexity (0-20 points)
        industry_score = self._calculate_industry_score(prospect.industry)
        score += industry_score
        
        # 3. Technical Capability (0-20 points)
        tech_score = self._calculate_tech_capability_score(prospect)
        score += tech_score
        
        # 4. Integration Requirements (0-20 points)
        integration_score = self._calculate_integration_score(prospect.required_integrations)
        score += integration_score
        
        # 5. Business Complexity (0-15 points)
        business_score = self._calculate_business_complexity_score(prospect)
        score += business_score
        
        # Ensure score is within bounds
        return min(max(score, 0), 100)
    
    def _calculate_room_count_score(self, room_count: int) -> int:
        """Calculate score based on room count"""
        if room_count >= 500:
            return 25
        elif room_count >= 200:
            return 20
        elif room_count >= 100:
            return 15
        elif room_count >= 50:
            return 10
        elif room_count >= 20:
            return 5
        else:
            return 0
    
    def _calculate_industry_score(self, industry: str) -> int:
        """Calculate score based on industry complexity"""
        base_score = 10
        multiplier = self.INDUSTRY_WEIGHTS.get(industry, 1.0)
        return int(base_score * multiplier)
    
    def _calculate_tech_capability_score(self, prospect: ProspectQualificationRequest) -> int:
        """Calculate score based on technical capability"""
        score = 0
        
        # Existing PMS indicates technical readiness
        if prospect.has_existing_pms:
            score += 10
        
        # IT team size indicates technical support capability
        if prospect.it_team_size >= 5:
            score += 10
        elif prospect.it_team_size >= 2:
            score += 7
        elif prospect.it_team_size >= 1:
            score += 3
        
        return score
    
    def _calculate_integration_score(self, integrations: List[str]) -> int:
        """Calculate score based on integration requirements"""
        if not integrations:
            return 0
        
        total_score = sum(self.INTEGRATION_SCORES.get(integration, 5) for integration in integrations)
        
        # Cap at 20 points
        return min(total_score, 20)
    
    def _calculate_business_complexity_score(self, prospect: ProspectQualificationRequest) -> int:
        """Calculate score based on business complexity factors"""
        score = 0
        
        # Multi-property management
        if prospect.multi_property:
            score += 8
        
        # Service level complexity
        service_multiplier = self.SERVICE_LEVEL_MULTIPLIERS.get(prospect.service_level, 1.0)
        score += int(5 * service_multiplier)
        
        # Target market diversity
        if len(prospect.target_market) >= 3:
            score += 5
        elif len(prospect.target_market) >= 2:
            score += 3
        
        # Annual revenue (if provided)
        if prospect.annual_revenue:
            if prospect.annual_revenue >= 10000000:  # $10M+
                score += 7
            elif prospect.annual_revenue >= 1000000:  # $1M+
                score += 5
            elif prospect.annual_revenue >= 100000:  # $100K+
                score += 3
        
        return min(score, 15)
    
    def _determine_tier(self, score: int) -> OnboardingTier:
        """Determine onboarding tier based on qualification score"""
        if score >= 80:
            return OnboardingTier.ENTERPRISE
        elif score >= 60:
            return OnboardingTier.ASSISTED
        else:
            return OnboardingTier.SELF_SERVICE
    
    def _calculate_confidence(self, prospect: ProspectQualificationRequest, score: int) -> float:
        """Calculate confidence level in the qualification"""
        confidence = 0.5  # Base confidence
        
        # Higher confidence for more complete data
        data_completeness = self._calculate_data_completeness(prospect)
        confidence += data_completeness * 0.3
        
        # Higher confidence for scores in middle ranges
        if 40 <= score <= 80:
            confidence += 0.2
        
        return min(confidence, 1.0)
    
    def _calculate_data_completeness(self, prospect: ProspectQualificationRequest) -> float:
        """Calculate how complete the prospect data is"""
        total_fields = 8
        completed_fields = 0
        
        if prospect.company_name:
            completed_fields += 1
        if prospect.industry:
            completed_fields += 1
        if prospect.room_count > 0:
            completed_fields += 1
        if prospect.property_type:
            completed_fields += 1
        if prospect.it_team_size is not None:
            completed_fields += 1
        if prospect.required_integrations:
            completed_fields += 1
        if prospect.target_market:
            completed_fields += 1
        if prospect.annual_revenue is not None:
            completed_fields += 1
        
        return completed_fields / total_fields
    
    def _get_timeline_estimate(self, tier: OnboardingTier) -> str:
        """Get estimated onboarding timeline for tier"""
        timelines = {
            OnboardingTier.SELF_SERVICE: "1-2 days",
            OnboardingTier.ASSISTED: "3-5 days", 
            OnboardingTier.ENTERPRISE: "7-14 days"
        }
        return timelines.get(tier, "3-5 days")
    
    def _get_support_level(self, tier: OnboardingTier) -> str:
        """Get support level for tier"""
        support_levels = {
            OnboardingTier.SELF_SERVICE: "automated",
            OnboardingTier.ASSISTED: "hybrid",
            OnboardingTier.ENTERPRISE: "dedicated"
        }
        return support_levels.get(tier, "automated")
    
    def _get_recommended_features(self, prospect: ProspectQualificationRequest, tier: OnboardingTier) -> List[str]:
        """Get recommended features based on prospect data and tier"""
        features = []
        
        # Base features for all tiers
        features.extend([
            "property-management",
            "booking-engine", 
            "basic-analytics",
            "guest-communication"
        ])
        
        # Tier-specific features
        if tier == OnboardingTier.ASSISTED:
            features.extend([
                "advanced-analytics",
                "multi-currency",
                "channel-manager",
                "revenue-optimization"
            ])
        
        if tier == OnboardingTier.ENTERPRISE:
            features.extend([
                "advanced-analytics",
                "multi-property",
                "custom-integrations",
                "dedicated-support",
                "custom-branding",
                "api-access",
                "white-labeling",
                "advanced-reporting"
            ])
        
        # Industry-specific features
        industry_features = self._get_industry_specific_features(prospect.industry)
        features.extend(industry_features)
        
        # Service level features
        service_features = self._get_service_level_features(prospect.service_level)
        features.extend(service_features)
        
        # Integration-based features
        if "channel-manager" in prospect.required_integrations:
            features.append("channel-management")
        if "pms" in prospect.required_integrations:
            features.append("pms-integration")
        if "payment-gateway" in prospect.required_integrations:
            features.append("payment-processing")
        
        return list(set(features))  # Remove duplicates
    
    def _get_industry_specific_features(self, industry: str) -> List[str]:
        """Get features specific to industry type"""
        industry_features = {
            "resort": ["spa-management", "activity-booking", "concierge-services"],
            "hotel": ["room-service", "housekeeping", "front-desk"],
            "vacation-rental": ["self-checkin", "guest-verification", "property-maintenance"],
            "hostel": ["dormitory-management", "shared-facilities", "group-bookings"],
            "boutique-hotel": ["personalized-service", "local-experiences", "custom-amenities"],
            "bed-and-breakfast": ["breakfast-management", "host-communication", "local-recommendations"],
            "apartment-hotel": ["extended-stay", "kitchen-management", "laundry-services"]
        }
        return industry_features.get(industry, [])
    
    def _get_service_level_features(self, service_level: str) -> List[str]:
        """Get features based on service level"""
        service_features = {
            "luxury": ["concierge-services", "spa-management", "butler-service", "luxury-amenities"],
            "premium": ["enhanced-service", "premium-amenities", "priority-support"],
            "standard": ["standard-service", "basic-amenities"],
            "budget": ["cost-optimization", "efficient-operations"]
        }
        return service_features.get(service_level, [])
    
    def _generate_next_steps(self, prospect: ProspectQualificationRequest, tier: OnboardingTier) -> List[Dict[str, Any]]:
        """Generate recommended next steps for the prospect"""
        next_steps = []
        
        # Immediate next step
        next_steps.append({
            "step": "create_account",
            "title": "Create Your Account",
            "description": "Set up your Buffr Host account to begin onboarding",
            "priority": "high",
            "estimated_minutes": 5
        })
        
        # Tier-specific next steps
        if tier == OnboardingTier.ENTERPRISE:
            next_steps.append({
                "step": "schedule_demo",
                "title": "Schedule Enterprise Demo",
                "description": "Book a personalized demo with our enterprise team",
                "priority": "high",
                "estimated_minutes": 60
            })
        
        # Industry-specific next steps
        if prospect.industry in ["resort", "hotel"] and prospect.room_count > 100:
            next_steps.append({
                "step": "revenue_consultation",
                "title": "Revenue Management Consultation",
                "description": "Speak with our revenue management experts",
                "priority": "medium",
                "estimated_minutes": 30
            })
        
        return next_steps