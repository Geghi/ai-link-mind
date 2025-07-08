import React from 'react';
import { UrlEntry } from '@/types';
import { TaskStatusTableRow } from '@/components/task-status/TaskStatusTableRow';
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UrlTableProps {
  urlEntries: UrlEntry[];
}

export default function UrlTable({ urlEntries }: UrlTableProps) {
  return (
    <div className="rounded-xl border bg-background/80 shadow-2xl shadow-primary/10 backdrop-blur-sm">
      <Table>
        <TableCaption className="pb-4">A list of your recent URL analyses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead >Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {urlEntries.map((entry) => (
            <TaskStatusTableRow key={entry.id} entry={entry} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
