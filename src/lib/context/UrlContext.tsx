"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { UrlEntry, UrlStatus } from '@/types';
import { subscribeToUrlChanges } from '@/lib/realtime/url';
import { useSearchParams } from 'next/navigation';

interface UrlContextType {
  urlEntries: UrlEntry[];
  addUrlEntry: (entry: UrlEntry) => void;
  updateUrlEntryStatus: (id: string, newStatus: UrlStatus) => Promise<void>;
  resetUrlEntries: () => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>([]);
  const searchParams = useSearchParams();
  const currentTaskId = searchParams.get('siteId'); // Assuming siteId is the task_id

  // Use a ref to hold the current task ID to avoid re-subscribing on navigation
  const taskIdRef = useRef(currentTaskId);
  useEffect(() => {
    taskIdRef.current = currentTaskId;
    console.log('[UrlContext] Task ID ref updated:', taskIdRef.current);
  }, [currentTaskId]);

  const addUrlEntry = useCallback((entry: UrlEntry) => {
    setUrlEntries((prev) => {
      if (!prev.some(existingEntry => existingEntry.id === entry.id)) {
        return [entry, ...prev];
      }
      return prev;
    });
  }, []);

  const updateUrlEntryStatus = useCallback(async (id: string, newStatus: UrlStatus) => {
      setUrlEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, status: newStatus, updatedAt: new Date().toISOString() } : entry))
      );
  }, []);

  const resetUrlEntries = useCallback(() => {
    setUrlEntries([]);
  }, []);

  // This effect runs only once to set up a stable subscription
  useEffect(() => {
    console.log('[UrlContext] Setting up STABLE subscription.');

    const channel = subscribeToUrlChanges(
      (newEntry) => {
        console.log('[UrlContext] Insert received:', newEntry);
        const activeTaskId = taskIdRef.current;
        if (!activeTaskId || newEntry.task_id === activeTaskId) {
          console.log('[UrlContext] Adding new entry:', newEntry);
          setUrlEntries((prev) => {
            if (!prev.some(existingEntry => existingEntry.id === newEntry.id)) {
              return [newEntry, ...prev];
            }
            return prev;
          });
        } else {
          console.log(`[UrlContext] Skipping entry. Active task: ${activeTaskId}, Entry task: ${newEntry.task_id}`);
        }
      },
      (updatedEntry) => {
        console.log('[UrlContext] Update received:', updatedEntry);
        const activeTaskId = taskIdRef.current;
        if (!activeTaskId || updatedEntry.task_id === activeTaskId) {
          console.log('[UrlContext] Updating entry:', updatedEntry);
          setUrlEntries((prev) =>
            prev.map((entry) =>
              entry.id === updatedEntry.id ? { ...entry, ...updatedEntry } : entry
            )
          );
        } else {
           console.log(`[UrlContext] Skipping update. Active task: ${activeTaskId}, Entry task: ${updatedEntry.task_id}`);
        }
      },
      (deletedEntry) => {
        console.log('[UrlContext] Delete received:', deletedEntry);
        const activeTaskId = taskIdRef.current;
        if (!activeTaskId || deletedEntry.task_id === activeTaskId) {
          console.log('[UrlContext] Deleting entry:', deletedEntry);
          setUrlEntries((prev) => prev.filter(entry => entry.id !== deletedEntry.id));
        } else {
          console.log(`[UrlContext] Skipping delete. Active task: ${activeTaskId}, Entry task: ${deletedEntry.task_id}`);
        }
      }
    );

    return () => {
      console.log('[UrlContext] Unsubscribing from STABLE subscription on component unmount.');
      channel.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <UrlContext.Provider value={{ urlEntries, addUrlEntry, updateUrlEntryStatus, resetUrlEntries }}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrlContext = () => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrlContext must be used within a UrlProvider');
  }
  return context;
};
