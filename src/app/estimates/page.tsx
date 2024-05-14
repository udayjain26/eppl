import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'
import { CreateEstimateSheet } from './_components/create-estimate-sheet'

export default function QuotationsPage() {
  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-row ">
          <Link href={'/estimates'}>
            <p className="text-2xl">Estimates</p>
          </Link>
        </div>
        <div className="flex max-h-[90%] flex-col ">
          {' '}
          <div className="flex flex-row justify-end">
            <CreateEstimateSheet />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
