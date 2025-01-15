import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

interface BedrockResponse {
  completion: string;
}

const region = process.env.NEXT_PUBLIC_APP_AWS_REGION || process.env.APP_AWS_REGION || "ap-northeast-1"; // 環境変数がない場合のフォールバック
const bedrockClient = new BedrockRuntimeClient({
  region: region,
});

export async function generateAIResponse(keyword: string, timeframe: string): Promise<string> {
  const prompt = `
あなたは未来予測の専門家です。以下のキーワードと期間に基づいて、世界の未来変化の兆しを4つ探索してください。
既存のトレンドの延長線上にはない、革新的な変化につながる可能性を持った事例や、未来に対するクリエイティブな発想を刺激する事例を収集してください。

キーワード: ${keyword}
期間: ${timeframe}

各事例について、以下の形式で出力してください：
- タイトル
- 説明（100-150文字程度）
- ソースのURL（存在する場合のみ）
`;

  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  try {
    const response = await bedrockClient.send(command);
    const responseBody: BedrockResponse = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.completion;
  } catch (error) {
    console.error("Error calling Bedrock:", error);
    if (error instanceof Error) {
      throw new Error(`AI生成に失敗しました: ${error.message}`);
    } else {
      throw new Error("AI生成中に予期せぬエラーが発生しました。");
    }
  }
}

