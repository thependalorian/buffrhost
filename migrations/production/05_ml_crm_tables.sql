-- =============================================================================
-- BUFFR HOST - CRM TABLES FOR ML
-- =============================================================================
-- Creates customer relationship management tables for ML-driven customer insights
-- Includes customer profiles, preferences, and behavior tracking

-- =============================================================================
-- 1. CRM CUSTOMER TABLES
-- =============================================================================

-- CRM Customers table - Enhanced customer management with ML features
CREATE TABLE IF NOT EXISTS crm_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    buffr_id VARCHAR(100), -- Will be populated from users_extended
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
    total_spent DECIMAL(12,2) DEFAULT 0
);

-- Customer preferences table - ML-driven personalization
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    preferred_room_types TEXT[],
    preferred_amenities TEXT[],
    budget_range_min DECIMAL(8,2),
    budget_range_max DECIMAL(8,2),
    preferred_check_in_time TIME,
    dietary_restrictions TEXT[],
    accessibility_needs TEXT[],
    communication_preferences JSONB DEFAULT '{}',
    marketing_consent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer behavior tracking table - ML training data
CREATE TABLE IF NOT EXISTS customer_behavior (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    behavior_type VARCHAR(50) NOT NULL, -- 'booking', 'cancellation', 'complaint', 'review', etc.
    behavior_data JSONB NOT NULL,
    sentiment_score DECIMAL(3,2), -- -1 to 1 scale
    urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'critical')),
    channel VARCHAR(50), -- 'website', 'mobile_app', 'phone', 'email', etc.
    property_id UUID REFERENCES properties(id),
    booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer segmentation table - ML-generated segments
CREATE TABLE IF NOT EXISTS customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    segment_name VARCHAR(100) NOT NULL,
    segment_confidence DECIMAL(5,4), -- 0.0000 to 1.0000
    segment_features JSONB, -- ML features used for segmentation
    segment_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, segment_name)
);

-- =============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- =============================================================================

-- CRM Customers indexes
CREATE INDEX IF NOT EXISTS idx_crm_customers_user_id ON crm_customers(user_id);
-- CREATE INDEX IF NOT EXISTS idx_crm_customers_buffr_id ON crm_customers(buffr_id); -- Will add after data population
CREATE INDEX IF NOT EXISTS idx_crm_customers_tenant_id ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers(email);
CREATE INDEX IF NOT EXISTS idx_crm_customers_kyc_status ON crm_customers(kyc_status);
CREATE INDEX IF NOT EXISTS idx_crm_customers_loyalty_tier ON crm_customers(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_crm_customers_created_at ON crm_customers(created_at);

-- Customer preferences indexes
CREATE INDEX IF NOT EXISTS idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_preferences_tenant_id ON customer_preferences(tenant_id);

-- Customer behavior indexes
CREATE INDEX IF NOT EXISTS idx_customer_behavior_customer_id ON customer_behavior(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_tenant_id ON customer_behavior(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_type ON customer_behavior(behavior_type);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_created_at ON customer_behavior(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_behavior_sentiment ON customer_behavior(sentiment_score);

-- Customer segments indexes
CREATE INDEX IF NOT EXISTS idx_customer_segments_customer_id ON customer_segments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_tenant_id ON customer_segments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_name ON customer_segments(segment_name);
CREATE INDEX IF NOT EXISTS idx_customer_segments_confidence ON customer_segments(segment_confidence);

-- =============================================================================
-- 3. ANALYTICS VIEWS
-- =============================================================================

-- Customer lifetime value view
CREATE OR REPLACE VIEW customer_lifetime_value AS
SELECT
    c.id,
    c.buffr_id,
    c.first_name,
    c.last_name,
    c.email,
    c.loyalty_tier,
    c.booking_count,
    c.total_spent,
    c.created_at as customer_since,
    EXTRACT(EPOCH FROM (NOW() - c.created_at))/86400 as customer_age_days,
    CASE
        WHEN c.booking_count > 0 THEN c.total_spent / c.booking_count
        ELSE 0
    END as avg_booking_value,
    CASE
        WHEN c.booking_count > 0 THEN EXTRACT(EPOCH FROM (NOW() - c.created_at))/86400 / c.booking_count
        ELSE NULL
    END as days_between_bookings,
    COUNT(cb.id) as total_interactions,
    AVG(cb.sentiment_score) as avg_sentiment_score,
    COUNT(CASE WHEN cb.behavior_type = 'complaint' THEN 1 END) as complaint_count
FROM crm_customers c
LEFT JOIN customer_behavior cb ON c.id = cb.customer_id
GROUP BY c.id, c.buffr_id, c.first_name, c.last_name, c.email, c.loyalty_tier,
         c.booking_count, c.total_spent, c.created_at;

-- Customer churn risk view
CREATE OR REPLACE VIEW customer_churn_risk AS
SELECT
    c.id,
    c.buffr_id,
    c.first_name || ' ' || c.last_name as full_name,
    c.email,
    c.last_login_at,
    c.booking_count,
    c.total_spent,
    EXTRACT(EPOCH FROM (NOW() - COALESCE(c.last_login_at, c.created_at)))/86400 as days_since_last_activity,
    CASE
        WHEN c.last_login_at IS NULL THEN 'never_logged_in'
        WHEN EXTRACT(EPOCH FROM (NOW() - c.last_login_at))/86400 > 90 THEN 'high_risk'
        WHEN EXTRACT(EPOCH FROM (NOW() - c.last_login_at))/86400 > 30 THEN 'medium_risk'
        ELSE 'low_risk'
    END as churn_risk_level,
    COUNT(CASE WHEN cb.behavior_type = 'cancellation' THEN 1 END) as cancellation_count,
    COUNT(CASE WHEN cb.behavior_type = 'complaint' THEN 1 END) as complaint_count,
    AVG(CASE WHEN cb.sentiment_score IS NOT NULL THEN cb.sentiment_score END) as avg_sentiment
FROM crm_customers c
LEFT JOIN customer_behavior cb ON c.id = cb.customer_id
GROUP BY c.id, c.buffr_id, c.first_name, c.last_name, c.email,
         c.last_login_at, c.booking_count, c.total_spent, c.created_at;

-- Customer segmentation summary view
CREATE OR REPLACE VIEW customer_segmentation_summary AS
SELECT
    segment_name,
    COUNT(*) as customer_count,
    AVG(segment_confidence) as avg_confidence,
    tenant_id,
    MAX(updated_at) as last_updated
FROM customer_segments
GROUP BY segment_name, tenant_id
ORDER BY customer_count DESC;

-- =============================================================================
-- 4. TRIGGERS FOR DATA INTEGRITY
-- =============================================================================

-- Function to update customer updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS trigger_update_crm_customers_updated_at ON crm_customers;
CREATE TRIGGER trigger_update_crm_customers_updated_at
    BEFORE UPDATE ON crm_customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_updated_at();

DROP TRIGGER IF EXISTS trigger_update_customer_preferences_updated_at ON customer_preferences;
CREATE TRIGGER trigger_update_customer_preferences_updated_at
    BEFORE UPDATE ON customer_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_updated_at();

-- Function to automatically update loyalty tier based on spending
CREATE OR REPLACE FUNCTION update_customer_loyalty_tier()
RETURNS TRIGGER AS $$
BEGIN
    -- Update loyalty tier based on total spent
    IF NEW.total_spent >= 50000 THEN
        NEW.loyalty_tier = 'platinum';
    ELSIF NEW.total_spent >= 25000 THEN
        NEW.loyalty_tier = 'gold';
    ELSIF NEW.total_spent >= 10000 THEN
        NEW.loyalty_tier = 'silver';
    ELSE
        NEW.loyalty_tier = 'bronze';
    END IF;

    -- Update loyalty points (1 point per NAD spent)
    NEW.loyalty_points = FLOOR(NEW.total_spent);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for loyalty tier updates
DROP TRIGGER IF EXISTS trigger_update_loyalty_tier ON crm_customers;
CREATE TRIGGER trigger_update_loyalty_tier
    BEFORE UPDATE ON crm_customers
    FOR EACH ROW
    WHEN (OLD.total_spent IS DISTINCT FROM NEW.total_spent)
    EXECUTE FUNCTION update_customer_loyalty_tier();

-- =============================================================================
-- 5. SAMPLE DATA FOR TESTING
-- =============================================================================

-- Insert sample CRM customers (only if table is empty)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM crm_customers LIMIT 1) THEN
        -- Sample customers with realistic data
        INSERT INTO crm_customers (
            tenant_id, first_name, last_name, email, phone, date_of_birth,
            kyc_status, loyalty_tier, booking_count, total_spent, last_login_at
        )
        SELECT
            t.id,
            CASE
                WHEN random() < 0.5 THEN 'John' || (random() * 1000)::int::text
                ELSE 'Jane' || (random() * 1000)::int::text
            END,
            CASE
                WHEN random() < 0.5 THEN 'Smith' || (random() * 100)::int::text
                ELSE 'Johnson' || (random() * 100)::int::text
            END,
            'customer' || (random() * 10000)::int::text || '@example.com',
            '+264' || (81 + random() * 18)::int::text || (random() * 1000000)::int::text,
            CURRENT_DATE - INTERVAL '20 years' - INTERVAL '40 years' * random(),
            CASE
                WHEN random() < 0.6 THEN 'basic'
                WHEN random() < 0.8 THEN 'enhanced'
                ELSE 'premium'
            END,
            CASE
                WHEN random() < 0.6 THEN 'bronze'
                WHEN random() < 0.8 THEN 'silver'
                WHEN random() < 0.95 THEN 'gold'
                ELSE 'platinum'
            END,
            (random() * 20)::int,
            (random() * 50000)::numeric(12,2),
            NOW() - INTERVAL '90 days' * random()
        FROM tenants t
        LIMIT 50;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not insert sample CRM customers: %', SQLERRM;
END $$;

-- Insert sample customer preferences
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM customer_preferences LIMIT 1) THEN
        INSERT INTO customer_preferences (
            customer_id, tenant_id, preferred_room_types, preferred_amenities,
            budget_range_min, budget_range_max, preferred_check_in_time,
            dietary_restrictions, accessibility_needs, marketing_consent
        )
        SELECT
            c.id,
            c.tenant_id,
            CASE
                WHEN random() < 0.5 THEN ARRAY['standard', 'deluxe']
                ELSE ARRAY['suite', 'executive']
            END,
            CASE
                WHEN random() < 0.7 THEN ARRAY['wifi', 'pool', 'gym']
                ELSE ARRAY['spa', 'restaurant', 'parking']
            END,
            500 + random() * 1000,
            1500 + random() * 3000,
            CASE
                WHEN random() < 0.5 THEN '14:00'::time
                ELSE '15:00'::time
            END,
            CASE
                WHEN random() < 0.8 THEN ARRAY[]::text[]
                ELSE ARRAY['vegetarian']
            END,
            CASE
                WHEN random() < 0.9 THEN ARRAY[]::text[]
                ELSE ARRAY['wheelchair_access']
            END,
            random() > 0.3
        FROM crm_customers c
        LIMIT 30;
    END IF;
END $$;

-- =============================================================================
-- 6. PERMISSIONS
-- =============================================================================

-- Grant permissions for analytics views
GRANT SELECT ON customer_lifetime_value TO PUBLIC;
GRANT SELECT ON customer_churn_risk TO PUBLIC;
GRANT SELECT ON customer_segmentation_summary TO PUBLIC;

-- =============================================================================
-- 7. DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE crm_customers IS 'Enhanced customer relationship management with KYC and loyalty features';
COMMENT ON TABLE customer_preferences IS 'Customer preferences for personalization and recommendations';
COMMENT ON TABLE customer_behavior IS 'Customer behavior tracking for ML model training';
COMMENT ON TABLE customer_segments IS 'ML-generated customer segments and clustering results';
COMMENT ON VIEW customer_lifetime_value IS 'Customer lifetime value analysis and insights';
COMMENT ON VIEW customer_churn_risk IS 'Customer churn risk assessment and predictions';
COMMENT ON VIEW customer_segmentation_summary IS 'Summary of customer segmentation results';

-- =============================================================================
-- CRM TABLES MIGRATION COMPLETE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'CRM tables migration completed successfully!';
    RAISE NOTICE 'Created tables: crm_customers, customer_preferences, customer_behavior, customer_segments';
    RAISE NOTICE 'Created analytics views for customer insights';
    RAISE NOTICE 'Added automated loyalty tier management';
    RAISE NOTICE 'Inserted sample data for testing';
END $$;
