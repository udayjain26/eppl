export type VariationData = {
  uuid: string
  estimateUuid: string
  variationTitle: string | null
  variationNotes: string | null
  variationQtysRates: {
    uuid: string
    variationUuid: string
    quantity: string
    rate: string
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
  }
  message?: string | null
  actionSuccess?: boolean | null
}
