"use client";

import apiClient from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MessageSquare, LoaderCircle, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ChatSession } from '@/types';

interface Task {
  id: string;
  website_basename: string;
  created_at: string;
  chat_sessions: ChatSession[];
}

export default function ChatList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiClient.get<Task[]>('/api/tasks');
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleChatSessionClick = (taskId: string, chatSessionId: string) => {
    router.push(`/chat/${taskId}?chatSessionId=${chatSessionId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground mt-8">
        <LoaderCircle className="animate-spin h-5 w-5" />
        <span>Loading previous analyses...</span>
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
          <Accordion type="single" collapsible className="w-full">
            {tasks.map((task) => (
              <AccordionItem key={task.id} value={task.id}>
                <AccordionTrigger className="flex w-full items-center justify-between p-2 rounded-md transition-all hover:bg-primary/10 hover:shadow-lg hover:scale-[1.02] border border-transparent hover:border-primary/20 group">
                  <div className="flex flex-col items-start">
                    <p className="font-semibold truncate text-foreground">{task.website_basename}</p>
                    <p className="text-xs text-muted-foreground">
                      Started on {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                  >
                    <Link
                      href={`/task-status?task_id=${task.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Status
                    </Link>
                  </Button>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1 pl-4 border-l border-muted-foreground/20 ml-2">
                    {task.chat_sessions.length > 0 ? (
                      task.chat_sessions.map((session) => (
                        <li
                          key={session.id}
                          onClick={() => handleChatSessionClick(session.task_id, session.id)}
                          className={cn(
                            "p-2 rounded-md cursor-pointer transition-all flex items-center justify-between",
                            "bg-card/30 hover:bg-primary/5 hover:shadow-md",
                            "border border-transparent hover:border-primary/10"
                          )}
                        >
                          <span className="text-sm truncate">{session.title || `Chat Session ${new Date(session.created_at).toLocaleDateString()}`}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4 text-sm">
                        No chat sessions for this analysis.
                      </p>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No previous analyses found. Start a new one above!
          </p>
        )}
      </div>
    </section>
  );
}
