"""
Onboarding Workflow Service
Manages the step-by-step onboarding process for tenants
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from models.tenant import TenantUser, OnboardingProgress
from schemas.onboarding import OnboardingTier, OnboardingStep, OnboardingProgressResponse
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)

class OnboardingWorkflowService:
    def __init__(self, db_session: Session):
        self.db = db_session
        
        # Define comprehensive onboarding steps for each tier
        self.ONBOARDING_STEPS = {
            OnboardingTier.SELF_SERVICE: self._get_self_service_steps(),
            OnboardingTier.ASSISTED: self._get_assisted_steps(),
            OnboardingTier.ENTERPRISE: self._get_enterprise_steps()
        }
    
    def _get_self_service_steps(self) -> List[Dict[str, Any]]:
        """Get onboarding steps for self-service tier"""
        return [
            {
                "id": "account-creation",
                "title": "Create Account",
                "description": "Set up your Buffr Host account and verify email",
                "estimated_minutes": 10,
                "required": True,
                "component": "AccountCreation",
                "prerequisites": [],
                "dependencies": []
            },
            {
                "id": "company-profile",
                "title": "Company User",
                "description": "Complete your company information and branding",
                "estimated_minutes": 15,
                "required": True,
                "component": "CompanyUser",
                "prerequisites": ["account-creation"],
                "dependencies": []
            },
            {
                "id": "property-basic-info",
                "title": "Property Information",
                "description": "Add basic property details and location",
                "estimated_minutes": 20,
                "required": True,
                "component": "PropertyBasicInfo",
                "prerequisites": ["company-profile"],
                "dependencies": []
            },
            {
                "id": "room-inventory-setup",
                "title": "Room Setup",
                "description": "Configure your room types and inventory",
                "estimated_minutes": 30,
                "required": True,
                "component": "RoomSetup",
                "prerequisites": ["property-basic-info"],
                "dependencies": []
            },
            {
                "id": "basic-rate-config",
                "title": "Rate Configuration",
                "description": "Set up your basic rate structure and pricing",
                "estimated_minutes": 25,
                "required": True,
                "component": "RateConfiguration",
                "prerequisites": ["room-inventory-setup"],
                "dependencies": []
            },
            {
                "id": "payment-gateway-setup",
                "title": "Payment Setup",
                "description": "Connect your payment gateway for bookings",
                "estimated_minutes": 20,
                "required": True,
                "component": "PaymentSetup",
                "prerequisites": ["basic-rate-config"],
                "dependencies": []
            },
            {
                "id": "staff-invites",
                "title": "Team Members",
                "description": "Invite your team members and set permissions",
                "estimated_minutes": 15,
                "required": False,
                "component": "StaffInvites",
                "prerequisites": ["payment-gateway-setup"],
                "dependencies": []
            },
            {
                "id": "go-live-check",
                "title": "Go Live",
                "description": "Final checks and launch your property",
                "estimated_minutes": 10,
                "required": True,
                "component": "GoLiveCheck",
                "prerequisites": ["payment-gateway-setup"],
                "dependencies": ["staff-invites"]
            }
        ]
    
    def _get_assisted_steps(self) -> List[Dict[str, Any]]:
        """Get onboarding steps for assisted tier"""
        base_steps = self._get_self_service_steps()
        
        # Add assisted-specific steps
        assisted_steps = [
            {
                "id": "onboarding-call",
                "title": "Onboarding Call",
                "description": "Schedule a call with our onboarding specialist",
                "estimated_minutes": 60,
                "required": True,
                "component": "OnboardingCall",
                "prerequisites": ["company-profile"],
                "dependencies": []
            },
            {
                "id": "advanced-configuration",
                "title": "Advanced Configuration",
                "description": "Set up advanced features and integrations",
                "estimated_minutes": 45,
                "required": True,
                "component": "AdvancedConfiguration",
                "prerequisites": ["room-inventory-setup"],
                "dependencies": ["onboarding-call"]
            },
            {
                "id": "integration-setup",
                "title": "Integration Setup",
                "description": "Configure third-party integrations",
                "estimated_minutes": 30,
                "required": False,
                "component": "IntegrationSetup",
                "prerequisites": ["advanced-configuration"],
                "dependencies": []
            }
        ]
        
        # Insert assisted steps at appropriate positions
        base_steps.insert(3, assisted_steps[0])  # onboarding-call
        base_steps.insert(6, assisted_steps[1])  # advanced-configuration
        base_steps.insert(8, assisted_steps[2])  # integration-setup
        
        return base_steps
    
    def _get_enterprise_steps(self) -> List[Dict[str, Any]]:
        """Get onboarding steps for enterprise tier"""
        base_steps = self._get_assisted_steps()
        
        # Add enterprise-specific steps
        enterprise_steps = [
            {
                "id": "enterprise-kickoff",
                "title": "Enterprise Kickoff",
                "description": "Meet with your dedicated success manager",
                "estimated_minutes": 90,
                "required": True,
                "component": "EnterpriseKickoff",
                "prerequisites": ["company-profile"],
                "dependencies": []
            },
            {
                "id": "custom-integration",
                "title": "Custom Integration",
                "description": "Set up custom integrations and APIs",
                "estimated_minutes": 120,
                "required": False,
                "component": "CustomIntegration",
                "prerequisites": ["integration-setup"],
                "dependencies": []
            },
            {
                "id": "white-label-setup",
                "title": "White Label Setup",
                "description": "Configure white-label branding and domains",
                "estimated_minutes": 60,
                "required": False,
                "component": "WhiteLabelSetup",
                "prerequisites": ["advanced-configuration"],
                "dependencies": []
            },
            {
                "id": "training-session",
                "title": "Training Session",
                "description": "Comprehensive training for your team",
                "estimated_minutes": 180,
                "required": True,
                "component": "TrainingSession",
                "prerequisites": ["go-live-check"],
                "dependencies": []
            }
        ]
        
        # Insert enterprise steps
        base_steps.insert(4, enterprise_steps[0])  # enterprise-kickoff
        base_steps.insert(10, enterprise_steps[1])  # custom-integration
        base_steps.insert(11, enterprise_steps[2])  # white-label-setup
        base_steps.append(enterprise_steps[3])  # training-session
        
        return base_steps
    
    async def initialize_onboarding(self, tenant_id: str, tier: OnboardingTier) -> Dict[str, Any]:
        """Initialize onboarding process for a new tenant"""
        
        try:
            # Get steps for the tier
            steps = self.ONBOARDING_STEPS.get(tier, self.ONBOARDING_STEPS[OnboardingTier.SELF_SERVICE])
            
            # Calculate estimated completion date
            total_minutes = sum(step["estimated_minutes"] for step in steps)
            estimated_completion = datetime.utcnow() + timedelta(days=math.ceil(total_minutes / (8 * 60)))  # 8 hours per day
            
            # Create onboarding progress tracker
            onboarding_progress = OnboardingProgress(
                tenant_id=tenant_id,
                current_step=steps[0]["id"] if steps else "completed",
                completed_steps=[],
                progress_percentage=0.0,
                estimated_completion_date=estimated_completion,
                step_data={}
            )
            
            self.db.add(onboarding_progress)
            await self.db.commit()
            
            # Generate personalized checklist
            checklist = await self._generate_checklist(tenant_id, tier, steps)
            
            # Get next steps
            next_steps = self._get_next_steps(onboarding_progress.current_step, steps)
            
            return {
                "onboarding_id": onboarding_progress.id,
                "steps": steps,
                "checklist": checklist,
                "current_step": onboarding_progress.current_step,
                "next_steps": next_steps,
                "estimated_completion": onboarding_progress.estimated_completion_date,
                "total_estimated_minutes": total_minutes
            }
            
        except Exception as e:
            logger.error(f"Failed to initialize onboarding: {str(e)}")
            await self.db.rollback()
            raise ValueError(f"Onboarding initialization failed: {str(e)}")
    
    async def complete_step(self, tenant_id: str, step_id: str, step_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mark an onboarding step as completed"""
        
        try:
            # Get onboarding progress
            progress = await self.db.query(OnboardingProgress).filter(
                OnboardingProgress.tenant_id == tenant_id
            ).first()
            
            if not progress:
                raise ValueError("Onboarding progress not found")
            
            # Validate step can be completed
            if not await self._can_complete_step(progress, step_id):
                raise ValueError(f"Step {step_id} cannot be completed at this time")
            
            # Add step to completed steps if not already there
            if step_id not in progress.completed_steps:
                progress.completed_steps.append(step_id)
            
            # Update step data
            progress.step_data[step_id] = {
                **step_data,
                "completed_at": datetime.utcnow().isoformat()
            }
            progress.last_activity_at = datetime.utcnow()
            
            # Update current step to next available step
            await self._update_current_step(progress)
            
            # Update progress percentage
            await self._update_progress_percentage(progress)
            
            # Check if onboarding is complete
            completed = progress.progress_percentage >= 100
            
            if completed:
                await self._complete_onboarding(tenant_id)
            
            await self.db.commit()
            
            # Get next steps
            steps = self.ONBOARDING_STEPS.get(OnboardingTier.SELF_SERVICE, [])  # Default to self-service
            next_steps = self._get_next_steps(progress.current_step, steps)
            
            return {
                "completed": completed,
                "progress_percentage": progress.progress_percentage,
                "current_step": progress.current_step,
                "next_steps": next_steps,
                "completed_steps": progress.completed_steps,
                "onboarding_complete": completed
            }
            
        except Exception as e:
            logger.error(f"Failed to complete step: {str(e)}")
            await self.db.rollback()
            raise ValueError(f"Step completion failed: {str(e)}")
    
    async def _can_complete_step(self, progress: OnboardingProgress, step_id: str) -> bool:
        """Check if a step can be completed based on prerequisites"""
        
        # Get all steps for the current tier (simplified - in real implementation, store tier)
        steps = self.ONBOARDING_STEPS.get(OnboardingTier.SELF_SERVICE, [])
        step_config = next((s for s in steps if s["id"] == step_id), None)
        
        if not step_config:
            return False
        
        # Check prerequisites
        for prerequisite in step_config.get("prerequisites", []):
            if prerequisite not in progress.completed_steps:
                return False
        
        return True
    
    async def _update_current_step(self, progress: OnboardingProgress):
        """Update current step to the next available step"""
        
        # Get all steps (simplified - in real implementation, store tier)
        steps = self.ONBOARDING_STEPS.get(OnboardingTier.SELF_SERVICE, [])
        
        # Find next incomplete step
        for step in steps:
            if step["id"] not in progress.completed_steps:
                progress.current_step = step["id"]
                return
        
        # If all steps are completed
        progress.current_step = "completed"
    
    async def _update_progress_percentage(self, progress: OnboardingProgress):
        """Update progress percentage based on completed steps"""
        
        # Get all steps (simplified - in real implementation, store tier)
        steps = self.ONBOARDING_STEPS.get(OnboardingTier.SELF_SERVICE, [])
        
        total_steps = len(steps)
        completed_steps = len(progress.completed_steps)
        progress.progress_percentage = (completed_steps / total_steps) * 100 if total_steps > 0 else 0
    
    async def _complete_onboarding(self, tenant_id: str):
        """Complete onboarding and activate tenant"""
        
        # Update tenant profile
        tenant = await self.db.query(TenantUser).filter(
            TenantUser.id == tenant_id
        ).first()
        
        if tenant:
            tenant.is_active = True
            tenant.onboarded_at = datetime.utcnow()
            tenant.onboarding_stage = "live"
            tenant.subscription_status = "active"
    
    async def _generate_checklist(self, tenant_id: str, tier: OnboardingTier, steps: List[Dict]) -> Dict[str, Any]:
        """Generate personalized onboarding checklist"""
        
        return {
            "tenant_id": tenant_id,
            "tier": tier,
            "total_steps": len(steps),
            "estimated_total_minutes": sum(step["estimated_minutes"] for step in steps),
            "steps": steps,
            "priority_items": [step for step in steps if step["required"]],
            "optional_items": [step for step in steps if not step["required"]],
            "completion_percentage": 0.0
        }
    
    def _get_next_steps(self, current_step: str, steps: List[Dict]) -> List[OnboardingStep]:
        """Get the next steps after current step"""
        
        current_index = next((i for i, s in enumerate(steps) if s["id"] == current_step), -1)
        
        if current_index < 0:
            return []
        
        # Return next 3 steps
        next_steps = steps[current_index + 1:current_index + 4]
        
        return [
            OnboardingStep(
                id=step["id"],
                title=step["title"],
                description=step["description"],
                estimated_minutes=step["estimated_minutes"],
                required=step["required"],
                component=step["component"],
                prerequisites=step.get("prerequisites", []),
                dependencies=step.get("dependencies", [])
            )
            for step in next_steps
        ]
    
    async def get_onboarding_progress(self, tenant_id: str) -> Optional[OnboardingProgressResponse]:
        """Get current onboarding progress for a tenant"""
        
        try:
            progress = await self.db.query(OnboardingProgress).filter(
                OnboardingProgress.tenant_id == tenant_id
            ).first()
            
            if not progress:
                return None
            
            # Get steps (simplified - in real implementation, store tier)
            steps = self.ONBOARDING_STEPS.get(OnboardingTier.SELF_SERVICE, [])
            next_steps = self._get_next_steps(progress.current_step, steps)
            
            return OnboardingProgressResponse(
                tenant_id=tenant_id,
                current_step=progress.current_step,
                completed_steps=progress.completed_steps,
                progress_percentage=progress.progress_percentage,
                next_steps=next_steps,
                estimated_completion=progress.estimated_completion_date,
                recommendations=await self._get_recommendations(progress),
                is_complete=progress.progress_percentage >= 100
            )
            
        except Exception as e:
            logger.error(f"Failed to get onboarding progress: {str(e)}")
            return None
    
    async def _get_recommendations(self, progress: OnboardingProgress) -> List[Dict[str, Any]]:
        """Get personalized recommendations based on progress"""
        
        recommendations = []
        
        # Progress-based recommendations
        if progress.progress_percentage < 25:
            recommendations.append({
                "type": "motivation",
                "title": "You're just getting started!",
                "message": "Complete your company profile to unlock more features.",
                "action": "complete_company_profile"
            })
        elif progress.progress_percentage < 50:
            recommendations.append({
                "type": "tip",
                "title": "Pro Tip",
                "message": "Set up your room types with detailed descriptions to attract more guests.",
                "action": "enhance_room_descriptions"
            })
        elif progress.progress_percentage < 75:
            recommendations.append({
                "type": "optimization",
                "title": "Almost there!",
                "message": "Configure your payment gateway to start accepting bookings.",
                "action": "setup_payments"
            })
        
        return recommendations