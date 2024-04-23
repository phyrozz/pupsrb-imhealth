import { Inter } from 'next/font/google'
import './globals.css'
import WhiteScreenOverlay from './components/white-screen-overlay'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PUPSRC-iMHealth',
  description: 'PUPSRC-iMHealth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WhiteScreenOverlay />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
