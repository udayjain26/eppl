'use server'

import { BoardCostData } from '@/app/estimates/[id]/_components/calculation-components/board-calculation'
import { VariationData } from '@/server/variations/types'

export async function calculateBoardCost(
  variationData: VariationData,
  hardcoverLength: number,
  hardcoverWidth: number,
  spineWidth: number,
): Promise<BoardCostData | undefined> {
  console.log('Calculating board cost')
  console.log('Variation data:', variationData)
  console.log('Hardcover length:', hardcoverLength)
  console.log('Hardcover width:', hardcoverWidth)
  console.log('Spine width:', spineWidth)
  return
}
