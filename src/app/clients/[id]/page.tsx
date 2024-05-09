import PageWrapper from '@/app/_components/page-wrapper'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getClientById } from '@/server/queries'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function FullClientPage({
  params,
}: {
  params: { id: string }
}) {
  const uuid = params.id

  const clientData = await getClientById(uuid)

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
              <p className="text-2xl underline underline-offset-2">
                {clientData.clientNickName}
              </p>
            </Link>
          </div>
        </div>
        <div className="mx-4 my-4 flex h-[calc(80%)] flex-col gap-x-4 gap-y-4 overflow-scroll scroll-smooth sm:flex-row">
          {/* <div className="flex w-full flex-col rounded-3xl border p-2 ">
            Hey
          </div>
          <div className="flex w-full flex-col rounded-3xl border p-2 ">
            Hey
          </div>

          <div className="flex w-full flex-col rounded-3xl border p-2">
            <Accordion
              type="multiple"
              className="w-full overflow-scroll scroll-smooth"
            >
              <AccordionItem value="contacts">
                <AccordionTrigger>Contacts</AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="quotations">
                <AccordionTrigger>Quotations</AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="projects">
                <AccordionTrigger>Projects</AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
            </Accordion>
          </div> */}
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
