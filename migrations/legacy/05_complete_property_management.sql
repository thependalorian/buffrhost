-- =============================================================================
-- COMPLETE PROPERTY MANAGEMENT SCHEMA
-- =============================================================================
-- Comprehensive property management for all property types including restaurants
-- Features: Inventory, Orders, Tables, Staff, Services, Bookings, Analytics

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
-- Add comprehensive columns to existing properties table
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
ALTER TABLE properties ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_range VARCHAR(20); -- '$', '$$', '$$$', '$$$$'
ALTER TABLE properties ADD COLUMN IF NOT EXISTS cuisine_type VARCHAR(100); -- For restaurants
ALTER TABLE properties ADD COLUMN IF NOT EXISTS star_rating INTEGER; -- For hotels
ALTER TABLE properties ADD COLUMN IF NOT EXISTS opening_hours JSONB; -- Business hours
ALTER TABLE properties ADD COLUMN IF NOT EXISTS social_media JSONB; -- Social media links
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB; -- Property amenities
ALTER TABLE properties ADD COLUMN IF NOT EXISTS policies JSONB; -- Property policies

-- =============================================================================
-- STAFF MANAGEMENT
-- =============================================================================
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID, -- Links to user account if exists
    employee_id VARCHAR(50) UNIQUE NOT NULL, -- Internal employee ID
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100) NOT NULL, -- 'manager', 'chef', 'waiter', 'host', 'cleaner', 'receptionist'
    department VARCHAR(100), -- 'kitchen', 'service', 'housekeeping', 'front_desk', 'management'
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    hourly_rate DECIMAL(8,2),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'terminated', 'on_leave'
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    skills JSONB, -- Array of skills
    certifications JSONB, -- Array of certifications
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SHIFT MANAGEMENT
-- =============================================================================
CREATE TABLE IF NOT EXISTS staff_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 30, -- Minutes
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE MANAGEMENT (For Restaurants)
-- =============================================================================
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    table_name VARCHAR(100), -- Optional friendly name
    capacity INTEGER NOT NULL, -- Maximum number of guests
    table_type VARCHAR(50) NOT NULL, -- 'indoor', 'outdoor', 'booth', 'bar', 'private'
    location_description VARCHAR(255), -- 'near window', 'center floor', 'patio'
    is_smoking_allowed BOOLEAN DEFAULT false,
    is_wheelchair_accessible BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'occupied', 'reserved', 'maintenance', 'out_of_order'
    x_position INTEGER, -- For floor plan positioning
    y_position INTEGER, -- For floor plan positioning
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, table_number)
);

-- =============================================================================
-- TABLE RESERVATIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS table_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    party_size INTEGER NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 120, -- Expected duration
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INVENTORY MANAGEMENT
-- =============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    item_code VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'food', 'beverage', 'cleaning', 'office', 'maintenance'
    subcategory VARCHAR(100), -- 'meat', 'vegetables', 'alcohol', 'soft_drinks', etc.
    description TEXT,
    unit_of_measure VARCHAR(20) NOT NULL, -- 'kg', 'liters', 'pieces', 'boxes'
    current_stock DECIMAL(10,3) DEFAULT 0,
    minimum_stock DECIMAL(10,3) DEFAULT 0,
    maximum_stock DECIMAL(10,3),
    unit_cost DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2), -- For items that are sold
    supplier VARCHAR(255),
    supplier_contact VARCHAR(255),
    reorder_point DECIMAL(10,3),
    reorder_quantity DECIMAL(10,3),
    expiry_date DATE,
    storage_location VARCHAR(255),
    is_perishable BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, item_code)
);

-- =============================================================================
-- INVENTORY TRANSACTIONS
-- =============================================================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'waste', 'transfer'
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reason VARCHAR(255), -- 'purchase', 'sale', 'waste', 'theft', 'adjustment'
    reference_number VARCHAR(100), -- PO number, invoice number, etc.
    staff_id UUID REFERENCES staff(id),
    notes TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ORDER MANAGEMENT
-- =============================================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    table_id UUID REFERENCES restaurant_tables(id),
    order_type VARCHAR(20) NOT NULL, -- 'dine_in', 'takeaway', 'delivery', 'room_service'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    service_charge DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'partially_paid', 'refunded'
    payment_method VARCHAR(50), -- 'cash', 'card', 'mobile_money', 'bank_transfer'
    special_instructions TEXT,
    staff_id UUID REFERENCES staff(id), -- Server/waiter
    chef_id UUID REFERENCES staff(id), -- Chef assigned
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_ready_time TIMESTAMP WITH TIME ZONE,
    actual_ready_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, order_number)
);

-- =============================================================================
-- ORDER ITEMS
-- =============================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'served'
    chef_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- MENU ITEMS (Enhanced)
-- =============================================================================
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'appetizers', 'mains', 'desserts', 'beverages', 'specials'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    allergens JSONB, -- Array of allergens
    dietary_info JSONB, -- Vegetarian, vegan, gluten-free, etc.
    preparation_time INTEGER, -- Minutes
    spice_level INTEGER DEFAULT 0, -- 0-5 scale
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    ingredients JSONB, -- List of ingredients for inventory tracking
    nutrition_info JSONB, -- Calories, protein, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ROOM TYPES (For Hotels)
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    room_code VARCHAR(50) NOT NULL, -- Unique room identifier
    name VARCHAR(100) NOT NULL,
    description TEXT,
    room_type VARCHAR(50) NOT NULL, -- 'standard', 'deluxe', 'suite', 'villa', 'dormitory', 'private', 'shared'
    size_sqm DECIMAL(8,2),
    max_occupancy INTEGER NOT NULL DEFAULT 1,
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    bed_configuration JSONB, -- {"single": 1, "double": 1, "queen": 0, "king": 0}
    amenities JSONB, -- Array of room-specific amenities
    view_type VARCHAR(50), -- 'garden', 'ocean', 'mountain', 'city', 'pool', 'street'
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
-- ROOM IMAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) NOT NULL, -- 'main', 'gallery', 'bathroom', 'view', 'amenity'
    alt_text VARCHAR(255),
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ROOM AVAILABILITY
-- =============================================================================
CREATE TABLE IF NOT EXISTS room_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    available_rooms INTEGER NOT NULL DEFAULT 0,
    price_override DECIMAL(10,2), -- Override base price for specific dates
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, date)
);

-- =============================================================================
-- PROPERTY IMAGES
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) NOT NULL, -- 'main', 'gallery', 'exterior', 'interior', 'amenity', 'menu', 'room'
    alt_text VARCHAR(255),
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY SERVICES
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'accommodation', 'dining', 'recreation', 'business', 'transport', 'wellness', 'entertainment'
    description TEXT,
    price DECIMAL(10,2),
    price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'per_person', 'per_hour', 'per_day', 'per_night'
    currency VARCHAR(3) DEFAULT 'NAD',
    duration_minutes INTEGER, -- For time-based services
    is_available BOOLEAN DEFAULT true,
    requires_booking BOOLEAN DEFAULT true,
    advance_booking_hours INTEGER DEFAULT 24,
    max_capacity INTEGER,
    age_restriction VARCHAR(50), -- 'all_ages', '18+', '21+', etc.
    service_schedule JSONB, -- Weekly schedule
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- BOOKINGS
-- =============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    booking_number VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    booking_type VARCHAR(20) NOT NULL, -- 'room', 'table', 'service', 'event'
    room_id UUID REFERENCES room_types(id),
    table_id UUID REFERENCES restaurant_tables(id),
    service_id UUID REFERENCES property_services(id),
    check_in_date DATE,
    check_out_date DATE,
    booking_date DATE NOT NULL,
    booking_time TIME,
    duration_minutes INTEGER,
    party_size INTEGER DEFAULT 1,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'no_show'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'partially_paid', 'refunded'
    special_requests TEXT,
    staff_id UUID REFERENCES staff(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, booking_number)
);

-- =============================================================================
-- PROPERTY AMENITIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    amenity_type VARCHAR(50) NOT NULL, -- 'general', 'room', 'bathroom', 'kitchen', 'outdoor', 'safety', 'accessibility', 'dining', 'entertainment'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Icon class or URL
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY POLICIES
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    policy_type VARCHAR(50) NOT NULL, -- 'cancellation', 'check_in', 'check_out', 'payment', 'damage', 'noise', 'smoking', 'pets', 'dining', 'booking'
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_mandatory BOOLEAN DEFAULT false,
    penalty_amount DECIMAL(10,2),
    penalty_type VARCHAR(20), -- 'fixed', 'percentage', 'nightly_rate'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY CONTACT METHODS
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
-- PROPERTY BUSINESS HOURS
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    open_time TIME,
    close_time TIME,
    is_closed BOOLEAN DEFAULT false,
    service_type VARCHAR(50) DEFAULT 'general', -- 'general', 'restaurant', 'spa', 'gym', 'bar'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, day_of_week, service_type)
);

-- =============================================================================
-- PROPERTY SOCIAL MEDIA
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube'
    handle VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- PROPERTY REVIEWS
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL, -- References users table
    booking_id UUID REFERENCES bookings(id),
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
-- PROPERTY ANALYTICS
-- =============================================================================
CREATE TABLE IF NOT EXISTS property_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'views', 'bookings', 'revenue', 'occupancy', 'reviews', 'menu_views', 'service_bookings', 'orders', 'inventory_usage'
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
CREATE INDEX IF NOT EXISTS idx_properties_cuisine_type ON properties(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_properties_star_rating ON properties(star_rating);

-- Staff indexes
CREATE INDEX IF NOT EXISTS idx_staff_property_id ON staff(property_id);
CREATE INDEX IF NOT EXISTS idx_staff_position ON staff(position);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON staff(employee_id);

-- Shift indexes
CREATE INDEX IF NOT EXISTS idx_staff_shifts_staff_id ON staff_shifts(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_shifts_date ON staff_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_staff_shifts_status ON staff_shifts(status);

-- Table indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_property_id ON restaurant_tables(property_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_status ON restaurant_tables(status);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_capacity ON restaurant_tables(capacity);

-- Reservation indexes
CREATE INDEX IF NOT EXISTS idx_table_reservations_property_id ON table_reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_table_reservations_date ON table_reservations(reservation_date);
CREATE INDEX IF NOT EXISTS idx_table_reservations_status ON table_reservations(status);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_items_property_id ON inventory_items(property_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_active ON inventory_items(is_active);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_property_id ON orders(property_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);

-- Menu items indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_property_id ON menu_items(property_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);

-- Room types indexes
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_status ON room_types(status);
CREATE INDEX IF NOT EXISTS idx_room_types_code ON room_types(room_code);

-- Booking indexes
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

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
COMMENT ON TABLE staff IS 'Staff members for all property types';
COMMENT ON TABLE staff_shifts IS 'Staff shift scheduling and management';
COMMENT ON TABLE restaurant_tables IS 'Table management for restaurants';
COMMENT ON TABLE table_reservations IS 'Table reservations and bookings';
COMMENT ON TABLE inventory_items IS 'Inventory management for all property types';
COMMENT ON TABLE inventory_transactions IS 'Inventory movement tracking';
COMMENT ON TABLE orders IS 'Order management for restaurants and services';
COMMENT ON TABLE order_items IS 'Individual items within orders';
COMMENT ON TABLE menu_items IS 'Menu items for restaurants with inventory tracking';
COMMENT ON TABLE room_types IS 'Room types with detailed information';
COMMENT ON TABLE room_images IS 'Images for specific rooms';
COMMENT ON TABLE room_availability IS 'Room availability and pricing by date';
COMMENT ON TABLE property_images IS 'Property images with categorization';
COMMENT ON TABLE property_services IS 'Services offered by properties';
COMMENT ON TABLE bookings IS 'Unified booking system for rooms, tables, and services';
COMMENT ON TABLE property_amenities IS 'Amenities available at properties';
COMMENT ON TABLE property_policies IS 'Property policies and rules';
COMMENT ON TABLE property_contact_methods IS 'Contact methods for properties';
COMMENT ON TABLE property_business_hours IS 'Business hours for properties';
COMMENT ON TABLE property_social_media IS 'Social media accounts for properties';
COMMENT ON TABLE property_reviews IS 'Guest reviews for properties';
COMMENT ON TABLE property_analytics IS 'Analytics data for properties';