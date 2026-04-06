"use client"

import { useMemo, useRef, useState } from "react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "…ねぇ、ちゃんと話してくれる？" }
  ])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const characterName = "美月"
  const remaining = useMemo(() => Math.max(0, 10 - Math.floor(messages.length / 2)), [messages])

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setSending(true)
    scrollToBottom()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          characterId: "mitsuki",
          messages: newMessages
        })
      })

      const data = await res.json()

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.reply || "うまく返せなかった…もう一回話して？"
        }
      ])
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "通信が少し不安定みたい…もう一回だけ話しかけて？"
        }
      ])
    } finally {
      setSending(false)
      scrollToBottom()
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <button style={styles.backButton}>‹</button>

          <div style={styles.profile}>
            <div style={styles.avatar}>美</div>
            <div>
              <div style={styles.name}>{characterName}</div>
              <div style={styles.status}>オンライン</div>
            </div>
          </div>

          <div style={styles.progressWrap}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${Math.max(10, remaining * 10)}%` }} />
            </div>
            <div style={styles.progressText}>{remaining}/10</div>
          </div>
        </header>

        <section style={styles.chatArea}>
          {messages.map((message, index) => {
            const isUser = message.role === "user"

           
