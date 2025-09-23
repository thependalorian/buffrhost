-- Corporate Customer Management
-- Enhanced corporate customer management and compliance

-- This file contains the corporate customer tables that were already defined
-- in the core/4-customers.sql file. This is a placeholder for additional
-- corporate customer functionality that might be needed in the future.

-- Corporate Booking Management
CREATE TABLE CorporateBooking (
    corporate_booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corporate_id UUID REFERENCES CorporateCustomer(corporate_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    booking_type VARCHAR(50) NOT NULL,
    event_name VARCHAR(255),
    event_description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    expected_attendees INTEGER,
    actual_attendees INTEGER,
    booking_status VARCHAR(50) DEFAULT 'pending',
    total_estimated_cost DECIMAL(15,2) DEFAULT 0.00,
    total_actual_cost DECIMAL(15,2) DEFAULT 0.00,
    deposit_amount DECIMAL(15,2) DEFAULT 0.00,
    balance_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30,
    special_requirements TEXT,
    contact_person_name VARCHAR(255),
    contact_person_email VARCHAR(255),
    contact_person_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Corporate Booking Items
CREATE TABLE CorporateBookingItem (
    booking_item_id SERIAL PRIMARY KEY,
    corporate_booking_id UUID REFERENCES CorporateBooking(corporate_booking_id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_id INTEGER,
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE TRIGGER update_corporate_booking_updated_at 
    BEFORE UPDATE ON CorporateBooking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
