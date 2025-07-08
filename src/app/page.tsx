"use client";

import { cn } from "@/lib/utils";
import MarketingContent from "@/components/home/MarketingContent";

export default function Home() {
  
  return (
    <div className={cn(
      "flex flex-col  items-center justify-center text-center w-full",
      "text-white",
    )}>
      <MarketingContent />
    </div>
  );
}
