'use client'

import { Client } from '@/schemas/schema-table-types'
import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'

import '@tanstack/react-table' //or vue, svelte, solid, qwik, etc.
import columnHeader from '@/app/_components/column-headers'
import { buttonVariants } from '@/components/ui/button'

export const clientColumns: ColumnDef<Client>[] = [
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
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href={`/clients/${row.original.uuid}`}
        >
          <p className=" hover:underline hover:underline-offset-2">
            {' '}
            {nickName}
          </p>
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
]
