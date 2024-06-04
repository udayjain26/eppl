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
      coverRate?: number
    }
  | undefined
