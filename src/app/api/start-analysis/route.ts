import { NextResponse } from "next/server";
import { createClient } from "@/services/supabase/server";
import apiClient from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const { url, task_id } = await request.json(); // Accept task_id from frontend

    if (!url || !task_id) {
      return NextResponse.json({ error: "URL and task_id are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = user.id;
    console.log(`Received URL: ${url}, Received task_id: ${task_id}, User ID: ${userId}`);

    const scrapingApiEndpoint = process.env.SCRAPING_API_ENDPOINT;

    if (!scrapingApiEndpoint) {
      return NextResponse.json({ error: "SCRAPING_API_ENDPOINT is not defined in environment variables" }, { status: 500 });
    }

      const response = await apiClient.post(scrapingApiEndpoint, { url, task_id: task_id, user_id: userId });
      return NextResponse.json(response.data);
    } catch (error) {
    console.error("Error in start-analysis API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
