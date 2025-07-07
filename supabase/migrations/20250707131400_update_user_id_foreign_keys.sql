-- This migration script updates the foreign key constraints on the user_id columns.
-- It changes the reference from the local 'public.users' table to the 'auth.users' table provided by Supabase.
-- This centralizes user management with the authentication service.

-- Note: This script assumes the original foreign key constraints were named following the pattern 'tablename_user_id_fkey'.
-- If a different naming convention was used, these statements will need to be adjusted.

-- Update foreign key for tasks
ALTER TABLE public.tasks DROP CONSTRAINT tasks_user_id_fkey;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Update foreign key for chat_sessions
ALTER TABLE public.chat_sessions DROP CONSTRAINT chat_sessions_user_id_fkey;
ALTER TABLE public.chat_sessions ADD CONSTRAINT chat_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Update foreign key for chat_messages
ALTER TABLE public.chat_messages DROP CONSTRAINT chat_messages_user_id_fkey;
ALTER TABLE public.chat_messages ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Update foreign key for scraped_pages
ALTER TABLE public.scraped_pages DROP CONSTRAINT scraped_pages_user_id_fkey;
ALTER TABLE public.scraped_pages ADD CONSTRAINT scraped_pages_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Update foreign key for page_chunks
ALTER TABLE public.page_chunks DROP CONSTRAINT page_chunks_user_id_fkey;
ALTER TABLE public.page_chunks ADD CONSTRAINT page_chunks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Update foreign key for chat_summaries
ALTER TABLE public.chat_summaries DROP CONSTRAINT chat_summaries_user_id_fkey;
ALTER TABLE public.chat_summaries ADD CONSTRAINT chat_summaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;

-- Finally, establish a foreign key relationship for the public.users table itself.
-- This ensures that every user record in the public table corresponds to a valid user in the auth system.
ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
ALTER TABLE public.users ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) on update CASCADE on delete CASCADE;
