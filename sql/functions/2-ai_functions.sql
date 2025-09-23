-- AI Functions
-- Functions for AI agent operations and vector search

-- Match site pages for vector similarity search
CREATE OR REPLACE FUNCTION match_site_pages (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 10,
  filter JSONB DEFAULT '{}'::jsonb
) RETURNS TABLE (
  id BIGINT,
  url VARCHAR,
  chunk_number INTEGER,
  title VARCHAR,
  summary VARCHAR,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    id,
    url,
    chunk_number,
    title,
    summary,
    content,
    metadata,
    1 - (SitePages.embedding <=> query_embedding) AS similarity
  FROM SitePages
  WHERE metadata @> filter
  ORDER BY SitePages.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Match knowledge vectors for AI search
CREATE OR REPLACE FUNCTION match_knowledge_vectors (
  query_embedding VECTOR(1536),
  property_id_filter INTEGER DEFAULT NULL,
  match_count INT DEFAULT 10,
  similarity_threshold FLOAT DEFAULT 0.7
) RETURNS TABLE (
  id BIGINT,
  property_id INTEGER,
  knowledge_id UUID,
  chunk_id VARCHAR,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
  RETURN QUERY
  SELECT
    kv.id,
    kv.property_id,
    kv.knowledge_id,
    kv.chunk_id,
    kv.content,
    kv.metadata,
    1 - (kv.embedding <=> query_embedding) AS similarity
  FROM KnowledgeVectors kv
  WHERE (property_id_filter IS NULL OR kv.property_id = property_id_filter)
    AND (1 - (kv.embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY kv.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Execute SQL RPC function for AI agents
CREATE OR REPLACE FUNCTION execute_sql_rpc(
  sql_query TEXT,
  user_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  rec RECORD;
  rows JSONB := '[]'::jsonb;
BEGIN
  -- Basic security check - only allow SELECT statements
  IF NOT (sql_query ILIKE 'SELECT%' OR sql_query ILIKE 'WITH%') THEN
    RETURN jsonb_build_object('error', 'Only SELECT statements are allowed');
  END IF;
  
  -- Execute the query
  FOR rec IN EXECUTE sql_query LOOP
    rows := rows || to_jsonb(rec);
  END LOOP;
  
  result := jsonb_build_object(
    'success', true,
    'data', rows,
    'count', jsonb_array_length(rows)
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;
