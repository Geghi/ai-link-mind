export type UrlStatus = 'Queued' | 'In Progress' | 'Completed' | 'Failed';

export interface UrlEntry {
  id: string;
  task_id: string;
  url: string;
  status: UrlStatus;
  created_at: string;
  updated_at: string | null;
  user_id: string; // Add user_id to ChatSession
}

export interface ChatSessionWithTask extends ChatSession {
  tasks: {
    website_basename: string;
  }[]; // Supabase returns an array for joined tables
}

export interface ChatSession {
  id: string;
  task_id: string;
  title: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ChatMessage {
  id: string;
  chat_session_id: string;
  sender: 'user' | 'ai';
  content: string;
  created_at: string;
}
