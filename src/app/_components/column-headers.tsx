import { Button } from '@/components/ui/button'
import { Column } from '@tanstack/react-table'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Icon } from 'lucide-react'

export default function columnHeader(
  column: Column<any, unknown>,
  title: string,
) {
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
      className="flex min-w-28 flex-row items-center justify-start gap-1 p-0"
    >
      {title}
      {icon}
    </Button>
  )
}
