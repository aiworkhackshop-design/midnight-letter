const formattedMessages = (messages ?? []).map((m: any) => ({
  role: m.role,
  content: m.content ?? ""
}))

const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: "gpt-4.1-mini",
    temperature: 0.9,
    presence_penalty: 0.6,
    frequency_penalty: 0.8,
    messages: [
      {
        role: "system",
        content:
          "あなたは会話が成立する女性キャラ。必ずユーザーの直前の発言に直接答えること。質問には必ず答える。同じ表現は禁止。"
      },
      ...formattedMessages
    ]
  })
})
