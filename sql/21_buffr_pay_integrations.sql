-- Buffr Pay Payment Gateway Integrations
-- Tables for managing Buffr Pay configurations, transactions, and cross-project payments.
-- Integrates with Buffr Payment Companion for seamless payment processing.

-- Buffr Pay Configuration Table
-- Updated to align with actual Buffr Payment Companion API structure
CREATE TABLE buffr_pay_configs (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE, -- Optional, for Buffr Host
    project_name VARCHAR(100) NOT NULL, -- e.g., 'buffrlend', 'buffrsign', 'buffrhost'
    merchant_id VARCHAR(255) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    api_key_hash TEXT NOT NULL,
    webhook_secret TEXT NOT NULL,
    test_mode BOOLEAN DEFAULT TRUE,
    live_api_url TEXT DEFAULT 'https://pay.buffr.ai',
    test_api_url TEXT DEFAULT 'https://pay.buffr.ai',
    webhook_url TEXT,
    supported_currencies TEXT[] DEFAULT ARRAY['NAD', 'USD', 'ZAR', 'BWP'], -- SADC currencies
    supported_payment_methods TEXT[] DEFAULT ARRAY['card', 'bank_transfer', 'mobile_money', 'wallet'],
    fineract_integration BOOLEAN DEFAULT TRUE, -- Buffr Payment Companion uses Fineract
    namqr_support BOOLEAN DEFAULT TRUE, -- NAMQR code support for Namibia
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Buffr Pay Transactions Table
CREATE TABLE buffr_pay_transactions (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES buffr_pay_configs(config_id),
    user_id UUID REFERENCES profiles(id), -- Link to unified profiles table
    customer_id UUID REFERENCES Customer(customer_id), -- Link to hospitality customers
    property_id INTEGER REFERENCES HospitalityProperty(property_id), -- For hospitality payments
    order_id UUID REFERENCES "Order"(order_id), -- Link to hospitality orders
    reservation_id UUID REFERENCES RoomReservation(reservation_id), -- For room bookings
    booking_id UUID REFERENCES ServiceBooking(booking_id), -- For service bookings
    corporate_booking_id UUID REFERENCES CorporateBooking(corporate_booking_id), -- For corporate bookings
    
    -- Transaction Details
    merchant_reference VARCHAR(255) NOT NULL,
    buffr_pay_reference VARCHAR(255) UNIQUE, -- Buffr Pay's unique transaction reference
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    payment_method VARCHAR(50) NOT NULL, -- 'card', 'bank_transfer', 'mobile_money', 'wallet'
    payment_type VARCHAR(50) NOT NULL, -- 'restaurant', 'hotel', 'spa', 'conference', 'transportation', 'recreation', 'corporate'
    
    -- Transaction Status
    status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
    result_code VARCHAR(10), -- Buffr Pay result code
    error_code VARCHAR(10),
    error_message TEXT,
    
    -- Payment Details
    payer_name VARCHAR(255),
    payer_email VARCHAR(255),
    payer_phone VARCHAR(20),
    payer_id_number VARCHAR(50), -- For KYC compliance
    
    -- Cross-Project Integration
    source_project VARCHAR(100), -- Project that initiated the payment
    target_project VARCHAR(100), -- Project that will receive the payment
    integration_reference VARCHAR(255), -- Reference for cross-project tracking
    
    -- Timestamps
    initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Request/Response Data
    request_payload JSONB,
    response_payload JSONB,
    webhook_payload JSONB,
    
    -- Additional Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Buffr Pay Payment Methods Table (for storing customer payment preferences)
CREATE TABLE buffr_pay_payment_methods (
    payment_method_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES buffr_pay_configs(config_id),
    user_id UUID REFERENCES profiles(id),
    customer_id UUID REFERENCES Customer(customer_id),
    
    -- Payment Method Details
    method_type VARCHAR(50) NOT NULL, -- 'card', 'bank_account', 'mobile_money', 'wallet'
    method_name VARCHAR(255) NOT NULL, -- User-friendly name
    is_default BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Encrypted Payment Details
    encrypted_details TEXT NOT NULL, -- Encrypted payment method details
    token VARCHAR(255) UNIQUE, -- Buffr Pay token for this payment method
    last_four_digits VARCHAR(4), -- For cards
    expiry_month INTEGER, -- For cards
    expiry_year INTEGER, -- For cards
    bank_name VARCHAR(255), -- For bank accounts
    account_type VARCHAR(50), -- 'savings', 'checking', 'business'
    
    -- Verification Status
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'failed'
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_attempts INTEGER DEFAULT 0,
    
    -- Usage Tracking
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Buffr Pay Refunds Table
CREATE TABLE buffr_pay_refunds (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES buffr_pay_transactions(transaction_id),
    config_id UUID REFERENCES buffr_pay_configs(config_id),
    
    -- Refund Details
    refund_reference VARCHAR(255) UNIQUE NOT NULL,
    buffr_pay_refund_id VARCHAR(255) UNIQUE, -- Buffr Pay's refund reference
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    
    -- Refund Processing
    processed_by VARCHAR(255), -- User who initiated the refund
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Request/Response Data
    request_payload JSONB,
    response_payload JSONB,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Buffr Pay Webhook Events Table
CREATE TABLE buffr_pay_webhook_events (
    webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES buffr_pay_configs(config_id),
    transaction_id UUID REFERENCES buffr_pay_transactions(transaction_id),
    
    -- Webhook Details
    event_type VARCHAR(100) NOT NULL, -- 'payment.completed', 'payment.failed', 'refund.processed', etc.
    webhook_signature VARCHAR(255) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    -- Event Data
    event_payload JSONB NOT NULL,
    processing_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'failed'
    processing_error TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buffr Pay Cross-Project Transfers Table
CREATE TABLE buffr_pay_cross_project_transfers (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_transaction_id UUID REFERENCES buffr_pay_transactions(transaction_id),
    target_transaction_id UUID REFERENCES buffr_pay_transactions(transaction_id),
    
    -- Transfer Details
    transfer_reference VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    transfer_type VARCHAR(50) NOT NULL, -- 'revenue_share', 'refund', 'settlement'
    
    -- Source and Target
    source_project VARCHAR(100) NOT NULL,
    target_project VARCHAR(100) NOT NULL,
    source_property_id INTEGER REFERENCES HospitalityProperty(property_id),
    target_property_id INTEGER REFERENCES HospitalityProperty(property_id),
    
    -- Transfer Status
    status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Transfer Details
    net_amount DECIMAL(15,2), -- Net transfer amount
    
    -- Metadata
    transfer_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Buffr Pay Settlement Reports Table
CREATE TABLE buffr_pay_settlement_reports (
    settlement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES buffr_pay_configs(config_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id),
    
    -- Settlement Period
    settlement_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Settlement Summary
    total_transactions INTEGER NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    total_fees DECIMAL(15,2) NOT NULL,
    net_settlement DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'NAD',
    
    -- Settlement Status
    status VARCHAR(50) NOT NULL, -- 'pending', 'processing', 'completed', 'failed'
    settlement_reference VARCHAR(255) UNIQUE,
    processed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Settlement Details
    settlement_method VARCHAR(50), -- 'bank_transfer', 'wallet', 'check'
    bank_account_details JSONB,
    settlement_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for Performance
CREATE INDEX idx_buffr_pay_configs_project ON buffr_pay_configs(project_name);
CREATE INDEX idx_buffr_pay_configs_property ON buffr_pay_configs(property_id);
CREATE INDEX idx_buffr_pay_configs_active ON buffr_pay_configs(is_active);

CREATE INDEX idx_buffr_pay_transactions_user ON buffr_pay_transactions(user_id);
CREATE INDEX idx_buffr_pay_transactions_customer ON buffr_pay_transactions(customer_id);
CREATE INDEX idx_buffr_pay_transactions_property ON buffr_pay_transactions(property_id);
CREATE INDEX idx_buffr_pay_transactions_order ON buffr_pay_transactions(order_id);
CREATE INDEX idx_buffr_pay_transactions_reservation ON buffr_pay_transactions(reservation_id);
CREATE INDEX idx_buffr_pay_transactions_booking ON buffr_pay_transactions(booking_id);
CREATE INDEX idx_buffr_pay_transactions_corporate ON buffr_pay_transactions(corporate_booking_id);
CREATE INDEX idx_buffr_pay_transactions_status ON buffr_pay_transactions(status);
CREATE INDEX idx_buffr_pay_transactions_reference ON buffr_pay_transactions(buffr_pay_reference);
CREATE INDEX idx_buffr_pay_transactions_merchant_ref ON buffr_pay_transactions(merchant_reference);
CREATE INDEX idx_buffr_pay_transactions_created_at ON buffr_pay_transactions(created_at);

CREATE INDEX idx_buffr_pay_payment_methods_user ON buffr_pay_payment_methods(user_id);
CREATE INDEX idx_buffr_pay_payment_methods_customer ON buffr_pay_payment_methods(customer_id);
CREATE INDEX idx_buffr_pay_payment_methods_active ON buffr_pay_payment_methods(is_active);
CREATE INDEX idx_buffr_pay_payment_methods_default ON buffr_pay_payment_methods(is_default);

CREATE INDEX idx_buffr_pay_refunds_transaction ON buffr_pay_refunds(transaction_id);
CREATE INDEX idx_buffr_pay_refunds_status ON buffr_pay_refunds(status);
CREATE INDEX idx_buffr_pay_refunds_reference ON buffr_pay_refunds(refund_reference);

CREATE INDEX idx_buffr_pay_webhook_events_config ON buffr_pay_webhook_events(config_id);
CREATE INDEX idx_buffr_pay_webhook_events_transaction ON buffr_pay_webhook_events(transaction_id);
CREATE INDEX idx_buffr_pay_webhook_events_type ON buffr_pay_webhook_events(event_type);
CREATE INDEX idx_buffr_pay_webhook_events_status ON buffr_pay_webhook_events(processing_status);

CREATE INDEX idx_buffr_pay_cross_project_source ON buffr_pay_cross_project_transfers(source_transaction_id);
CREATE INDEX idx_buffr_pay_cross_project_target ON buffr_pay_cross_project_transfers(target_transaction_id);
CREATE INDEX idx_buffr_pay_cross_project_status ON buffr_pay_cross_project_transfers(status);

CREATE INDEX idx_buffr_pay_settlement_config ON buffr_pay_settlement_reports(config_id);
CREATE INDEX idx_buffr_pay_settlement_property ON buffr_pay_settlement_reports(property_id);
CREATE INDEX idx_buffr_pay_settlement_date ON buffr_pay_settlement_reports(settlement_date);
CREATE INDEX idx_buffr_pay_settlement_status ON buffr_pay_settlement_reports(status);

-- Row Level Security (RLS) Policies
ALTER TABLE buffr_pay_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_cross_project_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffr_pay_settlement_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Buffr Pay Configs
CREATE POLICY "Allow authenticated users to manage buffr_pay_configs"
    ON buffr_pay_configs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Buffr Pay Transactions
CREATE POLICY "Allow users to view their own transactions"
    ON buffr_pay_transactions
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow property managers to view property transactions"
    ON buffr_pay_transactions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM Buffr HostUser 
            WHERE owner_id = auth.uid() 
            AND property_id = buffr_pay_transactions.property_id
        )
    );

CREATE POLICY "Allow system to insert transactions"
    ON buffr_pay_transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policies for Payment Methods
CREATE POLICY "Allow users to manage their own payment methods"
    ON buffr_pay_payment_methods
    FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- RLS Policies for Refunds
CREATE POLICY "Allow property managers to manage refunds"
    ON buffr_pay_refunds
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM Buffr HostUser 
            WHERE owner_id = auth.uid() 
            AND property_id = (
                SELECT property_id FROM buffr_pay_transactions 
                WHERE transaction_id = buffr_pay_refunds.transaction_id
            )
        )
    );

-- RLS Policies for Webhook Events
CREATE POLICY "Allow system to manage webhook events"
    ON buffr_pay_webhook_events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Cross-Project Transfers
CREATE POLICY "Allow system to manage cross-project transfers"
    ON buffr_pay_cross_project_transfers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for Settlement Reports
CREATE POLICY "Allow property managers to view settlement reports"
    ON buffr_pay_settlement_reports
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM Buffr HostUser 
            WHERE owner_id = auth.uid() 
            AND property_id = buffr_pay_settlement_reports.property_id
        )
    );

-- Add updated_at triggers
CREATE TRIGGER update_buffr_pay_configs_updated_at
    BEFORE UPDATE ON buffr_pay_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buffr_pay_transactions_updated_at
    BEFORE UPDATE ON buffr_pay_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buffr_pay_payment_methods_updated_at
    BEFORE UPDATE ON buffr_pay_payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buffr_pay_refunds_updated_at
    BEFORE UPDATE ON buffr_pay_refunds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buffr_pay_cross_project_transfers_updated_at
    BEFORE UPDATE ON buffr_pay_cross_project_transfers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buffr_pay_settlement_reports_updated_at
    BEFORE UPDATE ON buffr_pay_settlement_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing with actual Buffr Payment Companion configuration
INSERT INTO buffr_pay_configs (
    project_name, 
    merchant_id, 
    api_key_encrypted, 
    api_key_hash, 
    webhook_secret,
    test_mode,
    live_api_url,
    test_api_url,
    webhook_url,
    supported_currencies,
    supported_payment_methods,
    fineract_integration,
    namqr_support
) VALUES (
    'buffrhost',
    'ETUNA_MERCHANT_001',
    'encrypted_api_key_here',
    'hashed_api_key_here',
    'webhook_secret_here',
    TRUE,
    'https://pay.buffr.ai',
    'https://pay.buffr.ai',
    'https://buffrhost.com/api/webhooks/buffr-pay',
    ARRAY['NAD', 'USD', 'ZAR', 'BWP'],
    ARRAY['card', 'bank_transfer', 'mobile_money', 'wallet'],
    TRUE,
    TRUE
);
