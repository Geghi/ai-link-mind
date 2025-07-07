"use client";

import { UrlEntry } from '@/types';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquarePlus } from 'lucide-react';

interface DashboardTableRowProps {
  entry: UrlEntry;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
};

const getStatusVariant = (status: UrlEntry['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'In Progress':
      return 'secondary';
    case 'Failed':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const DashboardTableRow = ({ entry }: DashboardTableRowProps) => {
  const router = useRouter();

  const handleNewChat = async (task_id: string) => {
    try {
      router.push(`/chat/${task_id}`);
    } catch (error) {
      console.error("Error creating new chat session:", error);
      toast.error("Failed to create new chat session.");
    }
  };

  return (
    <TableRow>
      <TableCell>
        <a href={entry.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-foreground font-medium truncate block max-w-md">
          {entry.url}
        </a>
      </TableCell>
      <TableCell>
        <Badge variant={getStatusVariant(entry.status)}>{entry.status}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{formatDate(entry.created_at)}</TableCell>
      <TableCell className="text-muted-foreground">{formatDate(entry.updated_at)}</TableCell>
      <TableCell className="">
        {entry.status === 'Completed' && (
          <Button variant="outline" size="sm" onClick={() => handleNewChat(entry.task_id)}>
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
