'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import {
  updateEstimateStageToClientDecision,
  updateEstimateStageToNeedsRates,
} from '@/server/estimates/actions'
import { MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

export default function EstimateDetailsCardActions(props: {
  estimateData: EstimateTableRow
}) {
  return (
    <div className="ml-auto flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-fit w-fit" size="icon" variant="ghost">
            <MoreVertical strokeWidth={1} size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={props.estimateData.estimateStage === 'Needs Rates'}
            onClick={async () => {
              const result = await updateEstimateStageToNeedsRates(
                props.estimateData.uuid,
              )
              if (result === 'Success') {
                toast.success('Estimate stage updated to Needs Rates')
              } else if (
                result ===
                'Variations Missing Quantities. Make sure to save all variations!'
              ) {
                toast.error(result)
              } else if (result === 'Database Error') {
                toast.error(result)
              }
            }}
          >
            Request Rates
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={props.estimateData.estimateStage === 'Client Decision'}
            onClick={async () => {
              const result = await updateEstimateStageToClientDecision(
                props.estimateData.uuid,
              )
            }}
          >
            Mark as Sent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
