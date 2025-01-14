import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/utils/ai";

export const runtime = 'nodejs';

interface Result {
  title: string;
  description: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  const { keyword, timeframe } = await req.json();

  try {
    const aiResponse = await generateAIResponse(keyword, timeframe);
    const results = parseAIResponse(aiResponse);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}

function parseAIResponse(response: string): Result[] {
  const results: Result[] = [];
  const entries = response.split("\n\n");

  for (const entry of entries) {
    const lines = entry.split("\n");
    if (lines.length >= 2) {
      const result: Result = {
        title: lines[0].replace(/^- /, ""),
        description: lines[1],
      };
      if (lines[2] && lines[2].startsWith("- ")) {
        result.source = lines[2].replace(/^- /, "");
      }
      results.push(result);
    }
  }

  return results;
}

