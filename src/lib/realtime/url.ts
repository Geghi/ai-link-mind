import { supabase } from '@/lib/client/supabaseClient';
import { UrlEntry } from '@/types';

export const subscribeToUrlChanges = (
  onInsert: (entry: UrlEntry) => void,
  onUpdate: (entry: UrlEntry) => void,
  onDelete: (entry: UrlEntry) => void
) => {
  const channel = supabase
    .channel('url_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'scraped_pages' },
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
        console.log('[Supabase Realtime] Successfully subscribed to channel!');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('[Supabase Realtime] Channel error:', err);
      } else if (status === 'TIMED_OUT') {
        console.error('[Supabase Realtime] Subscription timed out.');
      } else {
        console.log('[Supabase Realtime] Subscription status:', status);
      }
    });

  return channel;
};
