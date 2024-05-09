'use client'

import { Client } from '@/server/db/schema-table-types'
import { Column, ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Icon,
  MoreHorizontal,
} from 'lucide-react'
import Link from 'next/link'

function columnHeader(column: Column<Client, unknown>, title: string) {
  const icon =
    column.getIsSorted() === 'asc' ? (
      <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowDownNarrowWide className="ml-2 h-4 w-4" />
    ) : (
      <Icon iconNode={[]}></Icon>
    )

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="w-full p-0"
    >
      {title}
      {icon}
    </Button>
  )
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'clientFullName',
    header: ({ column }) => columnHeader(column, 'Full Name'),
  },
  {
    accessorKey: 'clientNickName',
    header: ({ column }) => columnHeader(column, 'Nick Name'),
    cell: ({ row }) => {
      const nickName: string = row.getValue('clientNickName')
      const uuid = console.log(row.original.uuid)

      return (
        <Link href={`/clients/${uuid}`}>
          <p className=" underline underline-offset-2"> {nickName}</p>
        </Link>
      )
    },
  },

  {
    accessorKey: 'gstin',
    header: ({ column }) => columnHeader(column, 'GSTIN'),
  },
  {
    accessorKey: 'clientAddressLine1',
    header: ({ column }) => columnHeader(column, 'Address 1'),
  },
  {
    accessorKey: 'clientAddressLine2',
    header: ({ column }) => columnHeader(column, 'Address 2'),
  },
  {
    accessorKey: 'clientAddressCity',
    header: ({ column }) => columnHeader(column, 'City'),
  },
  {
    accessorKey: 'clientAddressState',
    header: ({ column }) => columnHeader(column, 'State'),
  },
  {
    accessorKey: 'clientAddressPincode',
    header: ({ column }) => columnHeader(column, 'Pincode'),
  },
  {
    accessorKey: 'clientIndustry',
    header: ({ column }) => columnHeader(column, 'Industry'),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => columnHeader(column, 'Created At'),

    cell: ({ row }) => {
      const dateOptions = {
        day: '2-digit',
        month: 'long',
        year: '2-digit',
      } as const

      //   const date = new Date(row.getValue('createdAt')).toDateString()
      const date = new Date(row.getValue('createdAt')).toLocaleDateString(
        'en-IN',
        dateOptions,
      )

      return <div className="">{date}</div>
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const client = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                const clientDetails =
                  client.clientFullName +
                  '\n' +
                  (client.gstin != null ? client.gstin! + '\n' : '') +
                  (client.clientAddressLine1 != null
                    ? client.clientAddressLine1! + '\n'
                    : '') +
                  (client.clientAddressLine2 != null
                    ? client.clientAddressLine2! + '\n'
                    : '') +
                  (client.clientAddressCity != null
                    ? client.clientAddressCity! + '\n'
                    : '') +
                  (client.clientAddressState != null
                    ? client.clientAddressState! + '\n'
                    : '') +
                  (client.clientAddressPincode != null
                    ? client.clientAddressPincode! + '\n'
                    : '') +
                  (client.clientWebsite != null
                    ? client.clientWebsite! + '\n'
                    : '')
                navigator.clipboard.writeText(clientDetails)
              }}
            >
              Copy Client Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Create New Project</DropdownMenuItem>
            <DropdownMenuItem>View Full Page</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
