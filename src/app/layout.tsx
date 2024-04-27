import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider } from '@clerk/nextjs'
import Image from 'next/image'
import eppl from '../../public/eppl.svg'
import Link from 'next/link'
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
          <header className="sticky flex h-12 w-full items-center gap-4 bg-slate-600 px-4">
            <div className="relative flex h-10 w-10 flex-col items-center justify-center overflow-clip rounded-xl hover:bg-slate-400">
              <Link href={'/'}>
                <Image
                  className=""
                  src={eppl}
                  alt={''}
                  style={{ objectFit: 'contain' }}
                  fill
                ></Image>
              </Link>
            </div>
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
