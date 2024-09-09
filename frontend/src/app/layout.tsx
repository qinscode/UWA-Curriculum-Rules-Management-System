import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Course Rules Management System',
  description: 'Demo for course rules management',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={clsx('h-full scroll-smooth bg-white antialiased', inter.variable, lexend.variable)}
    >
      <body className={`${inter.className} h-full scroll-smooth bg-white antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
