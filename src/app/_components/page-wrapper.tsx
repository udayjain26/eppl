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
        'fixed left-14 top-14 z-20 flex h-[calc(100%-2rem)] w-[calc(100%-2rem)] flex-col rounded-3xl bg-white p-2 ',
        //If user is not logged in, show the home page UI style
        { 'left-0 ml-0 w-full rounded-none': !isLoggedIn },
      )}
    >
      {/* <div className="h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"> */}
      {children}
      {/* </div> */}
    </div>
  )
}
