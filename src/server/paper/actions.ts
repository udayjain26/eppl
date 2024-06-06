'use server'

import { auth } from '@clerk/nextjs/server'
import { PaperFormState } from './types'
import { PaperFormSchema } from '@/schemas/paper-form-schema'
import { db } from '../db'
import { paperMaster } from '../db/schema'
import { revalidatePath } from 'next/cache'

const CreatePaper = PaperFormSchema.omit({})

function emptyStringToUndefinedTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return undefined
  }
  return data
}

interface transformedData {
  [key: string]: any
}

export async function createPaper(
  previousState: PaperFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  const transformedData: transformedData = {}
  formData.forEach((value, key) => {
    transformedData[key] = emptyStringToUndefinedTransformer(value)
  })

  const validatedFields = CreatePaper.safeParse(transformedData)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      actionSuccess: false,
      message:
        'Failed to Create New Paper Type. Make sure fields are filled out properly!',
    } as PaperFormState
  } else {
    try {
      const dataWithUserIds = {
        ...validatedFields.data,
        createdBy: user.userId,
        paperLength: String(validatedFields.data.paperLength),
        paperWidth: String(validatedFields.data.paperWidth),
        paperGrammage: String(validatedFields.data.paperGrammage),
        paperDefaultRate: String(validatedFields.data.paperDefaultRate),
      }
      await db.insert(paperMaster).values(dataWithUserIds)
    } catch (error) {
      return {
        actionSuccess: false,
        message: 'Failed to create paper. Please try again later.',
      } as PaperFormState
    }
  }

  revalidatePath(`/estimates/${formData.get('estimateUuid')}`)
  return {
    actionSuccess: true,
    message: 'Paper Created Successfully!',
  } as PaperFormState
}
