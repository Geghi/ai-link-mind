"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import HomePageHeader from "@/components/home/HomePageHeader";
import UrlInputForm from "@/components/home/UrlInputForm";
import ChatList from "@/components/home/ChatList";
import { useUrlStoreActions } from '@/stores/urlStore';

export default function Home() {
  const router = useRouter();
  const { setPendingAnalysis } = useUrlStoreActions();

  const handleUrlSubmit = async (url: string, task_id: string) => {
    setPendingAnalysis(url, task_id); 
    router.push(`/dashboard`);
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center min-h-screen w-full",
      "text-white",
      "p-4 sm:p-8 lg:p-12"
    )}>
      <HomePageHeader />
      <UrlInputForm onUrlSubmit={handleUrlSubmit} />
      <ChatList />
    </div>
  );
}
