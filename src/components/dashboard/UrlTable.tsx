import React from 'react';
import { UrlEntry } from '@/types';
import { DashboardTableRow } from '@/components/dashboard/DashboardTableRow';

interface UrlTableProps {
  urlEntries: UrlEntry[];
}

export default function UrlTable({ urlEntries }: UrlTableProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Monitored URLs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-left">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-2 px-4 text-gray-300">URL</th>
              <th className="py-2 px-4 text-gray-300">Status</th>
              <th className="py-2 px-4 text-gray-300">Added On</th>
              <th className="py-2 px-4 text-gray-300">Last Updated</th>
              <th className="py-2 px-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {urlEntries.map((entry) => (
              <DashboardTableRow key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
