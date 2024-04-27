import { LogIn } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'

export default function SignInButtonWithLogo() {
  return (
    <div className="flex h-10 flex-row items-center rounded-xl p-1 hover:bg-white/20">
      <SignInButton mode="modal"></SignInButton>
      <LogIn strokeWidth="1" size={24} />
    </div>
  )
}
