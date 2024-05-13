import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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

        <Separator></Separator>

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
