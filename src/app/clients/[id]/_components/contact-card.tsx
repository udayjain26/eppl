import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Contact } from '@/schemas/schema-table-types'
import { clerkClient } from '@clerk/nextjs/server'
import { Info, Pencil } from 'lucide-react'
import Link from 'next/link'

export async function ContactCard(props: { contact: Contact }) {
  let createdByUser: string | null = '' // Declare the variable outside the try block

  try {
    createdByUser = props.contact.createdBy
      ? (await clerkClient.users.getUser(props.contact.createdBy)).fullName
      : null
  } catch (error) {
    console.error(error)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {props.contact.contactFirstName} {props.contact.contactLastName}
        </CardTitle>
        <Button variant={'outline'} className="">
          <Link href={`/contacts/${props.contact.uuid}/edit`}>
            <span className="flex flex-row items-center gap-1">
              <Pencil strokeWidth={1} size={16}></Pencil>
            </span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="text-md gap-y-2">
        <p>{props.contact.contactDesignation}</p>
        <div className="flex flex-row items-center gap-x-1">
          <Link href={`mailto:${props.contact.contactEmail}`}>
            <p className="text-blue-900 underline underline-offset-1">
              {props.contact.contactEmail}
            </p>
          </Link>
        </div>
        <div className="flex flex-row items-center gap-x-1">
          <Link href={`tel:${props.contact.contactMobile}`}>
            <p className="text-blue-900 underline underline-offset-1">
              {props.contact.contactMobile}
            </p>
          </Link>
        </div>
        <p>Status: {props.contact.isActive ? 'Active' : 'Inactive'}</p>
        <Separator></Separator>
        <div className=" mt-2 flex flex-row items-center gap-x-2 text-xs text-slate-700">
          <Info strokeWidth={1} size={16}></Info>
          <p>
            Contact created by {createdByUser} on{' '}
            {props.contact.createdAt.toDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
