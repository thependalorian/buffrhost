-- Migration: 003_create_analytics_tables.sql
-- Creates comprehensive analytics system for Buffr Host
-- Real-time business intelligence and ML model performance tracking

-- Revenue analytics (daily revenue tracking)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, property_id, date)
);

-- Guest experience metrics (customer satisfaction tracking)
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
    nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10), -- Net Promoter Score
    survey_response_time INTERVAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operational metrics (staff and property performance)
CREATE TABLE IF NOT EXISTS operational_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    metric_date DATE NOT NULL,
    staff_count INTEGER DEFAULT 0,
    active_staff INTEGER DEFAULT 0,
    total_room_inventory INTEGER DEFAULT 0,
    available_rooms INTEGER DEFAULT 0,
    maintenance_issues INTEGER DEFAULT 0,
    guest_complaints INTEGER DEFAULT 0,
    response_time_avg INTERVAL, -- Average response time to guest inquiries
    housekeeping_completion_rate DECIMAL(5,4), -- 0.0000 to 1.0000
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ML model performance tracking
CREATE TABLE IF NOT EXISTS model_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_type VARCHAR(20) CHECK (metric_type IN ('accuracy', 'precision', 'recall', 'f1_score', 'mae', 'mse', 'rmse', 'r2')),
    training_samples INTEGER,
    test_samples INTEGER,
    training_duration INTERVAL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Demand forecasting data
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    forecast_date DATE NOT NULL,
    forecast_horizon INTEGER NOT NULL, -- Days ahead
    predicted_occupancy DECIMAL(5,4),
    predicted_arrivals INTEGER,
    predicted_revenue DECIMAL(10,2),
    confidence_level DECIMAL(3,2), -- 0.00 to 1.00
    model_used VARCHAR(50),
    forecast_accuracy DECIMAL(5,4), -- Actual vs predicted accuracy (updated post-event)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing campaign analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    campaign_id VARCHAR(100),
    campaign_name VARCHAR(255),
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('email', 'sms', 'social', 'paid_ads', 'referral')),
    start_date DATE,
    end_date DATE,
    target_audience JSONB,
    budget_allocated DECIMAL(10,2),
    actual_spend DECIMAL(10,2),
    impressions INTEGER,
    clicks INTEGER,
    conversions INTEGER,
    bookings_generated INTEGER,
    revenue_generated DECIMAL(10,2),
    roi_percentage DECIMAL(7,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time dashboard metrics cache
CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    metric_type VARCHAR(50) NOT NULL,
    metric_key VARCHAR(100) NOT NULL,
    metric_value JSONB NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, property_id, metric_type, metric_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_tenant_date ON revenue_analytics(tenant_id, date);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_property_date ON revenue_analytics(property_id, date);
CREATE INDEX IF NOT EXISTS idx_guest_experience_metrics_tenant ON guest_experience_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_guest_experience_metrics_created ON guest_experience_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_guest_experience_metrics_rating ON guest_experience_metrics(overall_rating);
CREATE INDEX IF NOT EXISTS idx_operational_metrics_tenant_date ON operational_metrics(tenant_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_model_metrics_tenant_model ON model_metrics(tenant_id, model_name);
CREATE INDEX IF NOT EXISTS idx_model_metrics_recorded_at ON model_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_demand_forecasts_tenant_date ON demand_forecasts(tenant_id, forecast_date);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_tenant ON campaign_analytics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_dates ON campaign_analytics(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_tenant ON dashboard_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_expires ON dashboard_metrics(expires_at);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_analytics_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_demand_forecasts_updated_at BEFORE UPDATE ON demand_forecasts FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at_column();
CREATE TRIGGER update_campaign_analytics_updated_at BEFORE UPDATE ON campaign_analytics FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at_column();
CREATE TRIGGER update_dashboard_metrics_updated_at BEFORE UPDATE ON dashboard_metrics FOR EACH ROW EXECUTE FUNCTION update_analytics_updated_at_column();

-- Materialized view for revenue trends (updated daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS revenue_trends AS
SELECT
    tenant_id,
    property_id,
    DATE_TRUNC('month', date) as month,
    SUM(total_revenue) as monthly_revenue,
    AVG(occupancy_rate) as avg_occupancy,
    AVG(revpar) as avg_revpar,
    COUNT(*) as days_count
FROM revenue_analytics
GROUP BY tenant_id, property_id, DATE_TRUNC('month', date)
ORDER BY tenant_id, property_id, month;

-- Materialized view for guest satisfaction trends
CREATE MATERIALIZED VIEW IF NOT EXISTS guest_satisfaction_trends AS
SELECT
    tenant_id,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_reviews,
    AVG(overall_rating) as avg_rating,
    AVG(nps_score) as avg_nps,
    COUNT(CASE WHEN recommendation_likelihood >= 9 THEN 1 END) as promoters,
    COUNT(CASE WHEN recommendation_likelihood >= 7 AND recommendation_likelihood <= 8 THEN 1 END) as passives,
    COUNT(CASE WHEN recommendation_likelihood <= 6 THEN 1 END) as detractors
FROM guest_experience_metrics
GROUP BY tenant_id, DATE_TRUNC('month', created_at)
ORDER BY tenant_id, month;

-- Function to calculate NPS from promoters/detractors
CREATE OR REPLACE FUNCTION calculate_nps(promoters INTEGER, passives INTEGER, detractors INTEGER)
RETURNS DECIMAL(5,2) AS $$
BEGIN
    IF (promoters + passives + detractors) = 0 THEN
        RETURN 0;
    END IF;

    RETURN ((promoters::DECIMAL - detractors::DECIMAL) / (promoters + passives + detractors)::DECIMAL) * 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comments for documentation
COMMENT ON TABLE revenue_analytics IS 'Daily revenue tracking and occupancy metrics for business intelligence';
COMMENT ON TABLE guest_experience_metrics IS 'Customer satisfaction and feedback data for service improvement';
COMMENT ON TABLE operational_metrics IS 'Staff and property operational performance metrics';
COMMENT ON TABLE model_metrics IS 'ML model performance tracking and monitoring';
COMMENT ON TABLE demand_forecasts IS 'AI-powered demand prediction and forecasting data';
COMMENT ON TABLE campaign_analytics IS 'Marketing campaign performance and ROI tracking';
COMMENT ON TABLE dashboard_metrics IS 'Cached real-time metrics for dashboard performance';
