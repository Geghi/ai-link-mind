"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Loader, Bot } from "lucide-react";
import { ChatMessage } from '@/types';
import { MessageBubble } from './MessageBubble';

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
        <div className="flex justify-center items-center h-full">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-3 text-lg">Loading chat sessions...</span>
        </div>
      ) : !currentChatSessionId ? (
        <div className="flex justify-center items-center h-full text-gray-400 text-lg">
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
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 rounded-2xl rounded-bl-none px-5 py-3 flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Thinking...</span>
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </main>
  );
}
