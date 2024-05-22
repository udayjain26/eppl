'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '../db'
import { variations } from '../db/schema'
import { revalidatePath } from 'next/cache'

export async function createVariation(title: string, estimateUuid: string) {
  //Check if user is authenticated: Throws an uncaught error. App Breaking Throw
  const user = auth()
  if (!user.userId) {
    throw new Error('User Unauthenitcated')
  }

  await db.insert(variations).values({
    variationTitle: title,
    estimateUuid: estimateUuid,
    createdBy: user.userId,
    updatedBy: user.userId,
  })

  revalidatePath(`/estimates/${estimateUuid}`)
}
