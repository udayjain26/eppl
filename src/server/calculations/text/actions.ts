'use server'

import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import { laminations } from '@/app/settings/constants'
import { printingRateCard } from '@/app/settings/printing-constants'
import { PaperData } from '@/server/paper/types'
import { VariationData } from '@/server/variations/types'
import { text } from 'stream/consumers'

export type FormsSheetsDictType = {
  totalFormsFB: {
    formsQty: number
    sheetsQty: number
    wastageSheets?: number
    printingCost?: number
  }
  totalForms2Ups: {
    formsQty: number
    sheetsQty: number
    wastageSheets?: number
    printingCost?: number
  }
  totalForms4Ups: {
    formsQty: number
    sheetsQty: number
    wastageSheets?: number
    printingCost?: number
  }
  TotalForms8Ups: {
    formsQty: number
    sheetsQty: number
    wastageSheets?: number
    printingCost?: number
  }
}

export type PrintingForms = {
  totalFormsFB: number
  totalForms2Ups: number
  totalForms4Ups: number
  totalForms8Ups: number
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
  plateSize?: string,
  printingRateFactor?: number,
  textType?: string,
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
    !textWorkingLength ||
    !textWorkingWidth ||
    !variationData.textColors ||
    !plateSize ||
    !printingRateFactor ||
    !textType
  ) {
    return undefined
  }

  let textPages = 0
  let textCols = 0
  let textGrammage = 0
  if (textType === 'secondaryText') {
    textGrammage = variationData.secondaryTextGrammage ?? 0
    textPages = variationData.secondaryTextPages ?? 0
    textCols = variationData.secondaryTextColors ?? 0
  } else {
    textGrammage = variationData.textGrammage ?? 0
    textPages = variationData.textPages ?? 0
    textCols = variationData.textColors ?? 0
  }

  const textPagesPerSheet = calculatePagesPerSheet(
    textWorkingLength,
    textWorkingWidth,
    effectiveTextLength,
    effectiveTextWidth,
    grippers,
  )

  if (!textPagesPerSheet) {
    return undefined
  }

  const textColors = textCols || 0

  const textForms = calculateTextForms(textPages, textPagesPerSheet)

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
    const { calculatedSheets, formsSheetsDict } = calculateSheets(
      jobQuantity,
      textForms,
    )
    const { totalWastageSheets } = getWastageSheets(
      wastageFactor,
      formsSheetsDict,
      textColors,
    )

    const totalSheets = calculatedSheets + totalWastageSheets
    const paperWeight = calculatePaperWeight(
      totalSheets,
      textWorkingLength,
      textWorkingWidth,
      paperData.paperGrammage,
    )
    const paperCost = paperWeight * paperCostPerKg
    const plateCost = totalSetsUsed * textPlateRate * textColors
    const printingCost = calculatePrintingCost(
      formsSheetsDict,
      textColors,
      totalSetsUsed,
      plateSize,
      variationData,
      printingRateFactor,
    )
    const laminationCost = calculateLaminationCost(
      variationData,
      totalSheets,
      textWorkingLength,
      textWorkingWidth,
    )

    const totalCost = paperCost + plateCost + printingCost + laminationCost

    const costPerText = totalCost / jobQuantity
    return {
      jobQuantity: jobQuantity,
      calculatedSheets: Number(calculatedSheets.toFixed(0)),
      wastageSheets: Number(totalWastageSheets.toFixed(0)),
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
    pagesPerSheet: textPagesPerSheet,
    textForms: textForms,
    totalSets: totalSetsUsed,
    paperAreaUsed: paperAreaUsed,
    textWorkingLength: textWorkingLength,
    textWorkingWidth: textWorkingWidth,
    textCostDataDict: textCostDataDict,
  }
}

function calculateLaminationCost(
  variationData: VariationData,
  totalSheets: number,
  textWorkingLength: number,
  textWorkingWidth: number,
) {
  const paperLengthInM = textWorkingLength / 1000
  const paperWidthInM = textWorkingWidth / 1000
  const laminationRate = laminations.find(
    (lam) => lam.label === variationData.textLamination,
  )?.rate!

  if (laminationRate !== 0) {
    const laminationCost = (
      paperLengthInM *
      paperWidthInM *
      totalSheets *
      laminationRate
    ).toFixed(2)
    return Number(laminationCost)
  } else {
    return 0
  }
}

function calculatePrintingCost(
  formsSheetsDataDict: FormsSheetsDictType,
  textColors: number,
  textSets: number,
  plateSize: string,
  variationData: VariationData,
  printingRateFactor: number,
) {
  const paper_type =
    variationData.textPaperType === 'Maplitho A Grade'
      ? 'Maplitho'
      : variationData.textPaperType === 'Maplitho B Grade'
        ? 'Maplitho'
        : variationData.textPaperType === 'Maplitho C Grade'
          ? 'Maplitho'
          : variationData.textPaperType === 'Special Fine Paper'
            ? 'FinePaper'
            : variationData.textPaperType === 'Art Card'
              ? 'ArtCard'
              : variationData.textPaperType === 'Art Paper'
                ? 'ArtPaper'
                : 'Standard Paper'
  const costCentre = plateSize === 'Small' ? 'Small Machine' : 'Large Machine'
  const sets = textSets <= 5 ? 'lt5' : 'gt5'
  let totalPrintingCost = 0

  Object.entries(formsSheetsDataDict).forEach(([key, value]) => {
    let printingCost = 0
    const formsQty = value.formsQty
    const printingSets = key === 'totalFormsFB' ? 2 : 1
    const printingSheets =
      key === 'totalFormsFB' ? value.sheetsQty : value.sheetsQty * 2

    let printingSheetsCharge = 0
    let ceilingPrintingSheets = 0

    if (printingSheets <= 1200) {
      printingSheetsCharge = 1200
      ceilingPrintingSheets = 1000
    } else if (printingSheets > 1200 && printingSheets <= 2200) {
      printingSheetsCharge = 2200
      ceilingPrintingSheets = 2000
    } else if (printingSheets > 2200 && printingSheets <= 3200) {
      printingSheetsCharge = 3200
      ceilingPrintingSheets = 3000
    } else if (printingSheets > 3200 && printingSheets <= 4200) {
      printingSheetsCharge = 4200
      ceilingPrintingSheets = 4000
    } else if (printingSheets > 4200 && printingSheets <= 5200) {
      printingSheetsCharge = 5200
      ceilingPrintingSheets = 5000
    } else if (printingSheets > 5200 && printingSheets <= 6200) {
      printingSheetsCharge = 6200
      ceilingPrintingSheets = 6000
    } else if (printingSheets > 6200) {
      printingSheetsCharge = 10200
      ceilingPrintingSheets = printingSheets
    }
    const rateCardRow = printingRateCard.find(
      (card) =>
        card.costCentre === costCentre &&
        card.sets === sets &&
        card.qtyOfSheets === printingSheetsCharge,
    )

    let printingRatePerColor = 0

    if (textColors === 1) {
      printingRatePerColor = rateCardRow?.SingleColor!
    } else if (paper_type === 'Maplitho') {
      printingRatePerColor = rateCardRow?.Maplitho!
    } else if (paper_type === 'ArtPaper') {
      printingRatePerColor = rateCardRow?.ArtPaper!
    } else if (paper_type === 'ArtCard') {
      printingRatePerColor = rateCardRow?.ArtCard!
    } else if (paper_type === 'FinePaper') {
      printingRatePerColor = rateCardRow?.FinePaper!
    } else {
      printingRatePerColor = rateCardRow?.price!
    }
    if (printingSheets === 0) {
      printingRatePerColor = 0
    }

    printingCost =
      (printingRatePerColor *
        textColors *
        printingRateFactor *
        formsQty *
        printingSets *
        ceilingPrintingSheets) /
      1000

    totalPrintingCost += printingCost
  })

  return totalPrintingCost
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
  wastageFactor: number,
  formsSheetsDict: FormsSheetsDictType,
  textColors: number,
) {
  let totalWastageSheets = 0

  const colorsFactor =
    textColors === 1
      ? 0.02
      : textColors === 2
        ? 0.025
        : textColors === 3
          ? 0.03
          : 0.04

  const colorsFactorWastage = textColors === 1 ? 1 : 2

  for (const [key, value] of Object.entries(formsSheetsDict)) {
    const forms = value.formsQty
    const sheets = value.sheetsQty
    let wastage = 0
    if (key === 'totalFormsFB') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 100 * colorsFactorWastage
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 150 * colorsFactorWastage
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 200 * colorsFactorWastage
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'totalForms2Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 75 * colorsFactorWastage
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 100 * colorsFactorWastage
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 125 * colorsFactorWastage
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'totalForms4Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 50 * colorsFactorWastage
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 75 * colorsFactorWastage
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 100 * colorsFactorWastage
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'TotalForms8Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 30 * colorsFactorWastage
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 60 * colorsFactorWastage
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 80 * colorsFactorWastage
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    formsSheetsDict[key as keyof FormsSheetsDictType].wastageSheets = wastage

    // Add to total wastage sheets
    totalWastageSheets += wastage
  }

  return { totalWastageSheets, formsSheetsDict }
}

function calculateSheets(
  jobQuantity: number,
  textForms: PrintingForms,
  // totalSetsUsed: number,
) {
  const totalSheetsFB = textForms.totalFormsFB * jobQuantity
  const totalSheets2Ups = (textForms.totalForms2Ups * jobQuantity) / 2
  const totalSheets4Ups = (textForms.totalForms4Ups * jobQuantity) / 4
  const totalSheets8Ups = (textForms.totalForms8Ups * jobQuantity) / 8

  const totalFormsFB = textForms.totalFormsFB
  const totalForms2Ups = textForms.totalForms2Ups
  const totalForms4Ups = textForms.totalForms4Ups
  const TotalForms8Ups = textForms.totalForms8Ups

  const totalSheets =
    totalSheetsFB + totalSheets2Ups + totalSheets4Ups + totalSheets8Ups
  const formsSheetsDict = {
    totalFormsFB: {
      formsQty: totalFormsFB,
      sheetsQty:
        totalSheetsFB / totalFormsFB ? totalSheetsFB / totalFormsFB : 0,
    },
    totalForms2Ups: {
      formsQty: totalForms2Ups,
      sheetsQty:
        totalSheets2Ups / totalForms2Ups ? totalSheets2Ups / totalForms2Ups : 0,
    },
    totalForms4Ups: {
      formsQty: totalForms4Ups,
      sheetsQty:
        totalSheets4Ups / totalForms4Ups ? totalSheets4Ups / totalForms4Ups : 0,
    },
    TotalForms8Ups: {
      formsQty: TotalForms8Ups,
      sheetsQty:
        totalSheets8Ups / TotalForms8Ups ? totalSheets8Ups / TotalForms8Ups : 0,
    },
  } as FormsSheetsDictType

  return { calculatedSheets: totalSheets, formsSheetsDict }
}

function calculateTotalSets(textForms: PrintingForms) {
  // Calculate the number of complete forms
  let totalSetsFB = textForms.totalFormsFB * 2

  let totalSetsWT2Ups = textForms.totalForms2Ups
  let totalSetsWT4Ups = textForms.totalForms4Ups
  let totalSetsWT8Ups = textForms.totalForms8Ups

  return totalSetsFB + totalSetsWT2Ups + totalSetsWT4Ups + totalSetsWT8Ups
}

function calculateTextForms(
  textPages: number,
  textPagesPerSheet: number,
): PrintingForms {
  // // Calculate the number of forms required
  const textForms = textPages / textPagesPerSheet
  // return textForms

  // Calculate the number of complete forms
  const completeForms = Math.floor(textForms)
  let totalFormsFB = completeForms
  let totalForms2Ups = 0
  let totalForms4Ups = 0
  let totalForms8Ups = 0

  // Calculate the remaining fractional part
  const remainingFraction = textForms - completeForms

  // Determine additional forms based on the remaining fraction
  if (remainingFraction > 0) {
    if (remainingFraction > 0.75) {
      totalForms2Ups += 1 // For 0.75 < fraction <= 1.0
      totalForms4Ups += 1
      totalForms8Ups += 1
    } else if (remainingFraction > 0.5) {
      totalForms2Ups += 1 // For exactly 0.5, add 1 form
      totalForms4Ups += 1
    } else {
      totalForms2Ups += 1 // For 0 < fraction < 0.5, add 1 form
    }
  }

  return {
    totalFormsFB,
    totalForms2Ups,
    totalForms4Ups,
    totalForms8Ups,
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
