CREATE TABLE IF NOT EXISTS revenue_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    date DATE NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    room_revenue DECIMAL(12,2) DEFAULT 0,
    fnb_revenue DECIMAL(12,2) DEFAULT 0,
    other_revenue DECIMAL(12,2) DEFAULT 0,
    occupancy_rate DECIMAL(5,4), -- 0.0000 to 1.0000
    average_daily_rate DECIMAL(8,2),
    revpar DECIMAL(8,2), -- Revenue Per Available Room
    total_bookings INTEGER DEFAULT 0,
    cancelled_bookings INTEGER DEFAULT 0,
    no_show_bookings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guest_experience_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    booking_id UUID REFERENCES bookings(id),
    customer_id UUID REFERENCES crm_customers(id),
    check_in_rating INTEGER CHECK (check_in_rating BETWEEN 1 AND 5),
    room_rating INTEGER CHECK (room_rating BETWEEN 1 AND 5),
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    comments TEXT,
    recommendation_likelihood INTEGER CHECK (recommendation_likelihood BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);