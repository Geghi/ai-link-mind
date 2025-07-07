import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';
import { ChatSessionWithTask } from '@/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');

    let query = supabase
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

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    const { data: chatSessions, error } = await query;

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
