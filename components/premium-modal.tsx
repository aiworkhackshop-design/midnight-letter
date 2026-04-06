"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  onSubscribe: () => void
}

export function PremiumModal({ isOpen, onClose, onSubscribe }: PremiumModalProps) {
  const features = [
    "メッセージ無制限",
    "すべてのキャラクターと会話",
    "特別なシナリオ解放",
    "優先サポート",
    "広告なし",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <DialogTitle className="font-serif text-2xl font-semibold">
            Premium
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            より深い関係を、制限なく
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3 text-primary"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">月額プラン</p>
            <p className="font-serif text-3xl font-semibold text-foreground">
              ¥980
              <span className="text-sm font-normal text-muted-foreground">/月</span>
            </p>
          </div>
          
          <Button
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-primary to-accent py-6 text-base font-medium text-white hover:opacity-90 transition-opacity"
          >
            今すぐ始める
          </Button>
          
          <button
            onClick={onClose}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            後で
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
