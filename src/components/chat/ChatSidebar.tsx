"use client";

import React from 'react';
import { PlusCircle, MoreHorizontal, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatSession } from '@/types';

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentChatSessionId: string | null;
  websiteBasename: string | null;
  loading: boolean;
  initialLoading: boolean;
  handleNewChat: () => Promise<void>;
  setCurrentChatSessionId: (sessionId: string) => void;
  handleDeleteChat: (sessionId: string) => Promise<void>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function ChatSidebar({
  chatSessions,
  currentChatSessionId,
  websiteBasename,
  loading,
  initialLoading,
  handleNewChat,
  setCurrentChatSessionId,
  handleDeleteChat,
  isSidebarOpen,
  setIsSidebarOpen,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 h-full w-64 bg-gray-800/60 backdrop-blur-md border-r border-gray-700/50 flex flex-col p-4 transition-transform duration-300 ease-in-out z-50',
        'md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-400">Chats for:</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:bg-gray-700/50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      {websiteBasename && (
        <p className="text-sm text-gray-300 mb-4 truncate" title={websiteBasename}>
          {websiteBasename}
        </p>
      )}
      <Button
        onClick={handleNewChat}
        className="w-full mb-4 bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
        disabled={loading}
      >
        <PlusCircle className="w-5 h-5" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto space-y-2">
        {initialLoading ? (
          <div className="text-center text-gray-400">Loading sessions...</div>
        ) : chatSessions.length === 0 ? (
          <div className="text-center text-gray-400">No chats yet. Click New Chat to start.</div>
        ) : (
          chatSessions.map((session) => (
            <div key={session.id} className="relative flex items-center justify-between">
              <Button
                onClick={() => setCurrentChatSessionId(session.id)}
                className={cn(
                  "flex-1 justify-start text-left px-3 py-2 rounded-lg transition-colors duration-200 pr-10",
                  currentChatSessionId === session.id
                    ? "bg-blue-700/50 text-white"
                    : "hover:bg-gray-700/50 text-gray-300"
                )}
              >
                {session.title || `Chat ${new Date(session.created_at).toLocaleDateString()}`}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:bg-gray-700/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700 text-white">
                  <DropdownMenuItem onClick={() => handleDeleteChat(session.id)} className="text-red-400 hover:bg-red-900/50 focus:bg-red-900/50">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
