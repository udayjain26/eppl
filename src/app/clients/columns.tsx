'use client'

import { Client } from '@/server/db/schema-table-types'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'clientFullName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'clientNickName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nick Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: 'gstin',
    header: () => <div className="text-md">GSTIN</div>,
  },
  {
    accessorKey: 'clientAddressLine1',
    header: () => <div className="text-md">Address 1</div>,
  },
  {
    accessorKey: 'clientAddressLine2',
    header: () => <div className="text-md">Address 2</div>,
  },
  {
    accessorKey: 'clientAddressCity',
    header: () => <div className="text-md">City</div>,
  },
  {
    accessorKey: 'clientAddressState',
    header: () => <div className="text-md">State</div>,
  },
  {
    accessorKey: 'clientAddressPincode',
    header: () => <div className="text-md">Pincode</div>,
  },
  {
    accessorKey: 'clientIndustry',
    header: () => <div className="text-md">Industry</div>,
  },
  {
    accessorKey: 'createdAt',
    header: () => <div className="text-md">Created At</div>,
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
      console.log(date)

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
                  (client.gstin != null ? client.gstin! : '') +
                  '\n' +
                  (client.clientAddressLine1 != null
                    ? client.clientAddressLine1!
                    : '') +
                  '\n' +
                  (client.clientAddressLine2 != null
                    ? client.clientAddressLine2!
                    : '') +
                  '\n' +
                  (client.clientAddressCity != null
                    ? client.clientAddressCity!
                    : '') +
                  '\n' +
                  (client.clientAddressState != null
                    ? client.clientAddressState!
                    : '') +
                  '\n' +
                  (client.clientAddressPincode != null
                    ? client.clientAddressPincode!
                    : '') +
                  '\n' +
                  (client.clientWebsite != null ? client.clientWebsite! : '')
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
