"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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
    return <div className="text-center p-4">Loading chats...</div>;
  }

  return (
    <div className="w-full max-w-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-white">Available Chats</h2>
      <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800/50 p-2">
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className={cn(
                  "p-3 rounded-md cursor-pointer transition-colors",
                  "bg-gray-700/50 hover:bg-gray-600/80",
                  "text-white text-sm"
                )}
              >
                <p className="font-semibold truncate">{task.website_basename}</p>
                <p className="text-xs text-gray-400">
                  {new Date(task.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400 py-4">No chats available.</p>
        )}
      </div>
    </div>
  );
}
