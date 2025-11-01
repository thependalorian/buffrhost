-- Migration: 07_ml_staff_tables.sql
-- ML enhancements for staff management and performance optimization
-- Predictive analytics for staff scheduling and performance

-- Staff performance predictions (ML-generated)
CREATE TABLE IF NOT EXISTS staff_performance_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    prediction_date DATE NOT NULL,
    predicted_productivity DECIMAL(5, 4), -- 0.00 to 1.00
    predicted_efficiency DECIMAL(5, 4), -- 0.00 to 1.00
    predicted_workload DECIMAL(5, 2), -- Hours per day
    confidence_score DECIMAL(3, 2),
    factors JSONB, -- Contributing factors to prediction
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimal scheduling recommendations
CREATE TABLE IF NOT EXISTS staff_scheduling_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    recommendation_date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    recommended_staff JSONB, -- Array of recommended staff IDs with confidence scores
    staffing_requirements JSONB, -- Expected workload and requirements
    optimization_score DECIMAL(3, 2), -- Overall quality of schedule
    constraints_satisfied JSONB, -- Which business constraints were met
    alternative_schedules JSONB, -- Backup scheduling options
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff workload patterns and analysis
CREATE TABLE IF NOT EXISTS staff_workload_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    pattern_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'seasonal'
    pattern_data JSONB NOT NULL, -- Time series of workload metrics
    peak_hours JSONB, -- Hours with highest workload
    optimal_schedule JSONB, -- Recommended working hours
    efficiency_score DECIMAL(3, 2),
    last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff training recommendations
CREATE TABLE IF NOT EXISTS staff_training_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    recommended_skill VARCHAR(100) NOT NULL,
    current_proficiency DECIMAL(3, 2), -- 0.00 to 1.00
    target_proficiency DECIMAL(3, 2),
    training_priority VARCHAR(20) CHECK (training_priority IN ('low', 'medium', 'high', 'critical')),
    estimated_training_hours INTEGER,
    business_impact DECIMAL(5, 2), -- Expected productivity improvement
    prerequisites TEXT[],
    recommended_resources TEXT[],
    deadline DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff churn risk predictions
CREATE TABLE IF NOT EXISTS staff_churn_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    churn_probability DECIMAL(3, 2) NOT NULL,
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    prediction_factors JSONB, -- Key factors contributing to churn risk
    recommended_actions TEXT[],
    intervention_priority VARCHAR(20) CHECK (intervention_priority IN ('monitor', 'engage', 'retain', 'urgent')),
    predicted_attrition_date DATE,
    confidence_score DECIMAL(3, 2),
    model_version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff skill gap analysis
CREATE TABLE IF NOT EXISTS staff_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    skill_name VARCHAR(100) NOT NULL,
    current_level DECIMAL(3, 2), -- 0.00 to 1.00
    required_level DECIMAL(3, 2),
    gap_severity VARCHAR(20) CHECK (gap_severity IN ('minor', 'moderate', 'significant', 'critical')),
    business_impact VARCHAR(50), -- 'productivity', 'quality', 'efficiency', 'compliance'
    training_cost_estimate DECIMAL(8, 2),
    time_to_competency INTERVAL,
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shift optimization analytics
CREATE TABLE IF NOT EXISTS shift_optimization_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_id UUID REFERENCES properties(id),
    analysis_date DATE NOT NULL,
    total_scheduled_hours DECIMAL(6, 2),
    total_required_hours DECIMAL(6, 2),
    coverage_efficiency DECIMAL(5, 4), -- Actual coverage vs required
    labor_cost_efficiency DECIMAL(5, 4), -- Cost per coverage hour
    staff_satisfaction_score DECIMAL(3, 2),
    customer_service_impact DECIMAL(3, 2),
    optimization_recommendations JSONB,
    implemented_changes JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff development plans
CREATE TABLE IF NOT EXISTS staff_development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    plan_name VARCHAR(255) NOT NULL,
    plan_description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    development_goals JSONB, -- Array of skill development objectives
    required_resources JSONB,
    milestones JSONB,
    progress_percentage DECIMAL(5, 2),
    mentor_id UUID REFERENCES staff(id),
    budget_allocated DECIMAL(8, 2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'on_hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for ML staff analytics performance
CREATE INDEX IF NOT EXISTS idx_staff_performance_predictions_staff ON staff_performance_predictions(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_performance_predictions_date ON staff_performance_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_staff_scheduling_recommendations_date ON staff_scheduling_recommendations(recommendation_date);
CREATE INDEX IF NOT EXISTS idx_staff_workload_patterns_staff ON staff_workload_patterns(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_training_recommendations_staff ON staff_training_recommendations(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_churn_predictions_staff ON staff_churn_predictions(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_skill_gaps_staff ON staff_skill_gaps(staff_id);
CREATE INDEX IF NOT EXISTS idx_shift_optimization_analytics_date ON shift_optimization_analytics(analysis_date);
CREATE INDEX IF NOT EXISTS idx_staff_development_plans_staff ON staff_development_plans(staff_id);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_ml_staff_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staff_workload_patterns_updated_at BEFORE UPDATE ON staff_workload_patterns FOR EACH ROW EXECUTE FUNCTION update_ml_staff_updated_at_column();
CREATE TRIGGER update_staff_training_recommendations_updated_at BEFORE UPDATE ON staff_training_recommendations FOR EACH ROW EXECUTE FUNCTION update_ml_staff_updated_at_column();
CREATE TRIGGER update_staff_churn_predictions_updated_at BEFORE UPDATE ON staff_churn_predictions FOR EACH ROW EXECUTE FUNCTION update_ml_staff_updated_at_column();
CREATE TRIGGER update_staff_skill_gaps_updated_at BEFORE UPDATE ON staff_skill_gaps FOR EACH ROW EXECUTE FUNCTION update_ml_staff_updated_at_column();
CREATE TRIGGER update_staff_development_plans_updated_at BEFORE UPDATE ON staff_development_plans FOR EACH ROW EXECUTE FUNCTION update_ml_staff_updated_at_column();

-- Function to calculate staff productivity score
CREATE OR REPLACE FUNCTION calculate_staff_productivity(
    staff_uuid UUID,
    tenant_uuid UUID,
    evaluation_period_days INTEGER DEFAULT 30
)
RETURNS DECIMAL(5, 4) AS $$
DECLARE
    total_activities INTEGER := 0;
    completed_activities INTEGER := 0;
    avg_activity_duration INTERVAL;
    efficiency_score DECIMAL(5, 4) := 0;
BEGIN
    -- Count activities in period
    SELECT COUNT(*), COUNT(CASE WHEN status = 'completed' THEN 1 END)
    INTO total_activities, completed_activities
    FROM staff_activities
    WHERE staff_id = staff_uuid AND tenant_id = tenant_uuid
    AND created_at >= NOW() - (evaluation_period_days || ' days')::INTERVAL;

    -- Calculate completion rate
    IF total_activities > 0 THEN
        efficiency_score := completed_activities::DECIMAL / total_activities::DECIMAL;
    END IF;

    -- Factor in activity duration (faster completion = higher productivity)
    SELECT AVG(duration_minutes) INTO avg_activity_duration
    FROM staff_activities
    WHERE staff_id = staff_uuid AND tenant_id = tenant_uuid
    AND status = 'completed'
    AND created_at >= NOW() - (evaluation_period_days || ' days')::INTERVAL;

    -- Adjust efficiency based on speed (assuming optimal duration is known)
    IF avg_activity_duration IS NOT NULL THEN
        -- This is a simplified adjustment - real implementation would use benchmarks
        efficiency_score := efficiency_score * (1 + GREATEST(0, 1 - EXTRACT(EPOCH FROM avg_activity_duration)/3600/8)); -- Assume 8-hour optimal
    END IF;

    RETURN LEAST(efficiency_score, 1.0); -- Cap at 100%
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to predict staff churn risk
CREATE OR REPLACE FUNCTION predict_staff_churn_risk(
    staff_uuid UUID,
    tenant_uuid UUID
)
RETURNS DECIMAL(3, 2) AS $$
DECLARE
    tenure_days INTEGER;
    performance_score DECIMAL(5, 4);
    activity_trend DECIMAL(3, 2);
    risk_score DECIMAL(3, 2) := 0.1; -- Base risk
BEGIN
    -- Calculate tenure
    SELECT EXTRACT(EPOCH FROM (NOW() - hire_date))/86400 INTO tenure_days
    FROM staff
    WHERE id = staff_uuid AND tenant_id = tenant_uuid;

    -- Recent performance (lower performance = higher risk)
    SELECT AVG(metric_value) INTO performance_score
    FROM staff_performance
    WHERE staff_id = staff_uuid AND tenant_id = tenant_uuid
    AND performance_period_end >= NOW() - INTERVAL '90 days';

    -- Activity trend (declining activity = higher risk)
    SELECT CORR(row_number, duration_minutes) INTO activity_trend
    FROM (
        SELECT ROW_NUMBER() OVER (ORDER BY created_at) as row_number, duration_minutes
        FROM staff_activities
        WHERE staff_id = staff_uuid AND tenant_id = tenant_uuid
        AND created_at >= NOW() - INTERVAL '90 days'
        ORDER BY created_at
    ) t;

    -- Calculate risk based on multiple factors
    IF tenure_days < 180 THEN risk_score := risk_score + 0.2; END IF; -- High risk in first 6 months
    IF performance_score < 0.7 THEN risk_score := risk_score + 0.3; END IF; -- Poor performance
    IF activity_trend < -0.5 THEN risk_score := risk_score + 0.2; END IF; -- Declining activity

    RETURN LEAST(risk_score, 0.95); -- Cap at 95%
END;
$$ LANGUAGE plpgsql STABLE;

-- Comments for documentation
COMMENT ON TABLE staff_performance_predictions IS 'ML-generated predictions for staff performance and workload';
COMMENT ON TABLE staff_scheduling_recommendations IS 'AI-optimized staff scheduling recommendations';
COMMENT ON TABLE staff_workload_patterns IS 'Analyzed patterns in staff workload and efficiency';
COMMENT ON TABLE staff_training_recommendations IS 'ML-identified training needs and priorities';
COMMENT ON TABLE staff_churn_predictions IS 'Staff turnover risk predictions and retention strategies';
COMMENT ON TABLE staff_skill_gaps IS 'Identified skill deficiencies and development needs';
COMMENT ON TABLE shift_optimization_analytics IS 'Analytics on scheduling efficiency and labor costs';
COMMENT ON TABLE staff_development_plans IS 'Structured development plans for staff growth';
