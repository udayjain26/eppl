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
        'p-2, fixed left-16 top-16 -m-2 flex h-full w-full max-w-full flex-col overflow-y-scroll rounded-3xl bg-white',
        //If user is not logged in, show the home page UI style
        { 'left-0 ml-0 rounded-none': !isLoggedIn }
      )}
    >
      {children}
    </div>
  )
}
