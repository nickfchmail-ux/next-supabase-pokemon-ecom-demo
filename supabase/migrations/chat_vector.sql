-- Run this in Supabase SQL Editor:
-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a vector table for chat embeddings
CREATE TABLE IF NOT EXISTS chat_embeddings (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536),  -- OpenAI embedding dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for fast vector similarity search
CREATE INDEX IF NOT EXISTS chat_embeddings_vector_idx 
  ON chat_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Function to search similar content
CREATE OR REPLACE FUNCTION match_chat_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE(
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    chat_embeddings.id,
    chat_embeddings.content,
    chat_embeddings.metadata,
    1 - (chat_embeddings.embedding <=> query_embedding) AS similarity
  FROM chat_embeddings
  WHERE 1 - (chat_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY chat_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
