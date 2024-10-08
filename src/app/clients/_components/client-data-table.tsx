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
  VisibilityState,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input'
import { CreateClientSheet } from './create-client-sheet'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { redirect } from 'next/navigation'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function ClientDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'createdAt', desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [searchColumn, setSearchColumn] =
    React.useState<string>('clientNickName')

  const table = useReactTable({
    data,
    columns,
    enableSortingRemoval: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col justify-between gap-x-2 gap-y-2 py-2 sm:flex-row">
        <div className="flex flex-col gap-x-2 gap-y-2 sm:w-fit sm:flex-row">
          <Input
            placeholder="Search..."
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) => {
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }}
            className="w-full max-w-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'}>
                Searching by:{' '}
                {table.getColumn(searchColumn)?.columnDef.meta?.columnName}
                <span>
                  <ChevronDown
                    className=""
                    strokeWidth={1}
                    size={24}
                  ></ChevronDown>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table.getAllColumns().map((column) => {
                return (
                  <DropdownMenuItem
                    key={column.id}
                    onSelect={() => {
                      table.getColumn(searchColumn)?.setFilterValue('')

                      setSearchColumn(column.id)
                    }}
                  >
                    {column.columnDef.meta?.columnName}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex grow"></div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Select Columns{' '}
              <span>
                <ChevronDown
                  className=""
                  strokeWidth={1}
                  size={24}
                ></ChevronDown>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .filter((column) => column.id !== 'actions')
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.meta!.columnName}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateClientSheet></CreateClientSheet>
      </div>

      <div className="flex max-h-[90%] flex-col rounded-lg border pl-4 pr-4 pt-4">
        <Table className="">
          <TableHeader className="sticky top-0 bg-white/70 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
