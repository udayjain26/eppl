'use server'

import { auth } from '@clerk/nextjs/server'
import { getEstimateById } from '../estimates/queries'
import { db } from '../db'
import {
  estimateRevisionStageEnum,
  estimateStatusEnum,
  estimates,
  revisions,
} from '../db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function createRevision(estimateUuid: string): Promise<boolean> {
  try {
    const user = auth()
    if (!user.userId) {
      throw new Error('User Unauthenticated')
    }
    // create a new revision for an estimate
    console.log('Creating a new revision for estimate:', estimateUuid)
    const estimate = await getEstimateById(estimateUuid)

    if (!estimate) {
      console.log('Failed to find estimate:', estimateUuid)
      return false
    }

    const currentRevisionNumber = estimate.currentRevision
    const updatedRevisionNumber = currentRevisionNumber + 1
    const newRevision = {
      data: {
        estimateUuid: estimateUuid,
        revisionNumber: updatedRevisionNumber,
        createdBy: user.userId,
        updatedBy: user.userId,
      },
    }

    const updatedEstimate = {
      ...estimate,
      currentRevision: updatedRevisionNumber,
      estimateStatus: estimateStatusEnum.enumValues.find(
        (value) => value === 'In Progress',
      ),
      estimateRevisionStage: estimateRevisionStageEnum.enumValues.find(
        (value) => value === 'Drafting',
      ),
    }

    await db.insert(revisions).values(newRevision.data)
    const result = await db
      .update(estimates)
      .set(updatedEstimate)
      .where(eq(estimates.uuid, estimateUuid))

    revalidatePath(`/estimates/${estimateUuid}`)
    return true
  } catch (e) {
    console.log('Failed to create estiamte:', e)
    return false
  }
  return true
}
