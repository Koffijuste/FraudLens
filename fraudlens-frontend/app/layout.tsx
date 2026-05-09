import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../lib/theme'

export const metadata: Metadata = {
  title: 'FraudLens — Détection de fraude IA',
  description: 'Système intelligent de détection de fraude en assurance pour la Côte d\'Ivoire',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
