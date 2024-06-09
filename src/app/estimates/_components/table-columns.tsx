'use client'
import {
  formatDistance,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns'

// import { Estimate } from '@/schemas/schema-table-types'
import { ColumnDef } from '@tanstack/react-table'

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
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { estimateStageColors } from './constants'

export const estimatesColumns: ColumnDef<EstimateTableRow>[] = [
  {
    accessorKey: 'estimateNumber',
    header: ({ column }) => columnHeader(column, 'Est ID'),
    meta: { columnName: 'Estimate No.' },
    cell: ({ row }) => {
      return (
        <Link
          className={buttonVariants({ variant: 'ghost' })}
          href={`/estimates/${row.original.uuid}`}
        >
          <p className=" max-w-48 overflow-clip hover:underline hover:underline-offset-2">
            {row.original.estimateNumber.toString().padStart(6, '0')}
          </p>
        </Link>
      )
    },
  },

  {
    accessorKey: 'estimateStage',
    header: ({ column }) => columnHeader(column, 'Estimate Stage'),
    meta: {
      columnName: 'Estimate Stage',
    },
    filterFn: (row, columnId, filterValue) => {
      if (typeof filterValue === 'string') {
        return row.original.estimateStage.includes(filterValue)
      }
      return (
        filterValue.length === 0 ||
        filterValue.includes(row.original.estimateStage)
      )
    },
    cell: ({ row }) => {
      return (
        <div className={estimateStageColors(row.original.estimateStage)}>
          {row.original.estimateStage}
        </div>
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
          className={buttonVariants({ variant: 'ghost' })}
          href={`/estimates/${row.original.uuid}`}
        >
          <p className=" max-w-48 overflow-clip hover:underline hover:underline-offset-2">
            {row.original.estimateTitle}
          </p>
        </Link>
      )
    },
  },
  {
    accessorKey: 'client.clientNickName',
    header: ({ column }) => columnHeader(column, 'Client'),
    meta: { columnName: 'Client' },
    cell: ({ row }) => {
      const nickName: string = row.original.client.clientNickName

      return (
        <Link
          className={buttonVariants({ variant: 'ghost' })}
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
    accessorKey: 'contact.contactFullName',
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
            <Button variant="ghost">
              <p className=" hover:underline hover:underline-offset-2">
                {fullName}
              </p>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col gap-1 border border-slate-300 p-4">
            <div className="font-semibold">Contact Details</div>
            <ul className="grid gap-2">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Designation</span>
                <span>{row.original.contact.contactDesignation}</span>
              </li>

              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Mobile</span>
                <Link href={`tel:${row.original.contact.contactMobile}`}>
                  <p className="text-blue-900 underline underline-offset-1">
                    {row.original.contact.contactMobile}
                  </p>
                </Link>{' '}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Email</span>
                <Link href={`mailto:${row.original.contact.contactEmail}`}>
                  <p className="text-blue-900 underline underline-offset-1">
                    {row.original.contact.contactEmail}
                  </p>
                </Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Active</span>
                <span>
                  {row.original.contact.isActive ? 'Active' : 'Inactive'}
                </span>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      )
    },
  },
  {
    accessorKey: 'productType.productsTypeName',
    header: ({ column }) => columnHeader(column, 'Product Type'),
    meta: { columnName: 'Product Type' },
    cell: ({ row }) => {
      return (
        <div>
          <p className="">{row.original.productType.productsTypeName}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'product.productName',
    header: ({ column }) => columnHeader(column, 'Product'),
    meta: { columnName: 'Product' },
    cell: ({ row }) => {
      return (
        <div>
          <p className="">{row.original.product.productName}</p>
        </div>
      )
    },
  },

  {
    accessorKey: 'estimateStatus',
    header: ({ column }) => columnHeader(column, 'Status'),
    meta: { columnName: 'Status' },
    cell: ({ row }) => {
      return <div className="">{row.original.estimateStatus}</div>
    },
  },
  {
    accessorKey: 'salesRep.salesRepName',
    header: ({ column }) => columnHeader(column, 'Sales Rep'),
    meta: { columnName: 'Sales Rep' },
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
