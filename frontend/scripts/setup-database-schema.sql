-- Database Schema Setup Script
-- This script ensures all required tables, policies, and triggers are created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_status_enum') THEN
        CREATE TYPE property_status_enum AS ENUM (
            'active',
            'inactive',
            'maintenance',
            'suspended',
            'pending_approval'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'room_status_enum') THEN
        CREATE TYPE room_status_enum AS ENUM (
            'available',
            'occupied',
            'maintenance',
            'out_of_order',
            'reserved'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status_enum') THEN
        CREATE TYPE booking_status_enum AS ENUM (
            'pending',
            'confirmed',
            'checked_in',
            'checked_out',
            'cancelled',
            'no_show'
        );
    END IF;
END $$;

-- Create hospitality_properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hospitality_properties (
    property_id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tagline VARCHAR(255),
    property_type VARCHAR(100) NOT NULL,
    status property_status_enum DEFAULT 'active',
    
    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    fax VARCHAR(50),
    
    -- Address Information
    address JSONB NOT NULL,
    
    -- Business Information
    established_year INTEGER,
    capacity INTEGER,
    employee_count INTEGER,
    certifications TEXT[],
    awards TEXT[],
    vision_statement TEXT,
    
    -- Media
    hero_image TEXT,
    logo TEXT,
    gallery TEXT[],
    
    -- Policies
    check_in_time TIME,
    check_out_time TIME,
    cancellation_policy TEXT,
    pet_policy BOOLEAN DEFAULT FALSE,
    smoking_policy BOOLEAN DEFAULT FALSE,
    
    -- Operating Hours
    operating_hours JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create room_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.room_types (
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

-- Create restaurant_details table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.restaurant_details (
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

-- Create menu_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.menu_items (
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

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reviews (
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

-- Create RBAC tables if they don't exist
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    tenant_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    resource_id UUID,
    granted_by UUID,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, permission_id, resource_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON public.room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_room_types_active ON public.room_types(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_items_property_id ON public.menu_items(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions(user_id);

-- Create RLS policies for multi-tenant security
ALTER TABLE public.hospitality_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies (basic - can be enhanced based on tenant requirements)
CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.hospitality_properties
    FOR ALL TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.room_types
    FOR ALL TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.menu_items
    FOR ALL TO authenticated USING (true);

CREATE POLICY IF NOT EXISTS "Allow all operations for authenticated users" ON public.reviews
    FOR ALL TO authenticated USING (true);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hospitality_properties_updated_at 
    BEFORE UPDATE ON public.hospitality_properties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at 
    BEFORE UPDATE ON public.room_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_details_updated_at 
    BEFORE UPDATE ON public.restaurant_details 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON public.menu_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;

COMMIT;
