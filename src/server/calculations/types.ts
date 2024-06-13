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
      textGutters?: number
      textBleed?: number
      textGrippers?: number
      textPaper?: string
      textPaperRate?: number
      textWastageFactor?: number
      textPlateRate?: number
      textPrintingRate?: number
      textWorkingLength?: number
      textWorkingWidth?: number
    }
  | undefined
