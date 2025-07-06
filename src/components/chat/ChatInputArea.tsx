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
    <footer className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md">
      <div className="relative max-w-3xl mx-auto">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder='Ask anything about the website...'
          className="w-full h-12 pl-5 pr-16 rounded-full bg-input border border-border text-base placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-0"
          disabled={loading || initialLoading || !currentChatSessionId}
        />
        <Button
          onClick={handleSendMessage}
          disabled={loading || initialLoading || !currentChatSessionId}
          size="icon"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 w-9 h-9 rounded-full"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </footer>
  );
}
