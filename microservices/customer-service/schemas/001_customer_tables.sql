-- Customer Service Database Schema
-- Handles customer management and loyalty programs

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customer type enum
CREATE TYPE customer_type AS ENUM (
    'individual',
    'corporate'
);

-- Customer status enum
CREATE TYPE customer_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- Reference to auth service users
    customer_type customer_type DEFAULT 'individual',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(100),
    address JSONB DEFAULT '{}', -- {street, city, state, zip_code, country}
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    loyalty_tier VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, platinum
    status customer_status DEFAULT 'active',
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Corporate customers table
CREATE TABLE IF NOT EXISTS corporate_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_registration_number VARCHAR(100) UNIQUE NOT NULL,
    industry VARCHAR(100),
    contact_person_id UUID, -- Reference to auth service users
    billing_address JSONB DEFAULT '{}',
    tax_information JSONB DEFAULT '{}',
    credit_limit DECIMAL(15,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30, -- days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer loyalty transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- earn, redeem, expire, adjust
    points INTEGER NOT NULL,
    description TEXT,
    reference_id UUID, -- Reference to order, payment, etc.
    reference_type VARCHAR(50), -- order, payment, manual, etc.
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer preferences table
CREATE TABLE IF NOT EXISTS customer_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    preference_type VARCHAR(100) NOT NULL,
    preference_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, preference_type)
);

-- Customer analytics table
CREATE TABLE IF NOT EXISTS customer_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    property_id UUID, -- Reference to property service
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_loyalty_tier ON customers(loyalty_tier);
CREATE INDEX idx_customers_last_activity ON customers(last_activity);
CREATE INDEX idx_corporate_customers_customer_id ON corporate_customers(customer_id);
CREATE INDEX idx_corporate_customers_company_name ON corporate_customers(company_name);
CREATE INDEX idx_corporate_customers_registration_number ON corporate_customers(company_registration_number);
CREATE INDEX idx_loyalty_transactions_customer_id ON loyalty_transactions(customer_id);
CREATE INDEX idx_loyalty_transactions_type ON loyalty_transactions(transaction_type);
CREATE INDEX idx_loyalty_transactions_reference ON loyalty_transactions(reference_id, reference_type);
CREATE INDEX idx_customer_preferences_customer_id ON customer_preferences(customer_id);
CREATE INDEX idx_customer_preferences_type ON customer_preferences(preference_type);
CREATE INDEX idx_customer_analytics_customer_id ON customer_analytics(customer_id);
CREATE INDEX idx_customer_analytics_property_id ON customer_analytics(property_id);
CREATE INDEX idx_customer_analytics_date ON customer_analytics(metric_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_corporate_customers_updated_at
    BEFORE UPDATE ON corporate_customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_preferences_updated_at
    BEFORE UPDATE ON customer_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Customers can view their own data" ON customers FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Customers can update their own data" ON customers FOR UPDATE USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Corporate customers follow customer access" ON corporate_customers FOR ALL USING (
    EXISTS (SELECT 1 FROM customers WHERE id = customer_id AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Loyalty transactions follow customer access" ON loyalty_transactions FOR ALL USING (
    EXISTS (SELECT 1 FROM customers WHERE id = customer_id AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Customer preferences follow customer access" ON customer_preferences FOR ALL USING (
    EXISTS (SELECT 1 FROM customers WHERE id = customer_id AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Customer analytics follow customer access" ON customer_analytics FOR ALL USING (
    (customer_id IS NULL OR EXISTS (SELECT 1 FROM customers WHERE id = customer_id AND (
        user_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))) AND
    (property_id IS NULL OR EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    )))
);

-- Grant permissions
GRANT ALL ON customers TO authenticated;
GRANT ALL ON corporate_customers TO authenticated;
GRANT ALL ON loyalty_transactions TO authenticated;
GRANT ALL ON customer_preferences TO authenticated;
GRANT ALL ON customer_analytics TO authenticated;