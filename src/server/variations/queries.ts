'use server'

import { number } from 'zod'
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
    closeSizeLength: row.closeSizeLength
      ? parseFloat(row.closeSizeLength)
      : undefined,
    closeSizeWidth: row.closeSizeWidth
      ? parseFloat(row.closeSizeWidth)
      : undefined,
    openSizeLength: row.openSizeLength
      ? parseFloat(row.openSizeLength)
      : undefined,
    openSizeWidth: row.openSizeWidth
      ? parseFloat(row.openSizeWidth)
      : undefined,
    boardThickness: row.boardThickness
      ? parseFloat(row.boardThickness).toFixed(1)
      : undefined,
    variationQtysRates: row.variationQtysRates.map((rate) => ({
      ...rate,
      quantity: parseInt(rate.quantity),
      rate: parseFloat(rate.rate),
    })),
  })) as VariationData[]
  return data
}
