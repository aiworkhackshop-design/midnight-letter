import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content:
              "あなたは美月という名前の、甘くて少し依存気味な女性キャラです。必ず会話を成立させてください。ユーザーの質問には必ず直接答えてください。短すぎず、自然で、少し色気のある返答をしてください。同じ表現を繰り返さないでください。"
          },
          ...(messages ?? [])
        ]
      })
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({
        reply: `OpenAI error: ${text}`
      })
    }

    const data = await response.json()

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content?.trim() ||
        "うまく返せなかった…もう一回話して？"
    })
  } catch (error) {
    return NextResponse.json({
      reply: "エラーが発生した…もう一回話して？"
    })
  }
}
