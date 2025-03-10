import './globals.css'
import './themes.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Favicon from '../../public/favicon.ico'
import RootLayoutComp from '@/layouts/RootLayout'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: 'The software for task management',
  icons: [{ rel: 'icon', url: Favicon.src }]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
      </head>
      <body className={inter.className}>
        <RootLayoutComp>{children}</RootLayoutComp>
      </body>
    </html>
  )
}
