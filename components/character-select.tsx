"use client"

import { useState } from "react"
import type { Character } from "@/lib/types"
import { characters } from "@/lib/characters"
import { CharacterCard } from "./character-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CharacterSelectProps {
  onSelect: (character: Character) => void
}

export function CharacterSelect({ onSelect }: CharacterSelectProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/90 px-6 py-5 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-wider text-foreground">
            Midnight Letter
          </h1>
          <p className="mt-1.5 text-sm tracking-wide text-muted-foreground">
            彼女たちとの、特別な夜を
          </p>
        </div>
      </header>

      <div className="flex-1 px-5 py-8 pb-40">
        <div className="mx-auto max-w-md">
          <h2 className="mb-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Choose Your Partner
          </h2>

          <div className="space-y-5">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isSelected={selectedCharacter?.id === character.id}
                onSelect={setSelectedCharacter}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/40 bg-background/95 px-5 py-5 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <Button
            type="button"
            onClick={() => selectedCharacter && onSelect(selectedCharacter)}
            disabled={!selectedCharacter}
            className={cn(
              "w-full rounded-2xl py-6 text-base font-semibold tracking-wide transition-all duration-300",
              selectedCharacter
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
                : "cursor-not-allowed border border-border/50 bg-secondary text-muted-foreground"
            )}
          >
            {selectedCharacter
              ? `${selectedCharacter.name}と会話を始める`
              : "パートナーを選んでください"}
          </Button>

          <p className="mt-4 text-center text-xs tracking-wide text-muted-foreground">
            無料で10回までメッセージを送信できます
          </p>
        </div>
      </div>
    </div>
  )
}
