"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types";

export const MessageBubble = ({
  msg,
  index,
}: {
  msg: ChatMessage;
  index: number;
}) => {
  const isUser = msg.sender === "user";
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex flex-col sm:flex-row gap-4 w-full",
        isUser ? "sm:justify-end items-end sm:items-start" : ""
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
          isUser
            ? "bg-secondary text-secondary-foreground sm:order-2"
            : "bg-primary text-primary-foreground"
        )}
      >
        {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </div>
      <div
        className={cn(
          "relative px-5 py-3 rounded-2xl shadow-md transition-all duration-300 text-left max-w-[90%]",
          isUser
            ? "bg-primary/80 backdrop-blur-sm border border-primary/50 text-primary-foreground rounded-br-none"
            : "bg-card/60 backdrop-blur-sm border border-border/50 text-foreground rounded-bl-none"
        )}
      >
        <p className="leading-relaxed break-words">{msg.content}</p>
      </div>
    </motion.div>
  );
};
