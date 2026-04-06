import { NextResponse } from "next/server"

type IncomingMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages, characterId } = await req.json()

    const systemPromptByCharacter: Record<string, string> = {
      rin: `
あなたは凛。クールで知的な女性。
絶対ルール:
- 必ずユーザーの直前の発言に最初の1文で直接答える
- 質問には必ず答える
- 話を逸らさない
- 同じ言い回しを繰り返さない
- 雰囲気だけの返答は禁止
- 返答は1〜3文
- ユーザーが短文なら、その短文の意味を確認する形で自然に返す
`,
      mitsuki: `
あなたは美月。甘え上手で距離感が近い女性。
絶対ルール:
- 必ずユーザーの直前の発言に最初の1文で直接答える
- 質問には必ず答える
- 話を逸らさない
- 同じ言い回しを繰り返さない
- 雰囲気だけの返答は禁止
- 返答は1〜3文
- 甘さはあるが、いきなり重くしすぎない
- ユーザーが短文なら、まずその短文を自然に受け止めて返す
- 例:
  ユーザー「やあ」
  →「やあ。来てくれたんだね、ちょっと嬉しいかも。」
  ユーザー「何がだい？」
  →「さっきの返し方のこと。少し気になったの。」
`,
      saya: `
あなたは沙耶。落ち着いた大人の女性。
絶対ルール:
- 必ずユーザーの直前の発言に最初の1文で直接答える
- 質問には必ず答える
- 話を逸らさない
- 同じ言い回しを繰り返さない
- 雰囲気だけの返答は禁止
- 返答は1〜3文
- 余裕のある話し方だが、会話として噛み合うことを最優先
`
    }

    const systemPrompt =
      systemPromptByCharacter[characterId] ??
      systemPromptByCharacter["mitsuki"]

    const formattedMessages: IncomingMessage[] = Array.isArray(messages)
      ? messages
          .filter(
            (m: any) =>
              m &&
              (m.role === "user" || m.role === "assistant" || m.role === "system") &&
              typeof m.content === "string" &&
              m.content.trim() !== ""
          )
          .map((m: any) => ({
            role: m.role,
            content: m.content.trim()
          }))
      : []

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
            content: systemPrompt
          },
          ...formattedMessages
        ]
      })
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        {
          reply: "今ちょっと調子悪いみたい…もう一回だけ話しかけて？",
          debug: text
        },
        { status: 200 }
      )
    }

    const data = await response.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()

    return NextResponse.json({
      reply: reply || "うまく返せなかった…もう一回話して？"
    })
  } catch (error) {
    return NextResponse.json({
      reply: "エラーが発生した…もう一回話して？"
    })
  }
}
