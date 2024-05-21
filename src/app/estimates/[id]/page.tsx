import PageWrapper from '@/app/_components/page-wrapper'
import { getClientsData } from '@/server/clients/queries'
import Link from 'next/link'
import { EstimateDetailsCard } from './_components/estimate-details-card'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { getEstimateDataByIdForFullPage } from '@/server/estimates/queries'
import { ChevronRight } from 'lucide-react'
import { RevisionDetailsCard } from './_components/revision-details-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import RevisionView from './_components/revision-view'

export default async function FullEstimatePage({
  params,
}: {
  params: { id: string }
}) {
  const estimateData = (await getEstimateDataByIdForFullPage(
    params.id,
  )) as EstimateTableRow

  const uuid = params.id

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col ">
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
        <div className="mx-4 my-4 flex h-[90%] flex-col gap-x-4 gap-y-4 overflow-auto lg:flex-row">
          <div className="flex max-h-[94%] flex-col p-2 sm:min-w-[22rem]">
            <Tabs
              defaultValue="estimate"
              className="flex max-h-full w-full flex-col"
            >
              <TabsList className="flex w-full justify-between">
                <TabsTrigger className="flex grow" value="estimate">
                  Estimate Details
                </TabsTrigger>
                <TabsTrigger className="flex grow" value="revisions">
                  Revision Details
                </TabsTrigger>
              </TabsList>
              <TabsContent className="max-h-full" value="estimate">
                <EstimateDetailsCard
                  estimateData={estimateData}
                ></EstimateDetailsCard>
              </TabsContent>
              <TabsContent value="revisions">
                <RevisionDetailsCard></RevisionDetailsCard>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex h-full min-h-96 w-full flex-col rounded-xl p-2 ">
            <RevisionView estimateData={estimateData}></RevisionView>
          </div>
        </div>{' '}
      </div>
    </PageWrapper>
  )
}
