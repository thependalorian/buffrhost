-- Customer Table
-- Enhanced with user types and compliance

CREATE TABLE Customer (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type_id INTEGER REFERENCES UserType(user_type_id) DEFAULT 1,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    id_document_type VARCHAR(50),
    id_document_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    kyc_status VARCHAR(50) DEFAULT 'pending',
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    kyc_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    loyalty_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Corporate Customer Table
CREATE TABLE CorporateCustomer (
    corporate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    business_type VARCHAR(100),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    annual_revenue DECIMAL(15,2),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100),
    billing_postal_code VARCHAR(20),
    authorized_signatory_name VARCHAR(255),
    authorized_signatory_title VARCHAR(100),
    authorized_signatory_email VARCHAR(255),
    authorized_signatory_phone VARCHAR(20),
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30,
    kyb_status VARCHAR(50) DEFAULT 'pending',
    kyb_verified_at TIMESTAMP WITH TIME ZONE,
    kyb_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- KYC/KYB Document Table
CREATE TABLE KYCKYBDocument (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    corporate_id UUID REFERENCES CorporateCustomer(corporate_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_category VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_status VARCHAR(50) DEFAULT 'uploaded',
    verification_status VARCHAR(50) DEFAULT 'pending',
    verification_notes TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE TRIGGER update_customer_updated_at 
    BEFORE UPDATE ON Customer 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corporate_customer_updated_at 
    BEFORE UPDATE ON CorporateCustomer 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
