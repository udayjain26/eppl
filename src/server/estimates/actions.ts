'use server'

import { EstimateFormSchema } from '@/schemas/estimate-schema'
import { auth } from '@clerk/nextjs/server'

const CreateEstimate = EstimateFormSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
})

function emptyStringToNullTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return null
  }
  return data
}

interface transformedData {
  [key: string]: any
}
export type EstimateFormState = {
  errors?: {
    clientUuid?: string[] | null
    contactUuid?: string[] | null
    estimateNumber?: string[] | null
    estimateTitle?: string[] | null
    estimateDescription?: string[] | null
    estimateDueDate?: string[] | null
    estimateQuatity?: string[] | null
    estimateRate?: string[] | null
    estimateTotal?: string[] | null
  }
  message?: string | null
  actionSuccess?: boolean | null
}

export async function createEstimate(
  previousState: EstimateFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  console.log('Creating Estimate with', formData)

  return {} as EstimateFormState
}
