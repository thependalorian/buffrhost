-- Service Booking System
-- Spa, conference, transportation, recreation, and specialized services

-- Spa Services
CREATE TABLE SpaService (
    spa_service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    base_price NUMERIC(10,2) NOT NULL,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    max_capacity INTEGER DEFAULT 1,
    requires_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Conference Rooms
CREATE TABLE ConferenceRoom (
    room_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    room_name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    base_price_per_hour NUMERIC(10,2) NOT NULL,
    amenities TEXT[],
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Transportation Services
CREATE TABLE TransportationService (
    service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER,
    capacity INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    requires_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Recreation Services
CREATE TABLE RecreationService (
    recreation_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER,
    capacity INTEGER DEFAULT 1,
    equipment_included BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    requires_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Specialized Services
CREATE TABLE SpecializedService (
    service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    requires_booking BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Service Bookings
CREATE TABLE ServiceBooking (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    service_id INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed',
    total_price NUMERIC(10,2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at triggers
CREATE TRIGGER update_spa_service_updated_at 
    BEFORE UPDATE ON SpaService 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conference_room_updated_at 
    BEFORE UPDATE ON ConferenceRoom 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_service_updated_at 
    BEFORE UPDATE ON TransportationService 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recreation_service_updated_at 
    BEFORE UPDATE ON RecreationService 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialized_service_updated_at 
    BEFORE UPDATE ON SpecializedService 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_booking_updated_at 
    BEFORE UPDATE ON ServiceBooking 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
