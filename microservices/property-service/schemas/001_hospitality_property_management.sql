-- Hospitality Property Management Schema
-- Integrates with unified database structure for Buffr Host

-- Create property status enum
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

-- Create room status enum
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

-- Create booking status enum
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

-- Create payment status enum
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM (
            'pending',
            'paid',
            'partial',
            'failed',
            'refunded'
        );
    END IF;
END $$;

-- Hospitality Properties Table
CREATE TABLE IF NOT EXISTS public.hospitality_properties (
    property_id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tagline VARCHAR(255),
    property_type VARCHAR(100) NOT NULL, -- e.g., 'hotel', 'guesthouse', 'lodge', 'resort'
    status property_status_enum DEFAULT 'active',
    
    -- Contact Information
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    fax VARCHAR(50),
    
    -- Address Information
    address JSONB NOT NULL, -- {street, city, region, country, postalCode, coordinates}
    
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
    operating_hours JSONB, -- {restaurant: {mondayToThursday: "07:00-22:00", fridayToSunday: "10:00-15:00"}, frontDesk: "24 hours"}
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Types Table
CREATE TABLE IF NOT EXISTS public.room_types (
    room_type_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    room_type VARCHAR(100) NOT NULL, -- e.g., 'standard', 'deluxe', 'suite', 'family'
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

-- Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    room_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    room_type_id INTEGER NOT NULL REFERENCES public.room_types(room_type_id) ON DELETE CASCADE,
    room_number VARCHAR(50) NOT NULL,
    floor INTEGER,
    status room_status_enum DEFAULT 'available',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, room_number)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES public.rooms(room_id) ON DELETE CASCADE,
    booking_reference VARCHAR(255) UNIQUE NOT NULL,
    status booking_status_enum DEFAULT 'pending',
    
    -- Booking Details
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INTEGER NOT NULL,
    children INTEGER DEFAULT 0,
    special_requests TEXT,
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    fees DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    
    -- Payment Information
    payment_status payment_status_enum DEFAULT 'pending',
    payment_method VARCHAR(100), -- 'credit_card', 'cash', 'gift_card', 'loyalty_points', 'buffr_pay', 'bank_transfer', 'mobile_money'
    payment_reference VARCHAR(255),
    
    -- Timestamps
    booking_date TIMESTAMPTZ DEFAULT NOW(),
    confirmation_date TIMESTAMPTZ,
    check_in_timestamp TIMESTAMPTZ,
    check_out_timestamp TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories Table
CREATE TABLE IF NOT EXISTS public.menu_categories (
    category_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    item_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES public.menu_categories(category_id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    is_available BOOLEAN DEFAULT TRUE,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    allergens TEXT[],
    images TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tours Table
CREATE TABLE IF NOT EXISTS public.tours (
    tour_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100) NOT NULL, -- e.g., 'Half Day (4 hours)', 'Full Day (8 hours)'
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    category VARCHAR(100) NOT NULL, -- e.g., 'wildlife', 'cultural', 'adventure'
    difficulty VARCHAR(50) DEFAULT 'easy', -- 'easy', 'moderate', 'challenging'
    max_participants INTEGER,
    includes TEXT[],
    highlights TEXT[],
    images TEXT[],
    departure_time TIME,
    return_time TIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tour Bookings Table
CREATE TABLE IF NOT EXISTS public.tour_bookings (
    tour_booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    tour_id INTEGER NOT NULL REFERENCES public.tours(tour_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_reference VARCHAR(255) UNIQUE NOT NULL,
    tour_date DATE NOT NULL,
    participants INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NAD',
    status booking_status_enum DEFAULT 'pending',
    payment_status payment_status_enum DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Staff Table
CREATE TABLE IF NOT EXISTS public.property_staff (
    staff_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    permissions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    hired_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, user_id)
);

-- Property Reviews Table
CREATE TABLE IF NOT EXISTS public.property_reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES public.hospitality_properties(property_id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.bookings(booking_id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    review_text TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.hospitality_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hospitality_properties
CREATE POLICY "Property owners can manage their properties" ON public.hospitality_properties
    FOR ALL USING (owner_id = auth.uid());

CREATE POLICY "Property staff can view their property" ON public.hospitality_properties
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = hospitality_properties.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

CREATE POLICY "Public can view active properties" ON public.hospitality_properties
    FOR SELECT USING (status = 'active');

-- RLS Policies for room_types
CREATE POLICY "Property staff can manage room types" ON public.room_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = room_types.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

-- RLS Policies for rooms
CREATE POLICY "Property staff can manage rooms" ON public.rooms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = rooms.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

-- RLS Policies for bookings
CREATE POLICY "Customers can view their own bookings" ON public.bookings
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Property staff can manage bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = bookings.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

-- RLS Policies for menu_categories and menu_items
CREATE POLICY "Property staff can manage menu" ON public.menu_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = menu_categories.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

CREATE POLICY "Property staff can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = menu_items.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

-- RLS Policies for tours
CREATE POLICY "Property staff can manage tours" ON public.tours
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = tours.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

CREATE POLICY "Public can view active tours" ON public.tours
    FOR SELECT USING (is_active = TRUE);

-- RLS Policies for tour_bookings
CREATE POLICY "Customers can view their own tour bookings" ON public.tour_bookings
    FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Property staff can manage tour bookings" ON public.tour_bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.property_staff 
            WHERE property_id = tour_bookings.property_id 
            AND user_id = auth.uid() 
            AND is_active = TRUE
        )
    );

-- RLS Policies for property_staff
CREATE POLICY "Property owners can manage staff" ON public.property_staff
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.hospitality_properties 
            WHERE property_id = property_staff.property_id 
            AND owner_id = auth.uid()
        )
    );

-- RLS Policies for property_reviews
CREATE POLICY "Customers can manage their own reviews" ON public.property_reviews
    FOR ALL USING (customer_id = auth.uid());

CREATE POLICY "Public can view public reviews" ON public.property_reviews
    FOR SELECT USING (is_public = TRUE);

-- Create indexes for performance
CREATE INDEX idx_hospitality_properties_owner ON public.hospitality_properties(owner_id);
CREATE INDEX idx_hospitality_properties_status ON public.hospitality_properties(status);
CREATE INDEX idx_room_types_property ON public.room_types(property_id);
CREATE INDEX idx_rooms_property ON public.rooms(property_id);
CREATE INDEX idx_rooms_status ON public.rooms(status);
CREATE INDEX idx_bookings_property ON public.bookings(property_id);
CREATE INDEX idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_menu_items_property ON public.menu_items(property_id);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX idx_tours_property ON public.tours(property_id);
CREATE INDEX idx_tour_bookings_customer ON public.tour_bookings(customer_id);
CREATE INDEX idx_property_staff_property ON public.property_staff(property_id);
CREATE INDEX idx_property_reviews_property ON public.property_reviews(property_id);

-- Create updated_at triggers
CREATE TRIGGER update_hospitality_properties_updated_at
    BEFORE UPDATE ON public.hospitality_properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at
    BEFORE UPDATE ON public.room_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON public.rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at
    BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON public.tours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_bookings_updated_at
    BEFORE UPDATE ON public.tour_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_staff_updated_at
    BEFORE UPDATE ON public.property_staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_reviews_updated_at
    BEFORE UPDATE ON public.property_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
