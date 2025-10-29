-- Database Validation Script
-- This script checks if all required tables exist and creates them if needed

-- Check if tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Check hospitality_properties table
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'hospitality_properties';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'Creating hospitality_properties table...';
        
        CREATE TABLE public.hospitality_properties (
            property_id SERIAL PRIMARY KEY,
            owner_id UUID NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            tagline VARCHAR(255),
            property_type VARCHAR(100) NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            phone VARCHAR(50),
            email VARCHAR(255),
            website TEXT,
            address JSONB NOT NULL,
            established_year INTEGER,
            capacity INTEGER,
            employee_count INTEGER,
            hero_image TEXT,
            logo TEXT,
            gallery TEXT[],
            check_in_time TIME,
            check_out_time TIME,
            operating_hours JSONB,
            metadata JSONB DEFAULT '{}'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Check room_types table
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'room_types';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'Creating room_types table...';
        
        CREATE TABLE public.room_types (
            room_type_id SERIAL PRIMARY KEY,
            property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            room_type VARCHAR(100) NOT NULL,
            capacity_adults INTEGER NOT NULL,
            capacity_children INTEGER DEFAULT 0,
            base_price DECIMAL(10,2) NOT NULL,
            currency VARCHAR(3) DEFAULT 'NAD',
            amenities TEXT[],
            features TEXT[],
            images TEXT[],
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Check restaurant_details table
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'restaurant_details';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'Creating restaurant_details table...';
        
        CREATE TABLE public.restaurant_details (
            property_id INTEGER PRIMARY KEY REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
            cuisine_type VARCHAR(100) NOT NULL,
            price_range VARCHAR(10) NOT NULL,
            opening_hours JSONB,
            delivery_available BOOLEAN DEFAULT FALSE,
            takeaway_available BOOLEAN DEFAULT FALSE,
            dine_in_available BOOLEAN DEFAULT TRUE,
            special_dietary_options TEXT[],
            payment_methods TEXT[],
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Check menu_items table
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'menu_items';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'Creating menu_items table...';
        
        CREATE TABLE public.menu_items (
            id SERIAL PRIMARY KEY,
            property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            is_available BOOLEAN DEFAULT TRUE,
            allergens TEXT[],
            dietary_info TEXT[],
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    -- Check reviews table
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'reviews';
    
    IF table_count = 0 THEN
        RAISE NOTICE 'Creating reviews table...';
        
        CREATE TABLE public.reviews (
            id SERIAL PRIMARY KEY,
            property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
            customer_name VARCHAR(255) NOT NULL,
            overall_rating DECIMAL(2,1) NOT NULL CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
            food_rating DECIMAL(2,1) CHECK (food_rating >= 1.0 AND food_rating <= 5.0),
            service_rating DECIMAL(2,1) CHECK (service_rating >= 1.0 AND service_rating <= 5.0),
            atmosphere_rating DECIMAL(2,1) CHECK (atmosphere_rating >= 1.0 AND atmosphere_rating <= 5.0),
            value_rating DECIMAL(2,1) CHECK (value_rating >= 1.0 AND value_rating <= 5.0),
            review_text TEXT,
            is_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
    
    RAISE NOTICE 'Database validation complete. All required tables exist.';
END $$;

-- Insert test data if tables are empty
DO $$
DECLARE
    property_count INTEGER;
    room_count INTEGER;
BEGIN
    -- Check if we have any properties
    SELECT COUNT(*) INTO property_count FROM public.hospitality_properties;
    
    IF property_count = 0 THEN
        RAISE NOTICE 'Inserting test properties...';
        
        INSERT INTO public.hospitality_properties (
            property_id, owner_id, name, description, tagline, property_type, status,
            phone, email, website, address, established_year, capacity, employee_count,
            hero_image, logo, gallery, check_in_time, check_out_time, operating_hours
        ) VALUES 
        (1, '550e8400-e29b-41d4-a716-446655440001', 'Desert Rose Hotel', 'Luxury desert retreat with world-class amenities', 'Where Desert Meets Luxury', 'hotel', 'active',
        '+264 61 123 456', 'info@desertrose.com', 'https://desertrose.com',
        '{"street": "789 Luxury Lane", "city": "Windhoek", "region": "Khomas", "country": "Namibia", "postalCode": "10001", "coordinates": {"lat": -22.5609, "lng": 17.0658}}',
        2015, 150, 45,
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
        ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'],
        '14:00', '11:00',
        '{"restaurant": {"mondayToThursday": "07:00-22:00", "fridayToSunday": "10:00-15:00"}, "frontDesk": "24 hours"}'
        );
    END IF;
    
    -- Check if we have any room types
    SELECT COUNT(*) INTO room_count FROM public.room_types;
    
    IF room_count = 0 THEN
        RAISE NOTICE 'Inserting test room types...';
        
        INSERT INTO public.room_types (
            property_id, name, description, room_type, capacity_adults, capacity_children,
            base_price, currency, amenities, features, images, is_active
        ) VALUES 
        (1, 'Deluxe Suite', 'Spacious suite with desert views and premium amenities', 'suite', 2, 2, 450.00, 'NAD',
        ARRAY['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Desert View', 'Private Balcony'],
        ARRAY['Premium Bedding', 'Marble Bathroom', 'Smart TV', 'Coffee Machine'],
        ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop'],
        true),
        
        (1, 'Standard Room', 'Comfortable room with modern amenities', 'standard', 2, 1, 250.00, 'NAD',
        ARRAY['WiFi', 'Air Conditioning', 'TV', 'Room Service'],
        ARRAY['Comfortable Bedding', 'Private Bathroom', 'Work Desk'],
        ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'],
        true);
    END IF;
    
    RAISE NOTICE 'Test data insertion complete.';
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON public.room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON public.room_types(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_property_id ON public.menu_items(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);

COMMIT;
