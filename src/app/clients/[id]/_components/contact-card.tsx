'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Contact } from '@/schemas/schema-table-types'
import { clerkClient } from '@clerk/nextjs/server'
import { Info, Pencil } from 'lucide-react'
import Link from 'next/link'
import { CreateContactForm } from '@/app/_contacts/_components/create-contact-form'
import { useState } from 'react'

export function ContactCard(props: { contact: Contact }) {
  const [openContact, setOpenContact] = useState(false)

  function closeContactDialog() {
    setOpenContact(false)
  }

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <p>
              {props.contact.contactFirstName +
                ' ' +
                props.contact.contactLastName}
            </p>
          </CardTitle>
          <CardDescription>
            Date Created: {props.contact.createdAt.toDateString()}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Sheet open={openContact} onOpenChange={setOpenContact}>
            <SheetTrigger className={buttonVariants({ variant: 'outline' })}>
              <span className="">
                <Pencil strokeWidth={1} size={16}></Pencil>
              </span>
            </SheetTrigger>
            <SheetContent
              className="flex h-full flex-col"
              onInteractOutside={(event) => {
                event.preventDefault()
              }}
            >
              <SheetHeader>
                <SheetTitle>Edit Client</SheetTitle>
                <SheetDescription>
                  Edit Details for {props.contact.contactFirstName}{' '}
                  {props.contact.contactLastName}
                </SheetDescription>
              </SheetHeader>
              <CreateContactForm
                closeDialog={closeContactDialog}
                clientUuid={props.contact.clientUuid}
                contactData={props.contact}
              ></CreateContactForm>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Contact Details</div>
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Designation</span>
              <span>{props.contact.contactDesignation}</span>
            </li>

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Mobile</span>
              <Link href={`tel:${props.contact.contactMobile}`}>
                <p className="text-blue-900 underline underline-offset-1">
                  {props.contact.contactMobile}
                </p>
              </Link>{' '}
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Email</span>
              <Link href={`mailto:${props.contact.contactEmail}`}>
                <p className="text-blue-900 underline underline-offset-1">
                  {props.contact.contactEmail}
                </p>
              </Link>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Active</span>
              <span>{props.contact.isActive ? 'Active' : 'Inactive'}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
