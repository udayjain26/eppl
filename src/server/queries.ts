'use server'

import { unstable_noStore } from 'next/cache'
import { db } from './db'
import { Client } from './db/schema-table-types'

export async function getClientsData(): Promise<Client[]> {
  try {
    const data = await db.query.clients.findMany()
    console.log('data called')
    // await new Promise((resolve) => setTimeout(resolve, 3000))

    return data
  } catch (error) {
    throw new Error('Failed to fetch clients data')
  }
  return []
}
