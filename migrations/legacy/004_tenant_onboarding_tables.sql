-- =====================================================
-- Tenant Onboarding Tables Migration
-- Buffr Host Platform - Multi-Tenant Onboarding System
-- =====================================================

-- =====================================================
-- 1. TENANT PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    industry VARCHAR(100) NOT NULL,
    subdomain VARCHAR(50) UNIQUE NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    base_currency VARCHAR(3) DEFAULT 'NAD',
    website VARCHAR(200),
    tax_id VARCHAR(50),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    business_type VARCHAR(50) NOT NULL, -- 'hotel', 'restaurant', 'both'
    property_count INTEGER DEFAULT 0,
    employee_count INTEGER DEFAULT 0,
    annual_revenue DECIMAL(15,2),
    subscription_tier VARCHAR(50) DEFAULT 'essential',
    trial_end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TENANT USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- =====================================================
-- 3. ONBOARDING PROGRESS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
    step_data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TENANT BRANDING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#b8704a',
    secondary_color VARCHAR(7) DEFAULT '#d18b5c',
    accent_color VARCHAR(7) DEFAULT '#f4f1ed',
    font_family VARCHAR(100) DEFAULT 'Inter',
    custom_css TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- =====================================================
-- 5. TENANT CUSTOMIZATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_customization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    feature_flags JSONB DEFAULT '{}',
    ui_preferences JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    integration_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- =====================================================
-- 6. TENANT COMPLIANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    gdpr_compliant BOOLEAN DEFAULT FALSE,
    pci_compliant BOOLEAN DEFAULT FALSE,
    data_retention_days INTEGER DEFAULT 2555, -- 7 years
    privacy_policy_url VARCHAR(500),
    terms_of_service_url VARCHAR(500),
    cookie_policy_url VARCHAR(500),
    compliance_notes TEXT,
    last_audit_date TIMESTAMP WITH TIME ZONE,
    next_audit_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- =====================================================
-- 7. TENANT INTEGRATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_integration (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    integration_type VARCHAR(100) NOT NULL,
    integration_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    configuration JSONB DEFAULT '{}',
    credentials_encrypted TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'inactive',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TENANT ANALYTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tenant_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenant_profiles(id) ON DELETE CASCADE,
    analytics_provider VARCHAR(100),
    tracking_id VARCHAR(200),
    conversion_goals JSONB DEFAULT '[]',
    custom_events JSONB DEFAULT '[]',
    data_sharing_enabled BOOLEAN DEFAULT TRUE,
    anonymize_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- =====================================================
-- 9. ONBOARDING STEPS CONFIGURATION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id SERIAL PRIMARY KEY,
    step_name VARCHAR(100) UNIQUE NOT NULL,
    step_title VARCHAR(200) NOT NULL,
    step_description TEXT,
    step_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    step_type VARCHAR(50) NOT NULL, -- 'form', 'integration', 'configuration', 'verification'
    step_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. INDEXES FOR PERFORMANCE
-- =====================================================

-- Tenant profiles indexes
CREATE INDEX IF NOT EXISTS idx_tenant_profiles_subdomain ON tenant_profiles(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenant_profiles_contact_email ON tenant_profiles(contact_email);
CREATE INDEX IF NOT EXISTS idx_tenant_profiles_business_type ON tenant_profiles(business_type);
CREATE INDEX IF NOT EXISTS idx_tenant_profiles_active ON tenant_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_tenant_profiles_onboarding ON tenant_profiles(onboarding_completed);

-- Tenant users indexes
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_role ON tenant_users(role);
CREATE INDEX IF NOT EXISTS idx_tenant_users_active ON tenant_users(is_active);

-- Onboarding progress indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_tenant ON onboarding_progress(tenant_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user ON onboarding_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_step ON onboarding_progress(step_name);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_status ON onboarding_progress(step_status);

-- Tenant branding indexes
CREATE INDEX IF NOT EXISTS idx_tenant_branding_tenant ON tenant_branding(tenant_id);

-- Tenant customization indexes
CREATE INDEX IF NOT EXISTS idx_tenant_customization_tenant ON tenant_customization(tenant_id);

-- Tenant compliance indexes
CREATE INDEX IF NOT EXISTS idx_tenant_compliance_tenant ON tenant_compliance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_compliance_gdpr ON tenant_compliance(gdpr_compliant);
CREATE INDEX IF NOT EXISTS idx_tenant_compliance_pci ON tenant_compliance(pci_compliant);

-- Tenant integration indexes
CREATE INDEX IF NOT EXISTS idx_tenant_integration_tenant ON tenant_integration(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_integration_type ON tenant_integration(integration_type);
CREATE INDEX IF NOT EXISTS idx_tenant_integration_enabled ON tenant_integration(is_enabled);
CREATE INDEX IF NOT EXISTS idx_tenant_integration_status ON tenant_integration(sync_status);

-- Tenant analytics indexes
CREATE INDEX IF NOT EXISTS idx_tenant_analytics_tenant ON tenant_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_analytics_provider ON tenant_analytics(analytics_provider);

-- Onboarding steps indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_name ON onboarding_steps(step_name);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_order ON onboarding_steps(step_order);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_required ON onboarding_steps(is_required);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_active ON onboarding_steps(is_active);

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant_profiles (tenant-based access)
CREATE POLICY "tenant_profiles_tenant_policy" ON tenant_profiles
    FOR ALL USING (
        id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_users (tenant-based access)
CREATE POLICY "tenant_users_tenant_policy" ON tenant_users
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for onboarding_progress (tenant-based access)
CREATE POLICY "onboarding_progress_tenant_policy" ON onboarding_progress
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_branding (tenant-based access)
CREATE POLICY "tenant_branding_tenant_policy" ON tenant_branding
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_customization (tenant-based access)
CREATE POLICY "tenant_customization_tenant_policy" ON tenant_customization
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_compliance (tenant-based access)
CREATE POLICY "tenant_compliance_tenant_policy" ON tenant_compliance
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_integration (tenant-based access)
CREATE POLICY "tenant_integration_tenant_policy" ON tenant_integration
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for tenant_analytics (tenant-based access)
CREATE POLICY "tenant_analytics_tenant_policy" ON tenant_analytics
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- =====================================================
-- 12. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_tenant_profiles_updated_at 
    BEFORE UPDATE ON tenant_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at 
    BEFORE UPDATE ON tenant_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_progress_updated_at 
    BEFORE UPDATE ON onboarding_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_branding_updated_at 
    BEFORE UPDATE ON tenant_branding 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_customization_updated_at 
    BEFORE UPDATE ON tenant_customization 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_compliance_updated_at 
    BEFORE UPDATE ON tenant_compliance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_integration_updated_at 
    BEFORE UPDATE ON tenant_integration 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_analytics_updated_at 
    BEFORE UPDATE ON tenant_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_steps_updated_at 
    BEFORE UPDATE ON onboarding_steps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 13. GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON tenant_profiles TO authenticated;
GRANT ALL ON tenant_users TO authenticated;
GRANT ALL ON onboarding_progress TO authenticated;
GRANT ALL ON tenant_branding TO authenticated;
GRANT ALL ON tenant_customization TO authenticated;
GRANT ALL ON tenant_compliance TO authenticated;
GRANT ALL ON tenant_integration TO authenticated;
GRANT ALL ON tenant_analytics TO authenticated;
GRANT SELECT ON onboarding_steps TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- 14. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE tenant_profiles IS 'Main tenant profile information and business details';
COMMENT ON TABLE tenant_users IS 'Users associated with each tenant and their roles';
COMMENT ON TABLE onboarding_progress IS 'Onboarding progress tracking for each tenant';
COMMENT ON TABLE tenant_branding IS 'Custom branding and visual identity for each tenant';
COMMENT ON TABLE tenant_customization IS 'Feature flags and customization settings per tenant';
COMMENT ON TABLE tenant_compliance IS 'Compliance and regulatory information per tenant';
COMMENT ON TABLE tenant_integration IS 'Third-party integrations configured per tenant';
COMMENT ON TABLE tenant_analytics IS 'Analytics and tracking configuration per tenant';
COMMENT ON TABLE onboarding_steps IS 'Configuration for onboarding steps and flow';

-- =====================================================
-- 15. INSERT DEFAULT ONBOARDING STEPS
-- =====================================================
INSERT INTO onboarding_steps (step_name, step_title, step_description, step_order, is_required, step_type, step_config) VALUES
('company_info', 'Company Information', 'Enter your company details and business information', 1, true, 'form', '{"fields": ["company_name", "legal_name", "industry", "contact_email", "contact_phone", "website", "address"]}'),
('business_type', 'Business Type Selection', 'Choose your primary business type and services', 2, true, 'form', '{"options": ["hotel", "restaurant", "both"], "services": true}'),
('property_setup', 'Property Configuration', 'Configure your properties and room types', 3, true, 'configuration', '{"include_rooms": true, "include_services": true}'),
('payment_setup', 'Payment Configuration', 'Set up payment methods and billing information', 4, true, 'integration', '{"required": true, "gateways": ["stripe", "adumo", "realpay"]}'),
('team_invitation', 'Team Setup', 'Invite team members and set up user roles', 5, false, 'form', '{"max_users": 10, "roles": ["admin", "manager", "staff"]}'),
('integration_setup', 'Integrations', 'Connect third-party services and tools', 6, false, 'integration', '{"optional": true, "services": ["channel_manager", "pms", "crm"]}'),
('verification', 'Account Verification', 'Verify your account and complete setup', 7, true, 'verification', '{"email_verification": true, "phone_verification": true}'),
('launch', 'Launch Setup', 'Final review and launch your Buffr Host account', 8, true, 'configuration', '{"final_review": true, "go_live": true}')
ON CONFLICT (step_name) DO NOTHING;