import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import Link from 'next/link'

import { MoreVertical } from 'lucide-react'

import { CardDescription, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'

export function EstimateDetailsCard(props: { estimateData: EstimateTableRow }) {
  const dateDistance = formatDistanceToNowStrict(
    new Date(props.estimateData.createdAt),
    { addSuffix: true },
  )
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            Estimate:{' '}
            {props.estimateData.estimateNumber.toString().padStart(6, '0')}
          </CardTitle>
          <CardDescription>
            <p>{props.estimateData.estimateDescription}</p>
            Date Created: {props.estimateData.createdAt.toDateString()}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreVertical strokeWidth={1} size={24} />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Clone Estimate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Estimate Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Product Type</span>
              <span>{props.estimateData.productType.productsTypeName}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Product</span>
              <span>{props.estimateData.product.productName}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Estimate Status</span>
              <span>
                {' '}
                <div
                  className={cn(
                    'w-fit rounded-lg border border-slate-300 p-1 shadow-md',
                    {
                      'bg-red-500':
                        props.estimateData.estimateStatus === 'Not Started',
                      'bg-yellow-500':
                        props.estimateData.estimateStatus === 'In Progress',
                      'bg-green-500':
                        props.estimateData.estimateStatus === 'Completed',
                    },
                  )}
                >
                  {props.estimateData.estimateStatus}
                </div>
              </span>
            </li>
          </ul>
          <Separator className="" />
          <ul className="grid gap-2">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Client</span>
              <span>
                <Link
                  className={buttonVariants({ variant: 'ghost' })}
                  href={`/clients/${props.estimateData.clientUuid}`}
                >
                  <p className=" hover:underline hover:underline-offset-2">
                    {props.estimateData.client.clientNickName}
                  </p>
                </Link>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Contact</span>
              <span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost">
                      <p className=" hover:underline hover:underline-offset-2">
                        {props.estimateData.contact.contactFullName}
                      </p>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-1 border border-slate-300 p-4">
                    <div className="font-semibold">Contact Details</div>
                    <ul className="grid gap-2">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Designation
                        </span>
                        <span>
                          {props.estimateData.contact.contactDesignation}
                        </span>
                      </li>

                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Mobile</span>
                        <Link
                          href={`tel:${props.estimateData.contact.contactMobile}`}
                        >
                          <p className="text-blue-900 underline underline-offset-1">
                            {props.estimateData.contact.contactMobile}
                          </p>
                        </Link>{' '}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <Link
                          href={`mailto:${props.estimateData.contact.contactEmail}`}
                        >
                          <p className="text-blue-900 underline underline-offset-1">
                            {props.estimateData.contact.contactEmail}
                          </p>
                        </Link>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Active</span>
                        <span>
                          {props.estimateData.contact.isActive
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </span>
            </li>
            <Separator className="my-1" />

            <li className="flex items-center justify-between ">
              <span className="text-muted-foreground">
                Current Revision Number
              </span>
              <span>{props.estimateData.currentRevision}</span>
            </li>
            <li className="flex items-center justify-between ">
              <span className="text-muted-foreground">
                Current Revision Stage
              </span>
              <span>{props.estimateData.estimateRevisionStage}</span>
            </li>
            <li className="flex items-center justify-between ">
              <span className="text-muted-foreground">Estimate Created</span>
              <div className="">{dateDistance}</div>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
