-- User Types Table
-- Different types of users in the system with specific permissions

CREATE TABLE UserType (
    user_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    requires_kyc BOOLEAN DEFAULT TRUE,
    requires_kyb BOOLEAN DEFAULT FALSE,
    can_book_rooms BOOLEAN DEFAULT TRUE,
    can_book_facilities BOOLEAN DEFAULT TRUE,
    can_order_restaurant BOOLEAN DEFAULT TRUE,
    can_generate_invoices BOOLEAN DEFAULT FALSE,
    can_manage_bookings BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default user types
INSERT INTO UserType (type_name, description, requires_kyc, requires_kyb, can_book_rooms, can_book_facilities, can_order_restaurant, can_generate_invoices, can_manage_bookings) VALUES 
('individual', 'Individual guests and customers', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE),
('corporate', 'Corporate clients and businesses', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE),
('event_planner', 'Professional event planners', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('travel_agent', 'Travel agents and tour operators', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE),
('staff', 'Hotel and property staff', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
('admin', 'System administrators', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE);
