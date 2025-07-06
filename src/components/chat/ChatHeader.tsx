import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  websiteBasename: string | null;
  currentChatSessionId: string | null;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function ChatHeader({ websiteBasename, currentChatSessionId, setIsSidebarOpen }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800/60 backdrop-blur-md border-b border-gray-700/50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:bg-gray-700/50"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg hidden sm:block md:text-2xl font-bold text-blue-400 truncate">
          {websiteBasename ? `Chat about ${websiteBasename}` : 'Loading...'}
        </h1>
      </div>
      {currentChatSessionId && (
        <span className="text-xs md:text-sm text-gray-400">
          Session: {currentChatSessionId.substring(0, 8)}...
        </span>
      )}
    </header>
  );
}
