"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'; // Add this import
import apiClient from '@/lib/apiClient';
import { useUrlStore, useUrlEntries, useUrlStoreActions } from '@/stores/urlStore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UrlTable from '@/components/dashboard/UrlTable';
import { UrlEntry } from '@/types'; // Add this import

export default function DashboardPage() {
  const urlEntries = useUrlEntries();
  const { initializeSubscription, unsubscribe, setUrlEntries, clearPendingAnalysis } = useUrlStoreActions();
  const pendingUrl = useUrlStore((state) => state.pendingUrl);
  const pendingTaskId = useUrlStore((state) => state.pendingTaskId);
  const hasInitiatedAnalysis = useRef(false);
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const taskIdFromUrl = searchParams.get('task_id'); // Get task_id from URL

  useEffect(() => {
    console.log('DashboardPage useEffect - taskIdFromUrl:', taskIdFromUrl);
    console.log('DashboardPage useEffect - pendingTaskId:', pendingTaskId);
    const currentTaskId = taskIdFromUrl || pendingTaskId; // Determine which task ID to use

    console.log('DashboardPage useEffect - currentTaskId:', currentTaskId);

    if (currentTaskId) {
      initializeSubscription(currentTaskId); // Always initialize subscription for the current task ID

      // Only start analysis if there's a pending URL (i.e., a new analysis is being initiated)
      // and the analysis hasn't been initiated yet for this session.
      if (pendingUrl && pendingTaskId && !hasInitiatedAnalysis.current) {
        const startAnalysis = async () => {
          try {
            const response = await apiClient.post("/api/start-analysis", { url: pendingUrl, task_id: pendingTaskId });
            console.log("Analysis started successfully from Dashboard:", response.data);
            hasInitiatedAnalysis.current = true; // Mark as initiated
            clearPendingAnalysis(); // Clear pending state after successful initiation
          } catch (error) {
            console.error("Error starting analysis from Dashboard:", error);
            // Optionally, handle error state in UI
          }
        };
        startAnalysis();
      }

      // Fetch URL entries for the current task ID
      const fetchUrlEntriesForTask = async () => {
        try {
          const response = await apiClient.get<UrlEntry[]>(`/api/urls?task_id=${currentTaskId}`);
          setUrlEntries(response.data);
        } catch (error) {
          console.error(`Error fetching URL entries for task ${currentTaskId}:`, error);
          setUrlEntries([]); // Clear entries on error
        }
      };
      fetchUrlEntriesForTask();
    }

    return () => {
      unsubscribe();
    };
  }, [taskIdFromUrl, pendingTaskId, pendingUrl, initializeSubscription, unsubscribe, setUrlEntries]);

  return (
    <div className="p-4 sm:p-8 lg:p-12 text-white">
      <DashboardHeader />

      {urlEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No URLs have been added yet for this task.</p>
      ) : (
        <UrlTable urlEntries={urlEntries} />
      )}
    </div>
  );
}
