import './globals.css'

export const metadata = {
  title: 'Animated Website',
  description: 'Next.js + GSAP + R3F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
