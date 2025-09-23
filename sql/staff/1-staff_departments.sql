-- Staff Department Management
-- Department and position management for hospitality staff

-- Staff Departments
CREATE TABLE StaffDepartment (
    department_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, department_name)
);

-- Staff Positions
CREATE TABLE StaffPosition (
    position_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES StaffDepartment(department_id) ON DELETE CASCADE,
    position_name VARCHAR(100) NOT NULL,
    description TEXT,
    hourly_rate NUMERIC(8,2),
    salary_range_min NUMERIC(10,2),
    salary_range_max NUMERIC(10,2),
    required_skills TEXT[],
    responsibilities TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, position_name)
);

-- Create updated_at triggers
CREATE TRIGGER update_staff_department_updated_at 
    BEFORE UPDATE ON StaffDepartment 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_position_updated_at 
    BEFORE UPDATE ON StaffPosition 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
