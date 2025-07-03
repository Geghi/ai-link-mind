"use client";

import { useUrlContext } from '@/lib/context/UrlContext';
import { UrlEntry, UrlStatus } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button
import { v4 as uuidv4 } from 'uuid';

export default function DashboardPage() {
  const { urlEntries, addUrlEntry, updateUrlEntryStatus } = useUrlContext();

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

  const handleAddDummyUrl = () => {
    const dummyUrl = `https://example.com/test-${Math.random().toFixed(3)}`;
    const newEntry: UrlEntry = {
      id: uuidv4(),
      url: dummyUrl,
      status: 'Queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addUrlEntry(newEntry);
  };

  const handleSimulateStatusChange = async () => {
    if (urlEntries.length > 0) {
      const lastEntry = urlEntries[urlEntries.length - 1];
      let nextStatus: UrlStatus;
      switch (lastEntry.status) {
        case 'Queued':
          nextStatus = 'In Progress';
          break;
        case 'In Progress':
          nextStatus = 'Completed';
          break;
        case 'Completed':
          nextStatus = 'Failed';
          break;
        case 'Failed':
          nextStatus = 'Queued';
          break;
        default:
          nextStatus = 'Queued';
      }
      await updateUrlEntryStatus(lastEntry.id, nextStatus);
    } else {
      alert('No URLs to simulate status change for. Add a dummy URL first!');
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

      <div className="flex gap-4 mb-6">
        <Button onClick={handleAddDummyUrl} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Add Dummy URL
        </Button>
        <Button onClick={handleSimulateStatusChange} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
          Simulate Status Change
        </Button>
      </div>

      {urlEntries.length === 0 ? (
        <p className="text-gray-400">No URLs have been added yet.</p>
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
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(entry.updatedAt).toLocaleString()}
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
