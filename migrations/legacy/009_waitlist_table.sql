-- Migration 009: Waitlist Signups Table
-- Creates table for waitlist signups with AI personalization support
-- This enables the Buffr Host waitlist system with email integration

-- Waitlist signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    location VARCHAR(255),
    current_system VARCHAR(255),
    message TEXT,
    waitlist_position INTEGER,
    email_sent BOOLEAN DEFAULT false,
    personalized_message TEXT,
    agent_context JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_tenant ON waitlist_signups(tenant_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_position ON waitlist_signups(waitlist_position);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups(created_at);

-- RLS Policies
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Tenant isolation policy
CREATE POLICY waitlist_signups_tenant_isolation ON waitlist_signups
    USING (tenant_id = (current_setting('app.current_tenant_id', TRUE)::UUID));

-- Public read access for waitlist stats (no sensitive data)
CREATE POLICY waitlist_signups_public_read ON waitlist_signups
    FOR SELECT
    USING (true);

-- Function to calculate waitlist position
CREATE OR REPLACE FUNCTION calculate_waitlist_position()
RETURNS TRIGGER AS $$
BEGIN
    -- Set waitlist position based on current count for the tenant
    NEW.waitlist_position = (
        SELECT COALESCE(MAX(waitlist_position), 0) + 1 
        FROM waitlist_signups 
        WHERE tenant_id = NEW.tenant_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate waitlist position
CREATE TRIGGER calculate_waitlist_position_trigger
    BEFORE INSERT ON waitlist_signups
    FOR EACH ROW
    EXECUTE FUNCTION calculate_waitlist_position();

-- Function for updated_at trigger
CREATE OR REPLACE FUNCTION update_waitlist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at column
CREATE TRIGGER update_waitlist_signups_updated_at
    BEFORE UPDATE ON waitlist_signups
    FOR EACH ROW
    EXECUTE FUNCTION update_waitlist_updated_at();

-- Grant permissions to authenticated_user role
GRANT SELECT, INSERT ON waitlist_signups TO authenticated_user;

-- Comments for documentation
COMMENT ON TABLE waitlist_signups IS 'Stores waitlist signups with AI personalization data';
COMMENT ON COLUMN waitlist_signups.personalized_message IS 'AI-generated personalized email content';
COMMENT ON COLUMN waitlist_signups.agent_context IS 'Context data used by AI agent for personalization';
COMMENT ON COLUMN waitlist_signups.waitlist_position IS 'Position in waitlist queue (auto-calculated)';
