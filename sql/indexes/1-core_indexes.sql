-- Core Indexes
-- Performance indexes for core system tables

-- Hospitality Property Indexes
CREATE INDEX idx_hospitality_property_active ON HospitalityProperty(is_active);
CREATE INDEX idx_hospitality_property_type ON HospitalityProperty(property_type);

-- Buffr Host User Indexes
CREATE INDEX idx_buffr_host_user_property ON BuffrHostUser(property_id);
CREATE INDEX idx_buffr_host_user_email ON BuffrHostUser(email);
CREATE INDEX idx_buffr_host_user_role ON BuffrHostUser(role);
CREATE INDEX idx_buffr_host_user_type ON BuffrHostUser(user_type_id);

-- Customer Indexes
CREATE INDEX idx_customer_email ON Customer(email);
CREATE INDEX idx_customer_user_type ON Customer(user_type_id);
CREATE INDEX idx_customer_kyc_status ON Customer(kyc_status);

-- Corporate Customer Indexes
CREATE INDEX idx_corporate_customer_company ON CorporateCustomer(company_name);
CREATE INDEX idx_corporate_customer_kyb_status ON CorporateCustomer(kyb_status);

-- KYC/KYB Document Indexes
CREATE INDEX idx_kyc_kyb_document_customer ON KYCKYBDocument(customer_id);
CREATE INDEX idx_kyc_kyb_document_corporate ON KYCKYBDocument(corporate_id);
CREATE INDEX idx_kyc_kyb_document_type ON KYCKYBDocument(document_type);
CREATE INDEX idx_kyc_kyb_document_status ON KYCKYBDocument(verification_status);

-- User Type Indexes
CREATE INDEX idx_user_type_name ON UserType(type_name);
