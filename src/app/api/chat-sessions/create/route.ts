import { NextResponse } from 'next/server';
import { supabase } from '@/services/supabase/client';

export async function POST(request: Request) {
  const { task_id } = await request.json();

  if (!task_id) {
    return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ task_id })
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
