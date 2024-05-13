import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Client } from '@/schemas/schema-table-types'

import { Pencil, Info } from 'lucide-react'
import Link from 'next/link'

export default function ClientCard(props: {
  clientData: Client
  clientCreatedBy: string | null
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-md">
          {props.clientData.clientFullName}
        </CardTitle>
        <Button variant={'outline'} className="">
          <Link href={`/contacts/${props.clientData.uuid}/edit`}>
            <span className="flex flex-row items-center gap-1">
              <Pencil strokeWidth={1} size={16}></Pencil>
            </span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="gap-y-2 text-sm ">
        <div className=" font-semibold">GSTIN:</div>
        <div className="text-slate-700">
          <p>{props.clientData.gstin}</p>
        </div>

        <div className="font-semibold">Address:</div>
        <div className="text-md text-slate-700">
          <p>
            {props.clientData.clientAddressLine1},{' '}
            {props.clientData.clientAddressLine2}
          </p>
          <p>{props.clientData.clientAddressCity}</p>
          <p>{props.clientData.clientAddressState}</p>
          <p>{props.clientData.clientAddressPincode}</p>
          <p>{props.clientData.clientWebsite}</p>
          <p>{props.clientData.clientIndustry}</p>
        </div>
        <div className="flex flex-row justify-end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="rounded-lg hover:bg-slate-200" asChild>
                <Button variant={'ghost'}>
                  {' '}
                  <Info strokeWidth={1} size={24}></Info>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {' '}
                <p>
                  Created by {props.clientCreatedBy} on{' '}
                  {props.clientData.createdAt.toDateString()}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
