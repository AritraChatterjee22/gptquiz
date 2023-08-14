import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GptQuiz',
  description: 'NEXTJS 13 website for quiz using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={
          cn(inter.className,
          'antialiased min-h-screen pt-16'
          )
        }>
        <Providers>
        <Navbar/>
        {children}
        </Providers>
        </body>
    </html>
  )
}
