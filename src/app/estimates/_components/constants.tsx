import { cn } from '@/lib/utils'

export function estimateStageColors(stage: string) {
  return cn(
    ' rounded-lg border border-slate-300 p-1 text-center text-sm shadow-md',
    {
      'bg-gray-500': stage === 'Empty',
      'bg-blue-500': stage === 'Drafting',
      'bg-yellow-500': stage === 'Pending Rates',
      'bg-indigo-500': stage === 'Rates Approved',
      'bg-orange-500': stage === 'Client Approval',
      'bg-emerald-500': stage === 'Won',
      'bg-red-500': stage === 'Lost',
    },
  )
}

export function estimateStatusColors(status: string) {
  return cn(
    'rounded-lg border border-slate-300 p-1 text-center text-sm shadow-md',
    {
      'bg-red-500': status === 'Not Started',
      'bg-yellow-500': status === 'In Progress',
      'bg-green-500': status === 'Completed',
    },
  )
}
