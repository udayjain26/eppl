'use client'

import { CreateClientForm } from './create-client-form'
import { buttonVariants } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { getClientById } from '@/server/queries'
import { Client } from '@/server/db/schema-table-types'

export function CreateContactSheet({ props }: { props: { row: Client } }) {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: 'ghost' })}>
        <span className="pr-2">
          <UserPlus strokeWidth="1" size={28}></UserPlus>{' '}
        </span>
        <div className="block">Create Contact</div>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col"
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className="">
          <SheetTitle>Create New Contact</SheetTitle>
          <SheetDescription>
            Please fill out the form below to add a contact person to{' '}
            {props.row.clientNickName}
          </SheetDescription>
        </SheetHeader>
        {/* <CreateClientForm closeDialog={closeDialog}></CreateClientForm> */}
      </SheetContent>
    </Sheet>
  )
}
