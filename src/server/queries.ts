'use server'

import { db } from './db'
import { Client } from './db/types'

export async function getClientsData(): Promise<Client[]> {
  try {
    const data = await db.query.clients.findMany()
    return data
  } catch (error) {
    throw new Error('Failed to fetch clients data')
  }
  return []
}
