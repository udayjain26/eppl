export type VariationData = {
  uuid: string
  estimateUuid: string
  variationTitle: string | undefined
  variationNotes: string | undefined
  clientEnquiry: string | undefined
  variationQtysRates: {
    uuid: string
    variationUuid: string
    quantity: number
    rate: number
  }[]

  sizeName: string | undefined
  sizeLength: number | undefined
  sizeWidth: number | undefined

  closeSizeName: string | undefined
  closeSizeLength: number | undefined
  closeSizeWidth: number | undefined

  openSizeName: string | undefined
  openSizeLength: number | undefined
  openSizeWidth: number | undefined

  coverColors: number | undefined
  coverPages: number | undefined
  coverGrammage: number | undefined
  coverLamination: string | undefined
  coverPaperType: string | undefined

  textColors: number | undefined
  textPages: number | undefined
  textGrammage: number | undefined
  textLamination: string | undefined
  textPaperType: string | undefined

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
