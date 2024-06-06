export type PaperData = {
  uuid: string
  paperName: string
  paperLength: number
  paperWidth: number
  paperGrammage: number
  paperFinish: string
  paperType: string
  paperMake: string
  paperDefaultRate: number
  createdAt: Date
  createdBy: string
}

export type PaperFormState = {
  errors?: {}
  message?: string | null
  actionSuccess?: boolean | null
}
