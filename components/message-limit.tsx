interface MessageLimitProps {
  remaining: number
  total: number
  onUpgrade: () => void
}

export function MessageLimit({ remaining, total }: MessageLimitProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-3 w-44 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#a78bfa]"
          style={{ width: `${Math.max(0, Math.min(100, (remaining / total) * 100))}%` }}
        />
      </div>
      <span className="text-3xl font-serif text-white">
        {remaining}/{total}
      </span>
    </div>
  )
}
