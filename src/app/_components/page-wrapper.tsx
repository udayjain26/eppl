import { cn } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  //Check if user is logged in
  const isLoggedIn = auth().userId !== null

  return (
    <div
      className={cn(
        'fixed left-14 top-14 z-20 flex h-full w-[calc(100%-3rem)] flex-col overflow-y-scroll rounded-3xl bg-white pr-4 pt-4 ',
        //If user is not logged in, show the home page UI style
        { 'left-0 ml-0 rounded-none': !isLoggedIn },
      )}
    >
      {children}
    </div>
  )
}
