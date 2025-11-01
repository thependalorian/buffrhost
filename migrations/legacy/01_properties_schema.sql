-- Properties Schema for Buffr Host
-- Multi-tenant hospitality platform with restaurants and hotels
-- This schema follows the existing pattern and extends the Property type from comprehensive.ts

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

-- Restaurant-specific Table
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

-- Hotel-specific Table
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
    hotel_id UUID REFERENCES properties(id) ON DELETE CASCADE,
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
    room_id UUID REFERENCES room_types(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    image_type VARCHAR(50) DEFAULT 'gallery', -- 'main', 'gallery', 'bathroom', 'view'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu Items Table (for restaurants)
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'appetizer', 'main', 'dessert', 'beverage'
    dietary_info TEXT[], -- ['vegetarian', 'vegan', 'gluten-free', 'spicy']
    allergens TEXT[], -- ['nuts', 'dairy', 'gluten', 'shellfish']
    preparation_time INTEGER, -- in minutes
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS property_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    customer_id VARCHAR(100) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    rating DECIMAL(3,2) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    service_rating DECIMAL(3,2) CHECK (service_rating >= 1 AND service_rating <= 5),
    cleanliness_rating DECIMAL(3,2) CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    value_rating DECIMAL(3,2) CHECK (value_rating >= 1 AND value_rating <= 5),
    location_rating DECIMAL(3,2) CHECK (location_rating >= 1 AND location_rating <= 5),
    amenities_rating DECIMAL(3,2) CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    response_text TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_tenant_id ON properties(tenant_id);
CREATE INDEX IF NOT EXISTS idx_properties_buffr_id ON properties(buffr_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_rating ON properties(rating);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_features_property_id ON property_features(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_details_property_id ON restaurant_details(property_id);
CREATE INDEX IF NOT EXISTS idx_hotel_details_property_id ON hotel_details(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_hotel_id ON room_types(hotel_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_rating ON property_reviews(rating);

-- Row Level Security (RLS) Policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY properties_tenant_isolation ON properties
    FOR ALL TO authenticated
    USING (tenant_id = current_setting('app.current_tenant_id'));

-- RLS Policies for property_images
CREATE POLICY property_images_tenant_isolation ON property_images
    FOR ALL TO authenticated
    USING (property_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for property_features
CREATE POLICY property_features_tenant_isolation ON property_features
    FOR ALL TO authenticated
    USING (property_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for restaurant_details
CREATE POLICY restaurant_details_tenant_isolation ON restaurant_details
    FOR ALL TO authenticated
    USING (property_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for hotel_details
CREATE POLICY hotel_details_tenant_isolation ON hotel_details
    FOR ALL TO authenticated
    USING (property_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for room_types
CREATE POLICY room_types_tenant_isolation ON room_types
    FOR ALL TO authenticated
    USING (hotel_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for menu_items
CREATE POLICY menu_items_tenant_isolation ON menu_items
    FOR ALL TO authenticated
    USING (restaurant_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- RLS Policies for property_reviews
CREATE POLICY property_reviews_tenant_isolation ON property_reviews
    FOR ALL TO authenticated
    USING (property_id IN (SELECT id FROM properties WHERE tenant_id = current_setting('app.current_tenant_id')));

-- Functions for property management
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update property rating when reviews change
    UPDATE properties 
    SET rating = (
        SELECT AVG(rating) 
        FROM property_reviews 
        WHERE property_id = NEW.property_id 
        AND is_public = true
    ),
    updated_at = NOW()
    WHERE id = NEW.property_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update property rating
CREATE TRIGGER trigger_update_property_rating
    AFTER INSERT OR UPDATE OR DELETE ON property_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_property_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_details_updated_at
    BEFORE UPDATE ON restaurant_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_details_updated_at
    BEFORE UPDATE ON hotel_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at
    BEFORE UPDATE ON room_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_reviews_updated_at
    BEFORE UPDATE ON property_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
