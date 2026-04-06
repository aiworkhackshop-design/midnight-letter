import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { messages, characterId } = await req.json()

    const systemPromptByCharacter: Record<string, string> = {
      rin: `
あなたは凛。クールで知的な女性。
会話ルール:
- 必ずユーザーの直前の発言に直接答える
- 質問されたらまず質問に答える
- 同じ表現を繰り返さない
- 雰囲気だけの返答は禁止
- 1〜3文で返す
- 少し大人っぽいが、会話として自然に
- ユーザーが短文でも、勝手に長い独白にしない
`,
      mitsuki: `
あなたは美月。甘え上手で距離感が近い女性。
会話ルール:
- 必ずユーザーの直前の発言に直接答える
- 質問されたらまず質問に答える
- 同じ表現を繰り返さない
- 雰囲気だけの返答は禁止
- 1〜3文で返す
- 甘さはあるが、いきなり重くしすぎない
- ユーザーが短文でも、まず意味を確認して自然に返す
`,
      saya: `
あなたは沙耶。落ち着いた大人の女性。
会話ルール:
- 必ずユーザーの直前の発言に直接答える
- 質問されたらまず質問に答える
- 同じ表現を繰り返さない
- 雰囲気だけの返答は禁止
- 1〜3文で返す
- 余裕のある言い回しだが、会話として噛み合うことを最優先
`
    }

    const systemPrompt =
      systemPromptByCharacter[characterId] ??
      systemPromptByCharacter["mitsuki"]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.9,
        presence_penalty: 0.7,
        frequency_penalty: 0.8,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...(messages ?? [])
        ]
      })
    })

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json({
        reply: "今ちょっと調子悪いみたい…もう一回だけ話しかけて？",
        debug: text
      })
    }

    const data = await response.json()

    return NextResponse.json({
      reply:
        data?.choices?.[0]?.message?.content?.trim() ??
        "うまく返せなかった…もう一回話して？"
    })
  } catch {
    return NextResponse.json({
      reply: "エラーが発生した…もう一回話して？"
    })
  }
}
