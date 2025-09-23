-- Document Processing System
-- Enhanced document processing with LlamaIndex and LlamaParse

-- Document Processing Log
CREATE TABLE DocumentProcessingLog (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    filename VARCHAR NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    processing_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'processing',
    chunks_created INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Web Crawl Log
CREATE TABLE WebCrawlLog (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    crawl_type VARCHAR(50) NOT NULL,
    urls TEXT[] NOT NULL,
    sitemap_url VARCHAR,
    status VARCHAR(20) NOT NULL DEFAULT 'processing',
    pages_crawled INTEGER DEFAULT 0,
    chunks_created INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Vectors
CREATE TABLE KnowledgeVectors (
    id BIGSERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES HospitalityProperty(property_id) ON DELETE CASCADE,
    knowledge_id UUID REFERENCES KnowledgeBase(knowledge_id) ON DELETE CASCADE,
    chunk_id VARCHAR NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Pages (for web crawling)
CREATE TABLE SitePages (
    id BIGSERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    chunk_number INTEGER NOT NULL,
    title VARCHAR NOT NULL,
    summary VARCHAR NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(url, chunk_number)
);

-- Create indexes for vector similarity search
CREATE INDEX ON KnowledgeVectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX ON SitePages USING ivfflat (embedding vector_cosine_ops);

-- Create updated_at triggers
CREATE TRIGGER update_document_processing_log_updated_at 
    BEFORE UPDATE ON DocumentProcessingLog 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_web_crawl_log_updated_at 
    BEFORE UPDATE ON WebCrawlLog 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
