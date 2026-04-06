export const metadata = {
  title: "Midnight Letter",
  description: "恋愛没入型AIチャット"
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, background: "#0a0a0f", color: "white" }}>
        {children}
      </body>
    </html>
  )
}
