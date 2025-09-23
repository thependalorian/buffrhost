CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    job_title VARCHAR(255),
    department VARCHAR(255),
    hire_date DATE DEFAULT NOW(),
    salary NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay NUMERIC(10, 2) NOT NULL,
    net_pay NUMERIC(10, 2) NOT NULL,
    deductions JSONB,
    bonuses NUMERIC(10, 2) DEFAULT 0.0,
    payment_date DATE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tax_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    tax_year INTEGER NOT NULL,
    tax_id_number VARCHAR(255),
    tax_jurisdiction VARCHAR(255),
    tax_withheld NUMERIC(10, 2) DEFAULT 0.0,
    tax_filing_status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE benefit_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    benefit_type VARCHAR(255) NOT NULL,
    provider VARCHAR(255),
    enrollment_date DATE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active',
    employee_contribution NUMERIC(10, 2) DEFAULT 0.0,
    company_contribution NUMERIC(10, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies (example - adjust as needed)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to view employees" ON employees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage employees" ON employees FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow all authenticated users to view payroll records" ON payroll_records FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage payroll records" ON payroll_records FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow all authenticated users to view tax details" ON tax_details FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage tax details" ON tax_details FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow all authenticated users to view benefit enrollments" ON benefit_enrollments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins to manage benefit enrollments" ON benefit_enrollments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
