-- Payment Service Database Schema
-- Handles payment processing, gateway integration, and transaction management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Payment status enum
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'refunded',
    'partially_refunded'
);

-- Payment method enum
CREATE TYPE payment_method AS ENUM (
    'card',
    'bank_transfer',
    'digital_wallet',
    'cash',
    'stripe',
    'paypal'
);

-- Transaction type enum
CREATE TYPE transaction_type AS ENUM (
    'payment',
    'refund',
    'chargeback',
    'dispute'
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL, -- Reference to order service
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB DEFAULT '{}',
    failure_reason TEXT,
    customer_id UUID NOT NULL, -- Reference to auth service users
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status payment_status DEFAULT 'pending',
    gateway_refund_id VARCHAR(255),
    gateway_response JSONB DEFAULT '{}',
    failure_reason TEXT,
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table (for storing customer payment methods)
CREATE TABLE IF NOT EXISTS customer_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL, -- Reference to auth service users
    payment_method_type payment_method NOT NULL,
    gateway_customer_id VARCHAR(255),
    gateway_payment_method_id VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment analytics table
CREATE TABLE IF NOT EXISTS payment_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    property_id UUID, -- Reference to property service
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment webhooks table (for tracking webhook events)
CREATE TABLE IF NOT EXISTS payment_webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    transaction_id VARCHAR(255),
    payload JSONB NOT NULL,
    signature VARCHAR(500),
    processed BOOLEAN DEFAULT FALSE,
    processing_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);
CREATE INDEX idx_payments_gateway_transaction_id ON payments(gateway_transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_gateway_refund_id ON refunds(gateway_refund_id);
CREATE INDEX idx_customer_payment_methods_customer_id ON customer_payment_methods(customer_id);
CREATE INDEX idx_customer_payment_methods_default ON customer_payment_methods(is_default);
CREATE INDEX idx_payment_analytics_payment_id ON payment_analytics(payment_id);
CREATE INDEX idx_payment_analytics_property_id ON payment_analytics(property_id);
CREATE INDEX idx_payment_analytics_date ON payment_analytics(metric_date);
CREATE INDEX idx_payment_webhooks_gateway ON payment_webhooks(gateway);
CREATE INDEX idx_payment_webhooks_event_type ON payment_webhooks(event_type);
CREATE INDEX idx_payment_webhooks_transaction_id ON payment_webhooks(transaction_id);
CREATE INDEX idx_payment_webhooks_processed ON payment_webhooks(processed);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_payment_methods_updated_at
    BEFORE UPDATE ON customer_payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Customers can view their own payments" ON payments FOR SELECT USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
);

CREATE POLICY "Staff can manage payments for their properties" ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (
        EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
            owner_id = auth.uid() OR 
            EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
        ))
    ))
);

CREATE POLICY "Refunds follow payment access" ON refunds FOR ALL USING (
    EXISTS (SELECT 1 FROM payments WHERE id = payment_id AND (
        customer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))
);

CREATE POLICY "Customer payment methods are private" ON customer_payment_methods FOR ALL USING (
    customer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Payment analytics follow payment access" ON payment_analytics FOR ALL USING (
    (payment_id IS NULL OR EXISTS (SELECT 1 FROM payments WHERE id = payment_id AND (
        customer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    ))) AND
    (property_id IS NULL OR EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager', 'staff'))
    )))
);

CREATE POLICY "Payment webhooks are admin only" ON payment_webhooks FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Grant permissions
GRANT ALL ON payments TO authenticated;
GRANT ALL ON refunds TO authenticated;
GRANT ALL ON customer_payment_methods TO authenticated;
GRANT ALL ON payment_analytics TO authenticated;
GRANT ALL ON payment_webhooks TO authenticated;