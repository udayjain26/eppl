export type VariationData = {
  uuid: string
  estimateUuid: string
  variationTitle: string | undefined
  variationNotes: string | undefined
  variationQtysRates: {
    uuid: string
    variationUuid: string
    quantity: number
    rate: number
  }[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
}

export type VariationFormState = {
  errors?: {
    variationTitle?: string[] | null
    variationNotes?: string[] | null
    variationQtysRates?: string[] | null
  }
  message?: string | null
  actionSuccess?: boolean | null
}
