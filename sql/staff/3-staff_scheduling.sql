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
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    work_quality_rating INTEGER CHECK (work_quality_rating >= 1 AND work_quality_rating <= 5),
    teamwork_rating INTEGER CHECK (teamwork_rating >= 1 AND teamwork_rating <= 5),
    customer_service_rating INTEGER CHECK (customer_service_rating >= 1 AND customer_service_rating <= 5),
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
    communication_type VARCHAR(20) DEFAULT 'message',
    priority VARCHAR(20) DEFAULT 'normal',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Leave Requests
CREATE TABLE StaffLeaveRequest (
    leave_request_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    leave_type VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by VARCHAR(255) REFERENCES BuffrHostUser(owner_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Create updated_at triggers
CREATE TRIGGER update_staff_performance_updated_at 
    BEFORE UPDATE ON StaffPerformance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
