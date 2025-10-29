-- =============================================================================
-- BUFFR HOST - PROPERTIES SYSTEM MIGRATION
-- =============================================================================
-- Consolidates all property-related tables from frontend/sql/ and backend/migrations/
-- This includes hotels, restaurants, and all hospitality properties

-- =============================================================================
-- 1. PROPERTIES CORE TABLES
-- =============================================================================

-- Properties Table (Core entity for restaurants, hotels, etc.)
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buffr_id VARCHAR(100) UNIQUE, -- Buffr unified ID for cross-project integration
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hotel', 'restaurant', 'cafe', 'bar', 'spa', 'conference_center')),
    location VARCHAR(200) NOT NULL,
    owner_id VARCHAR(100) NOT NULL,
    tenant_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'inactive')),
    description TEXT,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key to buffr_ids table
    CONSTRAINT fk_properties_buffr_id 
    FOREIGN KEY (buffr_id) REFERENCES buffr_ids(buffr_id) ON DELETE SET NULL
);

-- Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(20) NOT NULL DEFAULT 'gallery' CHECK (image_type IN ('main', 'gallery', 'menu', 'amenity')),
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property Features/Amenities Table
CREATE TABLE IF NOT EXISTS property_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('amenity', 'service', 'cuisine', 'specialty')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. RESTAURANT-SPECIFIC TABLES
-- =============================================================================

-- Restaurant Details Table
CREATE TABLE IF NOT EXISTS restaurant_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    cuisine_type VARCHAR(100) NOT NULL,
    price_range VARCHAR(10) NOT NULL CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    opening_hours JSONB NOT NULL, -- {"monday": {"open": "09:00", "close": "22:00", "closed": false}, ...}
    delivery_available BOOLEAN DEFAULT false,
    takeaway_available BOOLEAN DEFAULT true,
    dine_in_available BOOLEAN DEFAULT true,
    max_capacity INTEGER,
    average_prep_time INTEGER, -- in minutes
    special_dietary_options TEXT[], -- ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher']
    payment_methods TEXT[], -- ['cash', 'card', 'mobile_money', 'crypto']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant Tables Table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(100), -- 'indoor', 'outdoor', 'patio', 'private'
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    floor_plan_data JSONB, -- Table position and layout data
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, table_number)
);

-- Table Reservations Table
CREATE TABLE IF NOT EXISTS table_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    party_size INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. HOTEL-SPECIFIC TABLES
-- =============================================================================

-- Hotel Details Table
CREATE TABLE IF NOT EXISTS hotel_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5),
    check_in_time TIME DEFAULT '15:00',
    check_out_time TIME DEFAULT '11:00',
    total_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    room_types JSONB, -- [{"type": "standard", "count": 10, "price": 150}, ...]
    amenities TEXT[], -- ['wifi', 'pool', 'gym', 'spa', 'restaurant', 'bar']
    policies JSONB, -- {"cancellation": "24h", "pets": "allowed", "smoking": "prohibited"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Types Table (for hotels)
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    max_occupancy INTEGER NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    size_sqm INTEGER,
    bed_type VARCHAR(50), -- 'single', 'double', 'queen', 'king', 'twin'
    amenities TEXT[], -- ['wifi', 'tv', 'minibar', 'balcony', 'ocean_view']
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Images Table
CREATE TABLE IF NOT EXISTS room_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Availability Table
CREATE TABLE IF NOT EXISTS room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2), -- Dynamic pricing per date
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(room_type_id, date)
);

-- =============================================================================
-- 4. BOOKING SYSTEM
-- =============================================================================

-- Bookings Table (unified for hotels and restaurants)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    booking_type VARCHAR(20) NOT NULL CHECK (booking_type IN ('hotel_room', 'restaurant_table', 'service')),
    reference_id UUID, -- Points to room_type_id or table_id
    check_in_date DATE,
    check_out_date DATE,
    booking_date DATE,
    booking_time TIME,
    party_size INTEGER,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show')),
    total_amount DECIMAL(10,2),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 5. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Properties indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON properties(rating);

-- Property images indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_type ON property_images(image_type);

-- Restaurant tables indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_property_id ON restaurant_tables(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_status ON restaurant_tables(status);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_capacity ON restaurant_tables(capacity);

-- Table reservations indexes
CREATE INDEX IF NOT EXISTS idx_table_reservations_table_id ON table_reservations(table_id);
CREATE INDEX IF NOT EXISTS idx_table_reservations_date ON table_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_table_reservations_status ON table_reservations(status);

-- Hotel room types indexes
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON room_types(is_active);

-- Room availability indexes
CREATE INDEX IF NOT EXISTS idx_room_availability_room_type_id ON room_availability(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_availability_date ON room_availability(date);
CREATE INDEX IF NOT EXISTS idx_room_availability_available ON room_availability(is_available);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_type ON bookings(booking_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_date ON bookings(check_in_date);

-- =============================================================================
-- 6. ANALYTICS VIEWS
-- =============================================================================

-- Property performance view
CREATE OR REPLACE VIEW property_performance AS
SELECT 
    p.id,
    p.name,
    p.type,
    p.rating,
    p.total_orders,
    p.total_revenue,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    AVG(b.total_amount) as average_booking_value
FROM properties p
LEFT JOIN bookings b ON p.id = b.property_id
GROUP BY p.id, p.name, p.type, p.rating, p.total_orders, p.total_revenue;

-- Restaurant table utilization view
CREATE OR REPLACE VIEW restaurant_table_utilization AS
SELECT 
    rt.property_id,
    p.name as property_name,
    COUNT(rt.id) as total_tables,
    COUNT(CASE WHEN rt.status = 'available' THEN 1 END) as available_tables,
    COUNT(CASE WHEN rt.status = 'occupied' THEN 1 END) as occupied_tables,
    COUNT(tr.id) as total_reservations,
    COUNT(CASE WHEN tr.status = 'confirmed' THEN 1 END) as confirmed_reservations
FROM restaurant_tables rt
JOIN properties p ON rt.property_id = p.id
LEFT JOIN table_reservations tr ON rt.id = tr.table_id
GROUP BY rt.property_id, p.name;

-- Hotel room availability view
CREATE OR REPLACE VIEW hotel_room_availability AS
SELECT 
    rt.property_id,
    p.name as hotel_name,
    rt.type_name,
    COUNT(ra.id) as total_availability_records,
    COUNT(CASE WHEN ra.is_available = true THEN 1 END) as available_dates,
    AVG(ra.price) as average_price
FROM room_types rt
JOIN properties p ON rt.property_id = p.id
LEFT JOIN room_availability ra ON rt.id = ra.room_type_id
GROUP BY rt.property_id, p.name, rt.type_name;

-- =============================================================================
-- 7. TRIGGERS FOR DATA INTEGRITY
-- =============================================================================

-- Update property revenue when bookings are completed
CREATE OR REPLACE FUNCTION update_property_revenue()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE properties 
        SET total_revenue = total_revenue + NEW.total_amount,
            total_orders = total_orders + 1
        WHERE id = NEW.property_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for revenue updates
DROP TRIGGER IF EXISTS trigger_update_property_revenue ON bookings;
CREATE TRIGGER trigger_update_property_revenue
    AFTER UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_property_revenue();

-- =============================================================================
-- 8. SAMPLE DATA
-- =============================================================================

-- Insert sample properties
INSERT INTO properties (id, name, type, location, owner_id, tenant_id, address, phone, email, rating, description)
VALUES 
    (gen_random_uuid(), 'Savanna Restaurant', 'restaurant', 'Windhoek, Namibia', 'owner-001', 'tenant-001', '123 Independence Ave, Windhoek', '+264 61 123 456', 'info@savanna.com', 4.5, 'Premium restaurant with local cuisine'),
    (gen_random_uuid(), 'Ocean Breeze', 'restaurant', 'Swakopmund, Namibia', 'owner-002', 'tenant-001', '456 Beach Road, Swakopmund', '+264 64 789 012', 'info@oceanbreeze.com', 4.2, 'Seafood restaurant with ocean views'),
    (gen_random_uuid(), 'Namib Desert Lodge', 'hotel', 'Sossusvlei, Namibia', 'owner-003', 'tenant-001', 'Desert Road, Sossusvlei', '+264 63 345 678', 'info@namibdesert.com', 4.8, 'Luxury desert lodge with stunning views')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 9. PERMISSIONS
-- =============================================================================

-- Grant permissions for analytics views
GRANT SELECT ON property_performance TO PUBLIC;
GRANT SELECT ON restaurant_table_utilization TO PUBLIC;
GRANT SELECT ON hotel_room_availability TO PUBLIC;

-- =============================================================================
-- 10. DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE properties IS 'Core properties table for all hospitality businesses';
COMMENT ON TABLE restaurant_details IS 'Restaurant-specific configuration and details';
COMMENT ON TABLE restaurant_tables IS 'Restaurant table management and floor plans';
COMMENT ON TABLE table_reservations IS 'Restaurant table reservation system';
COMMENT ON TABLE hotel_details IS 'Hotel-specific configuration and details';
COMMENT ON TABLE room_types IS 'Hotel room type definitions and pricing';
COMMENT ON TABLE room_availability IS 'Dynamic room availability and pricing';
COMMENT ON TABLE bookings IS 'Unified booking system for all property types';

-- =============================================================================
-- PROPERTIES SYSTEM COMPLETE
-- =============================================================================

-- Log completion
DO $$ BEGIN
    RAISE NOTICE 'Properties system migration completed successfully!';
    RAISE NOTICE 'Core property tables created';
    RAISE NOTICE 'Restaurant management system implemented';
    RAISE NOTICE 'Hotel management system implemented';
    RAISE NOTICE 'Unified booking system created';
    RAISE NOTICE 'Analytics views and triggers implemented';
END $$;
