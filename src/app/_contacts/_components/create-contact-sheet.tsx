'use client'

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
import { Client } from '@/schemas/schema-table-types'
import Link from 'next/link'
import { CreateContactForm } from './create-contact-form'

export function CreateContactSheet({ props }: { props: { row: Client } }) {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants({ variant: 'default' })}>
        <span className="pr-2">
          <UserPlus strokeWidth="1" size={28}></UserPlus>{' '}
        </span>
        <div className="block">Add Contact</div>
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
            <Link href={`/clients/${props.row.uuid}`}>
              <span className="font-bold underline ">
                {props.row.clientNickName}
              </span>
            </Link>
          </SheetDescription>
        </SheetHeader>
        <CreateContactForm
          closeDialog={closeDialog}
          //pass client uuid to the form
          clientUuid={props.row.uuid}
        ></CreateContactForm>
      </SheetContent>
    </Sheet>
  )
}
