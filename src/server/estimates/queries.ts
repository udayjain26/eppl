'use server'

import { EstimateTableRow } from '@/schemas/schema-table-types'
import { db } from '../db'
import { contacts, estimates } from '../db/schema'
import { sql } from 'drizzle-orm'

//This function is being used to populate data for the estimates main table!
export async function getEstimatesDataForTable(): Promise<EstimateTableRow[]> {
  try {
    const data = (
      await db.query.estimates.findMany({
        with: {
          client: { columns: { clientNickName: true } },
          contact: {
            extras: {
              contactFullName:
                //Last name is nullable, so we need to use COALESCE to handle null values
                sql`TRIM(${contacts.contactFirstName} || ' ' || COALESCE(${contacts.contactLastName}, ''))`.as(
                  'full_name',
                ),
            },
            columns: {
              contactFirstName: true,
              contactLastName: true,
              contactEmail: true,
              contactMobile: true,
              contactDesignation: true,
              isActive: true,
            },
          },
          productType: { columns: { productsTypeName: true } },
          product: { columns: { productName: true } },
        },
      })
    ).map((row) => ({
      ...row,
      estimateNumber: row.estimateNumber.toString(),
      currentRevision: row.currentRevision.toString(),
    })) as EstimateTableRow[]

    return data
  } catch (error) {
    throw new Error('Failed to fetch estimates data')
  }
}

export async function getEstimateDataByIdForFullPage(
  id: string,
): Promise<EstimateTableRow> {
  try {
    const data = (await db.query.estimates.findFirst({
      with: {
        client: { columns: { clientNickName: true } },
        contact: {
          extras: {
            contactFullName:
              //Last name is nullable, so we need to use COALESCE to handle null values
              sql`TRIM(${contacts.contactFirstName} || ' ' || COALESCE(${contacts.contactLastName}, ''))`.as(
                'full_name',
              ),
          },
          columns: {
            contactFirstName: true,
            contactLastName: true,
            contactEmail: true,
            contactMobile: true,
            contactDesignation: true,
            isActive: true,
          },
        },
        productType: { columns: { productsTypeName: true } },
        product: { columns: { productName: true } },
      },

      where: (estimate, { eq }) => eq(estimate.uuid, id),
    })) as EstimateTableRow
    return data
  } catch (error) {
    throw new Error('Failed to fetch estimate data')
  }
}

export async function getEstimateById(id: string) {
  try {
    const data = await db.query.estimates.findFirst({
      where: (estimate, { eq }) => eq(estimate.uuid, id),
    })
    return data
  } catch (error) {
    throw new Error('Failed to fetch estimate data')
  }
}
