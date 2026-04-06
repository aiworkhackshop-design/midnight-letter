"use client"

import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CharacterCardProps {
  character: Character
  isSelected: boolean
  onSelect: (character: Character) => void
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  return (
    <button
      onClick={() => onSelect(character)}
      className={cn(
        "relative w-full rounded-2xl px-5 py-6 text-left transition-all duration-300",
        "border border-border/60 bg-card/90 backdrop-blur-sm",
        "hover:border-primary/60 hover:bg-card hover:shadow-lg hover:shadow-primary/10",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isSelected && "border-primary bg-card ring-2 ring-primary/40 shadow-lg shadow-primary/15"
      )}
    >
      {/* Avatar */}
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xl font-serif font-semibold text-white shadow-md",
            character.avatarColor
          )}
        >
          {character.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2.5">
            <h3 className="font-serif text-xl font-semibold text-foreground tracking-wide">
              {character.name}
            </h3>
            <span className="text-xs text-muted-foreground/80 tracking-wider uppercase">
              {character.nameEn}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-primary">
            {character.personality}
          </p>
          <p className="mt-2.5 text-sm text-foreground/70 leading-relaxed">
            {character.description}
          </p>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  )
}
