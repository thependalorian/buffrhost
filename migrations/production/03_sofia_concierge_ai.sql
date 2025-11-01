-- =============================================================================
-- BUFFR HOST - SOFIA CONCIERGE AI INTEGRATION
-- =============================================================================
-- Phase 2: Sofia Concierge AI Integration
-- Intelligent recommendations, predictive analytics, and smart reservation management

-- =============================================================================
-- 1. SOFIA RECOMMENDATIONS SYSTEM
-- =============================================================================

-- Sofia AI recommendations table
CREATE TABLE IF NOT EXISTS sofia_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL CHECK (recommendation_type IN ('availability', 'service', 'upsell', 'timing', 'personalization')),
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('inventory', 'service', 'table', 'room', 'package')),
    target_id UUID NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
    recommendation_data JSONB NOT NULL,
    reasoning TEXT,
    is_accepted BOOLEAN DEFAULT NULL,
    feedback_score INTEGER CHECK (feedback_score BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Indexes will be created separately
);

-- Sofia learning data table for guest behavior analysis
CREATE TABLE IF NOT EXISTS sofia_learning_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('preference', 'behavior', 'feedback', 'interaction', 'booking', 'dining')),
    data_category VARCHAR(50) NOT NULL CHECK (data_category IN ('dining', 'spa', 'room', 'service', 'timing', 'pricing', 'amenities')),
    data_key VARCHAR(100) NOT NULL,
    data_value JSONB NOT NULL,
    confidence_level DECIMAL(3,2) NOT NULL CHECK (confidence_level >= 0.00 AND confidence_level <= 1.00),
    source VARCHAR(50) NOT NULL CHECK (source IN ('booking', 'order', 'feedback', 'interaction', 'survey', 'analytics')),
    weight DECIMAL(3,2) DEFAULT 1.00 CHECK (weight >= 0.00 AND weight <= 1.00),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes will be created separately
);

-- Sofia analytics table for predictive insights
CREATE TABLE IF NOT EXISTS sofia_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    analysis_type VARCHAR(50) NOT NULL CHECK (analysis_type IN ('demand_forecast', 'capacity_optimization', 'guest_insights', 'revenue_optimization', 'trend_analysis')),
    analysis_period VARCHAR(20) NOT NULL CHECK (analysis_period IN ('hourly', 'daily', 'weekly', 'monthly', 'quarterly')),
    analysis_date DATE NOT NULL,
    analysis_data JSONB NOT NULL,
    accuracy_score DECIMAL(3,2) CHECK (accuracy_score >= 0.00 AND accuracy_score <= 1.00),
    prediction_horizon INTEGER, -- days ahead for forecasts
    model_version VARCHAR(20) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes will be created separately
);

-- Sofia notifications table for AI-driven alerts
CREATE TABLE IF NOT EXISTS sofia_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('recommendation', 'alert', 'reminder', 'update', 'insight', 'opportunity')),
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_required BOOLEAN DEFAULT false,
    action_data JSONB,
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes will be created separately
);

-- =============================================================================
-- 1.1. SOFIA RECOMMENDATIONS INDEXES
-- =============================================================================

-- Sofia recommendations indexes
CREATE INDEX IF NOT EXISTS idx_sofia_recommendations_property_guest ON sofia_recommendations(property_id, guest_id);
CREATE INDEX IF NOT EXISTS idx_sofia_recommendations_type ON sofia_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_sofia_recommendations_active ON sofia_recommendations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sofia_recommendations_confidence ON sofia_recommendations(confidence_score) WHERE confidence_score > 0.7;

-- Sofia learning data indexes
CREATE INDEX IF NOT EXISTS idx_sofia_learning_guest ON sofia_learning_data(guest_id);
CREATE INDEX IF NOT EXISTS idx_sofia_learning_property ON sofia_learning_data(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_learning_type_category ON sofia_learning_data(data_type, data_category);
CREATE INDEX IF NOT EXISTS idx_sofia_learning_confidence ON sofia_learning_data(confidence_level) WHERE confidence_level > 0.5;

-- Sofia analytics indexes
CREATE INDEX IF NOT EXISTS idx_sofia_analytics_property ON sofia_analytics(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_analytics_type ON sofia_analytics(analysis_type);
CREATE INDEX IF NOT EXISTS idx_sofia_analytics_date ON sofia_analytics(analysis_date);
CREATE INDEX IF NOT EXISTS idx_sofia_analytics_accuracy ON sofia_analytics(accuracy_score) WHERE accuracy_score > 0.8;

-- Sofia notifications indexes
CREATE INDEX IF NOT EXISTS idx_sofia_notifications_guest ON sofia_notifications(guest_id);
CREATE INDEX IF NOT EXISTS idx_sofia_notifications_property ON sofia_notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_notifications_unread ON sofia_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_sofia_notifications_priority ON sofia_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_sofia_notifications_type ON sofia_notifications(notification_type);

-- =============================================================================
-- 2. SOFIA AI MODELS AND CONFIGURATION
-- =============================================================================

-- Sofia AI model configuration table
CREATE TABLE IF NOT EXISTS sofia_ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50) NOT NULL CHECK (model_type IN ('recommendation', 'forecasting', 'classification', 'clustering', 'optimization')),
    model_version VARCHAR(20) NOT NULL,
    model_config JSONB NOT NULL,
    training_data_size INTEGER,
    accuracy_score DECIMAL(3,2),
    is_active BOOLEAN DEFAULT true,
    last_trained TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(property_id, model_name, model_version),
    INDEX idx_sofia_models_property (property_id),
    INDEX idx_sofia_models_type (model_type),
    INDEX idx_sofia_models_active (is_active) WHERE is_active = true
);

-- Sofia AI learning sessions table
CREATE TABLE IF NOT EXISTS sofia_learning_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('training', 'validation', 'testing', 'inference')),
    model_id UUID REFERENCES sofia_ai_models(id) ON DELETE CASCADE,
    session_data JSONB NOT NULL,
    performance_metrics JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_sessions_property (property_id),
    INDEX idx_sofia_sessions_model (model_id),
    INDEX idx_sofia_sessions_status (status),
    INDEX idx_sofia_sessions_type (session_type)
);

-- =============================================================================
-- 3. SOFIA GUEST PROFILES AND PREFERENCES
-- =============================================================================

-- Enhanced guest profiles with AI insights
CREATE TABLE IF NOT EXISTS sofia_guest_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    profile_data JSONB NOT NULL,
    preference_score DECIMAL(3,2) DEFAULT 0.00,
    behavior_patterns JSONB,
    ai_insights JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(guest_id, property_id),
    INDEX idx_sofia_profiles_guest (guest_id),
    INDEX idx_sofia_profiles_property (property_id),
    INDEX idx_sofia_profiles_score (preference_score) WHERE preference_score > 0.5
);

-- Sofia guest interaction tracking
CREATE TABLE IF NOT EXISTS sofia_guest_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('booking', 'dining', 'spa', 'service', 'feedback', 'recommendation', 'search')),
    interaction_data JSONB NOT NULL,
    ai_processed BOOLEAN DEFAULT false,
    insights_generated JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_interactions_guest (guest_id),
    INDEX idx_sofia_interactions_property (property_id),
    INDEX idx_sofia_interactions_type (interaction_type),
    INDEX idx_sofia_interactions_processed (ai_processed) WHERE ai_processed = false
);

-- =============================================================================
-- 4. SOFIA SMART RESERVATION SYSTEM
-- =============================================================================

-- Sofia smart reservation optimization
CREATE TABLE IF NOT EXISTS sofia_smart_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reservation_type VARCHAR(50) NOT NULL CHECK (reservation_type IN ('table', 'room', 'service', 'package')),
    original_request JSONB NOT NULL,
    ai_optimized_request JSONB NOT NULL,
    optimization_reasoning TEXT,
    confidence_score DECIMAL(3,2) NOT NULL,
    is_accepted BOOLEAN DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_smart_reservations_guest (guest_id),
    INDEX idx_sofia_smart_reservations_property (property_id),
    INDEX idx_sofia_smart_reservations_type (reservation_type),
    INDEX idx_sofia_smart_reservations_confidence (confidence_score) WHERE confidence_score > 0.7
);

-- Sofia conflict resolution tracking
CREATE TABLE IF NOT EXISTS sofia_conflict_resolutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL CHECK (conflict_type IN ('double_booking', 'capacity_exceeded', 'timing_conflict', 'resource_unavailable')),
    conflicting_reservations JSONB NOT NULL,
    resolution_strategy VARCHAR(50) NOT NULL,
    resolution_data JSONB NOT NULL,
    resolution_success BOOLEAN NOT NULL,
    ai_confidence DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_conflicts_property (property_id),
    INDEX idx_sofia_conflicts_type (conflict_type),
    INDEX idx_sofia_conflicts_success (resolution_success) WHERE resolution_success = true
);

-- =============================================================================
-- 5. SOFIA PERFORMANCE MONITORING
-- =============================================================================

-- Sofia AI performance metrics
CREATE TABLE IF NOT EXISTS sofia_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('recommendation_accuracy', 'forecast_accuracy', 'learning_effectiveness', 'response_time', 'user_satisfaction')),
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(20),
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) NOT NULL,
    additional_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_metrics_property (property_id),
    INDEX idx_sofia_metrics_type (metric_type),
    INDEX idx_sofia_metrics_date (measurement_date)
);

-- Sofia system health monitoring
CREATE TABLE IF NOT EXISTS sofia_system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    component VARCHAR(50) NOT NULL CHECK (component IN ('ai_engine', 'recommendation_system', 'learning_system', 'analytics_engine', 'notification_system')),
    health_status VARCHAR(20) NOT NULL CHECK (health_status IN ('healthy', 'degraded', 'unhealthy', 'offline')),
    performance_score DECIMAL(3,2) NOT NULL,
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    health_data JSONB,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX idx_sofia_health_property (property_id),
    INDEX idx_sofia_health_component (component),
    INDEX idx_sofia_health_status (health_status) WHERE health_status != 'healthy'
);

-- =============================================================================
-- 6. TRIGGERS AND FUNCTIONS
-- =============================================================================

-- Function to update guest profile when new learning data is added
CREATE OR REPLACE FUNCTION update_sofia_guest_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Update guest profile with new learning data
    INSERT INTO sofia_guest_profiles (guest_id, property_id, profile_data, last_updated)
    VALUES (NEW.guest_id, NEW.property_id, 
            jsonb_build_object(
                'last_interaction', NEW.created_at,
                'interaction_type', NEW.interaction_type,
                'data_category', NEW.data_category
            ),
            NOW())
    ON CONFLICT (guest_id, property_id) 
    DO UPDATE SET
        profile_data = sofia_guest_profiles.profile_data || jsonb_build_object(
            'last_interaction', NEW.created_at,
            'interaction_type', NEW.interaction_type,
            'data_category', NEW.data_category
        ),
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update guest profile on new interactions
CREATE TRIGGER trigger_update_sofia_guest_profile
    AFTER INSERT ON sofia_guest_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_sofia_guest_profile();

-- Function to clean up expired recommendations
CREATE OR REPLACE FUNCTION cleanup_expired_recommendations()
RETURNS void AS $$
BEGIN
    UPDATE sofia_recommendations 
    SET is_active = false 
    WHERE expires_at < NOW() 
    AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate recommendation confidence score
CREATE OR REPLACE FUNCTION calculate_recommendation_confidence(
    guest_id_param UUID,
    property_id_param UUID,
    recommendation_type_param VARCHAR(50)
) RETURNS DECIMAL(3,2) AS $$
DECLARE
    confidence_score DECIMAL(3,2) := 0.5; -- Base confidence
    guest_interaction_count INTEGER;
    guest_preference_score DECIMAL(3,2);
    historical_acceptance_rate DECIMAL(3,2);
BEGIN
    -- Count guest interactions
    SELECT COUNT(*) INTO guest_interaction_count
    FROM sofia_guest_interactions
    WHERE guest_id = guest_id_param 
    AND property_id = property_id_param;
    
    -- Get guest preference score
    SELECT preference_score INTO guest_preference_score
    FROM sofia_guest_profiles
    WHERE guest_id = guest_id_param 
    AND property_id = property_id_param;
    
    -- Calculate historical acceptance rate
    SELECT COALESCE(
        AVG(CASE WHEN is_accepted = true THEN 1.0 ELSE 0.0 END), 
        0.5
    ) INTO historical_acceptance_rate
    FROM sofia_recommendations
    WHERE guest_id = guest_id_param 
    AND property_id = property_id_param
    AND recommendation_type = recommendation_type_param;
    
    -- Calculate confidence score
    confidence_score := LEAST(0.95, 
        0.3 + -- Base confidence
        (LEAST(guest_interaction_count, 10) * 0.05) + -- Interaction bonus
        (COALESCE(guest_preference_score, 0.5) * 0.3) + -- Preference bonus
        (historical_acceptance_rate * 0.35) -- Historical acceptance bonus
    );
    
    RETURN confidence_score;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 7. VIEWS FOR EASY QUERYING
-- =============================================================================

-- Sofia recommendations summary view
CREATE OR REPLACE VIEW sofia_recommendations_summary AS
SELECT 
    sr.id,
    sr.property_id,
    p.name as property_name,
    sr.guest_id,
    u.username as guest_name,
    sr.recommendation_type,
    sr.target_type,
    sr.confidence_score,
    sr.is_accepted,
    sr.feedback_score,
    sr.created_at,
    sr.expires_at,
    sr.is_active
FROM sofia_recommendations sr
JOIN properties p ON sr.property_id = p.id
JOIN users u ON sr.guest_id = u.id;

-- Sofia guest insights view
CREATE OR REPLACE VIEW sofia_guest_insights AS
SELECT 
    sgp.guest_id,
    sgp.property_id,
    u.username as guest_name,
    sgp.preference_score,
    COUNT(sgi.id) as total_interactions,
    COUNT(sr.id) as total_recommendations,
    AVG(sr.feedback_score) as avg_feedback_score,
    AVG(CASE WHEN sr.is_accepted = true THEN 1.0 ELSE 0.0 END) as acceptance_rate,
    sgp.last_updated
FROM sofia_guest_profiles sgp
JOIN users u ON sgp.guest_id = u.id
LEFT JOIN sofia_guest_interactions sgi ON sgp.guest_id = sgi.guest_id AND sgp.property_id = sgi.property_id
LEFT JOIN sofia_recommendations sr ON sgp.guest_id = sr.guest_id AND sgp.property_id = sr.property_id
GROUP BY sgp.guest_id, sgp.property_id, u.username, sgp.preference_score, sgp.last_updated;

-- Sofia analytics summary view
CREATE OR REPLACE VIEW sofia_analytics_summary AS
SELECT 
    sa.property_id,
    p.name as property_name,
    sa.analysis_type,
    sa.analysis_period,
    sa.analysis_date,
    sa.accuracy_score,
    sa.prediction_horizon,
    sa.model_version,
    sa.created_at
FROM sofia_analytics sa
JOIN properties p ON sa.property_id = p.id;

-- Sofia performance metrics view
CREATE OR REPLACE VIEW sofia_performance_summary AS
SELECT 
    spm.property_id,
    p.name as property_name,
    spm.metric_type,
    AVG(spm.metric_value) as avg_metric_value,
    MAX(spm.metric_value) as max_metric_value,
    MIN(spm.metric_value) as min_metric_value,
    COUNT(*) as measurement_count,
    MAX(spm.measurement_date) as latest_measurement
FROM sofia_performance_metrics spm
JOIN properties p ON spm.property_id = p.id
GROUP BY spm.property_id, p.name, spm.metric_type;

-- =============================================================================
-- 8. INITIAL DATA POPULATION
-- =============================================================================

-- Insert default Sofia AI models
INSERT INTO sofia_ai_models (property_id, model_name, model_type, model_version, model_config, is_active)
SELECT 
    p.id,
    'recommendation_engine_v1',
    'recommendation',
    '1.0',
    '{"algorithm": "collaborative_filtering", "min_confidence": 0.6, "max_recommendations": 10}',
    true
FROM properties p
WHERE p.property_type IN ('hotel', 'restaurant');

INSERT INTO sofia_ai_models (property_id, model_name, model_type, model_version, model_config, is_active)
SELECT 
    p.id,
    'demand_forecast_v1',
    'forecasting',
    '1.0',
    '{"algorithm": "time_series", "forecast_horizon": 30, "seasonality": true}',
    true
FROM properties p
WHERE p.property_type IN ('hotel', 'restaurant');

-- Insert default system health records
INSERT INTO sofia_system_health (property_id, component, health_status, performance_score)
SELECT 
    p.id,
    'ai_engine',
    'healthy',
    1.0
FROM properties p
WHERE p.property_type IN ('hotel', 'restaurant');

-- =============================================================================
-- 9. COMMENTS AND DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE sofia_recommendations IS 'Sofia AI recommendations for guests with confidence scoring and feedback tracking';
COMMENT ON TABLE sofia_learning_data IS 'Guest behavior and preference data for AI learning and personalization';
COMMENT ON TABLE sofia_analytics IS 'Predictive analytics and insights generated by Sofia AI';
COMMENT ON TABLE sofia_notifications IS 'AI-driven notifications and alerts for guests and staff';
COMMENT ON TABLE sofia_ai_models IS 'Configuration and metadata for Sofia AI models';
COMMENT ON TABLE sofia_learning_sessions IS 'AI model training and validation sessions';
COMMENT ON TABLE sofia_guest_profiles IS 'Enhanced guest profiles with AI-generated insights';
COMMENT ON TABLE sofia_guest_interactions IS 'Guest interaction tracking for AI learning';
COMMENT ON TABLE sofia_smart_reservations IS 'AI-optimized reservation suggestions';
COMMENT ON TABLE sofia_conflict_resolutions IS 'AI-powered conflict resolution tracking';
COMMENT ON TABLE sofia_performance_metrics IS 'Sofia AI system performance monitoring';
COMMENT ON TABLE sofia_system_health IS 'Real-time Sofia AI system health monitoring';

COMMENT ON COLUMN sofia_recommendations.confidence_score IS 'AI confidence score for recommendation (0.00 to 1.00)';
COMMENT ON COLUMN sofia_recommendations.is_accepted IS 'Whether guest accepted the recommendation (NULL = not responded)';
COMMENT ON COLUMN sofia_recommendations.feedback_score IS 'Guest feedback score (1-5) on recommendation quality';
COMMENT ON COLUMN sofia_learning_data.confidence_level IS 'Confidence level of the learning data (0.00 to 1.00)';
COMMENT ON COLUMN sofia_learning_data.weight IS 'Weight of this data point in learning algorithms (0.00 to 1.00)';
COMMENT ON COLUMN sofia_analytics.accuracy_score IS 'Accuracy score of the analysis (0.00 to 1.00)';
COMMENT ON COLUMN sofia_analytics.prediction_horizon IS 'Number of days ahead for forecasts';
COMMENT ON COLUMN sofia_guest_profiles.preference_score IS 'Overall preference confidence score (0.00 to 1.00)';
COMMENT ON COLUMN sofia_smart_reservations.confidence_score IS 'AI confidence in optimization suggestion (0.00 to 1.00)';
COMMENT ON COLUMN sofia_conflict_resolutions.ai_confidence IS 'AI confidence in conflict resolution (0.00 to 1.00)';