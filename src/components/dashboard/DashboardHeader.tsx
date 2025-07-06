import { cn } from "@/lib/utils";
import React from "react";

export default function DashboardHeader() {
  return (
    <>
      <h1 className={cn(
        "text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4",
        "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
      )}>
        Dashboard
      </h1>
      <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6">
        Here you can monitor the status of your scraped sites.
      </p>
    </>
  );
}
