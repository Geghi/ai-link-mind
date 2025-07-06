-- Create the 'tasks' table
CREATE TABLE public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    website_basename text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add foreign key constraints to existing tables
-- Note: This assumes that existing task_id values in these tables
-- are valid UUIDs and will either be pre-populated in the 'tasks' table
-- or that this migration is run on a fresh database.
-- In a production scenario with existing data, a data migration step
-- would be necessary to populate the 'tasks' table before adding FKs.

-- Add foreign key to scraped_pages
ALTER TABLE public.scraped_pages
ADD CONSTRAINT scraped_pages_task_id_fkey
FOREIGN KEY (task_id) REFERENCES public.tasks(id)
ON DELETE CASCADE;

-- Add foreign key to chat_sessions
ALTER TABLE public.chat_sessions
ADD CONSTRAINT chat_sessions_task_id_fkey
FOREIGN KEY (task_id) REFERENCES public.tasks(id)
ON DELETE CASCADE;

-- Add foreign key to chat_summaries
ALTER TABLE public.chat_summaries
ADD CONSTRAINT chat_summaries_task_id_fkey
FOREIGN KEY (task_id) REFERENCES public.tasks(id)
ON DELETE CASCADE;
