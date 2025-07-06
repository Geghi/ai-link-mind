"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare, LoaderCircle } from 'lucide-react';

interface Task {
  id: string;
  website_basename: string;
  created_at: string;
}

export default function ChatList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground mt-8">
        <LoaderCircle className="animate-spin h-5 w-5" />
        <span>Loading previous chats...</span>
      </div>
    );
  }

  return (
    <section className="w-full max-w-xl mt-12 animate-fade-in-up delay-500">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Recent Analyses
      </h2>
      <div className="max-h-72 overflow-y-auto rounded-lg border bg-background/50 p-2 backdrop-blur-sm">
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={cn(
                  "p-3 rounded-md cursor-pointer transition-all",
                  "bg-card/50 hover:bg-primary/10 hover:shadow-lg hover:scale-[1.02]",
                  "border border-transparent hover:border-primary/20"
                )}
              >
                <p className="font-semibold truncate text-foreground">{task.website_basename}</p>
                <p className="text-xs text-muted-foreground">
                  Analyzed on {new Date(task.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No previous analyses found. Start a new one above!
          </p>
        )}
      </div>
    </section>
  );
}
