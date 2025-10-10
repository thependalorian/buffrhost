"""
Enhanced Tenant Models for Multi-Tenant Onboarding System
Integrates with existing backend structure
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, JSON, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime, timedelta
import uuid

Base = declarative_base()

class TenantProfile(Base):
    __tablename__ = "tenant_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Core Identity
    company_name = Column(String, nullable=False)
    legal_name = Column(String)
    tax_id = Column(String)
    website = Column(String)
    
    # Tier & Subscription
    tier = Column(String, default='essential')  # essential, professional, enterprise
    subscription_status = Column(String, default='trial')  # trial, active, suspended, cancelled
    trial_ends_at = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=14))
    
    # Business Context
    industry = Column(String, nullable=False)  # hotel, resort, vacation-rental, hostel, boutique-hotel
    star_rating = Column(Integer)
    brand_affiliation = Column(String)
    
    # Technical Configuration
    subdomain = Column(String, unique=True, nullable=False)
    custom_domain = Column(String)
    timezone = Column(String, default='UTC')
    base_currency = Column(String, default='USD')
    locale = Column(String, default='en-US')
    
    # Onboarding Progress
    onboarding_stage = Column(String, default='qualification')  # qualification, setup, configuration, live
    onboarding_progress = Column(JSON, default={})
    onboarding_started_at = Column(DateTime, default=datetime.utcnow)
    onboarded_at = Column(DateTime)
    
    # Branding & Customization
    branding_settings = Column(JSON, default={
        'primary_color': '#b8704a',
        'secondary_color': '#d18b5c', 
        'font_family': 'Inter'
    })
    
    # Compliance
    gdpr_compliant = Column(Boolean, default=False)
    data_retention_days = Column(Integer, default=730)
    terms_accepted = Column(Boolean, default=False)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=False)

class OnboardingProgress(Base):
    __tablename__ = "onboarding_progress"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    current_step = Column(String, nullable=False)
    completed_steps = Column(JSON, default=[])
    progress_percentage = Column(Float, default=0.0)
    last_activity_at = Column(DateTime, default=datetime.utcnow)
    estimated_completion_date = Column(DateTime)
    
    # Step-specific data
    step_data = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TenantBranding(Base):
    __tablename__ = "tenant_branding"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    
    # Visual Branding
    logo_url = Column(String)
    primary_color = Column(String, default='#b8704a')
    secondary_color = Column(String, default='#d18b5c')
    accent_color = Column(String, default='#f4f1ed')
    font_family = Column(String, default='Inter')
    
    # Brand Assets
    favicon_url = Column(String)
    background_image_url = Column(String)
    hero_image_url = Column(String)
    
    # Custom CSS
    custom_css = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TenantCustomization(Base):
    __tablename__ = "tenant_customizations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    
    # Feature Toggles
    features_enabled = Column(JSON, default={})
    custom_fields = Column(JSON, default={})
    
    # UI Customization
    dashboard_layout = Column(JSON, default={})
    menu_structure = Column(JSON, default={})
    
    # Integration Settings
    integrations = Column(JSON, default={})
    webhooks = Column(JSON, default={})
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TenantCompliance(Base):
    __tablename__ = "tenant_compliance"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    
    # GDPR Compliance
    gdpr_compliant = Column(Boolean, default=False)
    data_retention_days = Column(Integer, default=730)
    privacy_policy_url = Column(String)
    terms_of_service_url = Column(String)
    
    # Regional Compliance
    region = Column(String, default='global')
    compliance_standards = Column(JSON, default=[])
    
    # Audit Trail
    last_compliance_check = Column(DateTime)
    compliance_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TenantIntegration(Base):
    __tablename__ = "tenant_integrations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    
    # Integration Details
    integration_type = Column(String, nullable=False)  # pms, channel-manager, payment-gateway, etc.
    integration_name = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    
    # Configuration
    config = Column(JSON, default={})
    credentials = Column(JSON, default={})
    
    # Status
    is_active = Column(Boolean, default=False)
    last_sync = Column(DateTime)
    sync_status = Column(String, default='pending')
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class TenantAnalytics(Base):
    __tablename__ = "tenant_analytics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String, nullable=False)
    
    # Usage Metrics
    monthly_active_users = Column(Integer, default=0)
    api_calls_count = Column(Integer, default=0)
    storage_used_mb = Column(Float, default=0.0)
    
    # Business Metrics
    total_bookings = Column(Integer, default=0)
    total_revenue = Column(Float, default=0.0)
    average_occupancy = Column(Float, default=0.0)
    
    # Performance Metrics
    response_time_ms = Column(Float, default=0.0)
    uptime_percentage = Column(Float, default=100.0)
    
    # Date Range
    period_start = Column(DateTime)
    period_end = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)