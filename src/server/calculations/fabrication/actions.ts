'use server'

import { CoverCostData } from '@/app/estimates/[id]/_components/calculation-components/cover-calculation'
import {
  FabricationCostData,
  FabricationCostDataDict,
} from '@/app/estimates/[id]/_components/calculation-components/fabrication-calculation'
import { TextCostData } from '@/app/estimates/[id]/_components/calculation-components/text-calculation'
import coverEmbossing from '@/app/estimates/[id]/_components/specification-components/cover-embossing'
import CoverEmbossing from '@/app/estimates/[id]/_components/specification-components/cover-embossing'
import {
  catalogBrochureBindingTypes,
  coatings,
  dieCuttingTypes,
  embossingTypes,
  gummingTypes,
  leafingTypes,
  makingProcesses,
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
  secondaryTextCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): Promise<FabricationCostData> {
  let fabricationForms = 0
  let primaryFabricationForms =
    textCostDataTable?.textForms.totalFormsFB +
    textCostDataTable?.textForms.totalForms2Ups / 2 +
    textCostDataTable?.textForms.totalForms4Ups / 4 +
    textCostDataTable?.textForms.totalForms8Ups / 8

  let secondaryFabricationForms =
    secondaryTextCostDataTable?.textForms.totalFormsFB +
    secondaryTextCostDataTable?.textForms.totalForms2Ups / 2 +
    secondaryTextCostDataTable?.textForms.totalForms4Ups / 4 +
    secondaryTextCostDataTable?.textForms.totalForms8Ups / 8

  if (typeof textCostDataTable?.pagesPerSheet === 'number') {
    if (textCostDataTable?.pagesPerSheet > 16) {
      primaryFabricationForms = primaryFabricationForms * 2
    }
  }
  if (typeof secondaryTextCostDataTable?.pagesPerSheet === 'number') {
    if (secondaryTextCostDataTable?.pagesPerSheet > 16) {
      secondaryFabricationForms = secondaryFabricationForms * 2
    }
  }

  if (!primaryFabricationForms && !secondaryFabricationForms) {
    fabricationForms = 0
  } else {
    fabricationForms = !Number.isNaN(secondaryFabricationForms)
      ? Number(primaryFabricationForms) + Number(secondaryFabricationForms)
      : Number(primaryFabricationForms)
  }

  const fabricationCostDataDict = getFabricationCostsDict(
    variationData,
    textCostDataTable,
    secondaryTextCostDataTable,
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
  secondaryTextCostDataTable: TextCostData,
  coverCostDataTable: CoverCostData,
): FabricationCostDataDict[] {
  const data = variationData.variationQtysRates.map((o) => {
    const jobQuantity = o.quantity
    let coverTotalSheets = 0

    let primaryTextSheets =
      textCostDataTable?.textCostDataDict.find(
        (row) => row.jobQuantity === jobQuantity,
      )?.totalSheets || 0

    let secondaryTextSheets =
      secondaryTextCostDataTable?.textCostDataDict.find(
        (row) => row.jobQuantity === jobQuantity,
      )?.totalSheets || 0

    let textTotalSheets = primaryTextSheets + secondaryTextSheets

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

    const coverFabricationSheets = coverTotalSheets

    const coverWorkingLength = coverCostDataTable?.coverSheetLength
    const coverWorkingWidth = coverCostDataTable?.coverSheetWidth

    const textWorkingLength = textCostDataTable?.textWorkingLength
    const textWorkingWidth = textCostDataTable?.textWorkingWidth

    const foldingCost = getFoldingCost(textCostDataTable, fabricationSheets)
    const gatheringCost = getGatheringCost(fabricationSheets)

    let perfectBindingCost: number | undefined
    let sewnAndPerfect: number | undefined
    let sidePinAndPerfect: number | undefined
    let centrePin: number | undefined
    let coverUV: number | undefined
    let textUV: number | undefined
    let coverFoiling: number | undefined
    let coverEmbossing: number | undefined
    let vdp: number | undefined
    let gumming: number | undefined
    let coverCoating: number | undefined
    let textCoating: number | undefined
    let coverDieCutting: number | undefined
    let textDieCutting: number | undefined
    let making: number | undefined

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
    else if (variationData.binding === 'Centre Pin' && fabricationSheets > 0) {
      const centrePinCharges = catalogBrochureBindingTypes.find(
        (row) => row.label === 'Centre Pin',
      )?.rate!
      centrePin = (centrePinCharges * fabricationSheets) / 1000
      if (centrePin / jobQuantity < 1) {
        centrePin = 1 * jobQuantity
      }
    }

    if (
      typeof variationData.coverUV === 'string' &&
      variationData.coverUV !== 'None'
    ) {
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

    if (typeof variationData.vdp === 'string' && variationData.vdp !== 'None') {
      const vdpCharges = vdpTypes.find(
        (row) => row.label === variationData.vdp,
      )?.rate!

      if (vdpCharges === undefined) {
        vdp = 0
      }

      vdp = vdpCharges * jobQuantity
    }

    if (
      typeof variationData.gummingType === 'string' &&
      variationData.gummingType !== 'None'
    ) {
      gumming = getGummingCost(jobQuantity, variationData)
    }

    if (
      typeof variationData.textUV === 'string' &&
      variationData.textUV !== 'None'
    ) {
      let textUVCharges: number
      let fixedCharges: number
      if (textWorkingLength <= 508 && textWorkingWidth <= 762) {
        textUVCharges = uvTypes.find(
          (row) => row.label === variationData.textUV,
        )?.smallSheetRate!

        fixedCharges = uvTypes.find(
          (row) => row.label === variationData.textUV,
        )?.smallFixedCharge!
      } else {
        textUVCharges = uvTypes.find(
          (row) => row.label === variationData.textUV,
        )?.bigSheetRate!

        fixedCharges = uvTypes.find(
          (row) => row.label === variationData.textUV,
        )?.bigFixedCharge!
      }

      if (textUVCharges === undefined || fixedCharges === undefined) {
        textUV = 0
        fixedCharges = 0
      }

      textUV = textUVCharges * fabricationSheets + fixedCharges
    }

    if (
      typeof variationData.coverCoating === 'string' &&
      variationData.coverCoating !== 'None'
    ) {
      coverCoating = getCoatingCost(
        coverTotalSheets,
        coverWorkingLength,
        coverWorkingWidth,
        variationData,
        'cover',
      )
    }

    if (
      typeof variationData.makingProcess === 'string' &&
      variationData.makingProcess !== 'None'
    ) {
      making = getMakingCost(jobQuantity, variationData)
    }

    if (
      typeof variationData.textCoating === 'string' &&
      variationData.textCoating !== 'None'
    ) {
      textCoating = getCoatingCost(
        textTotalSheets ? textTotalSheets : 0,
        textWorkingLength,
        textWorkingWidth,
        variationData,
        'text',
      )
    }

    if (
      typeof variationData.coverFoiling === 'string' &&
      variationData.coverFoiling !== 'None'
    ) {
      coverFoiling = getFoilingCost(
        coverTotalSheets,
        coverWorkingLength,
        coverWorkingWidth,
        variationData,
      )
    }
    if (
      typeof variationData.coverEmbossing === 'string' &&
      variationData.coverEmbossing !== 'None'
    ) {
      coverEmbossing = getEmbossingCost(coverTotalSheets, variationData)
    }

    if (
      typeof variationData.coverDieCutting === 'string' &&
      variationData.coverDieCutting !== 'None'
    ) {
      coverDieCutting = getDieCuttingCost(
        jobQuantity,
        variationData,
        coverFabricationSheets,
        'Cover',
      )
    }

    if (
      typeof variationData.textDieCutting === 'string' &&
      variationData.textDieCutting !== 'None'
    ) {
      textDieCutting = getDieCuttingCost(
        jobQuantity,
        variationData,
        fabricationSheets,
        'Text',
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
      (textUV || 0) +
      (coverCoating || 0) +
      (textCoating || 0) +
      (coverEmbossing || 0) +
      (vdp || 0) +
      (gumming || 0) +
      (coverFoiling || 0) +
      (coverDieCutting || 0) +
      (textDieCutting || 0) +
      (making || 0)

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
      textUV: textUV ? Number(textUV.toFixed(0)) : undefined,
      coverFoiling: coverFoiling ? Number(coverFoiling.toFixed(0)) : undefined,
      coverEmbossing: coverEmbossing
        ? Number(coverEmbossing.toFixed(0))
        : undefined,
      coverDieCutting: coverDieCutting
        ? Number(coverDieCutting.toFixed(0))
        : undefined,
      textDieCutting: textDieCutting
        ? Number(textDieCutting.toFixed(0))
        : undefined,

      making: making ? Number(making.toFixed(0)) : undefined,

      vdp: vdp ? Number(vdp.toFixed(0)) : undefined,
      gumming: gumming ? Number(gumming.toFixed(0)) : undefined,
      totalCost: Number(totalCost.toFixed(0)),
      costPerPiece: Number(costPerPiece.toFixed(2)),
    }
  })
  return data
}

function getMakingCost(jobQuantity: number, variationData: VariationData) {
  let makingCost = 0
  let makingCharges = makingProcesses.find(
    (row) => row.label === variationData.makingProcess,
  )?.rate

  if (makingCharges === undefined) {
    return 0
  }

  makingCost = (makingCharges * jobQuantity) / 1000

  return makingCost
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

function getDieCuttingCost(
  qty: number,
  variationData: VariationData,
  fabricationSheets: number,
  dieCuttingType: string,
) {
  let dieCuttingCost = 0
  let dieCuttingCharges = 0
  let dieCuttingFrame = 0

  if (dieCuttingType === 'Cover') {
    dieCuttingCharges =
      dieCuttingTypes.find((row) => row.label === variationData.coverDieCutting)
        ?.rate || 350
    dieCuttingFrame =
      dieCuttingTypes.find((row) => row.label === variationData.coverDieCutting)
        ?.dieCost || 1000
  } else if (dieCuttingType === 'Text') {
    dieCuttingCharges =
      dieCuttingTypes.find((row) => row.label === variationData.textDieCutting)
        ?.rate || 350
    dieCuttingFrame =
      dieCuttingTypes.find((row) => row.label === variationData.textDieCutting)
        ?.dieCost || 1000
  } else {
    dieCuttingFrame = 0
    dieCuttingCharges = 0
  }

  if (dieCuttingCharges === undefined || dieCuttingFrame === undefined) {
    return 0
  }

  dieCuttingCost =
    dieCuttingFrame + (dieCuttingCharges / 1000) * fabricationSheets

  return dieCuttingCost
}

function getCoatingCost(
  fabricationSheets: number,
  coverWorkingLength: number | undefined,
  coverWorkingWidth: number | undefined,
  variationData: VariationData,
  coatingOn: string,
) {
  let coatingCost = 0
  let coatingCharges = 0
  if (coatingOn === 'cover') {
    coatingCharges = coatings.find(
      (row) => row.label === variationData.coverCoating,
    )?.rate!
  } else if (coatingOn === 'text') {
    coatingCharges = coatings.find(
      (row) => row.label === variationData.textCoating,
    )?.rate!
  }

  if (coatingCharges === undefined) {
    return 0
  }
  const sheetLengthInM = coverWorkingLength ? coverWorkingLength / 1000 : 0
  const sheetWidthInM = coverWorkingWidth ? coverWorkingWidth / 1000 : 0
  coatingCost =
    coatingCharges * fabricationSheets * sheetLengthInM * sheetWidthInM

  return coatingCost
}

function getFoilingCost(
  fabricationSheets: number,
  coverWorkingLength: number | undefined,
  coverWorkingWidth: number | undefined,
  variationData: VariationData,
) {
  let coverFoilingCost = 0
  let foilingFixedCharges = leafingTypes.find(
    (row) => row.label === variationData.coverFoiling,
  )?.blockRate
  let foilingCharges = leafingTypes.find(
    (row) => row.label === variationData.coverFoiling,
  )?.rate

  if (foilingCharges === undefined || foilingFixedCharges === undefined) {
    return 0
  }
  const sheetLengthInM = coverWorkingLength ? coverWorkingLength / 1000 : 0
  const sheetWidthInM = coverWorkingWidth ? coverWorkingWidth / 1000 : 0
  coverFoilingCost =
    foilingCharges * fabricationSheets * sheetLengthInM * sheetWidthInM +
    foilingFixedCharges
  return coverFoilingCost
}

function getEmbossingCost(
  fabricationSheets: number,

  variationData: VariationData,
) {
  let coverFoilingCost = 0
  let embossingFixedCharges = embossingTypes.find(
    (row) => row.label === variationData.coverEmbossing,
  )?.blockRate
  let embossingCharges = embossingTypes.find(
    (row) => row.label === variationData.coverEmbossing,
  )?.rate

  if (embossingCharges === undefined || embossingFixedCharges === undefined) {
    return 0
  }

  coverFoilingCost =
    (embossingCharges * fabricationSheets) / 1000 + embossingFixedCharges
  return coverFoilingCost
}
