'use server'

import { EstimateFormSchema } from '@/schemas/estimate-form-schema'
import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { estimates } from '../db/schema'
import { revalidatePath } from 'next/cache'
import { EstimateFormState } from './types'
import { eq } from 'drizzle-orm'

const Estimate = EstimateFormSchema.omit({
  uuid: true,
  estimateNumber: true,
  estimateStatus: true,
  estimateStage: true,
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

  const validatedFields = Estimate.safeParse(transformedData)
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

        createdBy: user.userId,
        updatedBy: user.userId,
      }
      await db.insert(estimates).values(dataWithUserIds)
    } catch (error) {
      return {
        actionSuccess: false,
        message: 'Failed to create estimate. Please try again later.',
      } as EstimateFormState
    }
  }

  revalidatePath('/estimates')

  return { actionSuccess: true } as EstimateFormState
}

export async function updateEstimateStage(estimateUuid: string) {
  // Fetch the estimate and its variations from the database
  const estimate = await db.query.estimates.findFirst({
    where: (estimate, { eq }) => eq(estimate.uuid, estimateUuid),
    with: { variations: true },
  })

  // If the estimate is not found, throw an error
  if (!estimate) {
    throw new Error('Estimate not found')
  }

  // Get the number of variations
  const variationsLength = estimate.variations.length

  // Check the current estimate stage and estimate status and update it if necessary
  if (
    estimate.estimateStage === 'Empty' &&
    estimate.estimateStatus === 'Not Started' &&
    variationsLength > 0
  ) {
    await db
      .update(estimates)
      .set({
        estimateStage: 'Drafting',
        estimateStatus: 'In Progress',
      })
      .where(eq(estimates.uuid, estimateUuid))
  } else if (estimate.estimateStage !== 'Drafting') {
    await updateEstimateStageToDrafting(estimateUuid)
  }
}

export async function updateEstimateStageToDrafting(estimateUuid: string) {
  try {
    await db
      .update(estimates)
      .set({
        estimateStage: 'Drafting',
      })
      .where(eq(estimates.uuid, estimateUuid))
    revalidatePath(`/estimates/${estimateUuid}`)
    return 'Success'
  } catch (e) {
    return 'Database Error'
  }
}

export async function canSetToNeedsRates(estimateUuid: string) {
  try {
    const estimateIsEmpty = await db.query.estimates
      .findFirst({
        where: (estimate, { eq }) => eq(estimate.uuid, estimateUuid),
      })
      .then((estimate) => estimate?.estimateStage === 'Empty')

    if (estimateIsEmpty) {
      return false
    }

    const canSetToNeedsRates = await db.query.variations
      .findMany({
        columns: {},
        with: { variationQtysRates: true },
        where: (variation, { eq }) => eq(variation.estimateUuid, estimateUuid),
      })
      .then((variations) => {
        return variations.every((variation) => {
          return variation.variationQtysRates.length > 0
        })
      })
    return canSetToNeedsRates
  } catch (e) {
    return false
  }
}

export async function updateEstimateStageToNeedsRates(estimateUuid: string) {
  try {
    if (await canSetToNeedsRates(estimateUuid)) {
      try {
        await db
          .update(estimates)
          .set({
            estimateStage: 'Needs Rates',
          })
          .where(eq(estimates.uuid, estimateUuid))
        revalidatePath(`/estimates/${estimateUuid}`)
        return 'Success'
      } catch (e) {
        return 'Database Error'
      }
    } else {
      return 'Variations Missing Quantities. Make sure to save all variations!'
    }
  } catch (e) {
    return 'Database Error'
  }
}

export async function updateEstimateStageToClientDecision(
  estimateUuid: string,
) {
  try {
    if (true) {
      try {
        await db
          .update(estimates)
          .set({
            estimateStage: 'Client Decision',
          })
          .where(eq(estimates.uuid, estimateUuid))
        revalidatePath(`/estimates/${estimateUuid}`)
        return 'Success'
      } catch (e) {
        return 'Database Error'
      }
    }
  } catch (e) {
    return 'Database Error'
  }
}
