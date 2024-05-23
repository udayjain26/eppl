'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { variations } from '../db/schema'
import { revalidatePath } from 'next/cache'
import { VariationFormState } from './types'
import { updateEstimateStage as updateEstimateOnVariationCreate } from '../estimates/actions'
import { eq } from 'drizzle-orm'
import { VariationFormSchema } from '@/schemas/variation-form-schema'

const Variation = VariationFormSchema.omit({
  uuid: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
})
export async function createVariation(estimateUuid: string) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  await db.insert(variations).values({
    estimateUuid: estimateUuid,
    createdBy: user.userId,
    updatedBy: user.userId,
  })

  await updateEstimateOnVariationCreate(estimateUuid)

  revalidatePath(`/estimates/${estimateUuid}`)
}

export async function saveVariation(
  previousState: VariationFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }
  const validatedFields = Variation.safeParse(Object.fromEntries(formData))

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      actionSuccess: false,
      message:
        'Failed to Create Variation. Make sure fields are filled out properly!',
    } as VariationFormState
  } else {
    try {
      await db
        .update(variations)
        .set({
          ...validatedFields.data,
          updatedBy: user.userId,
          updatedAt: new Date(),
        })
        .where(eq(variations.uuid, formData.get('uuid') as string))
    } catch (e) {
      return {
        actionSuccess: false,
        message:
          'Failed to Create Variation. Database Error. Please try again later!',
      } as VariationFormState
    }
  }

  revalidatePath(`/estimates/${formData.get('estimateUuid')}`)

  return {
    actionSuccess: true,
    message: 'Variation Saved Successfully!',
  } as VariationFormState
}
