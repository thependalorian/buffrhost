-- Migration: 004_create_advanced_feature_tables.sql
-- Creates advanced feature tables for Buffr Host
-- Includes Sofia AI, ML features, and future enhancements

-- Sofia AI Agent Configuration
CREATE TABLE IF NOT EXISTS sofia_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    personality TEXT,
    configuration JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training')),
    is_active BOOLEAN DEFAULT true,
    model_version VARCHAR(50) DEFAULT 'gpt-4',
    language VARCHAR(10) DEFAULT 'en',
    cultural_context_enabled BOOLEAN DEFAULT false,
    voice_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Conversation Tracking
CREATE TABLE IF NOT EXISTS sofia_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES sofia_agents(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES crm_customers(id),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    conversation_type VARCHAR(50) CHECK (conversation_type IN ('chat', 'voice', 'email', 'sms')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated', 'abandoned')),
    context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Message History
CREATE TABLE IF NOT EXISTS sofia_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES sofia_conversations(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('guest', 'sofia', 'staff')),
    message_type VARCHAR(50) CHECK (message_type IN ('text', 'voice', 'image', 'file')),
    content TEXT NOT NULL,
    intent VARCHAR(100),
    confidence DECIMAL(3, 2) CHECK (confidence BETWEEN 0 AND 1),
    sentiment_score DECIMAL(3, 2) CHECK (sentiment_score BETWEEN -1 AND 1),
    language_detected VARCHAR(10),
    translation_needed BOOLEAN DEFAULT false,
    context JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Learning Memory System
CREATE TABLE IF NOT EXISTS sofia_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES sofia_agents(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) CHECK (memory_type IN ('guest_preference', 'policy', 'faq', 'procedure', 'cultural_norm')),
    content TEXT NOT NULL,
    importance INTEGER DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ,
    confidence_score DECIMAL(3, 2) CHECK (confidence_score BETWEEN 0 AND 1),
    source VARCHAR(50), -- 'manual', 'learned', 'imported'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Capabilities Configuration
CREATE TABLE IF NOT EXISTS sofia_capabilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    tts_enabled BOOLEAN DEFAULT false,
    sms_enabled BOOLEAN DEFAULT false,
    voice_enabled BOOLEAN DEFAULT false,
    chat_enabled BOOLEAN DEFAULT true,
    analytics_enabled BOOLEAN DEFAULT true,
    vision_enabled BOOLEAN DEFAULT false,
    african_voice_enabled BOOLEAN DEFAULT false,
    deepseek_vision_enabled BOOLEAN DEFAULT false,
    default_language VARCHAR(10) DEFAULT 'en',
    supported_languages TEXT[] DEFAULT ARRAY['en'],
    voice_profile VARCHAR(100),
    cultural_context_enabled BOOLEAN DEFAULT false,
    auto_translation_enabled BOOLEAN DEFAULT false,
    sentiment_analysis_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Analytics & Performance Tracking
CREATE TABLE IF NOT EXISTS sofia_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES sofia_agents(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(12, 2),
    metric_unit VARCHAR(50),
    dimensions JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Communication Logs (Outbound)
CREATE TABLE IF NOT EXISTS sofia_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES sofia_agents(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    communication_type VARCHAR(20) CHECK (communication_type IN ('email', 'sms', 'voice', 'push')),
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(20),
    subject VARCHAR(500),
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    external_id VARCHAR(255),
    delivery_attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sofia AI Configuration Management
CREATE TABLE IF NOT EXISTS sofia_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) CHECK (config_type IN ('string', 'number', 'boolean', 'json')),
    category VARCHAR(50),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, config_key)
);

-- ML Feature Store (for advanced ML features)
CREATE TABLE IF NOT EXISTS feature_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    feature_type VARCHAR(20) CHECK (feature_type IN ('numerical', 'categorical', 'text', 'datetime')),
    feature_data JSONB NOT NULL,
    feature_version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, feature_name, feature_version)
);

-- A/B Testing Framework
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_description TEXT,
    feature VARCHAR(100) NOT NULL,
    variant_a_name VARCHAR(50) DEFAULT 'control',
    variant_a_config JSONB DEFAULT '{}',
    variant_b_name VARCHAR(50) DEFAULT 'treatment',
    variant_b_config JSONB DEFAULT '{}',
    target_metric VARCHAR(50) NOT NULL,
    minimum_sample_size INTEGER DEFAULT 1000,
    confidence_level DECIMAL(3, 2) DEFAULT 0.95,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'stopped')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    winner_variant VARCHAR(50),
    statistical_significance BOOLEAN,
    effect_size DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B Test Results
CREATE TABLE IF NOT EXISTS ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    variant_name VARCHAR(50) NOT NULL,
    sample_size INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5, 4),
    average_value DECIMAL(10, 2),
    confidence_interval_lower DECIMAL(10, 2),
    confidence_interval_upper DECIMAL(10, 2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sofia_agents_tenant ON sofia_agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sofia_agents_property ON sofia_agents(property_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_tenant ON sofia_conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sofia_conversations_agent ON sofia_conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_sofia_messages_conversation ON sofia_conversations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_sofia_messages_created ON sofia_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_sofia_memories_agent ON sofia_memories(agent_id);
CREATE INDEX IF NOT EXISTS idx_sofia_memories_importance ON sofia_memories(importance);
CREATE INDEX IF NOT EXISTS idx_sofia_analytics_recorded ON sofia_analytics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_sofia_communications_sent ON sofia_communications(sent_at);
CREATE INDEX IF NOT EXISTS idx_sofia_config_tenant ON sofia_config(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_store_tenant ON feature_store(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_tenant ON ab_tests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test ON ab_test_results(test_id);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_advanced_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sofia_agents_updated_at BEFORE UPDATE ON sofia_agents FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_sofia_conversations_updated_at BEFORE UPDATE ON sofia_conversations FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_sofia_memories_updated_at BEFORE UPDATE ON sofia_memories FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_sofia_capabilities_updated_at BEFORE UPDATE ON sofia_capabilities FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_sofia_config_updated_at BEFORE UPDATE ON sofia_config FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_feature_store_updated_at BEFORE UPDATE ON feature_store FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();
CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests FOR EACH ROW EXECUTE FUNCTION update_advanced_updated_at_column();

-- Function to calculate A/B test significance
CREATE OR REPLACE FUNCTION calculate_ab_significance(
    conversions_a INTEGER, sample_a INTEGER,
    conversions_b INTEGER, sample_b INTEGER
)
RETURNS DECIMAL(5, 4) AS $$
DECLARE
    rate_a DECIMAL(5, 4) := conversions_a::DECIMAL / NULLIF(sample_a, 0);
    rate_b DECIMAL(5, 4) := conversions_b::DECIMAL / NULLIF(sample_b, 0);
    pooled_rate DECIMAL(5, 4);
    se DECIMAL(10, 8);
    z_score DECIMAL(10, 4);
BEGIN
    IF sample_a = 0 OR sample_b = 0 THEN
        RETURN 0;
    END IF;

    pooled_rate := (conversions_a + conversions_b)::DECIMAL / (sample_a + sample_b);
    se := SQRT(pooled_rate * (1 - pooled_rate) * (1.0/sample_a + 1.0/sample_b));
    z_score := ABS(rate_a - rate_b) / NULLIF(se, 0);

    -- Return p-value approximation (simplified)
    -- This is a basic approximation; production systems should use proper statistical libraries
    IF z_score >= 2.576 THEN RETURN 0.99; -- 99.5% confidence
    ELSIF z_score >= 1.96 THEN RETURN 0.95; -- 95% confidence
    ELSIF z_score >= 1.645 THEN RETURN 0.90; -- 90% confidence
    ELSE RETURN 0.0;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Comments for documentation
COMMENT ON TABLE sofia_agents IS 'Sofia AI agent configurations and personalities';
COMMENT ON TABLE sofia_conversations IS 'Complete conversation tracking for AI interactions';
COMMENT ON TABLE sofia_messages IS 'Individual messages within Sofia conversations';
COMMENT ON TABLE sofia_memories IS 'AI learning system for continuous improvement';
COMMENT ON TABLE sofia_capabilities IS 'Tenant-specific AI feature enablement';
COMMENT ON TABLE sofia_analytics IS 'Performance metrics and analytics for AI operations';
COMMENT ON TABLE sofia_communications IS 'Outbound communication tracking and delivery';
COMMENT ON TABLE sofia_config IS 'Configuration management for AI features';
COMMENT ON TABLE feature_store IS 'ML feature storage for advanced model training';
COMMENT ON TABLE ab_tests IS 'A/B testing framework for optimization';
COMMENT ON TABLE ab_test_results IS 'Statistical results and significance testing';
