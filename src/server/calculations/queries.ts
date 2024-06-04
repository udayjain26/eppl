'use server'

import { db } from '../db'
import { VariationCalculationData } from './types'

export async function getVariationCalculation(
  variationUuid: string,
): Promise<VariationCalculationData> {
  const data = (await db.query.variationCalculation.findFirst({
    where: (variationCalculation, { eq }) =>
      eq(variationCalculation.variationUuid, variationUuid),
  })) as VariationCalculationData

  return data
}
