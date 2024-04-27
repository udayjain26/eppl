import { SignedIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SideNav() {
  return (
    <SignedIn>
      <div className="fixed -z-10 flex h-full w-16 flex-col bg-slate-700 pt-16 text-white">
        {/* <NavLinks /> */}
      </div>
    </SignedIn>
  )
}
