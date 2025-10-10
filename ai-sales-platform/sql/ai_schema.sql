-- AI Service Database Schema
-- Based on Buffr Host Architecture with pgvector support
-- Enhanced for Production Deployment (v2.1.0)

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS ai_sales;
CREATE SCHEMA IF NOT EXISTS monitoring;
CREATE SCHEMA IF NOT EXISTS analytics;

-- AI Models table (Enhanced for Production)
CREATE TABLE ai_sales.ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    environment VARCHAR(50) DEFAULT 'production',
    accuracy FLOAT,
    precision_score FLOAT,
    recall_score FLOAT,
    f1_score FLOAT,
    mse FLOAT,
    r2_score FLOAT,
    training_time FLOAT,
    prediction_time FLOAT,
    model_size_mb FLOAT,
    hyperparameters JSONB,
    feature_importance JSONB,
    model_explanation JSONB,
    deployment_config JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deployed_at TIMESTAMP,
    retired_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_accuracy CHECK (accuracy >= 0 AND accuracy <= 1),
    CONSTRAINT valid_precision CHECK (precision_score >= 0 AND precision_score <= 1),
    CONSTRAINT valid_recall CHECK (recall_score >= 0 AND recall_score <= 1),
    CONSTRAINT valid_f1 CHECK (f1_score >= 0 AND f1_score <= 1),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'training', 'deployed', 'retired', 'error'))
);

-- Knowledge Base Documents table
CREATE TABLE knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    file_size INTEGER,
    upload_date TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

-- Knowledge Base Vectors table (for pgvector)
CREATE TABLE knowledge_vectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- AI Conversations table
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    conversation_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Predictions table
CREATE TABLE ai_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    prediction_type VARCHAR(100) NOT NULL,
    prediction_value FLOAT NOT NULL,
    confidence_score FLOAT NOT NULL,
    feature_data JSONB,
    model_explanation TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Funnel Analytics table
CREATE TABLE sales_funnel_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    conversion_probability FLOAT,
    confidence_score FLOAT,
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMP,
    funnel_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reactivation Campaigns table
CREATE TABLE reactivation_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_segments JSONB NOT NULL,
    channels JSONB NOT NULL,
    message_templates JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    customers_targeted INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    messages_delivered INTEGER DEFAULT 0,
    messages_opened INTEGER DEFAULT 0,
    messages_clicked INTEGER DEFAULT 0,
    responses_received INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated FLOAT DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    executed_at TIMESTAMP
);

-- Customer Segments table
CREATE TABLE customer_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    segment VARCHAR(100) NOT NULL,
    segment_score FLOAT NOT NULL,
    churn_probability FLOAT DEFAULT 0.0,
    reactivation_score FLOAT DEFAULT 0.0,
    engagement_score FLOAT DEFAULT 0.0,
    last_activity TIMESTAMP,
    segment_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Voice Interactions table
CREATE TABLE voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    audio_data BYTEA,
    transcription TEXT,
    response_audio BYTEA,
    tts_model VARCHAR(100),
    stt_model VARCHAR(100),
    processing_time FLOAT,
    quality_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ML Model Performance table
CREATE TABLE ml_model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(255) NOT NULL,
    task_type VARCHAR(100) NOT NULL,
    accuracy FLOAT,
    precision_score FLOAT,
    recall_score FLOAT,
    f1_score FLOAT,
    mse FLOAT,
    r2_score FLOAT,
    training_time FLOAT,
    prediction_time FLOAT,
    cross_val_score FLOAT,
    hyperparameters JSONB,
    feature_importance JSONB,
    evaluation_date TIMESTAMP DEFAULT NOW()
);

-- Feature Importance table
CREATE TABLE feature_importance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    feature_name VARCHAR(255) NOT NULL,
    importance_score FLOAT NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_knowledge_vectors_embedding ON knowledge_vectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_ai_conversations_customer_id ON ai_conversations(customer_id);
CREATE INDEX idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX idx_ai_predictions_customer_id ON ai_predictions(customer_id);
CREATE INDEX idx_ai_predictions_model_type ON ai_predictions(model_type);
CREATE INDEX idx_sales_funnel_analytics_lead_id ON sales_funnel_analytics(lead_id);
CREATE INDEX idx_customer_segments_customer_id ON customer_segments(customer_id);
CREATE INDEX idx_customer_segments_segment ON customer_segments(segment);
CREATE INDEX idx_reactivation_campaigns_campaign_id ON reactivation_campaigns(campaign_id);
CREATE INDEX idx_voice_interactions_customer_id ON voice_interactions(customer_id);
CREATE INDEX idx_ml_model_performance_model_name ON ml_model_performance(model_name);

-- Enhanced Monitoring Tables
CREATE TABLE monitoring.system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    metric_unit VARCHAR(50),
    tags JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Partitioning for better performance
    CONSTRAINT valid_metric_value CHECK (metric_value >= 0)
);

CREATE TABLE monitoring.performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time_ms FLOAT NOT NULL,
    status_code INTEGER NOT NULL,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_status_code CHECK (status_code >= 100 AND status_code < 600),
    CONSTRAINT valid_response_time CHECK (response_time_ms >= 0)
);

CREATE TABLE monitoring.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    threshold_value FLOAT,
    current_value FLOAT,
    duration_minutes INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by VARCHAR(255),
    
    -- Constraints
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_status CHECK (status IN ('active', 'resolved', 'acknowledged', 'suppressed'))
);

-- Enhanced Analytics Tables
CREATE TABLE analytics.conversion_funnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR(255) NOT NULL,
    stage VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    conversion_probability FLOAT NOT NULL,
    confidence_score FLOAT NOT NULL,
    time_in_stage_minutes INTEGER,
    interaction_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMP,
    stage_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_probability CHECK (conversion_probability >= 0 AND conversion_probability <= 1),
    CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE TABLE analytics.customer_journey (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    touchpoint_type VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    value FLOAT DEFAULT 0.0,
    session_id VARCHAR(255),
    referrer VARCHAR(255),
    device_type VARCHAR(50),
    location_data JSONB,
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_value CHECK (value >= 0)
);

CREATE TABLE analytics.revenue_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(255) NOT NULL,
    revenue_amount FLOAT NOT NULL,
    attribution_model VARCHAR(50) NOT NULL,
    touchpoints JSONB NOT NULL,
    conversion_path JSONB,
    attribution_percentage FLOAT NOT NULL,
    campaign_id VARCHAR(255),
    channel VARCHAR(50),
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_revenue CHECK (revenue_amount >= 0),
    CONSTRAINT valid_attribution CHECK (attribution_percentage >= 0 AND attribution_percentage <= 1)
);

-- Enhanced Security Tables
CREATE TABLE ai_sales.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    permissions JSONB NOT NULL,
    rate_limit_per_minute INTEGER DEFAULT 100,
    rate_limit_per_hour INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_rate_limit CHECK (rate_limit_per_minute > 0 AND rate_limit_per_hour > 0)
);

CREATE TABLE ai_sales.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_action CHECK (action IN ('create', 'read', 'update', 'delete', 'login', 'logout', 'export'))
);

-- Enhanced Indexes for Performance
CREATE INDEX CONCURRENTLY idx_ai_models_status ON ai_sales.ai_models(status);
CREATE INDEX CONCURRENTLY idx_ai_models_type ON ai_sales.ai_models(model_type);
CREATE INDEX CONCURRENTLY idx_ai_models_environment ON ai_sales.ai_models(environment);
CREATE INDEX CONCURRENTLY idx_knowledge_vectors_embedding ON ai_sales.knowledge_vectors USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX CONCURRENTLY idx_ai_conversations_customer_id ON ai_sales.ai_conversations(customer_id);
CREATE INDEX CONCURRENTLY idx_ai_conversations_session_id ON ai_sales.ai_conversations(session_id);
CREATE INDEX CONCURRENTLY idx_ai_conversations_channel ON ai_sales.ai_conversations(channel);
CREATE INDEX CONCURRENTLY idx_ai_predictions_customer_id ON ai_sales.ai_predictions(customer_id);
CREATE INDEX CONCURRENTLY idx_ai_predictions_model_type ON ai_sales.ai_predictions(model_type);
CREATE INDEX CONCURRENTLY idx_ai_predictions_timestamp ON ai_sales.ai_predictions(created_at);
CREATE INDEX CONCURRENTLY idx_sales_funnel_analytics_lead_id ON ai_sales.sales_funnel_analytics(lead_id);
CREATE INDEX CONCURRENTLY idx_sales_funnel_analytics_stage ON ai_sales.sales_funnel_analytics(stage);
CREATE INDEX CONCURRENTLY idx_customer_segments_customer_id ON ai_sales.customer_segments(customer_id);
CREATE INDEX CONCURRENTLY idx_customer_segments_segment ON ai_sales.customer_segments(segment);
CREATE INDEX CONCURRENTLY idx_customer_segments_churn_prob ON ai_sales.customer_segments(churn_probability);
CREATE INDEX CONCURRENTLY idx_reactivation_campaigns_campaign_id ON ai_sales.reactivation_campaigns(campaign_id);
CREATE INDEX CONCURRENTLY idx_reactivation_campaigns_status ON ai_sales.reactivation_campaigns(status);
CREATE INDEX CONCURRENTLY idx_voice_interactions_customer_id ON ai_sales.voice_interactions(customer_id);
CREATE INDEX CONCURRENTLY idx_voice_interactions_session_id ON ai_sales.voice_interactions(session_id);
CREATE INDEX CONCURRENTLY idx_ml_model_performance_model_name ON ai_sales.ml_model_performance(model_name);
CREATE INDEX CONCURRENTLY idx_ml_model_performance_task_type ON ai_sales.ml_model_performance(task_type);
CREATE INDEX CONCURRENTLY idx_feature_importance_model_id ON ai_sales.feature_importance(model_id);
CREATE INDEX CONCURRENTLY idx_feature_importance_rank ON ai_sales.feature_importance(rank);

-- Monitoring indexes
CREATE INDEX CONCURRENTLY idx_system_metrics_service ON monitoring.system_metrics(service_name);
CREATE INDEX CONCURRENTLY idx_system_metrics_timestamp ON monitoring.system_metrics(timestamp);
CREATE INDEX CONCURRENTLY idx_performance_logs_service ON monitoring.performance_logs(service_name);
CREATE INDEX CONCURRENTLY idx_performance_logs_timestamp ON monitoring.performance_logs(timestamp);
CREATE INDEX CONCURRENTLY idx_performance_logs_status_code ON monitoring.performance_logs(status_code);
CREATE INDEX CONCURRENTLY idx_alerts_severity ON monitoring.alerts(severity);
CREATE INDEX CONCURRENTLY idx_alerts_status ON monitoring.alerts(status);
CREATE INDEX CONCURRENTLY idx_alerts_created_at ON monitoring.alerts(created_at);

-- Analytics indexes
CREATE INDEX CONCURRENTLY idx_conversion_funnel_lead_id ON analytics.conversion_funnel(lead_id);
CREATE INDEX CONCURRENTLY idx_conversion_funnel_stage ON analytics.conversion_funnel(stage);
CREATE INDEX CONCURRENTLY idx_customer_journey_customer_id ON analytics.customer_journey(customer_id);
CREATE INDEX CONCURRENTLY idx_customer_journey_timestamp ON analytics.customer_journey(timestamp);
CREATE INDEX CONCURRENTLY idx_revenue_attribution_customer_id ON analytics.revenue_attribution(customer_id);
CREATE INDEX CONCURRENTLY idx_revenue_attribution_timestamp ON analytics.revenue_attribution(timestamp);

-- Security indexes
CREATE INDEX CONCURRENTLY idx_api_keys_hash ON ai_sales.api_keys(key_hash);
CREATE INDEX CONCURRENTLY idx_api_keys_active ON ai_sales.api_keys(is_active);
CREATE INDEX CONCURRENTLY idx_audit_logs_user_id ON ai_sales.audit_logs(user_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_action ON ai_sales.audit_logs(action);
CREATE INDEX CONCURRENTLY idx_audit_logs_timestamp ON ai_sales.audit_logs(timestamp);

-- Enhanced Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION ai_sales.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_models_updated_at BEFORE UPDATE ON ai_sales.ai_models FOR EACH ROW EXECUTE FUNCTION ai_sales.update_updated_at_column();
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_sales.ai_conversations FOR EACH ROW EXECUTE FUNCTION ai_sales.update_updated_at_column();
CREATE TRIGGER update_customer_segments_updated_at BEFORE UPDATE ON ai_sales.customer_segments FOR EACH ROW EXECUTE FUNCTION ai_sales.update_updated_at_column();
CREATE TRIGGER update_conversion_funnel_updated_at BEFORE UPDATE ON analytics.conversion_funnel FOR EACH ROW EXECUTE FUNCTION ai_sales.update_updated_at_column();

-- Enhanced Functions for Analytics
CREATE OR REPLACE FUNCTION analytics.calculate_conversion_rate(
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP
) RETURNS FLOAT AS $$
DECLARE
    total_leads INTEGER;
    conversions INTEGER;
    conversion_rate FLOAT;
BEGIN
    SELECT COUNT(*) INTO total_leads
    FROM ai_sales.sales_funnel_analytics
    WHERE created_at BETWEEN p_start_date AND p_end_date;
    
    SELECT COUNT(*) INTO conversions
    FROM ai_sales.sales_funnel_analytics
    WHERE created_at BETWEEN p_start_date AND p_end_date
    AND stage = 'purchase';
    
    IF total_leads > 0 THEN
        conversion_rate := conversions::FLOAT / total_leads::FLOAT;
    ELSE
        conversion_rate := 0.0;
    END IF;
    
    RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- Enhanced Views for Common Queries
CREATE VIEW analytics.daily_conversion_metrics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN stage = 'purchase' THEN 1 END) as conversions,
    ROUND(COUNT(CASE WHEN stage = 'purchase' THEN 1 END)::FLOAT / COUNT(*)::FLOAT * 100, 2) as conversion_rate
FROM ai_sales.sales_funnel_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW monitoring.service_performance_summary AS
SELECT 
    service_name,
    COUNT(*) as total_requests,
    AVG(response_time_ms) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_count,
    ROUND(COUNT(CASE WHEN status_code >= 400 THEN 1 END)::FLOAT / COUNT(*)::FLOAT * 100, 2) as error_rate
FROM monitoring.performance_logs
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY service_name;

-- Grant permissions
GRANT USAGE ON SCHEMA ai_sales TO postgres;
GRANT USAGE ON SCHEMA monitoring TO postgres;
GRANT USAGE ON SCHEMA analytics TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ai_sales TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA monitoring TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ai_sales TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA monitoring TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO postgres;
