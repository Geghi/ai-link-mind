import { supabase } from '@/services/supabase/client';
import { NextResponse } from 'next/server';

export async function GET() {

  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('id, website_basename, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    return NextResponse.json(tasks);
  } catch (e) {
    console.error('Unexpected error fetching tasks:', e);
    return NextResponse.json({ error: `An unexpected error occurred: ${e}` }, { status: 500 });
  }
}
