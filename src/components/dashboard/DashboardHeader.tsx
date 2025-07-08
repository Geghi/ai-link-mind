import { cn } from "@/lib/utils";
import React from "react";

export default function DashboardHeader() {
  return (
    <header className="mb-12 animate-fade-in-down text-center">
      <h1 className={cn(
        "text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tighter",
        "text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-orange-500",
        "drop-shadow-lg"
      )}>
        LinkMindAI
      </h1>
      <p className={cn(
        "text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto",
        "animate-fade-in-up delay-200"
      )}>
        Paste a URL, and we&apos;ll transform the entire website into a smart, queryable knowledge base for you.
      </p>
    </header>
  );
}
