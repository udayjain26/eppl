import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'
import { CreateEstimateSheet } from './_components/create-estimate-sheet'
import { EstimateDataTable } from './_components/estimates-data-table'
import { estimatesColumns } from './_components/table-columns'
import { getEstimatesDataForTable } from '@/server/estimates/queries'
import { estimates } from '@/server/db/schema'

export default async function QuotationsPage() {
  const estimatesData = await getEstimatesDataForTable()

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-row ">
          <Link href={'/estimates'}>
            <p className="text-2xl">Estimates</p>
          </Link>
        </div>
        <p className=" text-xs">Total Estimates: {estimatesData.length}</p>

        <div className="flex max-h-[90%] flex-col ">
          <EstimateDataTable columns={estimatesColumns} data={estimatesData} />
        </div>
      </div>
    </PageWrapper>
  )
}
