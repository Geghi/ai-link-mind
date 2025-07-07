"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/services/supabase/client';
import { ChatMessage, ChatSession } from '@/types';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessagesDisplay from '@/components/chat/ChatMessagesDisplay';
import ChatInputArea from '@/components/chat/ChatInputArea';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ChatPage() {
  const { task_id: task_id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [websiteBasename, setWebsiteBasename] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isCreatingSessionRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = async (navigate = true) => {
    if (!task_id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat-sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: task_id }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const newSession: ChatSession = await response.json();
      setChatSessions((prev) => [newSession, ...prev]);
      setCurrentChatSessionId(newSession.id);
      setMessages([]);
      setInput("");

      const newUrl = `/chat/${task_id}?chatSessionId=${newSession.id}`;
      if (navigate) {
        router.push(newUrl);
      } else {
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      }
    } catch (error) {
      console.error("Error creating new chat session:", error);
      toast.error("Failed to create new chat session.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat-sessions/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setChatSessions((prev) => prev.filter((session) => session.id !== sessionId));

      if (currentChatSessionId === sessionId) {
        setCurrentChatSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!task_id){
      console.error("No task_id provided in URL parameters.");
      return;
    }

    const fetchInitialData = async () => {
      setInitialLoading(true);
      const urlChatSessionId = searchParams.get('chatSessionId');
      console.log('Fetching initial data for task_id:', task_id, 'with chatSessionId:', urlChatSessionId);

      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select('website_basename')
        .eq('id', task_id)
        .single();

      if (taskError || !taskData) {
        console.error('Error fetching task details:', taskError);
      } else {
        setWebsiteBasename(taskData.website_basename);
      }

      const response = await fetch('/api/chat-sessions');
      if (!response.ok) {
        console.error('Failed to fetch chat sessions');
        setInitialLoading(false);
        return;
      }
      const sessions = await response.json();
      setChatSessions(sessions);

      const sessionExistsInUrl = urlChatSessionId && sessions.some((s: ChatSession) => s.id === urlChatSessionId);

      if (sessionExistsInUrl) {
        console.log('Setting current chat session from URL:', urlChatSessionId);
        setCurrentChatSessionId(urlChatSessionId);
        setInitialLoading(false);
      } else if (sessions && sessions.length > 0) {
        const mostRecentSession = sessions[0];
        console.log('No valid chat session in URL, redirecting to the most recent one:', mostRecentSession.id);
        // Only redirect if the current URL doesn't already point to this session
        if (urlChatSessionId !== mostRecentSession.id) {
          router.push(`/chat/${task_id}?chatSessionId=${mostRecentSession.id}`);
        }
        setCurrentChatSessionId(mostRecentSession.id); // Ensure state is set even if not redirecting
        setInitialLoading(false);
        return; 
      } else {
        if (isCreatingSessionRef.current) return;

        console.log('No existing chat sessions found, creating a new one.');
        isCreatingSessionRef.current = true;
        await handleNewChat(false); 
        isCreatingSessionRef.current = false;
        setInitialLoading(false);
        return;
      }
    };

    fetchInitialData();
  }, [task_id, searchParams]);

  useEffect(() => {
    if (!currentChatSessionId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      const { data: fetchedMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', currentChatSessionId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        setMessages([{ id: 'error-fetch', chat_session_id: currentChatSessionId, sender: 'ai', content: 'Error loading messages.', created_at: new Date().toISOString() }]);
      } else {
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages as ChatMessage[]);
        } else {
          setMessages([
            {
              id: 'welcome-msg',
              chat_session_id: currentChatSessionId,
              sender: "ai",
              content: `Hello! I'm ready to answer questions about this website. What would you like to know?`,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat_session_${currentChatSessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_session_id=eq.${currentChatSessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          if (newMessage.sender === 'user') {
            return;
          }
          setMessages((prev) => {
            if (!prev.some(msg => msg.id === newMessage.id)) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChatSessionId]);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading || !currentChatSessionId || !task_id) return;

    const userMessage: ChatMessage = {
      id: 'temp-user-msg-' + Date.now(),
      chat_session_id: currentChatSessionId,
      sender: "user",
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_session_id: currentChatSessionId, task_id: task_id, newMessage: userMessage.content }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-msg-' + Date.now(),
          chat_session_id: currentChatSessionId,
          sender: "ai",
          content: "Sorry, an error occurred. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex w-full bg-background text-foreground font-sans h-full overflow-hidden">
      <ChatSidebar
        chatSessions={chatSessions}
        currentChatSessionId={currentChatSessionId}
        websiteBasename={websiteBasename}
        loading={loading}
        initialLoading={initialLoading}
        handleNewChat={handleNewChat}
        setCurrentChatSessionId={setCurrentChatSessionId}
        onDeleteChatSessionRequest={(sessionId) => {
          setSessionIdToDelete(sessionId);
          setIsAlertDialogOpen(true);
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat session and all of its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (sessionIdToDelete) {
                handleDeleteChat(sessionIdToDelete);
                setIsAlertDialogOpen(false);
              }
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex-1 flex flex-col transition-all h-full duration-300 md:ml-64">
        <ChatHeader
          websiteBasename={websiteBasename}
          currentChatSessionId={currentChatSessionId}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <ChatMessagesDisplay
          messages={messages}
          loading={loading}
          initialLoading={initialLoading}
          currentChatSessionId={currentChatSessionId}
          messagesEndRef={messagesEndRef}
        />
        <ChatInputArea
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          loading={loading}
          initialLoading={initialLoading}
          currentChatSessionId={currentChatSessionId}
        />
      </div>
    </div>
  );
}
