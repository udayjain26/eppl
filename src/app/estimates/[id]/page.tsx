import PageWrapper from '@/app/_components/page-wrapper'
import { getClientsData } from '@/server/clients/queries'
import Link from 'next/link'
import { EstimateDetailsCard } from './_components/estimate-details-card'
import { EstimateTableRow } from '@/schemas/schema-table-types'
import { getEstimateDataByIdForFullPage } from '@/server/estimates/queries'
import { ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainView from './_components/main-view'
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
import { VariationData } from '@/server/variations/types'
import { PaperData } from '@/server/paper/types'
import { getPaperData } from '@/server/paper/queries'

export default async function FullEstimatePage({
  params,
}: {
  params: { id: string }
}) {
  const [estimateData, paperData] = await Promise.all([
    getEstimateDataByIdForFullPage(params.id) as Promise<EstimateTableRow>,
    getPaperData() as Promise<PaperData[]>,
  ])

  const uuid = params.id

  const variationsData = (await getEstimateVariationsData(
    uuid,
  )) as VariationData[]

  return (
    <PageWrapper>
      <div className="flex flex-col overflow-y-auto sm:flex-row">
        <div className="flex h-full max-h-[97%] min-w-[20%] flex-col sm:max-w-[20%]">
          <div className=" flex grow justify-start gap-x-1 ">
            <div className="flex h-8 flex-col justify-center ">
              {' '}
              <Link href={'/estimates'}>
                <p className="  text-base">Estimates</p>
              </Link>
            </div>
            <div>
              <div className="flex h-8 flex-col justify-center">
                <ChevronRight className="" size={20} strokeWidth="1" />
              </div>
            </div>
            <div className="flex h-fit flex-col justify-center  ">
              {' '}
              <Link href={`/estimates/${estimateData.uuid}`}>
                <p className="overflow-hidden text-ellipsis text-base">
                  {estimateData.estimateTitle}
                </p>
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
          <MainView
            estimateData={estimateData}
            variationsData={variationsData}
            paperData={paperData}
          ></MainView>
        </div>
      </div>
    </PageWrapper>
  )
}
