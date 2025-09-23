-- Adume Payment Integration
-- Comprehensive Adume payment gateway integration for Namibia

-- Adume transaction types enum
CREATE TYPE adume_transaction_type_enum AS ENUM (
    'payment',
    'refund',
    'partial_refund',
    'void',
    'capture',
    'authorize'
);

-- Adume transaction status enum
CREATE TYPE adume_transaction_status_enum AS ENUM (
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

-- Adume payment methods enum
CREATE TYPE adume_payment_method_enum AS ENUM (
    'card',
    'bank_transfer',
    'wallet',
    'mobile_money',
    'eft',
    'instant_eft',
    'qr_code',
    'nfc'
);

-- Adume transactions table
CREATE TABLE AdumeTransaction (
    adume_transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES PaymentTransaction(transaction_id) ON DELETE CASCADE,
    adume_reference VARCHAR(255) UNIQUE NOT NULL,
    adume_transaction_id VARCHAR(255),
    transaction_type adume_transaction_type_enum NOT NULL,
    status adume_transaction_status_enum DEFAULT 'initiated',
    payment_method adume_payment_method_enum NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'NAD',
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    description TEXT,
    redirect_url TEXT,
    webhook_url TEXT,
    qr_code TEXT,
    nfc_data TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    adume_response JSONB,
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

-- Adume webhook events table
CREATE TABLE AdumeWebhookEvent (
    webhook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adume_transaction_id UUID REFERENCES AdumeTransaction(adume_transaction_id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    signature TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    processed BOOLEAN DEFAULT FALSE,
    processing_attempts INTEGER DEFAULT 0,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Adume refunds table
CREATE TABLE AdumeRefund (
    refund_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adume_transaction_id UUID REFERENCES AdumeTransaction(adume_transaction_id),
    refund_reference VARCHAR(255) UNIQUE NOT NULL,
    adume_refund_id VARCHAR(255),
    refund_amount DECIMAL(15,2) NOT NULL,
    refund_reason TEXT,
    refund_status VARCHAR(50) DEFAULT 'pending',
    adume_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adume settlement table
CREATE TABLE AdumeSettlement (
    settlement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    settlement_reference VARCHAR(255) UNIQUE NOT NULL,
    settlement_date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0.00,
    total_fees DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(15,2) DEFAULT 0.00,
    settlement_status VARCHAR(50) DEFAULT 'pending',
    adume_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adume QR code table
CREATE TABLE AdumeQRCode (
    qr_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adume_transaction_id UUID REFERENCES AdumeTransaction(adume_transaction_id),
    qr_code TEXT NOT NULL,
    qr_image_url TEXT,
    qr_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    scanned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adume NFC data table
CREATE TABLE AdumeNFCData (
    nfc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adume_transaction_id UUID REFERENCES AdumeTransaction(adume_transaction_id),
    nfc_data TEXT NOT NULL,
    nfc_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to create Adume payment
CREATE OR REPLACE FUNCTION create_adume_payment(
    p_transaction_id UUID,
    p_amount DECIMAL(15,2),
    p_currency VARCHAR(3),
    p_customer_email VARCHAR(255),
    p_customer_phone VARCHAR(20),
    p_customer_name VARCHAR(255),
    p_description TEXT,
    p_redirect_url TEXT,
    p_webhook_url TEXT,
    p_payment_method adume_payment_method_enum,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    adume_transaction_id UUID;
    adume_reference VARCHAR(255);
BEGIN
    -- Generate Adume reference
    adume_reference := 'AD-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);
    
    -- Create Adume transaction
    INSERT INTO AdumeTransaction (
        transaction_id, adume_reference, transaction_type, payment_method,
        amount, currency, customer_email, customer_phone, customer_name,
        description, redirect_url, webhook_url, metadata
    ) VALUES (
        p_transaction_id, adume_reference, 'payment', p_payment_method,
        p_amount, p_currency, p_customer_email, p_customer_phone, p_customer_name,
        p_description, p_redirect_url, p_webhook_url, p_metadata
    ) RETURNING adume_transaction_id INTO adume_transaction_id;
    
    RETURN adume_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process Adume webhook
CREATE OR REPLACE FUNCTION process_adume_webhook(
    p_event_type VARCHAR(100),
    p_event_data JSONB,
    p_signature TEXT
)
RETURNS UUID AS $$
DECLARE
    webhook_id UUID;
    adume_transaction_id UUID;
    transaction_id UUID;
BEGIN
    -- Extract transaction reference from event data
    adume_transaction_id := (p_event_data->>'transaction_id')::UUID;
    
    -- Insert webhook event
    INSERT INTO AdumeWebhookEvent (
        adume_transaction_id, event_type, event_data, signature
    ) VALUES (
        adume_transaction_id, p_event_type, p_event_data, p_signature
    ) RETURNING webhook_id INTO webhook_id;
    
    -- Get parent transaction ID
    SELECT transaction_id INTO transaction_id
    FROM AdumeTransaction
    WHERE adume_transaction_id = adume_transaction_id;
    
    -- Update transaction status based on event type
    CASE p_event_type
        WHEN 'payment.completed' THEN
            UPDATE AdumeTransaction
            SET status = 'completed',
                completed_at = NOW(),
                adume_response = p_event_data,
                updated_at = NOW()
            WHERE adume_transaction_id = adume_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'paid',
                gateway_status = 'completed',
                completed_at = NOW(),
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.failed' THEN
            UPDATE AdumeTransaction
            SET status = 'failed',
                failed_at = NOW(),
                error_code = p_event_data->>'error_code',
                error_message = p_event_data->>'error_message',
                adume_response = p_event_data,
                updated_at = NOW()
            WHERE adume_transaction_id = adume_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'failed',
                gateway_status = 'failed',
                failed_at = NOW(),
                failure_reason = p_event_data->>'error_message',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'payment.pending' THEN
            UPDATE AdumeTransaction
            SET status = 'processing',
                adume_response = p_event_data,
                updated_at = NOW()
            WHERE adume_transaction_id = adume_transaction_id;
            
            UPDATE PaymentTransaction
            SET payment_status = 'processing',
                gateway_status = 'pending',
                updated_at = NOW()
            WHERE transaction_id = transaction_id;
            
        WHEN 'qr.scanned' THEN
            UPDATE AdumeQRCode
            SET scanned_at = NOW()
            WHERE adume_transaction_id = adume_transaction_id;
            
        WHEN 'nfc.used' THEN
            UPDATE AdumeNFCData
            SET used_at = NOW()
            WHERE adume_transaction_id = adume_transaction_id;
    END CASE;
    
    RETURN webhook_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create Adume refund
CREATE OR REPLACE FUNCTION create_adume_refund(
    p_adume_transaction_id UUID,
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
    FROM AdumeTransaction
    WHERE adume_transaction_id = p_adume_transaction_id;
    
    -- Validate refund amount
    IF p_refund_amount > original_amount THEN
        RAISE EXCEPTION 'Refund amount cannot exceed original transaction amount';
    END IF;
    
    -- Generate refund reference
    refund_reference := 'AD-REF-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || SUBSTRING(gen_random_uuid()::TEXT, 1, 8);
    
    -- Create refund record
    INSERT INTO AdumeRefund (
        adume_transaction_id, refund_reference, refund_amount, refund_reason
    ) VALUES (
        p_adume_transaction_id, refund_reference, p_refund_amount, p_refund_reason
    ) RETURNING refund_id INTO refund_id;
    
    RETURN refund_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate Adume QR code
CREATE OR REPLACE FUNCTION generate_adume_qr_code(
    p_adume_transaction_id UUID,
    p_qr_code TEXT,
    p_qr_image_url TEXT,
    p_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS UUID AS $$
DECLARE
    qr_id UUID;
BEGIN
    INSERT INTO AdumeQRCode (
        adume_transaction_id, qr_code, qr_image_url, qr_expires_at
    ) VALUES (
        p_adume_transaction_id, p_qr_code, p_qr_image_url, p_expires_at
    ) RETURNING qr_id INTO qr_id;
    
    RETURN qr_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate Adume NFC data
CREATE OR REPLACE FUNCTION generate_adume_nfc_data(
    p_adume_transaction_id UUID,
    p_nfc_data TEXT,
    p_nfc_type VARCHAR(50)
)
RETURNS UUID AS $$
DECLARE
    nfc_id UUID;
BEGIN
    INSERT INTO AdumeNFCData (
        adume_transaction_id, nfc_data, nfc_type
    ) VALUES (
        p_adume_transaction_id, p_nfc_data, p_nfc_type
    ) RETURNING nfc_id INTO nfc_id;
    
    RETURN nfc_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get Adume analytics
CREATE OR REPLACE FUNCTION get_adume_analytics(
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
    refund_amount DECIMAL(15,2),
    qr_scans BIGINT,
    nfc_usage BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(at.adume_transaction_id)::BIGINT as total_transactions,
        COUNT(at.adume_transaction_id) FILTER (WHERE at.status = 'completed')::BIGINT as successful_transactions,
        COUNT(at.adume_transaction_id) FILTER (WHERE at.status = 'failed')::BIGINT as failed_transactions,
        COALESCE(SUM(at.amount), 0)::DECIMAL(15,2) as total_volume,
        COALESCE(SUM(at.amount) FILTER (WHERE at.status = 'completed'), 0)::DECIMAL(15,2) as successful_volume,
        COALESCE(SUM(at.amount) FILTER (WHERE at.status = 'failed'), 0)::DECIMAL(15,2) as failed_volume,
        ROUND(
            (COUNT(at.adume_transaction_id) FILTER (WHERE at.status = 'completed')::DECIMAL / 
             NULLIF(COUNT(at.adume_transaction_id), 0)) * 100, 2
        ) as success_rate,
        COALESCE(AVG(at.amount), 0)::DECIMAL(10,2) as average_transaction_amount,
        COUNT(ar.refund_id)::BIGINT as total_refunds,
        COALESCE(SUM(ar.refund_amount), 0)::DECIMAL(15,2) as refund_amount,
        COUNT(aqc.qr_id) FILTER (WHERE aqc.scanned_at IS NOT NULL)::BIGINT as qr_scans,
        COUNT(and.nfc_id) FILTER (WHERE and.used_at IS NOT NULL)::BIGINT as nfc_usage
    FROM AdumeTransaction at
    LEFT JOIN AdumeRefund ar ON at.adume_transaction_id = ar.adume_transaction_id
    LEFT JOIN AdumeQRCode aqc ON at.adume_transaction_id = aqc.adume_transaction_id
    LEFT JOIN AdumeNFCData and ON at.adume_transaction_id = and.adume_transaction_id
    LEFT JOIN PaymentTransaction pt ON at.transaction_id = pt.transaction_id
    WHERE (p_property_id IS NULL OR pt.property_id = p_property_id)
      AND at.created_at::DATE BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_adume_transaction_transaction ON AdumeTransaction(transaction_id);
CREATE INDEX idx_adume_transaction_reference ON AdumeTransaction(adume_reference);
CREATE INDEX idx_adume_transaction_status ON AdumeTransaction(status);
CREATE INDEX idx_adume_transaction_created_at ON AdumeTransaction(created_at);
CREATE INDEX idx_adume_webhook_event_transaction ON AdumeWebhookEvent(adume_transaction_id);
CREATE INDEX idx_adume_webhook_event_type ON AdumeWebhookEvent(event_type);
CREATE INDEX idx_adume_webhook_event_processed ON AdumeWebhookEvent(processed);
CREATE INDEX idx_adume_refund_transaction ON AdumeRefund(adume_transaction_id);
CREATE INDEX idx_adume_refund_reference ON AdumeRefund(refund_reference);
CREATE INDEX idx_adume_settlement_date ON AdumeSettlement(settlement_date);
CREATE INDEX idx_adume_qr_code_transaction ON AdumeQRCode(adume_transaction_id);
CREATE INDEX idx_adume_qr_code_active ON AdumeQRCode(is_active);
CREATE INDEX idx_adume_nfc_data_transaction ON AdumeNFCData(adume_transaction_id);
CREATE INDEX idx_adume_nfc_data_active ON AdumeNFCData(is_active);

-- Enable RLS
ALTER TABLE AdumeTransaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeWebhookEvent ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeRefund ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeSettlement ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeQRCode ENABLE ROW LEVEL SECURITY;
ALTER TABLE AdumeNFCData ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow property staff to view Adume transactions"
  ON AdumeTransaction
  FOR SELECT
  TO authenticated
  USING (transaction_id IN (
    SELECT pt.transaction_id FROM PaymentTransaction pt
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

CREATE POLICY "Allow system to manage Adume webhook events"
  ON AdumeWebhookEvent
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to manage Adume refunds"
  ON AdumeRefund
  FOR ALL
  TO authenticated
  USING (adume_transaction_id IN (
    SELECT at.adume_transaction_id FROM AdumeTransaction at
    JOIN PaymentTransaction pt ON at.transaction_id = pt.transaction_id
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to view Adume settlements"
  ON AdumeSettlement
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow property staff to manage Adume QR codes"
  ON AdumeQRCode
  FOR ALL
  TO authenticated
  USING (adume_transaction_id IN (
    SELECT at.adume_transaction_id FROM AdumeTransaction at
    JOIN PaymentTransaction pt ON at.transaction_id = pt.transaction_id
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

CREATE POLICY "Allow property staff to manage Adume NFC data"
  ON AdumeNFCData
  FOR ALL
  TO authenticated
  USING (adume_transaction_id IN (
    SELECT at.adume_transaction_id FROM AdumeTransaction at
    JOIN PaymentTransaction pt ON at.transaction_id = pt.transaction_id
    JOIN BuffrHostUser bhu ON pt.property_id = bhu.property_id
    WHERE bhu.owner_id = auth.uid()
  ));

-- Create updated_at triggers
CREATE TRIGGER update_adume_transaction_updated_at 
    BEFORE UPDATE ON AdumeTransaction 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adume_refund_updated_at 
    BEFORE UPDATE ON AdumeRefund 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adume_settlement_updated_at 
    BEFORE UPDATE ON AdumeSettlement 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
