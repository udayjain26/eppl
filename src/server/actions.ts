'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from './db'
import { clients } from './db/schema'

export async function createClient() {
  console.log('Client Create Called')

  const user = auth()
  if (!user.userId) {
    throw new Error('Unauthenitcated User')
  }
  await db.insert(clients).values({
    clientName: 'Client 1',
    clientCreationStatus: 'New',
  })
}
