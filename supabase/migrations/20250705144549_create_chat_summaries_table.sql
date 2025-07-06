CREATE TABLE chat_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Optional: Add RLS policies if needed for security
-- For example:
-- ALTER TABLE chat_summaries ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable read access for all users" ON chat_summaries FOR SELECT USING (TRUE);
-- CREATE POLICY "Enable insert for authenticated users" ON chat_summaries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- CREATE POLICY "Enable update for authenticated users" ON chat_summaries FOR UPDATE USING (auth.uid() IS NOT NULL);
