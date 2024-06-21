'use server'

import { CoverCostData } from '@/app/estimates/[id]/_components/calculation-components/cover-calculation'
import {
  FabricationCostData,
  FabricationCostDataDict,
} from '@/app/estimates/[id]/_components/calculation-components/fabrication-calculation'
import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import {
  catalogBrochureBindingTypes,
  coatings,
  gummingTypes,
  paperbackBindingTypes,
  postpressProcesses,
  uvTypes,
  vdpTypes,
} from '@/app/settings/constants'
import { VariationData } from '@/server/variations/types'
import { get } from 'http'
import { Row } from 'react-day-picker'
import { text } from 'stream/consumers'

export async function calculateFabricationCost(
  variationData: VariationData,
  textCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): Promise<FabricationCostData> {
  let fabricationForms =
    textCostDataTable?.textForms.totalFormsFB +
    textCostDataTable?.textForms.totalForms2Ups / 2 +
    textCostDataTable?.textForms.totalForms4Ups / 4 +
    textCostDataTable?.textForms.totalForms8Ups / 8

  if (typeof textCostDataTable?.pagesPerSheet === 'number') {
    if (textCostDataTable?.pagesPerSheet > 16) {
      fabricationForms = fabricationForms * 2
    }
  }

  if (!fabricationForms) {
    fabricationForms = 0
  }

  const fabricationCostDataDict = getFabricationCostsDict(
    variationData,
    textCostDataTable,
    coverCostDataTable,
  )
  return {
    fabricationForms: fabricationForms,
    fabricationCostDataDict: fabricationCostDataDict,
  }

  return undefined
}

function getFabricationCostsDict(
  variationData: VariationData,
  textCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): FabricationCostDataDict[] {
  const data = variationData.variationQtysRates.map((o) => {
    const jobQuantity = o.quantity
    let coverTotalSheets = 0

    let textTotalSheets = textCostDataTable?.textCostDataDict.find(
      (row) => row.jobQuantity === jobQuantity,
    )?.totalSheets

    coverTotalSheets =
      coverCostDataTable?.coverCostDataDict.find(
        (row) => row.jobQuantity === jobQuantity,
      )?.totalSheets || 0

    let fabricationSheets: number
    if (textCostDataTable?.pagesPerSheet > 16) {
      fabricationSheets = (textTotalSheets || 0) * 2
    } else {
      fabricationSheets = textTotalSheets || 0
    }

    const coverWorkingLength = coverCostDataTable?.coverWorkingLength
    const coverWorkingWidth = coverCostDataTable?.coverWorkingWidth

    const textWorkingLength = textCostDataTable?.textWorkingLength
    const textWorkingWidth = textCostDataTable?.textWorkingWidth

    const foldingCost = getFoldingCost(textCostDataTable, fabricationSheets)
    const gatheringCost = getGatheringCost(fabricationSheets)

    let perfectBindingCost: number | undefined
    let sewnAndPerfect: number | undefined
    let sidePinAndPerfect: number | undefined
    let centrePin: number | undefined
    let coverUV: number | undefined
    let vdp: number | undefined
    let gumming: number | undefined
    let coverCoating: number | undefined
    let textCoating: number | undefined

    if (variationData.binding === 'Perfect') {
      const perfectCharges = paperbackBindingTypes.find(
        (row) => row.label === 'Perfect',
      )?.rate!
      perfectBindingCost = (perfectCharges * fabricationSheets) / 1000

      // Minimum cost per piece for perfect binding is 2 rupees
      if (perfectBindingCost / jobQuantity < 2) {
        perfectBindingCost = 2 * jobQuantity
      }
    } else if (variationData.binding === 'Sewn and Perfect') {
      const sewnAndPerfectCharges = paperbackBindingTypes.find(
        (row) => row.label === 'Sewn and Perfect',
      )?.rate!
      sewnAndPerfect = (sewnAndPerfectCharges * fabricationSheets) / 1000

      // Minimum cost per piece for sewn and perfect binding is 4 rupees

      if (sewnAndPerfect / jobQuantity < 4) {
        sewnAndPerfect = 4 * jobQuantity
      }
    } else if (variationData.binding === 'Side Pin and Perfect') {
      const sidePinAndPerfectCharges = paperbackBindingTypes.find(
        (row) => row.label === 'Side Pin and Perfect',
      )?.rate!
      sidePinAndPerfect = (sidePinAndPerfectCharges * fabricationSheets) / 1000

      // Minimum cost per piece for side pin and perfect binding is 2.25 rupees
      if (sidePinAndPerfect / jobQuantity < 2.25) {
        sidePinAndPerfect = 2.25 * jobQuantity
      }
    }

    //Use catalog brochure binding types need to make it so that it matches this condition
    else if (variationData.binding === 'Centre Pin') {
      const centrePinCharges = catalogBrochureBindingTypes.find(
        (row) => row.label === 'Centre Pin',
      )?.rate!
      centrePin = (centrePinCharges * fabricationSheets) / 1000
      if (centrePin / jobQuantity < 1) {
        centrePin = 1 * jobQuantity
      }
    }

    if (typeof variationData.coverUV === 'string') {
      let coverUVCharges: number
      let fixedCharges: number
      if (coverWorkingLength <= 508 && coverWorkingWidth <= 762) {
        coverUVCharges = uvTypes.find(
          (row) => row.label === variationData.coverUV,
        )?.smallSheetRate!

        fixedCharges = uvTypes.find(
          (row) => row.label === variationData.coverUV,
        )?.smallFixedCharge!
      } else {
        coverUVCharges = uvTypes.find(
          (row) => row.label === variationData.coverUV,
        )?.bigSheetRate!

        fixedCharges = uvTypes.find(
          (row) => row.label === variationData.coverUV,
        )?.bigFixedCharge!
      }

      if (coverUVCharges === undefined || fixedCharges === undefined) {
        coverUV = 0
        fixedCharges = 0
      }

      coverUV = coverUVCharges * coverTotalSheets + fixedCharges
    }

    if (typeof variationData.vdp === 'string') {
      const vdpCharges = vdpTypes.find(
        (row) => row.label === variationData.vdp,
      )?.rate!

      if (vdpCharges === undefined) {
        vdp = 0
      }

      vdp = vdpCharges * jobQuantity
    }

    if (typeof variationData.gummingType === 'string') {
      gumming = getGummingCost(jobQuantity, variationData)
    }

    if (typeof variationData.coverCoating === 'string') {
      coverCoating = getCoatingCost(
        coverTotalSheets,
        coverWorkingLength,
        coverWorkingWidth,
        variationData,
      )
    }

    if (typeof variationData.textCoating === 'string') {
      textCoating = getCoatingCost(
        textTotalSheets ? textTotalSheets : 0,
        textWorkingLength,
        textWorkingWidth,
        variationData,
      )
    }

    const totalCost =
      foldingCost +
      gatheringCost +
      (perfectBindingCost || 0) +
      (sewnAndPerfect || 0) +
      (sidePinAndPerfect || 0) +
      (centrePin || 0) +
      (coverUV || 0) +
      (coverCoating || 0) +
      (textCoating || 0) +
      (vdp || 0) +
      (gumming || 0)

    const costPerPiece = totalCost / jobQuantity

    return {
      jobQuantity: jobQuantity,
      fabricationSheets: fabricationSheets
        ? Number(fabricationSheets.toFixed(0))
        : undefined,
      foldingCost: foldingCost ? Number(foldingCost.toFixed(0)) : undefined,
      gatheringCost: gatheringCost
        ? Number(gatheringCost.toFixed(0))
        : undefined,
      perfectBindingCost: perfectBindingCost
        ? Number(perfectBindingCost.toFixed(0))
        : undefined,
      sewnAndPerfect: sewnAndPerfect
        ? Number(sewnAndPerfect.toFixed(0))
        : undefined,
      sidePinAndPerfect: sidePinAndPerfect
        ? Number(sidePinAndPerfect.toFixed(0))
        : undefined,
      coverCoating: coverCoating ? Number(coverCoating.toFixed(0)) : undefined,
      textCoating: textCoating ? Number(textCoating.toFixed(0)) : undefined,
      centrePin: centrePin ? Number(centrePin.toFixed(0)) : undefined,
      coverUV: coverUV ? Number(coverUV.toFixed(0)) : undefined,
      vdp: vdp ? Number(vdp.toFixed(0)) : undefined,
      gumming: gumming ? Number(gumming.toFixed(0)) : undefined,
      totalCost: Number(totalCost.toFixed(0)),
      costPerPiece: Number(costPerPiece.toFixed(2)),
    }
  })
  return data
}

function getFoldingCost(
  textCostDataTable: TextCostData,
  fabricationSheets: number,
) {
  let foldingCost = 0
  if (textCostDataTable?.pagesPerSheet >= 16) {
    foldingCost = postpressProcesses.find((row) => row.label === '3Fold')?.rate!
  } else if (textCostDataTable?.pagesPerSheet === 8) {
    foldingCost = postpressProcesses.find((row) => row.label === '2Fold')?.rate!
  } else if (textCostDataTable?.pagesPerSheet === 4) {
    foldingCost = postpressProcesses.find((row) => row.label === '1Fold')?.rate!
  } else {
    foldingCost = 0
  }

  const foldingCharges = (foldingCost * fabricationSheets) / 1000

  return foldingCharges
}

function getGatheringCost(fabricationSheets: number) {
  let gatheringCost: number
  gatheringCost = postpressProcesses.find(
    (row) => row.label === 'Gathering',
  )?.rate!

  const gatheringCharges = (gatheringCost * fabricationSheets) / 1000

  return gatheringCharges
}

function getGummingCost(qty: number, variationData: VariationData) {
  let gummingCost = 0

  let gummingCharges = gummingTypes.find(
    (row) => row.label === variationData.gummingType,
  )?.rate

  if (gummingCharges === undefined) {
    return 0
  }

  const posterWidthInInches = (variationData.openSizeWidth || 0) / 25.4

  const totalWidth = posterWidthInInches * qty

  gummingCost = (gummingCharges / 100) * totalWidth

  return gummingCost
}

function getCoatingCost(
  fabricationSheets: number,
  coverWorkingLength: number | undefined,
  coverWorkingWidth: number | undefined,
  variationData: VariationData,
) {
  let coatingCost = 0
  let coatingCharges = coatings.find(
    (row) => row.label === variationData.coverCoating,
  )?.rate
  if (coatingCharges === undefined) {
    return 0
  }
  const sheetLengthInM = coverWorkingLength ? coverWorkingLength / 1000 : 0
  const sheetWidthInM = coverWorkingWidth ? coverWorkingWidth / 1000 : 0
  coatingCost =
    coatingCharges * fabricationSheets * sheetLengthInM * sheetWidthInM
  return coatingCost
}
