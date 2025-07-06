"use client";

import { UrlEntry } from '@/types';
import { useRouter } from 'next/navigation';

interface DashboardTableRowProps {
  entry: UrlEntry;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

const getStatusColor = (status: UrlEntry['status']) => {
  switch (status) {
    case 'Queued':
      return 'text-yellow-400';
    case 'In Progress':
      return 'text-blue-400';
    case 'Completed':
      return 'text-green-400';
    case 'Failed':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

export const DashboardTableRow = ({ entry }: DashboardTableRowProps) => {
  const router = useRouter();

  const handleNewChat = async (task_id: string) => {
    try {
      const response = await fetch("/api/chat-sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: task_id }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const newSessionId = data.id;
      router.push(`/chat/${task_id}?chatSessionId=${newSessionId}`);
    } catch (error) {
      console.error("Error creating new chat session:", error);
      alert("Failed to create new chat session.");
    }
  };

  return (
    <tr className="border-b border-white/10 last:border-b-0">
      <td className="py-3 px-4">
        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">
          {entry.url}
        </a>
      </td>
      <td className={`py-3 px-4 font-semibold ${getStatusColor(entry.status)}`}>
        {entry.status}
      </td>
      <td className="py-3 px-4 text-gray-400">
        {formatDate(entry.created_at)}
      </td>
      <td className="py-3 px-4 text-gray-400">
        {formatDate(entry.updated_at)}
      </td>
      <td className="py-3 px-4">
        {entry.status === 'Completed' && (
          <>
            <button
              onClick={() => handleNewChat(entry.task_id)}
              className="text-green-400 hover:underline"
            >
              New Chat
            </button>
          </>
        )}
      </td>
    </tr>
  );
};
