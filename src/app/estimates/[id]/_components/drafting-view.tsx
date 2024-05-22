'use client'
import { Button } from '@/components/ui/button'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { create } from 'domain'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'

export default function DraftingView(props: {
  estimateData: EstimateTableRow
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-300"></div>
  )
}
