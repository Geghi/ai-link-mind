import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        id,
        website_basename,
        created_at,
        chat_sessions (
          id,
          task_id,
          title,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id) // Filter tasks by user_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    // Sort chat sessions within each task by created_at
    const sortedTasks = tasks.map(task => ({
      ...task,
      chat_sessions: task.chat_sessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }));

    return NextResponse.json(sortedTasks);
  } catch (e) {
    console.error('Unexpected error fetching tasks:', e);
    return NextResponse.json({ error: `An unexpected error occurred: ${e}` }, { status: 500 });
  }
}
