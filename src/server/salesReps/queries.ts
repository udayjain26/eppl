'use server'

import { db } from '../db'

export async function getSalesRepsData() {
  const data = await db.query.salesReps.findMany()
  return data
}
