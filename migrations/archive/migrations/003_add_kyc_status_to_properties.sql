-- Migration: Add KYC Status to Properties Table
-- Description: Add KYC verification status tracking to properties
-- Date: January 29, 2025
-- Version: 003

-- Add KYC status column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(20) DEFAULT 'not_started'
    CHECK (kyc_status IN ('not_started', 'pending_review', 'approved', 'rejected', 'requires_info'));

-- Add KYC related timestamps
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS kyc_submitted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS kyc_reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS kyc_approved_at TIMESTAMP WITH TIME ZONE;

-- Add index for KYC status queries
CREATE INDEX IF NOT EXISTS idx_properties_kyc_status ON properties(kyc_status);
CREATE INDEX IF NOT EXISTS idx_properties_kyc_submitted_at ON properties(kyc_submitted_at);

-- Update existing properties to have proper KYC status
UPDATE properties
SET kyc_status = 'not_started'
WHERE kyc_status IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN properties.kyc_status IS 'KYC verification status: not_started, pending_review, approved, rejected, requires_info';
COMMENT ON COLUMN properties.kyc_submitted_at IS 'Timestamp when KYC verification was submitted';
COMMENT ON COLUMN properties.kyc_reviewed_at IS 'Timestamp when KYC verification was reviewed';
COMMENT ON COLUMN properties.kyc_approved_at IS 'Timestamp when KYC verification was approved';

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'KYC status migration completed successfully';
    RAISE NOTICE 'Added kyc_status, kyc_submitted_at, kyc_reviewed_at, kyc_approved_at columns to properties table';
    RAISE NOTICE 'Created indexes for efficient KYC status queries';
    RAISE NOTICE 'Updated existing properties with default KYC status';
END $$;
