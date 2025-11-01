-- =====================================================
-- Hotel Configuration Default Data
-- Buffr Host Platform - Hotel-Centric Architecture
-- =====================================================

-- =====================================================
-- 1. INSERT HOTEL TYPES
-- =====================================================
INSERT INTO hotel_types (name, description, icon, common_services) VALUES
('Boutique Hotel', 'Small, stylish hotels with unique character and personalized service', 'building-2', '["room_service", "concierge", "spa", "restaurant", "bar", "wifi", "parking"]'),
('Resort & Lodge', 'Large properties with extensive amenities and recreational facilities', 'mountain', '["spa", "restaurant", "bar", "pool", "gym", "conference", "transportation", "activities", "room_service", "concierge"]'),
('Vacation Rental', 'Private homes, apartments, or unique properties for short-term stays', 'home', '["kitchen", "wifi", "parking", "laundry", "cleaning", "check_in"]'),
('Guest House', 'Small, intimate accommodations with personal service', 'house', '["breakfast", "wifi", "parking", "concierge", "cleaning"]'),
('Hotel Chain', 'Multi-location hotels with standardized services and amenities', 'building', '["room_service", "concierge", "restaurant", "bar", "wifi", "parking", "gym", "business_center"]'),
('Specialty Accommodation', 'Unique stays like glamping, treehouses, or themed properties', 'tent', '["activities", "concierge", "wifi", "parking", "special_services"]')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 2. INSERT HOTEL SERVICES
-- =====================================================
INSERT INTO hotel_services (name, description, category, icon) VALUES
-- Accommodation Services
('Room Management', 'Manage room inventory, availability, and housekeeping', 'accommodation', 'bed'),
('Housekeeping', 'Cleaning, maintenance, and room preparation services', 'accommodation', 'sparkles'),
('Concierge', 'Guest services, recommendations, and assistance', 'accommodation', 'user-check'),

-- Food & Beverage Services
('Restaurant', 'Full-service dining establishment', 'food_beverage', 'utensils'),
('Bar & Lounge', 'Beverage service and social spaces', 'food_beverage', 'wine'),
('Room Service', 'In-room dining and beverage delivery', 'food_beverage', 'truck'),
('Catering', 'Event and group dining services', 'food_beverage', 'chef-hat'),
('Coffee Shop', 'Quick service coffee and light meals', 'food_beverage', 'coffee'),

-- Wellness & Recreation
('Spa & Wellness', 'Massage, treatments, and wellness services', 'wellness', 'spa'),
('Fitness Center', 'Gym, equipment, and fitness classes', 'wellness', 'dumbbell'),
('Pool & Aquatics', 'Swimming pools and water activities', 'wellness', 'waves'),
('Tennis Court', 'Tennis and racquet sports facilities', 'wellness', 'tennis'),

-- Business & Events
('Conference Facilities', 'Meeting rooms and event spaces', 'business', 'users'),
('Business Center', 'Work spaces and business services', 'business', 'briefcase'),
('Event Planning', 'Wedding and special event coordination', 'business', 'calendar'),

-- Guest Services
('Transportation', 'Airport shuttles, car rental, and transfers', 'guest_services', 'car'),
('Valet Parking', 'Vehicle parking and retrieval service', 'guest_services', 'parking-circle'),
('Laundry Service', 'Guest laundry and dry cleaning', 'guest_services', 'shirt'),
('Pet Services', 'Pet-friendly accommodations and services', 'guest_services', 'dog'),

-- Technology & Communication
('WiFi & Internet', 'High-speed internet and connectivity', 'technology', 'wifi'),
('Business Services', 'Printing, copying, and office support', 'technology', 'printer'),
('Entertainment', 'TV, streaming, and entertainment systems', 'technology', 'tv'),

-- Special Services
('Childcare', 'Kids club and childcare services', 'special', 'baby'),
('Tour Desk', 'Local tours and activity booking', 'special', 'map'),
('Gift Shop', 'Souvenirs and convenience items', 'special', 'shopping-bag'),
('Security', '24/7 security and safety services', 'special', 'shield')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 3. INSERT RESTAURANT TYPES
-- =====================================================
INSERT INTO restaurant_types (name, description, icon, common_features) VALUES
('Fine Dining', 'Upscale restaurants with premium cuisine and service', 'crown', '["table_service", "wine_list", "dress_code", "reservations", "private_dining"]'),
('Casual Dining', 'Relaxed atmosphere with quality food and moderate prices', 'utensils', '["table_service", "family_friendly", "takeout", "delivery", "bar"]'),
('Fast Casual', 'Quick service with higher quality ingredients', 'zap', '["counter_service", "quick_prep", "customizable", "takeout", "delivery"]'),
('Fast Food', 'Quick service with standardized menu items', 'clock', '["counter_service", "drive_through", "takeout", "delivery", "franchise"]'),
('Cafe & Coffee', 'Coffee shops and light meal establishments', 'coffee', '["coffee_service", "pastries", "wifi", "takeout", "casual_seating"]'),
('Bar & Grill', 'Sports bars and casual dining with alcohol service', 'beer', '["bar_service", "sports_tv", "pub_food", "happy_hour", "entertainment"]'),
('Buffet', 'Self-service dining with multiple food stations', 'layers', '["self_service", "variety", "all_you_can_eat", "family_friendly", "group_dining"]'),
('Food Truck', 'Mobile food service with limited menu', 'truck', '["mobile_service", "limited_menu", "quick_service", "street_food", "events"]'),
('Catering', 'Off-site food service for events and groups', 'chef-hat', '["off_site", "event_service", "custom_menus", "delivery", "setup_service"]'),
('Ghost Kitchen', 'Delivery-only restaurants without dine-in space', 'home', '["delivery_only", "online_orders", "virtual_brand", "cloud_kitchen", "app_based"]')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. CREATE SAMPLE PROPERTIES (if hospitality_properties table exists)
-- =====================================================
-- Note: This assumes the hospitality_properties table already exists
-- If not, these will be skipped

-- Sample Boutique Hotel
INSERT INTO hospitality_properties (id, name, property_type, address, city, country, tenant_id, is_active)
SELECT 
    uuid_generate_v4(),
    'The Nude Boutique Hotel',
    'hotel',
    '123 Luxury Lane',
    'Cape Town',
    'South Africa',
    (SELECT id FROM tenants LIMIT 1),
    true
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospitality_properties')
ON CONFLICT DO NOTHING;

-- Sample Resort
INSERT INTO hospitality_properties (id, name, property_type, address, city, country, tenant_id, is_active)
SELECT 
    uuid_generate_v4(),
    'Buffr Mountain Resort',
    'resort',
    '456 Mountain View Drive',
    'Stellenbosch',
    'South Africa',
    (SELECT id FROM tenants LIMIT 1),
    true
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospitality_properties')
ON CONFLICT DO NOTHING;

-- Sample Vacation Rental
INSERT INTO hospitality_properties (id, name, property_type, address, city, country, tenant_id, is_active)
SELECT 
    uuid_generate_v4(),
    'Coastal Villa Retreat',
    'vacation_rental',
    '789 Ocean Drive',
    'Hermanus',
    'South Africa',
    (SELECT id FROM tenants LIMIT 1),
    true
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospitality_properties')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. CREATE SAMPLE HOTEL CONFIGURATIONS
-- =====================================================
-- Sample Boutique Hotel Configuration
INSERT INTO hotel_configurations (property_id, hotel_type_id, selected_services, configuration_data)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    (SELECT id FROM hotel_types WHERE name = 'Boutique Hotel'),
    '["room_service", "concierge", "spa", "restaurant", "bar", "wifi", "parking"]',
    '{
        "check_in_time": "15:00",
        "check_out_time": "11:00",
        "cancellation_policy": "24_hours",
        "pet_friendly": true,
        "smoking_allowed": false,
        "age_restriction": 18,
        "max_guests_per_room": 4,
        "breakfast_included": false,
        "valet_parking": true,
        "room_service_hours": "06:00-23:00",
        "spa_hours": "08:00-20:00",
        "restaurant_hours": "07:00-22:00",
        "bar_hours": "16:00-01:00"
    }'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel')
ON CONFLICT (property_id) DO NOTHING;

-- Sample Resort Configuration
INSERT INTO hotel_configurations (property_id, hotel_type_id, selected_services, configuration_data)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Buffr Mountain Resort' LIMIT 1),
    (SELECT id FROM hotel_types WHERE name = 'Resort & Lodge'),
    '["spa", "restaurant", "bar", "pool", "gym", "conference", "transportation", "activities", "room_service", "concierge"]',
    '{
        "check_in_time": "15:00",
        "check_out_time": "11:00",
        "cancellation_policy": "48_hours",
        "pet_friendly": false,
        "smoking_allowed": false,
        "age_restriction": 0,
        "max_guests_per_room": 6,
        "breakfast_included": true,
        "valet_parking": true,
        "room_service_hours": "24_hours",
        "spa_hours": "06:00-22:00",
        "restaurant_hours": "06:00-23:00",
        "bar_hours": "12:00-02:00",
        "pool_hours": "06:00-22:00",
        "gym_hours": "24_hours",
        "conference_capacity": 200,
        "activities_available": ["hiking", "wine_tasting", "mountain_biking", "yoga"]
    }'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Buffr Mountain Resort')
ON CONFLICT (property_id) DO NOTHING;

-- Sample Vacation Rental Configuration
INSERT INTO hotel_configurations (property_id, hotel_type_id, selected_services, configuration_data)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Coastal Villa Retreat' LIMIT 1),
    (SELECT id FROM hotel_types WHERE name = 'Vacation Rental'),
    '["kitchen", "wifi", "parking", "laundry", "cleaning", "check_in"]',
    '{
        "check_in_time": "16:00",
        "check_out_time": "10:00",
        "cancellation_policy": "7_days",
        "pet_friendly": true,
        "smoking_allowed": false,
        "age_restriction": 21,
        "max_guests": 8,
        "breakfast_included": false,
        "self_check_in": true,
        "kitchen_fully_equipped": true,
        "laundry_available": true,
        "cleaning_fee": 150.00,
        "security_deposit": 500.00,
        "minimum_stay": 2
    }'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Coastal Villa Retreat')
ON CONFLICT (property_id) DO NOTHING;

-- =====================================================
-- 6. CREATE SAMPLE RESTAURANT CONFIGURATIONS
-- =====================================================
-- Sample Fine Dining Restaurant
INSERT INTO restaurant_configurations (property_id, restaurant_type_id, configuration_data)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    (SELECT id FROM restaurant_types WHERE name = 'Fine Dining'),
    '{
        "cuisine_type": "Contemporary South African",
        "dress_code": "smart_casual",
        "reservations_required": true,
        "max_capacity": 50,
        "operating_hours": {
            "monday": "18:00-22:00",
            "tuesday": "18:00-22:00",
            "wednesday": "18:00-22:00",
            "thursday": "18:00-22:00",
            "friday": "18:00-23:00",
            "saturday": "18:00-23:00",
            "sunday": "18:00-21:00"
        },
        "price_range": "$$$$",
        "wine_list": true,
        "private_dining": true,
        "chef_specialties": ["local_seafood", "game_meat", "wine_pairings"]
    }'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel')
ON CONFLICT (property_id) DO NOTHING;

-- Sample Casual Dining Restaurant
INSERT INTO restaurant_configurations (property_id, restaurant_type_id, configuration_data)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Buffr Mountain Resort' LIMIT 1),
    (SELECT id FROM restaurant_types WHERE name = 'Casual Dining'),
    '{
        "cuisine_type": "International",
        "dress_code": "casual",
        "reservations_required": false,
        "max_capacity": 120,
        "operating_hours": {
            "monday": "07:00-22:00",
            "tuesday": "07:00-22:00",
            "wednesday": "07:00-22:00",
            "thursday": "07:00-22:00",
            "friday": "07:00-23:00",
            "saturday": "07:00-23:00",
            "sunday": "07:00-21:00"
        },
        "price_range": "$$",
        "wine_list": true,
        "family_friendly": true,
        "takeout_available": true,
        "delivery_available": false,
        "buffet_breakfast": true
    }'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Buffr Mountain Resort')
ON CONFLICT (property_id) DO NOTHING;

-- =====================================================
-- 7. CREATE SAMPLE ROOM TYPES
-- =====================================================
-- Sample room types for Boutique Hotel
INSERT INTO room_types (property_id, name, description, base_price, max_occupancy, room_size, bed_type, amenities)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    'Deluxe King Room',
    'Spacious room with king bed, city view, and luxury amenities',
    450.00,
    2,
    35.0,
    'king',
    '["wifi", "minibar", "safe", "balcony", "city_view", "air_conditioning", "tv", "coffee_machine"]'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel')
ON CONFLICT DO NOTHING;

INSERT INTO room_types (property_id, name, description, base_price, max_occupancy, room_size, bed_type, amenities)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    'Executive Suite',
    'Luxury suite with separate living area and premium amenities',
    750.00,
    4,
    65.0,
    'king',
    '["wifi", "minibar", "safe", "balcony", "city_view", "air_conditioning", "tv", "coffee_machine", "living_area", "jacuzzi", "butler_service"]'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel')
ON CONFLICT DO NOTHING;

-- Sample room types for Resort
INSERT INTO room_types (property_id, name, description, base_price, max_occupancy, room_size, bed_type, amenities)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Buffr Mountain Resort' LIMIT 1),
    'Mountain View Room',
    'Comfortable room with stunning mountain views',
    320.00,
    2,
    28.0,
    'queen',
    '["wifi", "mountain_view", "air_conditioning", "tv", "coffee_machine", "balcony"]'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Buffr Mountain Resort')
ON CONFLICT DO NOTHING;

INSERT INTO room_types (property_id, name, description, base_price, max_occupancy, room_size, bed_type, amenities)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Buffr Mountain Resort' LIMIT 1),
    'Family Villa',
    'Spacious villa perfect for families with children',
    580.00,
    6,
    85.0,
    'multiple',
    '["wifi", "mountain_view", "air_conditioning", "tv", "coffee_machine", "balcony", "kitchenette", "living_area", "children_amenities"]'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Buffr Mountain Resort')
ON CONFLICT DO NOTHING;

-- Sample room types for Vacation Rental
INSERT INTO room_types (property_id, name, description, base_price, max_occupancy, room_size, bed_type, amenities)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'Coastal Villa Retreat' LIMIT 1),
    'Ocean Villa',
    'Private villa with ocean views and full kitchen',
    1200.00,
    8,
    120.0,
    'multiple',
    '["wifi", "ocean_view", "air_conditioning", "tv", "full_kitchen", "balcony", "private_pool", "bbq_area", "laundry", "parking"]'
WHERE EXISTS (SELECT 1 FROM hospitality_properties WHERE name = 'Coastal Villa Retreat')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. CREATE SAMPLE ROOMS
-- =====================================================
-- Sample rooms for Boutique Hotel
INSERT INTO rooms (property_id, room_type_id, room_number, floor, status)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    (SELECT id FROM room_types WHERE name = 'Deluxe King Room' AND property_id = (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1) LIMIT 1),
    '101',
    1,
    'available'
WHERE EXISTS (SELECT 1 FROM room_types WHERE name = 'Deluxe King Room')
ON CONFLICT (property_id, room_number) DO NOTHING;

INSERT INTO rooms (property_id, room_type_id, room_number, floor, status)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    (SELECT id FROM room_types WHERE name = 'Deluxe King Room' AND property_id = (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1) LIMIT 1),
    '102',
    1,
    'available'
WHERE EXISTS (SELECT 1 FROM room_types WHERE name = 'Deluxe King Room')
ON CONFLICT (property_id, room_number) DO NOTHING;

INSERT INTO rooms (property_id, room_type_id, room_number, floor, status)
SELECT 
    (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1),
    (SELECT id FROM room_types WHERE name = 'Executive Suite' AND property_id = (SELECT id FROM hospitality_properties WHERE name = 'The Nude Boutique Hotel' LIMIT 1) LIMIT 1),
    '201',
    2,
    'available'
WHERE EXISTS (SELECT 1 FROM room_types WHERE name = 'Executive Suite')
ON CONFLICT (property_id, room_number) DO NOTHING;

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Verify data was inserted correctly
SELECT 'Hotel Types' as table_name, COUNT(*) as record_count FROM hotel_types
UNION ALL
SELECT 'Hotel Services', COUNT(*) FROM hotel_services
UNION ALL
SELECT 'Restaurant Types', COUNT(*) FROM restaurant_types
UNION ALL
SELECT 'Hotel Configurations', COUNT(*) FROM hotel_configurations
UNION ALL
SELECT 'Restaurant Configurations', COUNT(*) FROM restaurant_configurations
UNION ALL
SELECT 'Room Types', COUNT(*) FROM room_types
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms;

-- =====================================================
-- 10. SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Get all hotel types with their common services
-- SELECT ht.name, ht.description, ht.common_services 
-- FROM hotel_types ht 
-- WHERE ht.is_active = true;

-- Get all services by category
-- SELECT category, COUNT(*) as service_count 
-- FROM hotel_services 
-- WHERE is_active = true 
-- GROUP BY category 
-- ORDER BY service_count DESC;

-- Get property configurations
-- SELECT 
--     hp.name as property_name,
--     ht.name as hotel_type,
--     hc.selected_services,
--     rc.restaurant_type
-- FROM hospitality_properties hp
-- LEFT JOIN hotel_configurations hc ON hp.id = hc.property_id
-- LEFT JOIN hotel_types ht ON hc.hotel_type_id = ht.id
-- LEFT JOIN restaurant_configurations rc ON hp.id = rc.property_id
-- LEFT JOIN restaurant_types rt ON rc.restaurant_type_id = rt.id;