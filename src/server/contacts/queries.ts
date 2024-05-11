'use server'

import { unstable_noStore } from 'next/cache'
import { db } from '../db'
import { Contact } from '../../schemas/schema-table-types'

export async function getContactsByClientUuid(id: string): Promise<Contact[]> {
  try {
    const data = (await db.query.contacts.findMany({
      where: (contact, { eq }) => eq(contact.clientUuid, id),
    })) as Contact[]
    return data
  } catch (error) {
    throw new Error('Failed to fetch contacts data')
  }
}
