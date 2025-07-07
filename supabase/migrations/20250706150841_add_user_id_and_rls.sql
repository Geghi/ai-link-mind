
-- Create the users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Add user_id column to chat_sessions table
ALTER TABLE public.chat_sessions
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Add user_id column to tasks table
ALTER TABLE public.tasks
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Add user_id column to scraped_pages table
ALTER TABLE public.scraped_pages
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Add user_id column to page_chunks table
ALTER TABLE public.page_chunks
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Add user_id column to chat_messages table
ALTER TABLE public.chat_messages
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Add user_id column to chat_summaries table
ALTER TABLE public.chat_summaries
ADD COLUMN user_id UUID REFERENCES public.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous user to see their own ID" ON public.users;
DROP POLICY IF EXISTS "Allow anonymous user to view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anonymous user to update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anonymous user to view their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous user to update their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous user to view their own scraped pages" ON public.scraped_pages;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own scraped pages" ON public.scraped_pages;
DROP POLICY IF EXISTS "Allow anonymous user to update their own scraped pages" ON public.scraped_pages;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own scraped pages" ON public.scraped_pages;
DROP POLICY IF EXISTS "Allow anonymous user to view their own page chunks" ON public.page_chunks;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own page chunks" ON public.page_chunks;
DROP POLICY IF EXISTS "Allow anonymous user to update their own page chunks" ON public.page_chunks;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own page chunks" ON public.page_chunks;
DROP POLICY IF EXISTS "Allow anonymous user to view their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anonymous user to update their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Allow anonymous user to view their own chat summaries" ON public.chat_summaries;
DROP POLICY IF EXISTS "Allow anonymous user to insert their own chat summaries" ON public.chat_summaries;
DROP POLICY IF EXISTS "Allow anonymous user to update their own chat summaries" ON public.chat_summaries;
DROP POLICY IF EXISTS "Allow anonymous user to delete their own chat summaries" ON public.chat_summaries;



-- Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for users table: users can only see their own user ID (if they have one)
CREATE POLICY "Allow anonymous user to see their own ID" ON public.users
FOR SELECT USING (
  (current_setting('app.user_id', TRUE)::uuid = id) OR
  ((auth.jwt() ->> 'user_id')::uuid = id)
);



-- Enable RLS on tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy for tasks table: users can only see their own tasks
CREATE POLICY "Allow users to view their own tasks" ON public.tasks
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for tasks table: users can insert their own tasks
CREATE POLICY "Allow users to insert tasks" ON public.tasks
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for tasks table: users can update their own tasks
CREATE POLICY "Allow users to update their own tasks" ON public.tasks
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for tasks table: users can delete their own tasks
CREATE POLICY "Allow users to delete their own tasks" ON public.tasks
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);


-- Enable RLS on chat_sessions table
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for chat_sessions table: users can only see their own chat sessions
CREATE POLICY "Allow users to view their own chat sessions" ON public.chat_sessions
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_sessions table: users can insert their own chat sessions
CREATE POLICY "Allow users to insert their own chat sessions" ON public.chat_sessions
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_sessions table: users can update their own chat sessions
CREATE POLICY "Allow users to update their own chat sessions" ON public.chat_sessions
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_sessions table: users can delete their own chat sessions
CREATE POLICY "Allow users to delete their own chat sessions" ON public.chat_sessions
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);


-- Enable RLS on scraped_pages table
ALTER TABLE public.scraped_pages ENABLE ROW LEVEL SECURITY;

-- Policy for scraped_pages table: users can only see their own scraped pages
CREATE POLICY "Allow users to view their own scraped pages" ON public.scraped_pages
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for scraped_pages table: users can insert their own scraped pages
CREATE POLICY "Allow users to insert their own scraped pages" ON public.scraped_pages
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for scraped_pages table: users can update their own scraped pages
CREATE POLICY "Allow users to update their own scraped pages" ON public.scraped_pages
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for scraped_pages table: users can delete their own scraped pages" ON public.scraped_pages
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);



-- Enable RLS on page_chunks table
ALTER TABLE public.page_chunks ENABLE ROW LEVEL SECURITY;

-- Policy for page_chunks table: users can only see their own page chunks
CREATE POLICY "Allow users to view their own page chunks" ON public.page_chunks
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for page_chunks table: users can insert their own page chunks
CREATE POLICY "Allow users to insert their own page chunks" ON public.page_chunks
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for page_chunks table: users can update their own page chunks
CREATE POLICY "Allow users to update their own page chunks" ON public.page_chunks
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for page_chunks table: users can delete their own page chunks
CREATE POLICY "Allow users to delete their own page chunks" ON public.page_chunks
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);



-- Enable RLS on chat_messages table
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for chat_messages table: users can only see their own chat messages
CREATE POLICY "Allow users to view their own chat messages" ON public.chat_messages
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_messages table: users can insert their own chat messages
CREATE POLICY "Allow users to insert their own chat messages" ON public.chat_messages
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_messages table: users can update their own chat messages
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_messages table: users can delete their own chat messages" ON public.chat_messages
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);



-- Enable RLS on chat_summaries table
ALTER TABLE public.chat_summaries ENABLE ROW LEVEL SECURITY;

-- Policy for chat_summaries table: users can only see their own chat summaries
CREATE POLICY "Allow users to view their own chat summaries" ON public.chat_summaries
FOR SELECT USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_summaries table: users can insert their own chat summaries
CREATE POLICY "Allow users to insert their own chat summaries" ON public.chat_summaries
FOR INSERT WITH CHECK (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_summaries table: users can update their own chat summaries
FOR UPDATE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);

-- Policy for chat_summaries table: users can delete their own chat summaries" ON public.chat_summaries
FOR DELETE USING (
  (user_id = current_setting('app.user_id', TRUE)::uuid) OR
  (user_id = (auth.jwt() ->> 'user_id')::uuid)
);
