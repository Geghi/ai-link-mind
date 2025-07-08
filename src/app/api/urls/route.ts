import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

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

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const { data: urlEntries, error } = await supabase
      .from('scraped_pages')
      .select('*')
      .eq('task_id', taskId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching URL entries:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(urlEntries, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/urls:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
