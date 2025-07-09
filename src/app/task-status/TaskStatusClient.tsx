"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { useUrlStore, useUrlEntries, useUrlStoreActions } from '@/stores/urlStore';
import TaskStatusHeader from '@/components/task-status/TaskStatusHeader';
import UrlTable from '@/components/task-status/UrlTable';
import { UrlEntry } from '@/types';

interface TaskStatusClientProps {
  taskId?: string;
}

export default function TaskStatusClient({ taskId }: TaskStatusClientProps) {
  const router = useRouter();
  const urlEntries = useUrlEntries();
  const { initializeSubscription, unsubscribe, setUrlEntries, clearPendingAnalysis } = useUrlStoreActions();
  const pendingUrl = useUrlStore((state) => state.pendingUrl);
  const pendingTaskId = useUrlStore((state) => state.pendingTaskId);
  const hasInitiatedAnalysis = useRef(false);

  const handleDeleteTaskAndRedirect = async (taskIdToDelete: string) => {
    try {
      await apiClient.delete(`/api/tasks/delete?task_id=${taskIdToDelete}`);
      router.push('/dashboard');
    } catch (deleteError) {
      console.error(`Failed to delete task ${taskIdToDelete}:`, deleteError);
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    console.log('TaskStatusPage useEffect - taskId prop:', taskId);
    console.log('TaskStatusPage useEffect - pendingTaskId:', pendingTaskId);
    const currentTaskId = taskId || pendingTaskId; // Determine which task ID to use

    console.log('TaskStatusPage useEffect - currentTaskId:', currentTaskId);

    if (currentTaskId) {
      initializeSubscription(currentTaskId); // Always initialize subscription for the current task ID

      // Only start analysis if there's a pending URL (i.e., a new analysis is being initiated)
      // and the analysis hasn't been initiated yet for this session.
      if (pendingUrl && pendingTaskId && !hasInitiatedAnalysis.current) {
        const startAnalysis = async () => {
          try {
            const response = await apiClient.post("/api/start-analysis", { url: pendingUrl, task_id: pendingTaskId });
            console.log("Analysis started successfully from TaskStatus:", response.data);
            hasInitiatedAnalysis.current = true; // Mark as initiated
            clearPendingAnalysis(); // Clear pending state after successful initiation
          } catch (error) {
            console.error("Error starting analysis from TaskStatus:", error);
            handleDeleteTaskAndRedirect(currentTaskId);
            toast.error("Error starting analysis. Please try again.");
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
          setUrlEntries([]);
        }
      };
      fetchUrlEntriesForTask();
    }

    return () => {
      unsubscribe();
    };
  }, [taskId, pendingTaskId, pendingUrl, initializeSubscription, unsubscribe, setUrlEntries, clearPendingAnalysis]);

  return (
    <div className="p-4 sm:p-8 lg:p-12 text-white">
      <TaskStatusHeader />

      {urlEntries.length === 0 ? (
        <p className="text-gray-400 text-center">No URLs have been added yet for this task.</p>
      ) : (
        <UrlTable urlEntries={urlEntries} />
      )}
    </div>
  );
}
