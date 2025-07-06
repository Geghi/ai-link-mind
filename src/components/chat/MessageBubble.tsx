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
      className={cn(
        "flex flex-col sm:flex-row items-start gap-2 sm:gap-4 w-full",
        isUser ? "justify-end self-end items-end" : "self-start items-start"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
          isUser ? "bg-gray-700 sm:order-2" : "bg-gradient-to-br from-purple-500 to-blue-600"
        )}
      >
        {isUser ? (
          <User className="w-6 h-6 text-gray-300" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </div>
      <div
        className={cn(
          "relative px-5 py-3 rounded-2xl shadow-md transition-all duration-300 text-left sm:order-1",
          isUser
            ? "bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 text-white rounded-br-none"
            : "bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 text-gray-200 rounded-bl-none"
        )}
      >
        <p className="leading-relaxed break-word">{msg.content}</p>
      </div>
    </motion.div>
  );
};
