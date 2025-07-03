import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, siteId } = await request.json(); // Accept siteId from frontend

    if (!url || !siteId) {
      return NextResponse.json({ error: "URL and siteId are required" }, { status: 400 });
    }

    console.log(`Received URL: ${url}, Received siteId: ${siteId}`);

    return NextResponse.json({ siteId });
  } catch (error) {
    console.error("Error in start-analysis API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
