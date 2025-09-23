-- RealPay Payment Integration
-- Comprehensive RealPay payment gateway integration for Namibia

-- RealPay transaction types enum
CREATE TYPE realpay_transaction_type_enum AS ENUM (
    'payment',
    'refund',
    'partial_refund',
    'void',
    'capture',
    'authorize'
);

-- RealPay transaction status enum
CREATE TYPE realpay_transaction_status_enum AS ENUM (
    'initiated',
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled',
    'expired',
    'refunded',
    'partially_refunded'
);

-- RealPay payment methods enum
CREATE TYPE realpay_payment_method_enum AS ENUM (
    'card',
    'bank_transfer',
    'wallet',
    'mobile_money',
    'eft',
    'instant_eft'
);

-- RealPay transactions table
CREATE TABLE RealPayTransaction (
    realpay_transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES PaymentTransaction(transaction_id) ON DELETE CASCADE,
    realpay_reference VARCHAR(255) UNIQUE NOT NULL,
    realpay_transaction_id VARCHAR(255),
    transaction_type realpay_transaction_type_enum NOT NULL,
    status realpay_transaction_status_enum DEFAULT 'initiated',
    payment_method realpay_payment_method_enum NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NAD',
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    description TEXT,
    redirect_url TEXT,
    webhook_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    realpay_response JSONB,
    error_code VARCHAR(50),
    error_message TEXT,
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RealPay webhook events table
CREATE TABLE RealPayWebhookEvent (
    webhook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realpay_transaction_id UUID REFERENCES RealPayTransaction(realpay_transaction_id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    signature TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    processed BOOLEAN DEFAULT FALSE,
    processing_attempts INTEGER DEFAULT 0,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- RealPay refunds table
CREATE TABLE RealPayRefund (
    refund_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realpay_transaction_id UUID REFERENCES RealPayTransaction(realpay_transaction_id),
    refund_reference VARCHAR(255) UNIQUE NOT NULL,
    realpay_refund_id VARCHAR(255),
    refund_amount DECIMAL(15,2) NOT NULL,
    refund_reason TEXT,
    refund_status VARCHAR(50) DEFAULT 'pending',
    realpay_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RealPay settlement table
CREATE TABLE RealPaySettlement (
    settlement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_reference VARCHAR(255) UNIQUE NOT NULL,
    settlement_date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    total_fees DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) DEFAULT 0.00,
    settlement_status VARCHAR(50) DEFAULT 'pending',
    realpay_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to create RealPay payment
CREATE OR REPLACE FUNCTION create_realpay_payment(
    p_transaction_id UUID,
    p_amount DECIMAL(15,2),
    p_currency VARCHAR(3),
    p_customer_email VARCHAR(255),
    p_customer_phone VARCHAR(20),
    p_customer_name VARCHAR(255),
    p_description TEXT,
    p_redirect_url TEXT,
    p_webhook_url TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    realpay_transaction_id UUID;
    realpay_reference VARCHAR(255);
BEGIN
    -- Generate RealPay reference
    realpay_reference := 'RP-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);
    
    -- Create RealPay transaction
    INSERT INTO RealPayTransaction (
        transaction_id, realpay_reference, transaction_type, payment_method,
        amount, currency, customer_email, customer_phone, customer_name,
        description, redirect_url, webhook_url, metadata
    ) VALUES (
        p_transaction_id, realpay_reference, 'payment', 'card',
        p_amount, p_currency, p_customer_email, p_customer_phone, p_customer_name,
        p_description, p_redirect_url, p_webhook_url, p_metadata
    ) RETURNING realpay_transaction_id INTO realpay_transaction_id;
    
    RETURN realpay_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process RealPay webhook
CREATE OR REPLACE FUNCTION process_realpay_webhook(
    p_event_type VARCHAR(100),
    p_event_data JSONB,
    p_signature TEXT
)
RETURNS UUID AS $$
DECLARE
    webhook_id UUID;
    realpay_transaction_id UUID;
    transaction_id UUID;
BEGIN
    -- Extract transaction reference from event data
    realpay_transaction_id := (p_event_data->>'transaction_id')::UUID;
    
    -- Insert webhook event
    INSERT INTO RealPayWebhookEvent (
        realpay_transaction_id, event_type, event_data, signature
    ) VALUES (
        realpay_transaction_id, p_event_type, p_event_data, p_signature
    ) RETURNING webhook_id INTO webhook_id;
    
    -- Get parent transaction ID
    SELECT transaction_id INTO transaction_id
    FROM RealPayTransaction
    WHERE realpay_transaction_id = realpay_transaction_id;
    
    -- Update transaction status based on event type
    CASE p_event_type
        WHEN 'payment.completed' THEN
            UPDATE RealPayTransaction
            SET status = 'completed',
                completed_at = NOW(),
                realpay_response = p_event_data,
                updated_at = NOW()
            WHERE realpay_transaction_id = realpay_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'paid',
                gateway_status = 'completed',
                completed_at = NOW(),
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.failed' THEN
            UPDATE RealPayTransaction
            SET status = 'failed',
                failed_at = NOW(),
                error_code = p_event_data->>'error_code',
                error_message = p_event_data->>'error_message',
                realpay_response = p_event_data,
                updated_at = NOW()
            WHERE realpay_transaction_id = realpay_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'failed',
                gateway_status = 'failed',
                failed_at = NOW(),
                failure_reason = p_event_data->>'error_message',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.pending' THEN
            UPDATE RealPayTransaction
            SET status = 'processing',
                realpay_response = p_event_data,
                updated_at = NOW()
            WHERE realpay_transaction_id = realpay_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'processing',
                gateway_status = 'pending',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
    END CASE;
    
    RETURN webhook_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create RealPay refund
CREATE OR REPLACE FUNCTION create_realpay_refund(
    p_realpay_transaction_id UUID,
    p_refund_amount DECIMAL(15,2),
    p_refund_reason TEXT
)
RETURNS UUID AS $$
DECLARE
    refund_id UUID;
    refund_reference VARCHAR(255);
    original_amount DECIMAL(15,2);
BEGIN
    -- Get original transaction amount
    SELECT amount INTO original_amount
    FROM RealPayTransaction
    WHERE realpay_transaction_id = p_realpay_transaction_id;
    
    -- Validate refund amount
    IF p_refund_amount > original_amount THEN
        RAISE EXCEPTION 'Refund amount cannot exceed original transaction amount';
    END IF;
    
    -- Generate refund reference
    refund_reference := 'REF-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);
    
    -- Create refund record
    INSERT INTO RealPayRefund (
        realpay_transaction_id, refund_reference, refund_amount, refund_reason
    ) VALUES (
        p_realpay_transaction_id, refund_reference, p_refund_amount, p_refund_reason
    ) RETURNING refund_id INTO refund_id;
    
    RETURN refund_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get RealPay analytics
CREATE OR REPLACE FUNCTION get_realpay_analytics(
    p_property_id INTEGER DEFAULT NULL,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_transactions BIGINT,
    successful_transactions BIGINT,
    failed_transactions BIGINT,
    total_volume DECIMAL(15,2),
    successful_volume DECIMAL(15,2),
    failed_volume DECIMAL(15,2),
    success_rate DECIMAL(5,2),
    average_transaction_amount DECIMAL(10,2),
    total_refunds BIGINT,
    refund_amount DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(rpt.realpay_transaction_id)::BIGINT as total_transactions,
        COUNT(rpt.realpay_transaction_id) FILTER (WHERE rpt.status = 'completed')::BIGINT as successful_transactions,
        COUNT(rpt.realpay_transaction_id) FILTER (WHERE rpt.status = 'failed')::BIGINT as failed_transactions,
        COALESCE(SUM(rpt.amount), 0)::DECIMAL(15,2) as total_volume,
        COALESCE(SUM(rpt.amount) FILTER (WHERE rpt.status = 'completed'), 0)::DECIMAL(15,2) as successful_volume,
        COALESCE(SUM(rpt.amount) FILTER (WHERE rpt.status = 'failed'), 0)::DECIMAL(15,2) as failed_volume,
        ROUND(
            (COUNT(rpt.realpay_transaction_id) FILTER (WHERE rpt.status = 'completed')::DECIMAL / 
             NULLIF(COUNT(rpt.realpay_transaction_id), 0)) * 100, 2
        ) as success_rate,
        COALESCE(AVG(rpt.amount), 0)::DECIMAL(10,2) as average_transaction_amount,
        COUNT(rpr.refund_id)::BIGINT as total_refunds,
        COALESCE(SUM(rpr.refund_amount), 0)::DECIMAL(15,2) as refund_amount
    FROM RealPayTransaction rpt
    LEFT JOIN RealPayRefund rpr ON rpt.realpay_transaction_id = rpr.realpay_transaction_id
    LEFT JOIN PaymentTransaction pt ON rpt.transaction_id = pt.transaction_id
    WHERE (p_property_id IS NULL OR pt.property_id = p_property_id)
      AND rpt.created_at::DATE BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_realpay_transaction_transaction ON RealPayTransaction(transaction_id);
CREATE INDEX idx_realpay_transaction_reference ON RealPayTransaction(realpay_reference);
CREATE INDEX idx_realpay_transaction_status ON RealPayTransaction(status);
CREATE INDEX idx_realpay_transaction_created_at ON RealPayTransaction(created_at);
CREATE INDEX idx_realpay_webhook_event_transaction ON RealPayWebhookEvent(realpay_transaction_id);
CREATE INDEX idx_realpay_webhook_event_type ON RealPayWebhookEvent(event_type);
CREATE INDEX idx_realpay_webhook_event_processed ON RealPayWebhookEvent(processed);
CREATE INDEX idx_realpay_refund_transaction ON RealPayRefund(realpay_transaction_id);
CREATE INDEX idx_realpay_refund_reference ON RealPayRefund(refund_reference);
CREATE INDEX idx_realpay_settlement_date ON RealPaySettlement(settlement_date);

-- Enable RLS
ALTER TABLE RealPayTransaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE RealPayWebhookEvent ENABLE ROW LEVEL SECURITY;
ALTER TABLE RealPayRefund ENABLE ROW LEVEL SECURITY;
ALTER TABLE RealPaySettlement ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow property staff to view RealPay transactions"
  ON RealPayTransaction
  FOR SELECT
  TO authenticated
  USING (transaction_id IN (
    SELECT pt.transaction_id FROM PaymentTransaction pt
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

CREATE POLICY "Allow system to manage RealPay webhook events"
  ON RealPayWebhookEvent
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to manage RealPay refunds"
  ON RealPayRefund
  FOR ALL
  TO authenticated
  USING (realpay_transaction_id IN (
    SELECT rpt.realpay_transaction_id FROM RealPayTransaction rpt
    JOIN PaymentTransaction pt ON rpt.transaction_id = pt.transaction_id
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to view RealPay settlements"
  ON RealPaySettlement
  FOR SELECT
  TO authenticated
  USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_realpay_transaction_updated_at 
    BEFORE UPDATE ON RealPayTransaction 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_refund_updated_at 
    BEFORE UPDATE ON RealPayRefund 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_realpay_settlement_updated_at 
    BEFORE UPDATE ON RealPaySettlement 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
