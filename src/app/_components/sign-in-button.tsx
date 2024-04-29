import { LogIn } from 'lucide-react'
import { ClerkLoaded, ClerkLoading, SignInButton } from '@clerk/nextjs'

export default function SignInButtonWithLogo() {
  return (
    <div className="flex h-12 w-24 flex-row items-center  rounded-xl p-1 hover:bg-white/20">
      <ClerkLoading>
        <div className="h-12 w-24 animate-pulse rounded-xl bg-white/20 "></div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignInButton
          mode="modal"
          forceRedirectUrl={'/dashboard'}
          fallbackRedirectUrl={'/'}
        ></SignInButton>
        <LogIn strokeWidth="1" size={24} />
      </ClerkLoaded>
    </div>
  )
}
