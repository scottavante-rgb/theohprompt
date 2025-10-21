import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/Providers'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'OhPrompt - Master the Art of Prompt Engineering',
  description: 'Unlock the power of AI with expert prompt engineering techniques. Learn, practice, and master the skills to get better results from AI models.',
  keywords: 'prompt engineering, AI, artificial intelligence, machine learning, natural language processing',
  authors: [{ name: 'OhPrompt Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}