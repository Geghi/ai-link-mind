import { getSupabaseRlsClient } from '@/services/supabase/server';
import { NextResponse } from 'next/server';
import { getOrCreateAnonymousUserId } from '@/lib/auth';

export async function GET() {

  try {
    const userId = await getOrCreateAnonymousUserId();
    const supabase = await getSupabaseRlsClient(userId);

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
