import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FraudLens',
  description: 'Système intelligent de détection de fraude',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}