import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FirebaseProvider } from '../contexts/FirebaseContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Classic Cuts Barber Shop',
  description: 'Your premier destination for professional haircuts and grooming services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <main className="min-h-screen bg-white">
            {children}
          </main>
        </FirebaseProvider>
      </body>
    </html>
  )
} 