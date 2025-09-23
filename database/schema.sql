-- Buffr Host Comprehensive Hospitality Ecosystem Management Platform Database Schema
-- Version 2.0 - Multi-Service Hospitality Operations Management
-- Supports restaurants, hotels, spas, conference facilities, transportation services, and all hospitality amenities

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";

-- 1. HospitalityProperty Table (Restaurants, Hotels, Spas, Conference Facilities, etc.)
CREATE TABLE HospitalityProperty (
    property_id SERIAL PRIMARY KEY,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(50) NOT NULL DEFAULT 'restaurant', -- 'restaurant', 'hotel', 'spa', 'conference', 'mixed'
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
    spa_type VARCHAR(100), -- 'day_spa', 'resort_spa', 'medical_spa'
    -- Conference-specific fields
    max_capacity INTEGER,
    -- Multi-service properties
    services_offered TEXT[], -- Array of services: ['restaurant', 'hotel', 'spa', 'conference', 'transportation', 'recreation']
    amenities TEXT[] -- Array of amenities: ['wifi', 'parking', 'pool', 'gym', 'business_center', 'concierge']
);

-- 2. UserType Table (Different types of users in the system)
CREATE TABLE UserType (
    user_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE, -- 'individual', 'corporate', 'event_planner', 'travel_agent', 'staff', 'admin'
    description TEXT,
    requires_kyc BOOLEAN DEFAULT TRUE,
    requires_kyb BOOLEAN DEFAULT FALSE,
    can_book_rooms BOOLEAN DEFAULT TRUE,
    can_book_facilities BOOLEAN DEFAULT TRUE,
    can_order_restaurant BOOLEAN DEFAULT TRUE,
    can_generate_invoices BOOLEAN DEFAULT FALSE,
    can_manage_bookings BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Buffr HostUser Table (System users who manage hospitality properties)
CREATE TABLE Buffr HostUser (
    owner_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    user_type_id INTEGER REFERENCES UserType(user_type_id) DEFAULT 5, -- Default to 'staff'
    role VARCHAR(50) NOT NULL DEFAULT 'hospitality_staff', -- 'hospitality_manager', 'hospitality_staff', 'admin'
    permissions TEXT[], -- Array of permissions: ['restaurant_management', 'hotel_management', 'spa_management', 'conference_management', 'transportation_management', 'recreation_management', 'loyalty_management', 'analytics_access']
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MenuCategory Table
CREATE TABLE MenuCategory (
    category_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL,
    UNIQUE(property_id, display_order)
);

-- 4. Menu Table (List of all possible items the hospitality property can sell)
CREATE TABLE Menu (
    menu_item_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    category_id INTEGER REFERENCES MenuCategory(category_id) ON DELETE CASCADE,
    preparation_time INTEGER, -- minutes
    calories INTEGER,
    dietary_tags VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    for_type VARCHAR(50) DEFAULT 'all', -- 'dine-in', 'takeout', 'delivery', 'room-service', 'all'
    is_popular BOOLEAN DEFAULT FALSE,
    is_all BOOLEAN DEFAULT TRUE,
    service_type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'room_service', 'spa', 'conference', 'transportation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 5. MenuMedia Table (Pictures or other media for menu items)
CREATE TABLE MenuMedia (
    media_id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Modifiers Table (Groups of choices that can be applied to certain menu items)
CREATE TABLE Modifiers (
    modifiers_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_multiple BOOLEAN DEFAULT FALSE,
    min_selections INTEGER DEFAULT 0,
    max_selections INTEGER DEFAULT 1,
    service_type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'spa', 'conference', 'transportation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. OptionValue Table (Individual choices within a Modifier)
CREATE TABLE OptionValue (
    option_value_id SERIAL PRIMARY KEY,
    modifiers_id INTEGER REFERENCES Modifiers(modifiers_id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    additional_price DECIMAL(10,2) DEFAULT 0.00,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MenuModifiers Table (Join table linking Menu items to Modifier groups)
CREATE TABLE MenuModifiers (
    modifiers_id INTEGER REFERENCES Modifiers(modifiers_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (modifiers_id, menu_item_id)
);

-- 9. UnitOfMeasurement Table
CREATE TABLE UnitOfMeasurement (
    unit_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    abbreviation VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'spa', 'conference', 'transportation', 'recreation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. InventoryItem Table (Raw materials or stock keeping units)
CREATE TABLE InventoryItem (
    inventory_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    current_stock NUMERIC(10,3) DEFAULT 0,
    reorder_level NUMERIC(10,3) DEFAULT 0,
    cost_per_unit NUMERIC(10,2),
    supplier_id VARCHAR(255),
    expiration_date DATE,
    batch_number VARCHAR(100),
    unit_id INTEGER REFERENCES UnitOfMeasurement(unit_id),
    service_type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'spa', 'conference', 'transportation', 'recreation'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 11. MenuItemRawMaterial Table (Basic many-to-many table connecting Menu items to Inventory items)
CREATE TABLE MenuItemRawMaterial (
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    inventory_id INTEGER REFERENCES InventoryItem(inventory_id) ON DELETE CASCADE,
    PRIMARY KEY (menu_item_id, inventory_id)
);

-- 12. Ingredient Table (Detailed recipe lines for each menu item)
CREATE TABLE Ingredient (
    ingredient_id SERIAL PRIMARY KEY,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id) ON DELETE CASCADE,
    inventory_id INTEGER REFERENCES InventoryItem(inventory_id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES UnitOfMeasurement(unit_id),
    quantity DECIMAL(10,3) NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. OptionValueIngredient Table (For each OptionValue, defines which inventory items and quantities that option consumes)
CREATE TABLE OptionValueIngredient (
    option_value_id INTEGER REFERENCES OptionValue(option_value_id) ON DELETE CASCADE,
    inventory_id INTEGER REFERENCES InventoryItem(inventory_id) ON DELETE CASCADE,
    unit_id INTEGER REFERENCES UnitOfMeasurement(unit_id),
    quantity DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (option_value_id, inventory_id)
);

-- 14. OptionValueIngredientMultiplier Table (For some options, quantity scales based on the main recipe)
CREATE TABLE OptionValueIngredientMultiplier (
    option_value_id INTEGER REFERENCES OptionValue(option_value_id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES Ingredient(ingredient_id) ON DELETE CASCADE,
    multiplier DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (option_value_id, ingredient_id)
);

-- 15. Customer Table (Enhanced with user types and compliance)
CREATE TABLE Customer (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type_id INTEGER REFERENCES UserType(user_type_id) DEFAULT 1, -- Default to 'individual'
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    id_document_type VARCHAR(50), -- 'passport', 'drivers_license', 'national_id'
    id_document_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    kyc_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
    kyc_verified_at TIMESTAMP WITH TIME ZONE,
    kyc_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    loyalty_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 15a. CorporateCustomer Table (Business customers with KYB compliance)
CREATE TABLE CorporateCustomer (
    corporate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    business_type VARCHAR(100), -- 'corporation', 'llc', 'partnership', 'sole_proprietorship'
    industry VARCHAR(100),
    company_size VARCHAR(50), -- 'small', 'medium', 'large', 'enterprise'
    annual_revenue DECIMAL(15,2),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100),
    billing_postal_code VARCHAR(20),
    authorized_signatory_name VARCHAR(255),
    authorized_signatory_title VARCHAR(100),
    authorized_signatory_email VARCHAR(255),
    authorized_signatory_phone VARCHAR(20),
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30, -- Days
    kyb_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
    kyb_verified_at TIMESTAMP WITH TIME ZONE,
    kyb_expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 15b. KYCKYBDocument Table (Document storage for compliance)
CREATE TABLE KYCKYBDocument (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id) ON DELETE CASCADE,
    corporate_id UUID REFERENCES CorporateCustomer(corporate_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'passport', 'drivers_license', 'national_id', 'business_license', 'tax_certificate', 'bank_statement'
    document_category VARCHAR(50) NOT NULL, -- 'kyc', 'kyb', 'financial', 'legal'
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    upload_status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'processing', 'verified', 'rejected'
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_notes TEXT,
    verified_by VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Order Table (Records each incoming order)
CREATE TABLE "Order" (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL UNIQUE,
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total DECIMAL(10,2) DEFAULT 0.00,
    payment_method VARCHAR(50), -- 'credit_card', 'cash', 'gift_card', 'loyalty_points'
    service_type VARCHAR(50) DEFAULT 'restaurant', -- 'restaurant', 'room_service', 'spa', 'conference', 'transportation', 'recreation'
    order_type VARCHAR(50) DEFAULT 'dine_in', -- 'dine_in', 'takeout', 'delivery', 'room_service', 'spa_booking', 'conference_booking', 'transportation_booking'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    special_instructions TEXT
);

-- 17. OrderItem Table (Each menu item purchased within an order)
CREATE TABLE OrderItem (
    order_item_id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES "Order"(order_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order NUMERIC(10,2) NOT NULL,
    special_instructions TEXT
);

-- 18. OrderItemOption Table (Records exactly which OptionValues were chosen for each OrderItem)
CREATE TABLE OrderItemOption (
    order_item_id INTEGER REFERENCES OrderItem(order_item_id) ON DELETE CASCADE,
    option_value_id INTEGER REFERENCES OptionValue(option_value_id) ON DELETE CASCADE,
    PRIMARY KEY (order_item_id, option_value_id)
);

-- 19. SpaService Table (Spa treatments and wellness services)
CREATE TABLE SpaService (
    spa_service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    base_price NUMERIC(10,2) NOT NULL,
    category VARCHAR(100), -- 'massage', 'facial', 'body_treatment', 'wellness', 'beauty'
    is_available BOOLEAN DEFAULT TRUE,
    max_capacity INTEGER DEFAULT 1,
    requires_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 20. ConferenceRoom Table (Meeting rooms and conference facilities)
CREATE TABLE ConferenceRoom (
    room_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    room_name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    base_price_per_hour NUMERIC(10,2) NOT NULL,
    amenities TEXT[], -- ['projector', 'whiteboard', 'wifi', 'catering', 'av_equipment']
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 21. TransportationService Table (Shuttle, valet, tour services)
CREATE TABLE TransportationService (
    service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'shuttle', 'valet', 'tour', 'airport_transfer', 'city_tour'
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER,
    capacity INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE,
    requires_booking BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 22. RecreationService Table (Golf, tennis, swimming, fitness)
CREATE TABLE RecreationService (
    recreation_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'golf', 'tennis', 'swimming', 'fitness', 'sports', 'activities'
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

-- 23. SpecializedService Table (Camping, laundry, concierge, gift shop)
CREATE TABLE SpecializedService (
    service_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'camping', 'laundry', 'concierge', 'gift_shop', 'business_center', 'valet'
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    duration_minutes INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    requires_booking BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 24. ServiceBooking Table (Bookings for spa, conference, transportation, recreation, specialized services)
CREATE TABLE ServiceBooking (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'spa', 'conference', 'transportation', 'recreation', 'specialized'
    service_id INTEGER NOT NULL, -- References the specific service table
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
    total_price NUMERIC(10,2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 25. CrossBusinessLoyalty Table (Enhanced loyalty system for cross-service point transfers)
CREATE TABLE CrossBusinessLoyalty (
    loyalty_id SERIAL PRIMARY KEY,
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    tier_level VARCHAR(50) DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
    points_earned_restaurant INTEGER DEFAULT 0,
    points_earned_hotel INTEGER DEFAULT 0,
    points_earned_spa INTEGER DEFAULT 0,
    points_earned_conference INTEGER DEFAULT 0,
    points_earned_transportation INTEGER DEFAULT 0,
    points_earned_recreation INTEGER DEFAULT 0,
    points_earned_specialized INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 26. LoyaltyTransaction Table (Track all loyalty point transactions)
CREATE TABLE LoyaltyTransaction (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'redeemed', 'transferred_in', 'transferred_out', 'expired'
    points_amount INTEGER NOT NULL,
    service_type VARCHAR(50), -- 'restaurant', 'hotel', 'spa', 'conference', 'transportation', 'recreation', 'specialized'
    order_id UUID REFERENCES "Order"(order_id),
    booking_id UUID REFERENCES ServiceBooking(booking_id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. RoomType Table (Standard, Executive, Premier, Suite, etc.)
CREATE TABLE RoomType (
    room_type_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    type_name VARCHAR(100) NOT NULL, -- 'Standard', 'Executive', 'Premier', 'Suite', 'Presidential'
    type_class VARCHAR(50) NOT NULL, -- 'economy', 'standard', 'deluxe', 'premium', 'luxury'
    description TEXT,
    base_price_per_night NUMERIC(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    bed_type VARCHAR(100), -- 'Single', 'Double', 'Queen', 'King', 'Twin', 'Suite'
    room_size_sqft INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 28. Room Table (Individual hotel rooms)
CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor_number INTEGER,
    room_status VARCHAR(50) DEFAULT 'available', -- 'available', 'occupied', 'maintenance', 'cleaning', 'out_of_order'
    is_smoking BOOLEAN DEFAULT FALSE,
    is_accessible BOOLEAN DEFAULT FALSE,
    view_type VARCHAR(100), -- 'city_view', 'ocean_view', 'garden_view', 'mountain_view', 'interior'
    last_cleaned TIMESTAMP WITH TIME ZONE,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, room_number)
);

-- 29. RoomAmenity Table (Room-specific amenities and features)
CREATE TABLE RoomAmenity (
    amenity_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    amenity_name VARCHAR(100) NOT NULL,
    amenity_category VARCHAR(50), -- 'bathroom', 'bedroom', 'entertainment', 'kitchen', 'connectivity', 'safety'
    description TEXT,
    is_chargeable BOOLEAN DEFAULT FALSE,
    additional_cost NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 30. RoomTypeAmenity Table (Link room types to available amenities)
CREATE TABLE RoomTypeAmenity (
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES RoomAmenity(amenity_id) ON DELETE CASCADE,
    is_included BOOLEAN DEFAULT TRUE,
    additional_cost NUMERIC(10,2) DEFAULT 0.00,
    PRIMARY KEY (room_type_id, amenity_id)
);

-- 31. RoomReservation Table (Hotel room bookings and reservations)
CREATE TABLE RoomReservation (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES Room(room_id) ON DELETE CASCADE,
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    adults INTEGER NOT NULL DEFAULT 1,
    children INTEGER DEFAULT 0,
    infants INTEGER DEFAULT 0,
    reservation_status VARCHAR(50) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'
    total_nights INTEGER NOT NULL,
    base_rate NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    taxes NUMERIC(10,2) DEFAULT 0.00,
    fees NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'refunded'
    special_requests TEXT,
    loyalty_points_earned INTEGER DEFAULT 0,
    loyalty_points_redeemed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 32. RoomRate Table (Dynamic pricing for room types)
CREATE TABLE RoomRate (
    rate_id SERIAL PRIMARY KEY,
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    rate_name VARCHAR(100) NOT NULL, -- 'Standard Rate', 'Weekend Rate', 'Holiday Rate', 'Corporate Rate'
    rate_type VARCHAR(50) NOT NULL, -- 'standard', 'weekend', 'holiday', 'corporate', 'group', 'advance_purchase'
    base_rate NUMERIC(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 33. RoomServiceOrder Table (Room service orders for hotel guests)
CREATE TABLE RoomServiceOrder (
    room_service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES RoomReservation(reservation_id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES Room(room_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES Customer(customer_id),
    order_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'preparing', 'delivered', 'completed', 'cancelled'
    order_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_time TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    gratuity NUMERIC(10,2) DEFAULT 0.00,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 34. RoomServiceItem Table (Items ordered through room service)
CREATE TABLE RoomServiceItem (
    room_service_item_id SERIAL PRIMARY KEY,
    room_service_id UUID REFERENCES RoomServiceOrder(room_service_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order NUMERIC(10,2) NOT NULL,
    special_instructions TEXT
);

-- 35. CorporateBooking Table (Corporate group bookings and events)
CREATE TABLE CorporateBooking (
    corporate_booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corporate_id UUID REFERENCES CorporateCustomer(corporate_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    booking_type VARCHAR(50) NOT NULL, -- 'conference', 'group_accommodation', 'event', 'corporate_retreat', 'training'
    event_name VARCHAR(255),
    event_description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    expected_attendees INTEGER,
    actual_attendees INTEGER,
    booking_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'
    total_estimated_cost DECIMAL(15,2) DEFAULT 0.00,
    total_actual_cost DECIMAL(15,2) DEFAULT 0.00,
    deposit_amount DECIMAL(15,2) DEFAULT 0.00,
    balance_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_terms INTEGER DEFAULT 30, -- Days
    special_requirements TEXT,
    contact_person_name VARCHAR(255),
    contact_person_email VARCHAR(255),
    contact_person_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 36. CorporateBookingItem Table (Individual items in corporate bookings)
CREATE TABLE CorporateBookingItem (
    booking_item_id SERIAL PRIMARY KEY,
    corporate_booking_id UUID REFERENCES CorporateBooking(corporate_booking_id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'room', 'conference_room', 'spa_service', 'transportation', 'recreation', 'catering', 'equipment'
    item_id INTEGER, -- References the specific service table
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date DATE,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    special_requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 37. Quotation Table (Quotes for corporate bookings)
CREATE TABLE Quotation (
    quotation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corporate_booking_id UUID REFERENCES CorporateBooking(corporate_booking_id) ON DELETE CASCADE,
    quotation_number VARCHAR(50) UNIQUE NOT NULL,
    quotation_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected', 'expired'
    subtotal DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    terms_and_conditions TEXT,
    notes TEXT,
    prepared_by VARCHAR(255),
    sent_to_email VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 38. QuotationItem Table (Individual items in quotations)
CREATE TABLE QuotationItem (
    quotation_item_id SERIAL PRIMARY KEY,
    quotation_id UUID REFERENCES Quotation(quotation_id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 39. Invoice Table (Invoices for corporate bookings)
CREATE TABLE Invoice (
    invoice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corporate_booking_id UUID REFERENCES CorporateBooking(corporate_booking_id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES Quotation(quotation_id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
    subtotal DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0.00,
    balance_amount DECIMAL(15,2) NOT NULL,
    payment_terms INTEGER DEFAULT 30, -- Days
    payment_method VARCHAR(50), -- 'bank_transfer', 'credit_card', 'check', 'cash'
    payment_reference VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 40. InvoiceItem Table (Individual items in invoices)
CREATE TABLE InvoiceItem (
    invoice_item_id SERIAL PRIMARY KEY,
    invoice_id UUID REFERENCES Invoice(invoice_id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 41. KnowledgeBase Table (AI receptionist and Q&A system knowledge)
CREATE TABLE KnowledgeBase (
    knowledge_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- 'general_info', 'policies', 'services', 'pricing', 'procedures', 'emergency'
    subcategory VARCHAR(100), -- 'check_in', 'check_out', 'room_service', 'spa_services', 'conference_booking'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'markdown', 'html', 'faq', 'procedure'
    tags TEXT[], -- Array of tags for better search
    priority INTEGER DEFAULT 1, -- 1=high, 2=medium, 3=low
    is_active BOOLEAN DEFAULT TRUE,
    last_updated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 42. AIAgentSession Table (AI agent conversation sessions)
CREATE TABLE AIAgentSession (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    agent_type VARCHAR(50) NOT NULL, -- 'receptionist', 'booking_agent', 'concierge', 'support'
    session_status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'transferred', 'escalated'
    language VARCHAR(10) DEFAULT 'en',
    user_intent VARCHAR(100), -- 'book_room', 'ask_question', 'make_reservation', 'get_info'
    context_data JSONB, -- Store conversation context and user preferences
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    transferred_to_human BOOLEAN DEFAULT FALSE,
    satisfaction_rating INTEGER, -- 1-5 rating
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 43. AIAgentMessage Table (Individual messages in AI conversations)
CREATE TABLE AIAgentMessage (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL, -- 'user_input', 'ai_response', 'system_message', 'escalation'
    content TEXT NOT NULL,
    intent_detected VARCHAR(100), -- Detected user intent
    entities_extracted JSONB, -- Extracted entities (dates, names, preferences)
    confidence_score DECIMAL(3,2), -- AI confidence in response (0.00-1.00)
    response_time_ms INTEGER, -- Response time in milliseconds
    model_used VARCHAR(100), -- AI model used for response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 44. AIAgentWorkflow Table (LangGraph workflow definitions)
CREATE TABLE AIAgentWorkflow (
    workflow_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(100) NOT NULL, -- 'booking_flow', 'support_flow', 'concierge_flow', 'check_in_flow'
    description TEXT,
    workflow_definition JSONB NOT NULL, -- LangGraph workflow definition
    input_schema JSONB, -- Pydantic input schema
    output_schema JSONB, -- Pydantic output schema
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 45. AIAgentExecution Table (Workflow execution tracking)
CREATE TABLE AIAgentExecution (
    execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES AIAgentWorkflow(workflow_id) ON DELETE CASCADE,
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    execution_status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    steps_completed INTEGER DEFAULT 0,
    total_steps INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 46. DocumentManagement Table (Document storage and management)
CREATE TABLE DocumentManagement (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'contract', 'invoice', 'quotation', 'policy', 'manual', 'certificate'
    document_category VARCHAR(50) NOT NULL, -- 'legal', 'financial', 'operational', 'compliance', 'marketing'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 hash for integrity
    version VARCHAR(20) DEFAULT '1.0',
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'private', -- 'public', 'internal', 'private', 'restricted'
    tags TEXT[],
    metadata JSONB, -- Additional document metadata
    uploaded_by VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 47. DocumentAccessLog Table (Document access tracking)
CREATE TABLE DocumentAccessLog (
    access_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES DocumentManagement(document_id) ON DELETE CASCADE,
    user_id VARCHAR(255), -- Can be customer_id or staff user_id
    access_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'edit', 'share'
    ip_address INET,
    user_agent TEXT,
    access_granted BOOLEAN DEFAULT TRUE,
    access_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance

-- Create indexes for better performance
CREATE INDEX idx_hospitality_property_active ON HospitalityProperty(is_active);
CREATE INDEX idx_hospitality_property_type ON HospitalityProperty(property_type);
CREATE INDEX idx_shandi_user_property ON Buffr HostUser(property_id);
CREATE INDEX idx_shandi_user_email ON Buffr HostUser(email);
CREATE INDEX idx_shandi_user_role ON Buffr HostUser(role);
CREATE INDEX idx_menu_category_property ON MenuCategory(property_id);
CREATE INDEX idx_menu_property ON Menu(property_id);
CREATE INDEX idx_menu_category ON Menu(category_id);
CREATE INDEX idx_menu_available ON Menu(is_available);
CREATE INDEX idx_menu_service_type ON Menu(service_type);
CREATE INDEX idx_menu_media_item ON MenuMedia(menu_item_id);
CREATE INDEX idx_modifiers_property ON Modifiers(property_id);
CREATE INDEX idx_modifiers_service_type ON Modifiers(service_type);
CREATE INDEX idx_option_value_modifier ON OptionValue(modifiers_id);
CREATE INDEX idx_inventory_property ON InventoryItem(property_id);
CREATE INDEX idx_inventory_stock ON InventoryItem(current_stock);
CREATE INDEX idx_inventory_service_type ON InventoryItem(service_type);
CREATE INDEX idx_ingredient_menu_item ON Ingredient(menu_item_id);
CREATE INDEX idx_ingredient_inventory ON Ingredient(inventory_id);
CREATE INDEX idx_customer_email ON Customer(email);
CREATE INDEX idx_order_property ON "Order"(property_id);
CREATE INDEX idx_order_customer ON "Order"(customer_id);
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_date ON "Order"(order_date);
CREATE INDEX idx_order_service_type ON "Order"(service_type);
CREATE INDEX idx_order_item_order ON OrderItem(order_id);
CREATE INDEX idx_order_item_menu ON OrderItem(menu_item_id);
-- New hospitality service indexes
CREATE INDEX idx_spa_service_property ON SpaService(property_id);
CREATE INDEX idx_spa_service_category ON SpaService(category);
CREATE INDEX idx_conference_room_property ON ConferenceRoom(property_id);
CREATE INDEX idx_conference_room_capacity ON ConferenceRoom(capacity);
CREATE INDEX idx_transportation_service_property ON TransportationService(property_id);
CREATE INDEX idx_transportation_service_type ON TransportationService(service_type);
CREATE INDEX idx_recreation_service_property ON RecreationService(property_id);
CREATE INDEX idx_recreation_service_type ON RecreationService(service_type);
CREATE INDEX idx_specialized_service_property ON SpecializedService(property_id);
CREATE INDEX idx_specialized_service_type ON SpecializedService(service_type);
CREATE INDEX idx_service_booking_customer ON ServiceBooking(customer_id);
CREATE INDEX idx_service_booking_property ON ServiceBooking(property_id);
CREATE INDEX idx_service_booking_date ON ServiceBooking(booking_date);
CREATE INDEX idx_service_booking_status ON ServiceBooking(status);
CREATE INDEX idx_cross_business_loyalty_customer ON CrossBusinessLoyalty(customer_id);
CREATE INDEX idx_cross_business_loyalty_property ON CrossBusinessLoyalty(property_id);
CREATE INDEX idx_cross_business_loyalty_tier ON CrossBusinessLoyalty(tier_level);
CREATE INDEX idx_loyalty_transaction_customer ON LoyaltyTransaction(customer_id);
CREATE INDEX idx_loyalty_transaction_property ON LoyaltyTransaction(property_id);
CREATE INDEX idx_loyalty_transaction_type ON LoyaltyTransaction(transaction_type);
CREATE INDEX idx_loyalty_transaction_date ON LoyaltyTransaction(created_at);
-- Room management indexes
CREATE INDEX idx_room_type_property ON RoomType(property_id);
CREATE INDEX idx_room_type_class ON RoomType(type_class);
CREATE INDEX idx_room_property ON Room(property_id);
CREATE INDEX idx_room_type ON Room(room_type_id);
CREATE INDEX idx_room_status ON Room(room_status);
CREATE INDEX idx_room_number ON Room(room_number);
CREATE INDEX idx_room_amenity_property ON RoomAmenity(property_id);
CREATE INDEX idx_room_amenity_category ON RoomAmenity(amenity_category);
CREATE INDEX idx_room_reservation_customer ON RoomReservation(customer_id);
CREATE INDEX idx_room_reservation_property ON RoomReservation(property_id);
CREATE INDEX idx_room_reservation_room ON RoomReservation(room_id);
CREATE INDEX idx_room_reservation_dates ON RoomReservation(check_in_date, check_out_date);
CREATE INDEX idx_room_reservation_status ON RoomReservation(reservation_status);
CREATE INDEX idx_room_rate_type ON RoomRate(room_type_id);
CREATE INDEX idx_room_rate_dates ON RoomRate(start_date, end_date);
CREATE INDEX idx_room_rate_type_name ON RoomRate(rate_type);
CREATE INDEX idx_room_service_order_reservation ON RoomServiceOrder(reservation_id);
CREATE INDEX idx_room_service_order_room ON RoomServiceOrder(room_id);
CREATE INDEX idx_room_service_order_status ON RoomServiceOrder(order_status);
CREATE INDEX idx_room_service_item_order ON RoomServiceItem(room_service_id);
-- User management and compliance indexes
CREATE INDEX idx_user_type_name ON UserType(type_name);
CREATE INDEX idx_shandi_user_type ON Buffr HostUser(user_type_id);
CREATE INDEX idx_customer_user_type ON Customer(user_type_id);
CREATE INDEX idx_customer_kyc_status ON Customer(kyc_status);
CREATE INDEX idx_corporate_customer_company ON CorporateCustomer(company_name);
CREATE INDEX idx_corporate_customer_kyb_status ON CorporateCustomer(kyb_status);
CREATE INDEX idx_kyc_kyb_document_customer ON KYCKYBDocument(customer_id);
CREATE INDEX idx_kyc_kyb_document_corporate ON KYCKYBDocument(corporate_id);
CREATE INDEX idx_kyc_kyb_document_type ON KYCKYBDocument(document_type);
CREATE INDEX idx_kyc_kyb_document_status ON KYCKYBDocument(verification_status);
-- Corporate booking and financial indexes
CREATE INDEX idx_corporate_booking_corporate ON CorporateBooking(corporate_id);
CREATE INDEX idx_corporate_booking_property ON CorporateBooking(property_id);
CREATE INDEX idx_corporate_booking_status ON CorporateBooking(booking_status);
CREATE INDEX idx_corporate_booking_dates ON CorporateBooking(start_date, end_date);
CREATE INDEX idx_corporate_booking_item_booking ON CorporateBookingItem(corporate_booking_id);
CREATE INDEX idx_quotation_booking ON Quotation(corporate_booking_id);
CREATE INDEX idx_quotation_number ON Quotation(quotation_number);
CREATE INDEX idx_quotation_status ON Quotation(status);
CREATE INDEX idx_quotation_date ON Quotation(quotation_date);
CREATE INDEX idx_quotation_item_quotation ON QuotationItem(quotation_id);
CREATE INDEX idx_invoice_booking ON Invoice(corporate_booking_id);
CREATE INDEX idx_invoice_number ON Invoice(invoice_number);
CREATE INDEX idx_invoice_status ON Invoice(status);
CREATE INDEX idx_invoice_due_date ON Invoice(due_date);
CREATE INDEX idx_invoice_item_invoice ON InvoiceItem(invoice_id);
-- AI and knowledge base indexes
CREATE INDEX idx_knowledge_base_property ON KnowledgeBase(property_id);
CREATE INDEX idx_knowledge_base_category ON KnowledgeBase(category);
CREATE INDEX idx_knowledge_base_tags ON KnowledgeBase USING GIN(tags);
CREATE INDEX idx_ai_agent_session_customer ON AIAgentSession(customer_id);
CREATE INDEX idx_ai_agent_session_property ON AIAgentSession(property_id);
CREATE INDEX idx_ai_agent_session_type ON AIAgentSession(agent_type);
CREATE INDEX idx_ai_agent_session_status ON AIAgentSession(session_status);
CREATE INDEX idx_ai_agent_message_session ON AIAgentMessage(session_id);
CREATE INDEX idx_ai_agent_message_type ON AIAgentMessage(message_type);
CREATE INDEX idx_ai_agent_workflow_type ON AIAgentWorkflow(workflow_type);
CREATE INDEX idx_ai_agent_workflow_active ON AIAgentWorkflow(is_active);
CREATE INDEX idx_ai_agent_execution_workflow ON AIAgentExecution(workflow_id);
CREATE INDEX idx_ai_agent_execution_session ON AIAgentExecution(session_id);
CREATE INDEX idx_ai_agent_execution_status ON AIAgentExecution(execution_status);
-- Document management indexes
CREATE INDEX idx_document_management_property ON DocumentManagement(property_id);
CREATE INDEX idx_document_management_type ON DocumentManagement(document_type);
CREATE INDEX idx_document_management_category ON DocumentManagement(document_category);
CREATE INDEX idx_document_management_tags ON DocumentManagement USING GIN(tags);
CREATE INDEX idx_document_management_active ON DocumentManagement(is_active);
CREATE INDEX idx_document_access_log_document ON DocumentAccessLog(document_id);
CREATE INDEX idx_document_access_log_user ON DocumentAccessLog(user_id);
CREATE INDEX idx_document_access_log_type ON DocumentAccessLog(access_type);
CREATE INDEX idx_document_access_log_date ON DocumentAccessLog(created_at);
-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_hospitality_property_updated_at BEFORE UPDATE ON HospitalityProperty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shandi_user_updated_at BEFORE UPDATE ON Buffr HostUser FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_updated_at BEFORE UPDATE ON Menu FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON InventoryItem FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON Customer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- New hospitality service triggers
CREATE TRIGGER update_spa_service_updated_at BEFORE UPDATE ON SpaService FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conference_room_updated_at BEFORE UPDATE ON ConferenceRoom FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transportation_service_updated_at BEFORE UPDATE ON TransportationService FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recreation_service_updated_at BEFORE UPDATE ON RecreationService FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_specialized_service_updated_at BEFORE UPDATE ON SpecializedService FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_booking_updated_at BEFORE UPDATE ON ServiceBooking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cross_business_loyalty_updated_at BEFORE UPDATE ON CrossBusinessLoyalty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Room management triggers
CREATE TRIGGER update_room_type_updated_at BEFORE UPDATE ON RoomType FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_updated_at BEFORE UPDATE ON Room FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_amenity_updated_at BEFORE UPDATE ON RoomAmenity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_reservation_updated_at BEFORE UPDATE ON RoomReservation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_rate_updated_at BEFORE UPDATE ON RoomRate FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_service_order_updated_at BEFORE UPDATE ON RoomServiceOrder FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- User management and compliance triggers
CREATE TRIGGER update_customer_updated_at BEFORE UPDATE ON Customer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_corporate_customer_updated_at BEFORE UPDATE ON CorporateCustomer FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Corporate booking and financial triggers
CREATE TRIGGER update_corporate_booking_updated_at BEFORE UPDATE ON CorporateBooking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotation_updated_at BEFORE UPDATE ON Quotation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_updated_at BEFORE UPDATE ON Invoice FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- AI and knowledge base triggers
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON KnowledgeBase FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agent_workflow_updated_at BEFORE UPDATE ON AIAgentWorkflow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO HospitalityProperty (property_name, property_type, address, phone, email, timezone, services_offered, amenities) VALUES 
('Buffr Host Resort & Spa', 'mixed', '123 Resort Blvd, Demo City, DC 12345', '+1-555-0123', 'info@shandiresort.com', 'America/New_York', 
 ARRAY['restaurant', 'hotel', 'spa', 'conference', 'transportation', 'recreation'], 
 ARRAY['wifi', 'parking', 'pool', 'gym', 'business_center', 'concierge']),
('Buffr Host Downtown Restaurant', 'restaurant', '456 Main St, Demo City, DC 12345', '+1-555-0124', 'downtown@shandirestaurant.com', 'America/New_York',
 ARRAY['restaurant'], 
 ARRAY['wifi', 'parking']),
('Buffr Host Conference Center', 'conference', '789 Business Ave, Demo City, DC 12345', '+1-555-0125', 'events@shandiconference.com', 'America/New_York',
 ARRAY['conference', 'restaurant'], 
 ARRAY['wifi', 'parking', 'business_center', 'av_equipment']);

INSERT INTO UnitOfMeasurement (property_id, name, abbreviation, service_type) VALUES 
(1, 'Piece', 'pc', 'restaurant'),
(1, 'Ounce', 'oz', 'restaurant'),
(1, 'Pound', 'lb', 'restaurant'),
(1, 'Kilogram', 'kg', 'restaurant'),
(1, 'Liter', 'L', 'restaurant'),
(1, 'Cup', 'cup', 'restaurant'),
(1, 'Tablespoon', 'tbsp', 'restaurant'),
(1, 'Teaspoon', 'tsp', 'restaurant'),
(1, 'Hour', 'hr', 'spa'),
(1, 'Minute', 'min', 'spa'),
(1, 'Session', 'session', 'spa'),
(1, 'Room', 'room', 'conference'),
(1, 'Person', 'person', 'conference'),
(1, 'Trip', 'trip', 'transportation'),
(1, 'Round', 'round', 'recreation');

INSERT INTO MenuCategory (property_id, name, display_order) VALUES 
(1, 'Appetizers', 1),
(1, 'Main Courses', 2),
(1, 'Desserts', 3),
(1, 'Beverages', 4),
(1, 'Room Service', 5),
(2, 'Appetizers', 1),
(2, 'Main Courses', 2),
(2, 'Desserts', 3),
(2, 'Beverages', 4);

-- Sample inventory items
INSERT INTO InventoryItem (property_id, name, current_stock, reorder_level, cost_per_unit, unit_id, service_type) VALUES 
(1, 'Beef Patty', 50.0, 10.0, 2.50, 3, 'restaurant'), -- lb
(1, 'Burger Bun', 100.0, 20.0, 0.25, 1, 'restaurant'), -- pc
(1, 'Cheddar Cheese Block', 25.0, 5.0, 3.00, 3, 'restaurant'), -- lb
(1, 'Lettuce', 10.0, 2.0, 1.50, 3, 'restaurant'), -- lb
(1, 'Tomato', 15.0, 3.0, 2.00, 3, 'restaurant'), -- lb
(1, 'Bacon Strips', 20.0, 5.0, 4.00, 3, 'restaurant'), -- lb
(1, 'Massage Oil', 10.0, 2.0, 15.00, 11, 'spa'), -- session
(1, 'Towels', 100.0, 20.0, 5.00, 1, 'spa'), -- pc
(1, 'Projector', 5.0, 1.0, 500.00, 1, 'conference'), -- pc
(1, 'Shuttle Fuel', 200.0, 50.0, 3.50, 14, 'transportation'); -- trip

-- Sample menu items
INSERT INTO Menu (property_id, name, description, base_price, category_id, preparation_time, calories, service_type) VALUES 
(1, 'Classic Cheeseburger', 'Juicy beef patty with cheddar cheese, lettuce, and tomato on a fresh bun', 8.99, 1, 15, 650, 'restaurant'),
(1, 'Bacon Cheeseburger', 'Classic cheeseburger with crispy bacon strips', 10.99, 1, 18, 750, 'restaurant'),
(1, 'Garden Salad', 'Fresh mixed greens with tomatoes, cucumbers, and house dressing', 6.50, 1, 5, 200, 'restaurant'),
(1, 'Room Service Burger', 'Classic cheeseburger delivered to your room', 12.99, 5, 20, 650, 'room_service'),
(2, 'Downtown Special Burger', 'Signature burger at our downtown location', 9.99, 5, 15, 700, 'restaurant');

-- Sample modifiers
INSERT INTO Modifiers (property_id, name, is_multiple, min_selections, max_selections, service_type) VALUES 
(1, 'Cheese Options', FALSE, 1, 1, 'restaurant'),
(1, 'Extra Toppings', TRUE, 0, 3, 'restaurant'),
(1, 'Massage Pressure', FALSE, 1, 1, 'spa'),
(1, 'Room Setup', FALSE, 1, 1, 'conference');

-- Sample option values
INSERT INTO OptionValue (modifiers_id, value, additional_price, is_available) VALUES 
(1, 'Cheddar Cheese', 0.00, TRUE),
(1, 'Swiss Cheese', 0.50, TRUE),
(1, 'No Cheese', -0.50, TRUE),
(2, 'Extra Bacon', 1.50, TRUE),
(2, 'Extra Cheese', 1.00, TRUE),
(2, 'Avocado', 1.25, TRUE),
(3, 'Light Pressure', 0.00, TRUE),
(3, 'Medium Pressure', 0.00, TRUE),
(3, 'Firm Pressure', 0.00, TRUE),
(4, 'Theater Style', 0.00, TRUE),
(4, 'Boardroom Style', 0.00, TRUE),
(4, 'U-Shape', 0.00, TRUE);

-- Link modifiers to menu items
INSERT INTO MenuModifiers (modifiers_id, menu_item_id, is_required) VALUES 
(1, 1, TRUE), -- Cheeseburger requires cheese choice
(2, 1, FALSE), -- Cheeseburger can have extra toppings
(1, 2, TRUE), -- Bacon cheeseburger requires cheese choice
(2, 2, FALSE); -- Bacon cheeseburger can have extra toppings

-- Sample ingredients (recipe for cheeseburger)
INSERT INTO Ingredient (menu_item_id, inventory_id, unit_id, quantity, is_visible, display_order) VALUES 
(1, 1, 3, 0.25, TRUE, 1), -- 0.25 lb beef patty
(1, 2, 1, 1.0, TRUE, 2), -- 1 pc bun
(1, 3, 3, 0.125, TRUE, 3), -- 0.125 lb cheddar cheese (2 oz)
(1, 4, 3, 0.031, TRUE, 4), -- 0.031 lb lettuce (0.5 oz)
(1, 5, 3, 0.031, TRUE, 5); -- 0.031 lb tomato (0.5 oz)

-- Sample hospitality services
INSERT INTO SpaService (property_id, name, description, duration_minutes, base_price, category) VALUES 
(1, 'Swedish Massage', 'Relaxing full-body massage with Swedish techniques', 60, 120.00, 'massage'),
(1, 'Deep Tissue Massage', 'Therapeutic massage for muscle tension relief', 90, 150.00, 'massage'),
(1, 'Facial Treatment', 'Rejuvenating facial with cleansing and moisturizing', 75, 100.00, 'facial'),
(1, 'Hot Stone Therapy', 'Massage with heated stones for deep relaxation', 90, 140.00, 'body_treatment');

INSERT INTO ConferenceRoom (property_id, room_name, capacity, base_price_per_hour, amenities) VALUES 
(1, 'Grand Ballroom', 200, 500.00, ARRAY['projector', 'whiteboard', 'wifi', 'catering', 'av_equipment']),
(1, 'Executive Boardroom', 20, 150.00, ARRAY['projector', 'whiteboard', 'wifi', 'av_equipment']),
(1, 'Training Room A', 50, 200.00, ARRAY['projector', 'whiteboard', 'wifi']),
(3, 'Main Conference Hall', 300, 750.00, ARRAY['projector', 'whiteboard', 'wifi', 'catering', 'av_equipment', 'recording']);

INSERT INTO TransportationService (property_id, service_name, service_type, description, base_price, duration_minutes, capacity) VALUES 
(1, 'Airport Shuttle', 'shuttle', 'Complimentary shuttle service to/from airport', 0.00, 30, 8),
(1, 'City Tour', 'tour', 'Guided city tour with professional guide', 75.00, 180, 15),
(1, 'Valet Parking', 'valet', 'Professional valet parking service', 25.00, 5, 1),
(1, 'Wine Country Tour', 'tour', 'Full-day wine country tour with tastings', 150.00, 480, 12);

INSERT INTO RecreationService (property_id, service_name, service_type, description, base_price, duration_minutes, capacity, equipment_included) VALUES 
(1, 'Golf Course Access', 'golf', 'Access to 18-hole championship golf course', 85.00, 240, 1, FALSE),
(1, 'Tennis Court Rental', 'tennis', 'Private tennis court rental with equipment', 45.00, 60, 4, TRUE),
(1, 'Swimming Pool Access', 'swimming', 'Access to resort swimming pool and facilities', 15.00, 120, 1, FALSE),
(1, 'Fitness Center', 'fitness', 'Full access to fitness center and equipment', 20.00, 60, 1, TRUE);

INSERT INTO SpecializedService (property_id, service_name, service_type, description, base_price, duration_minutes, requires_booking) VALUES 
(1, 'Laundry Service', 'laundry', 'Professional laundry and dry cleaning service', 15.00, 1440, FALSE),
(1, 'Concierge Service', 'concierge', 'Personal concierge assistance for all needs', 0.00, 30, FALSE),
(1, 'Gift Shop', 'gift_shop', 'Resort gift shop with local souvenirs', 0.00, 30, FALSE),
(1, 'Business Center', 'business_center', 'Access to business center with computers and printing', 10.00, 60, FALSE);

-- Sample customer
INSERT INTO Customer (email, phone, first_name, last_name, loyalty_points) VALUES 
('demo@example.com', '+1-555-0124', 'Demo', 'Customer', 100),
('spa.guest@example.com', '+1-555-0125', 'Spa', 'Guest', 250),
('conference.organizer@example.com', '+1-555-0126', 'Conference', 'Organizer', 500);

-- Sample cross-business loyalty
INSERT INTO CrossBusinessLoyalty (customer_id, property_id, total_points, tier_level, points_earned_restaurant, points_earned_spa, points_earned_conference) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, 100, 'bronze', 50, 30, 20),
('550e8400-e29b-41d4-a716-446655440001', 1, 250, 'silver', 100, 100, 50),
('550e8400-e29b-41d4-a716-446655440002', 1, 500, 'gold', 200, 150, 150);

-- Sample orders
INSERT INTO "Order" (customer_id, property_id, status, total, payment_method, service_type, order_type) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, 'completed', 18.48, 'credit_card', 'restaurant', 'dine_in'),
('550e8400-e29b-41d4-a716-446655440001', 1, 'completed', 120.00, 'loyalty_points', 'spa', 'spa_booking'),
('550e8400-e29b-41d4-a716-446655440002', 1, 'completed', 500.00, 'credit_card', 'conference', 'conference_booking');

-- Sample order items
INSERT INTO OrderItem (order_id, menu_item_id, quantity, price_at_order, special_instructions) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, 2, 8.99, 'Extra crispy'),
('550e8400-e29b-41d4-a716-446655440000', 3, 1, 6.50, '');

-- Sample service bookings
INSERT INTO ServiceBooking (customer_id, property_id, service_type, service_id, booking_date, start_time, end_time, status, total_price) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 1, 'spa', 1, '2024-01-15', '14:00:00', '15:00:00', 'completed', 120.00),
('550e8400-e29b-41d4-a716-446655440002', 1, 'conference', 1, '2024-01-20', '09:00:00', '17:00:00', 'completed', 500.00),
('550e8400-e29b-41d4-a716-446655440000', 1, 'transportation', 1, '2024-01-25', '10:00:00', '10:30:00', 'confirmed', 0.00);

-- Sample order item options
INSERT INTO OrderItemOption (order_item_id, option_value_id) VALUES 
(1, 1), -- First cheeseburger with cheddar cheese
(1, 4); -- First cheeseburger with extra bacon

-- Sample loyalty transactions
INSERT INTO LoyaltyTransaction (customer_id, property_id, transaction_type, points_amount, service_type, order_id, description) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, 'earned', 10, 'restaurant', '550e8400-e29b-41d4-a716-446655440000', 'Restaurant order points'),
('550e8400-e29b-41d4-a716-446655440001', 1, 'earned', 12, 'spa', NULL, 'Spa service points'),
('550e8400-e29b-41d4-a716-446655440002', 1, 'earned', 50, 'conference', NULL, 'Conference booking points');

-- Sample room types and classes
INSERT INTO RoomType (property_id, type_name, type_class, description, base_price_per_night, max_occupancy, bed_type, room_size_sqft) VALUES 
(1, 'Standard Room', 'standard', 'Comfortable standard room with city view', 150.00, 2, 'Queen', 300),
(1, 'Executive Room', 'deluxe', 'Spacious executive room with premium amenities', 250.00, 2, 'King', 450),
(1, 'Premier Suite', 'premium', 'Luxurious suite with separate living area', 400.00, 4, 'King + Sofa Bed', 650),
(1, 'Presidential Suite', 'luxury', 'Ultimate luxury suite with panoramic views', 800.00, 6, 'King + 2 Queens', 1200),
(1, 'Ocean View Room', 'deluxe', 'Premium room with stunning ocean views', 300.00, 2, 'King', 400),
(1, 'Garden View Room', 'standard', 'Peaceful room overlooking the resort gardens', 180.00, 2, 'Queen', 320);

-- Sample individual rooms
INSERT INTO Room (property_id, room_type_id, room_number, floor_number, room_status, is_smoking, is_accessible, view_type) VALUES 
(1, 1, '101', 1, 'available', FALSE, TRUE, 'city_view'),
(1, 1, '102', 1, 'available', FALSE, FALSE, 'city_view'),
(1, 1, '103', 1, 'occupied', FALSE, FALSE, 'city_view'),
(1, 2, '201', 2, 'available', FALSE, FALSE, 'city_view'),
(1, 2, '202', 2, 'available', FALSE, TRUE, 'city_view'),
(1, 3, '301', 3, 'available', FALSE, FALSE, 'ocean_view'),
(1, 3, '302', 3, 'maintenance', FALSE, FALSE, 'ocean_view'),
(1, 4, '401', 4, 'available', FALSE, FALSE, 'ocean_view'),
(1, 5, '501', 5, 'available', FALSE, FALSE, 'ocean_view'),
(1, 6, '601', 6, 'available', FALSE, FALSE, 'garden_view');

-- Sample room amenities
INSERT INTO RoomAmenity (property_id, amenity_name, amenity_category, description, is_chargeable, additional_cost) VALUES 
(1, 'High-Speed WiFi', 'connectivity', 'Complimentary high-speed internet access', FALSE, 0.00),
(1, 'Flat-Screen TV', 'entertainment', '55-inch smart TV with streaming services', FALSE, 0.00),
(1, 'Mini Bar', 'kitchen', 'Stocked mini bar with premium beverages', TRUE, 0.00),
(1, 'Room Service', 'service', '24/7 room service available', FALSE, 0.00),
(1, 'Balcony', 'bedroom', 'Private balcony with seating area', FALSE, 0.00),
(1, 'Jacuzzi', 'bathroom', 'In-room jacuzzi tub', TRUE, 50.00),
(1, 'Ocean View', 'bedroom', 'Panoramic ocean views', TRUE, 75.00),
(1, 'City View', 'bedroom', 'Stunning city skyline views', TRUE, 25.00),
(1, 'Garden View', 'bedroom', 'Peaceful garden and pool views', FALSE, 0.00),
(1, 'Concierge Service', 'service', 'Personal concierge assistance', FALSE, 0.00);

-- Link room types to amenities
INSERT INTO RoomTypeAmenity (room_type_id, amenity_id, is_included, additional_cost) VALUES 
-- Standard Room amenities
(1, 1, TRUE, 0.00), -- WiFi
(1, 2, TRUE, 0.00), -- TV
(1, 4, TRUE, 0.00), -- Room Service
(1, 9, TRUE, 0.00), -- Garden View
-- Executive Room amenities
(2, 1, TRUE, 0.00), -- WiFi
(2, 2, TRUE, 0.00), -- TV
(2, 3, TRUE, 0.00), -- Mini Bar
(2, 4, TRUE, 0.00), -- Room Service
(2, 5, TRUE, 0.00), -- Balcony
(2, 8, TRUE, 0.00), -- City View
-- Premier Suite amenities
(3, 1, TRUE, 0.00), -- WiFi
(3, 2, TRUE, 0.00), -- TV
(3, 3, TRUE, 0.00), -- Mini Bar
(3, 4, TRUE, 0.00), -- Room Service
(3, 5, TRUE, 0.00), -- Balcony
(3, 6, TRUE, 0.00), -- Jacuzzi
(3, 7, TRUE, 0.00), -- Ocean View
(3, 10, TRUE, 0.00), -- Concierge
-- Presidential Suite amenities
(4, 1, TRUE, 0.00), -- WiFi
(4, 2, TRUE, 0.00), -- TV
(4, 3, TRUE, 0.00), -- Mini Bar
(4, 4, TRUE, 0.00), -- Room Service
(4, 5, TRUE, 0.00), -- Balcony
(4, 6, TRUE, 0.00), -- Jacuzzi
(4, 7, TRUE, 0.00), -- Ocean View
(4, 10, TRUE, 0.00), -- Concierge
-- Ocean View Room amenities
(5, 1, TRUE, 0.00), -- WiFi
(5, 2, TRUE, 0.00), -- TV
(5, 3, TRUE, 0.00), -- Mini Bar
(5, 4, TRUE, 0.00), -- Room Service
(5, 5, TRUE, 0.00), -- Balcony
(5, 7, TRUE, 0.00), -- Ocean View
-- Garden View Room amenities
(6, 1, TRUE, 0.00), -- WiFi
(6, 2, TRUE, 0.00), -- TV
(6, 4, TRUE, 0.00), -- Room Service
(6, 9, TRUE, 0.00); -- Garden View

-- Sample room rates
INSERT INTO RoomRate (room_type_id, rate_name, rate_type, base_rate, start_date, end_date, min_nights, max_nights) VALUES 
(1, 'Standard Rate', 'standard', 150.00, '2024-01-01', '2024-12-31', 1, NULL),
(1, 'Weekend Rate', 'weekend', 180.00, '2024-01-01', '2024-12-31', 2, NULL),
(1, 'Holiday Rate', 'holiday', 220.00, '2024-12-20', '2025-01-05', 3, 7),
(2, 'Standard Rate', 'standard', 250.00, '2024-01-01', '2024-12-31', 1, NULL),
(2, 'Weekend Rate', 'weekend', 300.00, '2024-01-01', '2024-12-31', 2, NULL),
(2, 'Corporate Rate', 'corporate', 200.00, '2024-01-01', '2024-12-31', 1, NULL),
(3, 'Standard Rate', 'standard', 400.00, '2024-01-01', '2024-12-31', 1, NULL),
(3, 'Weekend Rate', 'weekend', 500.00, '2024-01-01', '2024-12-31', 2, NULL),
(4, 'Standard Rate', 'standard', 800.00, '2024-01-01', '2024-12-31', 1, NULL),
(4, 'Holiday Rate', 'holiday', 1200.00, '2024-12-20', '2025-01-05', 3, 7);

-- Sample room reservations
INSERT INTO RoomReservation (customer_id, property_id, room_id, room_type_id, check_in_date, check_out_date, number_of_guests, adults, children, reservation_status, total_nights, base_rate, total_amount, taxes, fees, payment_status, special_requests, loyalty_points_earned) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, 1, 1, '2024-01-15', '2024-01-18', 2, 2, 0, 'confirmed', 3, 150.00, 450.00, 45.00, 15.00, 'paid', 'High floor preferred', 45),
('550e8400-e29b-41d4-a716-446655440001', 1, 4, 2, '2024-01-20', '2024-01-22', 2, 2, 0, 'checked_in', 2, 250.00, 500.00, 50.00, 20.00, 'paid', 'Anniversary celebration', 50),
('550e8400-e29b-41d4-a716-446655440002', 1, 6, 3, '2024-01-25', '2024-01-28', 4, 2, 2, 'confirmed', 3, 400.00, 1200.00, 120.00, 50.00, 'partial', 'Family vacation with kids', 120);

-- Sample room service orders
INSERT INTO RoomServiceOrder (reservation_id, room_id, customer_id, order_status, total_amount, delivery_fee, gratuity, special_instructions) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1, '550e8400-e29b-41d4-a716-446655440000', 'delivered', 45.50, 5.00, 7.00, 'Please deliver to room 101'),
('550e8400-e29b-41d4-a716-446655440001', 4, '550e8400-e29b-41d4-a716-446655440001', 'completed', 78.25, 5.00, 12.00, 'Anniversary dinner - please set up nicely'),
('550e8400-e29b-41d4-a716-446655440002', 6, '550e8400-e29b-41d4-a716-446655440002', 'preparing', 125.75, 5.00, 18.00, 'Family dinner for 4 people');

-- Sample room service items
INSERT INTO RoomServiceItem (room_service_id, menu_item_id, quantity, price_at_order, special_instructions) VALUES 
(1, 1, 2, 8.99, 'Extra crispy'),
(1, 3, 1, 6.50, ''),
(2, 1, 1, 8.99, 'Medium rare'),
(2, 2, 1, 10.99, 'Well done'),
(2, 3, 2, 6.50, ''),
(3, 4, 2, 12.99, 'Room service burgers'),
(3, 1, 2, 8.99, 'Kids meals');

-- Sample user types
INSERT INTO UserType (type_name, description, requires_kyc, requires_kyb, can_book_rooms, can_book_facilities, can_order_restaurant, can_generate_invoices, can_manage_bookings) VALUES 
('individual', 'Individual guests and customers', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, FALSE),
('corporate', 'Corporate clients and businesses', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE),
('event_planner', 'Professional event planners', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('travel_agent', 'Travel agents and tour operators', TRUE, FALSE, TRUE, TRUE, TRUE, FALSE, TRUE),
('staff', 'Hotel and property staff', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, TRUE),
('admin', 'System administrators', FALSE, FALSE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Sample corporate customers
INSERT INTO CorporateCustomer (customer_id, company_name, business_registration_number, tax_id, business_type, industry, company_size, annual_revenue, billing_address, billing_city, billing_state, billing_country, billing_postal_code, authorized_signatory_name, authorized_signatory_title, authorized_signatory_email, authorized_signatory_phone, credit_limit, payment_terms, kyb_status) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'TechCorp Solutions', 'TC-2024-001', 'TAX-TC-001', 'corporation', 'Technology', 'large', 50000000.00, '1000 Tech Drive, Suite 500', 'San Francisco', 'CA', 'USA', '94105', 'John Smith', 'CEO', 'john.smith@techcorp.com', '+1-555-0200', 100000.00, 30, 'verified'),
('550e8400-e29b-41d4-a716-446655440004', 'Global Events Inc', 'GE-2024-002', 'TAX-GE-002', 'llc', 'Event Management', 'medium', 10000000.00, '500 Event Plaza', 'New York', 'NY', 'USA', '10001', 'Sarah Johnson', 'Event Director', 'sarah.johnson@globalevents.com', '+1-555-0201', 50000.00, 15, 'verified');

-- Sample corporate bookings
INSERT INTO CorporateBooking (corporate_id, property_id, booking_type, event_name, event_description, start_date, end_date, start_time, end_time, expected_attendees, booking_status, total_estimated_cost, deposit_amount, payment_terms, special_requirements, contact_person_name, contact_person_email, contact_person_phone) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 1, 'conference', 'TechCorp Annual Conference 2024', 'Annual technology conference with 200 attendees', '2024-03-15', '2024-03-17', '08:00:00', '18:00:00', 200, 'confirmed', 75000.00, 15000.00, 30, 'Need AV equipment, catering for all meals, breakout rooms', 'John Smith', 'john.smith@techcorp.com', '+1-555-0200'),
('550e8400-e29b-41d4-a716-446655440004', 1, 'event', 'Global Events Corporate Retreat', 'Executive retreat with team building activities', '2024-04-20', '2024-04-22', '09:00:00', '17:00:00', 50, 'pending', 25000.00, 5000.00, 15, 'Spa services, team building activities, private dining', 'Sarah Johnson', 'sarah.johnson@globalevents.com', '+1-555-0201');

-- Sample quotations
INSERT INTO Quotation (corporate_booking_id, quotation_number, quotation_date, valid_until, status, subtotal, tax_rate, tax_amount, total_amount, terms_and_conditions, prepared_by) VALUES 
('550e8400-e29b-41d4-a716-446655440003', 'QUO-2024-001', '2024-01-15', '2024-02-15', 'accepted', 70000.00, 8.5, 5950.00, 75950.00, 'Payment due within 30 days. Cancellation policy applies.', 'Sales Team'),
('550e8400-e29b-41d4-a716-446655440004', 'QUO-2024-002', '2024-01-20', '2024-02-20', 'sent', 23000.00, 8.5, 1955.00, 24955.00, 'Payment due within 15 days. 50% deposit required.', 'Sales Team');

-- Sample invoices
INSERT INTO Invoice (corporate_booking_id, quotation_id, invoice_number, invoice_date, due_date, status, subtotal, tax_rate, tax_amount, total_amount, balance_amount, payment_terms) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'INV-2024-001', '2024-03-18', '2024-04-17', 'paid', 70000.00, 8.5, 5950.00, 75950.00, 0.00, 30),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'INV-2024-002', '2024-04-23', '2024-05-08', 'sent', 23000.00, 8.5, 1955.00, 24955.00, 24955.00, 15);

-- Sample knowledge base entries
INSERT INTO KnowledgeBase (property_id, category, subcategory, title, content, content_type, tags, priority) VALUES 
(1, 'general_info', 'check_in', 'Check-in Process', 'Check-in time is 3:00 PM. Early check-in may be available upon request. Please bring a valid ID and credit card for incidentals.', 'text', ARRAY['check-in', 'arrival', 'process'], 1),
(1, 'policies', 'cancellation', 'Cancellation Policy', 'Cancellations made 24 hours before arrival are free. Cancellations within 24 hours will be charged one night room rate.', 'text', ARRAY['cancellation', 'policy', 'refund'], 1),
(1, 'services', 'spa_services', 'Spa Services', 'Our spa offers massage, facials, and body treatments. Reservations are recommended. Services available 9 AM to 9 PM daily.', 'text', ARRAY['spa', 'wellness', 'massage', 'facial'], 2),
(1, 'pricing', 'room_rates', 'Room Rates', 'Standard rooms start at $150/night, Executive rooms at $250/night, Premier Suites at $400/night, and Presidential Suites at $800/night.', 'text', ARRAY['pricing', 'rates', 'rooms'], 1),
(1, 'procedures', 'emergency', 'Emergency Procedures', 'In case of emergency, dial 911. Hotel security can be reached at extension 911. Emergency exits are clearly marked on each floor.', 'text', ARRAY['emergency', 'safety', 'security'], 1);

-- Sample AI agent workflows
INSERT INTO AIAgentWorkflow (workflow_name, workflow_type, description, workflow_definition, input_schema, output_schema, created_by) VALUES 
('Room Booking Flow', 'booking_flow', 'Complete room booking workflow with availability check and confirmation', '{"nodes": ["check_availability", "validate_guest_info", "process_payment", "send_confirmation"], "edges": [{"from": "check_availability", "to": "validate_guest_info"}, {"from": "validate_guest_info", "to": "process_payment"}, {"from": "process_payment", "to": "send_confirmation"}]}', '{"type": "object", "properties": {"check_in_date": {"type": "string"}, "check_out_date": {"type": "string"}, "room_type": {"type": "string"}}}', '{"type": "object", "properties": {"booking_id": {"type": "string"}, "confirmation_number": {"type": "string"}}}', 'AI Team'),
('Concierge Support Flow', 'concierge_flow', 'Concierge assistance workflow for guest requests and recommendations', '{"nodes": ["understand_request", "search_knowledge", "provide_recommendation", "book_service"], "edges": [{"from": "understand_request", "to": "search_knowledge"}, {"from": "search_knowledge", "to": "provide_recommendation"}, {"from": "provide_recommendation", "to": "book_service"}]}', '{"type": "object", "properties": {"request": {"type": "string"}, "guest_preferences": {"type": "object"}}}', '{"type": "object", "properties": {"recommendations": {"type": "array"}, "booking_confirmation": {"type": "string"}}}', 'AI Team');

-- Sample document management
INSERT INTO DocumentManagement (property_id, document_type, document_category, title, description, file_name, file_path, file_size, mime_type, access_level, tags, uploaded_by) VALUES 
(1, 'contract', 'legal', 'Corporate Booking Agreement Template', 'Standard template for corporate booking agreements', 'corporate_booking_template.pdf', '/documents/templates/corporate_booking_template.pdf', 245760, 'application/pdf', 'internal', ARRAY['template', 'contract', 'corporate'], 'Legal Team'),
(1, 'policy', 'operational', 'Guest Service Standards', 'Comprehensive guest service standards and procedures', 'guest_service_standards.pdf', '/documents/policies/guest_service_standards.pdf', 512000, 'application/pdf', 'internal', ARRAY['policy', 'service', 'standards'], 'Operations Team'),
(1, 'manual', 'operational', 'AI Agent Training Manual', 'Training manual for AI agent interactions and responses', 'ai_agent_training.pdf', '/documents/manuals/ai_agent_training.pdf', 1024000, 'application/pdf', 'restricted', ARRAY['manual', 'ai', 'training'], 'AI Team');

-- ========================================
-- STAFF MANAGEMENT SYSTEM
-- ========================================

-- Staff Department Table
CREATE TABLE StaffDepartment (
    department_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_name VARCHAR(100) NOT NULL,
    description TEXT,
    manager_id VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, department_name)
);

-- Staff Position Table
CREATE TABLE StaffPosition (
    position_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES StaffDepartment(department_id) ON DELETE CASCADE,
    position_name VARCHAR(100) NOT NULL,
    description TEXT,
    hourly_rate NUMERIC(8,2),
    salary_range_min NUMERIC(10,2),
    salary_range_max NUMERIC(10,2),
    required_skills TEXT[],
    responsibilities TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, position_name)
);

-- Staff Profile Table (extends Buffr HostUser with staff-specific information)
CREATE TABLE StaffProfile (
    staff_id VARCHAR(255) PRIMARY KEY REFERENCES Buffr HostUser(owner_id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES StaffDepartment(department_id),
    position_id INTEGER REFERENCES StaffPosition(position_id),
    hire_date DATE NOT NULL,
    employment_type VARCHAR(20) DEFAULT 'full_time', -- 'full_time', 'part_time', 'contract', 'temporary'
    employment_status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'terminated', 'on_leave'
    phone VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    national_id VARCHAR(50),
    tax_id VARCHAR(50),
    bank_account VARCHAR(50),
    skills TEXT[],
    certifications TEXT[],
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Schedule Table
CREATE TABLE StaffSchedule (
    schedule_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration INTEGER DEFAULT 30, -- minutes
    shift_type VARCHAR(20) DEFAULT 'regular', -- 'regular', 'overtime', 'holiday', 'on_call'
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
    notes TEXT,
    created_by VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(staff_id, schedule_date, start_time)
);

-- Staff Attendance Table
CREATE TABLE StaffAttendance (
    attendance_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES StaffSchedule(schedule_id),
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    break_start_time TIMESTAMP WITH TIME ZONE,
    break_end_time TIMESTAMP WITH TIME ZONE,
    total_hours_worked NUMERIC(4,2),
    overtime_hours NUMERIC(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'present', -- 'present', 'absent', 'late', 'early_departure', 'sick_leave', 'vacation'
    notes TEXT,
    approved_by VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Task Assignment Table
CREATE TABLE StaffTask (
    task_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    assigned_to VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    assigned_by VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    task_title VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_type VARCHAR(50) DEFAULT 'general', -- 'cleaning', 'maintenance', 'guest_service', 'kitchen', 'front_desk', 'general'
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(20) DEFAULT 'assigned', -- 'assigned', 'in_progress', 'completed', 'cancelled', 'overdue'
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_duration INTEGER, -- minutes
    actual_duration INTEGER, -- minutes
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Performance Review Table
CREATE TABLE StaffPerformance (
    performance_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    reviewed_by VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
    punctuality_rating INTEGER CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    work_quality_rating INTEGER CHECK (work_quality_rating >= 1 AND work_quality_rating <= 5),
    teamwork_rating INTEGER CHECK (teamwork_rating >= 1 AND teamwork_rating <= 5),
    customer_service_rating INTEGER CHECK (customer_service_rating >= 1 AND customer_service_rating <= 5),
    strengths TEXT,
    areas_for_improvement TEXT,
    goals TEXT,
    comments TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Staff Communication Table
CREATE TABLE StaffCommunication (
    communication_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    sender_id VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    recipient_id VARCHAR(255) REFERENCES StaffProfile(staff_id),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    communication_type VARCHAR(20) DEFAULT 'message', -- 'message', 'announcement', 'alert', 'reminder'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Leave Request Table
CREATE TABLE StaffLeaveRequest (
    leave_request_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES StaffProfile(staff_id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    leave_type VARCHAR(20) NOT NULL, -- 'vacation', 'sick_leave', 'personal', 'emergency', 'maternity', 'paternity'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by VARCHAR(255) REFERENCES Buffr HostUser(owner_id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT
);

-- Sample data for staff management
INSERT INTO StaffDepartment (property_id, department_name, description) VALUES 
(1, 'Front Desk', 'Guest services and reception'),
(1, 'Housekeeping', 'Room cleaning and maintenance'),
(1, 'Kitchen', 'Food preparation and service'),
(1, 'Management', 'Property management and administration'),
(1, 'Maintenance', 'Property maintenance and repairs');

INSERT INTO StaffPosition (property_id, department_id, position_name, description, hourly_rate, required_skills, responsibilities) VALUES 
(1, 1, 'Front Desk Agent', 'Guest check-in/check-out and concierge services', 15.00, ARRAY['customer_service', 'communication', 'multilingual'], ARRAY['guest_checkin', 'guest_checkout', 'concierge_services', 'reservation_management']),
(1, 2, 'Housekeeper', 'Room cleaning and maintenance', 12.00, ARRAY['cleaning', 'attention_to_detail', 'time_management'], ARRAY['room_cleaning', 'linen_management', 'inventory_tracking']),
(1, 3, 'Chef', 'Food preparation and kitchen management', 25.00, ARRAY['cooking', 'menu_planning', 'kitchen_management'], ARRAY['food_preparation', 'menu_development', 'kitchen_operations']),
(1, 4, 'General Manager', 'Overall property management', 35.00, ARRAY['leadership', 'management', 'hospitality'], ARRAY['staff_management', 'operations', 'guest_relations', 'financial_management']),
(1, 5, 'Maintenance Technician', 'Property maintenance and repairs', 18.00, ARRAY['mechanical', 'electrical', 'plumbing'], ARRAY['preventive_maintenance', 'repairs', 'equipment_servicing']);

-- ============================================================================
-- ENHANCED DOCUMENT PROCESSING WITH LLAMAINDEX AND LAMAPARSE
-- ============================================================================

-- Create the documentation chunks table for enhanced document processing
CREATE TABLE site_pages (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    chunk_number INTEGER NOT NULL,
    title VARCHAR NOT NULL,
    summary VARCHAR NOT NULL,
    content TEXT NOT NULL,  -- Added content column
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,  -- Added metadata column
    embedding VECTOR(1536),  -- OpenAI embeddings are 1536 dimensions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Add a unique constraint to prevent duplicate chunks for the same URL
    UNIQUE(url, chunk_number)
);

-- Create an index for better vector similarity search performance
CREATE INDEX ON site_pages USING ivfflat (embedding vector_cosine_ops);

-- Create an index on metadata for faster filtering
CREATE INDEX idx_site_pages_metadata ON site_pages USING gin (metadata);

-- Create a function to search for documentation chunks
CREATE FUNCTION match_site_pages (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 10,
  filter JSONB DEFAULT '{}'::jsonb
) RETURNS TABLE (
  id BIGINT,
  url VARCHAR,
  chunk_number INTEGER,
  title VARCHAR,
  summary VARCHAR,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    url,
    chunk_number,
    title,
    summary,
    content,
    metadata,
    1 - (site_pages.embedding <=> query_embedding) AS similarity
  FROM site_pages
  WHERE metadata @> filter
  ORDER BY site_pages.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable RLS on the site_pages table
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read
CREATE POLICY "Allow public read access"
  ON site_pages
  FOR SELECT
  TO public
  USING (true);

-- Create a policy for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage site_pages"
  ON site_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ENHANCED KNOWLEDGE BASE TABLES FOR LLAMAINDEX INTEGRATION
-- ============================================================================

-- Create table for storing document processing metadata
CREATE TABLE document_processing_log (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    filename VARCHAR NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    processing_method VARCHAR(50) NOT NULL, -- 'llama_parse', 'standard', 'enhanced'
    status VARCHAR(20) NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    chunks_created INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_document_processing_log_property_id ON document_processing_log(property_id);
CREATE INDEX idx_document_processing_log_status ON document_processing_log(status);
CREATE INDEX idx_document_processing_log_created_at ON document_processing_log(created_at);

-- Create table for storing web crawling metadata
CREATE TABLE web_crawl_log (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    crawl_type VARCHAR(50) NOT NULL, -- 'website', 'sitemap'
    urls TEXT[] NOT NULL,
    sitemap_url VARCHAR,
    status VARCHAR(20) NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    pages_crawled INTEGER DEFAULT 0,
    chunks_created INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_web_crawl_log_property_id ON web_crawl_log(property_id);
CREATE INDEX idx_web_crawl_log_status ON web_crawl_log(status);
CREATE INDEX idx_web_crawl_log_created_at ON web_crawl_log(created_at);

-- ============================================================================
-- ENHANCED VECTOR STORAGE FOR KNOWLEDGE BASE
-- ============================================================================

-- Create table for storing knowledge base embeddings
CREATE TABLE knowledge_vectors (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    knowledge_id UUID REFERENCES KnowledgeBase(knowledge_id) ON DELETE CASCADE,
    chunk_id VARCHAR NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vector similarity search
CREATE INDEX ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_knowledge_vectors_property_id ON knowledge_vectors(property_id);
CREATE INDEX idx_knowledge_vectors_knowledge_id ON knowledge_vectors(knowledge_id);

-- Create function for knowledge base vector search
CREATE FUNCTION match_knowledge_vectors (
  query_embedding VECTOR(1536),
  property_id_filter INTEGER DEFAULT NULL,
  match_count INT DEFAULT 10,
  similarity_threshold FLOAT DEFAULT 0.7
) RETURNS TABLE (
  id BIGINT,
  property_id INTEGER,
  knowledge_id UUID,
  chunk_id VARCHAR,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    kv.id,
    kv.property_id,
    kv.knowledge_id,
    kv.chunk_id,
    kv.content,
    kv.metadata,
    1 - (kv.embedding <=> query_embedding) AS similarity
  FROM knowledge_vectors kv
  WHERE (property_id_filter IS NULL OR kv.property_id = property_id_filter)
    AND (1 - (kv.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY kv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Enable RLS on vector tables
ALTER TABLE knowledge_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_crawl_log ENABLE ROW LEVEL SECURITY;

-- Create policies for vector tables
CREATE POLICY "Allow authenticated users to manage knowledge_vectors"
  ON knowledge_vectors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage document_processing_log"
  ON document_processing_log
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage web_crawl_log"
  ON web_crawl_log
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- VOICE CAPABILITIES TABLES FOR TTS/STT IMPLEMENTATION
-- ============================================================================

-- Create table for storing voice model configurations
CREATE TABLE voice_models (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(20) NOT NULL, -- 'tts' or 'stt'
    provider VARCHAR(50) NOT NULL, -- 'openai', 'local', 'azure', 'aws'
    model_id VARCHAR(100) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    voice VARCHAR(50), -- For TTS models
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing voice interactions
CREATE TABLE voice_interactions (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- 'tts', 'stt', 'conversation'
    input_text TEXT,
    output_audio BYTEA,
    input_audio BYTEA,
    output_text TEXT,
    model_used VARCHAR(100),
    processing_time_ms INTEGER,
    audio_duration_seconds FLOAT,
    quality_score FLOAT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing audio files and their metadata
CREATE TABLE audio_files (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL, -- 'wav', 'mp3', 'ogg', 'm4a'
    file_size BIGINT NOT NULL,
    duration_seconds FLOAT,
    sample_rate INTEGER,
    channels INTEGER,
    bit_rate INTEGER,
    purpose VARCHAR(50), -- 'tts_output', 'stt_input', 'background_music', 'notification'
    is_processed BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for voice tables
CREATE INDEX idx_voice_models_property_id ON voice_models(property_id);
CREATE INDEX idx_voice_models_type ON voice_models(model_type);
CREATE INDEX idx_voice_models_active ON voice_models(is_active);

CREATE INDEX idx_voice_interactions_property_id ON voice_interactions(property_id);
CREATE INDEX idx_voice_interactions_session_id ON voice_interactions(session_id);
CREATE INDEX idx_voice_interactions_type ON voice_interactions(interaction_type);
CREATE INDEX idx_voice_interactions_created_at ON voice_interactions(created_at);

CREATE INDEX idx_audio_files_property_id ON audio_files(property_id);
CREATE INDEX idx_audio_files_purpose ON audio_files(purpose);
CREATE INDEX idx_audio_files_created_at ON audio_files(created_at);
CREATE INDEX idx_audio_files_expires_at ON audio_files(expires_at);

-- Enable RLS on voice tables
ALTER TABLE voice_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;

-- Create policies for voice tables
CREATE POLICY "Allow authenticated users to manage voice_models"
  ON voice_models
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage voice_interactions"
  ON voice_interactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage audio_files"
  ON audio_files
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to clean up expired audio files
CREATE FUNCTION cleanup_expired_audio_files()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audio_files 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Create a scheduled job to clean up expired audio files (if using pg_cron)
-- SELECT cron.schedule('cleanup-audio-files', '0 2 * * *', 'SELECT cleanup_expired_audio_files();');
