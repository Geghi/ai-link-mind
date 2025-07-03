import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { siteId, messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Add a dummy system prompt for testing
    const systemPrompt = {
      role: "system",
      content: `You are a helpful assistant for the website with ID: ${siteId}. Answer questions based on the context of this website. If you don't know the answer, say so.`,
    };

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can change this to a more capable model like "gpt-4" if available
      messages: [systemPrompt, ...messages],
    });

    const assistantResponse = chatCompletion.choices[0].message.content;

    return NextResponse.json({ response: assistantResponse });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to get response from OpenAI" },
      { status: 500 }
    );
  }
}
