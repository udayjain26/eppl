//Importing use client to see what current tab the user is on. The nav-links will style themselves based on that.
'use client'
import { cn } from '@/lib/utils'
import { BookUserIcon, CalculatorIcon, HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: BookUserIcon },

  {
    name: 'Quotations',
    href: '/quotations',
    icon: CalculatorIcon,
  },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon

        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              'flex flex-col items-center justify-center gap-2 rounded-md bg-slate-700 p-2 hover:bg-sky-100 hover:bg-white/20 ',
              {
                'bg-slate-500': pathname === link.href,
              },
            )}
          >
            {' '}
            <LinkIcon strokeWidth="1" size={24} />
            {/* <p className="">{link.name}</p> */}
          </Link>
        )
      })}
    </>
  )
}
