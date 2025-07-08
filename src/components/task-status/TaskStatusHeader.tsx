import { cn } from "@/lib/utils";
import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function TaskStatusHeader() {
  return (
    <header className="mb-8 text-center">
      <h1 className={cn(
        "text-4xl sm:text-5xl font-extrabold mb-2 tracking-tighter flex items-center justify-center gap-3",
        "text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-orange-500"
      )}>
        <LayoutDashboard className="h-8 w-8 text-primary hidden sm:block" />
        Analysis TaskStatus
      </h1>
      <p className="text-lg text-muted-foreground">
        Monitor the real-time status of your website analysis tasks.
      </p>
    </header>
  );
}
