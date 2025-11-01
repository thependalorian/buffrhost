-- Migration: 001_create_staff_tables.sql
-- Creates staff management tables for Buffr Host
-- Solves multi-tasking crisis at Etuna Guesthouse & Tours

-- Staff table (core employee information)
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    hire_date DATE NOT NULL,
    salary DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    shift_type VARCHAR(20) CHECK (shift_type IN ('morning', 'afternoon', 'evening', 'night', 'rotating')),
    manager_id UUID REFERENCES users(id),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff schedules table (solves manual scheduling)
CREATE TABLE IF NOT EXISTS staff_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INTEGER DEFAULT 0,
    shift_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Staff activities table (tracks what staff are doing)
CREATE TABLE IF NOT EXISTS staff_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    property_id UUID REFERENCES properties(id),
    customer_id UUID REFERENCES crm_customers(id),
    booking_id UUID REFERENCES bookings(id),
    order_id UUID REFERENCES orders(id),
    duration_minutes INTEGER,
    status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff performance table (tracks KPIs)
CREATE TABLE IF NOT EXISTS staff_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12, 2),
    metric_unit VARCHAR(50),
    target_value DECIMAL(12, 2),
    performance_period_start DATE,
    performance_period_end DATE,
    trend VARCHAR(20) CHECK (trend IN ('improving', 'stable', 'declining')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_tenant_id ON staff(tenant_id);
CREATE INDEX IF NOT EXISTS idx_staff_property_id ON staff(property_id);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_date ON staff_schedules(shift_date);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_staff ON staff_schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_activities_created ON staff_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_staff_activities_staff ON staff_activities(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_performance_staff ON staff_performance(staff_id);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_schedules_updated_at BEFORE UPDATE ON staff_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_activities_updated_at BEFORE UPDATE ON staff_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_performance_updated_at BEFORE UPDATE ON staff_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE staff IS 'Core staff information for multi-tenant hospitality management';
COMMENT ON TABLE staff_schedules IS 'Staff shift schedules to solve manual scheduling issues';
COMMENT ON TABLE staff_activities IS 'Tracks staff activities and performance metrics';
COMMENT ON TABLE staff_performance IS 'KPI tracking for staff performance evaluation';
