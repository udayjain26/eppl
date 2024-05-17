'use server'

import { db } from '../db'

export async function getProductTypesWithProducts() {
  const data = await db.query.productsType.findMany({
    with: {
      products: true,
    },
  })
  console.log(data)
  return data
}
