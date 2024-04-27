import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider } from '@clerk/nextjs'

import LogoButton from './_components/logo-button'
export const metadata: Metadata = {
  title: 'EPPL',
  description: 'EPPL Internal Portal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const listItems = [
    'test',
    'gu',
    'add',
    'more here',
    'What now',
    'I am tired',
    'keep adding',
    'Wiha',
    'I am tired',
    'keep adding',
    'Wiha',
    'I am tired',
    'keep adding',
    'Wiha',
  ]

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${fontSans.className} flex min-h-screen flex-col  antialiased`}
        >
          <header className="sticky flex h-12 w-full items-center gap-4 bg-slate-700 px-4">
            <LogoButton />
            <nav className="flex-row gap-4 ">
              {/* {listItems.map((item, index) => (
                <a key={index} href="#" className="text-white">
                  {item}
                </a>
              ))} */}
            </nav>
          </header>

          {children}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
