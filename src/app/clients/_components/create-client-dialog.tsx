'use client'

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { CreateClientForm } from './create-client-form'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export function CreateClientDialog() {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={buttonVariants()}>
        <span className="pr-1">
          <Plus strokeWidth="1" size={28}></Plus>
        </span>
        <div className="hidden sm:block">Create Client</div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        className="flex h-[90%] w-full flex-col"
      >
        <DialogHeader className="max-h-[10%]">
          <DialogTitle>Client Creation Form</DialogTitle>
          <DialogDescription>
            Please fill out the form below to add a client to the system.
          </DialogDescription>
        </DialogHeader>
        <CreateClientForm closeDialog={closeDialog}></CreateClientForm>
      </DialogContent>
    </Dialog>
  )
}
