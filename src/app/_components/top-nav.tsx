import { SignedIn, SignedOut } from '@clerk/nextjs'
import UserButtonPadded from './user-button'
import SignInButtonWithLogo from './sign-in-button'
import SignInPrompt from './login-prompt'

export default function TopNav() {
  return (
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
  )
}
