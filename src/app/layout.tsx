import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'EPPL',
  description: 'EPPL Internal Portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fontSans.className} antialiased`}>
          {children}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
