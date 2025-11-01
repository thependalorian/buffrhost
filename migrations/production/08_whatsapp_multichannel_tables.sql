-- Migration: 08_whatsapp_multichannel_tables.sql
-- WhatsApp and multi-channel communication support for Sofia AI
-- Adds tables for WhatsApp integration, multi-modal messaging, and workflow management

-- WhatsApp conversation tracking
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_message_id VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    conversation_id UUID REFERENCES sofia_conversations(id),
    message_type VARCHAR(20) CHECK (message_type IN ('text', 'image', 'audio', 'document', 'location')),
    media_id VARCHAR(255),
    media_url TEXT,
    caption TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-modal message attachments
CREATE TABLE IF NOT EXISTS message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    attachment_type VARCHAR(20) CHECK (attachment_type IN ('image', 'audio', 'document', 'video')),
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    storage_path TEXT,
    s3_bucket VARCHAR(100),
    s3_key TEXT,
    processed_at TIMESTAMPTZ,
    transcription_text TEXT,
    image_analysis JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication channel preferences
CREATE TABLE IF NOT EXISTS communication_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    channel_type VARCHAR(20) CHECK (channel_type IN ('whatsapp', 'sms', 'email', 'voice', 'chat')),
    channel_identifier VARCHAR(255) NOT NULL, -- phone number, email, etc.
    is_active BOOLEAN DEFAULT true,
    verification_status VARCHAR(20) DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'failed')),
    verification_code VARCHAR(10),
    verification_attempts INTEGER DEFAULT 0,
    last_verified_at TIMESTAMPTZ,
    preferences JSONB DEFAULT '{}', -- channel-specific settings
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workflow state management for LangGraph
CREATE TABLE IF NOT EXISTS workflow_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id VARCHAR(255) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    workflow_type VARCHAR(50) NOT NULL, -- 'sofia_conversation', 'kyc_process', etc.
    current_state JSONB NOT NULL,
    workflow_metadata JSONB DEFAULT '{}',
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(thread_id, workflow_type)
);

-- Memory storage for AI context
CREATE TABLE IF NOT EXISTS ai_memory_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_identifier VARCHAR(255) NOT NULL, -- phone, email, user_id
    memory_type VARCHAR(50) CHECK (memory_type IN ('short_term', 'long_term', 'working_memory')),
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI embedding dimension
    importance_score DECIMAL(3, 2) DEFAULT 0.5,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Router decision logs
CREATE TABLE IF NOT EXISTS communication_router_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    conversation_id UUID REFERENCES sofia_conversations(id),
    input_message TEXT NOT NULL,
    router_decision VARCHAR(20) CHECK (router_decision IN ('conversation', 'image', 'audio', 'multimodal')),
    confidence_score DECIMAL(3, 2),
    decision_factors JSONB,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-modal processing logs
CREATE TABLE IF NOT EXISTS multimodal_processing_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    message_id UUID NOT NULL,
    processing_type VARCHAR(50) CHECK (processing_type IN ('speech_to_text', 'text_to_speech', 'image_to_text', 'text_to_image')),
    input_data JSONB,
    output_data JSONB,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    model_used VARCHAR(100),
    cost DECIMAL(8, 6), -- API cost tracking
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule-based context data
CREATE TABLE IF NOT EXISTS activity_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    property_type VARCHAR(20) CHECK (property_type IN ('hotel', 'restaurant', 'resort', 'guesthouse', 'property_management', 'guest_services')),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    time_range TSTZRANGE NOT NULL,
    activity_description TEXT NOT NULL,
    context_tags TEXT[],
    operational_status VARCHAR(20) DEFAULT 'normal' CHECK (operational_status IN ('normal', 'busy', 'maintenance', 'emergency')),
    staffing_level VARCHAR(20) DEFAULT 'standard' CHECK (staffing_level IN ('minimal', 'standard', 'peak', 'emergency')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    EXCLUDE (tenant_id WITH =, property_type WITH =, day_of_week WITH =, time_range WITH &&) WHERE (is_active = true)
);

-- Error handling and fallback logs
CREATE TABLE IF NOT EXISTS communication_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    channel_type VARCHAR(20),
    error_type VARCHAR(50) CHECK (error_type IN ('api_error', 'processing_error', 'timeout', 'rate_limit', 'authentication')),
    error_message TEXT,
    error_context JSONB,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    resolved BOOLEAN DEFAULT false,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Performance monitoring for multi-channel
CREATE TABLE IF NOT EXISTS channel_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    channel_type VARCHAR(20),
    metric_date DATE NOT NULL,
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,
    response_time_avg DECIMAL(8, 2), -- milliseconds
    delivery_rate DECIMAL(5, 4), -- percentage
    error_rate DECIMAL(5, 4), -- percentage
    user_satisfaction DECIMAL(3, 2), -- 1-5 scale
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_phone ON whatsapp_conversations(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_created ON whatsapp_conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_communication_channels_identifier ON communication_channels(channel_identifier);
CREATE INDEX IF NOT EXISTS idx_workflow_states_thread ON workflow_states(thread_id);
CREATE INDEX IF NOT EXISTS idx_ai_memory_user ON ai_memory_store(user_identifier);
CREATE INDEX IF NOT EXISTS idx_ai_memory_embedding ON ai_memory_store USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_router_logs_created ON communication_router_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_multimodal_logs_created ON multimodal_processing_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_schedules_day ON activity_schedules(day_of_week);
CREATE INDEX IF NOT EXISTS idx_communication_errors_created ON communication_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_channel_performance_date ON channel_performance_metrics(metric_date);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_multichannel_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_communication_channels_updated_at BEFORE UPDATE ON communication_channels FOR EACH ROW EXECUTE FUNCTION update_multichannel_updated_at_column();
CREATE TRIGGER update_workflow_states_updated_at BEFORE UPDATE ON workflow_states FOR EACH ROW EXECUTE FUNCTION update_multichannel_updated_at_column();
CREATE TRIGGER update_activity_schedules_updated_at BEFORE UPDATE ON activity_schedules FOR EACH ROW EXECUTE FUNCTION update_multichannel_updated_at_column();

-- Function to get current activity context
CREATE OR REPLACE FUNCTION get_current_activity_context(tenant_uuid UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    current_day INTEGER;
    current_time TIME;
    activity_desc TEXT;
BEGIN
    current_day := EXTRACT(DOW FROM NOW());
    current_time := NOW()::TIME;

    SELECT activity_description INTO activity_desc
    FROM activity_schedules
    WHERE (tenant_id = tenant_uuid OR tenant_uuid IS NULL)
    AND day_of_week = current_day
    AND time_range @> current_time::TIMETZ
    AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;

    RETURN COALESCE(activity_desc, 'Available for assistance');
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to log communication performance
CREATE OR REPLACE FUNCTION log_channel_performance(
    tenant_uuid UUID,
    channel VARCHAR(20),
    sent_count INTEGER DEFAULT 0,
    received_count INTEGER DEFAULT 0,
    avg_response_time DECIMAL DEFAULT NULL,
    delivery_rate DECIMAL DEFAULT NULL,
    error_rate DECIMAL DEFAULT NULL,
    satisfaction DECIMAL DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO channel_performance_metrics (
        tenant_id, channel_type, metric_date,
        messages_sent, messages_received,
        response_time_avg, delivery_rate, error_rate, user_satisfaction
    ) VALUES (
        tenant_uuid, channel, CURRENT_DATE,
        sent_count, received_count,
        avg_response_time, delivery_rate, error_rate, satisfaction
    )
    ON CONFLICT (tenant_id, channel_type, metric_date)
    DO UPDATE SET
        messages_sent = channel_performance_metrics.messages_sent + sent_count,
        messages_received = channel_performance_metrics.messages_received + received_count,
        response_time_avg = CASE WHEN avg_response_time IS NOT NULL THEN avg_response_time ELSE channel_performance_metrics.response_time_avg END,
        delivery_rate = CASE WHEN delivery_rate IS NOT NULL THEN delivery_rate ELSE channel_performance_metrics.delivery_rate END,
        error_rate = CASE WHEN error_rate IS NOT NULL THEN error_rate ELSE channel_performance_metrics.error_rate END,
        user_satisfaction = CASE WHEN satisfaction IS NOT NULL THEN satisfaction ELSE channel_performance_metrics.user_satisfaction END;
END;
$$ LANGUAGE plpgsql;

-- Seed data for property schedules
-- Hospitality Operations Schedules (Tenant ID: 1 - Default Buffr Host)
INSERT INTO activity_schedules (tenant_id, property_type, day_of_week, time_range, activity_description, context_tags, operational_status, staffing_level, is_active) VALUES
-- Monday Hotel Schedule
(1, 'hotel', 0, '[06:00,07:00)', 'Early morning property inspection - checking security systems, exterior lighting, and overnight maintenance', ARRAY['morning', 'inspection', 'security'], 'maintenance', 'minimal', true),
(1, 'hotel', 0, '[07:00,08:30)', 'Staff briefing and preparation - reviewing reservations, special requests, and daily operational priorities', ARRAY['morning', 'briefing', 'planning'], 'normal', 'standard', true),
(1, 'hotel', 0, '[08:30,09:30)', 'Breakfast service setup - coordinating with kitchen staff, setting dining areas, and preparing welcome materials', ARRAY['morning', 'breakfast', 'setup'], 'busy', 'standard', true),
(1, 'hotel', 0, '[09:30,12:00)', 'Peak morning operations - handling check-ins, room assignments, guest inquiries, and early departures', ARRAY['busy', 'check-in', 'service'], 'busy', 'peak', true),
(1, 'hotel', 0, '[12:00,13:30)', 'Lunch break coordination - staff meal service, property maintenance checks, and guest service monitoring', ARRAY['lunch', 'staff', 'maintenance'], 'normal', 'standard', true),
(1, 'hotel', 0, '[13:30,17:00)', 'Afternoon operations - housekeeping coordination, maintenance requests, concierge services, and booking management', ARRAY['afternoon', 'housekeeping', 'concierge'], 'normal', 'standard', true),
(1, 'hotel', 0, '[17:00,19:00)', 'Evening preparation - dinner service coordination, evening entertainment setup, and guest arrival management', ARRAY['evening', 'preparation', 'dinner'], 'busy', 'standard', true),
(1, 'hotel', 0, '[19:00,22:00)', 'Peak evening operations - dinner service, bar operations, guest entertainment, and late check-ins', ARRAY['evening', 'busy', 'entertainment'], 'busy', 'peak', true),
(1, 'hotel', 0, '[22:00,23:00)', 'Night audit and security rounds - financial reconciliation, security checks, and overnight preparations', ARRAY['night', 'audit', 'security'], 'normal', 'minimal', true),
(1, 'hotel', 0, '[23:00,06:00)', 'Overnight operations - security monitoring, emergency response readiness, and minimal staffing maintenance', ARRAY['night', 'security', 'emergency'], 'normal', 'minimal', true),

-- Monday Restaurant Schedule
(1, 'restaurant', 0, '[06:00,08:00)', 'Early morning prep - receiving deliveries, inventory checks, and kitchen setup for breakfast service', ARRAY['morning', 'prep', 'inventory'], 'maintenance', 'minimal', true),
(1, 'restaurant', 0, '[08:00,10:00)', 'Breakfast service preparation - final menu planning, staff assignments, and dining room setup', ARRAY['morning', 'breakfast', 'setup'], 'normal', 'standard', true),
(1, 'restaurant', 0, '[10:00,12:00)', 'Mid-morning operations - breakfast service, coffee station management, and lunch prep coordination', ARRAY['morning', 'breakfast', 'coffee'], 'normal', 'standard', true),
(1, 'restaurant', 0, '[12:00,14:00)', 'Peak lunch service - table management, order processing, kitchen coordination, and customer service', ARRAY['busy', 'lunch', 'service'], 'busy', 'peak', true),
(1, 'restaurant', 0, '[14:00,16:00)', 'Afternoon transition - cleaning and reset, staff breaks, and dinner preparation planning', ARRAY['afternoon', 'cleaning', 'transition'], 'maintenance', 'standard', true),
(1, 'restaurant', 0, '[16:00,18:00)', 'Early dinner prep - advanced preparations, special orders coordination, and dining room setup', ARRAY['afternoon', 'prep', 'dinner'], 'normal', 'standard', true),
(1, 'restaurant', 0, '[18:00,21:00)', 'Peak dinner service - full dining operations, bar service, special events, and customer experience management', ARRAY['evening', 'busy', 'dinner'], 'busy', 'peak', true),
(1, 'restaurant', 0, '[21:00,22:30)', 'Late evening service - final orders, bar close, and dining room cleanup coordination', ARRAY['evening', 'closing', 'cleanup'], 'normal', 'standard', true),
(1, 'restaurant', 0, '[22:30,23:30)', 'Closing procedures - final cleaning, inventory counts, financial reconciliation, and security setup', ARRAY['night', 'closing', 'inventory'], 'maintenance', 'minimal', true),
(1, 'restaurant', 0, '[23:30,06:00)', 'Overnight maintenance - equipment shutdown, security monitoring, and preparation for next day deliveries', ARRAY['night', 'maintenance', 'security'], 'maintenance', 'minimal', true);

-- Comments for documentation
COMMENT ON TABLE whatsapp_conversations IS 'WhatsApp-specific message tracking with media support';
COMMENT ON TABLE message_attachments IS 'Multi-modal message attachments (images, audio, documents)';
COMMENT ON TABLE communication_channels IS 'User communication channel preferences and verification';
COMMENT ON TABLE workflow_states IS 'LangGraph workflow state persistence for conversations';
COMMENT ON TABLE ai_memory_store IS 'Vector-based memory storage for AI context and learning';
COMMENT ON TABLE communication_router_logs IS 'Decision logs for multi-modal response routing';
COMMENT ON TABLE multimodal_processing_logs IS 'Processing logs for speech/image/text conversions';
COMMENT ON TABLE activity_schedules IS 'Schedule-based context for AI personality and responses - includes seeded data for Sofia agents';
COMMENT ON TABLE communication_errors IS 'Error tracking and retry management for all channels';
COMMENT ON TABLE channel_performance_metrics IS 'Performance monitoring across all communication channels';
