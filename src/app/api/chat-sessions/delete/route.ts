import { NextResponse } from 'next/server';
import { createClient } from '@/services/supabase/server';

export async function DELETE(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;

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
