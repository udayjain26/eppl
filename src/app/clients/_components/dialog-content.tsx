'use client'

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { CreateClientForm } from './create-client-form'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function CreateClientDialog() {
  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>
        <span className="pr-1">
          <Plus strokeWidth="1" size={28}></Plus>
        </span>
        Create Client
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        className="flex max-h-[90%] min-h-fit flex-col overflow-y-scroll overscroll-auto"
      >
        <DialogHeader>
          <DialogTitle>Client Creation Form</DialogTitle>
          <DialogDescription>
            Please fill out the form below to add a client to the system.
          </DialogDescription>
        </DialogHeader>
        <CreateClientForm></CreateClientForm>
      </DialogContent>
    </Dialog>
  )
}
