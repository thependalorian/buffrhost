-- Electronic Transactions Act Compliance Database Schema
-- Namibia Electronic Transactions Act 2019 Implementation
-- Migration: 001_create_compliance_tables.sql

-- =====================================================
-- ELECTRONIC SIGNATURES TABLE
-- Implements ETA Section 19: Legal Recognition of Electronic Signatures
-- =====================================================

CREATE TABLE IF NOT EXISTS electronic_signatures (
    id VARCHAR(50) PRIMARY KEY,
    signer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signature_type VARCHAR(20) NOT NULL CHECK (signature_type IN ('simple', 'advanced', 'qualified')),
    signature_data TEXT NOT NULL,
    document_hash VARCHAR(128) NOT NULL, -- SHA-256 hash
    document_type VARCHAR(100) NOT NULL,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    certificate_id VARCHAR(255), -- For qualified signatures
    expires_at TIMESTAMPTZ NOT NULL, -- 1 year validity per ETA
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for electronic signatures
CREATE INDEX IF NOT EXISTS idx_electronic_signatures_signer_id ON electronic_signatures(signer_id);
CREATE INDEX IF NOT EXISTS idx_electronic_signatures_document_hash ON electronic_signatures(document_hash);
CREATE INDEX IF NOT EXISTS idx_electronic_signatures_signed_at ON electronic_signatures(signed_at);
CREATE INDEX IF NOT EXISTS idx_electronic_signatures_expires_at ON electronic_signatures(expires_at);
CREATE INDEX IF NOT EXISTS idx_electronic_signatures_is_valid ON electronic_signatures(is_valid);

-- =====================================================
-- EMAIL PREFERENCES TABLE
-- Implements ETA Section 15: Consumer Protection in Electronic Transactions
-- =====================================================

CREATE TABLE IF NOT EXISTS email_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    categories JSONB NOT NULL DEFAULT '{
        "promotional": true,
        "transactional": true,
        "newsletters": true,
        "updates": true,
        "surveys": false
    }'::jsonb,
    frequencies JSONB NOT NULL DEFAULT '{
        "promotional": "weekly",
        "transactional": "immediate",
        "newsletters": "weekly",
        "updates": "monthly",
        "surveys": "monthly"
    }'::jsonb,
    subscribed_lists TEXT[] DEFAULT '{}',
    unsubscribe_token VARCHAR(255),
    token_expires_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    unsubscribe_reason TEXT,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET NOT NULL DEFAULT '0.0.0.0'::inet,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for email preferences
CREATE INDEX IF NOT EXISTS idx_email_preferences_user_id ON email_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_preferences_unsubscribed_at ON email_preferences(unsubscribed_at);
CREATE INDEX IF NOT EXISTS idx_email_preferences_unsubscribe_token ON email_preferences(unsubscribe_token);

-- =====================================================
-- EMAIL OPT-OUT LOG TABLE
-- Implements ETA Section 15: Consumer Protection - Opt-out Tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS email_opt_out_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    categories_opted_out TEXT[] NOT NULL,
    global_opt_out BOOLEAN NOT NULL DEFAULT FALSE,
    reason TEXT,
    source VARCHAR(100) DEFAULT 'user_request',
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET NOT NULL DEFAULT '0.0.0.0'::inet,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for opt-out log
CREATE INDEX IF NOT EXISTS idx_email_opt_out_log_email ON email_opt_out_log(email);
CREATE INDEX IF NOT EXISTS idx_email_opt_out_log_processed_at ON email_opt_out_log(processed_at);
CREATE INDEX IF NOT EXISTS idx_email_opt_out_log_global_opt_out ON email_opt_out_log(global_opt_out);

-- =====================================================
-- AUDIT TRAIL TABLE
-- Implements ETA Section 24: Electronic Records and Retention
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_trail (
    id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN (
        'user_action', 'system_event', 'security_event',
        'data_modification', 'access_attempt', 'compliance_event'
    )),
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    action VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    before_state JSONB DEFAULT '{}'::jsonb,
    after_state JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    location VARCHAR(255),
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- 7 years for audit logs per ETA
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit trail
CREATE INDEX IF NOT EXISTS idx_audit_trail_user_id ON audit_trail(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_event_type ON audit_trail(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_trail_resource_type ON audit_trail(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_trail_timestamp ON audit_trail(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_trail_expires_at ON audit_trail(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_trail_severity ON audit_trail(severity);
CREATE INDEX IF NOT EXISTS idx_audit_trail_archived ON audit_trail(archived);

-- =====================================================
-- AUDIT ARCHIVAL TABLE
-- Implements ETA Section 24: Long-term Data Retention
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_archival (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_entry_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    action VARCHAR(255) NOT NULL,
    user_id UUID,
    resource_type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    retention_category VARCHAR(20) NOT NULL CHECK (retention_category IN (
        'transactional', 'user_data', 'audit_logs', 'security_events',
        'marketing_data', 'temporary'
    )),
    storage_location TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit archival
CREATE INDEX IF NOT EXISTS idx_audit_archival_audit_entry_id ON audit_archival(audit_entry_id);
CREATE INDEX IF NOT EXISTS idx_audit_archival_archived_at ON audit_archival(archived_at);
CREATE INDEX IF NOT EXISTS idx_audit_archival_retention_category ON audit_archival(retention_category);

-- =====================================================
-- DATA ARCHIVAL RECORDS TABLE
-- Implements ETA Section 24: Data Archival Compliance
-- =====================================================

CREATE TABLE IF NOT EXISTS data_archival_records (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'transactional', 'user_data', 'audit_logs', 'security_events',
        'marketing_data', 'temporary'
    )),
    data_type VARCHAR(100) NOT NULL,
    record_count INTEGER NOT NULL DEFAULT 0,
    archival_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archival_method VARCHAR(100) NOT NULL,
    storage_location TEXT NOT NULL,
    retention_expiry TIMESTAMPTZ NOT NULL,
    destruction_method TEXT,
    compliance_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for data archival records
CREATE INDEX IF NOT EXISTS idx_data_archival_records_category ON data_archival_records(category);
CREATE INDEX IF NOT EXISTS idx_data_archival_records_archival_date ON data_archival_records(archival_date);
CREATE INDEX IF NOT EXISTS idx_data_archival_records_retention_expiry ON data_archival_records(retention_expiry);

-- =====================================================
-- CONSUMER WITHDRAWAL REQUESTS TABLE
-- Implements ETA Section 15: Consumer Withdrawal Rights
-- =====================================================

CREATE TABLE IF NOT EXISTS consumer_withdrawal_requests (
    id VARCHAR(50) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'processed', 'rejected'
    )),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES users(id),
    refund_amount BIGINT NOT NULL, -- Amount in cents
    currency VARCHAR(3) NOT NULL DEFAULT 'NAD',
    rejection_reason TEXT,
    cooling_off_expiry TIMESTAMPTZ NOT NULL, -- 7 days from booking
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for withdrawal requests
CREATE INDEX IF NOT EXISTS idx_consumer_withdrawal_requests_user_id ON consumer_withdrawal_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consumer_withdrawal_requests_booking_id ON consumer_withdrawal_requests(booking_id);
CREATE INDEX IF NOT EXISTS idx_consumer_withdrawal_requests_status ON consumer_withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_consumer_withdrawal_requests_requested_at ON consumer_withdrawal_requests(requested_at);
CREATE INDEX IF NOT EXISTS idx_consumer_withdrawal_requests_cooling_off_expiry ON consumer_withdrawal_requests(cooling_off_expiry);

-- =====================================================
-- PAYMENT SECURITY EVENTS TABLE
-- Implements ETA Section 16: Payment System Security
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_security_events (
    id VARCHAR(50) PRIMARY KEY,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN (
        'suspicious_transaction', 'failed_authentication', 'card_data_breach',
        'unusual_pattern', 'geographic_anomaly', 'velocity_limit_exceeded'
    )),
    transaction_id VARCHAR(255),
    user_id UUID REFERENCES users(id),
    description TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_notes TEXT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for payment security events
CREATE INDEX IF NOT EXISTS idx_payment_security_events_event_type ON payment_security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_security_events_transaction_id ON payment_security_events(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_security_events_user_id ON payment_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_security_events_severity ON payment_security_events(severity);
CREATE INDEX IF NOT EXISTS idx_payment_security_events_detected_at ON payment_security_events(detected_at);
CREATE INDEX IF NOT EXISTS idx_payment_security_events_resolved ON payment_security_events(resolved);

-- =====================================================
-- PAYMENT RISK ASSESSMENTS TABLE
-- Implements ETA Section 16: Fraud Prevention
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    risk_factors TEXT[] NOT NULL DEFAULT '{}',
    mitigation_actions TEXT[] NOT NULL DEFAULT '{}',
    approved BOOLEAN NOT NULL DEFAULT TRUE,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for payment risk assessments
CREATE INDEX IF NOT EXISTS idx_payment_risk_assessments_transaction_id ON payment_risk_assessments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_risk_assessments_risk_level ON payment_risk_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_payment_risk_assessments_approved ON payment_risk_assessments(approved);
CREATE INDEX IF NOT EXISTS idx_payment_risk_assessments_assessed_at ON payment_risk_assessments(assessed_at);

-- =====================================================
-- PCI DSS COMPLIANCE ASSESSMENTS TABLE
-- Implements ETA Section 16: Payment Card Security
-- =====================================================

CREATE TABLE IF NOT EXISTS pci_dss_assessments (
    id VARCHAR(50) PRIMARY KEY,
    assessment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    required_level VARCHAR(10) NOT NULL CHECK (required_level IN ('level1', 'level2', 'level3', 'level4')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('compliant', 'non_compliant', 'pending_review', 'expired')),
    requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    assessor VARCHAR(255) NOT NULL DEFAULT 'PaymentSecurityService',
    next_assessment_due TIMESTAMPTZ,
    remediation_actions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for PCI DSS assessments
CREATE INDEX IF NOT EXISTS idx_pci_dss_assessments_status ON pci_dss_assessments(status);
CREATE INDEX IF NOT EXISTS idx_pci_dss_assessments_assessment_date ON pci_dss_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_pci_dss_assessments_next_assessment_due ON pci_dss_assessments(next_assessment_due);

-- =====================================================
-- COMPLIANCE REPORTS TABLE
-- Implements ETA Section 24: Compliance Monitoring
-- =====================================================

CREATE TABLE IF NOT EXISTS compliance_reports (
    id VARCHAR(50) PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    report_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    compliance_status VARCHAR(20) NOT NULL CHECK (compliance_status IN (
        'compliant', 'needs_attention', 'non_compliant'
    )),
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    generated_by VARCHAR(255) DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for compliance reports
CREATE INDEX IF NOT EXISTS idx_compliance_reports_report_type ON compliance_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_period_start ON compliance_reports(period_start);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_period_end ON compliance_reports(period_end);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_compliance_status ON compliance_reports(compliance_status);

-- =====================================================
-- STORED FUNCTIONS FOR COMPLIANCE OPERATIONS
-- =====================================================

-- Function to create electronic signatures table (for Supabase RPC)
CREATE OR REPLACE FUNCTION create_electronic_signatures_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation handled by migration
    NULL;
END;
$$;

-- Function to create email preferences table (for Supabase RPC)
CREATE OR REPLACE FUNCTION create_email_preferences_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation handled by migration
    NULL;
END;
$$;

-- Function to create email opt-out log table (for Supabase RPC)
CREATE OR REPLACE FUNCTION create_email_opt_out_log_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation handled by migration
    NULL;
END;
$$;

-- Function to create audit trail table (for Supabase RPC)
CREATE OR REPLACE FUNCTION create_audit_trail_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation handled by migration
    NULL;
END;
$$;

-- Function to create data archival table (for Supabase RPC)
CREATE OR REPLACE FUNCTION create_data_archival_table()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Table creation handled by migration
    NULL;
END;
$$;

-- Function to clean up expired audit entries (for scheduled jobs)
CREATE OR REPLACE FUNCTION cleanup_expired_audit_entries()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE audit_trail
    SET is_valid = FALSE, expired_at = NOW(), updated_at = NOW()
    WHERE expires_at < NOW() AND is_valid = TRUE;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Function to archive expired data (for scheduled jobs)
CREATE OR REPLACE FUNCTION archive_expired_data(retention_category TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    retention_days INTEGER;
    archived_count INTEGER;
BEGIN
    -- Get retention period based on category
    CASE retention_category
        WHEN 'transactional' THEN retention_days := 2555; -- 7 years
        WHEN 'user_data' THEN retention_days := 730;      -- 2 years
        WHEN 'audit_logs' THEN retention_days := 2555;    -- 7 years
        WHEN 'security_events' THEN retention_days := 2555; -- 7 years
        WHEN 'marketing_data' THEN retention_days := 730; -- 2 years
        WHEN 'temporary' THEN retention_days := 30;       -- 30 days
        ELSE retention_days := 2555; -- Default to 7 years
    END CASE;

    -- Archive logic would go here for each table type
    -- This is a placeholder for the actual archival implementation

    archived_count := 0;
    RETURN archived_count;
END;
$$;

-- =====================================================
-- DATA RETENTION POLICIES (COMMENTS FOR DOCUMENTATION)
-- =====================================================

/*
Electronic Transactions Act 2019 - Data Retention Requirements:

1. Transactional Data: 7 years (ETA Section 24)
   - Booking records, payment data, invoices, receipts
   - Legal basis: Financial record keeping and dispute resolution

2. User Data: 2 years after account closure (ETA Section 15)
   - User profiles, preferences, contact information, account settings
   - Requires explicit user consent for processing

3. Audit Logs: 7 years (ETA Section 24)
   - System audit trails, event logs, user actions, API calls
   - Required for electronic records integrity and legal compliance

4. Security Events: 7 years (ETA Section 16)
   - Security incidents, access attempts, authentication logs
   - Critical for fraud prevention and breach investigation

5. Marketing Data: 2 years after opt-out (ETA Section 15)
   - Email preferences, campaign data, opt-out records
   - Must honor user opt-out requests immediately

6. Temporary Data: 30 days (General data protection)
   - Session data, temporary files, cache entries
   - No long-term retention required

All data must be securely archived before deletion, with audit trails
maintained for all archival and deletion operations.
*/

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Add migration tracking
INSERT INTO schema_migrations (version, name, executed_at)
VALUES ('001', 'create_compliance_tables', NOW())
ON CONFLICT (version) DO NOTHING;
