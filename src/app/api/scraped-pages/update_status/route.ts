import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/client/supabaseClient';

// PUT /api/scraped-pages/update-status
// Updates the status of a scraped_pages entry
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    console.log('GET /api/scraped-pages/update-status called with:', { id, status });
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    // Validate if id is a valid UUID (optional but good practice)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid ID format (must be UUID)' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scraped_pages')
      .update({ status: status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating scraped page status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Page not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Status updated successfully', data }, { status: 200 });

  } catch (error: unknown) {
    console.error('Unexpected error in PUT /api/scraped-pages/update-status:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
