-- Payment Gateway Integration
-- Comprehensive payment gateway management for multiple providers

-- Payment gateway types enum
CREATE TYPE payment_gateway_type_enum AS ENUM (
    'realpay',
    'adume',
    'stripe',
    'paypal',
    'square',
    'razorpay',
    'flutterwave',
    'paystack',
    'momo',
    'bank_transfer',
    'cash',
    'crypto'
);

-- Payment gateway status enum
CREATE TYPE payment_gateway_status_enum AS ENUM (
    'active',
    'inactive',
    'maintenance',
    'suspended',
    'deprecated'
);

-- Payment gateway configuration table
CREATE TABLE PaymentGatewayConfig (
    gateway_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    gateway_name VARCHAR(100) NOT NULL,
    gateway_type payment_gateway_type_enum NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    status payment_gateway_status_enum DEFAULT 'active',
    configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
    credentials_encrypted TEXT,
    webhook_url TEXT,
    webhook_secret TEXT,
    supported_currencies TEXT[] DEFAULT ARRAY['NAD', 'USD', 'ZAR'],
    supported_payment_methods payment_method_enum[],
    processing_fee_percentage DECIMAL(5,4) DEFAULT 0.0000,
    processing_fee_fixed DECIMAL(10,2) DEFAULT 0.00,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    maximum_amount DECIMAL(10,2) DEFAULT 100000.00,
    daily_limit DECIMAL(15,2) DEFAULT 1000000.00,
    monthly_limit DECIMAL(15,2) DEFAULT 30000000.00,
    sandbox_mode BOOLEAN DEFAULT TRUE,
    test_mode BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by TEXT,
    updated_by TEXT
);

-- RealPay specific configuration
CREATE TABLE RealPayConfig (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id UUID REFERENCES PaymentGatewayConfig(gateway_id) ON DELETE CASCADE,
    merchant_id VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_secret_encrypted TEXT NOT NULL,
    environment VARCHAR(20) DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
    base_url TEXT NOT NULL,
    webhook_endpoint TEXT,
    supported_features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adume specific configuration
CREATE TABLE AdumeConfig (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id UUID REFERENCES PaymentGatewayConfig(gateway_id) ON DELETE CASCADE,
    client_id VARCHAR(100) NOT NULL,
    client_secret_encrypted TEXT NOT NULL,
    environment VARCHAR(20) DEFAULT 'sandbox' CHECK (environment IN ('sandbox', 'production')),
    base_url TEXT NOT NULL,
    webhook_endpoint TEXT,
    supported_features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE PaymentTransaction (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    gateway_id UUID REFERENCES PaymentGatewayConfig(gateway_id),
    customer_id UUID REFERENCES Customer(customer_id),
    order_id UUID REFERENCES "Order"(order_id),
    booking_id UUID REFERENCES ServiceBooking(booking_id),
    transaction_reference VARCHAR(255) UNIQUE NOT NULL,
    gateway_transaction_id VARCHAR(255),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NAD',
    payment_method payment_method_enum NOT NULL,
    payment_status payment_status_enum DEFAULT 'pending',
    gateway_status VARCHAR(50),
    gateway_response JSONB,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment webhook events table
CREATE TABLE PaymentWebhookEvent (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id UUID REFERENCES PaymentGatewayConfig(gateway_id),
    transaction_id UUID REFERENCES PaymentTransaction(transaction_id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    signature TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    processed BOOLEAN DEFAULT FALSE,
    processing_attempts INTEGER DEFAULT 0,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Payment gateway analytics table
CREATE TABLE PaymentGatewayAnalytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id UUID REFERENCES PaymentGatewayConfig(gateway_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    failed_transactions INTEGER DEFAULT 0,
    total_volume DECIMAL(15,2) DEFAULT 0.00,
    successful_volume DECIMAL(15,2) DEFAULT 0.00,
    failed_volume DECIMAL(15,2) DEFAULT 0.00,
    average_transaction_amount DECIMAL(10,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    processing_time_avg_ms INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to process payment
CREATE OR REPLACE FUNCTION process_payment(
    p_property_id INTEGER,
    p_gateway_id UUID,
    p_customer_id UUID,
    p_amount DECIMAL(15,2),
    p_currency VARCHAR(3),
    p_payment_method payment_method_enum,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
    gateway_config RECORD;
BEGIN
    -- Get gateway configuration
    SELECT * INTO gateway_config
    FROM PaymentGatewayConfig
    WHERE gateway_id = p_gateway_id AND is_active = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment gateway not found or inactive';
    END IF;
    
    -- Validate amount limits
    IF p_amount < gateway_config.minimum_amount THEN
        RAISE EXCEPTION 'Amount below minimum limit: %', gateway_config.minimum_amount;
    END IF;
    
    IF p_amount > gateway_config.maximum_amount THEN
        RAISE EXCEPTION 'Amount above maximum limit: %', gateway_config.maximum_amount;
    END IF;
    
    -- Create payment transaction
    INSERT INTO PaymentTransaction (
        property_id, gateway_id, customer_id, amount, currency,
        payment_method, description, metadata, transaction_reference
    ) VALUES (
        p_property_id, p_gateway_id, p_customer_id, p_amount, p_currency,
        p_payment_method, p_description, p_metadata,
        'TXN-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8)
    ) RETURNING transaction_id INTO transaction_id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle payment webhook
CREATE OR REPLACE FUNCTION handle_payment_webhook(
    p_gateway_id UUID,
    p_event_type VARCHAR(100),
    p_event_data JSONB,
    p_signature TEXT
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
    transaction_id UUID;
    gateway_config RECORD;
BEGIN
    -- Get gateway configuration
    SELECT * INTO gateway_config
    FROM PaymentGatewayConfig
    WHERE gateway_id = p_gateway_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment gateway not found';
    END IF;
    
    -- Verify signature (implementation depends on gateway)
    -- This is a placeholder - implement actual signature verification
    
    -- Extract transaction ID from event data
    transaction_id := (p_event_data->>'transaction_id')::UUID;
    
    -- Insert webhook event
    INSERT INTO PaymentWebhookEvent (
        gateway_id, transaction_id, event_type, event_data, signature
    ) VALUES (
        p_gateway_id, transaction_id, p_event_type, p_event_data, p_signature
    ) RETURNING event_id INTO event_id;
    
    -- Update transaction status based on event type
    CASE p_event_type
        WHEN 'payment.completed' THEN
            UPDATE PaymentTransaction
            SET payment_status = 'paid',
                gateway_status = 'completed',
                completed_at = NOW(),
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.failed' THEN
            UPDATE PaymentTransaction
            SET payment_status = 'failed',
                gateway_status = 'failed',
                failed_at = NOW(),
                failure_reason = p_event_data->>'reason',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.pending' THEN
            UPDATE PaymentTransaction
            SET payment_status = 'processing',
                gateway_status = 'pending',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
    END CASE;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get payment analytics
CREATE OR REPLACE FUNCTION get_payment_analytics(
    p_property_id INTEGER DEFAULT NULL,
    p_gateway_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    gateway_name VARCHAR(100),
    total_transactions BIGINT,
    successful_transactions BIGINT,
    failed_transactions BIGINT,
    total_volume DECIMAL(15,2),
    success_rate DECIMAL(5,2),
    average_amount DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pgc.gateway_name,
        COUNT(pt.transaction_id)::BIGINT as total_transactions,
        COUNT(pt.transaction_id) FILTER (WHERE pt.payment_status = 'paid')::BIGINT as successful_transactions,
        COUNT(pt.transaction_id) FILTER (WHERE pt.payment_status = 'failed')::BIGINT as failed_transactions,
        COALESCE(SUM(pt.amount), 0)::DECIMAL(15,2) as total_volume,
        ROUND(
            (COUNT(pt.transaction_id) FILTER (WHERE pt.payment_status = 'paid')::DECIMAL / 
             NULLIF(COUNT(pt.transaction_id), 0)) * 100, 2
        ) as success_rate,
        COALESCE(AVG(pt.amount), 0)::DECIMAL(10,2) as average_amount
    FROM PaymentGatewayConfig pgc
    LEFT JOIN PaymentTransaction pt ON pgc.gateway_id = pt.gateway_id
        AND pt.created_at::DATE BETWEEN p_start_date AND p_end_date
    WHERE (p_property_id IS NULL OR pgc.property_id = p_property_id)
      AND (p_gateway_id IS NULL OR pgc.gateway_id = p_gateway_id)
    GROUP BY pgc.gateway_id, pgc.gateway_name
    ORDER BY total_volume DESC;
END;
$$ LANGUAGE plpgsql;

-- Insert default payment gateway configurations
INSERT INTO PaymentGatewayConfig (property_id, gateway_name, gateway_type, is_primary, supported_payment_methods, configuration) VALUES
(1, 'RealPay Primary', 'realpay', TRUE, ARRAY['credit_card', 'debit_card', 'bank_transfer'], '{"merchant_id": "encrypted_merchant_id", "api_key": "encrypted_api_key"}'),
(1, 'Adume Secondary', 'adume', FALSE, ARRAY['credit_card', 'debit_card', 'mobile_payment'], '{"client_id": "encrypted_client_id", "client_secret": "encrypted_client_secret"}'),
(1, 'Stripe International', 'stripe', FALSE, ARRAY['credit_card', 'debit_card'], '{"publishable_key": "encrypted_publishable_key", "secret_key": "encrypted_secret_key"}');

-- Create indexes for performance
CREATE INDEX idx_payment_gateway_config_property ON PaymentGatewayConfig(property_id);
CREATE INDEX idx_payment_gateway_config_type ON PaymentGatewayConfig(gateway_type);
CREATE INDEX idx_payment_gateway_config_active ON PaymentGatewayConfig(is_active);
CREATE INDEX idx_payment_transaction_property ON PaymentTransaction(property_id);
CREATE INDEX idx_payment_transaction_gateway ON PaymentTransaction(gateway_id);
CREATE INDEX idx_payment_transaction_customer ON PaymentTransaction(customer_id);
CREATE INDEX idx_payment_transaction_status ON PaymentTransaction(payment_status);
CREATE INDEX idx_payment_transaction_created_at ON PaymentTransaction(created_at);
CREATE INDEX idx_payment_webhook_event_gateway ON PaymentWebhookEvent(gateway_id);
CREATE INDEX idx_payment_webhook_event_transaction ON PaymentWebhookEvent(transaction_id);
CREATE INDEX idx_payment_webhook_event_type ON PaymentWebhookEvent(event_type);
CREATE INDEX idx_payment_webhook_event_processed ON PaymentWebhookEvent(processed);
CREATE INDEX idx_payment_gateway_analytics_gateway ON PaymentGatewayAnalytics(gateway_id);
CREATE INDEX idx_payment_gateway_analytics_property ON PaymentGatewayAnalytics(property_id);
CREATE INDEX idx_payment_gateway_analytics_date ON PaymentGatewayAnalytics(date);

-- Enable RLS
ALTER TABLE PaymentGatewayConfig ENABLE ROW LEVEL SECURITY;
ALTER TABLE RealPayConfig ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeConfig ENABLE ROW LEVEL SECURITY;
ALTER TABLE PaymentTransaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE PaymentWebhookEvent ENABLE ROW LEVEL SECURITY;
ALTER TABLE PaymentGatewayAnalytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow property staff to manage payment gateways"
  ON PaymentGatewayConfig
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to view payment transactions"
  ON PaymentTransaction
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Allow customers to view their own transactions"
  ON PaymentTransaction
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM Customer 
    WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Allow system to manage webhook events"
  ON PaymentWebhookEvent
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to view analytics"
  ON PaymentGatewayAnalytics
  FOR SELECT
  TO authenticated
  USING (property_id IN (
    SELECT property_id FROM BuffrHostUser 
    WHERE owner_id = auth.uid()
  ));

-- Create updated_at triggers
CREATE TRIGGER update_payment_gateway_config_updated_at 
    BEFORE UPDATE ON PaymentGatewayConfig 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_config_updated_at 
    BEFORE UPDATE ON RealPayConfig 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adume_config_updated_at 
    BEFORE UPDATE ON AdumeConfig 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transaction_updated_at 
    BEFORE UPDATE ON PaymentTransaction 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_gateway_analytics_updated_at 
    BEFORE UPDATE ON PaymentGatewayAnalytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
