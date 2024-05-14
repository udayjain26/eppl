'use server'

import { unstable_noStore } from 'next/cache'
import { db } from '../db'
import { Client } from '../../schemas/schema-table-types'
import { clients, contacts } from '../db/schema'
import { sql } from 'drizzle-orm'

export async function getClientsData(): Promise<Client[]> {
  try {
    const data = (await db.query.clients.findMany()) as Client[]

    return data
  } catch (error) {
    throw new Error('Failed to fetch clients data')
  }
  return []
}

export async function getClientById(id: string): Promise<Client> {
  try {
    const data = (await db.query.clients.findFirst({
      where: (client, { eq }) => eq(client.uuid, id),
    })) as Client
    return data
  } catch (error) {
    throw new Error('Failed to fetch client data')
  }
}

export async function getClientsDataIdAndNameWithContacts(): Promise<{}[]> {
  try {
    const data = await db.query.clients.findMany({
      columns: {
        uuid: true,
        clientNickName: true,
        clientFullName: true,
      },
      extras: {
        nickAndFullName:
          sql`${clients.clientNickName} || ' - ' || ${clients.clientFullName}`.as(
            'nick_and_full_name',
          ),
      },
      with: {
        contacts: {
          extras: {
            fullName:
              sql`${contacts.contactFirstName} || ' ' || ${contacts.contactLastName}`.as(
                'full_name',
              ),
          },
          columns: {
            uuid: true,
            contactFirstName: true,
            contactLastName: true,
          },
        },
      },
    })
    return data
  } catch (error) {
    throw new Error('Failed to fetch clients data')
  }
}
