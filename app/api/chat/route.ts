import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "ユーザーの発言に必ず答える。短く自然に会話する。",
          },
          ...(messages || []),
        ],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content ?? "もう一回話して？",
    });
  } catch (error) {
    return NextResponse.json({
      reply: "エラー…もう一回話して？",
    });
  }
}
