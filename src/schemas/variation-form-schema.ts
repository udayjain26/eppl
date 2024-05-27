import { z } from 'zod'

export const VariationFormSchema = z.object({
  uuid: z.string().uuid(),
  estimateUuid: z.string().uuid(),
  variationTitle: z.string({ message: 'Variation title is required!' }).trim(),
  variationNotes: z.string().trim().nullable(),
  variationQtysRates: z
    .array(
      z.object({
        uuid: z.string().uuid().optional(),
        variationUuid: z.string().uuid(),
        quantity: z.number().int().nonnegative(),
        rate: z.number().nonnegative(),
      }),
    )
    .optional(),

  // createdBy: z.string().uuid(),
  // updatedBy: z.string().uuid(),
  // createdAt: z.date(),
  // updatedAt: z.date(),
})
