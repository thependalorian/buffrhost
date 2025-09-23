-- Room Management System
-- Complete hotel room management with types, amenities, and reservations

-- Room Types
CREATE TABLE RoomType (
    room_type_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    type_name VARCHAR(100) NOT NULL,
    type_class VARCHAR(50) NOT NULL,
    description TEXT,
    base_price_per_night NUMERIC(10,2) NOT NULL,
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    bed_type VARCHAR(100),
    room_size_sqft INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Individual Rooms
CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor_number INTEGER,
    room_status VARCHAR(50) DEFAULT 'available',
    is_smoking BOOLEAN DEFAULT FALSE,
    is_accessible BOOLEAN DEFAULT FALSE,
    view_type VARCHAR(100),
    last_cleaned TIMESTAMP WITH TIME ZONE,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(property_id, room_number)
);

-- Room Amenities
CREATE TABLE RoomAmenity (
    amenity_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    amenity_name VARCHAR(100) NOT NULL,
    amenity_category VARCHAR(50),
    description TEXT,
    is_chargeable BOOLEAN DEFAULT FALSE,
    additional_cost NUMERIC(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Room Type Amenities Link
CREATE TABLE RoomTypeAmenity (
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES RoomAmenity(amenity_id) ON DELETE CASCADE,
    is_included BOOLEAN DEFAULT TRUE,
    additional_cost NUMERIC(10,2) DEFAULT 0.00,
    PRIMARY KEY (room_type_id, amenity_id)
);

-- Room Reservations
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
    reservation_status VARCHAR(50) DEFAULT 'confirmed',
    total_nights INTEGER NOT NULL,
    base_rate NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    taxes NUMERIC(10,2) DEFAULT 0.00,
    fees NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending',
    special_requests TEXT,
    loyalty_points_earned INTEGER DEFAULT 0,
    loyalty_points_redeemed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Room Rates
CREATE TABLE RoomRate (
    rate_id SERIAL PRIMARY KEY,
    room_type_id INTEGER REFERENCES RoomType(room_type_id) ON DELETE CASCADE,
    rate_name VARCHAR(100) NOT NULL,
    rate_type VARCHAR(50) NOT NULL,
    base_rate NUMERIC(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_nights INTEGER DEFAULT 1,
    max_nights INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Room Service Orders
CREATE TABLE RoomServiceOrder (
    room_service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id UUID REFERENCES RoomReservation(reservation_id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES Room(room_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES Customer(customer_id),
    order_status VARCHAR(50) DEFAULT 'pending',
    order_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivery_time TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    gratuity NUMERIC(10,2) DEFAULT 0.00,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Room Service Items
CREATE TABLE RoomServiceItem (
    room_service_item_id SERIAL PRIMARY KEY,
    room_service_id UUID REFERENCES RoomServiceOrder(room_service_id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES Menu(menu_item_id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_order NUMERIC(10,2) NOT NULL,
    special_instructions TEXT
);

-- Create updated_at triggers
CREATE TRIGGER update_room_type_updated_at 
    BEFORE UPDATE ON RoomType 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_updated_at 
    BEFORE UPDATE ON Room 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_reservation_updated_at 
    BEFORE UPDATE ON RoomReservation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_rate_updated_at 
    BEFORE UPDATE ON RoomRate 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_service_order_updated_at 
    BEFORE UPDATE ON RoomServiceOrder 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
