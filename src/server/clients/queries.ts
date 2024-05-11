'use server'

import { unstable_noStore } from 'next/cache'
import { db } from '../db'
import { Client } from '../../schemas/schema-table-types'

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
