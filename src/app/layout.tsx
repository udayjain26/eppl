import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider } from '@clerk/nextjs'

import LogoButton from './_components/logo-button'
import TopNav from './_components/top-nav'
import SideNav from './_components/side-nav'
import { fontSerif } from './fonts/noto_serif'
import { Toaster } from '@/components/ui/sonner'

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
        <body
          className={`${fontSerif.className} flex min-h-screen w-screen flex-col antialiased`}
        >
          <header className="fixed z-10 flex h-16 w-full items-center gap-4 bg-slate-700 px-2 font-light">
            <LogoButton />

            <TopNav></TopNav>
          </header>
          <SideNav></SideNav>

          {children}
          {/* Footer goes here */}
          <Toaster />

          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
