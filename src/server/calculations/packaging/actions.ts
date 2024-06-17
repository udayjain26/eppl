'use server'

import { CoverCostData } from '@/app/estimates/[id]/_components/calculation-components/cover-calculation'

import {
  PackagingCostData,
  PackagingCostDataDict,
} from '@/app/estimates/[id]/_components/calculation-components/packaging-calculation'
import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import { packagingTypes } from '@/app/settings/constants'

import { VariationData } from '@/server/variations/types'

export async function calculatePackagingCost(
  variationData: VariationData,
  textCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): Promise<PackagingCostData> {
  if (textCostDataTable === undefined || coverCostDataTable === undefined) {
    return undefined
  }

  const packagingCostDataDict = calculatePackagingCostDict(
    variationData,
    textCostDataTable,
    coverCostDataTable,
  )

  return {
    packagingCostDataDict: packagingCostDataDict,
  }

  return undefined
}

function calculatePackagingCostDict(
  variationData: VariationData,
  textCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): PackagingCostDataDict[] {
  const data = variationData.variationQtysRates.map((o) => {
    let totalCost: number = 0

    const jobQuantity = o.quantity
    let totalTextKgs = textCostDataTable.textCostDataDict.find(
      (row) => row.jobQuantity === jobQuantity,
    )?.paperWeight

    let totalCoverKgs = coverCostDataTable.coverCostDataDict.find(
      (row) => row.jobQuantity === jobQuantity,
    )?.paperWeight

    const totalJobKgs = (totalTextKgs || 0) + (totalCoverKgs || 0)

    if (variationData.packagingType === 'Standard') {
      const ratePerKg = packagingTypes.find(
        (row) => row.label === 'Standard',
      )?.rate

      let standardPackagingCharges = totalJobKgs * (ratePerKg || 0)

      totalCost += standardPackagingCharges
    } else if (variationData.packagingType === 'New Cartons') {
      const ratePerKg = packagingTypes.find(
        (row) => row.label === 'New Cartons',
      )?.rate

      let newCartonsCost = totalJobKgs * (ratePerKg || 0)

      totalCost += newCartonsCost
    } else if (variationData.packagingType === 'Shrink Wrap Induvidual') {
      const ratePerPiece = packagingTypes.find(
        (row) => row.label === 'Shrink Wrap Induvidual',
      )?.rate

      let shrinkWrapCost = (ratePerPiece || 0) * jobQuantity

      totalCost += shrinkWrapCost
    }

    const costPerPiece = totalCost / jobQuantity

    return {
      jobQuantity: Number(jobQuantity.toFixed(2)),
      totalKgs: Number(totalJobKgs.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      costPerPiece: Number(costPerPiece.toFixed(2)),
    }
  })
  return data
}
