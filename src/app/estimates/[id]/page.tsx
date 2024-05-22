import PageWrapper from '@/app/_components/page-wrapper'
import { getClientsData } from '@/server/clients/queries'
import Link from 'next/link'
import { EstimateDetailsCard } from './_components/estimate-details-card'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { getEstimateDataByIdForFullPage } from '@/server/estimates/queries'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DraftingView from './_components/drafting-view'
import { Input } from '@/components/ui/input'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { getEstimateVariationsData } from '@/server/variations/queries'

export default async function FullEstimatePage({
  params,
}: {
  params: { id: string }
}) {
  const estimateData = (await getEstimateDataByIdForFullPage(
    params.id,
  )) as EstimateTableRow
  const uuid = params.id

  const variationsData = await getEstimateVariationsData(uuid)

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-col overflow-y-auto sm:flex-row">
        <div className="flex h-full max-h-[97%] flex-col  sm:max-w-[25%]">
          <div className="flex w-full flex-row gap-x-4">
            <div className="flex items-center px-4 ">
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
          <Tabs defaultValue="estimate" className=" h-full flex-col px-1 pt-5">
            <TabsList className="flex flex-row justify-start overflow-x-auto ">
              <TabsTrigger className="min-w-fit" value="estimate">
                Estimate Details
              </TabsTrigger>
              <TabsTrigger className="" value="history">
                Estimate History
              </TabsTrigger>
            </TabsList>
            <TabsContent className="max-h-full" value="estimate">
              <EstimateDetailsCard
                estimateData={estimateData}
              ></EstimateDetailsCard>
            </TabsContent>
            <TabsContent value="history">
              <div className="">
                <Input></Input>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex max-h-[97%] min-h-[97%]  w-full flex-col gap-y-2 rounded-xl  p-2 ">
          <DraftingView
            estimateData={estimateData}
            variationsData={variationsData}
          ></DraftingView>
        </div>
      </div>
    </PageWrapper>
  )
}
