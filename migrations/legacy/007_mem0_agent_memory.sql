-- =====================================================
-- 007_mem0_agent_memory.sql
-- Mem0 Agent Memory Migration
-- =====================================================
-- This migration sets up Mem0 agent memory system with:
-- - pgvector extension for vector embeddings
-- - agent_memories table with tenant isolation
-- - Vector indexes for efficient similarity search
-- - RLS policies for multi-tenant security

-- =====================================================
-- 1. ENABLE PGVECTOR EXTENSION
-- =====================================================

-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 2. CREATE AGENT MEMORIES TABLE
-- =====================================================

-- Mem0 memories table with tenant isolation
CREATE TABLE IF NOT EXISTS agent_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    memory_text TEXT NOT NULL,
    embedding vector(1536), -- Adjust dimensions based on model (OpenAI: 1536, Deepseek: 1024)
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CREATE INDEXES FOR EFFICIENT MEMORY RETRIEVAL
-- =====================================================

-- User-based indexes
CREATE INDEX IF NOT EXISTS idx_agent_memories_user ON agent_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_tenant ON agent_memories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_created ON agent_memories(created_at);

-- Vector similarity search index using ivfflat
-- This enables fast similarity search for memory retrieval
CREATE INDEX IF NOT EXISTS idx_agent_memories_embedding ON agent_memories 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_agent_memories_user_tenant ON agent_memories(user_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_agent_memories_tenant_created ON agent_memories(tenant_id, created_at);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS for tenant isolation
ALTER TABLE agent_memories ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policy
CREATE POLICY "agent_memories_tenant_policy" ON agent_memories
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- =====================================================
-- 5. CREATE HELPER FUNCTIONS FOR MEMORY OPERATIONS
-- =====================================================

-- Function to search memories by similarity
CREATE OR REPLACE FUNCTION search_memories_by_similarity(
    p_user_id VARCHAR(255),
    p_tenant_id UUID,
    p_query_embedding vector(1536),
    p_limit INTEGER DEFAULT 5,
    p_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
    id UUID,
    memory_text TEXT,
    similarity FLOAT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        am.id,
        am.memory_text,
        1 - (am.embedding <=> p_query_embedding) AS similarity,
        am.metadata,
        am.created_at
    FROM agent_memories am
    WHERE am.user_id = p_user_id 
        AND am.tenant_id = p_tenant_id
        AND am.embedding IS NOT NULL
        AND (1 - (am.embedding <=> p_query_embedding)) > p_threshold
    ORDER BY am.embedding <=> p_query_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent memories for a user
CREATE OR REPLACE FUNCTION get_recent_memories(
    p_user_id VARCHAR(255),
    p_tenant_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    memory_text TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        am.id,
        am.memory_text,
        am.metadata,
        am.created_at
    FROM agent_memories am
    WHERE am.user_id = p_user_id 
        AND am.tenant_id = p_tenant_id
    ORDER BY am.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old memories (for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_memories(
    p_tenant_id UUID,
    p_days_old INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM agent_memories 
    WHERE tenant_id = p_tenant_id 
        AND created_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_agent_memories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_agent_memories_updated_at
    BEFORE UPDATE ON agent_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_memories_updated_at();

-- =====================================================
-- 7. CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user memory statistics
CREATE OR REPLACE VIEW user_memory_stats AS
SELECT 
    user_id,
    tenant_id,
    COUNT(*) as total_memories,
    COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) as memories_with_embeddings,
    MIN(created_at) as first_memory,
    MAX(created_at) as last_memory,
    AVG(LENGTH(memory_text)) as avg_memory_length
FROM agent_memories
GROUP BY user_id, tenant_id;

-- View for tenant memory statistics
CREATE OR REPLACE VIEW tenant_memory_stats AS
SELECT 
    tenant_id,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_memories,
    COUNT(CASE WHEN embedding IS NOT NULL THEN 1 END) as memories_with_embeddings,
    AVG(LENGTH(memory_text)) as avg_memory_length,
    MIN(created_at) as first_memory,
    MAX(created_at) as last_memory
FROM agent_memories
GROUP BY tenant_id;

-- =====================================================
-- 8. INSERT DEFAULT CONFIGURATION
-- =====================================================

-- Create a configuration table for Mem0 settings
CREATE TABLE IF NOT EXISTS mem0_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, config_key)
);

-- Enable RLS for config table
ALTER TABLE mem0_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for config
CREATE POLICY "mem0_config_tenant_policy" ON mem0_config
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Insert default Mem0 configuration
INSERT INTO mem0_config (tenant_id, config_key, config_value) VALUES
-- Global default config (tenant_id = NULL for global defaults)
(NULL, 'default_embedding_model', '{"model": "text-embedding-ada-002", "dimensions": 1536}'),
(NULL, 'default_similarity_threshold', '{"threshold": 0.7}'),
(NULL, 'default_max_memories', '{"limit": 1000}'),
(NULL, 'default_cleanup_days', '{"days": 365}');

-- =====================================================
-- 9. CREATE MAINTENANCE PROCEDURES
-- =====================================================

-- Procedure to optimize vector indexes
CREATE OR REPLACE PROCEDURE optimize_memory_indexes()
LANGUAGE plpgsql AS $$
BEGIN
    -- Reindex the vector index for better performance
    REINDEX INDEX idx_agent_memories_embedding;
    
    -- Update table statistics
    ANALYZE agent_memories;
    
    RAISE NOTICE 'Memory indexes optimized successfully';
END;
$$;

-- Procedure to vacuum and analyze memory tables
CREATE OR REPLACE PROCEDURE maintain_memory_tables()
LANGUAGE plpgsql AS $$
BEGIN
    -- Vacuum the memories table
    VACUUM ANALYZE agent_memories;
    
    -- Vacuum the config table
    VACUUM ANALYZE mem0_config;
    
    RAISE NOTICE 'Memory tables maintained successfully';
END;
$$;

-- =====================================================
-- 10. CREATE SECURITY FUNCTIONS
-- =====================================================

-- Function to verify tenant access to memories
CREATE OR REPLACE FUNCTION verify_memory_access(
    p_user_id VARCHAR(255),
    p_tenant_id UUID,
    p_memory_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    access_granted BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM agent_memories 
        WHERE id = p_memory_id 
            AND user_id = p_user_id 
            AND tenant_id = p_tenant_id
    ) INTO access_granted;
    
    RETURN access_granted;
END;
$$ LANGUAGE plpgsql;

-- Function to get memory count for a user (for rate limiting)
CREATE OR REPLACE FUNCTION get_user_memory_count(
    p_user_id VARCHAR(255),
    p_tenant_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    memory_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO memory_count
    FROM agent_memories
    WHERE user_id = p_user_id AND tenant_id = p_tenant_id;
    
    RETURN memory_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- This migration sets up Mem0 agent memory system with:
-- - pgvector extension for vector embeddings
-- - agent_memories table with tenant isolation
-- - Vector similarity search capabilities
-- - Helper functions for memory operations
-- - RLS policies for multi-tenant security
-- - Maintenance procedures
-- - Configuration management
-- - Security functions for access control
-- - Performance optimization features
