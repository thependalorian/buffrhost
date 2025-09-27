-- Hospitality Properties Migration
-- Creates tables for property management in The Shandi platform

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create hospitality_properties table
CREATE TABLE IF NOT EXISTS hospitality_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hotel', 'restaurant', 'spa', 'conference_center', 'mixed')),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('standard', 'deluxe', 'suite', 'presidential')),
    capacity INTEGER NOT NULL DEFAULT 1,
    price_per_night DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(100),
    preferences JSONB DEFAULT '{}',
    loyalty_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, email)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT true,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    is_gluten_free BOOLEAN DEFAULT false,
    allergens TEXT[] DEFAULT '{}',
    preparation_time INTEGER, -- in minutes
    calories INTEGER,
    ingredients TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES hospitality_properties(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hospitality_properties_active ON hospitality_properties(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_available ON rooms(is_available);
CREATE INDEX IF NOT EXISTS idx_customers_property_email ON customers(property_id, email);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_menu_categories_property_id ON menu_categories(property_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_property_id ON orders(property_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_hospitality_properties_updated_at BEFORE UPDATE ON hospitality_properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for Etuna property
INSERT INTO hospitality_properties (id, name, description, type, address, city, country, phone, email, website, is_active, settings) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Etuna Luxury Resort & Spa', 'Experience the ultimate in luxury and comfort at Etuna Luxury Resort & Spa, nestled in the heart of Namibia''s breathtaking landscape.', 'hotel', '123 Etuna Drive', 'Windhoek', 'Namibia', '+264 61 123 4567', 'info@etuna.com', 'https://etuna.com', true, '{"timezone": "Africa/Windhoek", "currency": "NAD", "language": "en", "booking_enabled": true, "payment_enabled": true, "loyalty_enabled": true, "ai_enabled": true}')
ON CONFLICT (id) DO NOTHING;

-- Insert sample rooms for Etuna
INSERT INTO rooms (id, property_id, name, description, type, capacity, price_per_night, currency, amenities, images, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Standard Room', 'Comfortable and elegantly appointed standard room with modern amenities.', 'standard', 2, 1200.00, 'NAD', '{"WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV"}', '{"/images/rooms/standard-1.jpg", "/images/rooms/standard-2.jpg"}', true),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Deluxe Suite', 'Spacious suite with separate living area and premium amenities.', 'deluxe', 4, 2500.00, 'NAD', '{"WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV", "Balcony", "Kitchenette"}', '{"/images/rooms/deluxe-1.jpg", "/images/rooms/deluxe-2.jpg"}', true),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'Presidential Suite', 'Ultimate luxury with panoramic views and exclusive services.', 'presidential', 6, 5000.00, 'NAD', '{"WiFi", "Air Conditioning", "Mini Bar", "Safe", "TV", "Balcony", "Kitchen", "Butler Service"}', '{"/images/rooms/presidential-1.jpg", "/images/rooms/presidential-2.jpg"}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu categories for Etuna
INSERT INTO menu_categories (id, property_id, name, description, is_active, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Appetizers', 'Start your meal with our delicious appetizers', true, 1),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Main Courses', 'Our signature main courses featuring local and international cuisine', true, 2),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Desserts', 'Sweet endings to your perfect meal', true, 3),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'Beverages', 'Refreshing drinks and premium beverages', true, 4)
ON CONFLICT (id) DO NOTHING;

-- Insert sample menu items for Etuna
INSERT INTO menu_items (id, category_id, name, description, price, currency, is_available, is_vegetarian, preparation_time, calories) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'Spring Rolls', 'Fresh vegetable spring rolls with sweet chili sauce', 85.00, 'NAD', true, true, 15, 120),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', 'Chicken Satay', 'Grilled chicken skewers with peanut sauce', 95.00, 'NAD', true, false, 20, 180),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'Beef Stir Fry', 'Tender beef with mixed vegetables in savory sauce', 180.00, 'NAD', true, false, 25, 350),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', 'Vegetable Curry', 'Spiced vegetable curry with basmati rice', 160.00, 'NAD', true, true, 30, 280),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 'Chocolate Cake', 'Rich chocolate cake with vanilla ice cream', 75.00, 'NAD', true, false, 10, 450),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440013', 'Fresh Orange Juice', 'Freshly squeezed orange juice', 35.00, 'NAD', true, true, 5, 80)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for multi-tenant security
ALTER TABLE hospitality_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (these will be updated when user system is integrated)
CREATE POLICY hospitality_properties_policy ON hospitality_properties FOR ALL TO authenticated USING (true);
CREATE POLICY rooms_policy ON rooms FOR ALL TO authenticated USING (true);
CREATE POLICY customers_policy ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY bookings_policy ON bookings FOR ALL TO authenticated USING (true);
CREATE POLICY menu_categories_policy ON menu_categories FOR ALL TO authenticated USING (true);
CREATE POLICY menu_items_policy ON menu_items FOR ALL TO authenticated USING (true);
CREATE POLICY orders_policy ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY order_items_policy ON order_items FOR ALL TO authenticated USING (true);

-- Grant permissions
GRANT ALL ON hospitality_properties TO authenticated;
GRANT ALL ON rooms TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON bookings TO authenticated;
GRANT ALL ON menu_categories TO authenticated;
GRANT ALL ON menu_items TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;