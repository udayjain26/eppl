'use server'

import { db } from '../db'
import { VariationData } from './types'

export async function getEstimateVariationsData(
  estimateUuid: string,
): Promise<VariationData[]> {
  const data = (
    await db.query.variations.findMany({
      where: (variation, { eq }) => eq(variation.estimateUuid, estimateUuid),
      with: { variationQtysRates: true },
      orderBy: (variation, { desc }) => [desc(variation.createdAt)],
    })
  ).map((row) => ({
    ...row,
    variationQtysRates: row.variationQtysRates.map((rate) => ({
      ...rate,
      quantity: parseInt(rate.quantity.toString()),
      rate: parseFloat(rate.rate.toString()),
    })),
  })) as VariationData[]
  return data
}
