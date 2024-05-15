'use server'

import { Estimate } from '@/schemas/schema-table-types'
import { db } from '../db'

export async function getEstimatesData(): Promise<Estimate[]> {
  try {
    const data = (await db.query.estimates.findMany({
      with: {
        client: { columns: { clientNickName: true } },
        contact: {
          columns: {
            contactFirstName: true,
            contactLastName: true,
            contactEmail: true,
            contactMobile: true,
            contactDesignation: true,
            isActive: true,
          },
        },
      },
    })) as Estimate[]

    console.log(data)
    return data
  } catch (error) {
    throw new Error('Failed to fetch estimates data')
  }
  return []
}
