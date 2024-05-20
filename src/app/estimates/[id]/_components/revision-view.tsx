import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function RevisionView() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-300">
      <div className="text-lg">No revisions found.</div>
      <Button>
        <span className="mr-1">
          <Plus size={24} strokeWidth={1}></Plus>
        </span>
        Create Revision
      </Button>
    </div>
  )
}
