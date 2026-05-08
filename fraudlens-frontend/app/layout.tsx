import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FraudLens — Détection de fraude',
  description: 'Système intelligent de détection de fraude en assurance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
