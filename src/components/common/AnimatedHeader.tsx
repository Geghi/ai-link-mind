"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserProfile } from "./UserProfile";
import { Suspense } from "react";
import { User } from "@supabase/supabase-js";

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

interface AnimatedHeaderProps {
  user: User | null;
}

export function AnimatedHeader({ user }: AnimatedHeaderProps) {
  return (
    <motion.header
      initial="hidden"
      animate="show"
      variants={FADE_IN_ANIMATION_VARIANTS}
      className="sticky top-0 z-50 w-full bg-gray-950/50 backdrop-blur-lg border-b border-gray-800 px-4 sm:px-8 lg:px-12"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="w-7 h-7 text-purple-400" />
            <span className="text-xl font-bold">LinkMindAI</span>
          </Link>
          {user && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-gray-300 hover:text-white"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Suspense
              fallback={
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse" />
              }
            >
              <UserProfile user={user} />
            </Suspense>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
