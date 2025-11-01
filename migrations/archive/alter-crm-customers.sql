-- ALTER crm_customers TABLE - Add Missing Columns for ML Pipeline
-- This script adds the columns needed for the recommendation engine and ML features

-- Add core ML-required columns
ALTER TABLE crm_customers
ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id),
ADD COLUMN IF NOT EXISTS buffr_id varchar(100) UNIQUE,
ADD COLUMN IF NOT EXISTS first_name varchar(100),
ADD COLUMN IF NOT EXISTS last_name varchar(100),
ADD COLUMN IF NOT EXISTS email varchar(255),
ADD COLUMN IF NOT EXISTS phone varchar(20),
ADD COLUMN IF NOT EXISTS kyc_status varchar(20) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS loyalty_tier varchar(20) DEFAULT 'bronze',
ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent decimal(12,2) DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_customers_tenant_id ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_buffr_id ON crm_customers(buffr_id);
CREATE INDEX IF NOT EXISTS idx_crm_customers_loyalty_tier ON crm_customers(loyalty_tier);

-- Migrate data from JSONB fields to new columns
UPDATE crm_customers
SET email = contact_info->>'email'
WHERE email IS NULL AND contact_info->>'email' IS NOT NULL;

UPDATE crm_customers
SET phone = contact_info->>'phone'
WHERE phone IS NULL AND contact_info->>'phone' IS NOT NULL;

UPDATE crm_customers
SET first_name = personal_info->>'firstName',
    last_name = personal_info->>'lastName'
WHERE first_name IS NULL AND personal_info->>'firstName' IS NOT NULL;

-- Set tenant_id for existing records (use the default tenant)
UPDATE crm_customers
SET tenant_id = '66ee5360-8b1a-44c4-8a93-9ec9245a1b46'::uuid
WHERE tenant_id IS NULL;

-- Generate buffr_id for existing customers (format: BUFFR-{id})
UPDATE crm_customers
SET buffr_id = 'BUFFR-' || substring(id::text from 1 for 8)
WHERE buffr_id IS NULL;

-- Verification query
SELECT
    'crm_customers' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN tenant_id IS NOT NULL THEN 1 END) as with_tenant_id,
    COUNT(CASE WHEN buffr_id IS NOT NULL THEN 1 END) as with_buffr_id,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
    COUNT(CASE WHEN loyalty_tier IS NOT NULL THEN 1 END) as with_loyalty_tier
FROM crm_customers;
