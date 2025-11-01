-- Migration: 002_create_crm_tables.sql
-- Creates comprehensive CRM system for Buffr Host
-- Unified customer management with KYC, loyalty, and ML features

-- Enhanced CRM customers table with ML-ready features
CREATE TABLE IF NOT EXISTS crm_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buffr_id VARCHAR(100) UNIQUE, -- Unified Buffr ID
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    date_of_birth DATE,
    kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'basic', 'enhanced', 'premium')),
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    kyc_expires_at TIMESTAMP WITH TIME ZONE,
    verification_method VARCHAR(50),
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    id_document_url TEXT,
    id_verified BOOLEAN DEFAULT FALSE,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_postal_code VARCHAR(20),
    employment_status VARCHAR(50),
    monthly_income DECIMAL(12,2),
    default_payment_method VARCHAR(50),
    payment_verified BOOLEAN DEFAULT FALSE,
    loyalty_tier VARCHAR(20) DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    loyalty_points INTEGER DEFAULT 0,
    preferred_currency VARCHAR(3) DEFAULT 'NAD',
    cross_project_access JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    booking_count INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,

    -- Legacy columns for backward compatibility (to be migrated)
    personal_info JSONB,
    contact_info JSONB
);

-- Guest preferences for ML recommendation engine
CREATE TABLE IF NOT EXISTS guest_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    preferred_room_types TEXT[],
    preferred_amenities TEXT[],
    budget_range_min DECIMAL(8,2),
    budget_range_max DECIMAL(8,2),
    preferred_check_in_time TIME,
    dietary_restrictions TEXT[],
    accessibility_needs TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ML recommendation logs for performance tracking
CREATE TABLE IF NOT EXISTS recommendation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    recommendation_type VARCHAR(50) NOT NULL, -- 'room', 'service', 'date'
    recommendation_data JSONB NOT NULL,
    confidence_score DECIMAL(3,2),
    user_accepted BOOLEAN,
    user_feedback_rating INTEGER CHECK (user_feedback_rating BETWEEN 1 AND 5),
    user_feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer interaction history
CREATE TABLE IF NOT EXISTS customer_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    interaction_type VARCHAR(50) NOT NULL, -- 'booking', 'inquiry', 'complaint', 'review'
    interaction_channel VARCHAR(20) DEFAULT 'website' CHECK (interaction_channel IN ('website', 'phone', 'email', 'app', 'walk_in')),
    interaction_summary TEXT,
    sentiment_score DECIMAL(3,2) CHECK (sentiment_score BETWEEN -1 AND 1),
    staff_id UUID REFERENCES staff(id),
    resolution_status VARCHAR(20) DEFAULT 'pending' CHECK (resolution_status IN ('pending', 'in_progress', 'resolved', 'escalated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty program transactions
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'bonus')),
    points_amount INTEGER NOT NULL,
    booking_id UUID REFERENCES bookings(id),
    reason TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_customers_tenant_id ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_buffr_id ON crm_customers(buffr_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_loyalty_tier ON crm_customers(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers(email);
CREATE INDEX IF NOT EXISTS idx_crm_customers_kyc_status ON crm_customers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_guest_preferences_customer_id ON guest_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_guest_preferences_tenant_id ON guest_preferences(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_customer_id ON recommendation_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_created_at ON recommendation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_customer_id ON customer_interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_interactions_created_at ON customer_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_customer_id ON loyalty_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_expires_at ON loyalty_transactions(expires_at);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_crm_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_crm_customers_updated_at BEFORE UPDATE ON crm_customers FOR EACH ROW EXECUTE FUNCTION update_crm_updated_at_column();
CREATE TRIGGER update_guest_preferences_updated_at BEFORE UPDATE ON guest_preferences FOR EACH ROW EXECUTE FUNCTION update_crm_updated_at_column();
CREATE TRIGGER update_customer_interactions_updated_at BEFORE UPDATE ON customer_interactions FOR EACH ROW EXECUTE FUNCTION update_crm_updated_at_column();

-- Loyalty tier calculation function
CREATE OR REPLACE FUNCTION calculate_loyalty_tier(total_spent DECIMAL, booking_count INTEGER, account_age_days INTEGER)
RETURNS VARCHAR(20) AS $$
BEGIN
    -- Platinum: High spender, frequent visitor, long-term customer
    IF total_spent >= 50000 OR (booking_count >= 20 AND account_age_days >= 365) THEN
        RETURN 'platinum';
    -- Gold: Good spender or frequent visitor
    ELSIF total_spent >= 25000 OR booking_count >= 10 THEN
        RETURN 'gold';
    -- Silver: Moderate activity
    ELSIF total_spent >= 10000 OR booking_count >= 5 THEN
        RETURN 'silver';
    -- Bronze: Default tier
    ELSE
        RETURN 'bronze';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comments for documentation
COMMENT ON TABLE crm_customers IS 'Unified customer management with KYC, loyalty, and ML features';
COMMENT ON TABLE guest_preferences IS 'ML-powered guest preference profiles for recommendations';
COMMENT ON TABLE recommendation_logs IS 'Tracks ML recommendation performance and user feedback';
COMMENT ON TABLE customer_interactions IS 'Complete customer interaction history for CRM insights';
COMMENT ON TABLE loyalty_transactions IS 'Loyalty program point transactions and history';
