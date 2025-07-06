import React from 'react';
import { UrlEntry } from '@/types';

interface ChatHeaderProps {
  urlEntry: UrlEntry | null;
  currentChatSessionId: string | null;
}

export default function ChatHeader({ urlEntry, currentChatSessionId }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800/60 backdrop-blur-md border-b border-gray-700/50">
      <h1 className="text-2xl font-bold text-blue-400">
        {urlEntry ? `Chat about ${urlEntry.url.substring(0, 50)}...` : 'Loading...'}
      </h1>
      {currentChatSessionId && (
        <span className="text-sm text-gray-400">Session: {currentChatSessionId.substring(0, 8)}...</span>
      )}
    </header>
  );
}
