"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { User2 } from "lucide-react";
import { useState, useEffect } from "react"; // Import useState and useEffect

export function UserProfile({ user }: { user: User }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [mounted, setMounted] = useState(false); // Add mounted state

  useEffect(() => {
    setMounted(true); // Set mounted to true after initial render on client
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Force a re-render of the page to update auth state
  };

  // Render nothing on the server, or until mounted on the client
  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="relative h-8 w-8 rounded-full ">
          <div className="h-8 w-8 rounded-full flex items-center justify-center">
            <User2 className="h-5 w-5 text-white" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">My Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
