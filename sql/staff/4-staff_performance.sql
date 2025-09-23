-- Staff Performance Management
-- Performance tracking and evaluation

-- This file is intentionally minimal as most performance tables
-- were included in the previous staff_scheduling.sql file
-- Additional performance-related tables can be added here if needed

-- Staff Performance Metrics (Optional additional table)
CREATE TABLE StaffPerformanceMetrics (
    metric_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC(10,2) NOT NULL,
    metric_unit VARCHAR(50),
    measurement_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Training Records
CREATE TABLE StaffTraining (
    training_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    training_name VARCHAR(255) NOT NULL,
    training_type VARCHAR(100) NOT NULL,
    completion_date DATE,
    certification_expiry DATE,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at triggers
CREATE TRIGGER update_staff_training_updated_at 
    BEFORE UPDATE ON StaffTraining 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
