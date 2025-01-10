import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/utils/ai";

export const runtime = 'nodejs';

// 結果の型を定義
export interface AIResult {
    title: string;
    description: string;
    source?: string;
  }

export async function POST(req: NextRequest) {
  const { keyword, timeframe } = await req.json();

  if (!keyword || !timeframe) {
    return NextResponse.json({ error: "Missing keyword or timeframe" }, { status: 400 });
  }

  try {
    const aiResponse = await generateAIResponse(keyword, timeframe);
    if (!aiResponse) {
        return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }
    const results: AIResult[] = parseAIResponse(aiResponse); // 型を指定
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}

function parseAIResponse(response: string): AIResult[] {
  const results: AIResult[] = []; // 型を指定
  const entries = response.split("\n\n");

  for (const entry of entries) {
    const lines = entry.split("\n");
    if (lines.length >= 2) {
      const result: AIResult = { // 型を指定
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