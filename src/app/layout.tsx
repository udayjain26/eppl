import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { fontSans } from './fonts/noto_sans'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs'

import LogoButton from './_components/logo-button'
import SignInButtonWithLogo from './_components/sign-in-button'
import SignInPrompt from './_components/login-prompt'
import UserButtonPadded from './_components/user-button'
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
          <header className="sticky flex h-16 w-full items-center gap-4 bg-slate-700 px-4 font-sans font-light">
            <LogoButton />
            <nav className="flex w-full flex-row gap-1 text-sm text-white sm:gap-4 sm:text-xl">
              {/* <SignedOut></SignedOut> */}

              {/* <div>Wrap Everything in Sign In here</div> */}
              <div>{/* Breadcrumbs here*/}</div>
              <div>{/* Search here*/}</div>
              <div>{/* More components here*/}</div>

              <SignedIn>
                <UserButtonPadded />
              </SignedIn>
              <SignedOut>
                <SignInPrompt />

                <SignInButtonWithLogo />
              </SignedOut>
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
