import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Bible Reading Plan & Study Tracker',
  description: 'Build consistent Bible reading habits with daily plans, progress tracking, and study focus.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
          <Navigation />
          <main className="max-w-5xl mx-auto px-5 py-8 md:py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
