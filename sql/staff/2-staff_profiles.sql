-- Staff Profile Management
-- Extended staff information and profiles

-- Staff Profiles
CREATE TABLE StaffProfile (
    staff_id VARCHAR(255) PRIMARY KEY REFERENCES BuffrHostUser(owner_id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES StaffDepartment(department_id),
    position_id INTEGER REFERENCES StaffPosition(position_id),
    hire_date DATE NOT NULL,
    employment_type employment_type_enum DEFAULT 'full_time',
    employment_status employment_status_enum DEFAULT 'active',
    phone VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    national_id VARCHAR(50),
    tax_id VARCHAR(50),
    bank_account VARCHAR(50),
    skills TEXT[],
    certifications TEXT[],
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Schedules
CREATE TABLE StaffSchedule (
    schedule_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 30,
    shift_type VARCHAR(20) DEFAULT 'regular',
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(staff_id, schedule_date, start_time)
);

-- Staff Attendance
CREATE TABLE StaffAttendance (
    attendance_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES StaffSchedule(schedule_id),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    break_start_time TIMESTAMP WITH TIME ZONE,
    break_end_time TIMESTAMP WITH TIME ZONE,
    total_hours_worked NUMERIC(4,2),
    overtime_hours NUMERIC(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'present',
    notes TEXT,
    approved_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Tasks
CREATE TABLE StaffTask (
    task_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    assigned_to VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    assigned_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) DEFAULT 'assigned',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER,
    actual_duration INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at triggers
CREATE TRIGGER update_staff_profile_updated_at 
    BEFORE UPDATE ON StaffProfile 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_schedule_updated_at 
    BEFORE UPDATE ON StaffSchedule 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_attendance_updated_at 
    BEFORE UPDATE ON StaffAttendance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_task_updated_at 
    BEFORE UPDATE ON StaffTask 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
