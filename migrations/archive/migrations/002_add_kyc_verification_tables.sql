-- Migration: Add KYC/KYB Verification Tables for Property Onboarding
-- Description: Comprehensive KYC verification system for property owners
-- Date: January 29, 2025
-- Version: 002

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- KYC/KYB VERIFICATION TABLES
-- =============================================

-- Main KYC verification table
CREATE TABLE IF NOT EXISTS property_kyc_verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Verification status
    status VARCHAR(20) NOT NULL DEFAULT 'not_started'
        CHECK (status IN ('not_started', 'in_progress', 'pending_review', 'requires_info', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,

    -- Personal identity information (KYC)
    personal_identity JSONB,

    -- Business documents information (KYB)
    business_documents JSONB,

    -- Banking details for payouts
    banking_details JSONB,

    -- Review information
    reviewer_id UUID REFERENCES users(id),
    reviewer_notes TEXT,
    rejection_reason TEXT,

    -- Metadata
    verification_level INTEGER DEFAULT 0,
    risk_score DECIMAL(3,2),
    compliance_flags JSONB DEFAULT '[]'::jsonb,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),

    -- Constraints
    UNIQUE(property_id, user_id),
    CONSTRAINT valid_date_order CHECK (
        (submitted_at IS NULL) OR
        (reviewed_at IS NULL) OR
        (submitted_at <= reviewed_at)
    )
);

-- Document storage table for KYC uploads
CREATE TABLE IF NOT EXISTS property_kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    kyc_id UUID REFERENCES property_kyc_verification(id) ON DELETE CASCADE,

    -- Document information
    document_type VARCHAR(50) NOT NULL
        CHECK (document_type IN ('id_front', 'id_back', 'business_registration',
                                'tax_certificate', 'proof_of_address', 'bank_statement')),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,

    -- Storage information
    google_drive_id VARCHAR(255),
    public_url TEXT,
    storage_path TEXT,

    -- Processing results
    ocr_results JSONB,
    security_analysis JSONB,
    quality_score DECIMAL(3,2),
    authenticity_score DECIMAL(3,2),

    -- Status and processing
    status VARCHAR(20) DEFAULT 'uploaded'
        CHECK (status IN ('uploaded', 'processing', 'processed', 'rejected')),
    processing_started_at TIMESTAMP WITH TIME ZONE,
    processing_completed_at TIMESTAMP WITH TIME ZONE,
    processing_errors TEXT,

    -- Audit fields
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id),

    -- Constraints
    CHECK (file_size <= 10485760) -- 10MB limit
);

-- KYC verification audit log
CREATE TABLE IF NOT EXISTS property_kyc_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kyc_id UUID NOT NULL REFERENCES property_kyc_verification(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Audit information
    action VARCHAR(50) NOT NULL
        CHECK (action IN ('created', 'updated', 'submitted', 'reviewed',
                         'approved', 'rejected', 'document_uploaded', 'document_processed')),
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,

    -- Metadata
    performed_by UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,

    -- Audit timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Compliance and regulatory tracking
CREATE TABLE IF NOT EXISTS property_kyc_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kyc_id UUID NOT NULL REFERENCES property_kyc_verification(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

    -- Compliance information
    compliance_type VARCHAR(50) NOT NULL
        CHECK (compliance_type IN ('kyc', 'kyb', 'aml', 'sanctions', 'pep')),
    compliance_status VARCHAR(20) DEFAULT 'pending'
        CHECK (compliance_status IN ('pending', 'passed', 'failed', 'requires_review')),
    compliance_score DECIMAL(3,2),

    -- Regulatory information
    regulatory_body VARCHAR(100),
    compliance_reference VARCHAR(255),
    expiry_date DATE,

    -- Review information
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    review_date TIMESTAMP WITH TIME ZONE,

    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Property KYC verification indexes
CREATE INDEX IF NOT EXISTS idx_property_kyc_property_id ON property_kyc_verification(property_id);
CREATE INDEX IF NOT EXISTS idx_property_kyc_user_id ON property_kyc_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_property_kyc_status ON property_kyc_verification(status);
CREATE INDEX IF NOT EXISTS idx_property_kyc_submitted_at ON property_kyc_verification(submitted_at);
CREATE INDEX IF NOT EXISTS idx_property_kyc_reviewed_at ON property_kyc_verification(reviewed_at);

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_property_id ON property_kyc_documents(property_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_kyc_id ON property_kyc_documents(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_type ON property_kyc_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON property_kyc_documents(status);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_kyc_audit_kyc_id ON property_kyc_audit_log(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_property_id ON property_kyc_audit_log(property_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_user_id ON property_kyc_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_action ON property_kyc_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_kyc_audit_created_at ON property_kyc_audit_log(created_at);

-- Compliance indexes
CREATE INDEX IF NOT EXISTS idx_kyc_compliance_kyc_id ON property_kyc_compliance(kyc_id);
CREATE INDEX IF NOT EXISTS idx_kyc_compliance_property_id ON property_kyc_compliance(property_id);
CREATE INDEX IF NOT EXISTS idx_kyc_compliance_type ON property_kyc_compliance(compliance_type);
CREATE INDEX IF NOT EXISTS idx_kyc_compliance_status ON property_kyc_compliance(compliance_status);
CREATE INDEX IF NOT EXISTS idx_kyc_compliance_expiry ON property_kyc_compliance(expiry_date);

-- =============================================
-- VIEWS FOR EASY QUERYING
-- =============================================

-- KYC status overview view
CREATE OR REPLACE VIEW property_kyc_status_overview AS
SELECT
    pkv.id,
    pkv.property_id,
    p.name as property_name,
    p.type as property_type,
    pkv.user_id,
    u.full_name as owner_name,
    u.email as owner_email,
    pkv.status,
    pkv.submitted_at,
    pkv.reviewed_at,
    pkv.approved_at,
    pkv.verification_level,
    pkv.risk_score,
    pkv.reviewer_notes,
    pkv.rejection_reason,
    COUNT(pkd.id) as documents_uploaded,
    COUNT(CASE WHEN pkd.status = 'processed' THEN 1 END) as documents_processed,
    COUNT(pkc.id) as compliance_checks,
    COUNT(CASE WHEN pkc.compliance_status = 'passed' THEN 1 END) as compliance_passed
FROM property_kyc_verification pkv
LEFT JOIN properties p ON pkv.property_id = p.id
LEFT JOIN users u ON pkv.user_id = u.id
LEFT JOIN property_kyc_documents pkd ON pkv.id = pkd.kyc_id
LEFT JOIN property_kyc_compliance pkc ON pkv.id = pkc.kyc_id
GROUP BY pkv.id, p.id, p.name, p.type, u.id, u.full_name, u.email,
         pkv.status, pkv.submitted_at, pkv.reviewed_at, pkv.approved_at,
         pkv.verification_level, pkv.risk_score, pkv.reviewer_notes, pkv.rejection_reason;

-- Document processing status view
CREATE OR REPLACE VIEW property_kyc_document_status AS
SELECT
    pkd.id,
    pkd.property_id,
    p.name as property_name,
    pkd.kyc_id,
    pkd.document_type,
    pkd.file_name,
    pkd.mime_type,
    pkd.file_size,
    pkd.status,
    pkd.quality_score,
    pkd.authenticity_score,
    pkd.processing_started_at,
    pkd.processing_completed_at,
    pkd.uploaded_at,
    CASE
        WHEN pkd.processing_errors IS NOT NULL THEN 'error'
        WHEN pkd.status = 'processed' AND pkd.quality_score > 0.8 THEN 'high_quality'
        WHEN pkd.status = 'processed' AND pkd.quality_score > 0.6 THEN 'acceptable'
        WHEN pkd.status = 'processed' THEN 'low_quality'
        ELSE 'pending'
    END as processing_result
FROM property_kyc_documents pkd
LEFT JOIN properties p ON pkd.property_id = p.id;

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update property KYC status when verification is updated
CREATE OR REPLACE FUNCTION update_property_kyc_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the properties table with the latest KYC status
    UPDATE properties
    SET
        kyc_status = NEW.status,
        updated_at = NOW()
    WHERE id = NEW.property_id;

    -- Log the status change
    INSERT INTO property_kyc_audit_log (
        kyc_id, property_id, user_id, action, old_values, new_values, performed_by
    ) VALUES (
        NEW.id, NEW.property_id, NEW.user_id, 'updated',
        jsonb_build_object('status', OLD.status),
        jsonb_build_object('status', NEW.status),
        NEW.updated_by
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for KYC status updates
DROP TRIGGER IF EXISTS trigger_update_property_kyc_status ON property_kyc_verification;
CREATE TRIGGER trigger_update_property_kyc_status
    AFTER UPDATE ON property_kyc_verification
    FOR EACH ROW
    EXECUTE FUNCTION update_property_kyc_status();

-- Function to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to all KYC tables
DROP TRIGGER IF EXISTS trigger_property_kyc_verification_updated_at ON property_kyc_verification;
CREATE TRIGGER trigger_property_kyc_verification_updated_at
    BEFORE UPDATE ON property_kyc_verification
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_property_kyc_documents_updated_at ON property_kyc_documents;
CREATE TRIGGER trigger_property_kyc_documents_updated_at
    BEFORE UPDATE ON property_kyc_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_property_kyc_compliance_updated_at ON property_kyc_compliance;
CREATE TRIGGER trigger_property_kyc_compliance_updated_at
    BEFORE UPDATE ON property_kyc_compliance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Insert compliance types for reference
INSERT INTO property_kyc_compliance (
    id, kyc_id, property_id, compliance_type, compliance_status
) VALUES
    (uuid_generate_v4(), NULL, NULL, 'kyc', 'pending'),
    (uuid_generate_v4(), NULL, NULL, 'kyb', 'pending'),
    (uuid_generate_v4(), NULL, NULL, 'aml', 'pending'),
    (uuid_generate_v4(), NULL, NULL, 'sanctions', 'pending'),
    (uuid_generate_v4(), NULL, NULL, 'pep', 'pending')
ON CONFLICT DO NOTHING;

-- =============================================
-- PERMISSIONS AND SECURITY
-- =============================================

-- Row Level Security (RLS) policies would be added here in production
-- These ensure users can only access their own KYC data

-- Grant necessary permissions (adjust based on your user roles)
-- GRANT SELECT, INSERT, UPDATE ON property_kyc_verification TO authenticated_user;
-- GRANT SELECT, INSERT, UPDATE ON property_kyc_documents TO authenticated_user;
-- GRANT SELECT ON property_kyc_audit_log TO authenticated_user;
-- GRANT SELECT ON property_kyc_compliance TO authenticated_user;

-- =============================================
-- MIGRATION COMPLETE
-- =============================================

-- Log migration completion
DO $$
BEGIN
    RAISE NOTICE 'KYC/KYB verification tables migration completed successfully';
    RAISE NOTICE 'Created tables: property_kyc_verification, property_kyc_documents, property_kyc_audit_log, property_kyc_compliance';
    RAISE NOTICE 'Created indexes for optimal query performance';
    RAISE NOTICE 'Created views for simplified data access';
    RAISE NOTICE 'Created triggers for automatic updates and auditing';
END $$;
