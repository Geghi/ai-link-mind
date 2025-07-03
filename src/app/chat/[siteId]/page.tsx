"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// --- MessageBubble Component ---
const MessageBubble = ({ msg, index }: { msg: Message; index: number }) => {
  const isUser = msg.role === "user";
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex items-start gap-4", isUser && "justify-end")}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
      )}
      <div
        className={cn(
          "relative px-5 py-3 rounded-2xl shadow-md transition-all duration-300",
          isUser
            ? "bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 text-white rounded-br-none"
            : "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 rounded-bl-none"
        )}
      >
        <p className="leading-relaxed">{msg.content}</p>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-gray-300" />
        </div>
      )}
    </motion.div>
  );
};

// --- ChatPage Component ---
export default function ChatPage() {
  const { siteId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Add a welcome message from the assistant
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm ready to answer questions about the content on ${siteId}. What would you like to know?`,
      },
    ]);
  }, [siteId]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, an error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col h-full bg-gray-900 text-white font-sans">

      {/* Messages Area */}
      <main className="flex-1 h-full ">
        <div className="flex flex-col h-full pt-12 pb-12 ">
          <div className="flex-1 flex flex-col justify-between">
            <div className="px-6 space-y-8 max-h-[65vh] overflow-y-auto flex-1 ">
              {messages.map((msg, index) => (
                <MessageBubble key={index} msg={msg} index={index} />
              ))}
              {loading && (
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
            </div>
            <div className="bottom-0 px-6 py-3">
              <div className="relative">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask anything about the website..."
                  className="w-full h-12 pl-5 pr-16 rounded-full bg-gray-800/70 border-2 border-gray-700/80 text-base text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading}
                  size="icon"
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110 transition-transform duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900/50 backdrop-blur-lg">
        
      </footer>
    </div>
  );
}
