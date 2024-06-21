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

  closeSizeName: string | undefined
  closeSizeLength: number | undefined
  closeSizeWidth: number | undefined

  openSizeName: string | undefined
  openSizeLength: number | undefined
  openSizeWidth: number | undefined

  coverFrontColors: number | undefined
  coverBackColors: number | undefined
  coverPages: number | undefined
  coverGrammage: number | undefined
  coverLamination: string | undefined
  coverPaperType: string | undefined

  textColors: number | undefined
  textPages: number | undefined
  textGrammage: number | undefined
  textLamination: string | undefined
  textPaperType: string | undefined

  binding: string | undefined
  // catalogBrochureBinding: string | undefined
  coverUV: string | undefined
  vdp: string | undefined

  packagingType: string | undefined
  gummingType: string | undefined
  textCoating: string | undefined
  coverCoating: string | undefined

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
