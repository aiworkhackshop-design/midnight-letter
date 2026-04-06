"use client"

import { useState, useRef, useEffect } from "react"
import type { Character } from "@/lib/types"
import { MessageLimit } from "./message-limit"
import { PremiumModal } from "./premium-modal"
import { cn } from "@/lib/utils"

interface ChatScreenProps {
  character: Character
  onBack: () => void
}

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function ChatScreen({ character, onBack }: ChatScreenProps) {
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "greeting",
      role: "assistant",
      content: character.greeting,
    },
  ])

  const remainingMessages = isPremium ? 999 : Math.max(0, 10 - messageCount)

  useEffect(() => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: character.greeting,
      },
    ])
    setInput("")
    setMessageCount(0)
    setIsLoading(false)
  }, [character.id, character.greeting])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    if (remainingMessages <= 0) {
      setShowPremiumModal(true)
      return
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    }

    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput("")
    setMessageCount((prev) => prev + 1)
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character.id,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()
      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply.trim()
          : "うまく返せなかった…もう一回話して？"

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
      }

      setMessages([...nextMessages, assistantMessage])
    } catch {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "通信が少し不安定みたい…もう一回だけ話しかけて？",
      }

      setMessages([...nextMessages, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#040612] text-white">
      <header className="flex items-center justify-between border-b border-white/5 px-5 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-serif text-white shadow-lg",
                character.avatarColor
              )}
            >
              {character.name[0]}
            </div>

            <div>
              <h2 className="font-serif text-[34px] leading-none text-white">
                {character.name}
              </h2>
              <p className="mt-2 text-[18px] text-white/70">
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

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {messages.map((message) => {
            const isUser = message.role === "user"

            return (
              <div
                key={message.id}
                className={cn("flex items-end gap-4", isUser && "flex-row-reverse")}
              >
                {!isUser && (
                  <div
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-serif text-white shadow-lg",
                      character.avatarColor
                    )}
                  >
                    {character.name[0]}
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[78%] rounded-[28px] px-6 py-5 text-[16px] leading-[1.9] shadow-[0_8px_30px_rgba(0,0,0,0.2)]",
                    isUser
                      ? "rounded-br-[12px] bg-[#9b8cff] text-white"
                      : "rounded-bl-[12px] border border-white/10 bg-[#140f35] text-white"
                  )}
                >
                  {message.content}
                </div>
              </div>
            )
          })}

          {isLoading && (
            <div className="flex items-end gap-4">
              <div
                className={cn(
                  "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-serif text-white shadow-lg",
                  character.avatarColor
                )}
              >
                {character.name[0]}
              </div>

              <div className="flex gap-2 rounded-[28px] rounded-bl-[12px] border border-white/10 bg-[#140f35] px-6 py-5">
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.3s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/50 [animation-delay:-0.15s]" />
                <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/50" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-white/5 px-5 py-5">
        <div className="mx-auto flex max-w-4xl items-end gap-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="メッセージを入力..."
              rows={1}
              disabled={isLoading}
              className="w-full resize-none rounded-[24px] border border-white/8 bg-[#090b1a] px-5 py-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex h-[72px] min-w-[112px] shrink-0 items-center justify-center rounded-[22px] text-[18px] font-medium transition-all",
              input.trim() && !isLoading
                ? "bg-white text-black hover:bg-white/90"
                : "bg-white/85 text-black/50"
            )}
          >
            送信
          </button>
        </div>
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
