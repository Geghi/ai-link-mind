import { NextResponse } from 'next/server';
import { getSupabaseRlsClient } from '@/services/supabase/server'; // Import getSupabaseRlsClient
import { getOrCreateAnonymousUserId } from '@/lib/auth';
import { ChatSessionWithTask } from '@/types';

export async function GET() {
  try {
    const userId = await getOrCreateAnonymousUserId();

    // Get RLS-enabled Supabase client
    const supabase = await getSupabaseRlsClient(userId);

    const { data: chatSessions, error } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        created_at,
        task_id,
        title,
        updated_at,
        tasks (
          website_basename
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Flatten the data to include website_basename directly
    const formattedChatSessions = chatSessions.map((session: ChatSessionWithTask) => ({
      ...session,
      website_basename: session.tasks[0]?.website_basename || 'Unknown Website',
      tasks: undefined, // Remove the nested tasks object
    }));

    return NextResponse.json(formattedChatSessions, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/chat-sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
