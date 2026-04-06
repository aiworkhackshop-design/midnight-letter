"use client"

import { useEffect, useRef, useState } from "react"

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
  const remaining = Math.max(0, 10 - Math.floor((messages.length - 1) / 2))

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [messages, sending])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    const nextMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setInput("")
    setSending(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          characterId: "mitsuki",
          messages: nextMessages
        })
      })

      const data = await res.json()

      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: data.reply || "うまく返せなかった…もう一回話して？"
        }
      ])
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: "通信が少し不安定みたい…もう一回だけ話しかけて？"
        }
      ])
    } finally {
      setSending(false)
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
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.max(10, remaining * 10)}%`
                }}
              />
            </div>
            <div style={styles.progressText}>{remaining}/10</div>
          </div>
        </header>

        <section style={styles.chatArea}>
          {messages.map((message, index) => {
            const isUser = message.role === "user"

            return (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...styles.row,
                  justifyContent: isUser ? "flex-end" : "flex-start"
                }}
              >
                {!isUser && <div style={styles.smallAvatar}>美</div>}

                <div
                  style={{
                    ...styles.bubble,
                    ...(isUser ? styles.userBubble : styles.assistantBubble)
                  }}
                >
                  {message.content}
                </div>
              </div>
            )
          })}

          {sending && (
            <div style={styles.row}>
              <div style={styles.smallAvatar}>美</div>
              <div style={{ ...styles.bubble, ...styles.assistantBubble, opacity: 0.75 }}>
                入力中…
              </div>
            </div>
          )}

          <div ref={endRef} />
        </section>

        <footer style={styles.footer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="メッセージを入力..."
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") send()
            }}
          />
          <button onClick={send} disabled={sending || !input.trim()} style={styles.sendButton}>
            送信
          </button>
        </footer>
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "#040611",
    color: "#fff"
  },
  shell: {
    maxWidth: 520,
    margin: "0 auto",
    minHeight: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, #050714 0%, #03040d 100%)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(3,4,13,0.96)",
    position: "sticky",
    top: 0,
    zIndex: 20
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 34,
    lineHeight: 1,
    padding: 0,
    width: 24
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff5ba7 0%, #ff2d7a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(255,45,122,0.25)",
    flexShrink: 0
  },
  smallAvatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff5ba7 0%, #ff2d7a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 4
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.1
  },
  status: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    marginTop: 4
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0
  },
  progressBar: {
    width: 92,
    height: 14,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #c98cff 0%, #8d7dff 100%)"
  },
  progressText: {
    fontSize: 16,
    fontWeight: 700,
    color: "rgba(255,255,255,0.9)"
  },
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "18px 12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 14
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8
  },
  bubble: {
    maxWidth: "78%",
    padding: "14px 16px",
    borderRadius: 22,
    fontSize: 16,
    lineHeight: 1.65,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  assistantBubble: {
    background: "rgba(18, 16, 44, 0.95)",
    border: "1px solid rgba(145,132,255,0.15)",
    color: "#fff"
  },
  userBubble: {
    background: "linear-gradient(135deg, #aa8dff 0%, #8d7dff 100%)",
    color: "#fff"
  },
  footer: {
    display: "flex",
    gap: 10,
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(3,4,13,0.98)",
    position: "sticky",
    bottom: 0,
    paddingBottom: "calc(12px + env(safe-area-inset-bottom))"
  },
  input: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(13,14,28,0.96)",
    color: "#fff",
    padding: "0 16px",
    fontSize: 16,
    outline: "none"
  },
  sendButton: {
    width: 86,
    height: 54,
    borderRadius: 18,
    border: "none",
    background: "#fff",
    color: "#111",
    fontSize: 16,
    fontWeight: 700
  }
}
