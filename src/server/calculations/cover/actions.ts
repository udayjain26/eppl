'use server'

import { CoverCostData } from '@/app/estimates/[id]/_components/calculation-components/cover-calculation'
import { PaperData } from '../../paper/types'
import { VariationData } from '../../variations/types'
import { laminations } from '@/app/settings/constants'
import { FormsSheetsDictType, PrintingForms } from '../text/actions'
import { printingRateCard } from '@/app/settings/printing-constants'
import { pages } from 'next/dist/build/templates/app-page'

export async function calculateCoverCost(
  variationData?: VariationData,
  paperData?: PaperData,
  effectiveCoverLength?: number,
  effectiveCoverWidth?: number,
  grippers?: number,
  coverWorkingLength?: number,
  coverWorkingWidth?: number,
  paperCostPerKg?: number,
  wastageFactor?: number,
  coverPlateRate?: number,
  plateSize?: string,
  printingRateFactor?: number,
  coverPrintingType?: string,
): Promise<CoverCostData | undefined> {
  if (
    !variationData ||
    !paperData ||
    !effectiveCoverLength ||
    !effectiveCoverWidth ||
    !paperCostPerKg ||
    !wastageFactor ||
    !coverPlateRate ||
    !coverPrintingType ||
    !grippers ||
    !variationData.coverPages ||
    !coverWorkingLength ||
    !coverWorkingWidth ||
    !plateSize ||
    !printingRateFactor
  ) {
    return undefined
  } else {
    const pagesPerCover = variationData.coverPages
    const coverPagesPerSheet = calculatePagesPerSheet(
      coverWorkingLength,
      coverWorkingWidth,
      effectiveCoverLength,
      effectiveCoverWidth,
      grippers,
      pagesPerCover,
    )

    if (!coverPagesPerSheet) {
      return undefined
    }

    const coverFrontColors = variationData.coverFrontColors || 0
    const coverBackColors = variationData.coverBackColors || 0

    const coverForms = calculateCoverForms(
      variationData.coverPages,
      coverPagesPerSheet,
      coverPrintingType,
    )

    const totalSetsUsed = calculateTotalSets(coverForms, coverPrintingType)

    const coverPiecesPerSheets = coverPagesPerSheet / variationData.coverPages
    const paperAreaUsed = Number(
      (
        ((effectiveCoverLength * effectiveCoverWidth * coverPagesPerSheet) /
          variationData.coverPages /
          (coverWorkingLength * coverWorkingWidth)) *
        100
      ).toFixed(2),
    )

    const coverCostDataDict = variationData.variationQtysRates.map((o) => {
      const jobQuantity = o.quantity

      const { calculatedSheets, formsSheetsDict } = calculateSheets(
        jobQuantity,
        coverForms,
        coverPrintingType,
        coverPiecesPerSheets,
      )
      const { totalWastageSheets } = getWastageSheets(
        wastageFactor,
        formsSheetsDict,
        coverFrontColors,
        coverBackColors,
      )
      const totalSheets = calculatedSheets + totalWastageSheets
      const paperWeight = calculatePaperWeight(
        totalSheets,
        coverWorkingLength,
        coverWorkingWidth,
        paperData.paperGrammage,
      )
      const paperCost = paperWeight * paperCostPerKg
      const plateCost = calculatePlatesCost(
        formsSheetsDict,
        coverPlateRate,
        coverFrontColors,
        coverBackColors,
      )
      const printingCost = calculatePrintingCost(
        formsSheetsDict,
        coverFrontColors,
        coverBackColors,
        totalSetsUsed,
        plateSize,
        variationData,
        printingRateFactor,
      )

      const laminationCost = calculateLaminationCost(
        variationData,
        totalSheets,
        coverWorkingLength,
        coverWorkingWidth,
      )

      const totalCost = paperCost + plateCost + printingCost + laminationCost

      const costPerCover = totalCost / jobQuantity
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
        costPerCover: Number(costPerCover.toFixed(2)),
      }
    })

    return {
      coverPiecesPerSheet: coverPiecesPerSheets,
      pagesPerSheet: coverPagesPerSheet,
      coverForms: coverForms,
      totalSets: totalSetsUsed,
      paperAreaUsed: paperAreaUsed,
      coverSheetLength: coverWorkingLength,
      coverSheetWidth: coverWorkingWidth,
      coverCostDataDict: coverCostDataDict,
    }
  }
}

function calculatePagesPerSheet(
  coverWorkingLength: number,
  coverWorkingWidth: number,
  effectiveCoverLength: number,
  effectiveCoverWidth: number,
  grippers: number,
  pagesPerCover: number,
) {
  const paperLength = coverWorkingLength - (grippers || 0)
  const paperWidth = coverWorkingWidth
  const coverLength = effectiveCoverLength
  const coverWidth = effectiveCoverWidth

  if (!coverLength || !coverWidth || paperLength <= 0 || paperWidth <= 0) {
    return undefined
  }

  // Calculate the number of pieces that fit without rotation
  const numPiecesLengthwise = Math.floor(paperLength / coverLength)
  const numPiecesWidthwise = Math.floor(paperWidth / coverWidth)

  // Calculate the number of pieces that fit with rotation
  const numPiecesLengthwiseRotated = Math.floor(paperLength / coverWidth)
  const numPiecesWidthwiseRotated = Math.floor(paperWidth / coverLength)

  // Calculate the total number of pieces for each orientation
  const totalPiecesWithoutRotation = numPiecesLengthwise * numPiecesWidthwise
  const totalPiecesWithRotation =
    numPiecesLengthwiseRotated * numPiecesWidthwiseRotated

  if (totalPiecesWithoutRotation >= totalPiecesWithRotation) {
    return totalPiecesWithoutRotation * pagesPerCover
  } else {
    return totalPiecesWithRotation * pagesPerCover
  }
}

function calculateCoverForms(
  coverPages: number,
  coverPagesPerSheet: number,
  coverPrintingType: string,
): PrintingForms {
  if (coverPrintingType === 'singleSide' || coverPrintingType === 'frontBack') {
    return {
      totalFormsFB: 1,
      totalForms2Ups: 0,
      totalForms4Ups: 0,
      totalForms8Ups: 0,
    } as PrintingForms
  } else {
    const coverForms = coverPages / coverPagesPerSheet

    // Calculate the number of complete forms
    const completeForms = Math.floor(coverForms)
    let totalFormsFB = completeForms
    let totalForms2Ups = 0
    let totalForms4Ups = 0
    let totalForms8Ups = 0

    // Calculate the remaining fractional part
    const remainingFraction = coverForms - completeForms

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

    // return coverForms
  }
}

function calculateTotalSets(
  coverForms: PrintingForms,
  coverPrintingType: string,
) {
  // Calculate the number of complete forms
  if (coverPrintingType === 'frontBack') {
    return coverForms.totalFormsFB * 2
  } else if (coverPrintingType === 'singleSide') {
    return coverForms.totalFormsFB
  } else {
    let totalSetsFB = coverForms.totalFormsFB * 2

    let totalSetsWT2Ups = coverForms.totalForms2Ups
    let totalSetsWT4Ups = coverForms.totalForms4Ups
    let totalSetsWT8Ups = coverForms.totalForms8Ups

    return totalSetsFB + totalSetsWT2Ups + totalSetsWT4Ups + totalSetsWT8Ups
  }
}

function calculateSheets(
  jobQuantity: number,
  coverForms: PrintingForms,
  coverPrintingType: string,
  coverPiecesPerSheets: number,
) {
  const totalSheetsFB =
    (jobQuantity / coverPiecesPerSheets) * coverForms.totalFormsFB
  const totalSheets2Ups =
    (jobQuantity / coverPiecesPerSheets) * coverForms.totalForms2Ups
  const totalSheets4Ups =
    (jobQuantity / coverPiecesPerSheets) * coverForms.totalForms4Ups
  const totalSheets8Ups =
    (jobQuantity / coverPiecesPerSheets) * coverForms.totalForms8Ups
  const totalFormsFB = coverForms.totalFormsFB
  const totalForms2Ups = coverForms.totalForms2Ups
  const totalForms4Ups = coverForms.totalForms4Ups
  const TotalForms8Ups = coverForms.totalForms8Ups
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

function getWastageSheets(
  wastageFactor: number,
  formsSheetsDict: FormsSheetsDictType,
  coverFrontColors: number,
  coverBackColors: number,
) {
  let totalWastageSheets = 0
  const totalColors = coverFrontColors + coverBackColors

  const colorsFactor =
    totalColors === 4
      ? 0.04
      : totalColors === 5
        ? 0.05
        : totalColors === 6
          ? 0.06
          : totalColors === 7
            ? 0.07
            : 0.08

  const colorsFactorFixed = totalColors > 4 ? 2 : 1

  for (const [key, value] of Object.entries(formsSheetsDict)) {
    const forms = value.formsQty
    const sheets = value.sheetsQty
    let wastage = 0
    if (key === 'totalFormsFB') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 150 * colorsFactorFixed
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 200 * colorsFactorFixed
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 300 * colorsFactorFixed
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'totalForms2Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 125 * colorsFactorFixed
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 175 * colorsFactorFixed
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 250 * colorsFactorFixed
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'totalForms4Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 100 * colorsFactorFixed
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 125 * colorsFactorFixed
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 200 * colorsFactorFixed
      } else {
        wastage = forms * wastageFactor * sheets * colorsFactor
      }
    }
    if (key === 'TotalForms8Ups') {
      if (sheets <= 2100) {
        wastage = forms * wastageFactor * 75 * colorsFactorFixed
      } else if (sheets <= 4200) {
        wastage = forms * wastageFactor * 125 * colorsFactorFixed
      } else if (sheets <= 8400) {
        wastage = forms * wastageFactor * 200 * colorsFactorFixed
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

function calculatePlatesCost(
  formsSheetsDict: FormsSheetsDictType,
  coverPlateRate: number,
  coverFrontColors: number,
  coverBackColors: number,
) {
  let totalPlatesCost = 0
  Object.entries(formsSheetsDict).forEach(([key, value]) => {
    const forms = value.formsQty
    const sheets = value.sheetsQty
    let plates = 0
    if (key === 'totalFormsFB' && sheets > 0) {
      plates = coverFrontColors + coverBackColors
    } else if (key === 'totalForms2Ups' && sheets > 0) {
      plates = coverFrontColors
    } else if (key === 'totalForms4Ups' && sheets > 0) {
      plates = coverFrontColors
    } else if (key === 'TotalForms8Ups' && sheets > 0) {
      plates = coverFrontColors
    }

    const plateCost = plates * coverPlateRate

    totalPlatesCost += plateCost
  })

  return totalPlatesCost
}

function calculatePrintingCost(
  formsSheetsDataDict: FormsSheetsDictType,
  coverFrontColors: number,
  coverBackColors: number,
  coverSets: number,
  plateSize: string,
  variationData: VariationData,
  printingRateFactor: number,
  coverPrintingType?: string,
) {
  const paper_type =
    variationData.coverPaperType === 'Maplitho A Grade'
      ? 'Maplitho'
      : variationData.coverPaperType === 'Maplitho B Grade'
        ? 'Maplitho'
        : variationData.coverPaperType === 'Maplitho C Grade'
          ? 'Maplitho'
          : variationData.coverPaperType === 'Special Fine Paper'
            ? 'FinePaper'
            : variationData.coverPaperType === 'Art Card'
              ? 'ArtCard'
              : variationData.coverPaperType === 'Art Paper'
                ? 'ArtPaper'
                : 'Standard Paper'
  const costCentre = plateSize === 'Small' ? 'Small Machine' : 'Large Machine'
  const sets = coverSets <= 5 ? 'lt5' : 'gt5'
  let totalPrintingCost = 0

  Object.entries(formsSheetsDataDict).forEach(([key, value]) => {
    let printingCost = 0
    const formsQty = value.formsQty
    const printingSets = key === 'totalFormsFB' ? 2 : 1
    const coverColors =
      coverFrontColors > coverBackColors ? coverFrontColors : coverBackColors

    const printingSheets =
      key === 'totalFormsFB' ? value.sheetsQty : value.sheetsQty * 2

    let printingSheetsCharge = 0
    let ceilingPrintingSheets = 0

    if (printingSheets === 0) {
      ceilingPrintingSheets = 0
      //THis is 1200 just so the rate card can be found, and the rate doesnt become undefined.
      printingSheetsCharge = 1200
    } else if (printingSheets <= 1200) {
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

    if (paper_type === 'Maplitho') {
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
        coverColors *
        printingRateFactor *
        formsQty *
        printingSets *
        ceilingPrintingSheets) /
      1000

    totalPrintingCost += printingCost
  })

  return totalPrintingCost
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
    (lam) => lam.label === variationData.coverLamination,
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
