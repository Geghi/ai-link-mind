import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/services/supabase/server';

const deleteSchema = z.object({
  task_id: z.string().uuid(),
});

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const json = await request.json();
  const parsed = deleteSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { task_id } = parsed.data;

  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', task_id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
