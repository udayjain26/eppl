'use server'

import { PaperData } from '../../paper/types'
import { VariationData } from '../../variations/types'

export interface PaperPiece {
  length: number
  width: number
  x: number
  y: number
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
): Promise<
  | {
      coverPiecesPerSheet: number
      coverUpsPerSheet: number
      piecesPositions: PaperPiece[]
      percentageSheetUsed: number
    }
  | undefined
> {
  if (!variationData || !paperData || !upsPerCoverPiece) {
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

    const requiredSheets = await calculateRequiredSheets(
      variationData,
      coverUpsPerSheet,
      upsPerCoverPiece,
    )

    const requiredPaperWeight = calculateRequiredPaper(
      requiredSheets,
      paperData,
    )

    return {
      coverPiecesPerSheet,
      coverUpsPerSheet,
      piecesPositions,
      percentageSheetUsed,
    }
  }
}

export async function calculateRequiredPaper(
  requiredSheets: any,
  paperData: PaperData,
) {
  const weightData = requiredSheets.map((o: any) => {
    const paperLengthInM = paperData.paperLength / 1000
    const paperWidthInM = paperData.paperWidth / 1000
    const sheetWeightInKg =
      (paperLengthInM * paperWidthInM * paperData.paperGrammage) / 1000
    const weight = Math.ceil(sheetWeightInKg * o.totalRequiredSheets)

    return {
      ...o,
      weight: weight,
    }
  })
}

export async function calculateRequiredSheets(
  variationData: VariationData,
  upsPerSheet: number,
  upsPerCoverPiece: number,
) {
  //get all qts from each qty object
  const allQtysData = variationData.variationQtysRates.map((o) => o)

  //calculate required covers for each qty and modify the object
  const data = allQtysData.map((o) => {
    const requiredCoversUps = o.quantity * upsPerCoverPiece
    const requiredSheets = requiredCoversUps / upsPerSheet
    const totalWastage = getWastageSheets(requiredSheets)
    const totalSheets = requiredSheets + totalWastage

    return {
      quantity: o.quantity,
      requiredSheets: requiredSheets,
      totalWastage: totalWastage,
      totalRequiredSheets: totalSheets,
    }
  })
  console.log(data)
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
      coverWidth,
      coverLength,
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

  for (let i = 0; i < numPiecesLengthwise; i++) {
    for (let j = 0; j < numPiecesWidthwise; j++) {
      const x = i * (rotated ? pieceWidth : pieceLength)
      const y = j * (rotated ? pieceLength : pieceWidth)

      piecesPositions.push({
        length: rotated ? pieceWidth : pieceLength,
        width: rotated ? pieceLength : pieceWidth,
        x,
        y,
        x2: x + (rotated ? pieceWidth : pieceLength),
        y2: y + (rotated ? pieceLength : pieceWidth),
      })
    }
  }

  return piecesPositions
}

function getWastageSheets(requiredSheets: number) {
  let totalWastage: number
  if (requiredSheets <= 0) {
    totalWastage = 0
  } else if (requiredSheets <= 2000) {
    totalWastage = 150
  } else if (requiredSheets <= 4000) {
    totalWastage = 200
  } else if (requiredSheets <= 10000) {
    totalWastage = 300
  } else {
    totalWastage = requiredSheets * 0.025
  }

  return totalWastage
}
