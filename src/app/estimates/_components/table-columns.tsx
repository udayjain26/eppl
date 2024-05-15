'use client'
import { formatDistance } from 'date-fns'

import { Estimate } from '@/schemas/schema-table-types'
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

export const estimatesColumns: ColumnDef<Estimate>[] = [
  {
    accessorKey: 'estimateNumber',
    header: ({ column }) => columnHeader(column, 'Estimate #'),
    meta: { columnName: 'Estimate Number' },
  },
  {
    accessorKey: 'currentRevision',
    header: ({ column }) => columnHeader(column, 'Current Revision #'),
    meta: { columnName: 'Current Revision' },
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <p className=" hover:underline hover:underline-offset-2">
                {fullName}
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-1">
            <DialogTitle>{fullName}</DialogTitle>
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
          </DialogContent>
        </Dialog>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => columnHeader(column, 'Created'),
    meta: { columnName: 'Created' },
    cell: ({ row }) => {
      const dateDistance = formatDistance(
        new Date(row.original.createdAt),
        new Date(),
        {
          addSuffix: true,
        },
      )
      return <div className="">{dateDistance}</div>
    },
  },
]
