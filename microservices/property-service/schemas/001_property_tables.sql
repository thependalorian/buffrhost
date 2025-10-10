-- Property Service Database Schema
-- Handles hospitality property management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Property types enum
CREATE TYPE property_type AS ENUM (
    'restaurant',
    'hotel',
    'spa',
    'conference_center',
    'resort',
    'boutique_hotel',
    'bed_breakfast',
    'vacation_rental'
);

-- Property status enum
CREATE TYPE property_status AS ENUM (
    'active',
    'inactive',
    'maintenance',
    'suspended'
);

-- Room types enum
CREATE TYPE room_type AS ENUM (
    'standard',
    'deluxe',
    'suite',
    'presidential',
    'family',
    'business'
);

-- Amenity types enum
CREATE TYPE amenity_type AS ENUM (
    'wifi',
    'parking',
    'pool',
    'gym',
    'spa_services',
    'restaurant',
    'room_service',
    'concierge',
    'business_center',
    'conference_rooms'
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    property_type property_type NOT NULL,
    description TEXT,
    address JSONB NOT NULL, -- {street, city, state, zip_code, country, latitude, longitude}
    contact_info JSONB NOT NULL, -- {phone, email, website, fax}
    business_hours JSONB DEFAULT '{}', -- {monday: "09:00-17:00", ...}
    amenities JSONB DEFAULT '[]', -- Array of amenity objects
    rooms JSONB DEFAULT '[]', -- Array of room objects
    owner_id UUID NOT NULL, -- Reference to auth service users
    manager_id UUID, -- Reference to auth service users
    status property_status DEFAULT 'active',
    capacity INTEGER,
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    images TEXT[] DEFAULT '{}',
    policies JSONB DEFAULT '{}',
    features JSONB DEFAULT '{}',
    created_by UUID NOT NULL, -- Reference to auth service users
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property amenities table (normalized for better querying)
CREATE TABLE IF NOT EXISTS property_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_type amenity_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    additional_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property rooms table (normalized for better querying)
CREATE TABLE IF NOT EXISTS property_rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    room_type room_type NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price > 0),
    amenities TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT TRUE,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

-- Property analytics table
CREATE TABLE IF NOT EXISTS property_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_properties_manager_id ON properties(manager_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_code ON properties(property_code);
CREATE INDEX idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX idx_property_amenities_type ON property_amenities(amenity_type);
CREATE INDEX idx_property_rooms_property_id ON property_rooms(property_id);
CREATE INDEX idx_property_rooms_available ON property_rooms(is_available);
CREATE INDEX idx_property_analytics_property_id ON property_analytics(property_id);
CREATE INDEX idx_property_analytics_date ON property_analytics(metric_date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_amenities_updated_at
    BEFORE UPDATE ON property_amenities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_rooms_updated_at
    BEFORE UPDATE ON property_rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Property owners can manage their properties" ON properties FOR ALL USING (
    owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Property amenities follow property access" ON property_amenities FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
    ))
);

CREATE POLICY "Property rooms follow property access" ON property_rooms FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
    ))
);

CREATE POLICY "Property analytics follow property access" ON property_analytics FOR ALL USING (
    EXISTS (SELECT 1 FROM properties WHERE id = property_id AND (
        owner_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
    ))
);

-- Grant permissions
GRANT ALL ON properties TO authenticated;
GRANT ALL ON property_amenities TO authenticated;
GRANT ALL ON property_rooms TO authenticated;
GRANT ALL ON property_analytics TO authenticated;