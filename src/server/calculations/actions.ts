'use server'

import { auth } from '@clerk/nextjs/server'
import { CalculationFormState } from './types'
import { error } from 'console'
import { CalculationFormSchema } from '@/schemas/calculation-form-schema'
import { variationCalculation, variationQtysRates } from '../db/schema'
import { db } from '../db'
import { eq } from 'drizzle-orm'
import { TotalCostDetails } from '@/app/estimates/[id]/_components/calculation-components/total-calculation'
import { revalidatePath } from 'next/cache'

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
  totalCostDataTable: TotalCostDetails | undefined,
) {
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenticated')
  }

  console.log('PLEASE', totalCostDataTable)

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
    await db.transaction(async (trx) => {
      await trx
        .delete(variationQtysRates)
        .where(
          eq(
            variationQtysRates.variationUuid,
            formData.get('variationUuid') as string,
          ),
        )

      // Insert new variationQtysRates
      for (const qtyRate of totalCostDataTable || []) {
        await trx.insert(variationQtysRates).values({
          variationUuid: formData.get('variationUuid') as string,
          quantity: qtyRate.jobQuantity.toString(),
          rate: qtyRate.sellingPrice.toString(),
        })
      }
    })
  }

  revalidatePath('/estimates/[id]', 'page')

  return {
    actionSuccess: true,
    errors: {},
    message: 'Calculation Saved Successfully!',
  }
}
