'use server'

import { eq } from 'drizzle-orm'
import { db } from '../db'

export async function getEstimateVariationsData(estimateUuid: string) {
  const data = await db.query.variations.findMany({
    where: (variation, { eq }) => eq(variation.estimateUuid, estimateUuid),
  })
  return data
}
