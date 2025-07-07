import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";
import { Suspense } from "react";
import { getUser } from "@/lib/auth";
import { UserProfile } from "./UserProfile";

export async function Header() {
  const user = await getUser();

  return (
    <header className={cn(
      "sticky top-0 px-4 sm:px-8 lg:px-12 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    )}>
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tighter">
            LinkMindAI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <Suspense fallback={<div className="h-8 w-8 rounded-full bg-gray-600" />}>
              <UserProfile user={user} />
            </Suspense>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted-foreground hidden md:block">
                Login
              </Link>
              <Link href="/register" className="text-sm text-muted-foreground hidden md:block">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
