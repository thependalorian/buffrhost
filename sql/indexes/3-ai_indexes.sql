-- AI and Knowledge Base Indexes
-- Performance indexes for AI and knowledge base tables

-- Knowledge Base Indexes
CREATE INDEX idx_knowledge_base_property ON KnowledgeBase(property_id);
CREATE INDEX idx_knowledge_base_category ON KnowledgeBase(category);
CREATE INDEX idx_knowledge_base_tags ON KnowledgeBase USING GIN(tags);

-- AI Agent Session Indexes
CREATE INDEX idx_ai_agent_session_customer ON AIAgentSession(customer_id);
CREATE INDEX idx_ai_agent_session_property ON AIAgentSession(property_id);
CREATE INDEX idx_ai_agent_session_type ON AIAgentSession(agent_type);
CREATE INDEX idx_ai_agent_session_status ON AIAgentSession(session_status);

-- AI Agent Message Indexes
CREATE INDEX idx_ai_agent_message_session ON AIAgentMessage(session_id);
CREATE INDEX idx_ai_agent_message_type ON AIAgentMessage(message_type);

-- AI Agent Workflow Indexes
CREATE INDEX idx_ai_agent_workflow_type ON AIAgentWorkflow(workflow_type);
CREATE INDEX idx_ai_agent_workflow_active ON AIAgentWorkflow(is_active);

-- AI Agent Execution Indexes
CREATE INDEX idx_ai_agent_execution_workflow ON AIAgentExecution(workflow_id);
CREATE INDEX idx_ai_agent_execution_session ON AIAgentExecution(session_id);
CREATE INDEX idx_ai_agent_execution_status ON AIAgentExecution(execution_status);

-- Document Processing Indexes
CREATE INDEX idx_document_processing_log_property_id ON DocumentProcessingLog(property_id);
CREATE INDEX idx_document_processing_log_status ON DocumentProcessingLog(status);
CREATE INDEX idx_document_processing_log_created_at ON DocumentProcessingLog(created_at);

-- Web Crawl Indexes
CREATE INDEX idx_web_crawl_log_property_id ON WebCrawlLog(property_id);
CREATE INDEX idx_web_crawl_log_status ON WebCrawlLog(status);
CREATE INDEX idx_web_crawl_log_created_at ON WebCrawlLog(created_at);

-- Knowledge Vectors Indexes
CREATE INDEX idx_knowledge_vectors_property_id ON KnowledgeVectors(property_id);
CREATE INDEX idx_knowledge_vectors_knowledge_id ON KnowledgeVectors(knowledge_id);

-- Voice Models Indexes
CREATE INDEX idx_voice_models_property_id ON VoiceModels(property_id);
CREATE INDEX idx_voice_models_type ON VoiceModels(model_type);
CREATE INDEX idx_voice_models_active ON VoiceModels(is_active);

-- Voice Interactions Indexes
CREATE INDEX idx_voice_interactions_property_id ON VoiceInteractions(property_id);
CREATE INDEX idx_voice_interactions_session_id ON VoiceInteractions(session_id);
CREATE INDEX idx_voice_interactions_type ON VoiceInteractions(interaction_type);
CREATE INDEX idx_voice_interactions_created_at ON VoiceInteractions(created_at);

-- Audio Files Indexes
CREATE INDEX idx_audio_files_property_id ON AudioFiles(property_id);
CREATE INDEX idx_audio_files_purpose ON AudioFiles(purpose);
CREATE INDEX idx_audio_files_created_at ON AudioFiles(created_at);
CREATE INDEX idx_audio_files_expires_at ON AudioFiles(expires_at);

-- Site Pages Indexes
CREATE INDEX idx_site_pages_metadata ON SitePages USING GIN(metadata);
