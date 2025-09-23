-- Staff Performance and Communication
-- Performance reviews, communications, and leave management

-- Staff Performance Reviews
CREATE TABLE StaffPerformance (
    performance_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    reviewed_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    overall_rating performance_rating_enum,
    punctuality_rating performance_rating_enum,
    work_quality_rating performance_rating_enum,
    teamwork_rating performance_rating_enum,
    customer_service_rating performance_rating_enum,
    strengths TEXT,
    areas_for_improvement TEXT,
    goals TEXT,
    comments TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Communications
CREATE TABLE StaffCommunication (
    communication_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    sender_id VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    recipient_id VARCHAR(255) REFERENCES StaffProfile(staff_id),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    communication_type communication_type_enum DEFAULT 'message',
    priority communication_priority_enum DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Leave Requests
CREATE TABLE StaffLeaveRequest (
    leave_request_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    leave_type leave_type_enum NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status leave_status_enum DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Create updated_at triggers
CREATE TRIGGER update_staff_performance_updated_at 
    BEFORE UPDATE ON StaffPerformance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
