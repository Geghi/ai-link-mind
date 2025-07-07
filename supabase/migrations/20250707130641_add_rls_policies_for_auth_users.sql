-- Add policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own tasks" ON public.tasks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add policies for chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own chat sessions" ON public.chat_sessions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add policies for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own chat messages" ON public.chat_messages FOR ALL
    USING (auth.uid() = user_id);

-- Add policies for scraped_pages
ALTER TABLE public.scraped_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own scraped pages" ON public.scraped_pages FOR ALL
    USING (auth.uid() = user_id);

-- Add policies for page_chunks
ALTER TABLE public.page_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own page chunks" ON public.page_chunks FOR ALL
    USING (auth.uid() = user_id);

-- Add policies for chat_summaries
ALTER TABLE public.chat_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own chat summaries" ON public.chat_summaries FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to own user record" ON public.users FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
