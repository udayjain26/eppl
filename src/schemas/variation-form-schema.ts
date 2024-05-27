import { z } from 'zod'

export const VariationFormSchema = z.object({
  uuid: z.string().uuid(),
  estimateUuid: z.string().uuid(),
  variationTitle: z.string({ message: 'Variation title is required!' }).trim(),
  variationNotes: z.string().trim().optional(),
  variationQtysRates: z
    .array(
      z.object({
        uuid: z.string().uuid().optional(),
        variationUuid: z.string().uuid(),
        quantity: z.coerce
          .number({ message: 'Quantity must be a number!' })
          .int()
          .nonnegative(),
        rate: z.coerce
          .number({ message: 'Rate must be a number!' })
          .nonnegative(),
      }),
    )
    .optional(),

  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
