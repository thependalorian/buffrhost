-- =============================================================================
-- ENHANCED PROPERTY CMS SCHEMA
-- =============================================================================
-- This schema provides comprehensive property management for property owners
-- Includes: Property profiles, images, services, rooms, amenities, and booking management

-- =============================================================================
-- PROPERTY OWNERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL, -- 'individual', 'company', 'corporation'
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    contact_person VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Namibia',
    website VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ENHANCED PROPERTIES TABLE
-- =============================================================================
ALTER TABLE properties ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES property_owners(id);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_code VARCHAR(50) UNIQUE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_in_time TIME DEFAULT '15:00';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS check_out_time TIME DEFAULT '11:00';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS minimum_stay INTEGER DEFAULT 1;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS maximum_stay INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS advance_booking_days INTEGER DEFAULT 365;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- =============================================================================
-- PROPERTY AMENITIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_type VARCHAR(50) NOT NULL, -- 'general', 'room', 'bathroom', 'kitchen', 'outdoor', 'safety', 'accessibility'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Icon class or URL
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY SERVICES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'accommodation', 'dining', 'recreation', 'business', 'transport', 'wellness'
    description TEXT,
    price DECIMAL(10,2),
    price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'per_person', 'per_hour', 'per_day'
    currency VARCHAR(3) DEFAULT 'NAD',
    duration_minutes INTEGER, -- For time-based services
    is_available BOOLEAN DEFAULT true,
    requires_booking BOOLEAN DEFAULT true,
    advance_booking_hours INTEGER DEFAULT 24,
    max_capacity INTEGER,
    age_restriction VARCHAR(50), -- 'all_ages', '18+', '21+', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ENHANCED ROOM TYPES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_types_enhanced (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_code VARCHAR(50) NOT NULL, -- Unique room identifier
    name VARCHAR(100) NOT NULL,
    description TEXT,
    room_type VARCHAR(50) NOT NULL, -- 'standard', 'deluxe', 'suite', 'villa', 'dormitory'
    size_sqm DECIMAL(8,2),
    max_occupancy INTEGER NOT NULL DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    bed_configuration JSONB, -- {"single": 1, "double": 1, "queen": 0, "king": 0}
    amenities JSONB, -- Array of room-specific amenities
    view_type VARCHAR(50), -- 'garden', 'ocean', 'mountain', 'city', 'pool'
    floor_number INTEGER,
    is_smoking_allowed BOOLEAN DEFAULT false,
    is_pet_friendly BOOLEAN DEFAULT false,
    is_accessible BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'maintenance', 'inactive'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, room_code)
);

-- =============================================================================
-- ROOM IMAGES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room_types_enhanced(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) NOT NULL, -- 'main', 'gallery', 'bathroom', 'view', 'amenity'
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ROOM AVAILABILITY TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room_types_enhanced(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INTEGER NOT NULL DEFAULT 0,
    price_override DECIMAL(10,2), -- Override base price for specific dates
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, date)
);

-- =============================================================================
-- PROPERTY POLICIES TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    policy_type VARCHAR(50) NOT NULL, -- 'cancellation', 'check_in', 'check_out', 'payment', 'damage', 'noise', 'smoking', 'pets'
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_mandatory BOOLEAN DEFAULT false,
    penalty_amount DECIMAL(10,2),
    penalty_type VARCHAR(20), -- 'fixed', 'percentage', 'nightly_rate'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY CONTACT METHODS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_contact_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'phone', 'email', 'whatsapp', 'website', 'social_media'
    contact_value VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY BUSINESS HOURS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    service_type VARCHAR(50) DEFAULT 'general', -- 'general', 'restaurant', 'spa', 'gym'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, day_of_week, service_type)
);

-- =============================================================================
-- PROPERTY SOCIAL MEDIA TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'
    handle VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY REVIEWS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL, -- References users table
    booking_id UUID, -- References bookings table
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    review_text TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    response_text TEXT, -- Owner response
    response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY ANALYTICS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'views', 'bookings', 'revenue', 'occupancy', 'reviews'
    metric_value DECIMAL(15,2) NOT NULL,
    additional_data JSONB, -- Additional context data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, date, metric_type)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Property owners indexes
CREATE INDEX IF NOT EXISTS idx_property_owners_user_id ON property_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_property_owners_status ON property_owners(status);
CREATE INDEX IF NOT EXISTS idx_property_owners_verification ON property_owners(verification_status);

-- Properties indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_properties_verified ON properties(verified);
CREATE INDEX IF NOT EXISTS idx_properties_type_location ON properties(type, location);

-- Amenities indexes
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_type ON property_amenities(amenity_type);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_property_services_property_id ON property_services(property_id);
CREATE INDEX IF NOT EXISTS idx_property_services_type ON property_services(service_type);
CREATE INDEX IF NOT EXISTS idx_property_services_available ON property_services(is_available);

-- Room types indexes
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types_enhanced(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_status ON room_types_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_room_types_code ON room_types_enhanced(room_code);

-- Room images indexes
CREATE INDEX IF NOT EXISTS idx_room_images_room_id ON room_images(room_id);
CREATE INDEX IF NOT EXISTS idx_room_images_primary ON room_images(is_primary);

-- Availability indexes
CREATE INDEX IF NOT EXISTS idx_room_availability_room_date ON room_availability(room_id, date);
CREATE INDEX IF NOT EXISTS idx_room_availability_date ON room_availability(date);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_property_reviews_property_id ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_rating ON property_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_property_reviews_verified ON property_reviews(is_verified);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_property_analytics_property_date ON property_analytics(property_id, date);
CREATE INDEX IF NOT EXISTS idx_property_analytics_metric ON property_analytics(metric_type);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE property_owners IS 'Property owners and business information';
COMMENT ON TABLE property_amenities IS 'Amenities available at properties';
COMMENT ON TABLE property_services IS 'Services offered by properties';
COMMENT ON TABLE room_types_enhanced IS 'Enhanced room types with detailed information';
COMMENT ON TABLE room_images IS 'Images for specific rooms';
COMMENT ON TABLE room_availability IS 'Room availability and pricing by date';
COMMENT ON TABLE property_policies IS 'Property policies and rules';
COMMENT ON TABLE property_contact_methods IS 'Contact methods for properties';
COMMENT ON TABLE property_business_hours IS 'Business hours for properties';
COMMENT ON TABLE property_social_media IS 'Social media accounts for properties';
COMMENT ON TABLE property_reviews IS 'Guest reviews for properties';
COMMENT ON TABLE property_analytics IS 'Analytics data for properties';