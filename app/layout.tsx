import "./globals.css"
import type { ReactNode } from "react"

export const metadata = {
  title: "Midnight Letter",
  description: "恋愛没入型AIチャット",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
