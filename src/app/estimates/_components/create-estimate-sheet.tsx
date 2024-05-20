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
import { CreateEstimateForm } from './create-estimate-form'

export function CreateEstimateSheet() {
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
        <div className="">Create Estimate</div>
      </SheetTrigger>
      <SheetContent
        className="flex h-full flex-col"
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        <SheetHeader className="">
          <SheetTitle>Create New Estimate</SheetTitle>
          <SheetDescription>
            Please fill out the form below to add a new estimate to the system.
          </SheetDescription>
        </SheetHeader>
        <CreateEstimateForm closeDialog={closeDialog}></CreateEstimateForm>
      </SheetContent>
    </Sheet>
  )
}
