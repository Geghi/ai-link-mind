import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn(
      "z-50 w-full p-4 border-b border-white/10 h-16 flex items-center",
      "bg-black/30 backdrop-blur-lg", // Glassmorphism effect
      "shadow-2xl shadow-white/5",
      "transition-all duration-300"
    )}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className={cn(
          "text-2xl font-bold tracking-tighter text-white",
          "hover:scale-105 transition-transform duration-300"
        )}>
          LinkMind
        </Link>
        <p className="text-sm text-gray-400 hidden md:block">
          Your intelligent link analyzer
        </p>
      </div>
    </header>
  );
}
