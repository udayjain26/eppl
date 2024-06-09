'use server'

import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import { laminations } from '@/app/settings/constants'
import { PaperData } from '@/server/paper/types'
import { VariationData } from '@/server/variations/types'
import { text } from 'stream/consumers'

export async function calculateTextCost(
  variationData?: VariationData,
  paperData?: PaperData,
  effectiveTextLength?: number,
  effectiveTextWidth?: number,
  grippers?: number,
  paperCostPerKg?: number,
  wastageFactor?: number,
  textPlateRate?: number,
  textPrintingRate?: number,
): Promise<TextCostData | undefined> {
  if (
    !variationData ||
    !paperData ||
    !effectiveTextLength ||
    !effectiveTextWidth ||
    !grippers ||
    !wastageFactor ||
    !variationData.textPages ||
    !paperCostPerKg ||
    !textPlateRate ||
    !textPrintingRate ||
    !variationData.textColors
  ) {
    return undefined
  }
  const textUpsPerSheet = calculatePagesPerSheet(
    paperData,
    effectiveTextLength,
    effectiveTextWidth,
    grippers,
  )

  if (!textUpsPerSheet) {
    return undefined
  }
  const textColors = variationData.textColors

  const textForms = calculateTextForms(variationData.textPages, textUpsPerSheet)

  const totalSetsUsed = calculateTotalSets(textForms)

  const paperAreaUsed = Number(
    (
      ((effectiveTextLength * effectiveTextWidth * textUpsPerSheet) /
        4 /
        (paperData.paperLength * paperData.paperWidth)) *
      100
    ).toFixed(2),
  )

  const textCostDataDict = variationData.variationQtysRates.map((o) => {
    const jobQuantity = o.quantity
    const calculatedSheets = textForms * jobQuantity
    const wastageSheets = getWastageSheets(
      jobQuantity,
      wastageFactor,
      totalSetsUsed,
    )
    const totalSheets = calculatedSheets + wastageSheets
    const paperWeight = calculatePaperWeight(
      totalSheets,
      paperData.paperLength,
      paperData.paperWidth,
      paperData.paperGrammage,
    )
    const paperCost = paperWeight * paperCostPerKg
    const plateCost = totalSetsUsed * textPlateRate * textColors
    const printingCost = calculatePrintingCost(
      textPrintingRate,
      totalSetsUsed,
      jobQuantity,
      textColors,
      totalSheets,
    )
    const laminationCost = calculateLaminationCost(
      variationData,
      jobQuantity,
      paperData,
    )

    const totalCost = paperCost + plateCost + printingCost + laminationCost

    const costPerText = totalCost / jobQuantity
    return {
      jobQuantity: jobQuantity,
      calculatedSheets: Number(calculatedSheets.toFixed(0)),
      wastageSheets: Number(wastageSheets.toFixed(0)),
      totalSheets: Number(totalSheets.toFixed(0)),
      paperWeight: Number(paperWeight.toFixed(2)),
      paperCost: Number(paperCost.toFixed(2)),
      plateCost: Number(plateCost.toFixed(2)),
      printingCost: Number(printingCost.toFixed(2)),
      laminationCost: Number(laminationCost.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      costPerText: Number(costPerText.toFixed(2)),
    }
  })

  return {
    textUpsPerSheet: textUpsPerSheet,
    textForms: textForms,
    totalSets: totalSetsUsed,
    paperAreaUsed: paperAreaUsed,
    textCostDataDict: textCostDataDict,
  }
}

function calculateLaminationCost(
  variationData: VariationData,
  qtySheets: number,
  paperData: PaperData,
) {
  const paperLengthInmm = paperData.paperLength
  const paperWidthInmm = paperData.paperWidth
  const laminationRate = laminations.find(
    (lam) => lam.label === variationData.textLamination,
  )?.rate!

  if (laminationRate !== 0) {
    const laminationCost = (
      (paperLengthInmm * paperWidthInmm * qtySheets) /
      laminationRate /
      100
    ).toFixed(2)
    return Number(laminationCost)
  } else {
    return 0
  }
}

function calculatePrintingCost(
  textPrintingRate: number,
  totalSetsUsed: number,
  jobQuantity: number,
  textColors: number,
  totalSheets: number,
) {
  const minimumSheets = 2000 * totalSetsUsed
  const printingRate = textPrintingRate / 1000

  if (totalSheets <= minimumSheets) {
    return minimumSheets * printingRate * textColors
  } else {
    return totalSheets * printingRate * textColors
  }
}

function calculatePaperWeight(
  totalSheets: number,
  paperLength: number,
  paperWidth: number,
  paperGrammage: number,
) {
  const paperArea = (paperLength * paperWidth) / 1000000
  const paperWeight = paperArea * paperGrammage * totalSheets
  return paperWeight / 1000
}

function getWastageSheets(
  jobQuantity: number,
  wastageFactor: number,
  totalSetsUsed: number,
) {
  if (jobQuantity <= 0) {
    return 0
  } else if (jobQuantity <= 2100) {
    return totalSetsUsed * wastageFactor * 75
  } else if (jobQuantity <= 4200) {
    return totalSetsUsed * wastageFactor * 100
  } else if (jobQuantity <= 8400) {
    return totalSetsUsed * wastageFactor * 150
  } else {
    return totalSetsUsed * wastageFactor * jobQuantity * 0.025
  }
}
function calculateTotalSets(textForms: number): number {
  // Calculate the number of complete forms
  const completeForms = Math.floor(textForms)
  let totalSets = completeForms * 2

  // Calculate the remaining fractional part
  const remainingFraction = textForms - completeForms

  // Determine additional sets based on the remaining fraction
  if (remainingFraction > 0) {
    if (remainingFraction > 0.5) {
      totalSets += 2 // For 0.5 < fraction <= 1.0, add 2 sets
    } else if (remainingFraction === 0.5) {
      totalSets += 1 // For exactly 0.5, add 1 set
    } else {
      totalSets += 1 // For 0 < fraction < 0.5, add 1 set
    }
  }

  return totalSets
}
function calculateTextForms(textPages: number, textUpsPerSheet: number) {
  // Calculate the number of forms required
  const textForms = textPages / textUpsPerSheet
  return textForms
}

function calculatePagesPerSheet(
  paperData: PaperData,
  effectiveTextLength: number,
  effectiveTextWidth: number,
  grippers: number,
) {
  const paperLength = paperData.paperLength - (grippers || 0)
  const paperWidth = paperData.paperWidth
  const textLength = effectiveTextLength
  const textWidth = effectiveTextWidth

  if (!textLength || !textWidth || paperLength <= 0 || paperWidth <= 0) {
    return undefined
  }

  // Calculate the number of pieces that fit without rotation
  const numPiecesLengthwise = Math.floor(paperLength / textLength)
  const numPiecesWidthwise = Math.floor(paperWidth / textWidth)

  // Calculate the number of pieces that fit with rotation
  const numPiecesLengthwiseRotated = Math.floor(paperLength / textWidth)
  const numPiecesWidthwiseRotated = Math.floor(paperWidth / textLength)

  // Calculate the total number of pieces for each orientation
  const totalPiecesWithoutRotation = numPiecesLengthwise * numPiecesWidthwise
  const totalPiecesWithRotation =
    numPiecesLengthwiseRotated * numPiecesWidthwiseRotated

  if (totalPiecesWithoutRotation >= totalPiecesWithRotation) {
    return totalPiecesWithoutRotation * 4
  } else {
    return totalPiecesWithRotation * 4
  }
}
