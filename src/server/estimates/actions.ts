'use server'

import { EstimateFormSchema } from '@/schemas/estimate-form-schema'
import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { estimateRevisionStageEnum, estimates } from '../db/schema'
import { date } from 'drizzle-orm/mysql-core'
import { revalidatePath } from 'next/cache'

const CreateEstimate = EstimateFormSchema.omit({
  uuid: true,
  estimateNumber: true,
  currentRevision: true,
  estimateStatus: true,
  estimateRevisionStage: true,
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
    estimateTitle?: string[] | null
    estimateDescription?: string[] | null
    estimateProductTypeUuid?: string[] | null
    estimateProductUuid?: string[] | null
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
  const transformedData: transformedData = {}
  formData.forEach((value, key) => {
    transformedData[key] = emptyStringToNullTransformer(value)
  })
  const validatedFields = CreateEstimate.safeParse(transformedData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      actionSuccess: false,
      message:
        'Failed to Create Contact. Make sure fields are filled out properly!',
    } as EstimateFormState
  } else {
    try {
      const dataWithUserIds = {
        ...validatedFields.data,
        // clientUuid: previousState.clientUuid,
        estimateRevisionStage: estimateRevisionStageEnum.enumValues.find(
          (value) => {
            value === 'New'
          },
        ),
        createdBy: user.userId,
        updatedBy: user.userId,
      }
      await db.insert(estimates).values(dataWithUserIds)
    } catch (error) {
      console.error(error)
      return {
        actionSuccess: false,
        message: 'Failed to create estimate. Please try again later.',
      } as EstimateFormState
    }
    // Add createdBy and updatedBy fields to the validated data
  }

  revalidatePath('/estimate')

  return { actionSuccess: true } as EstimateFormState
}
