"use client";

import { useUrlContext } from '@/lib/context/UrlContext';
import { UrlEntry } from '@/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { urlEntries } = useUrlContext();

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

  return (
    <div className="p-4 sm:p-8 lg:p-12 text-white">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Dashboard
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6">
        Here you can monitor the status of your scraped sites.
      </p>

      {urlEntries.length === 0 ? (
        <p className="text-gray-400">No URLs have been added yet for this task.</p>
      ) : (
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
                  <tr key={entry.id} className="border-b border-white/10 last:border-b-0">
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
                        <Link href={`/chat/${entry.id}`} className="text-purple-400 hover:underline">
                          Chat
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
