import { NextResponse } from "next/server";
import { getSupabaseRlsClient } from '@/services/supabase/server'; // Import getSupabaseRlsClient
import { getOrCreateAnonymousUserId } from '@/lib/auth';

// Helper function to extract website basename
const getWebsiteBasename = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let hostname = urlObj.hostname;
    // Remove 'www.' prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname;
  } catch (error) {
    console.error("Error parsing URL for basename:", error);
    return "unknown.com"; // Fallback
  }
};

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const websiteBasename = getWebsiteBasename(url);
    const userId = await getOrCreateAnonymousUserId();
    console.log(`Creating task for user ID: ${userId} with website basename: ${websiteBasename}`);

    // Get RLS-enabled Supabase client
    const supabase = await getSupabaseRlsClient(userId);

    // Insert into the 'tasks' table using the RLS-enabled client
    const { data: newTask, error: taskError } = await supabase
      .from('tasks')
      .insert({ website_basename: websiteBasename, user_id: userId })
      .select('id')
      .single();

    if (taskError || !newTask) {
      console.error("Error inserting new task:", taskError);
      return NextResponse.json({ error: "Failed to create new task" }, { status: 500 });
    }

    return NextResponse.json({ task_id: newTask.id });
  } catch (error) {
    console.error("Error in tasks/create API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
