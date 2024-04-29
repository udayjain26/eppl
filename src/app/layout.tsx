import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'

import LogoButton from './_components/logo-button'
import SignInButtonWithLogo from './_components/sign-in-button'
import SignInPrompt from './_components/login-prompt'
import UserButtonPadded from './_components/user-button'
import TopNav from './_components/top-nav'
import SideNav from './_components/side-nav'

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
          className={`${fontSans.className} flex min-h-screen w-screen flex-col antialiased`}
        >
          <header className="fixed z-10 flex h-16 w-full items-center gap-4 bg-slate-700 px-4 font-sans font-light">
            <LogoButton />

            <TopNav></TopNav>
          </header>
          <SideNav></SideNav>

          {children}
          {/* Footer goes here */}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
