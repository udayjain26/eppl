import PageWrapper from '@/app/_components/page-wrapper'
import { CreateContactSheet } from '@/app/_contacts/_components/create-contact-sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { getClientById } from '@/server/clients/queries'
import { getContactsByClientUuid } from '@/server/contacts/queries'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

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

  // const clientData = await getClientById(uuid)
  // const contactsData = await getContactsByClient(uuid)

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
        <div className="mx-4 my-4 flex h-[90%] flex-col gap-x-4 gap-y-4 overflow-scroll scroll-smooth sm:flex-row">
          <div className="flex w-full flex-col p-2 ">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="">Client Details</CardTitle>
                <Button variant={'outline'} className="">
                  <Link href={`/clients/${clientData.uuid}/edit`}>Edit</Link>
                </Button>
              </CardHeader>
              <CardContent className="gap-y-2 ">
                <h2 className=" text-xl">
                  <p>{clientData.clientFullName}</p>
                  <p>{clientData.gstin}</p>
                </h2>
                <h3 className="text-md">
                  <p>
                    {clientData.clientAddressLine1},{' '}
                    {clientData.clientAddressLine2}
                  </p>
                  <p>{clientData.clientAddressCity}</p>
                  <p>{clientData.clientAddressState}</p>
                  <p>{clientData.clientAddressPincode}</p>
                  <p>{clientData.clientWebsite}</p>
                  <p>{clientData.clientIndustry}</p>
                </h3>
              </CardContent>
            </Card>
          </div>
          <div className="flex w-full flex-col rounded-xl  p-2 ">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="">Recent Activity</CardTitle>
              </CardHeader>{' '}
            </Card>
          </div>

          <div className="flex w-full flex-col rounded-xl  p-2">
            <Accordion
              type="multiple"
              defaultValue={['contacts', 'quotations', 'projects']}
              className="w-full overflow-scroll scroll-smooth"
            >
              <AccordionItem value="contacts">
                <AccordionTrigger>Contacts</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-row items-center justify-between">
                      Manage contacts
                      <CreateContactSheet
                        props={{ row: clientData }}
                      ></CreateContactSheet>
                    </div>

                    <DropdownMenuSeparator />
                    {contactsData.map((contact) => {
                      return (
                        <Card key={contact.uuid}>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="">
                              {contact.contactFirstName}{' '}
                              {contact.contactLastName}
                            </CardTitle>
                            <Button variant={'outline'} className="">
                              <Link href={`/contacts/${contact.uuid}/edit`}>
                                Edit
                              </Link>
                            </Button>
                          </CardHeader>
                          <CardContent className="gap-y-2 ">
                            <h2 className=" text-md">
                              <p>{contact.contactDesignation}</p>
                              <p>{contact.contactEmail}</p>
                              <p>{contact.contactMobile}</p>
                              <p>{contact.isActive ? 'Active' : 'Inactive'}</p>
                            </h2>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </AccordionContent>
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
          </div>
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
