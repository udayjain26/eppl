'use client'
import { Button } from '@/components/ui/button'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { createRevision } from '@/server/revisions/actions'
import { create } from 'domain'
import { Plus } from 'lucide-react'
import { useTransition } from 'react'

export default function RevisionView(props: {
  estimateData: EstimateTableRow
}) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    // Use startTransition to mark the state update as non-urgent
    startTransition(async () => {
      const result = await createRevision(props.estimateData.uuid)
    })
  }

  function RenderCreateRevisionButton() {
    return (
      <>
        <div className="text-lg">No revisions found.</div>
        <Button type="button" onClick={handleClick} disabled={isPending}>
          <span className="mr-1">
            <Plus size={24} strokeWidth={1}></Plus>
          </span>
          {isPending ? 'Creating Revision...' : 'Create Revision'}
        </Button>
      </>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-300">
      {parseInt(props.estimateData.currentRevision as string) === 0 ? (
        <RenderCreateRevisionButton />
      ) : (
        <div>Revisions found</div>
      )}
    </div>
  )
}
