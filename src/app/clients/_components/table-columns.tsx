'use client'

import { Client } from '@/schemas/schema-table-types'
import { Column, ColumnDef, RowData } from '@tanstack/react-table'
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
  ClipboardCopy,
  FolderPlus,
  Icon,
  MoreHorizontal,
  StickyNote,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { CreateContactSheet } from '../../_contacts/_components/create-contact-sheet'
import test from 'node:test'

import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName: string
  }
}

function columnHeader(column: Column<Client, unknown>, title: string) {
  const icon =
    column.getIsSorted() === 'asc' ? (
      <ArrowUpNarrowWide strokeWidth={1} size={28} className="ml-2" />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowDownNarrowWide strokeWidth={1} size={28} className="ml-2" />
    ) : (
      <Icon iconNode={[]}></Icon>
    )

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="min-w-28 p-0"
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
    meta: { columnName: 'Full Name' },
  },
  {
    accessorKey: 'clientNickName',
    header: ({ column }) => columnHeader(column, 'Nick Name'),
    cell: ({ row }) => {
      const nickName: string = row.getValue('clientNickName')

      return (
        <Link href={`/clients/${row.original.uuid}`}>
          <p className=" underline underline-offset-2"> {nickName}</p>
        </Link>
      )
    },
    meta: { columnName: 'Nick Name' },
  },

  {
    accessorKey: 'gstin',
    header: ({ column }) => columnHeader(column, 'GSTIN'),
    meta: { columnName: 'GSTIN' },
  },
  {
    accessorKey: 'clientAddressLine1',
    header: ({ column }) => columnHeader(column, 'Address 1'),
    meta: { columnName: 'Address 1' },
  },
  {
    accessorKey: 'clientAddressLine2',
    header: ({ column }) => columnHeader(column, 'Address 2'),
    meta: { columnName: 'Address 2' },
  },
  {
    accessorKey: 'clientAddressCity',
    header: ({ column }) => columnHeader(column, 'City'),
    meta: { columnName: 'City' },
  },
  {
    accessorKey: 'clientAddressState',
    header: ({ column }) => columnHeader(column, 'State'),
    meta: { columnName: 'State' },
  },
  {
    accessorKey: 'clientAddressPincode',
    header: ({ column }) => columnHeader(column, 'Pincode'),
    meta: { columnName: 'Pincode' },
  },
  {
    accessorKey: 'clientIndustry',
    header: ({ column }) => columnHeader(column, 'Industry'),
    meta: { columnName: 'Industry' },
  },

  {
    accessorKey: 'createdAt',
    header: ({ column }) => columnHeader(column, 'Created At'),
    meta: { columnName: 'Created At' },

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

  // {
  //   id: 'actions',
  //   meta: { columnName: 'Actions' },

  //   cell: ({ row }) => {
  //     const client = row.original

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal strokeWidth={1} size={24} />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
  //             <CreateContactSheet
  //               props={{ row: row.original }}
  //             ></CreateContactSheet>
  //           </DropdownMenuItem>
  //           {/* <DropdownMenuItem
  //             className="gap-x-1"
  //             onClick={() => {
  //               const clientDetails =
  //                 client.clientFullName +
  //                 '\n' +
  //                 (client.gstin != null ? client.gstin! + '\n' : '') +
  //                 (client.clientAddressLine1 != null
  //                   ? client.clientAddressLine1! + '\n'
  //                   : '') +
  //                 (client.clientAddressLine2 != null
  //                   ? client.clientAddressLine2! + '\n'
  //                   : '') +
  //                 (client.clientAddressCity != null
  //                   ? client.clientAddressCity! + '\n'
  //                   : '') +
  //                 (client.clientAddressState != null
  //                   ? client.clientAddressState! + '\n'
  //                   : '') +
  //                 (client.clientAddressPincode != null
  //                   ? client.clientAddressPincode! + '\n'
  //                   : '') +
  //                 (client.clientWebsite != null
  //                   ? client.clientWebsite! + '\n'
  //                   : '')
  //               navigator.clipboard.writeText(clientDetails)
  //             }}
  //           >
  //             <span>
  //               <ClipboardCopy strokeWidth={1} size={24}></ClipboardCopy>
  //             </span>
  //             Copy Client Details
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem className="gap-x-1">
  //             {' '}
  //             <span>
  //               <FolderPlus strokeWidth={1} size={24}></FolderPlus>
  //             </span>
  //             New Project
  //           </DropdownMenuItem> */}

  //           {/* <DropdownMenuItem className="">
  //             {' '}
  //             <Link href={`/clients/${row.original.uuid}`}>
  //               <span className="flex flex-row gap-x-1">
  //                 <span>
  //                   <StickyNote strokeWidth={1} size={24}></StickyNote>
  //                 </span>
  //                 View Full Page
  //               </span>
  //             </Link>
  //           </DropdownMenuItem> */}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]
