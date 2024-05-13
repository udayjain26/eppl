import { CreateContactSheet } from '@/app/_contacts/_components/create-contact-sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Client, Contact } from '@/schemas/schema-table-types'
import { clerkClient } from '@clerk/nextjs/server'
import { Pencil, Info, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export default function ClientAccordion(props: {
  contactsData: Contact[]
  clientData: Client
}) {
  return (
    <div className="flex flex-col rounded-xl p-2 sm:min-w-[22rem]">
      <Accordion
        type="multiple"
        defaultValue={['contacts', 'quotations', 'projects']}
        className="w-full overflow-scroll scroll-smooth"
      >
        <AccordionItem value="contacts">
          <AccordionTrigger>
            Contacts{'(' + props.contactsData.length + ')'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center justify-between">
                Manage contacts
                <CreateContactSheet
                  props={{ row: props.clientData }}
                ></CreateContactSheet>
              </div>

              <DropdownMenuSeparator />
              {props.contactsData.map(async (contact) => {
                const createdBy = contact.createdBy
                  ? (await clerkClient.users.getUser(contact.createdBy))
                      .fullName
                  : 'Unknown'

                return (
                  <Card key={contact.uuid}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg">
                        {contact.contactFirstName} {contact.contactLastName}
                      </CardTitle>
                      <Button variant={'outline'} className="">
                        <Link href={`/contacts/${contact.uuid}/edit`}>
                          <span className="flex flex-row items-center gap-1">
                            <Pencil strokeWidth={1} size={16}></Pencil>
                          </span>
                        </Link>
                      </Button>
                    </CardHeader>
                    <CardContent className="text-md gap-y-2">
                      <p>{contact.contactDesignation}</p>
                      <Link href={`mailto:${contact.contactEmail}`}>
                        <div className="flex flex-row items-center gap-x-1">
                          <p className="text-blue-900 underline underline-offset-1">
                            {contact.contactEmail}
                          </p>
                        </div>
                      </Link>
                      <Link href={`tel:${contact.contactMobile}`}>
                        <div className="flex flex-row items-center gap-x-1">
                          <p className="text-blue-900 underline underline-offset-1">
                            {contact.contactMobile}
                          </p>
                        </div>{' '}
                      </Link>

                      <p>Status: {contact.isActive ? 'Active' : 'Inactive'}</p>
                      <Separator></Separator>
                      <div className=" mt-2 flex flex-row items-center gap-x-2 text-xs text-slate-700">
                        <Info strokeWidth={1} size={16}></Info>
                        <p>
                          Contact created by {createdBy} on{' '}
                          {contact.createdAt.toDateString()}
                        </p>
                      </div>
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
  )
}
