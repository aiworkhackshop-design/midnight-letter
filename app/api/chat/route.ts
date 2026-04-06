export async function POST(req: Request) {
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
            "あなたは甘くて少し依存気味な女性キャラ。必ず会話を成立させてください。"
        },
        ...messages
      ]
    })
  })

  const data = await response.json()

  return Response.json({
    reply: data.choices?.[0]?.message?.content || "うまく返せなかった…"
  })
}
