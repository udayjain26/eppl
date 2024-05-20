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
import { User, clerkClient } from '@clerk/nextjs/server'
import { Pencil, Info, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { ContactCard } from './contact-card'

export default function ClientAccordion(props: {
  contactsData: Contact[]
  clientData: Client
}) {
  return (
    <div className="flex flex-col rounded-xl p-2 sm:min-w-[22rem]">
      <Accordion
        type="single"
        defaultValue={'contacts'}
        collapsible
        className="w-full overflow-y-scroll scroll-smooth"
      >
        <AccordionItem value="contacts">
          <AccordionTrigger>
            Contacts{'(' + props.contactsData.length + ')'}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-row items-center justify-end">
                <CreateContactSheet
                  props={{ row: props.clientData }}
                ></CreateContactSheet>
              </div>

              <DropdownMenuSeparator />
              {props.contactsData.map((contact) => {
                return (
                  <ContactCard
                    key={contact.uuid}
                    contact={contact}
                  ></ContactCard>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="estimates">
          <AccordionTrigger>Estimates</AccordionTrigger>
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
