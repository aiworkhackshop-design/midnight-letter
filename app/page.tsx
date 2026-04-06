"use client"

import { useState } from "react"

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "…ねぇ、ちゃんと話してくれる？" }
  ])
  const [input, setInput] = useState("")

  const send = async () => {
    if (!input) return

    const newMessages = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        characterId: "mitsuki",
        messages: newMessages
      })
    })

    const data = await res.json()

    setMessages([...newMessages, { role: "assistant", content: data.reply }])
  }

  return (
    <div style={{ padding: 20 }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <b>{m.role === "user" ? "あなた" : "美月"}:</b> {m.content}
        </div>
      ))}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%" }}
      />
      <button onClick={send}>送信</button>
    </div>
  )
}
