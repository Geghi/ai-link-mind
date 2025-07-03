import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client/supabaseClient';

// Helper function to generate a dummy URL
const generateDummyUrl = (siteId: string) => {
  return `https://example.com/site/${siteId}/page/${Math.random().toString(36).substring(2, 15)}`;
};

// GET /api/scraped-pages/add?siteId=<uuid>
// Adds a dummy URL entry to the scraped_pages table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json({ error: 'siteId is required' }, { status: 400 });
    }

    // Validate if siteId is a valid UUID (optional but good practice)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(siteId)) {
      return NextResponse.json({ error: 'Invalid siteId format (must be UUID)' }, { status: 400 });
    }

    const dummyUrl = generateDummyUrl(siteId);

    const { data, error } = await supabase
      .from('scraped_pages')
      .insert([
        {
          task_id: siteId,
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
