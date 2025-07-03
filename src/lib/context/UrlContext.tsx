"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { UrlEntry, UrlStatus } from '@/types';
interface UrlContextType {
  urlEntries: UrlEntry[];
  addUrlEntry: (entry: UrlEntry) => void;
  updateUrlEntryStatus: (id: string, newStatus: UrlStatus) => Promise<void>;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
  const [urlEntries, setUrlEntries] = useState<UrlEntry[]>(() => {
    // Initialize with the home URL
    return [];
  });

  const addUrlEntry = useCallback((entry: UrlEntry) => {
    setUrlEntries((prev) => [...prev, entry]);
  }, []);

  const updateUrlEntryStatus = useCallback(async (id: string, newStatus: UrlStatus) => {
      setUrlEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, status: newStatus, updatedAt: new Date().toISOString() } : entry))
      );
  }, []);

  return (
    <UrlContext.Provider value={{ urlEntries, addUrlEntry, updateUrlEntryStatus }}>
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
