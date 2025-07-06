import { cn } from "@/lib/utils";
import React from "react";

export default function HomePageHeader() {
  return (
    <header className="mb-12 animate-fade-in-down">
      <h1 className={cn(
        "text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-4",
        "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600",
        "drop-shadow-lg"
      )}>
        LinkMindAI
      </h1>
      <p className={cn(
        "text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto",
        "animate-fade-in-up delay-200"
      )}>
        Your intelligent web-scraping and knowledge-base assistant.
        Transform any website into a queryable knowledge base with AI.
      </p>
    </header>
  );
}
