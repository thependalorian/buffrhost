"""
FastAPI Routes for Tenant Onboarding System
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import logging

from schemas.onboarding import (
    ProspectQualificationRequest,
    TenantCreationRequest,
    PropertySetupRequest,
    OnboardingStepCompletion,
    OnboardingProgressResponse,
    QualificationResponse,
    OnboardingAPIResponse,
    OnboardingError
)
from services.onboarding.qualification_service import QualificationService
from services.onboarding.workflow_service import OnboardingWorkflowService
from services.onboarding.template_service import PropertyTemplateService
from services.tenant_service import TenantService
from database import get_db

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/onboarding", tags=["onboarding"])

@router.post("/qualify", response_model=OnboardingAPIResponse)
async def qualify_prospect(
    request: ProspectQualificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> OnboardingAPIResponse:
    """Qualify a prospect and recommend onboarding tier"""
    
    try:
        qualification_service = QualificationService(db)
        result = await qualification_service.qualify_prospect(request)
        
        # Log qualification for analytics
        background_tasks.add_task(
            _log_qualification_event,
            request.dict(),
            result.dict()
        )
        
        return OnboardingAPIResponse(
            success=True,
            message="Prospect qualified successfully",
            data=result.dict()
        )
        
    except ValueError as e:
        logger.error(f"Qualification validation error: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Qualification failed",
            errors=[OnboardingError(
                error_code="VALIDATION_ERROR",
                message=str(e),
                suggested_action="Please check your input data and try again"
            )]
        )
    except Exception as e:
        logger.error(f"Qualification failed: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Qualification failed due to server error",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later or contact support"
            )]
        )

@router.post("/initialize", response_model=OnboardingAPIResponse)
async def initialize_onboarding(
    request: TenantCreationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> OnboardingAPIResponse:
    """Initialize onboarding for a new tenant"""
    
    try:
        # Create tenant profile
        tenant_service = TenantService(db)
        tenant = await tenant_service.create_tenant(request.dict())
        
        # Initialize onboarding workflow (default to self-service for now)
        workflow_service = OnboardingWorkflowService(db)
        onboarding = await workflow_service.initialize_onboarding(
            tenant.id, 
            "self-service"  # Default tier - can be enhanced later
        )
        
        # Send welcome email
        background_tasks.add_task(
            _send_welcome_email,
            tenant.email,
            tenant.company_name,
            onboarding
        )
        
        return OnboardingAPIResponse(
            success=True,
            message="Onboarding initialized successfully",
            data={
                "tenant": {
                    "id": tenant.id,
                    "company_name": tenant.company_name,
                    "subdomain": tenant.subdomain,
                    "tier": tenant.tier
                },
                "onboarding": onboarding
            }
        )
        
    except ValueError as e:
        logger.error(f"Onboarding initialization validation error: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Onboarding initialization failed",
            errors=[OnboardingError(
                error_code="VALIDATION_ERROR",
                message=str(e),
                suggested_action="Please check your input data and try again"
            )]
        )
    except Exception as e:
        logger.error(f"Onboarding initialization failed: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Onboarding initialization failed due to server error",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later or contact support"
            )]
        )

@router.post("/setup-property", response_model=OnboardingAPIResponse)
async def setup_property(
    request: PropertySetupRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> OnboardingAPIResponse:
    """Set up property configuration for a tenant"""
    
    try:
        # Generate property template
        template_service = PropertyTemplateService(db)
        property_template = await template_service.generate_property_template(
            request.tenant_id,
            request.dict()
        )
        
        # Create property (you'll need to implement this in your property service)
        from services.hospitality_property_service import HospitalityPropertyService
        property_service = HospitalityPropertyService(db)
        property = await property_service.create_property(request.tenant_id, request.dict())
        
        # Log property setup for analytics
        background_tasks.add_task(
            _log_property_setup_event,
            request.tenant_id,
            request.dict(),
            property_template
        )
        
        return OnboardingAPIResponse(
            success=True,
            message="Property setup completed successfully",
            data={
                "property": {
                    "id": property.id,
                    "name": property.name,
                    "room_count": property.room_count
                },
                "template": property_template,
                "recommendations": property_template.get("customization_suggestions", [])
            }
        )
        
    except ValueError as e:
        logger.error(f"Property setup validation error: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Property setup failed",
            errors=[OnboardingError(
                error_code="VALIDATION_ERROR",
                message=str(e),
                suggested_action="Please check your property data and try again"
            )]
        )
    except Exception as e:
        logger.error(f"Property setup failed: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Property setup failed due to server error",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later or contact support"
            )]
        )

@router.post("/complete-step", response_model=OnboardingAPIResponse)
async def complete_onboarding_step(
    request: OnboardingStepCompletion,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> OnboardingAPIResponse:
    """Mark an onboarding step as completed"""
    
    try:
        workflow_service = OnboardingWorkflowService(db)
        result = await workflow_service.complete_step(
            request.tenant_id,
            request.step_id,
            request.step_data
        )
        
        # Log step completion for analytics
        background_tasks.add_task(
            _log_step_completion_event,
            request.tenant_id,
            request.step_id,
            result
        )
        
        # Send completion notification if onboarding is complete
        if result.get("completed", False):
            background_tasks.add_task(
                _send_completion_notification,
                request.tenant_id
            )
        
        return OnboardingAPIResponse(
            success=True,
            message="Step completed successfully",
            data=result
        )
        
    except ValueError as e:
        logger.error(f"Step completion validation error: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Step completion failed",
            errors=[OnboardingError(
                error_code="VALIDATION_ERROR",
                message=str(e),
                suggested_action="Please check your step data and try again"
            )]
        )
    except Exception as e:
        logger.error(f"Step completion failed: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Step completion failed due to server error",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later or contact support"
            )]
        )

@router.get("/progress/{tenant_id}", response_model=OnboardingProgressResponse)
async def get_onboarding_progress(
    tenant_id: str,
    db: Session = Depends(get_db)
) -> OnboardingProgressResponse:
    """Get current onboarding progress for a tenant"""
    
    try:
        workflow_service = OnboardingWorkflowService(db)
        progress = await workflow_service.get_onboarding_progress(tenant_id)
        
        if not progress:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Onboarding progress not found"
            )
        
        return progress
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get onboarding progress: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve onboarding progress"
        )

@router.get("/tiers", response_model=OnboardingAPIResponse)
async def get_onboarding_tiers() -> OnboardingAPIResponse:
    """Get available onboarding tiers and their features"""
    
    try:
        tiers_data = {
            "self-service": {
                "name": "Self-Service",
                "description": "Perfect for small properties with basic needs",
                "estimated_timeline": "1-2 days",
                "support_level": "automated",
                "features": [
                    "property-management",
                    "booking-engine",
                    "basic-analytics",
                    "guest-communication",
                    "mobile-app"
                ],
                "pricing": "included_in_subscription"
            },
            "assisted": {
                "name": "Assisted",
                "description": "Ideal for medium properties with complex requirements",
                "estimated_timeline": "3-5 days",
                "support_level": "hybrid",
                "features": [
                    "property-management",
                    "booking-engine",
                    "advanced-analytics",
                    "channel-manager",
                    "revenue-optimization",
                    "priority-support",
                    "multi-currency",
                    "api-access"
                ],
                "pricing": "premium_subscription"
            },
            "enterprise": {
                "name": "Enterprise",
                "description": "Comprehensive solution for large properties and chains",
                "estimated_timeline": "7-14 days",
                "support_level": "dedicated",
                "features": [
                    "property-management",
                    "booking-engine",
                    "advanced-analytics",
                    "multi-property",
                    "custom-integrations",
                    "dedicated-support",
                    "white-labeling",
                    "advanced-reporting",
                    "custom-branding",
                    "api-access",
                    "webhooks"
                ],
                "pricing": "custom_pricing"
            }
        }
        
        return OnboardingAPIResponse(
            success=True,
            message="Onboarding tiers retrieved successfully",
            data=tiers_data
        )
        
    except Exception as e:
        logger.error(f"Failed to get onboarding tiers: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Failed to retrieve onboarding tiers",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later"
            )]
        )

@router.get("/industries", response_model=OnboardingAPIResponse)
async def get_supported_industries() -> OnboardingAPIResponse:
    """Get supported industry types and their characteristics"""
    
    try:
        industries_data = {
            "hotel": {
                "name": "Hotel",
                "description": "Traditional hotel accommodation",
                "typical_room_count": "50-500",
                "key_features": ["room-service", "housekeeping", "front-desk"],
                "complexity": "medium"
            },
            "resort": {
                "name": "Resort",
                "description": "Full-service resort with amenities",
                "typical_room_count": "100-1000",
                "key_features": ["spa-services", "recreation", "dining", "activities"],
                "complexity": "high"
            },
            "vacation-rental": {
                "name": "Vacation Rental",
                "description": "Self-catering accommodation",
                "typical_room_count": "1-50",
                "key_features": ["self-checkin", "kitchen", "local-experiences"],
                "complexity": "low"
            },
            "hostel": {
                "name": "Hostel",
                "description": "Budget accommodation with shared facilities",
                "typical_room_count": "10-200",
                "key_features": ["dormitory-management", "shared-facilities", "group-bookings"],
                "complexity": "low"
            },
            "boutique-hotel": {
                "name": "Boutique Hotel",
                "description": "Small, stylish hotel with unique character",
                "typical_room_count": "10-100",
                "key_features": ["personalized-service", "local-experiences", "custom-amenities"],
                "complexity": "medium"
            },
            "bed-and-breakfast": {
                "name": "Bed & Breakfast",
                "description": "Small accommodation with breakfast included",
                "typical_room_count": "1-20",
                "key_features": ["breakfast-management", "host-communication", "local-recommendations"],
                "complexity": "low"
            },
            "apartment-hotel": {
                "name": "Apartment Hotel",
                "description": "Extended-stay accommodation with kitchen facilities",
                "typical_room_count": "20-200",
                "key_features": ["extended-stay", "kitchen-management", "laundry-services"],
                "complexity": "medium"
            }
        }
        
        return OnboardingAPIResponse(
            success=True,
            message="Supported industries retrieved successfully",
            data=industries_data
        )
        
    except Exception as e:
        logger.error(f"Failed to get supported industries: {str(e)}")
        return OnboardingAPIResponse(
            success=False,
            message="Failed to retrieve supported industries",
            errors=[OnboardingError(
                error_code="SERVER_ERROR",
                message="An unexpected error occurred",
                suggested_action="Please try again later"
            )]
        )

# Background task functions
async def _log_qualification_event(prospect_data: Dict[str, Any], result: Dict[str, Any]):
    """Log qualification event for analytics"""
    # Implement analytics logging
    logger.info(f"Qualification event logged: {prospect_data.get('company_name')} - {result.get('recommended_tier')}")

async def _log_property_setup_event(tenant_id: str, property_data: Dict[str, Any], template: Dict[str, Any]):
    """Log property setup event for analytics"""
    # Implement analytics logging
    logger.info(f"Property setup event logged: {tenant_id} - {property_data.get('property_name')}")

async def _log_step_completion_event(tenant_id: str, step_id: str, result: Dict[str, Any]):
    """Log step completion event for analytics"""
    # Implement analytics logging
    logger.info(f"Step completion event logged: {tenant_id} - {step_id} - {result.get('progress_percentage')}%")

async def _send_welcome_email(email: str, company_name: str, onboarding: Dict[str, Any]):
    """Send welcome email to new tenant"""
    # Implement email sending
    logger.info(f"Welcome email sent to {email} for {company_name}")

async def _send_completion_notification(tenant_id: str):
    """Send onboarding completion notification"""
    # Implement completion notification
    logger.info(f"Onboarding completion notification sent for tenant {tenant_id}")