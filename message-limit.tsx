"use client"

import { cn } from "@/lib/utils"

interface MessageLimitProps {
  remaining: number
  total: number
  onUpgrade: () => void
}

export function MessageLimit({ remaining, total, onUpgrade }: MessageLimitProps) {
  const percentage = (remaining / total) * 100
  const isLow = remaining <= 3

  return (
    <div className="flex items-center gap-3 rounded-full border border-border/50 bg-card/80 px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="relative h-2 w-16 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "absolute left-0 top-0 h-full rounded-full transition-all duration-300",
              isLow ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={cn(
          "text-xs font-medium",
          isLow ? "text-destructive" : "text-muted-foreground"
        )}>
          {remaining}/{total}
        </span>
      </div>
      
      {isLow && (
        <button
          onClick={onUpgrade}
          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Upgrade
        </button>
      )}
    </div>
  )
}
