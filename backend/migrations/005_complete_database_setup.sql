-- =====================================================
-- Complete Database Setup Migration
-- Buffr Host Platform - Master Database Setup
-- =====================================================

-- =====================================================
-- 1. CREATE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 2. CREATE CUSTOM TYPES
-- =====================================================

-- User roles enum
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'super_admin',
        'admin', 
        'manager',
        'staff',
        'guest'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Property types enum
DO $$ BEGIN
    CREATE TYPE property_type_enum AS ENUM (
        'hotel',
        'resort',
        'vacation_rental',
        'guest_house',
        'restaurant',
        'cafe',
        'bar',
        'food_truck',
        'catering'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Booking status enum
DO $$ BEGIN
    CREATE TYPE booking_status_enum AS ENUM (
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
        'no_show'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Payment status enum
DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM (
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 3. CREATE CORE TABLES (if not exist)
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role_enum DEFAULT 'guest',
    tenant_id UUID,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hospitality properties table
CREATE TABLE IF NOT EXISTS hospitality_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    property_type property_type_enum NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    amenities JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE AUDIT LOGGING TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREATE NOTIFICATION TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CREATE FILE MANAGEMENT TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) UNIQUE NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. CREATE RATE LIMITING TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier VARCHAR(255) NOT NULL, -- IP address, user ID, or API key
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(identifier, endpoint, window_start)
);

-- =====================================================
-- 8. CREATE WORKFLOW MANAGEMENT TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL,
    conditions JSONB DEFAULT '{}',
    actions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    trigger_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'running',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    execution_log JSONB DEFAULT '[]'
);

-- =====================================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Tenants indexes
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX IF NOT EXISTS idx_tenants_active ON tenants(is_active);

-- Hospitality properties indexes
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_tenant ON hospitality_properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_type ON hospitality_properties(property_type);
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_city ON hospitality_properties(city);
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_country ON hospitality_properties(country);
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_active ON hospitality_properties(is_active);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Files indexes
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_files_tenant ON files(tenant_id);
CREATE INDEX IF NOT EXISTS idx_files_hash ON files(file_hash);
CREATE INDEX IF NOT EXISTS idx_files_public ON files(is_public);

-- Rate limits indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_endpoint ON rate_limits(endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_tenant ON workflows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflows_trigger ON workflows(trigger_event);
CREATE INDEX IF NOT EXISTS idx_workflows_active ON workflows(is_active);

-- Workflow executions indexes
CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started ON workflow_executions(started_at);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitality_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (tenant-based access)
CREATE POLICY "users_tenant_policy" ON users
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
        OR id = current_setting('app.current_user_id', true)::uuid
    );

-- RLS Policies for tenants (user can only access their own tenant)
CREATE POLICY "tenants_user_policy" ON tenants
    FOR ALL USING (
        id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for hospitality_properties (tenant-based access)
CREATE POLICY "hospitality_properties_tenant_policy" ON hospitality_properties
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for audit_logs (tenant-based access)
CREATE POLICY "audit_logs_tenant_policy" ON audit_logs
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for notifications (user-based access)
CREATE POLICY "notifications_user_policy" ON notifications
    FOR ALL USING (
        user_id = current_setting('app.current_user_id', true)::uuid
        OR tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for files (tenant-based access)
CREATE POLICY "files_tenant_policy" ON files
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
        OR is_public = true
    );

-- RLS Policies for workflows (tenant-based access)
CREATE POLICY "workflows_tenant_policy" ON workflows
    FOR ALL USING (
        tenant_id = current_setting('app.current_tenant_id', true)::uuid
    );

-- RLS Policies for workflow_executions (tenant-based access)
CREATE POLICY "workflow_executions_tenant_policy" ON workflow_executions
    FOR ALL USING (
        workflow_id IN (
            SELECT id FROM workflows 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- =====================================================
-- 11. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hospitality_properties_updated_at 
    BEFORE UPDATE ON hospitality_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at 
    BEFORE UPDATE ON workflows 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON tenants TO authenticated;
GRANT ALL ON hospitality_properties TO authenticated;
GRANT SELECT ON audit_logs TO authenticated;
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON files TO authenticated;
GRANT ALL ON workflows TO authenticated;
GRANT SELECT ON workflow_executions TO authenticated;
GRANT SELECT ON email_templates TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- 13. INSERT DEFAULT DATA
-- =====================================================

-- Insert default tenant
INSERT INTO tenants (id, name, subdomain, is_active) VALUES
('00000000-0000-0000-0000-000000000000', 'Buffr Host Platform', 'platform', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default super admin user
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, email_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@buffr.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QzQK2O', 'System Administrator', 'super_admin', '00000000-0000-0000-0000-000000000000', true, true)
ON CONFLICT (id) DO NOTHING;

-- Insert default email templates
INSERT INTO email_templates (name, subject, html_content, text_content, variables) VALUES
('welcome', 'Welcome to Buffr Host', '<h1>Welcome to Buffr Host!</h1><p>Thank you for joining us.</p>', 'Welcome to Buffr Host! Thank you for joining us.', '["user_name", "company_name"]'),
('booking_confirmation', 'Booking Confirmation', '<h1>Booking Confirmed</h1><p>Your booking has been confirmed.</p>', 'Booking Confirmed. Your booking has been confirmed.', '["guest_name", "property_name", "check_in", "check_out"]'),
('password_reset', 'Password Reset', '<h1>Reset Your Password</h1><p>Click the link to reset your password.</p>', 'Reset Your Password. Click the link to reset your password.', '["reset_link", "expires_at"]')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 14. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON TABLE tenants IS 'Multi-tenant organization data';
COMMENT ON TABLE hospitality_properties IS 'Hotels, restaurants, and other hospitality properties';
COMMENT ON TABLE audit_logs IS 'System audit trail for compliance and security';
COMMENT ON TABLE notifications IS 'User notifications and alerts';
COMMENT ON TABLE email_templates IS 'Email template definitions for notifications';
COMMENT ON TABLE files IS 'File storage and management system';
COMMENT ON TABLE rate_limits IS 'API rate limiting and throttling data';
COMMENT ON TABLE workflows IS 'Automated workflow definitions';
COMMENT ON TABLE workflow_executions IS 'Workflow execution history and logs';

-- =====================================================
-- 15. VERIFICATION QUERIES
-- =====================================================

-- Verify all tables were created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;