-- KYC/KYB Compliance System
-- Know Your Customer and Know Your Business compliance

-- This file contains the KYC/KYB tables that were already defined
-- in the core/4-customers.sql file. This is a placeholder for additional
-- compliance functionality that might be needed in the future.

-- Compliance Audit Log
CREATE TABLE ComplianceAuditLog (
    audit_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES Customer(customer_id),
    corporate_id UUID REFERENCES CorporateCustomer(corporate_id),
    audit_type VARCHAR(50) NOT NULL,
    audit_action VARCHAR(50) NOT NULL,
    audit_data JSONB,
    performed_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Compliance Rules
CREATE TABLE ComplianceRules (
    rule_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    rule_definition JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE TRIGGER update_compliance_rules_updated_at 
    BEFORE UPDATE ON ComplianceRules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
