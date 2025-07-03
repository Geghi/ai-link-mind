import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  console.log("API route /api/start-analysis hit!");
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Simulate generating a unique siteId
    const siteId = uuidv4();

    console.log(`Received URL: ${url}, Generated siteId: ${siteId}`);

    return NextResponse.json({ siteId });
  } catch (error) {
    console.error("Error in start-analysis API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
