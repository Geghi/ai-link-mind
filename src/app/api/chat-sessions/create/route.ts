import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function POST(request: Request) {
  const { task_id } = await request.json();

  if (!task_id) {
    return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ task_id, user_id: userId })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error('Unexpected error creating chat session:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
