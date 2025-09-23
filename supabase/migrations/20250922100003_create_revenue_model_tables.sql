CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    plan_name VARCHAR(255) NOT NULL,
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'active',
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NAD',
    billing_period VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE service_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fee_type VARCHAR(50),
    value NUMERIC(10, 2) NOT NULL,
    applies_to VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commission_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    commission_type VARCHAR(50),
    value NUMERIC(10, 2) NOT NULL,
    applies_to_role VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    invoice_number VARCHAR(255) UNIQUE NOT NULL,
    issue_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NAD',
    status VARCHAR(50) DEFAULT 'pending',
    items JSONB,
    payment_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies (example - adjust as needed)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to manage all subscriptions" ON subscriptions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow all authenticated users to view service fees" ON service_fees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage service fees" ON service_fees FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow all authenticated users to view commission structures" ON commission_structures FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage commission structures" ON commission_structures FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow users to view their own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow admins to manage all invoices" ON invoices FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
