'use client'

import * as React from 'react'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Input } from '@/components/ui/input'
import { CreateClientDialog } from './create-client-dialog'
import { cn } from '@/lib/utils'
import { ArrowBigDown, ArrowRight, Icon } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  console.log()

  return (
    <div className="h-full w-full ">
      <div className="flex flex-row justify-between  py-2">
        <div className="flex grow items-center">
          <Input
            placeholder="Search Clients by Nickname..."
            value={
              (table.getColumn('clientNickName')?.getFilterValue() as string) ??
              ''
            }
            onChange={(event) =>
              table
                .getColumn('clientNickName')
                ?.setFilterValue(event.target.value)
            }
            className=""
          />
        </div>
        <div className="flex w-8/12"></div>

        <CreateClientDialog></CreateClientDialog>
      </div>

      <div className="relative h-full rounded-lg border  pl-4 pr-4 pt-4">
        <Table className="">
          <TableHeader className="sticky top-0 bg-white/70 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  console.log(header.id)
                  return (
                    <TableHead
                      key={header.id}
                      // className={cn('', {
                      //   '': sorting.at(0)?.id == header.id,
                      // })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
