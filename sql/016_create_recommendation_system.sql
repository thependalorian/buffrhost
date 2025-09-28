-- Recommendation System Tables
-- Supports AI/ML recommendation engine for personalized content

-- User preferences and interactions
CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'room', 'tour', 'service', 'menu_item'
    action VARCHAR(50) NOT NULL, -- 'like', 'unlike', 'view', 'book', 'share'
    preference_score DECIMAL(3,2) DEFAULT 0.0, -- -1.0 to 1.0
    context_data JSONB, -- Additional context like device, location, time
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT unique_user_item_action UNIQUE (user_id, item_id, action),
    CONSTRAINT valid_preference_score CHECK (preference_score >= -1.0 AND preference_score <= 1.0),
    CONSTRAINT valid_item_type CHECK (item_type IN ('room', 'tour', 'service', 'menu_item', 'facility')),
    CONSTRAINT valid_action CHECK (action IN ('like', 'unlike', 'view', 'book', 'share', 'click', 'hover'))
);

-- Recommendation cache for performance
CREATE TABLE IF NOT EXISTS recommendation_cache (
    cache_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL, -- 'personalized', 'trending', 'similar'
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    recommendation_score DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    confidence_score DECIMAL(5,4) DEFAULT 0.0,
    algorithm_version VARCHAR(20) DEFAULT 'v1.0',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    
    CONSTRAINT valid_recommendation_score CHECK (recommendation_score >= 0.0 AND recommendation_score <= 1.0),
    CONSTRAINT valid_confidence_score CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0)
);

-- User behavior analytics
CREATE TABLE IF NOT EXISTS user_behavior_analytics (
    behavior_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_id VARCHAR(255),
    page_path VARCHAR(500) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- 'page_view', 'button_click', 'form_submit', 'search'
    action_data JSONB, -- Additional action-specific data
    user_agent TEXT,
    ip_address INET,
    referrer VARCHAR(500),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_action_type CHECK (action_type IN (
        'page_view', 'button_click', 'form_submit', 'search', 'filter', 
        'sort', 'share', 'bookmark', 'download', 'video_play'
    ))
);

-- Booking inquiries and quotes
CREATE TABLE IF NOT EXISTS booking_inquiries (
    inquiry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'room', 'tour', 'service'
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    preferred_date DATE,
    check_out_date DATE, -- For room bookings
    number_of_people INTEGER DEFAULT 1,
    special_requests TEXT,
    inquiry_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'contacted', 'quoted', 'booked', 'cancelled'
    assigned_staff_id UUID,
    response_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_item_type_inquiry CHECK (item_type IN ('room', 'tour', 'service')),
    CONSTRAINT valid_inquiry_status CHECK (inquiry_status IN ('pending', 'contacted', 'quoted', 'booked', 'cancelled')),
    CONSTRAINT valid_number_of_people CHECK (number_of_people > 0)
);

-- User favorites/wishlist
CREATE TABLE IF NOT EXISTS user_favorites (
    favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    item_id VARCHAR(255) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    property_id UUID NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_favorite UNIQUE (user_id, item_id),
    CONSTRAINT valid_favorite_item_type CHECK (item_type IN ('room', 'tour', 'service', 'menu_item'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_item_type ON user_preferences(item_type);
CREATE INDEX IF NOT EXISTS idx_user_preferences_action ON user_preferences(action);
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON user_preferences(created_at);

CREATE INDEX IF NOT EXISTS idx_recommendation_cache_user_id ON recommendation_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_type ON recommendation_cache(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_expires ON recommendation_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_recommendation_cache_score ON recommendation_cache(recommendation_score DESC);

CREATE INDEX IF NOT EXISTS idx_behavior_analytics_user_id ON user_behavior_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_session_id ON user_behavior_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_timestamp ON user_behavior_analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_behavior_analytics_action_type ON user_behavior_analytics(action_type);

CREATE INDEX IF NOT EXISTS idx_booking_inquiries_property_id ON booking_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_status ON booking_inquiries(inquiry_status);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_created_at ON booking_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_item_type ON booking_inquiries(item_type);

CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_item_type ON user_favorites(item_type);
CREATE INDEX IF NOT EXISTS idx_user_favorites_property_id ON user_favorites(property_id);

-- Functions for recommendation system

-- Function to record user preference
CREATE OR REPLACE FUNCTION record_user_preference(
    p_user_id UUID,
    p_item_id VARCHAR(255),
    p_item_type VARCHAR(50),
    p_action VARCHAR(50),
    p_score DECIMAL(3,2) DEFAULT NULL,
    p_context JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_preference_id UUID;
BEGIN
    -- Calculate score if not provided
    IF p_score IS NULL THEN
        CASE p_action
            WHEN 'like' THEN p_score := 1.0;
            WHEN 'unlike' THEN p_score := -1.0;
            WHEN 'book' THEN p_score := 0.8;
            WHEN 'view' THEN p_score := 0.3;
            WHEN 'share' THEN p_score := 0.6;
            ELSE p_score := 0.0;
        END CASE;
    END IF;
    
    -- Insert or update preference
    INSERT INTO user_preferences (user_id, item_id, item_type, action, preference_score, context_data)
    VALUES (p_user_id, p_item_id, p_item_type, p_action, p_score, p_context)
    ON CONFLICT (user_id, item_id, action) 
    DO UPDATE SET 
        preference_score = EXCLUDED.preference_score,
        context_data = EXCLUDED.context_data,
        updated_at = NOW()
    RETURNING preference_id INTO v_preference_id;
    
    RETURN v_preference_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user recommendations
CREATE OR REPLACE FUNCTION get_user_recommendations(
    p_user_id UUID,
    p_item_type VARCHAR(50) DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    item_id VARCHAR(255),
    item_type VARCHAR(50),
    recommendation_score DECIMAL(5,4),
    confidence_score DECIMAL(5,4),
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rc.item_id,
        rc.item_type,
        rc.recommendation_score,
        rc.confidence_score,
        CASE 
            WHEN rc.recommendation_score > 0.8 THEN 'Highly recommended based on your preferences'
            WHEN rc.recommendation_score > 0.6 THEN 'Recommended based on similar users'
            WHEN rc.recommendation_score > 0.4 THEN 'You might like this'
            ELSE 'Popular choice'
        END as reason
    FROM recommendation_cache rc
    WHERE rc.user_id = p_user_id
        AND (p_item_type IS NULL OR rc.item_type = p_item_type)
        AND rc.expires_at > NOW()
    ORDER BY rc.recommendation_score DESC, rc.confidence_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to add/remove favorite
CREATE OR REPLACE FUNCTION toggle_user_favorite(
    p_user_id UUID,
    p_item_id VARCHAR(255),
    p_item_type VARCHAR(50),
    p_property_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Check if favorite exists
    SELECT EXISTS(
        SELECT 1 FROM user_favorites 
        WHERE user_id = p_user_id AND item_id = p_item_id
    ) INTO v_exists;
    
    IF v_exists THEN
        -- Remove favorite
        DELETE FROM user_favorites 
        WHERE user_id = p_user_id AND item_id = p_item_id;
        RETURN FALSE;
    ELSE
        -- Add favorite
        INSERT INTO user_favorites (user_id, item_id, item_type, property_id)
        VALUES (p_user_id, p_item_id, p_item_type, p_property_id);
        RETURN TRUE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to record user behavior
CREATE OR REPLACE FUNCTION record_user_behavior(
    p_user_id UUID,
    p_session_id VARCHAR(255),
    p_page_path VARCHAR(500),
    p_action_type VARCHAR(100),
    p_action_data JSONB DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_referrer VARCHAR(500) DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_behavior_id UUID;
BEGIN
    INSERT INTO user_behavior_analytics (
        user_id, session_id, page_path, action_type, action_data,
        user_agent, ip_address, referrer
    ) VALUES (
        p_user_id, p_session_id, p_page_path, p_action_type, p_action_data,
        p_user_agent, p_ip_address, p_referrer
    ) RETURNING behavior_id INTO v_behavior_id;
    
    RETURN v_behavior_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- User preferences policies
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (user_id = auth.uid());

-- Recommendation cache policies
CREATE POLICY "Users can view own recommendations" ON recommendation_cache
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can insert recommendations" ON recommendation_cache
    FOR INSERT WITH CHECK (true); -- Service role can insert

-- Behavior analytics policies
CREATE POLICY "Users can view own behavior" ON user_behavior_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own behavior" ON user_behavior_analytics
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Booking inquiries policies
CREATE POLICY "Users can view own inquiries" ON booking_inquiries
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert inquiries" ON booking_inquiries
    FOR INSERT WITH CHECK (true); -- Allow anonymous inquiries

CREATE POLICY "Staff can update inquiries" ON booking_inquiries
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND user_role IN ('admin', 'manager', 'staff')
        )
    );

-- User favorites policies
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own favorites" ON user_favorites
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own favorites" ON user_favorites
    FOR DELETE USING (user_id = auth.uid());

-- Triggers for updated_at
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_inquiries_updated_at
    BEFORE UPDATE ON booking_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Cleanup function for expired recommendations
CREATE OR REPLACE FUNCTION cleanup_expired_recommendations()
RETURNS INTEGER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM recommendation_cache 
    WHERE expires_at < NOW();
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_preferences TO authenticated;
GRANT SELECT ON recommendation_cache TO authenticated;
GRANT INSERT ON recommendation_cache TO service_role;
GRANT SELECT, INSERT ON user_behavior_analytics TO authenticated;
GRANT SELECT, INSERT ON booking_inquiries TO authenticated;
GRANT SELECT, INSERT, UPDATE ON booking_inquiries TO service_role;
GRANT SELECT, INSERT, DELETE ON user_favorites TO authenticated;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION record_user_preference TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_recommendations TO authenticated;
GRANT EXECUTE ON FUNCTION toggle_user_favorite TO authenticated;
GRANT EXECUTE ON FUNCTION record_user_behavior TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_recommendations TO service_role;