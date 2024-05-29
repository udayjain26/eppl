'use client'

import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import CreatePaperForm from './create-paper-form'

export default function CreatePaperSheet() {
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
        <div className="">Add Paper</div>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col"
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className="">
          <SheetTitle>Create New Paper</SheetTitle>
          <SheetDescription>
            Please fill out the form below to add a new paper type to the
            system.
          </SheetDescription>
        </SheetHeader>
        <CreatePaperForm closeDialog={closeDialog}></CreatePaperForm>
      </SheetContent>
    </Sheet>
  )
}
