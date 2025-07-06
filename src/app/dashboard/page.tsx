"use client";

import { useEffect, useRef } from 'react';
import { useUrlStore, useUrlEntries, useUrlStoreActions } from '@/stores/urlStore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UrlTable from '@/components/dashboard/UrlTable';

export default function DashboardPage() {
  const urlEntries = useUrlEntries();
  const { initializeSubscription, unsubscribe } = useUrlStoreActions();
  const pendingUrl = useUrlStore((state) => state.pendingUrl);
  const pendingTaskId = useUrlStore((state) => state.pendingTaskId);
  const hasInitiatedAnalysis = useRef(false);

  useEffect(() => {
    console.log('DashboardPage useEffect - pendingTaskId:', pendingTaskId);

    if (pendingTaskId && !hasInitiatedAnalysis.current) {
      initializeSubscription(pendingTaskId);

      if (pendingUrl) {
        const startAnalysis = async () => {
          try {
            const response = await fetch("/api/start-analysis", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url: pendingUrl, task_id: pendingTaskId }),
            });

            if (!response.ok) {
              throw new Error("Failed to start analysis");
            }

            const data = await response.json();
            console.log("Analysis started successfully from Dashboard:", data);
            // The pendingUrl/pendingTaskId should remain until the user explicitly clears it
            // or the analysis status changes via Supabase Realtime.
          } catch (error) {
            console.error("Error starting analysis from Dashboard:", error);
            // Optionally, handle error state in UI
          }
        };
        startAnalysis();
      }
    }

    return () => {
      unsubscribe();
    };
  }, [pendingTaskId, pendingUrl, initializeSubscription, unsubscribe]);

  return (
    <div className="p-4 sm:p-8 lg:p-12 text-white">
      <DashboardHeader />

      {urlEntries.length === 0 ? (
        <p className="text-gray-400">No URLs have been added yet for this task.</p>
      ) : (
        <UrlTable urlEntries={urlEntries} />
      )}
    </div>
  );
}
