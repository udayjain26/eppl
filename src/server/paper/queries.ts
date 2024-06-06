'use server'

import { db } from '../db'
import { PaperData } from './types'

export async function getPaperData(): Promise<PaperData[]> {
  try {
    const data = (await db.query.paperMaster.findMany()).map((row) => ({
      ...row,
      paperLength: Number(row.paperLength),
      paperWidth: Number(row.paperWidth),
      paperGrammage: Number(row.paperGrammage),
      paperDefaultRate: Number(row.paperDefaultRate),
    })) as PaperData[]

    return data
  } catch (error) {
    console.error(error)
    throw new Error('Failed to fetch paper data')
  }
}
