//Importing use client to see what current tab the user is on. The nav-links will style themselves based on that.
'use client'
import { cn } from '@/lib/utils'
import {
  BookUserIcon,
  CalculatorIcon,
  FileCog,
  HandCoins,
  HomeIcon,
  IndianRupee,
  Settings,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: BookUserIcon },
  {
    name: 'Estimates',
    href: '/estimates',
    icon: CalculatorIcon,
  },
  // {
  //   name: 'Production',
  //   href: '/production',
  //   icon: FileCog,
  // },
  // {
  //   name: 'Logistics',
  //   href: '/logistics',
  //   icon: Truck,
  // },
  // {
  //   name: 'Finance',
  //   href: '/finance',
  //   icon: HandCoins,
  // },
  // {
  //   name: 'Invoices',
  //   href: '/invoices',
  //   icon: IndianRupee,
  // },
  // {
  //   name: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // },
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
            //Classnames are used to style the links based on the current tab the user is on.
            className={cn(
              'flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-slate-700 hover:bg-sky-100 hover:bg-white/20',
              {
                'bg-slate-500': pathname === link.href,
              },
            )}
          >
            {' '}
            <LinkIcon strokeWidth="1" size={28} />
            {/* <p className="">{link.name}</p> */}
          </Link>
        )
      })}
    </>
  )
}
