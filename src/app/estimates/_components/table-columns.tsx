'use client'
import {
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns'

// import { Estimate } from '@/schemas/schema-table-types'
import { ColumnDef } from '@tanstack/react-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.
import columnHeader from '@/app/_components/column-headers'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { FileWarning } from 'lucide-react'
import { EstimateTableRow } from '@/schemas/schema-table-types'

export const estimatesColumns: ColumnDef<EstimateTableRow>[] = [
  {
    accessorKey: 'estimateNumber',
    header: ({ column }) => columnHeader(column, 'Estimate No.'),
    meta: { columnName: 'Estimate No.' },
  },
  {
    accessorKey: 'currentRevision',
    header: ({ column }) => columnHeader(column, 'Revision No.'),
    meta: { columnName: 'Revision No.' },
  },
  {
    accessorKey: 'revisionStage',
    header: ({ column }) => columnHeader(column, 'Revision Stage'),
    meta: { columnName: 'Revision Stage' },
    cell: ({ row }) => {
      return (
        // <div className="w-fit rounded-lg border border-slate-300 p-2 shadow-md"></div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'ghost'}>
              <FileWarning strokeWidth={1} size={32} color="red"></FileWarning>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            No revisions found yet. Please create the first revision on the
            estimates page.
          </PopoverContent>
        </Popover>
      )
    },
  },

  {
    accessorKey: 'estimateTitle',
    header: ({ column }) => columnHeader(column, 'Estimate Name'),
    meta: { columnName: 'Estimate Name' },
    cell: ({ row }) => {
      return (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href={`/estimates/${row.original.uuid}`}
        >
          <p className=" hover:underline hover:underline-offset-2">
            {row.original.estimateTitle}
          </p>
        </Link>
      )
    },
  },
  {
    accessorKey: 'estimateProductUuid',
    header: ({ column }) => columnHeader(column, 'Product'),
    meta: { columnName: 'Product' },
    cell: ({ row }) => {
      console.log(row.original)
      return (
        <div>
          <p className="">{row.original.product.productName}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'clientUuid',
    header: ({ column }) => columnHeader(column, 'Client'),
    meta: { columnName: 'Client' },
    cell: ({ row }) => {
      const nickName: string = row.original.client.clientNickName

      return (
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href={`/clients/${row.original.clientUuid}`}
        >
          <p className=" hover:underline hover:underline-offset-2">
            {' '}
            {nickName}
          </p>
        </Link>
      )
    },
  },
  {
    accessorKey: 'contactUuid',
    header: ({ column }) => columnHeader(column, 'Contact'),
    meta: { columnName: 'Contact' },
    cell: ({ row }) => {
      const fullName: string =
        row.original.contact.contactFirstName +
        ' ' +
        row.original.contact.contactLastName

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <p className=" hover:underline hover:underline-offset-2">
                {fullName}
              </p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="gap-1border flex w-fit flex-col border border-slate-300">
            <div className="mb-2   text-xl">{fullName}</div>
            <p>Designation: {row.original.contact.contactDesignation}</p>
            <div className="flex flex-row items-center ">
              <Link href={`mailto:${row.original.contact.contactEmail}`}>
                <p className="text-blue-900 underline underline-offset-1">
                  {row.original.contact.contactEmail}
                </p>
              </Link>
            </div>
            <div className="flex flex-row items-center ">
              <Link href={`tel:${row.original.contact.contactMobile}`}>
                <p className="text-blue-900 underline underline-offset-1">
                  {row.original.contact.contactMobile}
                </p>
              </Link>
            </div>
            <p>
              Status: {row.original.contact.isActive ? 'Active' : 'Inactive'}
            </p>
          </PopoverContent>
        </Popover>
      )
    },
  },

  {
    accessorKey: 'estimateStatus',
    header: ({ column }) => columnHeader(column, 'Status'),
    meta: { columnName: 'Status' },
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            'w-fit rounded-lg border border-slate-300 p-2 shadow-md',
            {
              'bg-red-500': row.original.estimateStatus === 'Not Started',
              'bg-yellow-500': row.original.estimateStatus === 'In Progress',
              'bg-green-500': row.original.estimateStatus === 'Completed',
            },
          )}
        >
          {row.original.estimateStatus}
        </div>
      )
    },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => columnHeader(column, 'Created'),
    meta: { columnName: 'Created' },
    cell: ({ row }) => {
      const dateDistance = formatDistanceToNowStrict(
        new Date(row.original.createdAt),
        { addSuffix: true },
      )
      return <div className="">{dateDistance}</div>
    },
  },
]
