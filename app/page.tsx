"use client"

import { useState } from "react"
import type { Character } from "../lib/types"
import { CharacterSelect } from "../components/character-select"
import { ChatScreen } from "../components/チャット画面"

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  if (selectedCharacter) {
    return (
      <main className="h-dvh">
        <ChatScreen
          character={selectedCharacter}
          onBack={() => setSelectedCharacter(null)}
        />
      </main>
    )
  }

  return (
    <main className="h-dvh">
      <CharacterSelect onSelect={setSelectedCharacter} />
    </main>
  )
}
