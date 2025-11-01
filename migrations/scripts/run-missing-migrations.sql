-- Missing Tables Migration Script
-- Run this against your Neon PostgreSQL database

-- 002_create_crm_tables.sql
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
    total_spent DECIMAL(12,2) DEFAULT 0
);

-- Create indexes for CRM customers
CREATE INDEX IF NOT EXISTS idx_crm_customers_tenant_id ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_email ON crm_customers(email);
CREATE INDEX IF NOT EXISTS idx_crm_customers_buffr_id ON crm_customers(buffr_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_loyalty_tier ON crm_customers(loyalty_tier);

-- 004_create_recommendation_tables.sql
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

-- Create indexes for guest preferences
CREATE INDEX IF NOT EXISTS idx_guest_preferences_customer_id ON guest_preferences(customer_id);
CREATE INDEX IF NOT EXISTS idx_guest_preferences_tenant_id ON guest_preferences(tenant_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to new tables
DROP TRIGGER IF EXISTS update_crm_customers_updated_at ON crm_customers;
CREATE TRIGGER update_crm_customers_updated_at 
    BEFORE UPDATE ON crm_customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_guest_preferences_updated_at ON guest_preferences;
CREATE TRIGGER update_guest_preferences_updated_at 
    BEFORE UPDATE ON guest_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verification query
SELECT 
    'crm_customers' as table_name, COUNT(*) as record_count 
FROM crm_customers
UNION ALL
SELECT 
    'guest_preferences' as table_name, COUNT(*) as record_count 
FROM guest_preferences;
