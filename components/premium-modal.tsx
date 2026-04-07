interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function PremiumModal({ isOpen }: PremiumModalProps) {
  if (!isOpen) return null
  return null
}
