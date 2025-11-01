-- =====================================================
-- Hotel Configuration Tables Migration
-- Buffr Host Platform - Hotel-Centric Architecture
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. HOTEL TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    common_services JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. HOTEL SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. RESTAURANT TYPES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    common_features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. HOTEL CONFIGURATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    hotel_type_id INTEGER NOT NULL REFERENCES hotel_types(id),
    selected_services JSONB NOT NULL DEFAULT '[]',
    configuration_data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id)
);

-- =====================================================
-- 5. RESTAURANT CONFIGURATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    restaurant_type_id INTEGER NOT NULL REFERENCES restaurant_types(id),
    configuration_data JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id)
);

-- =====================================================
-- 6. ROOM TYPES TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    room_size DECIMAL(8,2), -- in square meters
    bed_type VARCHAR(50),
    amenities JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. ROOMS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor INTEGER,
    status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance, out_of_order
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

-- =====================================================
-- 8. BOOKINGS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, checked_in, checked_out, cancelled
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Hotel types indexes
CREATE INDEX IF NOT EXISTS idx_hotel_types_name ON hotel_types(name);
CREATE INDEX IF NOT EXISTS idx_hotel_types_active ON hotel_types(is_active);

-- Hotel services indexes
CREATE INDEX IF NOT EXISTS idx_hotel_services_name ON hotel_services(name);
CREATE INDEX IF NOT EXISTS idx_hotel_services_category ON hotel_services(category);
CREATE INDEX IF NOT EXISTS idx_hotel_services_active ON hotel_services(is_active);

-- Restaurant types indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_types_name ON restaurant_types(name);
CREATE INDEX IF NOT EXISTS idx_restaurant_types_active ON restaurant_types(is_active);

-- Hotel configurations indexes
CREATE INDEX IF NOT EXISTS idx_hotel_configs_property ON hotel_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_hotel_configs_type ON hotel_configurations(hotel_type_id);
CREATE INDEX IF NOT EXISTS idx_hotel_configs_active ON hotel_configurations(is_active);

-- Restaurant configurations indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_configs_property ON restaurant_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_configs_type ON restaurant_configurations(restaurant_type_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_configs_active ON restaurant_configurations(is_active);

-- Room types indexes
CREATE INDEX IF NOT EXISTS idx_room_types_property ON room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON room_types(is_active);

-- Rooms indexes
CREATE INDEX IF NOT EXISTS idx_rooms_property ON rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_active ON rooms(is_active);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_hotel_types_updated_at BEFORE UPDATE ON hotel_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_services_updated_at BEFORE UPDATE ON hotel_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_types_updated_at BEFORE UPDATE ON restaurant_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotel_configurations_updated_at BEFORE UPDATE ON hotel_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurant_configurations_updated_at BEFORE UPDATE ON restaurant_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON room_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE hotel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hotel_types (read-only for all authenticated users)
CREATE POLICY "hotel_types_read_policy" ON hotel_types
    FOR SELECT USING (true);

-- RLS Policies for hotel_services (read-only for all authenticated users)
CREATE POLICY "hotel_services_read_policy" ON hotel_services
    FOR SELECT USING (true);

-- RLS Policies for restaurant_types (read-only for all authenticated users)
CREATE POLICY "restaurant_types_read_policy" ON restaurant_types
    FOR SELECT USING (true);

-- RLS Policies for hotel_configurations (tenant-based access)
CREATE POLICY "hotel_configurations_tenant_policy" ON hotel_configurations
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for restaurant_configurations (tenant-based access)
CREATE POLICY "restaurant_configurations_tenant_policy" ON restaurant_configurations
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for room_types (tenant-based access)
CREATE POLICY "room_types_tenant_policy" ON room_types
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for rooms (tenant-based access)
CREATE POLICY "rooms_tenant_policy" ON rooms
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for bookings (tenant-based access)
CREATE POLICY "bookings_tenant_policy" ON bookings
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for hotel type with services
CREATE OR REPLACE VIEW hotel_type_services AS
SELECT 
    ht.id,
    ht.name,
    ht.description,
    ht.icon,
    ht.common_services,
    hs.name as service_name,
    hs.description as service_description,
    hs.category as service_category
FROM hotel_types ht
CROSS JOIN hotel_services hs
WHERE hs.is_active = true
AND ht.is_active = true;

-- View for property hotel configuration
CREATE OR REPLACE VIEW property_hotel_configuration AS
SELECT 
    hc.id,
    hc.property_id,
    hp.name as property_name,
    ht.name as hotel_type,
    ht.description as hotel_type_description,
    hc.selected_services,
    hc.configuration_data,
    hc.is_active,
    hc.created_at,
    hc.updated_at
FROM hotel_configurations hc
JOIN hospitality_properties hp ON hc.property_id = hp.id
JOIN hotel_types ht ON hc.hotel_type_id = ht.id;

-- View for property restaurant configuration
CREATE OR REPLACE VIEW property_restaurant_configuration AS
SELECT 
    rc.id,
    rc.property_id,
    hp.name as property_name,
    rt.name as restaurant_type,
    rt.description as restaurant_type_description,
    rc.configuration_data,
    rc.is_active,
    rc.created_at,
    rc.updated_at
FROM restaurant_configurations rc
JOIN hospitality_properties hp ON rc.property_id = hp.id
JOIN restaurant_types rt ON rc.restaurant_type_id = rt.id;

-- =====================================================
-- GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON hotel_types TO authenticated;
GRANT SELECT ON hotel_services TO authenticated;
GRANT SELECT ON restaurant_types TO authenticated;
GRANT ALL ON hotel_configurations TO authenticated;
GRANT ALL ON restaurant_configurations TO authenticated;
GRANT ALL ON room_types TO authenticated;
GRANT ALL ON rooms TO authenticated;
GRANT ALL ON bookings TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE hotel_types IS 'Defines different types of hotels (boutique, resort, vacation rental, etc.)';
COMMENT ON TABLE hotel_services IS 'Available services that hotels can offer (spa, restaurant, conference, etc.)';
COMMENT ON TABLE restaurant_types IS 'Different types of restaurants (fine dining, casual, fast food, etc.)';
COMMENT ON TABLE hotel_configurations IS 'Hotel-specific configuration for each property';
COMMENT ON TABLE restaurant_configurations IS 'Restaurant-specific configuration for each property';
COMMENT ON TABLE room_types IS 'Room type definitions for each property';
COMMENT ON TABLE rooms IS 'Individual room instances for each property';
COMMENT ON TABLE bookings IS 'Guest bookings and reservations';

COMMENT ON COLUMN hotel_configurations.selected_services IS 'Array of service IDs selected for this hotel';
COMMENT ON COLUMN hotel_configurations.configuration_data IS 'JSON configuration specific to this hotel type';
COMMENT ON COLUMN restaurant_configurations.configuration_data IS 'JSON configuration specific to this restaurant type';
COMMENT ON COLUMN room_types.amenities IS 'JSON array of room amenities';
COMMENT ON COLUMN bookings.special_requests IS 'Guest special requests and notes';