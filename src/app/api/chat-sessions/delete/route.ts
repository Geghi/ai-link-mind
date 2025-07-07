import { NextResponse } from 'next/server';
import { getSupabaseRlsClient } from '@/services/supabase/server'; // Import getSupabaseRlsClient
import { getOrCreateAnonymousUserId } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const userId = await getOrCreateAnonymousUserId();

    // Get RLS-enabled Supabase client
    const supabase = await getSupabaseRlsClient(userId);

    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId); // Ensure only the owner can delete

    if (error) {
      console.error('Error deleting chat session:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Chat session deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/chat-sessions/delete:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
