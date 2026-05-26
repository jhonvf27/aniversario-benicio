import type { Metadata, Viewport } from 'next'
import { Bubblegum_Sans, Nunito } from 'next/font/google'
import './globals.css'
import { FESTA_CONFIG } from '@/lib/config'

const bubblegumSans = Bubblegum_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bubblegum',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: `🎂 ${FESTA_CONFIG.nomeBebe} está completando 1 Aninho!`,
  description: `Você está convidado para celebrar o primeiro aniversário de ${FESTA_CONFIG.nomeBebe}! Venha comemorar esse momento mágico! 🎉`,
  openGraph: {
    title: `🎂 Aniversário de 1 Aninho — ${FESTA_CONFIG.nomeBebe}`,
    description: `Você está convidado! Venha celebrar o primeiro aniversário de ${FESTA_CONFIG.nomeBebe}! 🎪🎈`,
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bubblegumSans.variable} ${nunito.variable}`}>
      <body className="font-nunito antialiased">{children}</body>
    </html>
  )
}
