-- supabase/migrations/20240704150800_create_page_chunks_table.sql

-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the page_chunks table
CREATE TABLE IF NOT EXISTS public.page_chunks (
    id uuid not null default gen_random_uuid (),
    scraped_page_id uuid NOT NULL,
    chunk_text TEXT,
    embedding public.vector(1536), -- Assuming OpenAI's text-embedding-ada-002 model (1536 dimensions)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,

    CONSTRAINT page_chunks_pkey PRIMARY KEY (id),
    CONSTRAINT fk_scraped_page
        FOREIGN KEY(scraped_page_id) 
        REFERENCES public.scraped_pages(id)
        ON DELETE CASCADE
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.page_chunks IS 'Stores text chunks and their corresponding vector embeddings from scraped pages.';
COMMENT ON COLUMN public.page_chunks.id IS 'Unique identifier for each text chunk.';
COMMENT ON COLUMN public.page_chunks.scraped_page_id IS 'Foreign key referencing the scraped_pages table.';
COMMENT ON COLUMN public.page_chunks.chunk_text IS 'The text content of the chunk.';
COMMENT ON COLUMN public.page_chunks.embedding IS 'The vector embedding of the chunk_text.';
COMMENT ON COLUMN public.page_chunks.created_at IS 'Timestamp of when the record was created.';

-- Create an index on the scraped_page_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_page_chunks_scraped_page_id ON public.page_chunks(scraped_page_id);
