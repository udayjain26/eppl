'use server'

import { PaperData } from '../../paper/types'
import { VariationData } from '../../variations/types'

export interface PaperPiece {
  length: number
  width: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export async function calculateTotalCoverSheets(
  variationData?: VariationData,
  paperData?: PaperData,
  upsPerCoverPiece?: number,
  effectiveCoverLength?: number,
  effectiveCoverWidth?: number,
  grippers?: number,
  paperCostPerKg?: number,
  wastageFactor?: number,
): Promise<
  | {
      coverPiecesPerSheet: number
      coverUpsPerSheet: number
      piecesPositions: PaperPiece[]
      percentageSheetUsed: number
      requiredSheetsDataTable: {
        quantity: number
        requiredSheets: number
        totalWastage: number
        totalRequiredSheets: number
        totalWeight: number
        totalCost: number
        costPerPiece: number
      }[]
    }
  | undefined
> {
  if (
    !variationData ||
    !paperData ||
    !upsPerCoverPiece ||
    !paperCostPerKg ||
    !wastageFactor
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

    const requiredSheetsDataTable = requiredSheetsData.map((o) => {
      const paperLengthInM = paperData.paperLength / 1000
      const paperWidthInM = paperData.paperWidth / 1000
      const sheetWeightInKg =
        (paperLengthInM * paperWidthInM * paperData.paperGrammage) / 1000
      const weight = Math.ceil(sheetWeightInKg * o.totalRequiredSheets)
      const cost = weight * paperCostPerKg
      const costPerPiece = Math.ceil((cost / o.quantity) * 100) / 100

      return {
        ...o,
        totalWeight: weight,
        totalCost: cost,
        costPerPiece: costPerPiece,
      }
    })

    return {
      coverPiecesPerSheet,
      coverUpsPerSheet,
      piecesPositions,
      percentageSheetUsed,
      requiredSheetsDataTable,
    }
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
    const requiredSheets = Math.ceil(requiredCoversUps / upsPerSheet)
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

  return Math.ceil(totalWastage * wastageFactor)
}
