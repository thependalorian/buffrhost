-- ============================================================================
-- ETUNA GUESTHOUSE & TOURS - DATABASE POPULATION
-- ============================================================================
-- This migration populates the database with Etuna Guesthouse data
-- for the Buffr Host showcase demonstration

-- Insert Etuna Property
INSERT INTO hospitality_properties (
    property_id,
    property_name,
    property_type,
    logo_url,
    address,
    phone,
    email,
    website,
    is_active,
    created_at,
    timezone,
    check_in_time,
    check_out_time,
    total_rooms,
    cuisine_type,
    max_capacity,
    services_offered,
    amenities
) VALUES (
    1,
    'Etuna Guesthouse and Tours',
    'mixed',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    '5544 Valley Street, Ongwediva, Oshana, Namibia, OS 33139',
    '+264 65 231 177',
    'bookings@etunaguesthouse.com',
    'http://www.etunaguesthouse.com',
    true,
    '2006-01-01T00:00:00Z',
    'Africa/Windhoek',
    '14:00:00',
    '10:00:00',
    35,
    'Namibian Traditional',
    100,
    ARRAY['restaurant', 'hotel', 'conference', 'transportation', 'recreation'],
    ARRAY['wifi', 'parking', 'pool', 'concierge', 'restaurant', 'bar', 'room_service', 'laundry', 'airport_shuttle', 'tour_guide', 'conference_rooms']
) ON CONFLICT (property_id) DO UPDATE SET
    property_name = EXCLUDED.property_name,
    property_type = EXCLUDED.property_type,
    logo_url = EXCLUDED.logo_url,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    is_active = EXCLUDED.is_active,
    timezone = EXCLUDED.timezone,
    check_in_time = EXCLUDED.check_in_time,
    check_out_time = EXCLUDED.check_out_time,
    total_rooms = EXCLUDED.total_rooms,
    cuisine_type = EXCLUDED.cuisine_type,
    max_capacity = EXCLUDED.max_capacity,
    services_offered = EXCLUDED.services_offered,
    amenities = EXCLUDED.amenities;

-- Insert Room Types
INSERT INTO room_types (
    room_type_id,
    property_id,
    type_name,
    type_class,
    description,
    base_price_per_night,
    max_occupancy,
    bed_type,
    room_size_sqft,
    is_active,
    created_at
) VALUES 
(1, 1, 'Standard Room', 'standard', 'Comfortable standard room with twin beds, shower, flatscreen TV with DSTV, fridge and mosquito net.', 750.00, 2, 'Twin', 200, true, '2006-01-01T00:00:00Z'),
(2, 1, 'Executive Room', 'deluxe', 'Spacious executive room with great attention to every detail for comfort and relaxation.', 1000.00, 2, 'Queen', 300, true, '2006-01-01T00:00:00Z'),
(3, 1, 'Luxury Room', 'premium', 'Luxury room with double bed, shower, fridge, working space, mosquito net and WiFi.', 830.00, 2, 'Double', 350, true, '2006-01-01T00:00:00Z'),
(4, 1, 'Family Suite 1', 'premium', 'Family unit with two rooms - one with double bed and the other with twin beds, shared bathroom.', 1500.00, 4, 'Double + Twin', 500, true, '2006-01-01T00:00:00Z'),
(5, 1, 'Family Suite 2', 'premium', 'Family room with two rooms - one with double bed and the other with twin beds, shared bathroom.', 1200.00, 3, 'Double + Twin', 450, true, '2006-01-01T00:00:00Z'),
(6, 1, 'Premier Room', 'luxury', 'The biggest rooms in our facilities with 2 bedrooms, lounge, 2 bathrooms and balcony.', 2000.00, 4, 'King + Queen', 800, true, '2006-01-01T00:00:00Z')
ON CONFLICT (room_type_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    type_name = EXCLUDED.type_name,
    type_class = EXCLUDED.type_class,
    description = EXCLUDED.description,
    base_price_per_night = EXCLUDED.base_price_per_night,
    max_occupancy = EXCLUDED.max_occupancy,
    bed_type = EXCLUDED.bed_type,
    room_size_sqft = EXCLUDED.room_size_sqft,
    is_active = EXCLUDED.is_active;

-- Insert Menu Categories
INSERT INTO menu_categories (
    category_id,
    property_id,
    name,
    display_order
) VALUES 
(1, 1, 'Light Meal', 1),
(2, 1, 'Main Course', 2),
(3, 1, 'Kiddies Meals', 3),
(4, 1, 'Traditional Cuisine', 4),
(5, 1, 'Pizza', 5),
(6, 1, 'Dessert', 6),
(7, 1, 'Hot Beverages', 7),
(8, 1, 'Platters', 8)
ON CONFLICT (category_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    name = EXCLUDED.name,
    display_order = EXCLUDED.display_order;

-- Insert Menu Items
INSERT INTO menu (
    menu_item_id,
    property_id,
    name,
    description,
    base_price,
    category_id,
    preparation_time,
    calories,
    dietary_tags,
    is_available,
    for_type,
    is_popular,
    is_all,
    service_type,
    created_at
) VALUES 
(1, 1, 'Traditional Oshiwambo Meal', 'Authentic Namibian traditional cuisine with meat and vegetables', 120.00, 4, 30, 450, 'Traditional', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z'),
(2, 1, 'Grilled Fish', 'Fresh local fish grilled to perfection', 95.00, 2, 25, 300, 'Seafood', true, 'all', false, true, 'restaurant', '2006-01-01T00:00:00Z'),
(3, 1, 'Margherita Pizza', 'Classic pizza with tomato, mozzarella, and basil', 85.00, 5, 20, 400, 'Vegetarian', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z'),
(4, 1, 'Beef Steak', 'Premium beef steak cooked to perfection', 150.00, 2, 25, 500, 'Meat', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z'),
(5, 1, 'Chicken Curry', 'Spicy chicken curry with rice', 110.00, 2, 30, 450, 'Spicy', true, 'all', false, true, 'restaurant', '2006-01-01T00:00:00Z'),
(6, 1, 'Vegetable Stir Fry', 'Fresh vegetables stir-fried with soy sauce', 80.00, 1, 15, 250, 'Vegetarian', true, 'all', false, true, 'restaurant', '2006-01-01T00:00:00Z'),
(7, 1, 'Kids Chicken Nuggets', 'Crispy chicken nuggets with fries', 45.00, 3, 15, 350, 'Kids', true, 'children', false, true, 'restaurant', '2006-01-01T00:00:00Z'),
(8, 1, 'Chocolate Cake', 'Rich chocolate cake with ice cream', 35.00, 6, 10, 400, 'Dessert', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z'),
(9, 1, 'Coffee', 'Freshly brewed coffee', 15.00, 7, 5, 50, 'Beverage', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z'),
(10, 1, 'Mixed Platter', 'Selection of local meats and vegetables', 200.00, 8, 35, 600, 'Traditional', true, 'all', true, true, 'restaurant', '2006-01-01T00:00:00Z')
ON CONFLICT (menu_item_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    category_id = EXCLUDED.category_id,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    dietary_tags = EXCLUDED.dietary_tags,
    is_available = EXCLUDED.is_available,
    for_type = EXCLUDED.for_type,
    is_popular = EXCLUDED.is_popular,
    is_all = EXCLUDED.is_all,
    service_type = EXCLUDED.service_type;

-- Insert Transportation Services
INSERT INTO transportation_services (
    service_id,
    property_id,
    service_name,
    service_type,
    description,
    base_price,
    duration_minutes,
    capacity,
    is_available,
    requires_booking,
    created_at
) VALUES 
(1, 1, 'Airport Shuttle', 'shuttle', 'Complimentary shuttle service to/from Ondangwa Airport', 0.00, 30, 8, true, true, '2006-01-01T00:00:00Z'),
(2, 1, 'Etosha National Park Tour', 'tour', 'Full day safari to Etosha National Park with professional guide', 1200.00, 480, 15, true, true, '2006-01-01T00:00:00Z'),
(3, 1, 'Ruacana Falls Tour', 'tour', 'Scenic tour to the magnificent Ruacana Falls', 800.00, 360, 12, true, true, '2006-01-01T00:00:00Z'),
(4, 1, 'City Walking Tour', 'tour', 'Guided walking tour of Ongwediva city center', 150.00, 120, 20, true, true, '2006-01-01T00:00:00Z')
ON CONFLICT (service_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    service_name = EXCLUDED.service_name,
    service_type = EXCLUDED.service_type,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    duration_minutes = EXCLUDED.duration_minutes,
    capacity = EXCLUDED.capacity,
    is_available = EXCLUDED.is_available,
    requires_booking = EXCLUDED.requires_booking;

-- Insert Recreation Services
INSERT INTO recreation_services (
    recreation_id,
    property_id,
    service_name,
    service_type,
    description,
    base_price,
    duration_minutes,
    capacity,
    equipment_included,
    is_available,
    requires_booking,
    created_at
) VALUES 
(1, 1, 'Cultural Village Tour', 'activities', 'Guided tour of local cultural villages and traditions', 150.00, 180, 10, true, true, true, '2006-01-01T00:00:00Z'),
(2, 1, 'Himba Tribe Visit', 'activities', 'Authentic cultural experience with the Himba people', 300.00, 240, 8, false, true, true, '2006-01-01T00:00:00Z'),
(3, 1, 'Swimming Pool Access', 'recreation', 'Access to our outdoor swimming pool', 0.00, 480, 50, true, true, false, '2006-01-01T00:00:00Z'),
(4, 1, 'Conference Facility', 'business', 'Professional conference hall for meetings and events', 1500.00, 480, 80, true, true, true, '2006-01-01T00:00:00Z')
ON CONFLICT (recreation_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    service_name = EXCLUDED.service_name,
    service_type = EXCLUDED.service_type,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    duration_minutes = EXCLUDED.duration_minutes,
    capacity = EXCLUDED.capacity,
    equipment_included = EXCLUDED.equipment_included,
    is_available = EXCLUDED.is_available,
    requires_booking = EXCLUDED.requires_booking;

-- Insert Specialized Services
INSERT INTO specialized_services (
    service_id,
    property_id,
    service_name,
    service_type,
    description,
    base_price,
    duration_minutes,
    is_available,
    requires_booking,
    created_at
) VALUES 
(1, 1, 'Concierge Service', 'concierge', 'Personal concierge assistance for all guest needs', 0.00, 30, true, false, '2006-01-01T00:00:00Z'),
(2, 1, 'Laundry Service', 'laundry', 'Professional laundry and dry cleaning service', 25.00, 1440, true, false, '2006-01-01T00:00:00Z'),
(3, 1, 'Camping Facilities', 'camping', 'Secure camping facilities for budget travelers', 50.00, 1440, true, true, '2006-01-01T00:00:00Z'),
(4, 1, 'Room Service', 'room_service', '24/7 room service for food and beverages', 0.00, 30, true, false, '2006-01-01T00:00:00Z')
ON CONFLICT (service_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    service_name = EXCLUDED.service_name,
    service_type = EXCLUDED.service_type,
    description = EXCLUDED.description,
    base_price = EXCLUDED.base_price,
    duration_minutes = EXCLUDED.duration_minutes,
    is_available = EXCLUDED.is_available,
    requires_booking = EXCLUDED.requires_booking;

-- Create some sample rooms for each room type
INSERT INTO rooms (
    room_id,
    property_id,
    room_type_id,
    room_number,
    floor,
    status,
    is_active,
    created_at
) VALUES 
-- Standard Rooms (S-101 to S-115)
(1, 1, 1, 'S-101', 1, 'available', true, '2006-01-01T00:00:00Z'),
(2, 1, 1, 'S-102', 1, 'available', true, '2006-01-01T00:00:00Z'),
(3, 1, 1, 'S-103', 1, 'available', true, '2006-01-01T00:00:00Z'),
(4, 1, 1, 'S-104', 1, 'available', true, '2006-01-01T00:00:00Z'),
(5, 1, 1, 'S-105', 1, 'available', true, '2006-01-01T00:00:00Z'),
(6, 1, 1, 'S-106', 1, 'available', true, '2006-01-01T00:00:00Z'),
(7, 1, 1, 'S-107', 1, 'available', true, '2006-01-01T00:00:00Z'),
(8, 1, 1, 'S-108', 1, 'available', true, '2006-01-01T00:00:00Z'),
(9, 1, 1, 'S-109', 1, 'available', true, '2006-01-01T00:00:00Z'),
(10, 1, 1, 'S-110', 1, 'available', true, '2006-01-01T00:00:00Z'),
(11, 1, 1, 'S-111', 1, 'available', true, '2006-01-01T00:00:00Z'),
(12, 1, 1, 'S-112', 1, 'available', true, '2006-01-01T00:00:00Z'),
(13, 1, 1, 'S-113', 1, 'available', true, '2006-01-01T00:00:00Z'),
(14, 1, 1, 'S-114', 1, 'available', true, '2006-01-01T00:00:00Z'),
(15, 1, 1, 'S-115', 1, 'available', true, '2006-01-01T00:00:00Z'),

-- Executive Rooms (E-201 to E-210)
(16, 1, 2, 'E-201', 2, 'available', true, '2006-01-01T00:00:00Z'),
(17, 1, 2, 'E-202', 2, 'available', true, '2006-01-01T00:00:00Z'),
(18, 1, 2, 'E-203', 2, 'available', true, '2006-01-01T00:00:00Z'),
(19, 1, 2, 'E-204', 2, 'available', true, '2006-01-01T00:00:00Z'),
(20, 1, 2, 'E-205', 2, 'available', true, '2006-01-01T00:00:00Z'),
(21, 1, 2, 'E-206', 2, 'available', true, '2006-01-01T00:00:00Z'),
(22, 1, 2, 'E-207', 2, 'available', true, '2006-01-01T00:00:00Z'),
(23, 1, 2, 'E-208', 2, 'available', true, '2006-01-01T00:00:00Z'),
(24, 1, 2, 'E-209', 2, 'available', true, '2006-01-01T00:00:00Z'),
(25, 1, 2, 'E-210', 2, 'available', true, '2006-01-01T00:00:00Z'),

-- Luxury Rooms (L-301 to L-305)
(26, 1, 3, 'L-301', 3, 'available', true, '2006-01-01T00:00:00Z'),
(27, 1, 3, 'L-302', 3, 'available', true, '2006-01-01T00:00:00Z'),
(28, 1, 3, 'L-303', 3, 'available', true, '2006-01-01T00:00:00Z'),
(29, 1, 3, 'L-304', 3, 'available', true, '2006-01-01T00:00:00Z'),
(30, 1, 3, 'L-305', 3, 'available', true, '2006-01-01T00:00:00Z'),

-- Family Suites (FS-401 to FS-403)
(31, 1, 4, 'FS-401', 4, 'available', true, '2006-01-01T00:00:00Z'),
(32, 1, 4, 'FS-402', 4, 'available', true, '2006-01-01T00:00:00Z'),
(33, 1, 5, 'FS-403', 4, 'available', true, '2006-01-01T00:00:00Z'),

-- Premier Rooms (P-501 to P-502)
(34, 1, 6, 'P-501', 5, 'available', true, '2006-01-01T00:00:00Z'),
(35, 1, 6, 'P-502', 5, 'available', true, '2006-01-01T00:00:00Z')
ON CONFLICT (room_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    room_type_id = EXCLUDED.room_type_id,
    room_number = EXCLUDED.room_number,
    floor = EXCLUDED.floor,
    status = EXCLUDED.status,
    is_active = EXCLUDED.is_active;

-- Create a demo admin user for Etuna management
INSERT INTO users (
    user_id,
    email,
    password_hash,
    is_active,
    is_verified,
    user_type,
    created_at
) VALUES (
    'etuna-admin-001',
    'admin@etunaguesthouse.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5J5K5K5K5K', -- password: etuna123
    true,
    true,
    'property_manager',
    '2006-01-01T00:00:00Z'
) ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    is_active = EXCLUDED.is_active,
    is_verified = EXCLUDED.is_verified,
    user_type = EXCLUDED.user_type;

-- Create profile for the admin user
INSERT INTO profiles (
    profile_id,
    user_id,
    property_id,
    first_name,
    last_name,
    phone,
    role,
    is_active,
    created_at
) VALUES (
    'etuna-profile-001',
    'etuna-admin-001',
    1,
    'Etuna',
    'Administrator',
    '+264 65 231 177',
    'property_manager',
    true,
    '2006-01-01T00:00:00Z'
) ON CONFLICT (profile_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    property_id = EXCLUDED.property_id,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;

-- Create some sample reservations for demonstration
INSERT INTO room_reservations (
    reservation_id,
    property_id,
    room_type_id,
    customer_name,
    customer_email,
    customer_phone,
    check_in_date,
    check_out_date,
    adults,
    children,
    special_requests,
    total_amount,
    status,
    created_at
) VALUES 
(1, 1, 2, 'John Smith', 'john.smith@email.com', '+264 81 234 5678', '2024-01-15', '2024-01-17', 2, 0, 'Late check-in requested', 2000.00, 'confirmed', '2024-01-10T00:00:00Z'),
(2, 1, 4, 'Maria Garcia', 'maria.garcia@email.com', '+264 81 345 6789', '2024-01-16', '2024-01-19', 2, 2, 'High chair needed for toddler', 4500.00, 'pending', '2024-01-11T00:00:00Z'),
(3, 1, 1, 'Ahmed Hassan', 'ahmed.hassan@email.com', '+264 81 456 7890', '2024-01-14', '2024-01-16', 1, 0, 'Vegetarian meals only', 1500.00, 'checked-in', '2024-01-08T00:00:00Z'),
(4, 1, 3, 'Sarah Johnson', 'sarah.johnson@email.com', '+264 81 567 8901', '2024-01-18', '2024-01-20', 2, 0, 'Anniversary celebration', 1660.00, 'confirmed', '2024-01-12T00:00:00Z')
ON CONFLICT (reservation_id) DO UPDATE SET
    property_id = EXCLUDED.property_id,
    room_type_id = EXCLUDED.room_type_id,
    customer_name = EXCLUDED.customer_name,
    customer_email = EXCLUDED.customer_email,
    customer_phone = EXCLUDED.customer_phone,
    check_in_date = EXCLUDED.check_in_date,
    check_out_date = EXCLUDED.check_out_date,
    adults = EXCLUDED.adults,
    children = EXCLUDED.children,
    special_requests = EXCLUDED.special_requests,
    total_amount = EXCLUDED.total_amount,
    status = EXCLUDED.status;

-- Create some sample orders for demonstration
INSERT INTO orders (
    order_id,
    customer_id,
    property_id,
    payment_method,
    order_type,
    status,
    total_amount,
    notes,
    order_date
) VALUES 
(1, NULL, 1, 'cash', 'restaurant', 'delivered', 285.00, 'Table T-05', '2024-01-15T19:30:00Z'),
(2, NULL, 1, 'card', 'restaurant', 'ready', 150.00, 'Table T-12', '2024-01-15T20:15:00Z'),
(3, NULL, 1, 'cash', 'room_service', 'delivered', 95.00, 'Room S-101', '2024-01-15T21:00:00Z')
ON CONFLICT (order_id) DO UPDATE SET
    customer_id = EXCLUDED.customer_id,
    property_id = EXCLUDED.property_id,
    payment_method = EXCLUDED.payment_method,
    order_type = EXCLUDED.order_type,
    status = EXCLUDED.status,
    total_amount = EXCLUDED.total_amount,
    notes = EXCLUDED.notes,
    order_date = EXCLUDED.order_date;

-- Create order items
INSERT INTO order_items (
    order_item_id,
    order_id,
    menu_item_id,
    quantity,
    unit_price,
    total_price,
    special_instructions
) VALUES 
(1, 1, 1, 1, 120.00, 120.00, 'No spicy food'),
(2, 1, 2, 1, 95.00, 95.00, ''),
(3, 1, 9, 2, 15.00, 30.00, ''),
(4, 2, 3, 1, 85.00, 85.00, 'Extra cheese on pizza'),
(5, 2, 8, 1, 35.00, 35.00, ''),
(6, 2, 9, 1, 15.00, 15.00, ''),
(7, 3, 2, 1, 95.00, 95.00, 'Vegetarian meals only')
ON CONFLICT (order_item_id) DO UPDATE SET
    order_id = EXCLUDED.order_id,
    menu_item_id = EXCLUDED.menu_item_id,
    quantity = EXCLUDED.quantity,
    unit_price = EXCLUDED.unit_price,
    total_price = EXCLUDED.total_price,
    special_instructions = EXCLUDED.special_instructions;

-- Update sequences to avoid conflicts
SELECT setval('hospitality_properties_property_id_seq', 1, true);
SELECT setval('room_types_room_type_id_seq', 6, true);
SELECT setval('menu_categories_category_id_seq', 8, true);
SELECT setval('menu_menu_item_id_seq', 10, true);
SELECT setval('transportation_services_service_id_seq', 4, true);
SELECT setval('recreation_services_recreation_id_seq', 4, true);
SELECT setval('specialized_services_service_id_seq', 4, true);
SELECT setval('rooms_room_id_seq', 35, true);
SELECT setval('room_reservations_reservation_id_seq', 4, true);
SELECT setval('orders_order_id_seq', 3, true);
SELECT setval('order_items_order_item_id_seq', 7, true);

-- Grant permissions to the admin user
INSERT INTO user_permissions (
    user_id,
    permission,
    resource_type,
    resource_id,
    granted_at
) VALUES 
('etuna-admin-001', 'read', 'property', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'write', 'property', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'read', 'reservations', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'write', 'reservations', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'read', 'orders', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'write', 'orders', '1', '2006-01-01T00:00:00Z'),
('etuna-admin-001', 'read', 'analytics', '1', '2006-01-01T00:00:00Z')
ON CONFLICT (user_id, permission, resource_type, resource_id) DO NOTHING;

COMMIT;