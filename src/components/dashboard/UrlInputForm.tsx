"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/services/supabase/client";
import apiClient from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useUrlStoreActions } from "@/stores/urlStore";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface UrlInputFormProps {
  onUrlSubmit: (url: string, task_id: string) => void;
}

export default function UrlInputForm({ onUrlSubmit }: UrlInputFormProps) {
  const [url, setUrl] = useState("");
  const { resetUrlEntries } = useUrlStoreActions();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    resetUrlEntries();
    console.log("Submitting URL to create task:", url);

    try {
      const response = await apiClient.post<{ task_id: string }>("/api/tasks/create", { url });
      const { task_id } = response.data;
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
