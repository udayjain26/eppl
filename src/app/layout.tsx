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
          className={`${fontSans.className} flex min-h-screen flex-col bg-green-500 antialiased`}
        >
          <header className="flex h-12 items-center gap-4 border-b-4 border-dotted border-black bg-red-500 px-4 ">
            <div className="flex h-16 w-16 flex-col items-end justify-end  bg-yellow-500">
              <h1 className="text-2xl font-bold">Logo</h1>
            </div>
            <nav className="flex gap-4">
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
