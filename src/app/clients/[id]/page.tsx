import PageWrapper from '@/app/_components/page-wrapper'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { getClientById } from '@/server/clients/queries'
import { getContactsByClientUuid } from '@/server/contacts/queries'
import { clerkClient } from '@clerk/nextjs/server'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import ClientCard from './_components/client-card'
import ClientAccordion from './_components/client-accordion'

export default async function FullClientPage({
  params,
}: {
  params: { id: string }
}) {
  const uuid = params.id

  const [clientData, contactsData] = await Promise.all([
    getClientById(uuid),
    getContactsByClientUuid(uuid),
  ])

  const clientCreatedBy = clientData.createdBy
    ? (await clerkClient.users.getUser(clientData.createdBy)).fullName
    : 'Unknown'

  return (
    <PageWrapper>
      <div className="flex h-full w-full flex-row">
        <div className="flex min-w-[25%] max-w-[25%] flex-col justify-start ">
          <div className=" flex  justify-start gap-x-1 ">
            <div className="flex h-8 flex-col justify-center ">
              {' '}
              <Link href={'/clients'}>
                <p className="  text-base">Clients</p>
              </Link>
            </div>
            <div>
              <div className="flex h-8 flex-col justify-center">
                <ChevronRight className="" size={20} strokeWidth="1" />
              </div>
            </div>
            <div className="flex h-fit flex-col justify-center ">
              {' '}
              <Link href={`/clients${clientData.uuid}`}>
                <p className="overflow-hidden text-ellipsis  text-base">
                  {clientData.clientNickName}
                </p>
              </Link>
            </div>
          </div>
          <div>
            <ClientCard
              clientData={clientData}
              clientCreatedBy={clientCreatedBy}
            ></ClientCard>
          </div>
        </div>
        <div className="flex h-[98%] w-full flex-col gap-x-4 gap-y-4 overflow-auto pt-6 ">
          <div className="flex w-full flex-col rounded-xl p-2 ">
            <Card className="">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  <p>Activity Logs</p>
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>

              <CardContent>Coming Soon!</CardContent>
            </Card>
          </div>
        </div>
        <div className="overflow-aut2 flex h-[98%] min-w-[25%] max-w-[25%] flex-col gap-x-4 gap-y-4 pt-2 ">
          <ClientAccordion
            contactsData={contactsData}
            clientData={clientData}
          ></ClientAccordion>
        </div>
      </div>
    </PageWrapper>
  )
}
