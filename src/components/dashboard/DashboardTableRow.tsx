"use client";

import { UrlEntry } from '@/types';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
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
          <Button asChild variant="outline" size="sm">
            <Link href={`/chat/${entry.task_id}`}>
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              New Chat
            </Link>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
