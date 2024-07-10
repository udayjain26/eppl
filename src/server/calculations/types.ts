export type CalculationFormState = {
  errors?: {}
  message?: string | null
  actionSuccess?: boolean | null
}

export type VariationCalculationData =
  | {
      variationUuid: string
      coverSpine?: number
      coverBleed?: number
      coverGrippers?: number
      coverPaper?: string
      coverPaperRate?: number
      coverWastageFactor?: number
      coverPlateRate?: number
      coverPrintingRate?: number
      coverPrintingType?: string
      coverPlateRateFactor?: number
      coverPrintingRateFactor?: number
      coverWorkingLength?: number
      coverWorkingWidth?: number
      coverPlateSize?: string
      textGutters?: number
      textBleed?: number
      textGrippers?: number
      textPaper?: string
      textPaperRate?: number
      textWastageFactor?: number
      textPlateRateFactor?: number
      textPrintingRateFactor?: number
      textPlateRate?: number
      textPrintingRate?: number
      textWorkingLength?: number
      textWorkingWidth?: number
      textPlateSize?: string
      secondaryTextGutters?: number
      secondaryTextBleed?: number
      secondaryTextGrippers?: number
      secondaryTextPaper?: string
      secondaryTextPaperRate?: number
      secondaryTextWastageFactor?: number
      secondaryTextPlateRateFactor?: number
      secondaryTextPrintingRateFactor?: number
      secondaryTextPlateRate?: number
      secondaryTextPrintingRate?: number
      secondaryTextWorkingLength?: number
      secondaryTextWorkingWidth?: number
      secondaryTextPlateSize?: string
      boardRate?: number
      profitPercentage: number
      discountPercentage: number
      addedHardcoverLength: number
      addedHardcoverWidth: number
    }
  | undefined
