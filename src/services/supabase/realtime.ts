import { supabase } from '@/services/supabase/client';
import { UrlEntry } from '@/types';

export const subscribeToUrlChanges = (
  task_id: string,
  onInsert: (entry: UrlEntry) => void,
  onUpdate: (entry: UrlEntry) => void,
  onDelete: (entry: UrlEntry) => void
) => {
  const channel = supabase
    .channel(`url_changes_${task_id}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'scraped_pages', filter: `task_id=eq.${task_id}` },
      (payload) => {
        console.log('[Supabase Realtime] Change received:', payload);
        const newEntry = payload.new as UrlEntry;
        const oldEntry = payload.old as UrlEntry;

        if (payload.eventType === 'INSERT') {
          onInsert(newEntry);
        } else if (payload.eventType === 'UPDATE') {
          onUpdate(newEntry);
        } else if (payload.eventType === 'DELETE') {
          onDelete(oldEntry);
        }
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log(`[Supabase Realtime] Successfully subscribed to channel for task ${task_id}!`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`[Supabase Realtime] Channel error for task ${task_id}:`, err);
      } else if (status === 'TIMED_OUT') {
        console.error(`[Supabase Realtime] Subscription for task ${task_id} timed out.`);
      } else {
        console.log(`[Supabase Realtime] Subscription status for task ${task_id}:`, status);
      }
    });

  return channel;
};
