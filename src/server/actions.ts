'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from './db'
import { clients } from './db/schema'

import { ClientFormSchema } from '@/schemas/form-schemas'

//Form Schema for creating a client in the database
//Nullable represents optional form fields from the user's pov

//Can ignore uuid and created at field as it is autogenerated
const CreateClient = ClientFormSchema.omit({
  uuid: true,
  createdAt: true,
  updatedAt: true,
})

function emptyStringToNullTransformer(data: any) {
  if (typeof data === 'string' && data === '') {
    return null
  }
  return data
}

function onStringToBooleanTransformer(data: any) {
  if (typeof data === 'string' && data === 'on') {
    return true
  }
  return false
}

interface transformedData {
  [key: string]: any
}

export type FormState = {
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
  }
  message?: string | null
}

export async function createClient(
  previousState: FormState,
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
    if (key === 'isNewClient') {
      transformedData[key] = onStringToBooleanTransformer(value)
      return
    }
    transformedData[key] = emptyStringToNullTransformer(value)
  })

  //Validating the form fields
  const validatedFields = CreateClient.safeParse(transformedData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to Create Client',
    } as FormState
  } else {
    try {
      await db.insert(clients).values(validatedFields.data)
    } catch (error) {
      return {
        message: 'Database Error: Failed to Create Client.',
      } as FormState
    }
  }
  return { message: 'Client Created' } as FormState
}
