-- Loyalty System
-- Cross-business loyalty points and rewards management

-- Cross Business Loyalty
CREATE TABLE CrossBusinessLoyalty (
    loyalty_id SERIAL PRIMARY KEY,
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    tier_level VARCHAR(50) DEFAULT 'bronze',
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

-- Loyalty Transactions
CREATE TABLE LoyaltyTransaction (
    transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    points_amount INTEGER NOT NULL,
    service_type VARCHAR(50),
    order_id UUID REFERENCES "Order"(order_id),
    booking_id UUID REFERENCES ServiceBooking(booking_id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Rewards
CREATE TABLE LoyaltyReward (
    reward_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    reward_name VARCHAR(255) NOT NULL,
    reward_description TEXT,
    points_required INTEGER NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Loyalty Redemptions
CREATE TABLE LoyaltyRedemption (
    redemption_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    reward_id INTEGER REFERENCES LoyaltyReward(reward_id),
    points_used INTEGER NOT NULL,
    redemption_status VARCHAR(50) DEFAULT 'pending',
    redeemed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE TRIGGER update_cross_business_loyalty_updated_at 
    BEFORE UPDATE ON CrossBusinessLoyalty 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_reward_updated_at 
    BEFORE UPDATE ON LoyaltyReward 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
