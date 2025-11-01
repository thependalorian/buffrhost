-- =============================================================================
-- BUFFR HOST - ANALYTICS TABLES FOR ML
-- =============================================================================
-- Creates analytics and ML feature tables for data-driven hospitality insights
-- Includes revenue analytics, guest experience metrics, and ML training data

-- =============================================================================
-- 1. REVENUE ANALYTICS TABLES
-- =============================================================================

-- Revenue analytics table - Daily revenue tracking and forecasting
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

-- Guest experience metrics table - Customer satisfaction tracking
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
    survey_channel VARCHAR(50), -- 'email', 'sms', 'in_app', 'phone'
    survey_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. ML FEATURE TABLES
-- =============================================================================

-- Sofia AI Agents table - Conversational AI management
CREATE TABLE IF NOT EXISTS sofia_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    personality TEXT,
    configuration JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
    is_active BOOLEAN DEFAULT true,
    capabilities TEXT[], -- Array of AI capabilities
    training_data_size INTEGER DEFAULT 0,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    performance_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia conversations table - Chat history and training data
CREATE TABLE IF NOT EXISTS sofia_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES sofia_agents(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    session_id VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES crm_customers(id),
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    intent_classification VARCHAR(100),
    sentiment_score DECIMAL(3,2), -- -1 to 1 scale
    confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
    response_time_ms INTEGER,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    channel VARCHAR(50), -- 'website', 'mobile_app', 'voice'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ML model performance tracking table
CREATE TABLE IF NOT EXISTS ml_model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'regression', 'classification', 'clustering', 'forecasting'
    training_date TIMESTAMP WITH TIME ZONE NOT NULL,
    training_data_size INTEGER NOT NULL,
    performance_metrics JSONB NOT NULL,
    feature_importance JSONB,
    cross_validation_scores JSONB,
    is_active BOOLEAN DEFAULT true,
    deployment_status VARCHAR(20) DEFAULT 'testing' CHECK (deployment_status IN ('testing', 'staging', 'production', 'retired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ML predictions log table - Audit trail of predictions
CREATE TABLE IF NOT EXISTS ml_predictions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL, -- 'revenue_forecast', 'churn_prediction', 'recommendation'
    input_features JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    prediction_confidence DECIMAL(5,4),
    actual_outcome JSONB, -- Filled in later for evaluation
    feedback_received BOOLEAN DEFAULT false,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Revenue analytics indexes
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_tenant_id ON revenue_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_property_id ON revenue_analytics(property_id);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_created_at ON revenue_analytics(created_at);

-- Guest experience metrics indexes
CREATE INDEX IF NOT EXISTS idx_guest_experience_tenant_id ON guest_experience_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_guest_experience_booking_id ON guest_experience_metrics(booking_id);
CREATE INDEX IF NOT EXISTS idx_guest_experience_customer_id ON guest_experience_metrics(customer_id);
CREATE INDEX IF NOT EXISTS idx_guest_experience_overall_rating ON guest_experience_metrics(overall_rating);
CREATE INDEX IF NOT EXISTS idx_guest_experience_created_at ON guest_experience_metrics(created_at);

-- Sofia agents indexes
CREATE INDEX IF NOT EXISTS idx_sofia_agents_property_id ON sofia_agents(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_agents_tenant_id ON sofia_agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sofia_agents_status ON sofia_agents(status);
CREATE INDEX IF NOT EXISTS idx_sofia_agents_active ON sofia_agents(is_active);

-- Sofia conversations indexes
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_agent_id ON sofia_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_tenant_id ON sofia_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_session_id ON sofia_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_customer_id ON sofia_conversations(customer_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_created_at ON sofia_conversations(created_at);

-- ML model performance indexes
CREATE INDEX IF NOT EXISTS idx_ml_model_performance_tenant_id ON ml_model_performance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ml_model_performance_name ON ml_model_performance(model_name);
CREATE INDEX IF NOT EXISTS idx_ml_model_performance_type ON ml_model_performance(model_type);
CREATE INDEX IF NOT EXISTS idx_ml_model_performance_active ON ml_model_performance(is_active);

-- ML predictions log indexes
CREATE INDEX IF NOT EXISTS idx_ml_predictions_log_tenant_id ON ml_predictions_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_log_model_name ON ml_predictions_log(model_name);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_log_type ON ml_predictions_log(prediction_type);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_log_created_at ON ml_predictions_log(created_at);

-- =============================================================================
-- 4. ANALYTICS VIEWS
-- =============================================================================

-- Revenue trends view
CREATE OR REPLACE VIEW revenue_trends AS
SELECT
    tenant_id,
    property_id,
    DATE_TRUNC('month', date) as month,
    SUM(total_revenue) as monthly_revenue,
    AVG(occupancy_rate) as avg_monthly_occupancy,
    AVG(average_daily_rate) as avg_monthly_rate,
    AVG(revpar) as avg_monthly_revpar,
    SUM(total_bookings) as monthly_bookings,
    SUM(cancelled_bookings) as monthly_cancellations,
    CASE
        WHEN SUM(total_bookings) > 0
        THEN ROUND(SUM(cancelled_bookings)::decimal / SUM(total_bookings) * 100, 2)
        ELSE 0
    END as cancellation_rate
FROM revenue_analytics
GROUP BY tenant_id, property_id, DATE_TRUNC('month', date)
ORDER BY tenant_id, property_id, month DESC;

-- Guest satisfaction summary view
CREATE OR REPLACE VIEW guest_satisfaction_summary AS
SELECT
    tenant_id,
    property_id,
    COUNT(*) as total_reviews,
    AVG(overall_rating) as avg_overall_rating,
    AVG(check_in_rating) as avg_check_in_rating,
    AVG(room_rating) as avg_room_rating,
    AVG(service_rating) as avg_service_rating,
    AVG(cleanliness_rating) as avg_cleanliness_rating,
    AVG(value_rating) as avg_value_rating,
    AVG(recommendation_likelihood) as avg_nps_score,
    COUNT(CASE WHEN overall_rating >= 4 THEN 1 END) as satisfied_guests,
    ROUND(
        COUNT(CASE WHEN overall_rating >= 4 THEN 1 END)::decimal /
        COUNT(*)::decimal * 100, 2
    ) as satisfaction_rate
FROM guest_experience_metrics
WHERE overall_rating IS NOT NULL
GROUP BY tenant_id, property_id;

-- ML model performance summary view
CREATE OR REPLACE VIEW ml_model_performance_summary AS
SELECT
    tenant_id,
    model_name,
    model_type,
    COUNT(*) as total_versions,
    MAX(training_date) as latest_training,
    AVG((performance_metrics->>'accuracy')::decimal) as avg_accuracy,
    AVG((performance_metrics->>'precision')::decimal) as avg_precision,
    AVG((performance_metrics->>'recall')::decimal) as avg_recall,
    AVG((performance_metrics->>'f1_score')::decimal) as avg_f1_score,
    COUNT(CASE WHEN deployment_status = 'production' THEN 1 END) as production_models
FROM ml_model_performance
GROUP BY tenant_id, model_name, model_type
ORDER BY tenant_id, model_name;

-- Sofia AI performance view
CREATE OR REPLACE VIEW sofia_ai_performance AS
SELECT
    sa.id,
    sa.name,
    sa.property_id,
    p.name as property_name,
    sa.status,
    sa.training_data_size,
    sa.last_trained_at,
    COUNT(sc.id) as total_conversations,
    AVG(sc.sentiment_score) as avg_sentiment,
    AVG(sc.confidence_score) as avg_confidence,
    AVG(sc.feedback_rating) as avg_feedback_rating,
    AVG(sc.response_time_ms) as avg_response_time_ms
FROM sofia_agents sa
LEFT JOIN properties p ON sa.property_id = p.id
LEFT JOIN sofia_conversations sc ON sa.id = sc.agent_id
GROUP BY sa.id, sa.name, sa.property_id, p.name, sa.status, sa.training_data_size, sa.last_trained_at;

-- =============================================================================
-- 5. TRIGGERS FOR DATA INTEGRITY
-- =============================================================================

-- Function to update analytics updated_at timestamp
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS trigger_update_sofia_agents_updated_at ON sofia_agents;
CREATE TRIGGER trigger_update_sofia_agents_updated_at
    BEFORE UPDATE ON sofia_agents
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_updated_at();

-- Function to update ML model performance metrics
CREATE OR REPLACE FUNCTION update_ml_model_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update training data size in sofia_agents when conversations are added
    IF TG_TABLE_NAME = 'sofia_conversations' THEN
        UPDATE sofia_agents
        SET training_data_size = training_data_size + 1,
            updated_at = NOW()
        WHERE id = NEW.agent_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for conversation counting
DROP TRIGGER IF EXISTS trigger_update_conversation_count ON sofia_conversations;
CREATE TRIGGER trigger_update_conversation_count
    AFTER INSERT ON sofia_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_ml_model_metrics();

-- =============================================================================
-- 6. SAMPLE DATA FOR TESTING
-- =============================================================================

-- Insert sample revenue analytics data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM revenue_analytics LIMIT 1) THEN
        INSERT INTO revenue_analytics (
            tenant_id, property_id, date, total_revenue, room_revenue, fnb_revenue,
            occupancy_rate, average_daily_rate, revpar, total_bookings, cancelled_bookings
        )
        SELECT
            t.id,
            p.id,
            CURRENT_DATE - INTERVAL '30 days' * (random() * 90)::int,
            5000 + random() * 15000,
            3000 + random() * 10000,
            1000 + random() * 4000,
            random() * 0.9 + 0.1, -- 0.1 to 1.0
            800 + random() * 1200,
            400 + random() * 800,
            (5 + random() * 20)::int,
            (random() * 3)::int
        FROM tenants t
        CROSS JOIN properties p
        LIMIT 100;
    END IF;
END $$;

-- Insert sample guest experience metrics
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM guest_experience_metrics LIMIT 1) THEN
        INSERT INTO guest_experience_metrics (
            tenant_id, customer_id, overall_rating, check_in_rating, room_rating,
            service_rating, cleanliness_rating, value_rating, recommendation_likelihood,
            survey_channel, survey_completed_at
        )
        SELECT
            c.tenant_id,
            c.id,
            (3 + random() * 2)::int, -- 3-5 rating
            (3 + random() * 2)::int,
            (3 + random() * 2)::int,
            (3 + random() * 2)::int,
            (3 + random() * 2)::int,
            (3 + random() * 2)::int,
            (6 + random() * 4)::int, -- 6-10 NPS
            CASE
                WHEN random() < 0.5 THEN 'email'
                WHEN random() < 0.8 THEN 'sms'
                ELSE 'in_app'
            END,
            NOW() - INTERVAL '7 days' * random()
        FROM crm_customers c
        WHERE random() < 0.3 -- Only 30% of customers leave reviews
        LIMIT 50;
    END IF;
END $$;

-- Insert sample Sofia AI agents
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM sofia_agents LIMIT 1) THEN
        INSERT INTO sofia_agents (
            property_id, tenant_id, name, personality, capabilities,
            training_data_size, last_trained_at
        )
        SELECT
            p.id,
            p.tenant_id,
            'Sofia ' || p.name,
            'Professional and friendly hospitality assistant',
            ARRAY['booking_assistance', 'recommendations', 'complaint_handling', 'information'],
            (100 + random() * 900)::int,
            NOW() - INTERVAL '7 days' * random()
        FROM properties p
        LIMIT 5;
    END IF;
END $$;

-- =============================================================================
-- 7. PERMISSIONS
-- =============================================================================

-- Grant permissions for analytics views
GRANT SELECT ON revenue_trends TO PUBLIC;
GRANT SELECT ON guest_satisfaction_summary TO PUBLIC;
GRANT SELECT ON ml_model_performance_summary TO PUBLIC;
GRANT SELECT ON sofia_ai_performance TO PUBLIC;

-- =============================================================================
-- 8. DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE revenue_analytics IS 'Daily revenue tracking and performance metrics for ML forecasting';
COMMENT ON TABLE guest_experience_metrics IS 'Customer satisfaction surveys and feedback for ML training';
COMMENT ON TABLE sofia_agents IS 'AI conversational agents for hospitality automation';
COMMENT ON TABLE sofia_conversations IS 'Chat history and training data for AI model improvement';
COMMENT ON TABLE ml_model_performance IS 'ML model performance tracking and version control';
COMMENT ON TABLE ml_predictions_log IS 'Audit trail of ML predictions for compliance and debugging';
COMMENT ON VIEW revenue_trends IS 'Monthly revenue trends and KPI analysis';
COMMENT ON VIEW guest_satisfaction_summary IS 'Customer satisfaction metrics and NPS tracking';
COMMENT ON VIEW ml_model_performance_summary IS 'ML model performance across versions and types';
COMMENT ON VIEW sofia_ai_performance IS 'AI agent performance and conversation analytics';

-- =============================================================================
-- ANALYTICS TABLES MIGRATION COMPLETE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Analytics tables migration completed successfully!';
    RAISE NOTICE 'Created tables: revenue_analytics, guest_experience_metrics, sofia_agents, sofia_conversations, ml_model_performance, ml_predictions_log';
    RAISE NOTICE 'Created comprehensive analytics views for business intelligence';
    RAISE NOTICE 'Added automated data integrity triggers';
    RAISE NOTICE 'Inserted sample data for testing ML models';
END $$;
