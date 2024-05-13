import PageWrapper from '@/app/_components/page-wrapper'
import { CreateContactSheet } from '@/app/_contacts/_components/create-contact-sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'

import { getClientById } from '@/server/clients/queries'
import { getContactsByClientUuid } from '@/server/contacts/queries'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { ChevronRight, Info, Pencil } from 'lucide-react'
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
  // const contactsCreatedBy = contactsData.map(async (contact) => {
  //   return contact.createdBy
  //     ? (await clerkClient.users.getUser(contact.createdBy)).fullName
  //     : 'Unknown'
  // })

  // const [clientCreatedBy, contactsCreatedBy] = await Promise.all([
  //   clientData.createdBy
  //     ? (await clerkClient.users.getUser(clientData.createdBy)).fullName
  //     : 'Unknown',
  //   Promise.all(
  //     contactsData.map(async (contact) => {
  //       return contact.createdBy
  //         ? (await clerkClient.users.getUser(contact.createdBy)).fullName
  //         : 'Unknown'
  //     }),
  //   ),
  // ])

  contactsData.map(async (contact) => {
    contact.createdBy = contact.createdBy
      ? (await clerkClient.users.getUser(contact.createdBy)).fullName
      : 'Unknown'
  })

  return (
    <PageWrapper>
      <div className="h-full w-full ">
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
        <div className="mx-4 my-4 flex h-[90%] flex-col gap-x-4 gap-y-4 overflow-y-scroll scroll-smooth lg:flex-row">
          <div className="flex flex-col p-2 sm:min-w-[22rem]">
            <ClientCard
              clientData={clientData}
              clientCreatedBy={clientCreatedBy}
            ></ClientCard>
          </div>
          <div className="flex w-full flex-col rounded-xl p-2 ">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="">Recent Activity</CardTitle>
              </CardHeader>{' '}
            </Card>
          </div>
          <ClientAccordion
            contactsData={contactsData}
            clientData={clientData}
          ></ClientAccordion>
        </div>

        {/* <p className="text-md px-4 text-gray-700">
          {clientData.clientNickName}
        </p> */}

        {/* <div className="relative h-[80%]  p-4">
          <DataTable columns={columns} data={clientsData} />
        </div> */}
      </div>
    </PageWrapper>
  )
}
