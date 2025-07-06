-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL, -- Foreign key to link to the scraping task (e.g., from url_entries or scraped_pages)
    title TEXT, -- Optional: A short title for the chat session
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security for chat_sessions
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_sessions
-- CREATE POLICY "Enable read access for all users" ON chat_sessions FOR SELECT USING (TRUE);
-- CREATE POLICY "Enable insert for authenticated users" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable update for authenticated users" ON chat_sessions FOR UPDATE USING (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable delete for authenticated users" ON chat_sessions FOR DELETE USING (auth.uid() IS NOT NULL);


-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE, -- Foreign key to link to the chat session
    sender TEXT NOT NULL, -- 'user' or 'ai'
    content TEXT NOT NULL, -- The actual message text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_messages
-- CREATE POLICY "Enable read access for all users" ON chat_messages FOR SELECT USING (TRUE);
-- CREATE POLICY "Enable insert for authenticated users" ON chat_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable update for authenticated users" ON chat_messages FOR UPDATE USING (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable delete for authenticated users" ON chat_messages FOR DELETE USING (auth.uid() IS NOT NULL);


-- Alter chat_summaries table to add chat_session_id
ALTER TABLE chat_summaries
ADD COLUMN chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE;

-- Optional: Make chat_session_id NOT NULL if all future summaries must be linked to a session.
-- If there's existing data, you might need to populate it first or handle nulls.
-- ALTER TABLE chat_summaries ALTER COLUMN chat_session_id SET NOT NULL;

-- Update RLS policies for chat_summaries to reflect the new column and ensure consistency
-- Assuming existing policies are "Enable read access for all users" and "Enable insert for authenticated users"
-- We need to ensure update policy considers the new column if it becomes NOT NULL
-- For now, just ensure existing policies are compatible or update them if needed.
-- The existing policies are:
-- CREATE POLICY "Enable read access for all users" ON chat_summaries FOR SELECT USING (TRUE);
-- CREATE POLICY "Enable insert for authenticated users" ON chat_summaries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable update for authenticated users" ON chat_summaries FOR UPDATE USING (auth.uid() IS NOT NULL);
-- No changes needed to existing policies unless we make chat_session_id NOT NULL and need to enforce it in policies.
