-- =============================================================================
-- BUFFR HOST - ADD MENU AND REVIEWS DATA
-- =============================================================================
-- This script adds comprehensive menu items and reviews for restaurants

-- =============================================================================
-- 1. ADD MENU ITEMS FOR RESTAURANTS
-- =============================================================================

-- Savanna Restaurant Menu Items
INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Appetizers',
    'Namibian Biltong Platter',
    'Traditional dried meat with local spices and herbs',
    45.00,
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Appetizers',
    'Kapana Skewers',
    'Grilled street food with traditional Namibian spices',
    35.00,
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Main Courses',
    'Oryx Steak',
    'Premium Namibian oryx with red wine reduction and seasonal vegetables',
    180.00,
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Main Courses',
    'Potjiekos',
    'Traditional stew with lamb, vegetables, and local herbs',
    120.00,
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Desserts',
    'Melktert',
    'Traditional South African milk tart with cinnamon',
    45.00,
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

-- Ocean Breeze Restaurant Menu Items
INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Appetizers',
    'Fresh Oyster Platter',
    'Daily fresh oysters with lemon and mignonette sauce',
    85.00,
    true
FROM properties p 
WHERE p.name = 'Ocean Breeze' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Main Courses',
    'Grilled Kingklip',
    'Fresh Namibian kingklip with garlic butter and seasonal vegetables',
    165.00,
    true
FROM properties p 
WHERE p.name = 'Ocean Breeze' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Main Courses',
    'Seafood Platter',
    'Mixed seafood with prawns, calamari, and fish',
    220.00,
    true
FROM properties p 
WHERE p.name = 'Ocean Breeze' AND p.type = 'restaurant';

-- Desert Rose Restaurant Menu Items
INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Appetizers',
    'Mediterranean Mezze',
    'Selection of Mediterranean appetizers with hummus, olives, and pita',
    65.00,
    true
FROM properties p 
WHERE p.name = 'Desert Rose' AND p.type = 'restaurant';

INSERT INTO menu_items (
    property_id,
    category,
    name,
    description,
    price,
    is_available
)
SELECT 
    p.id,
    'Main Courses',
    'Wagyu Beef Tenderloin',
    'Premium wagyu beef with truffle sauce and roasted vegetables',
    280.00,
    true
FROM properties p 
WHERE p.name = 'Desert Rose' AND p.type = 'restaurant';

-- =============================================================================
-- 2. ADD REVIEWS FOR RESTAURANTS
-- =============================================================================

-- Savanna Restaurant Reviews
INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'Sarah M.',
    5,
    5,
    5,
    5,
    5,
    'Absolutely amazing food and service! The braai platter was incredible. The staff was very friendly and the atmosphere was perfect for a family dinner.',
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'John K.',
    4,
    5,
    4,
    4,
    4,
    'Great traditional Namibian cuisine. The oryx steak was perfectly cooked. Only minor issue was the wait time, but the food was worth it.',
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'Maria L.',
    5,
    5,
    5,
    5,
    5,
    'Outstanding experience! The potjiekos was authentic and delicious. The restaurant has a great ambiance and the staff is very knowledgeable about the menu.',
    true
FROM properties p 
WHERE p.name = 'Savanna Restaurant' AND p.type = 'restaurant';

-- Ocean Breeze Restaurant Reviews
INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'David R.',
    5,
    5,
    5,
    5,
    4,
    'Fresh seafood at its finest! The kingklip was perfectly grilled and the oyster platter was outstanding. Great ocean views and excellent service.',
    true
FROM properties p 
WHERE p.name = 'Ocean Breeze' AND p.type = 'restaurant';

INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'Lisa T.',
    4,
    4,
    4,
    5,
    4,
    'Beautiful restaurant with amazing ocean views. The seafood platter was generous and fresh. Service was good, though a bit slow during peak hours.',
    true
FROM properties p 
WHERE p.name = 'Ocean Breeze' AND p.type = 'restaurant';

-- Desert Rose Restaurant Reviews
INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'Michael B.',
    5,
    5,
    5,
    5,
    4,
    'Exceptional fine dining experience! The wagyu beef was incredible and the wine selection was impressive. Perfect for special occasions.',
    true
FROM properties p 
WHERE p.name = 'Desert Rose' AND p.type = 'restaurant';

INSERT INTO reviews (
    property_id,
    tenant_id,
    customer_name,
    overall_rating,
    food_rating,
    service_rating,
    atmosphere_rating,
    value_rating,
    review_text,
    is_verified
)
SELECT 
    p.id,
    'tenant-001',
    'Emma W.',
    4,
    4,
    4,
    5,
    4,
    'Lovely restaurant with great atmosphere. The Mediterranean mezze was delicious and the service was attentive. Would definitely recommend.',
    true
FROM properties p 
WHERE p.name = 'Desert Rose' AND p.type = 'restaurant';

-- =============================================================================
-- COMPLETION MESSAGE
-- =============================================================================

DO $$ BEGIN
    RAISE NOTICE 'Menu items and reviews added successfully!';
    RAISE NOTICE 'Restaurants now have comprehensive menus and customer reviews';
    RAISE NOTICE 'Database is ready for full restaurant functionality testing';
END $$;