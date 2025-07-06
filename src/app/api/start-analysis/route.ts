import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, task_id } = await request.json(); // Accept task_id from frontend

    if (!url || !task_id) {
      return NextResponse.json({ error: "URL and task_id are required" }, { status: 400 });
    }

    console.log(`Received URL: ${url}, Received task_id: ${task_id}`);

    const scrapingApiEndpoint = process.env.SCRAPING_API_ENDPOINT;

    if (!scrapingApiEndpoint) {
      return NextResponse.json({ error: "SCRAPING_API_ENDPOINT is not defined in environment variables" }, { status: 500 });
    }

    const response = await fetch(scrapingApiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, task_id: task_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error calling scraping API:", errorData);
      return NextResponse.json({ error: `Failed to start scraping job: ${errorData.error || response.statusText}` }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in start-analysis API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
