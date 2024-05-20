import PageWrapper from '@/app/_components/page-wrapper'
import { getClientsData } from '@/server/clients/queries'
import Link from 'next/link'
import { EstimateDetailsCard } from './_components/estimate-details-card'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { getEstimateDataById } from '@/server/estimates/queries'
import { ChevronRight } from 'lucide-react'

export default async function FullEstimatePage({
  params,
}: {
  params: { id: string }
}) {
  const estimateData = (await getEstimateDataById(
    params.id,
  )) as EstimateTableRow

  const uuid = params.id

  return (
    <PageWrapper>
      <div className="h-full w-full ">
        <div className="flex flex-row justify-evenly ">
          <div className="flex grow items-center px-4">
            {' '}
            <Link href={'/estimates'}>
              <p className="text-2xl">Estimates</p>
            </Link>
            <ChevronRight size={28} strokeWidth="1" />
            <Link href={`/estimates/${uuid}`}>
              <p className="text-2xl ">{estimateData.estimateTitle}</p>
            </Link>
          </div>
        </div>
        <div className="mx-4 my-4 flex h-[90%] flex-col gap-x-4 gap-y-4  lg:flex-row">
          <div className="flex flex-col p-2 sm:min-w-[22rem]">
            <EstimateDetailsCard
              estimateData={estimateData}
            ></EstimateDetailsCard>
          </div>
          <div className="flex w-full flex-col rounded-xl p-2 "></div>
        </div>{' '}
      </div>
    </PageWrapper>
  )
}
