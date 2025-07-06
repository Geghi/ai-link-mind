import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/services/supabase/client';

// Helper function to generate a dummy URL
const generateDummyUrl = (task_id: string) => {
  return `https://example.com/site/${task_id}/page/${Math.random().toString(36).substring(2, 15)}`;
};

// GET /api/scraped-pages/add?task_id=<uuid>
// Adds a dummy URL entry to the scraped_pages table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const task_id = searchParams.get('task_id');

    if (!task_id) {
      return NextResponse.json({ error: 'task_id is required' }, { status: 400 });
    }

    // Validate if task_id is a valid UUID (optional but good practice)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(task_id)) {
      return NextResponse.json({ error: 'Invalid task_id format (must be UUID)' }, { status: 400 });
    }

    const dummyUrl = generateDummyUrl(task_id);

    const { data, error } = await supabase
      .from('scraped_pages')
      .insert([
        {
          task_id: task_id,
          url: dummyUrl,
          status: 'Queued', // Initial status
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting scraped page:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Dummy URL added successfully', data }, { status: 200 });

  } catch (error: unknown) {
    console.error('Unexpected error in GET /api/scraped-pages/add:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
