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
      <div className="h-full w-full">
        <div className="flex flex-row justify-evenly ">
          <div className="flex grow items-center px-4">
            {' '}
            <Link href={'/clients'}>
              <p className="text-2xl">Clients</p>
            </Link>
            <ChevronRight size={28} strokeWidth="1" />
            <Link href={`/clients/${uuid}`}>
              <p className="text-2xl ">{clientData.clientNickName}</p>
            </Link>
          </div>
        </div>
        <div className="mx-4 my-4 flex h-[90%] flex-col gap-x-4 gap-y-4 overflow-auto lg:flex-row">
          <div className="flex flex-col p-2 sm:min-w-[22rem]">
            <ClientCard
              clientData={clientData}
              clientCreatedBy={clientCreatedBy}
            ></ClientCard>
          </div>
          <div className="flex w-full flex-col rounded-xl p-2 ">
            <Card className="">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  <p>Activity Logs</p>
                </CardTitle>
                <CardDescription>
                  {/* Date Created: {props.clientData.createdAt.toDateString()} */}
                </CardDescription>
              </CardHeader>

              <CardContent>Coming Soon!</CardContent>
            </Card>
          </div>
          <ClientAccordion
            contactsData={contactsData}
            clientData={clientData}
          ></ClientAccordion>
        </div>
      </div>
    </PageWrapper>
  )
}
