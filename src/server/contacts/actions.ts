'use server'

import { ContactFormSchema } from '@/schemas/contact-form-schema'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { db } from '../db'
import { contacts } from '../db/schema'
import { date } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'

const Contact = ContactFormSchema.omit({
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

  const validatedFields = Contact.safeParse(transformedData)

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
        createdBy: user.userId,
        updatedBy: user.userId,
      }
      await db.insert(contacts).values(dataWithUserIds)
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Client.',
      } as ContactFormState
    }
  }
  revalidatePath('/clients')

  return { actionSuccess: true } as ContactFormState
}

export async function updateContact(
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

  const validatedFields = Contact.safeParse(transformedData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Failed to Update Contact. Make sure fields are filled out properly!',
    } as ContactFormState
  } else {
    try {
      // Add createdBy and updatedBy fields to the validated data
      const dataWithUserIds = {
        ...validatedFields.data,
        updatedBy: user.userId,
        updatedAt: new Date(),
      }
      await db
        .update(contacts)
        .set(dataWithUserIds)
        .where(eq(contacts.uuid, formData.get('uuid') as string))
    } catch (error) {
      return {
        message: 'Database Error: Failed to Update Client.',
      } as ContactFormState
    }
  }
  revalidatePath('/clients')

  return { actionSuccess: true } as ContactFormState
}
