-- =====================================================
-- Langfuse Integration Schema for The Shandi Platform
-- =====================================================
-- This migration creates tables and functions for Langfuse AI observability
-- integration across all microservices in The Shandi platform.
-- 
-- Features:
-- - AI conversation tracing and monitoring
-- - Performance analytics and metrics
-- - Error tracking and debugging
-- - User interaction analytics
-- - Cross-service AI observability
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- Langfuse Core Tables
-- =====================================================

-- Langfuse Projects Table
CREATE TABLE langfuse_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    public_key VARCHAR(255) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    host_url VARCHAR(500) NOT NULL DEFAULT 'https://cloud.langfuse.com',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id)
);

-- Langfuse Sessions Table
CREATE TABLE langfuse_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    session_type VARCHAR(50) NOT NULL DEFAULT 'conversation', -- conversation, booking, support, etc.
    status VARCHAR(50) DEFAULT 'active', -- active, completed, failed, cancelled
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Langfuse Traces Table
CREATE TABLE langfuse_traces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id VARCHAR(255) UNIQUE NOT NULL,
    session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    trace_type VARCHAR(50) NOT NULL DEFAULT 'conversation', -- conversation, booking, payment, etc.
    trace_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Langfuse Generations Table
CREATE TABLE langfuse_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    generation_id VARCHAR(255) UNIQUE NOT NULL,
    trace_id UUID NOT NULL REFERENCES langfuse_traces(id),
    session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    generation_type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, image, audio, video
    model_name VARCHAR(255) NOT NULL,
    model_version VARCHAR(100),
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    cost_usd DECIMAL(10, 6) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Langfuse Observations Table
CREATE TABLE langfuse_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observation_id VARCHAR(255) UNIQUE NOT NULL,
    trace_id UUID NOT NULL REFERENCES langfuse_traces(id),
    session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    observation_type VARCHAR(50) NOT NULL DEFAULT 'span', -- span, event, metric
    observation_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Langfuse Events Table
CREATE TABLE langfuse_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(255) UNIQUE NOT NULL,
    session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    event_type VARCHAR(50) NOT NULL, -- user_interaction, system_event, error, performance
    event_name VARCHAR(255) NOT NULL,
    event_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI Service Integration Tables
-- =====================================================

-- AI Agent Sessions Table
CREATE TABLE ai_agent_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    agent_type VARCHAR(50) NOT NULL DEFAULT 'conversational', -- conversational, booking, support, etc.
    agent_name VARCHAR(255) NOT NULL DEFAULT 'BuffrHost AI Agent',
    model_name VARCHAR(255) NOT NULL DEFAULT 'gpt-4',
    model_version VARCHAR(100),
    system_prompt TEXT,
    context_data JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active', -- active, completed, failed, cancelled
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    total_messages INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(10, 6) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Agent Messages Table
CREATE TABLE ai_agent_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_agent_sessions(id),
    langfuse_session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    message_type VARCHAR(50) NOT NULL DEFAULT 'user', -- user, assistant, system, tool
    content TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user', -- user, assistant, system, tool
    metadata JSONB DEFAULT '{}',
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10, 6) DEFAULT 0.00,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Agent Tools Table
CREATE TABLE ai_agent_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_agent_sessions(id),
    langfuse_session_id UUID NOT NULL REFERENCES langfuse_sessions(id),
    tool_name VARCHAR(255) NOT NULL,
    tool_type VARCHAR(50) NOT NULL, -- function, api_call, database_query, etc.
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    execution_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Performance and Analytics Tables
-- =====================================================

-- Langfuse Performance Metrics Table
CREATE TABLE langfuse_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    metric_type VARCHAR(50) NOT NULL, -- response_time, token_usage, cost, error_rate
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15, 6) NOT NULL,
    metric_unit VARCHAR(50), -- ms, tokens, usd, percentage
    aggregation_type VARCHAR(50) DEFAULT 'average', -- average, sum, min, max, count
    time_period VARCHAR(50) DEFAULT 'hour', -- minute, hour, day, week, month
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Langfuse Error Logs Table
CREATE TABLE langfuse_error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES langfuse_sessions(id),
    trace_id UUID REFERENCES langfuse_traces(id),
    project_id UUID NOT NULL REFERENCES langfuse_projects(id),
    user_id UUID REFERENCES profiles(id),
    property_id UUID REFERENCES hospitality_properties(id),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    error_context JSONB DEFAULT '{}',
    severity VARCHAR(20) DEFAULT 'error', -- info, warning, error, critical
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES profiles(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Langfuse Projects Indexes
CREATE INDEX idx_langfuse_projects_project_id ON langfuse_projects(project_id);
CREATE INDEX idx_langfuse_projects_is_active ON langfuse_projects(is_active);
CREATE INDEX idx_langfuse_projects_created_at ON langfuse_projects(created_at);

-- Langfuse Sessions Indexes
CREATE INDEX idx_langfuse_sessions_session_id ON langfuse_sessions(session_id);
CREATE INDEX idx_langfuse_sessions_project_id ON langfuse_sessions(project_id);
CREATE INDEX idx_langfuse_sessions_user_id ON langfuse_sessions(user_id);
CREATE INDEX idx_langfuse_sessions_property_id ON langfuse_sessions(property_id);
CREATE INDEX idx_langfuse_sessions_status ON langfuse_sessions(status);
CREATE INDEX idx_langfuse_sessions_started_at ON langfuse_sessions(started_at);
CREATE INDEX idx_langfuse_sessions_session_type ON langfuse_sessions(session_type);

-- Langfuse Traces Indexes
CREATE INDEX idx_langfuse_traces_trace_id ON langfuse_traces(trace_id);
CREATE INDEX idx_langfuse_traces_session_id ON langfuse_traces(session_id);
CREATE INDEX idx_langfuse_traces_project_id ON langfuse_traces(project_id);
CREATE INDEX idx_langfuse_traces_user_id ON langfuse_traces(user_id);
CREATE INDEX idx_langfuse_traces_property_id ON langfuse_traces(property_id);
CREATE INDEX idx_langfuse_traces_status ON langfuse_traces(status);
CREATE INDEX idx_langfuse_traces_start_time ON langfuse_traces(start_time);
CREATE INDEX idx_langfuse_traces_trace_type ON langfuse_traces(trace_type);

-- Langfuse Generations Indexes
CREATE INDEX idx_langfuse_generations_generation_id ON langfuse_generations(generation_id);
CREATE INDEX idx_langfuse_generations_trace_id ON langfuse_generations(trace_id);
CREATE INDEX idx_langfuse_generations_session_id ON langfuse_generations(session_id);
CREATE INDEX idx_langfuse_generations_project_id ON langfuse_generations(project_id);
CREATE INDEX idx_langfuse_generations_model_name ON langfuse_generations(model_name);
CREATE INDEX idx_langfuse_generations_start_time ON langfuse_generations(start_time);

-- Langfuse Observations Indexes
CREATE INDEX idx_langfuse_observations_observation_id ON langfuse_observations(observation_id);
CREATE INDEX idx_langfuse_observations_trace_id ON langfuse_observations(trace_id);
CREATE INDEX idx_langfuse_observations_session_id ON langfuse_observations(session_id);
CREATE INDEX idx_langfuse_observations_project_id ON langfuse_observations(project_id);
CREATE INDEX idx_langfuse_observations_observation_type ON langfuse_observations(observation_type);
CREATE INDEX idx_langfuse_observations_start_time ON langfuse_observations(start_time);

-- Langfuse Events Indexes
CREATE INDEX idx_langfuse_events_event_id ON langfuse_events(event_id);
CREATE INDEX idx_langfuse_events_session_id ON langfuse_events(session_id);
CREATE INDEX idx_langfuse_events_project_id ON langfuse_events(project_id);
CREATE INDEX idx_langfuse_events_user_id ON langfuse_events(user_id);
CREATE INDEX idx_langfuse_events_property_id ON langfuse_events(property_id);
CREATE INDEX idx_langfuse_events_event_type ON langfuse_events(event_type);
CREATE INDEX idx_langfuse_events_timestamp ON langfuse_events(timestamp);

-- AI Agent Sessions Indexes
CREATE INDEX idx_ai_agent_sessions_session_id ON ai_agent_sessions(session_id);
CREATE INDEX idx_ai_agent_sessions_agent_type ON ai_agent_sessions(agent_type);
CREATE INDEX idx_ai_agent_sessions_model_name ON ai_agent_sessions(model_name);
CREATE INDEX idx_ai_agent_sessions_status ON ai_agent_sessions(status);
CREATE INDEX idx_ai_agent_sessions_started_at ON ai_agent_sessions(started_at);

-- AI Agent Messages Indexes
CREATE INDEX idx_ai_agent_messages_session_id ON ai_agent_messages(session_id);
CREATE INDEX idx_ai_agent_messages_langfuse_session_id ON ai_agent_messages(langfuse_session_id);
CREATE INDEX idx_ai_agent_messages_message_type ON ai_agent_messages(message_type);
CREATE INDEX idx_ai_agent_messages_timestamp ON ai_agent_messages(timestamp);

-- AI Agent Tools Indexes
CREATE INDEX idx_ai_agent_tools_session_id ON ai_agent_tools(session_id);
CREATE INDEX idx_ai_agent_tools_langfuse_session_id ON ai_agent_tools(langfuse_session_id);
CREATE INDEX idx_ai_agent_tools_tool_name ON ai_agent_tools(tool_name);
CREATE INDEX idx_ai_agent_tools_tool_type ON ai_agent_tools(tool_type);
CREATE INDEX idx_ai_agent_tools_status ON ai_agent_tools(status);
CREATE INDEX idx_ai_agent_tools_timestamp ON ai_agent_tools(timestamp);

-- Performance Metrics Indexes
CREATE INDEX idx_langfuse_performance_metrics_project_id ON langfuse_performance_metrics(project_id);
CREATE INDEX idx_langfuse_performance_metrics_metric_type ON langfuse_performance_metrics(metric_type);
CREATE INDEX idx_langfuse_performance_metrics_timestamp ON langfuse_performance_metrics(timestamp);
CREATE INDEX idx_langfuse_performance_metrics_time_period ON langfuse_performance_metrics(time_period);

-- Error Logs Indexes
CREATE INDEX idx_langfuse_error_logs_session_id ON langfuse_error_logs(session_id);
CREATE INDEX idx_langfuse_error_logs_trace_id ON langfuse_error_logs(trace_id);
CREATE INDEX idx_langfuse_error_logs_project_id ON langfuse_error_logs(project_id);
CREATE INDEX idx_langfuse_error_logs_user_id ON langfuse_error_logs(user_id);
CREATE INDEX idx_langfuse_error_logs_property_id ON langfuse_error_logs(property_id);
CREATE INDEX idx_langfuse_error_logs_error_type ON langfuse_error_logs(error_type);
CREATE INDEX idx_langfuse_error_logs_severity ON langfuse_error_logs(severity);
CREATE INDEX idx_langfuse_error_logs_resolved ON langfuse_error_logs(resolved);
CREATE INDEX idx_langfuse_error_logs_timestamp ON langfuse_error_logs(timestamp);

-- =====================================================
-- Functions and Triggers
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_langfuse_projects_updated_at BEFORE UPDATE ON langfuse_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_langfuse_sessions_updated_at BEFORE UPDATE ON langfuse_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_langfuse_traces_updated_at BEFORE UPDATE ON langfuse_traces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_langfuse_generations_updated_at BEFORE UPDATE ON langfuse_generations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_langfuse_observations_updated_at BEFORE UPDATE ON langfuse_observations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_agent_sessions_updated_at BEFORE UPDATE ON ai_agent_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate trace duration
CREATE OR REPLACE FUNCTION calculate_trace_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL THEN
        NEW.duration_ms = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) * 1000;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for duration calculation
CREATE TRIGGER calculate_langfuse_traces_duration BEFORE UPDATE ON langfuse_traces FOR EACH ROW EXECUTE FUNCTION calculate_trace_duration();
CREATE TRIGGER calculate_langfuse_generations_duration BEFORE UPDATE ON langfuse_generations FOR EACH ROW EXECUTE FUNCTION calculate_trace_duration();
CREATE TRIGGER calculate_langfuse_observations_duration BEFORE UPDATE ON langfuse_observations FOR EACH ROW EXECUTE FUNCTION calculate_trace_duration();
CREATE TRIGGER calculate_ai_agent_tools_duration BEFORE UPDATE ON ai_agent_tools FOR EACH ROW EXECUTE FUNCTION calculate_trace_duration();

-- Function to update session statistics
CREATE OR REPLACE FUNCTION update_session_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update AI agent session statistics
    IF TG_TABLE_NAME = 'ai_agent_messages' THEN
        UPDATE ai_agent_sessions 
        SET 
            total_messages = total_messages + 1,
            total_tokens = total_tokens + COALESCE(NEW.tokens_used, 0),
            total_cost_usd = total_cost_usd + COALESCE(NEW.cost_usd, 0.00),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.session_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for session statistics
CREATE TRIGGER update_ai_agent_session_stats AFTER INSERT ON ai_agent_messages FOR EACH ROW EXECUTE FUNCTION update_session_statistics();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE langfuse_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_traces ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE langfuse_error_logs ENABLE ROW LEVEL SECURITY;

-- Langfuse Projects Policies
CREATE POLICY "Users can view langfuse projects" ON langfuse_projects
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can manage langfuse projects" ON langfuse_projects
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role = 'admin'
        )
    );

-- Langfuse Sessions Policies
CREATE POLICY "Users can view their own sessions" ON langfuse_sessions
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create sessions" ON langfuse_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Langfuse Traces Policies
CREATE POLICY "Users can view their own traces" ON langfuse_traces
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create traces" ON langfuse_traces
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Langfuse Generations Policies
CREATE POLICY "Users can view their own generations" ON langfuse_generations
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create generations" ON langfuse_generations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Langfuse Observations Policies
CREATE POLICY "Users can view their own observations" ON langfuse_observations
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create observations" ON langfuse_observations
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Langfuse Events Policies
CREATE POLICY "Users can view their own events" ON langfuse_events
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create events" ON langfuse_events
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- AI Agent Sessions Policies
CREATE POLICY "Users can view their own AI sessions" ON ai_agent_sessions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create AI sessions" ON ai_agent_sessions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- AI Agent Messages Policies
CREATE POLICY "Users can view their own AI messages" ON ai_agent_messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = langfuse_session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create AI messages" ON ai_agent_messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = langfuse_session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- AI Agent Tools Policies
CREATE POLICY "Users can view their own AI tools" ON ai_agent_tools
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = langfuse_session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create AI tools" ON ai_agent_tools
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM langfuse_sessions WHERE id = langfuse_session_id
        ) OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Performance Metrics Policies
CREATE POLICY "Admins can view performance metrics" ON langfuse_performance_metrics
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can create performance metrics" ON langfuse_performance_metrics
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- Error Logs Policies
CREATE POLICY "Users can view their own error logs" ON langfuse_error_logs
    FOR SELECT USING (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

CREATE POLICY "Users can create error logs" ON langfuse_error_logs
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        auth.uid() IN (
            SELECT id FROM profiles WHERE user_role IN ('admin', 'manager')
        )
    );

-- =====================================================
-- Sample Data for Development
-- =====================================================

-- Insert sample Langfuse project
INSERT INTO langfuse_projects (
    project_id,
    name,
    description,
    public_key,
    secret_key,
    host_url,
    is_active
) VALUES (
    'the-shandi-ai',
    'The Shandi AI Observability',
    'Langfuse integration for The Shandi hospitality platform AI services',
    'pk-lf-sample-public-key',
    'sk-lf-sample-secret-key',
    'https://cloud.langfuse.com',
    TRUE
);

-- =====================================================
-- Views for Analytics
-- =====================================================

-- View for AI session analytics
CREATE VIEW ai_session_analytics AS
SELECT 
    s.id as session_id,
    s.session_id as langfuse_session_id,
    s.user_id,
    s.property_id,
    s.session_type,
    s.status,
    s.started_at,
    s.ended_at,
    EXTRACT(EPOCH FROM (s.ended_at - s.started_at)) as duration_seconds,
    COUNT(t.id) as total_traces,
    COUNT(g.id) as total_generations,
    SUM(g.total_tokens) as total_tokens,
    SUM(g.cost_usd) as total_cost_usd,
    COUNT(m.id) as total_messages
FROM langfuse_sessions s
LEFT JOIN langfuse_traces t ON s.id = t.session_id
LEFT JOIN langfuse_generations g ON t.id = g.trace_id
LEFT JOIN ai_agent_messages m ON s.id = m.langfuse_session_id
GROUP BY s.id, s.session_id, s.user_id, s.property_id, s.session_type, s.status, s.started_at, s.ended_at;

-- View for performance metrics summary
CREATE VIEW langfuse_performance_summary AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    DATE_TRUNC('hour', pm.timestamp) as hour,
    pm.metric_type,
    AVG(pm.metric_value) as avg_value,
    MIN(pm.metric_value) as min_value,
    MAX(pm.metric_value) as max_value,
    COUNT(*) as sample_count
FROM langfuse_projects p
JOIN langfuse_performance_metrics pm ON p.id = pm.project_id
GROUP BY p.id, p.name, DATE_TRUNC('hour', pm.timestamp), pm.metric_type
ORDER BY hour DESC, pm.metric_type;

-- View for error analysis
CREATE VIEW langfuse_error_analysis AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    el.error_type,
    el.severity,
    COUNT(*) as error_count,
    COUNT(CASE WHEN el.resolved = TRUE THEN 1 END) as resolved_count,
    COUNT(CASE WHEN el.resolved = FALSE THEN 1 END) as unresolved_count,
    DATE_TRUNC('day', el.timestamp) as error_date
FROM langfuse_projects p
JOIN langfuse_error_logs el ON p.id = el.project_id
GROUP BY p.id, p.name, el.error_type, el.severity, DATE_TRUNC('day', el.timestamp)
ORDER BY error_date DESC, error_count DESC;

-- =====================================================
-- Comments and Documentation
-- =====================================================

COMMENT ON TABLE langfuse_projects IS 'Langfuse project configurations for AI observability';
COMMENT ON TABLE langfuse_sessions IS 'AI conversation and interaction sessions';
COMMENT ON TABLE langfuse_traces IS 'Individual AI operation traces with timing and metadata';
COMMENT ON TABLE langfuse_generations IS 'AI model generations with token usage and costs';
COMMENT ON TABLE langfuse_observations IS 'Detailed observations within traces';
COMMENT ON TABLE langfuse_events IS 'Events and interactions tracked by Langfuse';
COMMENT ON TABLE ai_agent_sessions IS 'AI agent conversation sessions';
COMMENT ON TABLE ai_agent_messages IS 'Individual messages in AI conversations';
COMMENT ON TABLE ai_agent_tools IS 'AI agent tool usage and execution';
COMMENT ON TABLE langfuse_performance_metrics IS 'Performance metrics and analytics';
COMMENT ON TABLE langfuse_error_logs IS 'Error logs and debugging information';

COMMENT ON COLUMN langfuse_projects.project_id IS 'Unique Langfuse project identifier';
COMMENT ON COLUMN langfuse_projects.public_key IS 'Langfuse public API key';
COMMENT ON COLUMN langfuse_projects.secret_key IS 'Langfuse secret API key';
COMMENT ON COLUMN langfuse_projects.host_url IS 'Langfuse host URL (default: cloud.langfuse.com)';

COMMENT ON COLUMN langfuse_sessions.session_id IS 'Unique session identifier from Langfuse';
COMMENT ON COLUMN langfuse_sessions.session_type IS 'Type of session: conversation, booking, support, etc.';
COMMENT ON COLUMN langfuse_sessions.status IS 'Session status: active, completed, failed, cancelled';

COMMENT ON COLUMN langfuse_traces.trace_id IS 'Unique trace identifier from Langfuse';
COMMENT ON COLUMN langfuse_traces.trace_type IS 'Type of trace: conversation, booking, payment, etc.';
COMMENT ON COLUMN langfuse_traces.duration_ms IS 'Trace duration in milliseconds';
COMMENT ON COLUMN langfuse_traces.tokens_used IS 'Total tokens used in this trace';
COMMENT ON COLUMN langfuse_traces.cost_usd IS 'Cost in USD for this trace';

COMMENT ON COLUMN langfuse_generations.generation_id IS 'Unique generation identifier from Langfuse';
COMMENT ON COLUMN langfuse_generations.generation_type IS 'Type of generation: text, image, audio, video';
COMMENT ON COLUMN langfuse_generations.model_name IS 'AI model name used for generation';
COMMENT ON COLUMN langfuse_generations.prompt_tokens IS 'Number of tokens in the prompt';
COMMENT ON COLUMN langfuse_generations.completion_tokens IS 'Number of tokens in the completion';
COMMENT ON COLUMN langfuse_generations.total_tokens IS 'Total tokens used (prompt + completion)';

COMMENT ON COLUMN ai_agent_sessions.agent_type IS 'Type of AI agent: conversational, booking, support, etc.';
COMMENT ON COLUMN ai_agent_sessions.model_name IS 'AI model name used by the agent';
COMMENT ON COLUMN ai_agent_sessions.system_prompt IS 'System prompt used by the AI agent';
COMMENT ON COLUMN ai_agent_sessions.total_messages IS 'Total number of messages in the session';
COMMENT ON COLUMN ai_agent_sessions.total_tokens IS 'Total tokens used in the session';
COMMENT ON COLUMN ai_agent_sessions.total_cost_usd IS 'Total cost in USD for the session';

-- =====================================================
-- Migration Complete
-- =====================================================

-- Log the migration completion
INSERT INTO audit_logs (
    table_name,
    operation,
    details,
    performed_by
) VALUES (
    'langfuse_integration',
    'CREATE_SCHEMA',
    'Created complete Langfuse integration schema with tables, indexes, triggers, RLS policies, and sample data',
    'system'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Langfuse integration schema created successfully!';
    RAISE NOTICE '📊 Created % tables for AI observability', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'langfuse_%' OR table_name LIKE 'ai_agent_%'
    );
    RAISE NOTICE '🔒 RLS policies enabled for data security';
    RAISE NOTICE '📈 Analytics views created for performance monitoring';
    RAISE NOTICE '🚀 Ready for Langfuse AI observability integration!';
END $$;