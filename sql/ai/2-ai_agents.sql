-- AI Agent System
-- Advanced AI agent management and workflow execution

-- This file contains the AI agent tables that were already defined
-- in the knowledge_base.sql file. This is a placeholder for additional
-- AI agent functionality that might be needed in the future.

-- Additional AI Agent Configuration
CREATE TABLE AIAgentConfig (
    config_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    config_type VARCHAR(50) NOT NULL,
    config_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- AI Agent Analytics
CREATE TABLE AIAgentAnalytics (
    analytics_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    session_id UUID REFERENCES AIAgentSession(session_id),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC(10,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE TRIGGER update_ai_agent_config_updated_at 
    BEFORE UPDATE ON AIAgentConfig 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
