"use client";

import React from 'react';
import { PlusCircle, MoreHorizontal, X, MessageSquare, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  onDeleteChatSessionRequest: (sessionId: string) => void;
  onDeleteTaskRequest: () => void;
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
  onDeleteChatSessionRequest,
  onDeleteTaskRequest,
  isSidebarOpen,
  setIsSidebarOpen,
}: ChatSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background/80 backdrop-blur-md border-r border-border/50 flex flex-col p-4 transition-transform duration-300 ease-in-out z-40',
        'md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Chats for:
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground hover:bg-muted/50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      {websiteBasename && (
        <p className="text-sm text-muted-foreground mb-4 truncate" title={websiteBasename}>
          {websiteBasename}
        </p>
      )}
      <Button
        onClick={handleNewChat}
        className="w-full mb-4"
        disabled={loading}
      >
        <PlusCircle className="w-5 h-5 mr-2" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto space-y-2">
        {initialLoading ? (
          <div className="text-center text-muted-foreground">Loading sessions...</div>
        ) : chatSessions.length === 0 ? (
          <div className="text-center text-muted-foreground">No chats yet. Click New Chat to start.</div>
        ) : (
          chatSessions.map((session) => (
            <div key={session.id} className="relative flex items-center justify-between">
              <Button
                onClick={() => setCurrentChatSessionId(session.id)}
                className={cn(
                  "flex-1 justify-start text-left px-3 py-2 rounded-lg transition-colors duration-200 pr-10",
                  currentChatSessionId === session.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted/50 text-foreground hover:bg-muted/60"
                )}
              >
                {session.title || `Chat ${new Date(session.created_at).toLocaleDateString()}`}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-muted/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border border-border text-foreground">
                  <DropdownMenuItem onClick={() => onDeleteChatSessionRequest(session.id)} className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>
      <div className="mt-auto pt-4 pb-2  border-t border-border/50">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full h-10">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Site Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all scraped data and associated chat history for this website. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteTaskRequest}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
