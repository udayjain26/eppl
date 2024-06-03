import { cn } from '@/lib/utils'

export function estimateStageColors(stage: string) {
  return cn(
    ' rounded-lg border border-slate-300 p-1 text-center text-sm shadow-md',
    {
      'bg-gray-500': stage === 'Empty',
      'bg-blue-500': stage === 'Drafting',
      'bg-yellow-500': stage === 'Needs Rates',
      'bg-indigo-500': stage === 'Estimate Approved',
      'bg-orange-500': stage === 'Client Decision',
      'bg-emerald-500': stage === 'Won',
      'bg-red-500': stage === 'Lost',
    },
  )
}

export function estimateStatusColors(status: string) {
  return cn(' text-sm')
}
