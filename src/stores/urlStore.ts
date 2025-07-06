import { create } from 'zustand';
import { UrlEntry, UrlStatus } from '@/types';
import { subscribeToUrlChanges } from '@/services/supabase/realtime';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UrlState {
  urlEntries: UrlEntry[];
  channel: RealtimeChannel | null;
  pendingUrl: string | null;
  pendingTaskId: string | null;
  actions: {
    addUrlEntry: (entry: UrlEntry) => void;
    updateUrlEntryStatus: (id: string, newStatus: UrlStatus) => void;
    resetUrlEntries: () => void;
    initializeSubscription: (task_id: string) => void;
    unsubscribe: () => void;
    setPendingAnalysis: (url: string, task_id: string) => void;
    clearPendingAnalysis: () => void;
  };
}

export const useUrlStore = create<UrlState>((set, get) => ({
  urlEntries: [],
  channel: null,
  pendingUrl: null,
  pendingTaskId: null,
  actions: {
    addUrlEntry: (entry) =>
      set((state) => {
        if (!state.urlEntries.some((e) => e.id === entry.id)) {
          return { urlEntries: [entry, ...state.urlEntries] };
        }
        return {};
      }),
    updateUrlEntryStatus: (id, newStatus) =>
      set((state) => ({
        urlEntries: state.urlEntries.map((entry) =>
          entry.id === id ? { ...entry, status: newStatus, updatedAt: new Date().toISOString() } : entry
        ),
      })),
    resetUrlEntries: () => set({ urlEntries: [] }),
    initializeSubscription: (task_id) => {
      const { channel, actions } = get();
      if (channel) {
        actions.unsubscribe();
      }

      const newChannel = subscribeToUrlChanges(
        task_id,
        (newEntry) => {
          actions.addUrlEntry(newEntry);
        },
        (updatedEntry) => {
          set((state) => ({
            urlEntries: state.urlEntries.map((entry) =>
              entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
            ),
          }));
        },
        (deletedEntry) => {
          set((state) => ({
            urlEntries: state.urlEntries.filter((entry) => entry.id !== deletedEntry.id),
          }));
        }
      );
      set({ channel: newChannel });
    },
    unsubscribe: () => {
      const { channel } = get();
      if (channel) {
        channel.unsubscribe();
        set({ channel: null });
      }
    },
    setPendingAnalysis: (url, task_id) => set({ pendingUrl: url, pendingTaskId: task_id }),
    clearPendingAnalysis: () => set({ pendingUrl: null, pendingTaskId: null }),
  },
}));

export const useUrlEntries = () => useUrlStore((state) => state.urlEntries);
export const useUrlStoreActions = () => useUrlStore((state) => state.actions);
