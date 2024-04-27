import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { ArrowRight, LogIn } from 'lucide-react'

import LogoButton from './_components/logo-button'
import SignInButtonWithLogo from './_components/sign-in-button'
import SignInPrompt from './_components/login-prompt'
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
          <header className="sticky flex h-12 w-full items-center gap-4 bg-slate-700 px-4 font-sans font-light">
            <LogoButton />
            <nav className="flex w-full flex-row gap-4 text-xl text-white">
              <SignedOut>
                <SignInPrompt />
              </SignedOut>
              {/* <div>Wrap Everything in Sign In here</div> */}
              <div>{/* Breadcrumbs here*/}</div>
              <div>{/* Search here*/}</div>
              <div>{/* More components here*/}</div>

              <div>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: { avatarBox: 'h-10 w-10 rounded-xl' },
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  <SignInButtonWithLogo />
                </SignedOut>
              </div>
            </nav>
          </header>

          {children}
          {/* Footer goes here */}
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  )
}
