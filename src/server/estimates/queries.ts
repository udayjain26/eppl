'use server'

import { Estimate } from '@/schemas/schema-table-types'
import { db } from '../db'

//This function is being used to populate data for the estimates main table!
export async function getEstimatesDataForTable(): Promise<Estimate[]> {
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
        product: {
          columns: { productName: true },
        },
      },
    })) as Estimate[]

    return data
  } catch (error) {
    throw new Error('Failed to fetch estimates data')
  }
  return []
}
