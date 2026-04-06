import { streamText, UIMessage } from 'ai'
import { getCharacterPrompt, type CharacterId } from '@/lib/character-prompts'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, characterId }: { messages: UIMessage[]; characterId: string } = await req.json()

  // APIキーの存在確認
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // キャラクター設定を取得
  const systemPrompt = getCharacterPrompt(characterId as CharacterId)

  // UIMessage形式からOpenAI形式に手動変換（会話履歴を正確に保持）
  const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  
  for (const msg of messages) {
    // partsからテキストを抽出
    const textContent = msg.parts
      ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('') || ''
    
    if (textContent && (msg.role === 'user' || msg.role === 'assistant')) {
      conversationHistory.push({
        role: msg.role,
        content: textContent
      })
    }
  }

  // OpenAI APIに会話履歴を正しい形式で渡す
  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: systemPrompt,
    messages: conversationHistory, // 変換済みの会話履歴（全件）
    temperature: 0.95, // 高めに設定して変化を出す
    maxTokens: 150, // 簡潔な返答を促す
    frequencyPenalty: 1.2, // 同じフレーズの繰り返しを強く防ぐ
    presencePenalty: 0.9, // 新しい表現を促す
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
