"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from '@/services/supabase/client';
import { ChatMessage, ChatSession, UrlEntry } from '@/types';
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessagesDisplay from "@/components/chat/ChatMessagesDisplay";
import ChatInputArea from "@/components/chat/ChatInputArea";

export default function ChatPage() {
  const { task_id: task_id } = useParams();
  const searchParams = useSearchParams();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatSessionId, setCurrentChatSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [urlEntry, setUrlEntry] = useState<UrlEntry | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewChat = async () => {
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
    } catch (error) {
      console.error("Error creating new chat session:", error);
      alert("Failed to create new chat session.");
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
      const { data: urlData, error: urlError } = await supabase
        .from('scraped_pages')
        .select('*')
        .eq('task_id', task_id)
        .limit(1)
        .single();

      if (urlError || !urlData) {
        console.error('Error fetching URL entry:', urlError);
      } else {
        setUrlEntry(urlData);
      }

      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('task_id', task_id)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error fetching chat sessions:', sessionsError);
      } else {
        setChatSessions(sessions as ChatSession[]);
        if (urlChatSessionId && sessions.some(s => s.id === urlChatSessionId)) {
          setCurrentChatSessionId(urlChatSessionId);
        } else if (sessions && sessions.length > 0) {
          setCurrentChatSessionId(sessions[0].id);
        } else {
          await handleNewChat();
        }
      }
      setInitialLoading(false);
    };

    fetchInitialData();
  }, [task_id, searchParams]); // Add searchParams to dependency array

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

  const handleDeleteChat = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this chat session and all its messages? This action cannot be undone.")) {
      return;
    }

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

  return (
    <div className="flex w-full h-screen bg-gray-900 text-white font-sans">
      <ChatSidebar
        chatSessions={chatSessions}
        currentChatSessionId={currentChatSessionId}
        urlEntry={urlEntry}
        loading={loading}
        initialLoading={initialLoading}
        handleNewChat={handleNewChat}
        setCurrentChatSessionId={setCurrentChatSessionId}
        handleDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader urlEntry={urlEntry} currentChatSessionId={currentChatSessionId} />
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
