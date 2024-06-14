'use server'

import { auth } from '@clerk/nextjs/server'
import { CalculationFormState } from './types'
import { error } from 'console'
import { CalculationFormSchema } from '@/schemas/calculation-form-schema'
import { variationCalculation } from '../db/schema'
import { db } from '../db'
import { eq } from 'drizzle-orm'

function emptyStringToUndefinedTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return undefined
  }
  return data
}

interface TransformedData {
  [key: string]: any
}

export async function createEmptyCalculationData(variationUuid: string) {
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenticated')
  }

  const dataWithUserIds = {
    userId: user.userId,
    variationUuid: variationUuid,
  }

  await db.insert(variationCalculation).values(dataWithUserIds)
}

export default async function saveCalculationData(
  previousState: CalculationFormState,
  formData: FormData,
) {
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenticated')
  }

  console.log('formData', formData)

  const transformedData: TransformedData = {}
  formData.forEach((value, key) => {
    transformedData[key] = emptyStringToUndefinedTransformer(value)
  })
  const validatedFields = CalculationFormSchema.safeParse(transformedData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Failed to save calculation. Make sure fields are filled out properly!',
      actionSuccess: false,
    }
  } else {
    const dataWithUserIds = {
      ...validatedFields.data,
      userId: user.userId,
    }
    console.log('dataWithUserIds', dataWithUserIds)

    const variationCalculationExists = await db
      .select()
      .from(variationCalculation)
      .where(
        eq(variationCalculation.variationUuid, dataWithUserIds.variationUuid),
      )
      .execute()

    if (variationCalculationExists.length > 0) {
      await db
        .update(variationCalculation)
        .set(dataWithUserIds)
        .where(
          eq(variationCalculation.variationUuid, dataWithUserIds.variationUuid),
        )
    } else {
      await db.insert(variationCalculation).values(dataWithUserIds)
    }
  }

  return {
    actionSuccess: true,
    errors: {},
    message: 'Calculation Saved Successfully!',
  }
}
