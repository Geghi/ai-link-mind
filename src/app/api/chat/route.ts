import { NextResponse } from "next/server";
import { getSupabaseRlsClient } from '@/services/supabase/server';
import { getOrCreateAnonymousUserId } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { chat_session_id, task_id, newMessage } = await req.json();

    if (!chat_session_id || !task_id || !newMessage) {
      return NextResponse.json({ error: "chat_session_id, task_id, and newMessage are required" }, { status: 400 });
    }
    const user_id = await getOrCreateAnonymousUserId()

    // Get RLS-enabled Supabase client
    const supabase = await getSupabaseRlsClient(user_id);

    // Save user message
    const { error: userMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: chat_session_id,
        sender: 'user',
        content: newMessage,
      });

    if (userMessageError) {
      console.error('Error saving user message:', userMessageError);
      return NextResponse.json({ error: userMessageError.message }, { status: 500 });
    }

    // Fetch existing messages for context
    const { data: existingMessages, error: fetchError } = await supabase
      .from('chat_messages')
      .select('sender, content')
      .eq('chat_session_id', chat_session_id)
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('Error fetching existing messages:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const messagesToSendToRAG = existingMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const ragApiEndpoint = process.env.RAG_API_ENDPOINT;

    if (!ragApiEndpoint) {
      console.error("RAG_API_ENDPOINT is not defined in environment variables.");
      return NextResponse.json(
        { error: "RAG API endpoint not configured" },
        { status: 500 }
      );
    }

    // Send task_id and messages to RAG API
    const response = await fetch(ragApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: task_id, messages: messagesToSendToRAG, user_id: user_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from RAG API:", errorData);
      return NextResponse.json(
        { error: `Failed to get response from RAG API: ${errorData.error || response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Response from RAG API:", data);
    const assistantResponse = data.message.response;

    // Save AI message
    const { error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert({
        chat_session_id: chat_session_id,
        sender: 'ai',
        content: assistantResponse,
      });

    if (aiMessageError) {
      console.error('Error saving AI message:', aiMessageError);
      return NextResponse.json({ error: aiMessageError.message }, { status: 500 });
    }

    // Return only the assistant's response to the frontend.
    // The summary persistence is handled by the Azure Function.
    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to get response from RAG API" },
      { status: 500 }
    );
  }
}
