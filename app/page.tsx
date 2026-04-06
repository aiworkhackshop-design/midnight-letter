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
              <div style={{ ...styles.bubble, ...styles.assistantBubble, opacity: 0.8 }}>
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
    minHeight: "100vh",
    background: "#03040d",
    color: "#fff",
    display: "flex",
    justifyContent: "center"
  },
  shell: {
    width: "100%",
    maxWidth: 520,
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #050714 0%, #040511 45%, #02030a 100%)",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky",
    top: 0,
    background: "rgba(3,4,13,0.92)",
    backdropFilter: "blur(10px)",
    zIndex: 10
  },
  backButton: {
    border: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 34,
    lineHeight: 1,
    padding: 0,
    width: 24,
    cursor: "pointer"
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff5ba7 0%, #ff2d7a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700,
    boxShadow: "0 8px 24px rgba(255,45,122,0.28)"
  },
  smallAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    background: "linear-gradient(135deg, #ff5ba7 0%, #ff2d7a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 4
  },
  name: {
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: "0.04em"
  },
  status: {
    fontSize: 15,
    color: "rgba(255,255,255,0.78)",
    marginTop: 2
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  progressBar: {
    width: 110,
    height: 16,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #d08bff 0%, #8f7dff 100%)"
  },
  progressText: {
    fontSize: 22,
    fontWeight: 600,
    color: "rgba(255,255,255,0.86)"
  },
  chatArea: {
    flex: 1,
    padding: "20px 14px 120px",
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10
  },
  bubble: {
    maxWidth: "78%",
    padding: "16px 18px",
    borderRadius: 24,
    fontSize: 17,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  assistantBubble: {
    background: "rgba(20, 16, 48, 0.95)",
    border: "1px solid rgba(145,132,255,0.14)",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.16)"
  },
  userBubble: {
    background: "linear-gradient(135deg, #a98dff 0%, #8d7dff 100%)",
    color: "#fff",
    boxShadow: "0 10px 28px rgba(141,125,255,0.28)"
  },
  footer: {
    position: "sticky",
    bottom: 0,
    display: "flex",
    gap: 10,
    padding: "14px",
    background: "rgba(3,4,13,0.96)",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)"
  },
  input: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(13,14,28,0.95)",
    color: "#fff",
    padding: "0 16px",
    fontSize: 16,
    outline: "none"
  },
  sendButton: {
    minWidth: 74,
    height: 54,
    borderRadius: 18,
    border: "none",
    background: "#ffffff",
    color: "#111",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    opacity: 1
  }
}
