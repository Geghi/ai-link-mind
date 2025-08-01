"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Loader, Bot } from "lucide-react";
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

interface ChatMessagesDisplayProps {
  messages: ChatMessage[];
  loading: boolean;
  initialLoading: boolean;
  currentChatSessionId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessagesDisplay({
  messages,
  loading,
  initialLoading,
  currentChatSessionId,
  messagesEndRef,
}: ChatMessagesDisplayProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6 space-y-8">
      {initialLoading && !currentChatSessionId ? (
        <div className="flex justify-center items-center h-full text-muted-foreground">
          <Loader className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading chat sessions...</span>
        </div>
      ) : !currentChatSessionId ? (
        <div className="flex justify-center items-center h-full text-muted-foreground text-lg">
          Select a chat from the sidebar or click New Chat to begin.
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble key={msg.id || index} msg={msg} index={index} />
        ))
      )}
      {loading && !initialLoading && currentChatSessionId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className={cn(
            "relative px-5 py-3 rounded-2xl shadow-md transition-all duration-300 text-left",
            "bg-card/60 backdrop-blur-sm border border-border/50 text-foreground rounded-bl-none",
            "flex items-center gap-3"
          )}>
            <Loader className="w-5 h-5 animate-spin text-primary" />
            <span>Thinking...</span>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </main>
  );
}
