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
      type="button"
      onClick={() => onSelect(character)}
      className={cn(
        "relative w-full rounded-[28px] px-6 py-7 text-left transition-all duration-300",
        "border border-white/10 bg-[#090b1a]/95",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        "hover:border-white/15 hover:bg-[#0b0f22]",
        "focus:outline-none",
        isSelected && "border-[#9b8cff] bg-[#0b0f22] ring-2 ring-[#9b8cff]/50"
      )}
    >
      <div className="flex items-start gap-5">
        <div
          className={cn(
            "flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-4xl font-serif text-white shadow-lg",
            character.avatarColor
          )}
        >
          {character.name[0]}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-baseline gap-3">
            <h3 className="font-serif text-[34px] leading-none text-white">
              {character.name}
            </h3>
            <span className="text-[18px] uppercase tracking-[0.18em] text-white/35">
              {character.nameEn}
            </span>
          </div>

          <p className="mt-3 text-[18px] font-medium text-[#9b8cff]">
            {character.personality}
          </p>

          <p className="mt-5 text-[18px] leading-[1.9] text-white/72">
            {character.description}
          </p>
        </div>
      </div>
    </button>
  )
}
