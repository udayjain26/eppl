'use client'

import { CreateClientForm } from './create-client-form'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function CreateClientSheet() {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={buttonVariants()}>
        <span className="pr-1">
          <Plus strokeWidth="1" size={28}></Plus>{' '}
        </span>
        <div className="hidden sm:block">Create Client</div>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col"
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className="">
          <SheetTitle>Client Creation Form</SheetTitle>
          <SheetDescription>
            Please fill out the form below to add a client to the system.
          </SheetDescription>
        </SheetHeader>
        <CreateClientForm closeDialog={closeDialog}></CreateClientForm>
      </SheetContent>
    </Sheet>
  )
}
