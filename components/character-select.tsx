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
    <div className="flex min-h-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/90 px-6 py-5 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-wider text-foreground">
            Midnight Letter
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground tracking-wide">
            彼女たちとの、特別な夜を
          </p>
        </div>
      </header>

      {/* Character Grid */}
      <div className="flex-1 px-5 py-8">
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

      {/* Footer */}
      <div className="sticky bottom-0 border-t border-border/40 bg-background/95 px-5 py-5 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <Button
            onClick={() => selectedCharacter && onSelect(selectedCharacter)}
            disabled={!selectedCharacter}
            className={cn(
              "w-full py-6 text-base font-semibold tracking-wide transition-all duration-300",
              selectedCharacter
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                : "bg-secondary text-muted-foreground border border-border/50 cursor-not-allowed"
            )}
          >
            {selectedCharacter
              ? `${selectedCharacter.name}と会話を始める`
              : "パートナーを選んでください"}
          </Button>
          
          <p className="mt-4 text-center text-xs text-muted-foreground tracking-wide">
            無料で10回までメッセージを送信できます
          </p>
        </div>
      </div>
    </div>
  )
}
