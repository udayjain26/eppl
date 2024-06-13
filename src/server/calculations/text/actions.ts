'use server'

import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import { laminations } from '@/app/settings/constants'
import { PaperData } from '@/server/paper/types'
import { VariationData } from '@/server/variations/types'
import { text } from 'stream/consumers'

// export type PrintingSets = {
//   totalSetsFB: number
//   totalSheetsFB: number
//   totalSetsWTHalf: number
//   totalSheetsWTHalf: number
//   totalSetsWTQuarter: number
//   totalSheetsWTQuarter: number
// }

export type PrintingForms = {
  totalFormsFB: number
  totalForms2Ups: number
  totalForms4Ups: number
  TotalForms8Ups: number
}

export async function calculateTextCost(
  variationData?: VariationData,
  paperData?: PaperData,
  effectiveTextLength?: number,
  effectiveTextWidth?: number,
  grippers?: number,
  textWorkingLength?: number,
  textWorkingWidth?: number,
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
    !textWorkingLength ||
    !textWorkingWidth ||
    !variationData.textColors
  ) {
    return undefined
  }
  const textPagesPerSheet = calculatePagesPerSheet(
    // paperData,
    textWorkingLength,
    textWorkingWidth,
    effectiveTextLength,
    effectiveTextWidth,
    grippers,
  )

  if (!textPagesPerSheet) {
    return undefined
  }

  const textColors = variationData.textColors

  const textForms = calculateTextForms(
    variationData.textPages,
    textPagesPerSheet,
  )

  const totalSetsUsed = calculateTotalSets(textForms)

  const paperAreaUsed = Number(
    (
      ((effectiveTextLength * effectiveTextWidth * textPagesPerSheet) /
        4 /
        (textWorkingLength * textWorkingWidth)) *
      100
    ).toFixed(2),
  )

  const textCostDataDict = variationData.variationQtysRates.map((o) => {
    const jobQuantity = o.quantity
    const calculatedSheets = calculateSheets(jobQuantity, textForms)
    const wastageSheets = getWastageSheets(
      jobQuantity,
      wastageFactor,
      totalSetsUsed,
      textColors,
    )
    const totalSheets = calculatedSheets + wastageSheets
    const paperWeight = calculatePaperWeight(
      totalSheets,
      textWorkingLength,
      textWorkingWidth,
      paperData.paperGrammage,
    )
    const paperCost = paperWeight * paperCostPerKg
    const plateCost = totalSetsUsed * textPlateRate * textColors
    const printingCost = calculatePrintingCost(
      totalSetsUsed,
      textColors,
      totalSheets,
    )
    const laminationCost = calculateLaminationCost(
      variationData,
      jobQuantity,
      textWorkingLength,
      textWorkingWidth,
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
    textUpsPerSheet: textPagesPerSheet,
    textForms: textForms,
    totalSets: totalSetsUsed,
    paperAreaUsed: paperAreaUsed,
    textCostDataDict: textCostDataDict,
  }
}

function calculateLaminationCost(
  variationData: VariationData,
  qtySheets: number,
  textWorkingLength: number,
  textWorkingWidth: number,
) {
  const paperLengthInmm = textWorkingLength
  const paperWidthInmm = textWorkingWidth
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
  totalSetsUsed: number,
  textColors: number,
  totalSheets: number,
) {
  return 0
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
  textColors: number,
) {
  // if (textColors === 1) {
  //   if (jobQuantity <= 0) {
  //     return 0
  //   } else if (jobQuantity <= 2100) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 75 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 50 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 25
  //     )
  //   } else if (jobQuantity <= 4200) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 100 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 75 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 50
  //     )
  //   } else if (jobQuantity <= 8400) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 125 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 100 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 75
  //     )
  //   } else {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * jobQuantity * 0.015 +
  //       ((totalSetsUsed.totalSetsWTHalf * wastageFactor * jobQuantity) / 2) *
  //         0.015 +
  //       ((totalSetsUsed.totalSetsWTQuarter * wastageFactor * jobQuantity) / 4) *
  //         0.015
  //     )
  //   }
  // } else {
  //   if (jobQuantity <= 0) {
  //     return 0
  //   } else if (jobQuantity <= 2100) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 75 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 50 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 25
  //     )
  //   } else if (jobQuantity <= 4200) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 100 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 75 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 50
  //     )
  //   } else if (jobQuantity <= 8400) {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * 125 +
  //       totalSetsUsed.totalSetsWTHalf * wastageFactor * 100 +
  //       totalSetsUsed.totalSetsWTQuarter * wastageFactor * 75
  //     )
  //   } else {
  //     return (
  //       totalSetsUsed.totalSetsFB * wastageFactor * jobQuantity * 0.0175 +
  //       ((totalSetsUsed.totalSetsWTHalf * wastageFactor * jobQuantity) / 2) *
  //         0.0175 +
  //       ((totalSetsUsed.totalSetsWTQuarter * wastageFactor * jobQuantity) / 4) *
  //         0.0175
  //     )
  //   }
  // }
  return 0
}

function calculateSheets(
  jobQuantity: number,
  textForms: PrintingForms,
  // totalSetsUsed: number,
) {
  const totalSheetsFB = textForms.totalFormsFB * jobQuantity
  const totalSheets2Ups = (textForms.totalForms2Ups * jobQuantity) / 2
  const totalSheets4Ups = (textForms.totalForms4Ups * jobQuantity) / 4
  const totalSheets8Ups = (textForms.TotalForms8Ups * jobQuantity) / 8

  return totalSheetsFB + totalSheets2Ups + totalSheets4Ups + totalSheets8Ups
}

function calculateTotalSets(textForms: PrintingForms) {
  // Calculate the number of complete forms
  let totalSetsFB = textForms.totalFormsFB * 2

  let totalSetsWT2Ups = textForms.totalForms2Ups
  let totalSetsWT4Ups = textForms.totalForms4Ups
  let totalSetsWT8Ups = textForms.TotalForms8Ups

  return totalSetsFB + totalSetsWT2Ups + totalSetsWT4Ups + totalSetsWT8Ups
}

function calculateTextForms(
  textPages: number,
  textPagesPerSheet: number,
): PrintingForms {
  // // Calculate the number of forms required
  const textForms = textPages / textPagesPerSheet
  console.log('textForms', textForms)
  // return textForms

  // Calculate the number of complete forms
  const completeForms = Math.floor(textForms)
  let totalFormsFB = completeForms
  let totalForms2Ups = 0
  let totalForms4Ups = 0
  let TotalForms8Ups = 0

  // Calculate the remaining fractional part
  const remainingFraction = textForms - completeForms

  // Determine additional forms based on the remaining fraction
  if (remainingFraction > 0) {
    if (remainingFraction > 0.75) {
      totalForms2Ups += 1 // For 0.75 < fraction <= 1.0
      totalForms4Ups += 1
      TotalForms8Ups += 1
    } else if (remainingFraction > 0.5) {
      totalForms2Ups += 1 // For exactly 0.5, add 1 form
      totalForms4Ups += 1
    } else {
      totalForms2Ups += 1 // For 0 < fraction < 0.5, add 1 form
    }
  }

  console.log('totalFormsFB', totalFormsFB)
  console.log('totalForms2Ups', totalForms2Ups)
  console.log('totalForms4Ups', totalForms4Ups)
  console.log('TotalForms8Ups', TotalForms8Ups)

  return {
    totalFormsFB,
    totalForms2Ups,
    totalForms4Ups,
    TotalForms8Ups,
  } as PrintingForms
}

function calculatePagesPerSheet(
  // paperData: PaperData,
  textWorkingLength: number,
  textWorkingWidth: number,
  effectiveTextLength: number,
  effectiveTextWidth: number,
  grippers: number,
) {
  const paperLength = textWorkingLength - (grippers || 0)
  const paperWidth = textWorkingWidth
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
