'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { variations, variationQtysRates } from '../db/schema'
import { revalidatePath } from 'next/cache'
import { VariationFormState } from './types'
import { updateEstimateStage as updateEstimateOnVariationCreate } from '../estimates/actions'
import { eq } from 'drizzle-orm'
import { VariationFormSchema } from '@/schemas/variation-form-schema'

const Variation = VariationFormSchema.omit({
  // uuid: true,
})

function emptyStringToNullTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return undefined
  }
  return data
}

interface transformedData {
  [key: string]: any
}

type variationQtyRate = {
  // uuid: string | undefined
  variationUuid: string
  quantity: string
  rate: string
}

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

  //Extract the variationQtysRates from the formData
  try {
  } catch (e) {
    return {
      actionSuccess: false,
      message:
        'Failed to save Variation. Make sure fields are filled out properly!',
    } as VariationFormState
  }
  const variationQtysRatesData: variationQtyRate[] = []

  formData.forEach((value, key) => {
    if (key.startsWith('variationQtysRates')) {
      const [_, index, field] = key.split('.')
      const indexKey = parseInt(index)
      if (!variationQtysRatesData[indexKey]) {
        variationQtysRatesData[indexKey] = {
          variationUuid: formData.get(`uuid`) as string,
          quantity: '',
          rate: '',
        }
      }

      if (field === 'quantity') {
        variationQtysRatesData[indexKey].quantity = value as string
      }
      if (field === 'rate') {
        variationQtysRatesData[indexKey].rate = value as string
      }
    }
  })

  //Transform the formData to a format that can be validated by the schema
  const transformedData: transformedData = {}
  formData.forEach((value, key) => {
    transformedData[key] = emptyStringToNullTransformer(value)
  })

  transformedData['variationQtysRates'] = variationQtysRatesData

  console.log(transformedData)

  const validatedFields = Variation.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      actionSuccess: false,
      message:
        'Failed to save Variation. Make sure fields are filled out properly!',
    } as VariationFormState
  } else {
    try {
      await db.transaction(async (trx) => {
        // Update the variation
        await trx
          .update(variations)
          .set({
            ...validatedFields.data,
            updatedBy: user.userId,
            updatedAt: new Date(),
          })
          .where(eq(variations.uuid, formData.get('uuid') as string))

        // Delete existing variationQtysRates for this variationUuid
        await trx
          .delete(variationQtysRates)
          .where(
            eq(
              variationQtysRates.variationUuid,
              formData.get('uuid') as string,
            ),
          )

        // Insert new variationQtysRates
        for (const qtyRate of variationQtysRatesData) {
          await trx.insert(variationQtysRates).values({
            variationUuid: qtyRate.variationUuid,
            quantity: qtyRate.quantity.toString(),
            rate: qtyRate.rate.toString(),
          })
        }
      })
    } catch (e) {
      return {
        actionSuccess: false,
        message:
          'Failed to save Variation. Database Error. Please try again later!',
      } as VariationFormState
    }
  }

  revalidatePath(`/estimates/${formData.get('estimateUuid')}`)

  return {
    actionSuccess: true,
    message: 'Variation Saved Successfully!',
  } as VariationFormState
}

export async function deleteVariation(variationUuid: string) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  console.log(variationUuid)

  const deletedVariation = await db
    .delete(variations)
    .where(eq(variations.uuid, variationUuid))
    .returning()

  revalidatePath(`/estimates/${deletedVariation[0].estimateUuid}`)

  if (deletedVariation.length === 0) {
    return {
      actionSuccess: false,
      message: 'Failed to delete Variation. Variation not found!',
    } as VariationFormState
  } else {
    return {
      actionSuccess: true,
      message: `Deleted ${deletedVariation[0].variationTitle ? deletedVariation[0].variationTitle : 'empty'} variation successfully!`,
    } as VariationFormState
  }
}
