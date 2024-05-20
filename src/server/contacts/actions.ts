'use server'

import { ContactFormSchema } from '@/schemas/contact-form-schema'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '../db'
import { contacts } from '../db/schema'
import { date } from 'drizzle-orm/pg-core'

const CreateContact = ContactFormSchema.omit({
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
export type ContactFormState = {
  errors?: {
    contactFirstName?: string[] | null
    contactLastName?: string[] | null
    contactEmail?: string[] | null
    contactMobile?: string[] | null
    contactDesignation?: string[] | null
  }
  message?: string | null
  actionSuccess?: boolean | null
}

export async function createContact(
  previousState: ContactFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  //Transforming the form data to remove empty strings
  const transformedData: transformedData = {}
  formData.forEach((value, key) => {
    transformedData[key] = emptyStringToNullTransformer(value)
  })

  const validatedFields = CreateContact.safeParse(transformedData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Failed to Create Contact. Make sure fields are filled out properly!',
    } as ContactFormState
  } else {
    try {
      // Add createdBy and updatedBy fields to the validated data
      const dataWithUserIds = {
        ...validatedFields.data,
        // clientUuid: previousState.clientUuid,
        createdBy: user.userId,
        updatedBy: user.userId,
      }
      await db.insert(contacts).values(dataWithUserIds)
    } catch (error) {
      console.error(error)
      return {
        message: 'Database Error: Failed to Create Client.',
      } as ContactFormState
    }
  }
  revalidatePath('/clients')

  return { actionSuccess: true } as ContactFormState
}
