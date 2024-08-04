import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'
import { FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Course Rules Management System',
  description: 'Demo for course rules management',
}

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
