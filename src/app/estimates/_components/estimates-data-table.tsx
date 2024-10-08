'use client'

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Input } from '@/components/ui/input'

import { Button } from '@/components/ui/button'
import { CreateEstimateSheet } from './create-estimate-sheet'
import { ChevronDown } from 'lucide-react'
import { estimateStageEnum } from '@/server/db/schema'
import { useEffect, useState } from 'react'
import { set } from 'date-fns'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function EstimateDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [searchColumn, setSearchColumn] = useState<string>('')
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSorting = localStorage.getItem('sorting')
      const savedFilters = localStorage.getItem('columnFilters')
      const savedVisibility = localStorage.getItem('columnVisibility')
      const savedSearchColumn = localStorage.getItem('searchColumn')
      const savedSelectedValues = localStorage.getItem('selectedValues')

      if (savedSorting) setSorting(JSON.parse(savedSorting))
      if (savedFilters) setColumnFilters(JSON.parse(savedFilters))
      if (savedVisibility) setColumnVisibility(JSON.parse(savedVisibility))
      if (savedSearchColumn) setSearchColumn(savedSearchColumn)
      if (savedSelectedValues)
        setSelectedValues(JSON.parse(savedSelectedValues))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sorting.length !== 0)
        localStorage.setItem('sorting', JSON.stringify(sorting))
    }
  }, [sorting])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (Object.keys(columnFilters).length !== 0)
        localStorage.setItem('columnFilters', JSON.stringify(columnFilters))
    }
  }, [columnFilters])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (Object.keys(columnVisibility).length !== 0)
        localStorage.setItem(
          'columnVisibility',
          JSON.stringify(columnVisibility),
        )
    }
  }, [columnVisibility])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (searchColumn) localStorage.setItem('searchColumn', searchColumn)
    }
  }, [searchColumn])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedValues.length !== 0)
        localStorage.setItem('selectedValues', JSON.stringify(selectedValues))
    }
  }, [selectedValues])

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
    // autoResetAll: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setSelectedValues((prev) => {
      const updatedValues = checked
        ? [...prev, value]
        : prev.filter((v) => v !== value)
      return updatedValues
    })
  }

  useEffect(() => {
    table.getColumn('estimateStage')?.setFilterValue(selectedValues)
  }, [selectedValues])

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col justify-between gap-x-2 gap-y-2 py-2 sm:flex-row">
        <div className="flex flex-col gap-x-2 gap-y-2 sm:w-fit sm:flex-row">
          <Input
            placeholder="Search..."
            value={
              (table
                .getColumn(searchColumn ? searchColumn : 'estimateTitle')
                ?.getFilterValue() as string) ?? ''
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
                {
                  table.getColumn(searchColumn ? searchColumn : 'estimateTitle')
                    ?.columnDef.meta?.columnName
                }
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'}>
                Estimate Stage{' '}
                <ChevronDown className="" strokeWidth={1} size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {estimateStageEnum.enumValues.map((value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  checked={selectedValues.includes(value)}
                  onClick={(e) => {
                    e.preventDefault()
                    handleCheckboxChange(value, !selectedValues.includes(value))
                  }}
                >
                  {value}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div></div>

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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onClick={(e) => {
                      e.preventDefault()
                      column.toggleVisibility()
                    }}
                  >
                    {column.columnDef.meta!.columnName}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <CreateEstimateSheet />
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
