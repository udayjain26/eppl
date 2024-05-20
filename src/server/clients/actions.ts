'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { clients } from '../db/schema'

import { ClientFormSchema } from '@/schemas/client-form-schema'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'

//Form Schema for creating a client in the database
//Nullable represents optional form fields from the user's pov

//Can ignore uuid and created and updated as it is autogenerated
const CreateClient = ClientFormSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
})

const CreateClientBasic = ClientFormSchema.pick({
  clientFullName: true,
  clientNickName: true,
})

function emptyStringToNullTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return null
  }
  return data
}

// function onStringToBooleanTransformer(data: any) {
//   if (typeof data === 'string' && data === 'on') {
//     return true
//   }
//   return false
// }

interface transformedData {
  [key: string]: any
}

export type ClientFormState = {
  errors?: {
    clientFullName?: string[]
    clientNickName?: string[]
    gstin?: string[]
    isNewClient?: string[]
    clientAddressLine1?: string[]
    clientAddressLine2?: string[]
    clientAddressCity?: string[]
    clientAddressState?: string[]
    clientAddressPincode?: string[]
    clientWebsite?: string[]
    clientIndustry?: string[]
  }
  message?: string | null
  actionSuccess?: boolean | null
}

export async function createClient(
  previousState: ClientFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  //Transforming the form data to remove empty strings
  const transformedData: transformedData = {}
  var numFields = 0
  formData.forEach((value, key) => {
    numFields += 1
    transformedData[key] = emptyStringToNullTransformer(value)
  })
  console.log(transformedData, numFields)
  //BANDAID solution to getting only first 2 fields
  const validatedFields =
    numFields === 2
      ? CreateClientBasic.safeParse(transformedData)
      : CreateClient.safeParse(transformedData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Failed to Create Client. Make sure fields are filled out properly!',
    } as ClientFormState
  } else {
    try {
      // Add createdBy and updatedBy fields to the validated data
      const dataWithUserIds = {
        ...validatedFields.data,
        createdBy: user.userId,
        updatedBy: user.userId,
      }
      await db.insert(clients).values(dataWithUserIds)
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Client.',
      } as ClientFormState
    }
  }
  revalidatePath('/clients')

  return { actionSuccess: true } as ClientFormState
}

export async function updateClient(
  previousState: ClientFormState,
  formData: FormData,
) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }
  //Transforming the form data to remove empty strings
  const transformedData: transformedData = {}
  var numFields = 0
  formData.forEach((value, key) => {
    numFields += 1
    transformedData[key] = emptyStringToNullTransformer(value)
  })
  //BANDAID solution to getting only first 2 fields
  const validatedFields =
    numFields === 2
      ? CreateClientBasic.safeParse(transformedData)
      : CreateClient.safeParse(transformedData)

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        'Failed to Update Client. Make sure fields are filled out properly!',
    } as ClientFormState
  } else {
    try {
      // Add createdBy and updatedBy fields to the validated data
      const dataWithUserIds = {
        ...validatedFields.data,
        updatedBy: user.userId,
        updatedAt: new Date(),
      }
      // await db.insert(clients).values(dataWithUserIds)
      const result = await db
        .update(clients)
        .set(dataWithUserIds)
        .where(eq(clients.uuid, formData.get('uuid') as string))
    } catch (error) {
      return {
        message: 'Database Error: Failed to Update Client.',
      } as ClientFormState
    }
  }
  revalidatePath(`/clients/${transformedData.uuid}`)

  return { actionSuccess: true } as ClientFormState

  // return { actionSuccess: true } as ClientFormState
}
