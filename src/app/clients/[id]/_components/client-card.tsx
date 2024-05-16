'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Client } from '@/schemas/schema-table-types'

import { Pencil, Info } from 'lucide-react'
import Link from 'next/link'
import { CreateClientForm } from '../../_components/create-client-form'
import { useState } from 'react'

export default function ClientCard(props: {
  clientData: Client
  clientCreatedBy: string | null
}) {
  const [open, setOpen] = useState(false)

  const closeDialog = () => {
    setOpen(false)
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md">
          {props.clientData.clientFullName}
        </CardTitle>
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

        {/* <Link href={`/contacts/${props.clientData.uuid}/edit`}> */}

        {/* </Link> */}
      </CardHeader>
      <CardContent className="gap-y-2 text-sm ">
        <div className=" font-semibold">GSTIN:</div>
        <div className="text-slate-700">
          <p>{props.clientData.gstin}</p>
        </div>

        <Separator></Separator>

        <div className="text-md text-slate-700">
          <div>
            <p>
              <span className="font-semibold">Address: </span>
              {props.clientData.clientAddressLine1}{' '}
              {props.clientData.clientAddressLine2}
            </p>
          </div>

          <p>{props.clientData.clientAddressCity}</p>
          <p>{props.clientData.clientAddressState}</p>
          <p>{props.clientData.clientAddressPincode}</p>
          <p>{props.clientData.clientWebsite}</p>
          <div>
            <p>
              <span className="font-semibold">Industry: </span>
              {props.clientData.clientIndustry}
            </p>
          </div>
        </div>
        <Separator></Separator>

        <div className="mt-2 flex flex-row items-center gap-x-2 text-xs text-slate-700">
          <Info strokeWidth={1} size={16}></Info>
          <p>
            Client created by {props.clientCreatedBy} on{' '}
            {props.clientData.createdAt.toDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
