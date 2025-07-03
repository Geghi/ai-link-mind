"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Import cn utility
import { useUrlContext } from '@/lib/context/UrlContext'; // Import useUrlContext

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { addUrlEntry } = useUrlContext(); // Use the context

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    console.log("Starting analysis for URL:", url);
    try {
      // Simulate API call to backend
      const response = await fetch("/api/start-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to start analysis");
      }

      const data = await response.json();
      const { siteId } = data;

      // Add the URL to the context
      addUrlEntry({
        id: siteId, // Assuming siteId can be used as the unique ID for UrlEntry
        url,
        status: 'Queued',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Navigate to dashboard with the received siteId
      router.push(`/dashboard?siteId=${siteId}`);
    } catch (error) {
      console.error("Error starting analysis:", error);
      alert("Failed to start analysis. Please try again.");
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center min-h-screen w-full", // Ensure full height and width
      "text-white", // Text color
      "p-4 sm:p-8 lg:p-12" // Responsive padding
    )}>
      <header className="mb-12 animate-fade-in-down">
        <h1 className={cn(
          "text-6xl sm:text-7xl lg:text-8xl font-extrabold mb-4",
          "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600", // Gradient title
          "drop-shadow-lg" // Subtle shadow for 3D effect
        )}>
          LinkMindAI
        </h1>
        <p className={cn(
          "text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-2xl mx-auto",
          "animate-fade-in-up delay-200" // Staggered animation
        )}>
          Your intelligent web-scraping and knowledge-base assistant.
          Transform any website into a queryable knowledge base with AI.
        </p>
      </header>
      <main className="w-full max-w-md animate-fade-in-up delay-400">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
          <Input
            type="url"
            placeholder="Enter a URL to analyze (e.g., https://example.com)"
            className="bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button
            type="submit"
            className={cn(
              "bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg",
              "hover:from-blue-600 hover:to-purple-700 transition-all duration-300",
              "shadow-lg hover:shadow-xl transform hover:scale-105" // Micro-animations
            )}
          >
            Start Analysis
          </Button>
        </form>
      </main>
    </div>
  );
}
