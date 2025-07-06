"use client";

import React from 'react';
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputAreaProps {
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: () => Promise<void>;
  loading: boolean;
  initialLoading: boolean;
  currentChatSessionId: string | null;
}

export default function ChatInputArea({
  input,
  setInput,
  handleSendMessage,
  loading,
  initialLoading,
  currentChatSessionId,
}: ChatInputAreaProps) {
  return (
    <footer className="p-4 bg-gray-800/60 backdrop-blur-md border-t border-gray-700/50">
      <div className="relative">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder='Ask anything about the website...'
          className="w-full h-12 pl-5 pr-16 rounded-full bg-gray-800/70 border-2 border-gray-700/80 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          disabled={loading || initialLoading || !currentChatSessionId}
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || initialLoading || !currentChatSessionId}
          size="icon"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110 transition-transform duration-200"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
