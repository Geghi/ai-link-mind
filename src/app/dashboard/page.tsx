"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UrlInputForm from "@/components/dashboard/UrlInputForm";
import ChatList from "@/components/dashboard/ChatList";
import { useUrlStoreActions } from "@/stores/urlStore";

export default function Home() {
  const router = useRouter();
  const { setPendingAnalysis } = useUrlStoreActions();

  const handleUrlSubmit = async (url: string, task_id: string) => {
    setPendingAnalysis(url, task_id);
    router.push(`/task-status?task_id=${task_id}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col px-4 space-y-8 items-center justify-center text-center w-full pt-12",
        "text-white"
      )}
    >
      <DashboardHeader />
      <UrlInputForm onUrlSubmit={handleUrlSubmit} />
      <ChatList />
    </div>
  );
}
