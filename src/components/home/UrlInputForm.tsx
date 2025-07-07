"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useUrlStoreActions } from '@/stores/urlStore';
import { ArrowRight, LoaderCircle } from "lucide-react";

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
      onUrlSubmit(url, task_id);
    } catch (error) {
      console.error("Error submitting URL:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl animate-fade-in-up delay-400">
      <form 
        onSubmit={handleSubmit} 
        className="relative flex flex-col gap-4 rounded-xl border bg-background/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-sm"
      >
        <Input
          type="url"
          placeholder="Enter a URL to analyze (e.g., https://example.com)"
          className="h-12 bg-input text-lg placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-0"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={loading}
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 text-lg"
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
