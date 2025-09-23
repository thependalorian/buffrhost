-- AI Knowledge Base System
-- Knowledge management for AI agents and receptionist functionality

-- Knowledge Base
CREATE TABLE KnowledgeBase (
    knowledge_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text',
    tags TEXT[],
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- AI Agent Sessions
CREATE TABLE AIAgentSession (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES Customer(customer_id),
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    agent_type ai_agent_type_enum NOT NULL,
    session_status ai_session_status_enum DEFAULT 'active',
    language VARCHAR(10) DEFAULT 'en',
    user_intent VARCHAR(100),
    context_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    transferred_to_human BOOLEAN DEFAULT FALSE,
    satisfaction_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agent Messages
CREATE TABLE AIAgentMessage (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    message_type ai_message_type_enum NOT NULL,
    content TEXT NOT NULL,
    intent_detected VARCHAR(100),
    entities_extracted JSONB,
    confidence_score DECIMAL(3,2),
    response_time_ms INTEGER,
    model_used VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Agent Workflows
CREATE TABLE AIAgentWorkflow (
    workflow_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type ai_workflow_type_enum NOT NULL,
    description TEXT,
    workflow_definition JSONB NOT NULL,
    input_schema JSONB,
    output_schema JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- AI Agent Executions
CREATE TABLE AIAgentExecution (
    execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES AIAgentWorkflow(workflow_id) ON DELETE CASCADE,
    session_id UUID REFERENCES AIAgentSession(session_id) ON DELETE CASCADE,
    execution_status ai_execution_status_enum DEFAULT 'running',
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    execution_time_ms INTEGER,
    steps_completed INTEGER DEFAULT 0,
    total_steps INTEGER,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create updated_at triggers
CREATE TRIGGER update_knowledge_base_updated_at 
    BEFORE UPDATE ON KnowledgeBase 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_agent_workflow_updated_at 
    BEFORE UPDATE ON AIAgentWorkflow 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
