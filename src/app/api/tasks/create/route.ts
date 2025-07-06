import { NextResponse } from "next/server";
import { supabase } from '@/services/supabase/client';

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

    // Insert into the 'tasks' table
    const { data: newTask, error: taskError } = await supabase
      .from('tasks')
      .insert({ website_basename: websiteBasename })
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
