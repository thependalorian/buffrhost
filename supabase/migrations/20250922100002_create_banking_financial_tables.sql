CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    account_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    routing_number VARCHAR(255),
    currency VARCHAR(10) DEFAULT 'NAD',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES bank_accounts(id),
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NAD',
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    api_key TEXT,
    secret_key TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE disbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID UNIQUE REFERENCES transactions(id),
    source_account_id UUID NOT NULL REFERENCES bank_accounts(id),
    destination_account_details JSONB NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NAD',
    status VARCHAR(50) DEFAULT 'pending',
    disbursement_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies (example - adjust as needed)
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE disbursements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to manage their own bank accounts" ON bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to manage all bank accounts" ON bank_accounts FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow users to view their own transactions" ON transactions FOR SELECT USING (EXISTS (SELECT 1 FROM bank_accounts WHERE id = account_id AND user_id = auth.uid()));
CREATE POLICY "Allow admins to manage all transactions" ON transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admins to manage payment gateways" ON payment_gateways FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow users to view their own disbursements" ON disbursements FOR SELECT USING (EXISTS (SELECT 1 FROM bank_accounts WHERE id = source_account_id AND user_id = auth.uid()));
CREATE POLICY "Allow admins to manage all disbursements" ON disbursements FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
