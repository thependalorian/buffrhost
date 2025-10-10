"""
Tenant Service
Manages tenant profiles and multi-tenant operations
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from models.tenant import TenantUser, OnboardingProgress, TenantBranding, TenantCustomization, TenantCompliance
from schemas.onboarding import TenantCreationRequest, OnboardingTier
from datetime import datetime, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

class TenantService:
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def create_tenant(self, tenant_data: Dict[str, Any]) -> TenantUser:
        """Create a new tenant profile"""
        
        try:
            # Check if subdomain is available
            existing_tenant = await self.db.query(TenantUser).filter(
                TenantUser.subdomain == tenant_data["subdomain"]
            ).first()
            
            if existing_tenant:
                raise ValueError(f"Subdomain '{tenant_data['subdomain']}' is already taken")
            
            # Create tenant profile
            tenant = TenantUser(
                company_name=tenant_data["company_name"],
                legal_name=tenant_data.get("legal_name"),
                industry=tenant_data["industry"],
                subdomain=tenant_data["subdomain"],
                website=tenant_data.get("website"),
                tax_id=tenant_data.get("tax_id"),
                timezone=tenant_data.get("timezone", "UTC"),
                base_currency=tenant_data.get("base_currency", "USD"),
                tier="essential",  # Default tier
                subscription_status="trial",
                trial_ends_at=datetime.utcnow() + timedelta(days=14),
                onboarding_stage="qualification",
                is_active=False
            )
            
            self.db.add(tenant)
            await self.db.commit()
            await self.db.refresh(tenant)
            
            # Create default branding
            await self._create_default_branding(tenant.id)
            
            # Create default customization
            await self._create_default_customization(tenant.id)
            
            # Create default compliance
            await self._create_default_compliance(tenant.id)
            
            logger.info(f"Tenant created successfully: {tenant.id} - {tenant.company_name}")
            return tenant
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to create tenant: {str(e)}")
            raise ValueError(f"Tenant creation failed: {str(e)}")
    
    async def get_tenant(self, tenant_id: str) -> Optional[TenantUser]:
        """Get tenant by ID"""
        
        try:
            return await self.db.query(TenantUser).filter(
                TenantUser.id == tenant_id
            ).first()
        except Exception as e:
            logger.error(f"Failed to get tenant: {str(e)}")
            return None
    
    async def get_tenant_by_subdomain(self, subdomain: str) -> Optional[TenantUser]:
        """Get tenant by subdomain"""
        
        try:
            return await self.db.query(TenantUser).filter(
                TenantUser.subdomain == subdomain
            ).first()
        except Exception as e:
            logger.error(f"Failed to get tenant by subdomain: {str(e)}")
            return None
    
    async def update_tenant(self, tenant_id: str, update_data: Dict[str, Any]) -> Optional[TenantUser]:
        """Update tenant profile"""
        
        try:
            tenant = await self.get_tenant(tenant_id)
            if not tenant:
                return None
            
            # Update allowed fields
            allowed_fields = [
                "company_name", "legal_name", "website", "tax_id",
                "timezone", "base_currency", "brand_affiliation", "star_rating"
            ]
            
            for field, value in update_data.items():
                if field in allowed_fields and hasattr(tenant, field):
                    setattr(tenant, field, value)
            
            tenant.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(tenant)
            
            logger.info(f"Tenant updated successfully: {tenant_id}")
            return tenant
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to update tenant: {str(e)}")
            raise ValueError(f"Tenant update failed: {str(e)}")
    
    async def activate_tenant(self, tenant_id: str) -> bool:
        """Activate tenant account"""
        
        try:
            tenant = await self.get_tenant(tenant_id)
            if not tenant:
                return False
            
            tenant.is_active = True
            tenant.subscription_status = "active"
            tenant.updated_at = datetime.utcnow()
            
            await self.db.commit()
            
            logger.info(f"Tenant activated successfully: {tenant_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to activate tenant: {str(e)}")
            return False
    
    async def suspend_tenant(self, tenant_id: str, reason: str = None) -> bool:
        """Suspend tenant account"""
        
        try:
            tenant = await self.get_tenant(tenant_id)
            if not tenant:
                return False
            
            tenant.is_active = False
            tenant.subscription_status = "suspended"
            tenant.updated_at = datetime.utcnow()
            
            # Log suspension reason
            if reason:
                logger.warning(f"Tenant suspended: {tenant_id} - Reason: {reason}")
            
            await self.db.commit()
            
            logger.info(f"Tenant suspended successfully: {tenant_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to suspend tenant: {str(e)}")
            return False
    
    async def delete_tenant(self, tenant_id: str) -> bool:
        """Delete tenant account (soft delete)"""
        
        try:
            tenant = await self.get_tenant(tenant_id)
            if not tenant:
                return False
            
            # Soft delete - mark as inactive and update status
            tenant.is_active = False
            tenant.subscription_status = "cancelled"
            tenant.updated_at = datetime.utcnow()
            
            await self.db.commit()
            
            logger.info(f"Tenant deleted successfully: {tenant_id}")
            return True
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to delete tenant: {str(e)}")
            return False
    
    async def get_tenant_branding(self, tenant_id: str) -> Optional[TenantBranding]:
        """Get tenant branding configuration"""
        
        try:
            return await self.db.query(TenantBranding).filter(
                TenantBranding.tenant_id == tenant_id
            ).first()
        except Exception as e:
            logger.error(f"Failed to get tenant branding: {str(e)}")
            return None
    
    async def update_tenant_branding(self, tenant_id: str, branding_data: Dict[str, Any]) -> Optional[TenantBranding]:
        """Update tenant branding configuration"""
        
        try:
            branding = await self.get_tenant_branding(tenant_id)
            if not branding:
                # Create new branding record
                branding = TenantBranding(tenant_id=tenant_id)
                self.db.add(branding)
            
            # Update branding fields
            allowed_fields = [
                "logo_url", "primary_color", "secondary_color", "accent_color",
                "font_family", "favicon_url", "background_image_url", "hero_image_url", "custom_css"
            ]
            
            for field, value in branding_data.items():
                if field in allowed_fields and hasattr(branding, field):
                    setattr(branding, field, value)
            
            branding.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(branding)
            
            logger.info(f"Tenant branding updated successfully: {tenant_id}")
            return branding
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to update tenant branding: {str(e)}")
            return None
    
    async def get_tenant_customization(self, tenant_id: str) -> Optional[TenantCustomization]:
        """Get tenant customization configuration"""
        
        try:
            return await self.db.query(TenantCustomization).filter(
                TenantCustomization.tenant_id == tenant_id
            ).first()
        except Exception as e:
            logger.error(f"Failed to get tenant customization: {str(e)}")
            return None
    
    async def update_tenant_customization(self, tenant_id: str, customization_data: Dict[str, Any]) -> Optional[TenantCustomization]:
        """Update tenant customization configuration"""
        
        try:
            customization = await self.get_tenant_customization(tenant_id)
            if not customization:
                # Create new customization record
                customization = TenantCustomization(tenant_id=tenant_id)
                self.db.add(customization)
            
            # Update customization fields
            allowed_fields = [
                "features_enabled", "custom_fields", "dashboard_layout",
                "menu_structure", "integrations", "webhooks"
            ]
            
            for field, value in customization_data.items():
                if field in allowed_fields and hasattr(customization, field):
                    setattr(customization, field, value)
            
            customization.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(customization)
            
            logger.info(f"Tenant customization updated successfully: {tenant_id}")
            return customization
            
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Failed to update tenant customization: {str(e)}")
            return None
    
    async def validate_subdomain(self, subdomain: str) -> Dict[str, Any]:
        """Validate subdomain availability and format"""
        
        try:
            # Check format
            if not subdomain.replace('-', '').replace('_', '').isalnum():
                return {
                    "available": False,
                    "reason": "invalid_format",
                    "message": "Subdomain can only contain letters, numbers, hyphens, and underscores"
                }
            
            if len(subdomain) < 3:
                return {
                    "available": False,
                    "reason": "too_short",
                    "message": "Subdomain must be at least 3 characters long"
                }
            
            if len(subdomain) > 50:
                return {
                    "available": False,
                    "reason": "too_long",
                    "message": "Subdomain must be 50 characters or less"
                }
            
            # Check availability
            existing_tenant = await self.db.query(TenantUser).filter(
                TenantUser.subdomain == subdomain
            ).first()
            
            if existing_tenant:
                return {
                    "available": False,
                    "reason": "taken",
                    "message": "This subdomain is already taken"
                }
            
            return {
                "available": True,
                "reason": "available",
                "message": "Subdomain is available"
            }
            
        except Exception as e:
            logger.error(f"Failed to validate subdomain: {str(e)}")
            return {
                "available": False,
                "reason": "error",
                "message": "Error validating subdomain"
            }
    
    async def _create_default_branding(self, tenant_id: str):
        """Create default branding for tenant"""
        
        try:
            branding = TenantBranding(
                tenant_id=tenant_id,
                primary_color="#b8704a",
                secondary_color="#d18b5c",
                accent_color="#f4f1ed",
                font_family="Inter"
            )
            
            self.db.add(branding)
            await self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to create default branding: {str(e)}")
    
    async def _create_default_customization(self, tenant_id: str):
        """Create default customization for tenant"""
        
        try:
            customization = TenantCustomization(
                tenant_id=tenant_id,
                features_enabled={
                    "basic_analytics": True,
                    "mobile_app": True,
                    "booking_engine": True,
                    "guest_communication": True
                },
                custom_fields={},
                dashboard_layout={},
                menu_structure={},
                integrations={},
                webhooks={}
            )
            
            self.db.add(customization)
            await self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to create default customization: {str(e)}")
    
    async def _create_default_compliance(self, tenant_id: str):
        """Create default compliance for tenant"""
        
        try:
            compliance = TenantCompliance(
                tenant_id=tenant_id,
                gdpr_compliant=False,
                data_retention_days=730,
                region="global",
                compliance_standards=[],
                last_compliance_check=None,
                compliance_score=0.0
            )
            
            self.db.add(compliance)
            await self.db.commit()
            
        except Exception as e:
            logger.error(f"Failed to create default compliance: {str(e)}")
    
    async def get_tenant_stats(self, tenant_id: str) -> Dict[str, Any]:
        """Get tenant statistics and metrics"""
        
        try:
            tenant = await self.get_tenant(tenant_id)
            if not tenant:
                return {}
            
            # Get onboarding progress
            progress = await self.db.query(OnboardingProgress).filter(
                OnboardingProgress.tenant_id == tenant_id
            ).first()
            
            stats = {
                "tenant_id": tenant_id,
                "company_name": tenant.company_name,
                "tier": tenant.tier,
                "subscription_status": tenant.subscription_status,
                "is_active": tenant.is_active,
                "onboarding_stage": tenant.onboarding_stage,
                "created_at": tenant.created_at,
                "trial_ends_at": tenant.trial_ends_at,
                "onboarding_progress": progress.progress_percentage if progress else 0.0,
                "days_since_creation": (datetime.utcnow() - tenant.created_at).days,
                "trial_days_remaining": (tenant.trial_ends_at - datetime.utcnow()).days if tenant.trial_ends_at else 0
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get tenant stats: {str(e)}")
            return {}