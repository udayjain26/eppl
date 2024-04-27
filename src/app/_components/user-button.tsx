import { UserButton } from '@clerk/nextjs'

export default function UserButtonPadded() {
  return (
    <>
      <div className="flex flex-grow"></div>
      <UserButton
        appearance={{
          elements: { avatarBox: 'h-10 w-10 rounded-xl' },
        }}
      />
    </>
  )
}
