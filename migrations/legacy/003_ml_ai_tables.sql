-- =====================================================
-- ML/AI System Tables Migration
-- Buffr Host Platform - AI/ML Infrastructure
-- =====================================================

-- =====================================================
-- 1. CREDIT SCORING TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS credit_scores (
    id SERIAL PRIMARY KEY,
    business_id UUID NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    features JSONB NOT NULL,
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version VARCHAR(50) DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_performance (
    id SERIAL PRIMARY KEY,
    model_version VARCHAR(50) NOT NULL,
    accuracy DECIMAL(5,4) NOT NULL,
    precision_score DECIMAL(5,4) NOT NULL,
    recall_score DECIMAL(5,4) NOT NULL,
    f1_score DECIMAL(5,4) NOT NULL,
    auc_score DECIMAL(5,4) NOT NULL,
    fairness_metrics JSONB,
    evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. FRAUD DETECTION TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100),
    user_id UUID,
    fraud_score DECIMAL(5,4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    detection_method VARCHAR(100) NOT NULL,
    features JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS fraud_patterns (
    id SERIAL PRIMARY KEY,
    pattern_type VARCHAR(50) NOT NULL,
    pattern_data JSONB NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- 3. CUSTOMER SEGMENTATION TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_segments (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,
    segment_name VARCHAR(100) NOT NULL,
    segment_score DECIMAL(5,4) NOT NULL,
    features JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS segment_definitions (
    id SERIAL PRIMARY KEY,
    segment_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    characteristics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- 4. DEMAND FORECASTING TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id SERIAL PRIMARY KEY,
    property_id UUID NOT NULL,
    forecast_date DATE NOT NULL,
    predicted_demand DECIMAL(10,2) NOT NULL,
    confidence_interval_lower DECIMAL(10,2) NOT NULL,
    confidence_interval_upper DECIMAL(10,2) NOT NULL,
    model_used VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historical_demand (
    id SERIAL PRIMARY KEY,
    property_id UUID NOT NULL,
    date DATE NOT NULL,
    actual_demand DECIMAL(10,2) NOT NULL,
    external_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. DYNAMIC PRICING TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS pricing_decisions (
    id SERIAL PRIMARY KEY,
    property_id UUID NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    dynamic_price DECIMAL(10,2) NOT NULL,
    demand_factor DECIMAL(5,4) NOT NULL,
    competitor_factor DECIMAL(5,4) NOT NULL,
    seasonality_factor DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competitor_prices (
    id SERIAL PRIMARY KEY,
    property_id UUID NOT NULL,
    competitor_name VARCHAR(100) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. CHURN PREDICTION TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS churn_predictions (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,
    churn_probability DECIMAL(5,4) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    features JSONB NOT NULL,
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version VARCHAR(50) DEFAULT '1.0'
);

CREATE TABLE IF NOT EXISTS churn_events (
    id SERIAL PRIMARY KEY,
    customer_id UUID NOT NULL,
    churn_date DATE NOT NULL,
    churn_reason VARCHAR(200),
    features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. MODEL MONITORING TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS model_performance_monitoring (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    accuracy DECIMAL(5,4) NOT NULL,
    precision_score DECIMAL(5,4) NOT NULL,
    recall_score DECIMAL(5,4) NOT NULL,
    f1_score DECIMAL(5,4) NOT NULL,
    auc_score DECIMAL(5,4),
    prediction_count INTEGER NOT NULL,
    monitoring_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS data_drift_alerts (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    drift_score DECIMAL(5,4) NOT NULL,
    threshold DECIMAL(5,4) NOT NULL,
    alert_level VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_alerts (
    id SERIAL PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    alert_message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 8. RECOMMENDATION ENGINE TABLES
-- =====================================================
CREATE TABLE IF NOT EXISTS recommendation_engines (
    engine_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    engine_name VARCHAR(100) UNIQUE NOT NULL,
    algorithm_type VARCHAR(50) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    configuration JSONB,
    performance_metrics JSONB,
    last_trained_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_recommendations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    recommendation_type VARCHAR(50) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    score DECIMAL(5,4) NOT NULL,
    algorithm_used VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    recommendation_id INTEGER NOT NULL,
    feedback_type VARCHAR(20) NOT NULL, -- 'positive', 'negative', 'neutral'
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- Credit scoring indexes
CREATE INDEX IF NOT EXISTS idx_credit_scores_business ON credit_scores(business_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_date ON credit_scores(prediction_date);
CREATE INDEX IF NOT EXISTS idx_credit_scores_risk ON credit_scores(risk_level);

-- Fraud detection indexes
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_transaction ON fraud_alerts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_user ON fraud_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_date ON fraud_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_fraud_alerts_status ON fraud_alerts(status);

-- Customer segmentation indexes
CREATE INDEX IF NOT EXISTS idx_customer_segments_customer ON customer_segments(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_segments_name ON customer_segments(segment_name);
CREATE INDEX IF NOT EXISTS idx_customer_segments_score ON customer_segments(segment_score);

-- Demand forecasting indexes
CREATE INDEX IF NOT EXISTS idx_demand_forecasts_property ON demand_forecasts(property_id);
CREATE INDEX IF NOT EXISTS idx_demand_forecasts_date ON demand_forecasts(forecast_date);
CREATE INDEX IF NOT EXISTS idx_historical_demand_property ON historical_demand(property_id);
CREATE INDEX IF NOT EXISTS idx_historical_demand_date ON historical_demand(date);

-- Dynamic pricing indexes
CREATE INDEX IF NOT EXISTS idx_pricing_decisions_property ON pricing_decisions(property_id);
CREATE INDEX IF NOT EXISTS idx_pricing_decisions_date ON pricing_decisions(date);
CREATE INDEX IF NOT EXISTS idx_competitor_prices_property ON competitor_prices(property_id);
CREATE INDEX IF NOT EXISTS idx_competitor_prices_date ON competitor_prices(date);

-- Churn prediction indexes
CREATE INDEX IF NOT EXISTS idx_churn_predictions_customer ON churn_predictions(customer_id);
CREATE INDEX IF NOT EXISTS idx_churn_predictions_risk ON churn_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_churn_events_customer ON churn_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_churn_events_date ON churn_events(churn_date);

-- Model monitoring indexes
CREATE INDEX IF NOT EXISTS idx_model_performance_model ON model_performance_monitoring(model_name);
CREATE INDEX IF NOT EXISTS idx_model_performance_date ON model_performance_monitoring(monitoring_date);
CREATE INDEX IF NOT EXISTS idx_model_alerts_model ON model_alerts(model_name);
CREATE INDEX IF NOT EXISTS idx_model_alerts_resolved ON model_alerts(resolved);

-- Recommendation engine indexes
CREATE INDEX IF NOT EXISTS idx_user_recommendations_user ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_type ON user_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_expires ON user_recommendations(expires_at);
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_user ON recommendation_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_feedback_recommendation ON recommendation_feedback(recommendation_id);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_performance_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for credit_scores (tenant-based access)
CREATE POLICY "credit_scores_tenant_policy" ON credit_scores
    FOR ALL USING (
        business_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for fraud_alerts (tenant-based access)
CREATE POLICY "fraud_alerts_tenant_policy" ON fraud_alerts
    FOR ALL USING (
        user_id IN (
            SELECT id FROM users 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for customer_segments (tenant-based access)
CREATE POLICY "customer_segments_tenant_policy" ON customer_segments
    FOR ALL USING (
        customer_id IN (
            SELECT id FROM users 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for demand_forecasts (tenant-based access)
CREATE POLICY "demand_forecasts_tenant_policy" ON demand_forecasts
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for pricing_decisions (tenant-based access)
CREATE POLICY "pricing_decisions_tenant_policy" ON pricing_decisions
    FOR ALL USING (
        property_id IN (
            SELECT id FROM hospitality_properties 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for churn_predictions (tenant-based access)
CREATE POLICY "churn_predictions_tenant_policy" ON churn_predictions
    FOR ALL USING (
        customer_id IN (
            SELECT id FROM users 
            WHERE tenant_id = current_setting('app.current_tenant_id', true)::uuid
        )
    );

-- RLS Policies for user_recommendations (user-based access)
CREATE POLICY "user_recommendations_user_policy" ON user_recommendations
    FOR ALL USING (
        user_id = current_setting('app.current_user_id', true)::uuid
    );

-- RLS Policies for recommendation_feedback (user-based access)
CREATE POLICY "recommendation_feedback_user_policy" ON recommendation_feedback
    FOR ALL USING (
        user_id = current_setting('app.current_user_id', true)::uuid
    );

-- =====================================================
-- 11. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_customer_segments_updated_at 
    BEFORE UPDATE ON customer_segments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recommendation_engines_updated_at 
    BEFORE UPDATE ON recommendation_engines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. GRANTS AND PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT SELECT ON credit_scores TO authenticated;
GRANT SELECT ON fraud_alerts TO authenticated;
GRANT SELECT ON customer_segments TO authenticated;
GRANT SELECT ON demand_forecasts TO authenticated;
GRANT SELECT ON pricing_decisions TO authenticated;
GRANT SELECT ON churn_predictions TO authenticated;
GRANT SELECT ON model_performance_monitoring TO authenticated;
GRANT SELECT ON model_alerts TO authenticated;
GRANT ALL ON user_recommendations TO authenticated;
GRANT ALL ON recommendation_feedback TO authenticated;

-- Grant permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- 13. COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE credit_scores IS 'Credit scoring predictions for hospitality businesses';
COMMENT ON TABLE fraud_alerts IS 'Fraud detection alerts and suspicious activity';
COMMENT ON TABLE customer_segments IS 'Customer segmentation data and assignments';
COMMENT ON TABLE demand_forecasts IS 'Demand forecasting predictions for properties';
COMMENT ON TABLE pricing_decisions IS 'Dynamic pricing decisions and adjustments';
COMMENT ON TABLE churn_predictions IS 'Customer churn probability predictions';
COMMENT ON TABLE model_performance_monitoring IS 'ML model performance monitoring data';
COMMENT ON TABLE model_alerts IS 'Model performance and drift alerts';
COMMENT ON TABLE user_recommendations IS 'Personalized recommendations for users';
COMMENT ON TABLE recommendation_feedback IS 'User feedback on recommendations';