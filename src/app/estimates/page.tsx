import Link from 'next/link'
import PageWrapper from '../_components/page-wrapper'
import { CreateEstimateSheet } from './_components/create-estimate-sheet'
import { EstimateDataTable } from './_components/estimates-data-table'
import { estimatesColumns } from './_components/table-columns'
import { getEstimatesData } from '@/server/estimates/queries'

export default async function QuotationsPage() {
  const estimatesData = await getEstimatesData()

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col px-4">
        <div className="flex flex-row ">
          <Link href={'/estimates'}>
            <p className="text-2xl">Estimates</p>
          </Link>
        </div>
        {/* <p className=" text-xs">Total Clients: {estimatesData.length}</p> */}

        <div className="flex max-h-[90%] flex-col ">
          <EstimateDataTable columns={estimatesColumns} data={estimatesData} />
        </div>
      </div>
    </PageWrapper>
  )
}
