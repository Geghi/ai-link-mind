"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUrlStoreActions } from '@/stores/urlStore';

interface UrlInputFormProps {
  onUrlSubmit: (url: string, task_id: string) => void;
}

export default function UrlInputForm({ onUrlSubmit }: UrlInputFormProps) {
  const [url, setUrl] = useState("https://mantovani-giacomo.com/");
  const { resetUrlEntries } = useUrlStoreActions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;

    setLoading(true);
    resetUrlEntries();
    console.log("Submitting URL to create task:", url);

    try {
      // Call the new API route to create a task and get the task_id
      const createTaskResponse = await fetch("/api/tasks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!createTaskResponse.ok) {
        const errorData = await createTaskResponse.json();
        throw new Error(`Failed to create task: ${errorData.error || createTaskResponse.statusText}`);
      }

      const { task_id } = await createTaskResponse.json();
      console.log(`Task created with ID: ${task_id}`);

      // Pass the URL and the generated task_id to the parent component's onUrlSubmit
      onUrlSubmit(url, task_id);
    } catch (error) {
      console.error("Error submitting URL:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md animate-fade-in-up delay-400">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
        <Input
          type="url"
          placeholder="Enter a URL to analyze (e.g., https://example.com)"
          className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <Button
          type="submit"
          className={cn(
            "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg",
            "hover:from-blue-600 hover:to-purple-700 transition-all duration-300",
            "shadow-lg hover:shadow-xl transform hover:scale-105"
          )}
          disabled={loading}
        >
          {loading ? "Creating Task..." : "Start Analysis"}
        </Button>
      </form>
    </main>
  );
}
