-- Hospitality Property Table
-- Core table for all hospitality properties (restaurants, hotels, spas, etc.)

CREATE TABLE HospitalityProperty (
    property_id SERIAL PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL DEFAULT 'restaurant',
    logo_url VARCHAR(500),
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    -- Hotel-specific fields
    check_in_time TIME,
    check_out_time TIME,
    total_rooms INTEGER,
    -- Restaurant-specific fields
    cuisine_type VARCHAR(100),
    -- Spa-specific fields
    spa_type VARCHAR(100),
    -- Conference-specific fields
    max_capacity INTEGER,
    -- Multi-service properties
    services_offered TEXT[],
    amenities TEXT[]
);

-- Create updated_at trigger
CREATE TRIGGER update_hospitality_property_updated_at 
    BEFORE UPDATE ON HospitalityProperty 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
