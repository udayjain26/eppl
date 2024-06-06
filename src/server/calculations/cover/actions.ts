'use server'

import { CoverCostData } from '@/app/estimates/[id]/_components/calculation-components/cover-calculation'
import { PaperData } from '../../paper/types'
import { VariationData } from '../../variations/types'
import { laminations } from '@/app/estimates/constants'

export async function calculateTotalCoverCostData(
  variationData?: VariationData,
  paperData?: PaperData,
  upsPerCoverPiece?: number,
  effectiveCoverLength?: number,
  effectiveCoverWidth?: number,
  grippers?: number,
  paperCostPerKg?: number,
  wastageFactor?: number,
  coverPlateRate?: number,
  coverPrintingRate?: number,
  coverPrintingType?: string,
): Promise<CoverCostData | undefined> {
  if (
    !variationData ||
    !paperData ||
    !upsPerCoverPiece ||
    !paperCostPerKg ||
    !wastageFactor ||
    !coverPlateRate ||
    !coverPrintingRate ||
    !coverPrintingType
  ) {
    return undefined
  } else {
    const {
      coverPiecesPerSheet,
      coverUpsPerSheet,
      piecesPositions,
      percentageSheetUsed,
    } = await calculateCoverSheetsAndUps(
      paperData,
      upsPerCoverPiece,
      effectiveCoverLength,
      effectiveCoverWidth,
      grippers,
    )

    const requiredSheetsData = await calculateRequiredSheets(
      variationData,
      coverUpsPerSheet,
      upsPerCoverPiece,
      wastageFactor,
    )

    const frontColors = variationData.coverFrontColors || 0
    const backColors = variationData.coverBackColors || 0

    const allCoverCostDetails = requiredSheetsData.map((qty) => {
      const paperLengthInM = paperData.paperLength / 1000
      const paperWidthInM = paperData.paperWidth / 1000
      const sheetWeightInKg =
        (paperLengthInM * paperWidthInM * paperData.paperGrammage) / 1000
      const weight = sheetWeightInKg * qty.totalRequiredSheets
      const paperCost = weight * paperCostPerKg
      const platesCost = calculatePlatesCost(
        coverPrintingType,
        frontColors,
        backColors,
        coverPlateRate,
      )

      const printingCost = calculatePrintingCost(
        qty.totalRequiredSheets,
        coverPrintingRate,
        coverPrintingType,
        frontColors,
        backColors,
      )

      const laminationCost = calculateLaminationCost(
        variationData,
        qty.totalRequiredSheets,
        paperData,
      )

      const totalCost = paperCost + platesCost + printingCost + laminationCost
      const costPerPiece = totalCost / qty.quantity

      return {
        quantity: qty.quantity,
        calculatedSheets: qty.requiredSheets,
        wastageSheets: qty.totalWastage,
        totalSheets: Number(qty.totalRequiredSheets.toFixed(0)),
        paperWeight: Number(weight.toFixed(3)),
        paperCost: Number(paperCost.toFixed(2)),
        platesCost: Number(platesCost.toFixed(2)),
        printingCost: Number(printingCost.toFixed(2)),
        laminationCost: Number(laminationCost.toFixed(2)),
        totalCost: Number(totalCost.toFixed(2)),
        costPerPiece: Number(costPerPiece.toFixed(2)),
      }
    })

    return {
      coverPiecesPerSheet,
      coverUpsPerSheet,
      piecesPositions,
      percentageSheetUsed,
      coverCostDataDict: allCoverCostDetails,
    }
  }
}

function calculatePlatesCost(
  coverPrintingType: string,
  frontColors: number,
  backColors: number,
  coverPlateRate: number,
) {
  if (coverPrintingType === 'frontBack') {
    return (frontColors + backColors) * coverPlateRate
  } else {
    return frontColors * coverPlateRate
  }
}

function calculatePrintingCost(
  totalRequiredSheets: number,
  coverPrintingRateThousand: number,
  coverPrintingType: string,
  frontColors: number,
  backColors: number,
) {
  const minimumSheets = 2000
  const coverPrintingRate = coverPrintingRateThousand / 1000

  if (coverPrintingType === 'frontBack') {
    const frontImpressions = totalRequiredSheets * frontColors

    const backImpressions = totalRequiredSheets * backColors

    const totalImpressions = frontImpressions + backImpressions

    if (totalRequiredSheets < minimumSheets) {
      return minimumSheets * (frontColors + backColors) * coverPrintingRate
    } else {
      return totalImpressions * coverPrintingRate
    }
  } else if (coverPrintingType === 'singleSide') {
    const totalImpressions = totalRequiredSheets * frontColors

    if (totalRequiredSheets < minimumSheets) {
      return minimumSheets * frontColors * coverPrintingRate
    } else {
      return totalImpressions * coverPrintingRate
    }
  } else {
    const totalImpressions = totalRequiredSheets * frontColors * 2

    if (totalRequiredSheets < minimumSheets / 2) {
      return minimumSheets * frontColors * coverPrintingRate
    } else {
      return totalImpressions * coverPrintingRate
    }
  }
}

function calculateLaminationCost(
  variationData: VariationData,
  qtySheets: number,
  paperData: PaperData,
) {
  const paperLengthInmm = paperData.paperLength / 10
  const paperWidthInmm = paperData.paperWidth / 10
  const laminationRate = laminations.find(
    (lam) => lam.label === variationData.coverLamination,
  )?.rate!

  if (laminationRate !== 0) {
    const laminationCost = (
      (paperLengthInmm * paperWidthInmm * qtySheets) /
      laminationRate
    ).toFixed(2)
    return Number(laminationCost)
  } else {
    return 0
  }
}

export async function calculateRequiredSheets(
  variationData: VariationData,
  upsPerSheet: number,
  upsPerCoverPiece: number,
  wastageFactor: number,
) {
  //get all qts from each qty object
  const allQtysData = variationData.variationQtysRates.map((o) => o)

  //calculate required covers for each qty and modify the object
  const data = allQtysData.map((o) => {
    const requiredCoversUps = o.quantity * upsPerCoverPiece
    const requiredSheets = requiredCoversUps / upsPerSheet
    const totalWastage = getWastageSheets(requiredSheets, wastageFactor)
    const totalSheets = requiredSheets + totalWastage

    return {
      quantity: o.quantity,
      requiredSheets: requiredSheets,
      totalWastage: totalWastage,
      totalRequiredSheets: totalSheets,
    }
  })
  return data
}

export async function calculateCoverSheetsAndUps(
  paperData: PaperData,
  upsPerCoverPiece: number,
  effectiveCoverLength?: number,
  effectiveCoverWidth?: number,
  grippers?: number,
): Promise<{
  coverPiecesPerSheet: number
  coverUpsPerSheet: number
  piecesPositions: PaperPiece[]
  percentageSheetUsed: number
}> {
  const paperLength = paperData.paperLength - (grippers || 0)
  const paperWidth = paperData.paperWidth
  const coverLength = effectiveCoverLength
  const coverWidth = effectiveCoverWidth

  if (!coverLength || !coverWidth || paperLength <= 0 || paperWidth <= 0) {
    return {
      coverPiecesPerSheet: 0,
      coverUpsPerSheet: 0,
      piecesPositions: [],
      percentageSheetUsed: 0,
    }
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

  // Determine the orientation that maximizes the number of pieces
  let coverPiecesPerSheet: number
  let coverUpsPerSheet: number
  let percentageSheetUsed: number
  let piecesPositions: PaperPiece[]

  if (totalPiecesWithoutRotation >= totalPiecesWithRotation) {
    coverPiecesPerSheet = totalPiecesWithoutRotation
    piecesPositions = calculatePiecePositions(
      coverLength,
      coverWidth,
      numPiecesLengthwise,
      numPiecesWidthwise,
      false,
    )
  } else {
    coverPiecesPerSheet = totalPiecesWithRotation
    piecesPositions = calculatePiecePositions(
      coverLength,
      coverWidth,
      numPiecesLengthwiseRotated,
      numPiecesWidthwiseRotated,
      true,
    )
  }
  coverUpsPerSheet = upsPerCoverPiece * coverPiecesPerSheet

  percentageSheetUsed =
    ((coverPiecesPerSheet * effectiveCoverLength * effectiveCoverWidth) /
      (paperLength * paperWidth)) *
    100

  return {
    coverPiecesPerSheet,
    coverUpsPerSheet,
    piecesPositions,
    percentageSheetUsed,
  }
}

function getWastageSheets(requiredSheets: number, wastageFactor: number) {
  let totalWastage: number
  if (requiredSheets <= 0) {
    totalWastage = 0
  } else if (requiredSheets <= 2100) {
    totalWastage = 150
  } else if (requiredSheets <= 4100) {
    totalWastage = 200
  } else if (requiredSheets <= 10200) {
    totalWastage = 300
  } else {
    totalWastage = requiredSheets * 0.025
  }

  return totalWastage * wastageFactor
}

export interface PaperPiece {
  length: number
  width: number
  x1: number
  y1: number
  x2: number
  y2: number
}

function calculatePiecePositions(
  pieceLength: number,
  pieceWidth: number,
  numPiecesLengthwise: number,
  numPiecesWidthwise: number,
  rotated: boolean,
): PaperPiece[] {
  const piecesPositions: PaperPiece[] = []

  if (!rotated) {
    for (let i = 0; i < numPiecesLengthwise; i++) {
      for (let j = 0; j < numPiecesWidthwise; j++) {
        const y1 = i * pieceLength
        const x1 = j * pieceWidth
        const y2 = y1 + pieceLength
        const x2 = x1 + pieceWidth

        piecesPositions.push({
          length: pieceLength,
          width: pieceWidth,
          x1,
          y1,
          x2,
          y2,
        })
      }
    }
  } else {
    for (let i = 0; i < numPiecesLengthwise; i++) {
      for (let j = 0; j < numPiecesWidthwise; j++) {
        const y1 = i * pieceWidth
        const x1 = j * pieceLength
        const y2 = y1 + pieceWidth
        const x2 = x1 + pieceLength
        piecesPositions.push({
          length: pieceWidth,
          width: pieceLength,
          x1,
          y1,
          x2,
          y2,
        })
      }
    }
  }

  return piecesPositions
}
