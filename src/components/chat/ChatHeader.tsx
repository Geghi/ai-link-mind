import React from 'react';
import { Menu, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  websiteBasename: string | null;
  currentChatSessionId: string | null;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function ChatHeader({ websiteBasename, currentChatSessionId, setIsSidebarOpen }: ChatHeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md"
    )}>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:bg-muted/50"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground flex items-center gap-2  ">
          <MessageSquare className="hidden sm:block h-5 w-5 text-primary" />
          {websiteBasename ? `Chat about ${websiteBasename}` : 'Loading...'}
        </h1>
      </div>
      {currentChatSessionId && (
        <span className="hidden sm:block text-xs text-muted-foreground">
          Session: {currentChatSessionId.substring(0, 8)}...
        </span>
      )}
    </header>
  );
}
