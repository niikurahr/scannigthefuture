import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/utils/ai";

export const runtime = 'nodejs';

export interface AIResult {
  title: string;
  description: string;
  source?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { keyword, timeframe } = await req.json();
    console.log("Request received:", { keyword, timeframe }); // リクエスト内容をログ出力

    // バリデーションの追加 (空文字列チェック)
    if (!keyword || keyword.trim() === "") {
      console.error("Error: Keyword is empty.");
      return NextResponse.json({ error: "キーワードを入力してください。" }, { status: 400 });
    }
    if (!timeframe || timeframe.trim() === "") {
        console.error("Error: Timeframe is empty.");
        return NextResponse.json({ error: "期間を選択してください。" }, { status: 400 });
      }

    const aiResponse = await generateAIResponse(keyword, timeframe);
    console.log("AI Response (raw):", aiResponse); // AIからの生のレスポンスをログ出力

    const results = parseAIResponse(aiResponse);
    console.log("Parsed Results:", results); // パース後の結果をログ出力

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error generating AI response:", error);
    // より詳細なエラー情報を返すように修正
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate response" }, { status: 500 });
  }
}

function parseAIResponse(response: string): AIResult[] {
  const results: AIResult[] = [];

    try {
        if (!response) {
            console.error("Error: Response is empty or null.");
            return []; // 空の配列を返すか、エラーをthrowするかは状況に応じて判断
        }
        const entries = response.split("\n\n");
        console.log("Entries:", entries); // 分割されたエントリをログ出力

        for (const entry of entries) {
            const lines = entry.split("\n");
            console.log("Lines in entry:", lines); // 各エントリの行をログ出力
            if (lines.length >= 2) {
                const result: AIResult = {
                    title: lines[0].replace(/^- /, ""),
                    description: lines[1],
                };
                if (lines[2] && lines[2].startsWith("- ")) {
                    result.source = lines[2].replace(/^- /, "");
                }
                results.push(result);
            } else {
                console.warn("Warning: Invalid entry format:", entry); // 不正なフォーマットのエントリを警告としてログ出力
            }
        }
    } catch (parseError) {
        console.error("Error during parsing:", parseError, "Original response:", response);
        // エラーを再スローして上位のcatchブロックで処理するか、空配列を返すかを選択
        throw parseError; // または return [];
    }

  return results;
}