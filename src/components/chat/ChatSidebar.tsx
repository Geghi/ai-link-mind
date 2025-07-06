"use client";

import React from 'react';
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatSession, UrlEntry } from '@/types';

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentChatSessionId: string | null;
  urlEntry: UrlEntry | null;
  loading: boolean;
  initialLoading: boolean;
  handleNewChat: () => Promise<void>;
  setCurrentChatSessionId: (sessionId: string) => void;
  handleDeleteChat: (sessionId: string) => Promise<void>;
}

export default function ChatSidebar({
  chatSessions,
  currentChatSessionId,
  urlEntry,
  loading,
  initialLoading,
  handleNewChat,
  setCurrentChatSessionId,
  handleDeleteChat,
}: ChatSidebarProps) {
  return (
    <aside className="w-64 bg-gray-800/60 backdrop-blur-md border-r border-gray-700/50 flex flex-col p-4">
      <h2 className='text-xl font-bold mb-4 text-blue-400'>Chats for:</h2>
      {urlEntry && (
        <p className="text-sm text-gray-300 mb-4 truncate" title={urlEntry.url}>
          {urlEntry.url}
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
