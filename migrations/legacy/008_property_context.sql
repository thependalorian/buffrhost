-- Migration 008: Property Context Tables
-- Creates tables for property-specific context including operating hours, configuration, services, and rates
-- This enables the Buffr Host agent to have complete property context for hospitality operations

-- Property operating hours
CREATE TABLE IF NOT EXISTS property_operating_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Property configuration (check-in/out, policies)
CREATE TABLE IF NOT EXISTS property_configuration (
    property_id UUID PRIMARY KEY REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    early_checkin_fee DECIMAL(10,2) DEFAULT 0.00,
    late_checkout_fee DECIMAL(10,2) DEFAULT 0.00,
    cancellation_policy TEXT,
    deposit_policy TEXT,
    house_rules JSONB DEFAULT '{}',
    amenities JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Service catalog (spa, shuttle, tours, etc)
CREATE TABLE IF NOT EXISTS service_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'spa', 'shuttle', 'tour', 'rental', 'restaurant'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    duration_minutes INTEGER,
    capacity INTEGER,
    requires_booking BOOLEAN DEFAULT true,
    advance_booking_hours INTEGER DEFAULT 24,
    operating_hours JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}', -- flexible for service-specific fields
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Rate configuration
CREATE TABLE IF NOT EXISTS rate_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    room_type VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL, -- 'peak', 'off-peak', 'standard'
    base_rate DECIMAL(10,2) NOT NULL,
    weekend_rate DECIMAL(10,2),
    min_nights INTEGER DEFAULT 1,
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Menu items for restaurant services
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    service_id UUID REFERENCES service_catalog(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'appetizers', 'mains', 'desserts', 'beverages'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    dietary_info JSONB DEFAULT '{}', -- vegetarian, vegan, gluten-free, etc
    allergens JSONB DEFAULT '[]',
    preparation_time_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent personalities table for EM-based personality evolution
CREATE TABLE IF NOT EXISTS agent_personalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Sofia',
    role VARCHAR(100) NOT NULL DEFAULT 'Professional Concierge',
    
    -- Core traits (static)
    core_traits JSONB DEFAULT '[
        {"name": "warmth", "value": 0.9, "description": "Warm and welcoming"},
        {"name": "attentiveness", "value": 0.95, "description": "Highly attentive to details"},
        {"name": "proactivity", "value": 0.85, "description": "Anticipates guest needs"},
        {"name": "professionalism", "value": 0.95, "description": "Maintains professional standards"}
    ]',
    
    -- Dynamic characteristics (EM-updated)
    confidence_level DECIMAL(3,2) DEFAULT 0.80 CHECK (confidence_level >= 0.0 AND confidence_level <= 1.0),
    energy_level DECIMAL(3,2) DEFAULT 0.85 CHECK (energy_level >= 0.0 AND energy_level <= 1.0),
    current_mood VARCHAR(50) DEFAULT 'professional', -- 'positive', 'focused', 'empathetic', 'professional'
    adaptability_score DECIMAL(3,2) DEFAULT 0.75 CHECK (adaptability_score >= 0.0 AND adaptability_score <= 1.0),
    
    -- EM Algorithm parameters
    em_iteration INTEGER DEFAULT 0,
    learning_rate DECIMAL(4,3) DEFAULT 0.100,
    convergence_threshold DECIMAL(4,3) DEFAULT 0.010,
    
    -- Performance tracking
    successful_interactions INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    performance_history JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(tenant_id, property_id, agent_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_operating_hours_property_id ON property_operating_hours(property_id);
CREATE INDEX IF NOT EXISTS idx_property_operating_hours_day ON property_operating_hours(day_of_week);
CREATE INDEX IF NOT EXISTS idx_service_catalog_property_id ON service_catalog(property_id);
CREATE INDEX IF NOT EXISTS idx_service_catalog_type ON service_catalog(service_type);
CREATE INDEX IF NOT EXISTS idx_rate_configuration_property_id ON rate_configuration(property_id);
CREATE INDEX IF NOT EXISTS idx_rate_configuration_dates ON rate_configuration(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_menu_items_property_id ON menu_items(property_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_service_id ON menu_items(service_id);
CREATE INDEX IF NOT EXISTS idx_agent_personalities_tenant_property ON agent_personalities(tenant_id, property_id);

-- Enable RLS
ALTER TABLE property_operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_personalities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tenant isolation
CREATE POLICY "property_operating_hours_tenant_isolation" ON property_operating_hours
    FOR ALL USING (
        property_id IN (
            SELECT hp.id FROM hospitality_properties hp 
            WHERE hp.tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

CREATE POLICY "property_configuration_tenant_isolation" ON property_configuration
    FOR ALL USING (
        property_id IN (
            SELECT hp.id FROM hospitality_properties hp 
            WHERE hp.tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

CREATE POLICY "service_catalog_tenant_isolation" ON service_catalog
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "rate_configuration_tenant_isolation" ON rate_configuration
    FOR ALL USING (
        property_id IN (
            SELECT hp.id FROM hospitality_properties hp 
            WHERE hp.tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

CREATE POLICY "menu_items_tenant_isolation" ON menu_items
    FOR ALL USING (
        property_id IN (
            SELECT hp.id FROM hospitality_properties hp 
            WHERE hp.tenant_id = current_setting('app.current_tenant_id')::UUID
        )
    );

CREATE POLICY "agent_personalities_tenant_isolation" ON agent_personalities
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Insert sample data for testing
INSERT INTO property_configuration (property_id, check_in_time, check_out_time, cancellation_policy, deposit_policy, house_rules, amenities)
SELECT 
    hp.id,
    '15:00'::TIME,
    '11:00'::TIME,
    'Free cancellation up to 24 hours before check-in',
    'Credit card required for incidentals',
    '{"quiet_hours": "22:00-07:00", "smoking": "No smoking in rooms", "pets": "Service animals only"}'::JSONB,
    '["WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar", "Concierge", "Valet Parking"]'::JSONB
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM property_configuration pc WHERE pc.property_id = hp.id
);

-- Insert sample operating hours (7 days, 6 AM to 11 PM)
INSERT INTO property_operating_hours (property_id, day_of_week, open_time, close_time, is_closed)
SELECT 
    hp.id,
    generate_series(0, 6) as day_of_week,
    '06:00'::TIME,
    '23:00'::TIME,
    false
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM property_operating_hours poh WHERE poh.property_id = hp.id
);

-- Insert sample services
INSERT INTO service_catalog (tenant_id, property_id, service_type, name, description, base_price, duration_minutes, capacity, requires_booking, advance_booking_hours, operating_hours, metadata)
SELECT 
    hp.tenant_id,
    hp.id,
    'spa',
    'Luxury Spa Treatment',
    'Full-service spa with massage, facials, and wellness treatments',
    150.00,
    90,
    1,
    true,
    24,
    '{"monday": {"open": "09:00", "close": "21:00"}, "tuesday": {"open": "09:00", "close": "21:00"}, "wednesday": {"open": "09:00", "close": "21:00"}, "thursday": {"open": "09:00", "close": "21:00"}, "friday": {"open": "09:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "21:00"}, "sunday": {"open": "10:00", "close": "20:00"}}'::JSONB,
    '{"equipment": ["massage_tables", "steam_room", "sauna"], "therapists": 3}'::JSONB
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM service_catalog sc WHERE sc.property_id = hp.id AND sc.service_type = 'spa'
);

INSERT INTO service_catalog (tenant_id, property_id, service_type, name, description, base_price, duration_minutes, capacity, requires_booking, advance_booking_hours, operating_hours, metadata)
SELECT 
    hp.tenant_id,
    hp.id,
    'shuttle',
    'Airport Shuttle Service',
    'Complimentary airport shuttle service',
    0.00,
    30,
    8,
    true,
    2,
    '{"monday": {"open": "05:00", "close": "23:00"}, "tuesday": {"open": "05:00", "close": "23:00"}, "wednesday": {"open": "05:00", "close": "23:00"}, "thursday": {"open": "05:00", "close": "23:00"}, "friday": {"open": "05:00", "close": "23:00"}, "saturday": {"open": "05:00", "close": "23:00"}, "sunday": {"open": "05:00", "close": "23:00"}}'::JSONB,
    '{"vehicle_type": "luxury_van", "capacity": 8, "frequency": "every_30_minutes"}'::JSONB
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM service_catalog sc WHERE sc.property_id = hp.id AND sc.service_type = 'shuttle'
);

INSERT INTO service_catalog (tenant_id, property_id, service_type, name, description, base_price, duration_minutes, capacity, requires_booking, advance_booking_hours, operating_hours, metadata)
SELECT 
    hp.tenant_id,
    hp.id,
    'restaurant',
    'Fine Dining Restaurant',
    'Upscale restaurant with international cuisine',
    0.00,
    120,
    50,
    true,
    4,
    '{"monday": {"open": "07:00", "close": "22:00"}, "tuesday": {"open": "07:00", "close": "22:00"}, "wednesday": {"open": "07:00", "close": "22:00"}, "thursday": {"open": "07:00", "close": "22:00"}, "friday": {"open": "07:00", "close": "23:00"}, "saturday": {"open": "07:00", "close": "23:00"}, "sunday": {"open": "08:00", "close": "22:00"}}'::JSONB,
    '{"cuisine": "international", "dress_code": "smart_casual", "reservations_required": true}'::JSONB
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM service_catalog sc WHERE sc.property_id = hp.id AND sc.service_type = 'restaurant'
);

-- Insert sample menu items
INSERT INTO menu_items (property_id, service_id, category, name, description, price, dietary_info, allergens, preparation_time_minutes)
SELECT 
    sc.property_id,
    sc.id,
    'appetizers',
    'Truffle Arancini',
    'Crispy risotto balls with truffle oil and parmesan',
    18.00,
    '{"vegetarian": true}'::JSONB,
    '["dairy", "gluten"]'::JSONB,
    15
FROM service_catalog sc
WHERE sc.service_type = 'restaurant'
AND NOT EXISTS (
    SELECT 1 FROM menu_items mi WHERE mi.service_id = sc.id AND mi.name = 'Truffle Arancini'
);

INSERT INTO menu_items (property_id, service_id, category, name, description, price, dietary_info, allergens, preparation_time_minutes)
SELECT 
    sc.property_id,
    sc.id,
    'mains',
    'Wagyu Beef Tenderloin',
    '8oz wagyu tenderloin with red wine reduction and seasonal vegetables',
    65.00,
    '{"gluten_free": true}'::JSONB,
    '[]'::JSONB,
    25
FROM service_catalog sc
WHERE sc.service_type = 'restaurant'
AND NOT EXISTS (
    SELECT 1 FROM menu_items mi WHERE mi.service_id = sc.id AND mi.name = 'Wagyu Beef Tenderloin'
);

INSERT INTO menu_items (property_id, service_id, category, name, description, price, dietary_info, allergens, preparation_time_minutes)
SELECT 
    sc.property_id,
    sc.id,
    'desserts',
    'Chocolate Lava Cake',
    'Warm chocolate cake with molten center and vanilla ice cream',
    12.00,
    '{"vegetarian": true}'::JSONB,
    '["dairy", "eggs", "gluten"]'::JSONB,
    10
FROM service_catalog sc
WHERE sc.service_type = 'restaurant'
AND NOT EXISTS (
    SELECT 1 FROM menu_items mi WHERE mi.service_id = sc.id AND mi.name = 'Chocolate Lava Cake'
);

-- Insert sample rate configuration
INSERT INTO rate_configuration (property_id, room_type, season, base_rate, weekend_rate, min_nights, valid_from, valid_to)
SELECT 
    hp.id,
    'Standard Room',
    'standard',
    200.00,
    250.00,
    1,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year'
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM rate_configuration rc WHERE rc.property_id = hp.id AND rc.room_type = 'Standard Room'
);

INSERT INTO rate_configuration (property_id, room_type, season, base_rate, weekend_rate, min_nights, valid_from, valid_to)
SELECT 
    hp.id,
    'Deluxe Suite',
    'standard',
    350.00,
    400.00,
    1,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 year'
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM rate_configuration rc WHERE rc.property_id = hp.id AND rc.room_type = 'Deluxe Suite'
);

-- Insert default agent personality
INSERT INTO agent_personalities (tenant_id, property_id, agent_id, name, role)
SELECT 
    hp.tenant_id,
    hp.id,
    'buffr_concierge',
    'Sofia',
    'Professional Concierge'
FROM hospitality_properties hp
WHERE NOT EXISTS (
    SELECT 1 FROM agent_personalities ap WHERE ap.tenant_id = hp.tenant_id AND ap.property_id = hp.id AND ap.agent_id = 'buffr_concierge'
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_property_operating_hours_updated_at BEFORE UPDATE ON property_operating_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_property_configuration_updated_at BEFORE UPDATE ON property_configuration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_catalog_updated_at BEFORE UPDATE ON service_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_configuration_updated_at BEFORE UPDATE ON rate_configuration FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_personalities_updated_at BEFORE UPDATE ON agent_personalities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON property_operating_hours TO authenticated;
GRANT ALL ON property_configuration TO authenticated;
GRANT ALL ON service_catalog TO authenticated;
GRANT ALL ON rate_configuration TO authenticated;
GRANT ALL ON menu_items TO authenticated;
GRANT ALL ON agent_personalities TO authenticated;

-- Comments for documentation
COMMENT ON TABLE property_operating_hours IS 'Operating hours for each property by day of week';
COMMENT ON TABLE property_configuration IS 'Property-specific configuration including check-in/out times and policies';
COMMENT ON TABLE service_catalog IS 'Catalog of services offered by each property (spa, shuttle, tours, etc)';
COMMENT ON TABLE rate_configuration IS 'Rate configuration for different room types and seasons';
COMMENT ON TABLE menu_items IS 'Menu items for restaurant services';
COMMENT ON TABLE agent_personalities IS 'AI agent personality profiles with EM-based evolution';
