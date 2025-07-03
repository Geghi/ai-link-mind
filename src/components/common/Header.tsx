import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className={cn(
      "z-50 w-full p-4 border-b border-white/20",
      "shadow-lg", // Glassmorphism and shadow
      "transition-all duration-300", // Micro-animations
      "dark:bg-gray-900/50 dark:border-gray-700" // Dark mode ready
    )}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className={cn(
          "text-2xl font-extrabold text-transparent bg-clip-text",
          "bg-gradient-to-r from-blue-400 to-purple-600", // Gradient accent
          "hover:scale-105 transition-transform duration-300" // Micro-animation
        )}>
          LinkMindAI
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className={cn(
            "text-lg font-medium text-gray-800 hover:text-blue-600",
            "dark:text-gray-200 dark:hover:text-blue-400",
            "transition-colors duration-300 hover:scale-105" // Micro-animation
          )}>
            Dashboard
          </Link>
          {/* Potentially add a theme toggle or other elements here later */}
        </div>
      </nav>
    </header>
  );
}
