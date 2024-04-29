import { SignedIn } from '@clerk/nextjs'
import Link from 'next/link'
import NavLinks from './nav-links'

export default function SideNav() {
  return (
    <SignedIn>
      <div className="fixed flex h-full w-16 flex-col justify-start gap-y-8 bg-slate-700 pl-2 pt-20 text-white">
        <NavLinks />
      </div>
    </SignedIn>
  )
}
