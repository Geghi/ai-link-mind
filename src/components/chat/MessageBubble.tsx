"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from '@/types';

export const MessageBubble = ({ msg, index }: { msg: ChatMessage; index: number }) => {
  const isUser = msg.sender === "user";
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
          "relative px-5 py-3 rounded-2xl shadow-md transition-all duration-300 text-left",
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
