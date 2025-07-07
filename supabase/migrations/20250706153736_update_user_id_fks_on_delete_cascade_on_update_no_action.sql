-- Drop existing foreign key constraints and re-add with ON DELETE CASCADE and ON UPDATE CASCADE

-- tasks table
ALTER TABLE public.tasks
DROP CONSTRAINT tasks_user_id_fkey;

ALTER TABLE public.tasks
ADD CONSTRAINT tasks_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- chat_sessions table
ALTER TABLE public.chat_sessions
DROP CONSTRAINT chat_sessions_user_id_fkey;

ALTER TABLE public.chat_sessions
ADD CONSTRAINT chat_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- scraped_pages table
ALTER TABLE public.scraped_pages
DROP CONSTRAINT scraped_pages_user_id_fkey;

ALTER TABLE public.scraped_pages
ADD CONSTRAINT scraped_pages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- page_chunks table
ALTER TABLE public.page_chunks
DROP CONSTRAINT page_chunks_user_id_fkey;

ALTER TABLE public.page_chunks
ADD CONSTRAINT page_chunks_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- chat_messages table
ALTER TABLE public.chat_messages
DROP CONSTRAINT chat_messages_user_id_fkey;

ALTER TABLE public.chat_messages
ADD CONSTRAINT chat_messages_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- chat_summaries table
ALTER TABLE public.chat_summaries
DROP CONSTRAINT chat_summaries_user_id_fkey;

ALTER TABLE public.chat_summaries
ADD CONSTRAINT chat_summaries_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id)
ON DELETE CASCADE
ON UPDATE CASCADE;
