export type EstimateFormState = {
  errors?: {
    clientUuid?: string[] | null
    contactUuid?: string[] | null
    estimateSalesRepUuid?: string[] | null
    estimateTitle?: string[] | null
    estimateDescription?: string[] | null
    estimateProductTypeUuid?: string[] | null
    estimateProductUuid?: string[] | null
  }
  message?: string | null
  actionSuccess?: boolean | null
}
