import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FC } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Course Rules Management System',
  description: 'Demo for course rules management',
}

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout
