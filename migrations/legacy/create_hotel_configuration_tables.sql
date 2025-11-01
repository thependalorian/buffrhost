-- Hotel Configuration Tables Migration
-- Creates tables for hotel-centric architecture

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hotel_types table
CREATE TABLE IF NOT EXISTS hotel_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    common_services JSON NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create hotel_services table
CREATE TABLE IF NOT EXISTS hotel_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create hotel_configurations table
CREATE TABLE IF NOT EXISTS hotel_configurations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    hotel_type VARCHAR(100) NOT NULL,
    selected_services JSON NOT NULL DEFAULT '[]',
    configuration_data JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id)
);

-- Create restaurant_types table
CREATE TABLE IF NOT EXISTS restaurant_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    common_features JSON NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create restaurant_configurations table
CREATE TABLE IF NOT EXISTS restaurant_configurations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    restaurant_type VARCHAR(100) NOT NULL,
    selected_features JSON NOT NULL DEFAULT '[]',
    configuration_data JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotel_types_name ON hotel_types(name);
CREATE INDEX IF NOT EXISTS idx_hotel_types_active ON hotel_types(is_active);
CREATE INDEX IF NOT EXISTS idx_hotel_services_name ON hotel_services(name);
CREATE INDEX IF NOT EXISTS idx_hotel_services_category ON hotel_services(category);
CREATE INDEX IF NOT EXISTS idx_hotel_services_active ON hotel_services(is_active);
CREATE INDEX IF NOT EXISTS idx_hotel_configurations_property_id ON hotel_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_hotel_configurations_hotel_type ON hotel_configurations(hotel_type);
CREATE INDEX IF NOT EXISTS idx_restaurant_types_name ON restaurant_types(name);
CREATE INDEX IF NOT EXISTS idx_restaurant_types_active ON restaurant_types(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurant_configurations_property_id ON restaurant_configurations(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_configurations_restaurant_type ON restaurant_configurations(restaurant_type);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_hotel_types_updated_at BEFORE UPDATE ON hotel_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_services_updated_at BEFORE UPDATE ON hotel_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_configurations_updated_at BEFORE UPDATE ON hotel_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_types_updated_at BEFORE UPDATE ON restaurant_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_configurations_updated_at BEFORE UPDATE ON restaurant_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default hotel types
INSERT INTO hotel_types (name, description, icon, common_services) VALUES
('boutique_hotel', 'Luxury properties with personalized service', 'Sparkles', '["spa_wellness", "fnb_operations", "room_management", "concierge"]'),
('vacation_rental', 'Airbnb, holiday homes, and short-term rentals', 'Home', '["room_management", "activity_center", "self_checkin", "cleaning"]'),
('resort_lodge', 'Large properties with multiple amenities', 'Building2', '["room_management", "fnb_operations", "spa_wellness", "activity_center", "conference_facilities"]'),
('guest_house', 'Smaller properties with intimate service', 'Bed', '["room_management", "activity_center", "breakfast", "housekeeping"]'),
('hotel_chain', 'Multi-location hotel groups', 'Users2', '["room_management", "fnb_operations", "conference_facilities", "central_management"]'),
('specialty_accommodation', 'Camping, glamping, and unique stays', 'Star', '["activity_center", "transport_services", "equipment_rental", "experience_packages"]')
ON CONFLICT (name) DO NOTHING;

-- Insert default hotel services
INSERT INTO hotel_services (name, description, category, icon) VALUES
('room_management', 'Check-in/out, housekeeping, maintenance, and room service', 'Accommodation', 'Bed'),
('fnb_operations', 'Restaurants, bars, room service, and banquet management', 'F&B', 'Utensils'),
('spa_wellness', 'Treatment bookings, therapist scheduling, and product sales', 'Wellness', 'Sparkles'),
('activity_center', 'Tours, excursions, equipment rental, and experience booking', 'Experiences', 'Car'),
('conference_facilities', 'Meeting rooms, event spaces, catering, and AV equipment', 'Business', 'Users2'),
('fitness_center', 'Gym access, personal training, and class scheduling', 'Wellness', 'Dumbbell'),
('transport_services', 'Airport shuttle, car rental, and local transportation', 'Transport', 'Car'),
('retail_gift_shop', 'Souvenirs, essentials, and local products', 'Retail', 'Wine')
ON CONFLICT (name) DO NOTHING;

-- Insert default restaurant types
INSERT INTO restaurant_types (name, description, icon, common_features) VALUES
('standalone_restaurant', 'Complete F&B system for restaurants without accommodation', 'Utensils', '["menu_management", "table_booking", "kitchen_display", "inventory_control"]'),
('bar_lounge', 'Beverage-focused establishments', 'Wine', '["bar_management", "bottle_service", "inventory_tracking", "staff_scheduling"]'),
('catering_service', 'Off-site events and catering businesses', 'Users2', '["event_management", "mobile_ordering", "delivery_tracking", "client_billing"]'),
('food_truck', 'Mobile food service management', 'Car', '["location_management", "mobile_pos", "inventory_tracking", "route_optimization"]')
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies for hotel configuration tables
ALTER TABLE hotel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_configurations ENABLE ROW LEVEL SECURITY;

-- RLS policies for hotel_types (read-only for all authenticated users)
CREATE POLICY "hotel_types_read_policy" ON hotel_types
    FOR SELECT USING (is_active = true);

-- RLS policies for hotel_services (read-only for all authenticated users)
CREATE POLICY "hotel_services_read_policy" ON hotel_services
    FOR SELECT USING (is_active = true);

-- RLS policies for hotel_configurations (tenant-based access)
CREATE POLICY "hotel_configurations_tenant_policy" ON hotel_configurations
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)
        )
    );

-- RLS policies for restaurant_types (read-only for all authenticated users)
CREATE POLICY "restaurant_types_read_policy" ON restaurant_types
    FOR SELECT USING (is_active = true);

-- RLS policies for restaurant_configurations (tenant-based access)
CREATE POLICY "restaurant_configurations_tenant_policy" ON restaurant_configurations
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)
        )
    );

-- Grant permissions
GRANT SELECT ON hotel_types TO authenticated;
GRANT SELECT ON hotel_services TO authenticated;
GRANT SELECT ON restaurant_types TO authenticated;
GRANT ALL ON hotel_configurations TO authenticated;
GRANT ALL ON restaurant_configurations TO authenticated;

-- Create views for easier querying
CREATE OR REPLACE VIEW hotel_type_services AS
SELECT 
    ht.id as hotel_type_id,
    ht.name as hotel_type_name,
    ht.description as hotel_type_description,
    ht.icon as hotel_type_icon,
    ht.common_services,
    hs.id as service_id,
    hs.name as service_name,
    hs.description as service_description,
    hs.category as service_category,
    hs.icon as service_icon
FROM hotel_types ht
CROSS JOIN hotel_services hs
WHERE ht.is_active = true AND hs.is_active = true;

CREATE OR REPLACE VIEW property_hotel_configuration AS
SELECT 
    hc.id as configuration_id,
    hc.property_id,
    hc.hotel_type,
    hc.selected_services,
    hc.configuration_data,
    hc.is_active,
    hc.created_at,
    hc.updated_at,
    hp.name as property_name,
    hp.tenant_id
FROM hotel_configurations hc
JOIN hospitality_properties hp ON hc.property_id = hp.id;

-- Grant permissions on views
GRANT SELECT ON hotel_type_services TO authenticated;
GRANT SELECT ON property_hotel_configuration TO authenticated;

COMMIT;