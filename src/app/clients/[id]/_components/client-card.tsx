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

import { Client } from '@/schemas/schema-table-types'

import { Pencil, Info, MoreVertical } from 'lucide-react'
import { CreateClientForm } from '../../_components/create-client-form'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export default function ClientCard(props: {
  clientData: Client
  clientCreatedBy: string | null
}) {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            <p>{props.clientData.clientFullName}</p>
          </CardTitle>
          <CardDescription>
            Date Created: {props.clientData.createdAt.toDateString()}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Sheet open={open} onOpenChange={setOpen}>
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
                  Edit Details for {props.clientData.clientFullName}
                </SheetDescription>
              </SheetHeader>
              <CreateClientForm
                closeDialog={closeDialog}
                clientData={props.clientData}
              ></CreateClientForm>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Client Details</div>
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">GSTIN</span>
              <span>{props.clientData.gstin}</span>
            </li>
            <Separator className="" />

            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Address</span>
              <span>{props.clientData.clientAddressLine1}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground"></span>
              <span>{props.clientData.clientAddressLine2}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">City</span>
              <span>{props.clientData.clientAddressCity}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">State</span>
              <span>{props.clientData.clientAddressState}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Pincode</span>
              <span>{props.clientData.clientAddressPincode}</span>
            </li>
          </ul>
          <Separator className="" />
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Industry</span>
              <span>{props.clientData.clientIndustry}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Website</span>
              {props.clientData.clientWebsite && (
                <Link href={props.clientData.clientWebsite}>
                  {props.clientData.clientWebsite}
                </Link>
              )}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
