import { NextResponse } from "next/server";
import { runAnalysis } from "@/lib/analysis";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body?.url;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "A valid product URL is required." }, { status: 400 });
  }

  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    return NextResponse.json({ error: "The URL provided is not valid." }, { status: 400 });
  }

  try {
    const result = await runAnalysis(normalizedUrl);
    return NextResponse.json(result);
  } catch (error) {
    const msg = error?.message || "Unexpected server error.";
    // AI parse failure or API error → 502, anything else → 500
    const status = msg.includes("API") || msg.includes("parse") ? 502 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
