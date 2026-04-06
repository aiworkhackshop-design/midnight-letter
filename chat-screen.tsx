"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { Character } from "@/lib/types"
import { MessageLimit } from "./message-limit"
import { PremiumModal } from "./premium-modal"
import { cn } from "@/lib/utils"

interface ChatScreenProps {
  character: Character
  onBack: () => void
}

// UIMessageからテキストを抽出するヘルパー
function getMessageText(message: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!message.parts || !Array.isArray(message.parts)) return ""
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function ChatScreen({ character, onBack }: ChatScreenProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  // セッションごとにユニークなIDを生成（キャラ切り替えで履歴をリセット）
  const [sessionId] = useState(() => `${character.id}-${Date.now()}`)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, characterId: character.id },
        }),
      }),
    [character.id]
  )

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    id: sessionId, // ユニークなセッションIDを使用
  })

  const isLoading = status === "streaming" || status === "submitted"
  const remainingMessages = isPremium ? 999 : Math.max(0, 10 - messageCount)

  // 初期挨拶メッセージを設定
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          parts: [{ type: "text", text: character.greeting }],
        },
      ])
    }
  }, [character.greeting, messages.length, setMessages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (remainingMessages <= 0) {
      setShowPremiumModal(true)
      return
    }

    setMessageCount((prev) => prev + 1)
    const messageText = input.trim()
    setInput("")
    sendMessage({ text: messageText })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-card transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-serif font-semibold text-white",
                character.avatarColor
              )}
            >
              {character.name[0]}
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {character.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "入力中..." : "オンライン"}
              </p>
            </div>
          </div>
        </div>

        <MessageLimit
          remaining={remainingMessages}
          total={10}
          onUpgrade={() => setShowPremiumModal(true)}
        />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((message) => {
            const text = getMessageText(message)
            const isUser = message.role === "user"

            return (
              <div
                key={message.id}
                className={cn("flex items-end gap-3", isUser && "flex-row-reverse")}
              >
                {!isUser && (
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-serif font-semibold text-white",
                      character.avatarColor
                    )}
                  >
                    {character.name[0]}
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border/50 bg-card text-foreground"
                  )}
                >
                  {text}
                </div>
              </div>
            )
          })}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex items-end gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-serif font-semibold text-white",
                  character.avatarColor
                )}
              >
                {character.name[0]}
              </div>
              <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-border/50 bg-card px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-border/40 bg-background/95 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none rounded-2xl border border-border/50 bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all",
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </div>

        {remainingMessages <= 3 && remainingMessages > 0 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            残り{remainingMessages}回のメッセージです。
            <button
              onClick={() => setShowPremiumModal(true)}
              className="ml-1 text-primary hover:underline"
            >
              Premiumで無制限に
            </button>
          </p>
        )}
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
          setShowPremiumModal(false)
          setIsPremium(true)
        }}
      />
    </div>
  )
}
